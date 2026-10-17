import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

async function loadPagesFunction(name) {
  const source = readFileSync(new URL(`../functions/api/${name}.js`, import.meta.url), 'utf8');
  return import('data:text/javascript,' + encodeURIComponent(source));
}

const { onRequestGet: status } = await loadPagesFunction('integration-status');
const { onRequestGet: search } = await loadPagesFunction('cj-products');

function req(keyword) {
  return new Request(`https://example.test/api/cj-products?keyword=${encodeURIComponent(keyword)}`);
}

test('integration status reveals only configuration booleans, not secrets', async () => {
  const response = await status({ env: { CJ_API_KEY: 'cj-hidden', TOKEN: 'square-hidden' } });
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.equal(body.includes('cj-hidden'), false);
  assert.equal(body.includes('square-hidden'), false);
  const result = JSON.parse(body);
  assert.equal(result.cj.credentialsPresent, true);
  assert.equal(result.square.credentialsPresent, true);
  assert.equal(result.square.checkoutEnabled, false);
});

test('supplier search fails closed when unconfigured or invalid', async () => {
  assert.equal((await search({ request: req('a'), env: {} })).status, 400);
  assert.equal((await search({ request: req('faucet'), env: {} })).status, 503);
});

test('supplier search caches auth and does not expose supplier costs', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('getAccessToken')) {
      return Response.json({ result: true, data: { accessToken: 'cj-secret', accessTokenExpiryDate: '2099-01-01T00:00:00Z' } });
    }
    return Response.json({ result: true, data: { totalPages: 1, content: [{ productList: [{ id: 'pid-1', sku: 'SKU-1', nameEn: 'Bathroom faucet', bigImage: 'https://example.com/img.jpg', sellPrice: '10.00', nowPrice: '9.00', warehouseInventoryNum: 4 }] }] } });
  };
  try {
    const first = await search({ request: req('faucet'), env: { CJ_API_KEY: 'cj-private' } });
    assert.equal(first.status, 200);
    const body = await first.text();
    assert.equal(body.includes('cj-secret'), false);
    assert.equal(body.includes('cj-private'), false);
    assert.equal(body.includes('10.00'), false);
    assert.equal(body.includes('9.00'), false);
    assert.equal(JSON.parse(body).products[0].name, 'Bathroom faucet');
    assert.equal(JSON.parse(body).checkoutEnabled, false);
    await search({ request: req('vanity'), env: { CJ_API_KEY: 'cj-private' } });
    assert.equal(calls.filter(x => x.includes('getAccessToken')).length, 1);
    assert.equal(calls.filter(x => x.includes('listV2')).length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
