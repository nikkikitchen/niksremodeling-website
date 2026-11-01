import {cj} from './commerce.js';

// Fallback for an ambiguous or missing CJ basic freight rate.
// Construct only from verified CJ product metadata; never invent a SKU,
// shipping weight, dimension, logistics category, or shipping fee.
function positiveNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function nonnegativeNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
function freightFromDetailedRows(rows) {
  if (!Array.isArray(rows)) return null;
  const quotes = [];
  for (const r of rows) {
    if (!r || (r.errorEn && String(r.errorEn).trim()) || (r.error && String(r.error).trim())) continue;
    const total = positiveNumber(r.totalPostageFee);
    const wrapped = positiveNumber(r.wrapPostage);
    const discounted = positiveNumber(r.discountFee);
    const postage = positiveNumber(r.postage);
    const tax = nonnegativeNumber(r.taxesFee) ?? 0;
    const clearance = nonnegativeNumber(r.clearanceOperationFee) ?? 0;
    const tariff = nonnegativeNumber(r.tariff) ?? 0;
    // Only a confirmed positive supplier freight value can be presented.
    const freight = total ?? ((wrapped ?? discounted ?? postage) === null
      ? null : (wrapped ?? discounted ?? postage) + tax + clearance + tariff);
    const name = r.option?.enName || r.option?.cnName || r.channel?.enName;
    if (freight !== null && Number.isFinite(freight) && freight > 0 &&
        typeof name === 'string' && name.trim()) {
      quotes.push({freight, rate:{logisticName:name.trim(), logisticAging:r.arrivalTime || r.option?.arrivalTime || null}});
    }
  }
  quotes.sort((a,b)=>a.freight-b.freight);
  return quotes[0] || null;
}

export async function quoteDetailedFreight(env, lines, zip) {
  if (!/^\d{5}$/.test(String(zip)) || !Array.isArray(lines) || !lines.length) return null;
  const skuList = [], freightTrialSkuList = [];
  const prop = new Set();
  let grams = 0, cubicCm = 0, goodsAmount = 0, hasVolume = true;
  for (const line of lines) {
    const {product,variant}=line;
    const qty=Number(line.quantity);
    const sku=variant?.variantSku;
    const w=positiveNumber(variant?.variantWeight);
    const volumeMm3=positiveNumber(variant?.variantVolume);
    const cats=product?.productProEnSet;
    if (!Number.isSafeInteger(qty) || qty<1 || qty>99 ||
        typeof sku!=='string' || !sku.trim() || !w ||
        !Array.isArray(cats) || !cats.length || !cats.every(x=>typeof x==='string'&&x.trim()) ||
        !positiveNumber(variant?.variantSellPrice)) return null;
    const volume=volumeMm3 ? volumeMm3/1000 : null;
    if (volume === null) hasVolume=false;
    for (const category of cats) prop.add(category);
    skuList.push(sku);
    freightTrialSkuList.push({
      sku, vid:String(variant.vid), skuQuantity:qty, skuWeight:w,
      ...(volume!==null?{skuVolume:volume}:{}),
      productPropList:cats
    });
    grams+=w*qty;
    if (volume!==null) cubicCm+=volume*qty;
    goodsAmount+=Number(variant.variantSellPrice)*qty;
  }
  if (!Number.isFinite(grams) || grams<=0 ||
      !Number.isFinite(goodsAmount) || goodsAmount<=0 ||
      !prop.size) return null;
  const body={
    reqDTOS:[{
      srcAreaCode:'US', destAreaCode:'US', zip:String(zip),
      weight:Math.ceil(grams), productProp:[...prop],
      skuList, freightTrialSkuList,
      totalGoodsAmount:Math.round(goodsAmount*100)/100,
      ...(hasVolume&&cubicCm>0?{volume:Math.ceil(cubicCm*100)/100}:{})
    }]
  };
  try {
    const rates=await cj(env,'/logistic/freightCalculateTip',body);
    return freightFromDetailedRows(rates);
  } catch {
    // Fallback failure is not "free shipping": leave payment blocked.
    return null;
  }
}
