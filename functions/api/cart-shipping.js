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
    const unavailable = [];
    let units = 0;
    // Inspect all products so one failed item doesn't hide the rest.
    // Display names are never used for inventory, cost, or pricing.
    for (const line of lines) {
      const displayName = String(raw.find(x=>String(x.productId)===line.productId
        && String(x.variantId)===line.variantId)?.name||'Product '+line.productId).slice(0,120);
      try {
        const product = await cj(env, '/product/query?pid=' + encodeURIComponent(line.productId) + '&countryCode=US');
        const variant = (product.variants || []).find(v => String(v.vid) === line.variantId);
        if (!variant || !(Number(variant.variantSellPrice) > 0))
          throw Error('Option is no longer available from the supplier');
        const inventory = await cj(env, '/product/stock/queryByVid?vid=' + encodeURIComponent(line.variantId));
        if (usCjWarehouseUnits(inventory) < line.quantity)
          throw Error('Insufficient confirmed U.S. warehouse stock');
        details.push({product, variant, quantity:line.quantity, displayName, productId:line.productId});
        units += line.quantity;
      } catch(e) {
        unavailable.push({name:displayName, reason:e.message==='Supplier unavailable'
          ? 'Supplier data unavailable' : e.message});
      }
    }
    if(unavailable.length)
      return Response.json({error:'Shipping cannot be completed until supplier availability is verified for: '+
        unavailable.map(x=>x.name).join('; ')+'.', unavailable},
        {status:503,headers});

    // CJ quotes each product independently more reliably than mixed shipments.
    // For multiple lines, verify freight for EVERY line and total it. This
    // avoids a rejected mixed-product quote holding up an otherwise valid cart.
    // Never use a partial rate or invent free shipping.
    let quoteMode = details.length > 1 ? 'separate-lines' : 'single-line';
    let shippingMethod = null;
    let freight = 0;
    const methods = new Set();
    const unquoted = [];
    for (const detail of details) {
      const result = await freightQuote(env, zip,
        [{vid:detail.variant.vid, quantity:detail.quantity}], [detail]);
      if (!result || !(Number(result.freight) > 0)) {
        unquoted.push({name:detail.displayName,reason:'CJ has not provided a verified freight rate'});
        continue;
      }
      freight += result.freight;
      if (result.rate?.logisticName) methods.add(result.rate.logisticName);
    }
    if (unquoted.length)
      return Response.json({error:'CJ could not confirm shipping to '+zip+' for: '+
        unquoted.map(x=>x.name).join('; ')+'. No partial shipping total was added.',
        unavailable:unquoted}, {status:503,headers});
    shippingMethod = methods.size === 1 ? [...methods][0] : null;
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
