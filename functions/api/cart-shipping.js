import {quoteDetailedFreight} from '../_lib/detailed-freight.mjs';
import {selectConfirmedFreight, UNCONFIRMED_SHIPPING_MESSAGE} from '../_lib/verified-freight.mjs';
import {cj, retailCents, usCjWarehouseUnits} from '../_lib/commerce.js';

// One delivery ZIP for the full cart. Ask CJ for a combined freight rate first.
// When the supplier cannot price mixed products in one request, obtain an
// individually verified rate for EVERY product line (at its actual quantity)
// and sum those supplier rates. Never silently omit a line or treat an
// ambiguous supplier zero as free shipping. This is a quote, not checkout.
async function freightQuote(env, zip, products, details) {
  try {
    const rates = await cj(env, '/logistic/freightCalculate', {
      startCountryCode: 'US', endCountryCode: 'US', zip, products
    });
    const verified = selectConfirmedFreight(rates);
    if (verified) return verified;
  } catch {
    // CJ may reject a mixed-product shipment. Try its detailed calculator.
  }
  return quoteDetailedFreight(env, details, zip);
}

export async function onRequestPost({request, env}) {
  const headers = {'Cache-Control': 'no-store'};
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({error:'Please request delivery from our website.'}, {status:403, headers});
  let input;
  try {input = await request.json();} catch {
    return Response.json({error:'Invalid delivery request.'}, {status:400, headers});
  }
  const zip = String(input?.zip || '').trim();
  const raw = input?.items;
  if (!/^\d{5}$/.test(zip) || !Array.isArray(raw) || !raw.length || raw.length > 50)
    return Response.json({error:'Enter one five-digit ZIP code and select up to 50 product lines.'}, {status:400, headers});

  const merged = new Map();
  for (const item of raw) {
    const productId = String(item?.productId || '');
    const variantId = String(item?.variantId || '');
    const quantity = Number(item?.quantity);
    if (!/^\d{8,30}$/.test(productId) || !/^[-\w]{8,64}$/.test(variantId) ||
        !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99 ||
        ['2003348098417340418','2003347794848272385'].includes(productId))
      return Response.json({error:'Please recheck the products and quantities in your cart.'}, {status:400, headers});
    const key = productId + ':' + variantId;
    const previous = merged.get(key);
    if (previous) {
      previous.quantity += quantity;
      if (previous.quantity > 99)
        return Response.json({error:'Maximum quantity is 99 per product option.'}, {status:400, headers});
    } else merged.set(key, {productId, variantId, quantity});
  }
  try {
    const lines = [...merged.values()];
    const details = [];
    let units = 0;
    for (const line of lines) {
      const product = await cj(env, '/product/query?pid=' + encodeURIComponent(line.productId) + '&countryCode=US');
      const variant = (product.variants || []).find(v => String(v.vid) === line.variantId);
      if (!variant || !(Number(variant.variantSellPrice) > 0))
        throw Error('One product option is no longer available.');
      const inventory = await cj(env, '/product/stock/queryByVid?vid=' + encodeURIComponent(line.variantId));
      if (usCjWarehouseUnits(inventory) < line.quantity)
        throw Error('There is not enough confirmed U.S. warehouse stock for one of these items.');
      details.push({product, variant, quantity:line.quantity});
      units += line.quantity;
    }

    // First ask CJ to price the full cart together (possibly a lower rate).
    const allProducts = details.map(({variant,quantity}) => ({vid:variant.vid, quantity}));
    let quote = await freightQuote(env, zip, allProducts, details);
    let quoteMode = 'combined';
    let shippingMethod = quote?.rate?.logisticName || null;
    let freight = quote?.freight;

    if (!quote && details.length > 1) {
      // Fallback: one ZIP entry, but supplier-confirmed freight for each
      // distinct product line. Fail closed if even one line is unavailable.
      quoteMode = 'separate-lines';
      freight = 0;
      const methods = new Set();
      for (const detail of details) {
        const result = await freightQuote(env, zip,
          [{vid:detail.variant.vid, quantity:detail.quantity}], [detail]);
        if (!result || !(Number(result.freight) > 0))
          throw Error(UNCONFIRMED_SHIPPING_MESSAGE);
        freight += result.freight;
        if (result.rate?.logisticName) methods.add(result.rate.logisticName);
      }
      shippingMethod = methods.size === 1 ? [...methods][0] : null;
    }
    if (!Number.isFinite(freight) || freight <= 0)
      throw Error(UNCONFIRMED_SHIPPING_MESSAGE);

    // Apply our existing 35% retail markup to confirmed supplier freight ONCE.
    const deliveryCents = retailCents(freight);
    return Response.json({
      zip, deliveryCents, units, productLines:lines.length,
      shippingMethod, quoteMode, estimateOnly:true
    }, {headers});
  } catch (error) {
    const reason = error.message === 'Supplier unavailable' || error.message === 'Supplier not configured'
      ? 'The supplier could not confirm shipping right now.'
      : error.message || 'Unable to check shipping right now.';
    return Response.json({error:reason}, {status:503, headers});
  }
}
