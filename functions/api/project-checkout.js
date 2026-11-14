import {body,sameOrigin,invalid,json,createCheckout,requireTransactions,safeError} from '../_lib/transactions.js';
import {square} from '../_lib/commerce.js';
export async function onRequestPost({request,env}){
 try{
  sameOrigin(request);const b=await body(request);requireTransactions(env);
  if(!/^[a-f0-9-]{72}$/.test(b.token||'')||!['deposit','full'].includes(b.mode)||b.termsAccepted!==true)invalid('Choose an approved quote, payment option and accept the terms.');
  const db=env.BUSINESS_DB,q=await db.prepare('SELECT * FROM project_quotes WHERE token=?').bind(b.token).first();
  if(!q||q.revoked||Date.parse(q.expires_at)<=Date.now())invalid('Quote is unavailable or expired.',409);
  if(b.mode==='full'&&!q.allow_full)invalid('Full payment is not offered for this quote.');
  const total=b.mode==='full'?q.total_cents:q.deposit_cents;
  if(b.expectedTotal!==total)invalid('Review the approved amount before paying.',409);
  // Only one checkout per immutable quote, across tabs/devices/retries. Do not
  // create a second full/deposit link that could charge the project twice.
  await db.prepare('UPDATE project_quotes SET active_checkout_id=? WHERE id=? AND active_checkout_id IS NULL').bind(crypto.randomUUID(),q.id).run();
  const {active_checkout_id:id}=await db.prepare('SELECT active_checkout_id FROM project_quotes WHERE id=?').bind(q.id).first();
  const previous=await db.prepare('SELECT * FROM checkout_orders WHERE id=?').bind(id).first();
  if(previous&&(previous.payment_mode!==b.mode||previous.status==='paid'||previous.status==='review'))invalid('This quote already has a payment attempt. Review its payment status.',409);
  const {location}=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));
  if(location?.status!=='ACTIVE'||location.currency!=='USD'||!location.capabilities?.includes('CREDIT_CARD_PROCESSING'))invalid('Merchant payments unavailable.',503);
  const result=await createCheckout({env,id,kind:'project',projectQuoteId:q.id,mode:b.mode,origin:new URL(request.url).origin,
   customer:{email:q.customer_email,name:q.customer_name},quote:{totalCents:total,approvedTotalCents:q.total_cents,items:JSON.parse(q.items_json)},
   order:{line_items:[{name:q.project_name.slice(0,150)+' — approved '+b.mode,quantity:'1',base_price_money:{amount:total,currency:'USD'},note:'Approved quote '+q.id+'; amount includes approved tax treatment. No supplier merchandise order.'}]}
  });
  return json(result);
 }catch(error){return safeError(error);}
}
