import {quoteDetailedFreight} from '../_lib/detailed-freight.mjs';
import {selectConfirmedFreight, UNCONFIRMED_SHIPPING_MESSAGE} from '../_lib/verified-freight.mjs';
import {cj, retailCents, usCjWarehouseUnits} from '../_lib/commerce.js';

// Quote freight for the exact cart quantities, using verified CJ U.S. stock.
// This returns an estimate only; it never initiates checkout or a supplier order.
export async function onRequestPost({request, env}) {
  const headers = {'Cache-Control':'no-store'};
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({error:'Please request delivery from our website.'}, {status:403, headers});
  let input;
  try {input = await request.json();} catch {
    return Response.json({error:'Invalid delivery request.'}, {status:400, headers});
  }
  const zip = String(input?.zip || '');
  const raw = input?.items;
  if (!/^\d{5}$/.test(zip) || !Array.isArray(raw) || !raw.length || raw.length > 12)
    return Response.json({error:'Enter a five-digit ZIP code and select up to 12 product lines.'}, {status:400, headers});
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
    const old = merged.get(key);
    if (old) {
      old.quantity += quantity;
      if (old.quantity > 99)
        return Response.json({error:'Maximum quantity is 99 per item.'}, {status:400, headers});
    } else merged.set(key, {productId, variantId, quantity});
  }
  try {
    const lines = [...merged.values()];
    const freightProducts = [];
    const detailedLines = [];
    let units = 0;
    for (const line of lines) {
      const product = await cj(env, '/product/query?pid=' + encodeURIComponent(line.productId) + '&countryCode=US');
      const variant = (product.variants || []).find(v => String(v.vid) === line.variantId);
      if (!variant || !(Number(variant.variantSellPrice) > 0))
        throw Error('One product option is no longer available.');
      const inventory = await cj(env, '/product/stock/queryByVid?vid=' + encodeURIComponent(line.variantId));
      if (usCjWarehouseUnits(inventory) < line.quantity)
        throw Error('There is not enough confirmed U.S. warehouse stock for one of these items.');
      freightProducts.push({vid:line.variantId, quantity:line.quantity});
      detailedLines.push({product,variant,quantity:line.quantity});
      units += line.quantity;
    }
    const rates = await cj(env, '/logistic/freightCalculate', {
      startCountryCode:'US', endCountryCode:'US', zip, products:freightProducts
    });
    const confirmed = selectConfirmedFreight(rates)
      || await quoteDetailedFreight(env,detailedLines,zip);
    if (!confirmed) throw Error(UNCONFIRMED_SHIPPING_MESSAGE);
    const {rate:best, freight} = confirmed;
    // Match the existing store quote policy: merchandise and freight are
    // retail-priced consistently, and the customer covers supplier freight.
    const deliveryCents = retailCents(freight);
    return Response.json({
      zip, deliveryCents, units, productLines:lines.length,
      shippingMethod: best.logisticName || null,
      transitDays: best.logisticAging || null,
      estimateOnly:true
    }, {headers});
  } catch (error) {
    const reason = error.message === 'Supplier unavailable' || error.message === 'Supplier not configured'
      ? 'The supplier could not confirm shipping right now.'
      : error.message || 'Unable to check shipping right now.';
    return Response.json({error:reason}, {status:503, headers});
  }
}
