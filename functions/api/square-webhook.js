import {json,recordPayment} from '../_lib/transactions.js';
export async function onRequestPost({request,env}){
 if(!env.BUSINESS_DB||!env.SQUARE_WEBHOOK_SIGNATURE_KEY||!env.SQUARE_WEBHOOK_URL)return json({error:'Notifications not configured.'},503);
 const raw=await request.text();if(raw.length>100000)return json({error:'Payload too large.'},413);
 try{
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SQUARE_WEBHOOK_SIGNATURE_KEY),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const signature=request.headers.get('x-square-hmacsha256-signature')||'';
  const bytes=Uint8Array.from(atob(signature),c=>c.charCodeAt(0));
  if(!await crypto.subtle.verify('HMAC',key,bytes,new TextEncoder().encode(env.SQUARE_WEBHOOK_URL+raw)))return json({error:'Invalid signature.'},401);
  const event=JSON.parse(raw);
  if(['payment.created','payment.updated'].includes(event.type)){
   const id=event.data?.object?.payment?.id;
   if(typeof id!=='string'||!/^[-\w]{1,192}$/.test(id))return json({error:'Missing payment.'},400);
   // Fetch the authoritative payment; never trust a browser or event's amount.
   // Retryable failures return 503 so Square redelivers. Updates are idempotent.
   await recordPayment(env,id);
  }
  return json({received:true});
 }catch{return json({error:'Notification could not be processed. Retry required.'},503);}
}
