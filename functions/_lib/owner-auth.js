const keys=new Map();
export const privateHeaders={'Cache-Control':'private, no-store','Vary':'Cookie, Cf-Access-Jwt-Assertion','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
export function privateJson(data,status=200){return Response.json(data,{status,headers:privateHeaders});}
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const json=s=>JSON.parse(new TextDecoder().decode(decode(s)));
export async function authenticateOwner(request,env){
 const team=String(env.OWNER_ACCESS_DOMAIN||''),aud=String(env.OWNER_ACCESS_AUD||'');
 const allowed=String(env.OWNER_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team)||!aud||!allowed.length)return null;
 const token=request.headers.get('Cf-Access-Jwt-Assertion');
 if(!token||token.length>16384)return null;
 try{
  const [h,p,s,...rest]=token.split('.');if(rest.length||!s)return null;
  const header=json(h),claims=json(p),now=Date.now()/1000;
  if(header.alg!=='RS256'||typeof header.kid!=='string'||claims.iss!=='https://'+team||
   !Array.isArray(claims.aud)||!claims.aud.includes(aud)||!Number.isFinite(claims.exp)||claims.exp<=now||
   !Number.isFinite(claims.iat)||claims.iat>now+30||claims.iat<now-86400||
   (claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>now+30))||
   !allowed.includes(String(claims.email||'').toLowerCase()))return null;
  let cached=keys.get(team);
  if(!cached||cached.until<Date.now()||!cached.keys.some(k=>k.kid===header.kid)){
   const response=await fetch('https://'+team+'/cdn-cgi/access/certs',{signal:AbortSignal.timeout(5000)});
   if(!response.ok)return null;
   const data=await response.json();if(!Array.isArray(data.keys)||data.keys.length>20)return null;
   cached={keys:data.keys,until:Date.now()+300000};keys.set(team,cached);
  }
  const jwk=cached.keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return null;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(s),new TextEncoder().encode(h+'.'+p)))return null;
  return {email:String(claims.email).toLowerCase()};
 }catch{return null;}
}
export function ownerRoute(handler){return async context=>{
 const owner=await authenticateOwner(context.request,context.env||{});
 if(!owner)return privateJson({error:'Owner sign-in required.'},401);
 if(!['GET','HEAD'].includes(context.request.method)&&context.request.headers.get('Origin')!==new URL(context.request.url).origin)
  return privateJson({error:'Start changes from the owner dashboard.'},403);
 if(!context.env.BUSINESS_DB)return privateJson({error:'Business database is not connected.'},503);
 try{return await handler({...context,owner});}catch(error){
  if(error?.name==='ValidationError')return privateJson({error:error.message},400);
  return privateJson({error:'The business operation could not be completed.'},503);
 }
};}
