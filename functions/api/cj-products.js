// Preview-only CJ catalog search. Does NOT offer checkout or expose supplier cost.
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
let tokenCache = { accessToken: '', validUntil: 0 };

async function accessToken(env) {
  if (env.CJ_ACCESS_TOKEN) return String(env.CJ_ACCESS_TOKEN);
  if (!env.CJ_API_KEY) return null;
  if (tokenCache.accessToken && Date.now() < tokenCache.validUntil) return tokenCache.accessToken;

  const response = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: String(env.CJ_API_KEY) })
  });
  if (!response.ok) throw new Error('CJ authentication HTTP error');
  const result = await response.json();
  if (!result?.result || !result?.data?.accessToken) throw new Error('CJ authentication refused');
  // Authentication calls are rate-limited; cache inside each running isolate.
  const expiry = Date.parse(result.data.accessTokenExpiryDate);
  tokenCache = {
    accessToken: result.data.accessToken,
    validUntil: Number.isFinite(expiry) ? Math.min(Date.now() + 86400000, expiry - 3600000) : Date.now() + 3600000
  };
  return tokenCache.accessToken;
}

export async function onRequestGet({ request, env = {} }) {
  const url = new URL(request.url);
  const keyword = String(url.searchParams.get('keyword') || '').trim();
  const page = Math.max(1, Math.min(50, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1));
  if (keyword.length < 2 || keyword.length > 80) {
    return Response.json({ error: 'Search must contain 2–80 characters.' }, { status: 400 });
  }
  if (!env.CJ_ACCESS_TOKEN && !env.CJ_API_KEY) {
    return Response.json({ error: 'Supplier connection not configured.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const token = await accessToken(env);
    const endpoint = new URL(`${CJ_BASE}/product/listV2`);
    endpoint.searchParams.set('keyWord', keyword);
    endpoint.searchParams.set('page', String(page));
    endpoint.searchParams.set('size', '12');
    const response = await fetch(endpoint, { headers: { 'CJ-Access-Token': token } });
    if (!response.ok) throw new Error('CJ catalog HTTP error');
    const result = await response.json();
    if (!result?.result || !result?.data) throw new Error('CJ catalog query failed');

    const entries = Array.isArray(result.data.content) ? result.data.content : [];
    const products = entries.flatMap(entry => Array.isArray(entry.productList) ? entry.productList : []);
    const safeProducts = products.slice(0, 12).filter(p => p && p.id && p.nameEn).map(p => ({
      id: String(p.id),
      sku: String(p.sku || ''),
      name: String(p.nameEn),
      image: String(p.bigImage || ''),
      category: String(p.threeCategoryName || p.twoCategoryName || p.oneCategoryName || ''),
      stock: Number.isFinite(Number(p.warehouseInventoryNum)) ? Math.max(0, Number(p.warehouseInventoryNum)) : null,
      pricing: 'Shipping quote and 35% markup required before checkout'
    }));
    return Response.json({ products: safeProducts, page, totalPages: result.data.totalPages ?? null, checkoutEnabled: false }, {
      headers: { 'Cache-Control': 'public, max-age=120', 'X-Content-Type-Options': 'nosniff' }
    });
  } catch {
    // Don't leak API keys, tokens, or supplier error bodies.
    return Response.json({ error: 'Supplier catalog unavailable. Try again later.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
