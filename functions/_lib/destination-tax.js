// Resolve a verified destination-address general sales-tax rate.
// Tax service reports a general rate; this does not establish nexus or exemptions.
// This checkout is limited to ordinary taxable retail merchandise.
const validRate=n=>Number.isFinite(n)&&n>=0&&n<=0.25;
export async function destinationSalesTax(env,{zip,address,city,state}){
 if(!/^\d{5}$/.test(String(zip||''))||
    !/^[-\w .#'/]{3,150}$/.test(String(address||''))||
    !/^[A-Za-z .'-]{2,80}$/.test(String(city||''))||
    !/^[A-Z]{2}$/.test(String(state||'').toUpperCase()))
  throw Error('Enter a complete street address, city, state and ZIP for final tax verification.');
 if(!env.ZIPTAX_API_KEY)throw Error('Destination sales-tax service needs configuration.');
 const url=new URL('https://api.zip-tax.com/request/v60');
 url.searchParams.set('address',[address,city,state,zip,'USA'].join(', '));
 const response=await fetch(url,{headers:{'X-API-KEY':String(env.ZIPTAX_API_KEY),Accept:'application/json'},signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error('Destination tax lookup is temporarily unavailable.');
 const data=await response.json();
 if(Number(data?.metadata?.response?.code??data?.rCode)!==100)
  throw Error('Destination tax provider could not confirm that address.');
 const matches=(data.taxSummaries||[]).filter(x=>x.taxType==='SALES_TAX'&&validRate(Number(x.rate)));
 if(matches.length!==1||!data.addressDetail?.normalizedAddress||
    !new RegExp('\\b'+zip+'(?:-\\d{4})?\\b').test(data.addressDetail.normalizedAddress))
  throw Error('Delivery address or tax rate could not be verified.');
 const rate=Number(matches[0].rate);
 // Fail closed if provider cannot establish whether freight is taxable.
 if(!['Y','N'].includes(data.shipping?.taxable))
  throw Error('Shipping tax treatment is not confirmed.');
 return {rate,ratePercent:String(Math.round(rate*1000000)/10000),shippingTaxable:data.shipping.taxable==='Y'};
}
