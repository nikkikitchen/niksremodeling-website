import {ensureTransactionRecords} from './transaction-schema.js';
import {square} from './commerce.js';
export const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
export const json=(data,status=200)=>Response.json(data,{status,headers});
export function invalid(message,status=400){const error=new Error(message);error.status=status;throw error;}
export function sameOrigin(request){if(request.headers.get('Origin')!==new URL(request.url).origin)invalid('Start this request from our website.',403);}
export async function body(request){
 if(Number(request.headers.get('Content-Length')||0)>20000)invalid('Request too large.',413);
 const raw=await request.text();if(raw.length>20000)invalid('Request too large.',413);
 try{return JSON.parse(raw);}catch{invalid('Invalid request.');}
}
export function requireTransactions(env){
 if(!env.BUSINESS_DB||!env.SQUARE_WEBHOOK_SIGNATURE_KEY||!env.SQUARE_WEBHOOK_URL)invalid('Payment recording and notifications need configuration.',503);
}
export const environment=env=>env.SQUARE_ENVIRONMENT==='sandbox'?'sandbox':'production';
export async function fingerprint(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value))))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function validPaymentUrl(url,env){
 try{const u=new URL(url);return u.protocol==='https:'&&(environment(env)==='sandbox'?['sandbox.square.link','sandbox.checkout.square.site']:['square.link','checkout.square.site']).includes(u.hostname);}catch{return false;}
}
export async function createCheckout({env,id,kind,quote,customer,order,options={},origin,projectQuoteId=null,mode=null}){
 requireTransactions(env);
 await ensureTransactionRecords(env);
 const db=env.BUSINESS_DB;
 const {stock:currentStock,...pricedQuote}=quote;
 const hash=await fingerprint({kind,quote:pricedQuote,customer,projectQuoteId,mode,environment:environment(env)});
 await db.prepare('INSERT OR IGNORE INTO checkout_orders(id,fingerprint,kind,environment,total_cents,customer_json,quote_json,project_quote_id,payment_mode) VALUES(?,?,?,?,?,?,?,?,?)')
  .bind(id,hash,kind,environment(env),quote.totalCents,JSON.stringify(customer),JSON.stringify(quote),projectQuoteId,mode).run();
 const saved=await db.prepare('SELECT * FROM checkout_orders WHERE id=?').bind(id).first();
 if(!saved||saved.fingerprint!==hash)invalid('Checkout changed. Review it and start a new request.',409);
 if(['paid','review'].includes(saved.status))invalid('This order already has a payment. Review its status before paying again.',409);
 if(saved.payment_url)return {url:saved.payment_url,orderId:id,totalCents:saved.total_cents};
 // A server-owned key survives retries, double clicks and lost responses. The
 // exact processor request is reconstructed from the immutable stored record.
 const payment=await square(env,'/v2/online-checkout/payment-links',{
  idempotency_key:id,order:{...order,location_id:env.SQUARE_LOCATION_ID,reference_id:id},
  checkout_options:{allow_tipping:false,redirect_url:origin+'/payment.html#order='+id,...options},
  pre_populated_data:{buyer_email:customer.email,...(customer.address?{buyer_address:{address_line_1:customer.address,locality:customer.city,administrative_district_level_1:customer.state,postal_code:customer.zip,country:'US'}}:{})},
  payment_note:kind==='retail'?'Manual fulfillment hold. Verify paid status and final delivery address before ordering.':'Approved project quote '+projectQuoteId+' / '+mode
 });
 const actual=payment.related_resources?.orders?.find(x=>x.id===payment.payment_link?.order_id);
 if(actual?.total_money?.amount!==quote.totalCents||actual?.total_money?.currency!=='USD'||!validPaymentUrl(payment.payment_link?.url,env))
  invalid('Square did not confirm the exact approved total. Checkout stopped.',503);
 await db.prepare("UPDATE checkout_orders SET square_order_id=?,payment_url=?,status='pending' WHERE id=? AND status='creating'")
  .bind(payment.payment_link.order_id,payment.payment_link.url,id).run();
 return {url:payment.payment_link.url,orderId:id,totalCents:quote.totalCents};
}
export async function recordPayment(env,paymentId){
 await ensureTransactionRecords(env);
 const {payment}=await square(env,'/v2/payments/'+encodeURIComponent(paymentId));
 if(!payment?.order_id)return;
 const db=env.BUSINESS_DB;
 let row=await db.prepare('SELECT * FROM checkout_orders WHERE square_order_id=?').bind(payment.order_id).first();
 // Hosted checkout can clone a payment link's template order. Resolve only a
 // server-written reference on the authoritative Square order, never metadata
 // supplied in a notification or browser. Exact amount/location still apply.
 if(!row){
  const {order}=await square(env,'/v2/orders/'+encodeURIComponent(payment.order_id));
  if(order?.location_id!==env.SQUARE_LOCATION_ID||order.total_money?.currency!=='USD'||order.total_money?.amount!==payment.amount_money?.amount)return;
  row=await db.prepare('SELECT * FROM checkout_orders WHERE id=?').bind(String(order.reference_id||'')).first();
 }
 if(!row)return;
 if(row.payment_id&&row.payment_id!==payment.id){await db.prepare("UPDATE checkout_orders SET status='review' WHERE id=?").bind(row.id).run();return;}
 if(row.environment!==environment(env)||payment.location_id!==env.SQUARE_LOCATION_ID||
  payment.amount_money?.currency!=='USD'||payment.amount_money.amount!==row.total_cents||
  Number(payment.refunded_money?.amount||0)>0){
  await db.prepare("UPDATE checkout_orders SET status='review' WHERE id=?").bind(row.id).run();return;
 }
 if(payment.status!=='COMPLETED')return;
 if(!payment.id||payment.amount_money.amount<=0)return;
 // No CJ ordering here: even paid retail requires manual stock/address review.
 const receipt=typeof payment.receipt_url==='string'&&/^https:\/\/(?:[a-z0-9-]+\.)*(?:squareup|squareupsandbox)\.com\//.test(payment.receipt_url)?payment.receipt_url:null;
 await db.prepare("UPDATE checkout_orders SET status='paid',payment_id=?,receipt_url=?,paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP) WHERE id=? AND status IN ('creating','pending','paid')")
  .bind(payment.id,receipt,row.id).run();
}
export function safeError(error){return json({error:error.status?error.message:'The request could not be completed. Please retry.',checkoutEnabled:false},error.status||503);}
