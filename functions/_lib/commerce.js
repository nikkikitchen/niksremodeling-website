const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
let tokenCache = { accessToken: '', validUntil: 0 };

export async function accessToken(env) {
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


export async function cj(env, path, body) {
 const token=await accessToken(env); if(!token)throw new Error('Supplier not configured');
 // CJ has previously rate-limited bursts of product requests. One short,
 // bounded retry handles transient throttling/5xx without making every quote
 // wait or inventing a shipping rate. Never retry authorization/invalid input.
 const options={method:body?'POST':'GET',headers:{'CJ-Access-Token':token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})};
 for(let attempt=0;attempt<2;attempt++){
  let retryable=false;
  try {
   const r=await fetch(CJ_BASE+path,options);
   const data=await r.json();
   if(r.ok&&(data.result||data.success)&&data.data)return data.data;
   retryable=r.status===429||r.status>=500||['1600200','402','406','429'].includes(String(data?.code??''));
   if(!retryable)throw new Error('Supplier unavailable');
  } catch(error) {
   if(error?.message==='Supplier unavailable')throw error;
   // A network timeout can also be transient; never keep retrying endlessly.
   retryable=true;
  }
  if(attempt===1)throw new Error('Supplier temporarily unavailable or rate limited');
  if(retryable)await new Promise(resolve=>setTimeout(resolve,450));
 }
 throw new Error('Supplier unavailable');
}
export const PRODUCT_ID='1963146233541074945';
export function retailCents(cost){if(!Number.isFinite(Number(cost))||Number(cost)<=0)throw new Error('Price unavailable');return Math.ceil(Number(cost)*135);}
export async function square(env,path,body){
 const token=env.SQUARE_ACCESS_TOKEN||env.TOKEN;if(!token)throw new Error('Payments not configured');
 const r=await fetch('https://connect.squareup.com'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Square-Version':'2026-09-16','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok||data.errors)throw new Error('Square '+(data.errors?.[0]?.code||'unavailable'));return data;
}

/** Only count physical CJ-warehouse inventory in the USA, never factory/in-transit stock. */
export function usCjWarehouseUnits(rows) {
 return (Array.isArray(rows)?rows:[]).reduce((n,row)=>{
  if(row?.countryCode!=='US')return n;
  const units=Number(row.cjInventory??row.cjInventoryNum??0);
  return n+(Number.isFinite(units)&&units>0?Math.floor(units):0);
 },0);
}
export function usVariantStock(inventory) {
 const byVariant=new Map();
 for(const row of inventory?.variantInventories||[]) {
  const units=usCjWarehouseUnits(row.inventory);
  if(row.vid&&units>0)byVariant.set(String(row.vid),units);
 }
 return byVariant;
}
