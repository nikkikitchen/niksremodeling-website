const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
// Reuse authentication across concurrent requests in one isolate. Authentication
// itself is rate limited; a separate login for every tile can block checkout.
const tokenCaches=new Map();
export async function accessToken(env) {
 if(env.CJ_ACCESS_TOKEN)return String(env.CJ_ACCESS_TOKEN);
 const apiKey=String(env.CJ_API_KEY||'');if(!apiKey)return null;
 let entry=tokenCaches.get(apiKey);
 if(entry?.token&&Date.now()<entry.until)return entry.token;
 if(entry?.pending)return entry.pending;
 entry={};tokenCaches.set(apiKey,entry);
 entry.pending=(async()=>{
  const response=await fetch(CJ_BASE+'/authentication/getAccessToken',{
   method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiKey}),signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw new Error('CJ authentication HTTP error');
  const result=await response.json();
  if(!result?.result||!result?.data?.accessToken)throw new Error('CJ authentication refused');
  const expiry=Date.parse(result.data.accessTokenExpiryDate);
  entry.token=result.data.accessToken;
  entry.until=Number.isFinite(expiry)?Math.min(Date.now()+86400000,expiry-3600000):Date.now()+3600000;
  return entry.token;
 })();
 try{return await entry.pending;}finally{entry.pending=null;if(!entry.token)tokenCaches.delete(apiKey);}
}


export async function cj(env, path, body) {
 const token=await accessToken(env); if(!token)throw new Error('Supplier not configured');
 // CJ has previously rate-limited bursts of product requests. One short,
 // bounded retry handles transient throttling/5xx without making every quote
 // wait or inventing a shipping rate. Never retry authorization/invalid input.
 const options={signal:AbortSignal.timeout(12000),method:body?'POST':'GET',headers:{'CJ-Access-Token':token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})};
 for(let attempt=0;attempt<2;attempt++){
  let retryable=false;
  let diagnostic='unknown';
  try {
   const r=await fetch(CJ_BASE+path,options);
   const data=await r.json();
   if(r.ok&&(data.result||data.success)&&data.data)return data.data;
   // Expose only sanitized HTTP status and numeric CJ error code. No tokens, request data, or response bodies.
   const safeCode=/^\d{1,10}$/.test(String(data?.code??''))?String(data.code):'none';
   diagnostic='HTTP '+r.status+' CJ code '+safeCode;
   retryable=r.status===429||r.status>=500||['1600200','402','406','429'].includes(String(data?.code??''));
   if(!retryable)throw new Error('Supplier unavailable ('+diagnostic+')');
  } catch(error) {
   if(String(error?.message||'').startsWith('Supplier unavailable ('))throw error;
   // A network timeout can also be transient; never keep retrying endlessly.
   retryable=true;
   if(diagnostic==='unknown')diagnostic='network or invalid response';
  }
  if(attempt===1)throw new Error('Supplier temporarily unavailable or rate limited ('+diagnostic+')');
  if(retryable)await new Promise(resolve=>setTimeout(resolve,450));
 }
 throw new Error('Supplier unavailable');
}
export const PRODUCT_ID='1963146233541074945';
export function retailCents(cost){if(!Number.isFinite(Number(cost))||Number(cost)<=0)throw new Error('Price unavailable');return Math.ceil(Number(cost)*135);}
export async function square(env,path,body){
 const token=env.SQUARE_ACCESS_TOKEN||env.TOKEN;if(!token)throw new Error('Payments not configured');
 if(env.SQUARE_ENVIRONMENT&&!['sandbox','production'].includes(env.SQUARE_ENVIRONMENT))throw new Error('Invalid payment environment');
 const base=env.SQUARE_ENVIRONMENT==='sandbox'?'https://connect.squareupsandbox.com':'https://connect.squareup.com';
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Square-Version':'2026-09-16','Content-Type':'application/json'},signal:AbortSignal.timeout(15000),...(body?{body:JSON.stringify(body)}:{})});
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
