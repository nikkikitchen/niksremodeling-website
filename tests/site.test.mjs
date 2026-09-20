import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');
const app = read('app.js');
function runtime(page = '') {
  const storage = new Map();
  const elements = { len: { value: '12' }, wid: { value: '10' }, waste: { value: '1.15' }, matres: {}, count: {} };
  const document = { body: { dataset: { page }, innerHTML: '' }, title: '',
    getElementById: id => elements[id], querySelectorAll: () => [elements.count],
    addEventListener: (_, fn) => fn() };
  const context = vm.createContext({ document, alert() {}, localStorage: {
    getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value)
  }});
  vm.runInContext(app, context);
  return { context, document, elements, storage };
}
test('approved homepage sections and all local links resolve', () => {
  const html = read('index.html');
  assert.match(html, /Everything You Need to Build a Space You Love\./);
  assert.match(html, /EVERYTHING UNDER ONE ROOF/);
  for (const file of readdirSync(root).filter(name => name.endsWith('.html'))) {
    for (const match of read(file).matchAll(/(?:href|src)="([^"?]+)(?:\?[^\"]*)?"/g)) {
      const url = match[1];
      if (url.startsWith('#')) assert.ok(html.includes(`id="${url.slice(1)}"`), url);
      else if (url.startsWith('/')) assert.ok(existsSync(new URL(url === '/' ? 'index.html' : url.slice(1), root)), url);
    }
  }
});
test('NR artwork matches the intact original, not the truncated commit embedding', () => {
  const logo = readFileSync(new URL('assets/nr-logo.png', root));
  assert.equal(createHash('sha256').update(logo).digest('hex'),
    '16934363dc48a6166b5cb140b75e954c686b2855c7b3c8465bbb1b9759b19ddf');
  assert.equal(logo.readUInt32BE(16), 175);
  assert.equal(logo.readUInt32BE(20), 201);
});
test('every category and utility page renders with shared branding', () => {
  for (const page of ['materials', 'supplies', 'tools', 'furniture', 'appliances', 'cabinets', 'installation', 'calculators', 'cart']) {
    const { document } = runtime(page);
    assert.match(document.body.innerHTML, /NIK'S REMODELING/);
    assert.match(document.body.innerHTML, /EVERYTHING UNDER ONE ROOF/);
    assert.ok(document.title.includes("Nik's Remodeling"));
  }
});
test('calculator handles quantities and invalid dimensions', () => {
  const { context, elements } = runtime('calculators');
  vm.runInContext('calcMaterial()', context);
  assert.match(elements.matres.textContent, /138 sq\. ft\./);
  elements.len.value = '-1';
  vm.runInContext('calcMaterial()', context);
  assert.equal(elements.matres.textContent, 'Enter valid room dimensions.');
});
test('cart persists additions, combines quantities, and removes items', () => {
  const { context, document, elements, storage } = runtime('cart');
  vm.runInContext("addItem('Porcelain Tile'); addItem('Porcelain Tile'); renderCart()", context);
  assert.equal(JSON.parse(storage.get('nr-cart'))[0].qty, 2);
  assert.equal(elements.count.textContent, 2);
  assert.match(document.body.innerHTML, /Porcelain Tile/);
  vm.runInContext('removeCart(0)', context);
  assert.equal(elements.count.textContent, 0);
  assert.match(document.body.innerHTML, /Your project cart is empty/);
});
