import {square} from '../_lib/commerce.js';
import {json,recordPayment,environment} from '../_lib/transactions.js';
export async function onRequestGet({request,env}){
 const id=new URL(request.url).searchParams.get('order');
 if(!/^[a-f0-9-]{36}$/.test(id||''))return json({error:'Invalid order reference.'},400);
 if(!env.BUSINESS_DB)return json({error:'Payment records unavailable.'},503);
 try{
  let row=await env.BUSINESS_DB.prepare('SELECT * FROM checkout_orders WHERE id=?').bind(id).first();
  if(!row||row.environment!==environment(env))return json({error:'Order not found.'},404);
  // A return redirect is not evidence of payment. Reconcile through Square if
  // its notification was delayed. A network failure must never imply success.
  if(row.status==='pending'&&row.square_order_id){
   const {order}=await square(env,'/v2/orders/'+encodeURIComponent(row.square_order_id));
   for(const tender of order?.tenders||[])if(tender.payment_id)await recordPayment(env,tender.payment_id);
   row=await env.BUSINESS_DB.prepare('SELECT * FROM checkout_orders WHERE id=?').bind(id).first();
  }
  let balanceCents=null;
  if(row.project_quote_id){
   const quote=await env.BUSINESS_DB.prepare('SELECT total_cents FROM project_quotes WHERE id=?').bind(row.project_quote_id).first();
   if(quote&&row.status!=='review')balanceCents=quote.total_cents-(row.status==='paid'?row.total_cents:0);
  }
  return json({status:row.status,totalCents:row.total_cents,balanceCents,receiptUrl:row.status==='paid'?row.receipt_url:null,
   checkoutUrl:row.status==='pending'?row.payment_url:null,fulfillment:'manual review required',sandbox:row.environment==='sandbox'});
 }catch{return json({error:'Payment verification unavailable. Payment is not confirmed. Please check again.'},503);}
}
