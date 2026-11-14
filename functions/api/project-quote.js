import {json} from '../_lib/transactions.js';
export async function onRequestGet({request,env}){
 const token=new URL(request.url).searchParams.get('token');
 if(!/^[a-f0-9-]{72}$/.test(token||''))return json({error:'Invalid quote link.'},400);
 try{
  const q=await env.BUSINESS_DB?.prepare('SELECT * FROM project_quotes WHERE token=?').bind(token).first();
  if(!q||q.revoked||Date.parse(q.expires_at)<=Date.now())return json({error:'Quote is unavailable or expired. Please request an updated quote.'},404);
  const checkout=q.active_checkout_id?await env.BUSINESS_DB.prepare('SELECT id,status,total_cents FROM checkout_orders WHERE id=?').bind(q.active_checkout_id).first():null;
  return json({id:q.id,projectName:q.project_name,scope:q.scope,items:JSON.parse(q.items_json),totalCents:q.total_cents,depositCents:q.deposit_cents,
   allowFull:!!q.allow_full,expiresAt:q.expires_at,checkout:checkout?{orderId:checkout.id,status:checkout.status}:null});
 }catch{return json({error:'Quote service unavailable.'},503);}
}
