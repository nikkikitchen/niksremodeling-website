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
 const r=await fetch(CJ_BASE+path,{method:body?'POST':'GET',headers:{'CJ-Access-Token':token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok||!data.result)throw new Error('Supplier unavailable');return data.data;
}
export const PRODUCT_ID='1963146233541074945';
export function retailCents(cost){if(!Number.isFinite(Number(cost))||Number(cost)<=0)throw new Error('Price unavailable');return Math.ceil(Number(cost)*135);}
export async function square(env,path,body){
 const token=env.SQUARE_ACCESS_TOKEN||env.TOKEN;if(!token)throw new Error('Payments not configured');
 const r=await fetch('https://connect.squareup.com'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Square-Version':'2026-09-16','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json();if(!r.ok||data.errors)throw new Error('Square '+(data.errors?.[0]?.code||'unavailable'));return data;
}
