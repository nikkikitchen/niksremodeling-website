// ZIP preview: highest supplier-verified general sales-tax rate overlapping the ZIP.
// Full address: location-specific GENERAL sales-tax estimate. Never charge tax here.
// A rate lookup alone does not determine nexus, exemptions, product taxability,
// sourcing, or final transaction tax. Payment remains disabled until reverified.
const NO_STORE={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const moneyValid = n=>Number.isSafeInteger(n)&&n>=0&&n<=100000000;
const validRate = n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=0.25;
const rateMoney = (cents,rate)=>Math.round(cents*rate);
const failure=(message,status=503)=>Response.json({error:message,estimateOnly:true},{status,headers:NO_STORE});
export async function onRequestPost({request,env={}}) {
  const origin=request.headers.get('Origin');
  if(origin&&origin!==new URL(request.url).origin)
    return failure('Please request a tax estimate from our website.',403);
  let input;
  try { input=await request.json(); } catch {return failure('Invalid tax estimate request.',400);}
  const zip=String(input?.zip||'').trim();
  const merchandiseCents=Number(input?.merchandiseCents);
  const shippingCents=Number(input?.shippingCents??0);
  if(!/^\d{5}$/.test(zip)||!moneyValid(merchandiseCents)||!moneyValid(shippingCents))
    return failure('Enter a five-digit ZIP code and a valid merchandise total.',400);
  const address=String(input?.address||'').trim();
  const city=String(input?.city||'').trim();
  const state=String(input?.state||'').trim().toUpperCase();
  const fullAddress=address.length>0;
  if(address.length>150||city.length>80||!(!fullAddress||(/^[-\w .#'/]+$/.test(address)&&/^[A-Za-z .'-]{2,80}$/.test(city)&&/^[A-Z]{2}$/.test(state)))||
    (!fullAddress&&(city||state)))
    return failure('Enter a complete U.S. delivery street, city, state, and ZIP code.',400);
  if(!env.ZIPTAX_API_KEY)
    return failure('Location-based tax estimates are not configured yet. Tax will be confirmed before payment.');
  const url=new URL('https://api.zip-tax.com/request/v60');
  if(fullAddress)url.searchParams.set('address',[address,city,state,zip,'USA'].join(', '));
  else url.searchParams.set('postalcode',zip);
  try {
    const response=await fetch(url,{headers:{'X-API-KEY':String(env.ZIPTAX_API_KEY),'Accept':'application/json'},signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw Error('Tax provider unavailable');
    const data=await response.json();
    const code=Number(data?.metadata?.response?.code??data?.rCode);
    if(code!==100)throw Error('Tax provider did not confirm the location');
    let rate,shippingTaxable=false,mode='zip-upper-estimate';
    if(fullAddress){
      const matches=(data.taxSummaries||[]).filter(x=>x.taxType==='SALES_TAX'&&validRate(Number(x.rate)));
      if(matches.length!==1||!data.addressDetail?.normalizedAddress)
        throw Error('Delivery address could not be verified');
      // Do not accept a geocoded address in another ZIP.
      if(!new RegExp('\\b'+zip+'(?:-\\d{4})?\\b').test(data.addressDetail.normalizedAddress))
        throw Error('The delivery address does not match the ZIP code');
      rate=Number(matches[0].rate);
      shippingTaxable=data.shipping?.taxable==='Y';
      mode='address-estimate';
    } else {
      const rates=(data.results||[]).map(x=>Number(x.taxSales)).filter(validRate);
      if(!rates.length||rates.length!==data.results.length)
        throw Error('ZIP tax rates are not verified');
      rate=Math.max(...rates);
      // Conservative preview only; taxability is confirmed at address lookup.
      shippingTaxable=true;
    }
    const taxableCents=merchandiseCents+(shippingTaxable?shippingCents:0);
    return Response.json({
      zip,mode,ratePercent:Math.round(rate*10000)/100,
      taxCents:rateMoney(taxableCents,rate),shippingIncludedInEstimate:shippingTaxable,
      estimateOnly:true,
      note:fullAddress
       ?'Address-based general sales-tax estimate only. Product taxability, business collection requirements, and final tax must be confirmed before payment.'
       :'Conservative ZIP-code estimate, using the highest listed general sales-tax rate. Exact delivery address and taxability may reduce the amount.'
    },{headers:NO_STORE});
  }catch {
    return failure('A verified tax rate is unavailable for this location. Tax will be confirmed before payment.');
  }
}
