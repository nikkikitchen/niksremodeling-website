import test from 'node:test';
import assert from 'node:assert/strict';
import {transactionEnv} from './helpers/transaction-db.mjs';
import {createCheckout,recordPayment} from '../functions/_lib/transactions.js';
import {square} from '../functions/_lib/commerce.js';
import {approvedQuote} from '../functions/_lib/project-quotes.js';
import {onRequestPost as webhook} from '../functions/api/square-webhook.js';
import {onRequestGet as status} from '../functions/api/payment-status.js';
import {onRequestPost as schedule} from '../functions/api/scheduling.js';
import {onRequestPost as projectCheckout} from '../functions/api/project-checkout.js';
import {onRequestGet as projectQuote} from '../functions/api/project-quote.js';
const request=(path,b)=>new Request('https://example.test/api/'+path,{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify(b)});
const input=(env,id=crypto.randomUUID())=>({env,id,kind:'retail',quote:{totalCents:10700},customer:{email:'buyer@example.test'},order:{line_items:[{name:'Item',quantity:'1',base_price_money:{amount:10700,currency:'USD'}}]},origin:'https://example.test'});
const link=(id='square-order',amount=10700)=>Response.json({payment_link:{order_id:id,url:'https://sandbox.square.link/u/test'},related_resources:{orders:[{id,total_money:{amount,currency:'USD'}}]}});
async function withFetch(fn,mock){const old=globalThis.fetch;globalThis.fetch=mock;try{await fn();}finally{globalThis.fetch=old;}}
async function signed(env,event){const raw=JSON.stringify(event);const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.SQUARE_WEBHOOK_SIGNATURE_KEY),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(env.SQUARE_WEBHOOK_URL+raw));return new Request(env.SQUARE_WEBHOOK_URL,{method:'POST',headers:{'x-square-hmacsha256-signature':btoa(String.fromCharCode(...new Uint8Array(bytes)))},body:raw});}

test('sandbox uses sandbox host and refuses invalid environment before fetch',async()=>{
 let calls=0;await withFetch(async()=>{await square(transactionEnv(),'/v2/locations');await assert.rejects(square({...transactionEnv(),SQUARE_ENVIRONMENT:'typo'},'/v2/locations'));assert.equal(calls,1);},async url=>{calls++;assert.match(url,/^https:\/\/connect.squareupsandbox.com\//);return Response.json({locations:[]});});
});
test('durable retry and concurrent checkout reuse one Square key and saved link',async()=>{
 const env=transactionEnv(),args=input(env);let calls=0;
 await withFetch(async()=>{
  const results=await Promise.all([createCheckout(args),createCheckout(args)]);assert.equal(results[0].url,results[1].url);
  await createCheckout(args);assert.ok(calls>=1&&calls<=2); // racing creates share Square idempotency key
  assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT count(*) AS n FROM checkout_orders').get().n,1);
  await assert.rejects(createCheckout({...args,quote:{totalCents:10800}}),e=>e.status===409);
 },async(url,options)=>{calls++;assert.equal(JSON.parse(options.body).idempotency_key,args.id);return link();});
});
test('unknown recording configuration and mismatched Square amount cannot expose checkout links',async()=>{
 const env=transactionEnv();await assert.rejects(createCheckout(input({...env,BUSINESS_DB:null})),e=>e.status===503);
 await withFetch(async()=>{await assert.rejects(createCheckout(input(env)),e=>e.status===503);assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT payment_url FROM checkout_orders').get().payment_url,null);},async()=>link('wrong',100));
});
test('unpaid, wrong currency, wrong location, refunded payments and redirects never confirm success',async()=>{
 for(const patch of [{status:'APPROVED'},{amount_money:{amount:1,currency:'USD'}},{amount_money:{amount:10700,currency:'CAD'}},{location_id:'other'},{refunded_money:{amount:1,currency:'USD'}}]){
  const env=transactionEnv(),args=input(env);let payment={id:'pay',order_id:'square-order',status:'COMPLETED',location_id:'location',amount_money:{amount:10700,currency:'USD'},...patch};
  await withFetch(async()=>{await createCheckout(args);await recordPayment(env,'pay');const row=env.BUSINESS_DB.sqlite.prepare('SELECT * FROM checkout_orders').get();assert.notEqual(row.status,'paid');assert.equal(row.fulfillment_status,'hold');},async url=>String(url).includes('/payment-links')?link():Response.json({payment}));
 }
});
test('signed repeated webhook verifies processor payment and records one receipt, never fulfills',async()=>{
 const env=transactionEnv(),args=input(env),event={type:'payment.updated',data:{object:{payment:{id:'pay'}}}};
 await withFetch(async()=>{
  await createCheckout(args);
  const bad=await webhook({env,request:new Request(env.SQUARE_WEBHOOK_URL,{method:'POST',body:JSON.stringify(event)})});assert.notEqual(bad.status,200);
  for(let i=0;i<2;i++)assert.equal((await webhook({env,request:await signed(env,event)})).status,200);
  const row=env.BUSINESS_DB.sqlite.prepare('SELECT * FROM checkout_orders').get();assert.equal(row.status,'paid');assert.equal(row.payment_id,'pay');assert.equal(row.fulfillment_status,'hold');
  const response=await status({env,request:new Request('https://example.test/api/payment-status?order='+args.id)});assert.equal((await response.json()).status,'paid');
 },async url=>String(url).includes('/payment-links')?link():Response.json({payment:{id:'pay',order_id:'square-order',status:'COMPLETED',location_id:'location',amount_money:{amount:10700,currency:'USD'},receipt_url:'https://squareupsandbox.com/receipt/test'}}));
});
test('failed notification returns retryable status and status polling reconciles delayed notification',async()=>{
 const env=transactionEnv(),args=input(env),event={type:'payment.updated',data:{object:{payment:{id:'pay'}}}};let unavailable=true;
 await withFetch(async()=>{
  await createCheckout(args);assert.equal((await webhook({env,request:await signed(env,event)})).status,503);
  unavailable=false;const response=await status({env,request:new Request('https://example.test/api/payment-status?order='+args.id)});assert.equal((await response.json()).status,'paid');
 },async url=>{if(String(url).includes('/payment-links'))return link();if(unavailable)throw Error('Network');if(String(url).includes('/orders/'))return Response.json({order:{tenders:[{payment_id:'pay'}]}});return Response.json({payment:{id:'pay',order_id:'square-order',status:'COMPLETED',location_id:'location',amount_money:{amount:10700,currency:'USD'}}});});
});
test('scheduling saves request, deduplicates retries and rejects conflicting or invalid submissions',async()=>{
 const env=transactionEnv(),b={requestId:crypto.randomUUID(),name:'Customer',phone:'555-555-5555',email:'customer@example.test',date:'2099-01-01',zip:'30117',details:'Accent Standard; wall 12 x 8 feet'};
 const first=await (await schedule({env,request:request('scheduling',b)})).json();assert.equal(first.status,'requested');assert.ok(first.reference);
 const retry=await (await schedule({env,request:request('scheduling',b)})).json();assert.equal(retry.reference,first.reference);
 assert.equal((await schedule({env,request:request('scheduling',{...b,details:'changed'})})).status,409);
 for(const patch of [{date:'2026-02-30'},{zip:'invalid'},{email:''},{date:'2000-01-01'}])assert.equal((await schedule({env,request:request('scheduling',{...b,...patch})})).status,400);
 assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT count(*) AS n FROM scheduling_requests').get().n,1);
});
const quoteInput=()=>({customerName:'Buyer',customerEmail:'buyer@example.test',projectName:'Accent Standard',scope:'12 x 8 foot wall; paint, faux finish and chair rail',taxReviewed:true,scopeApproved:true,items:[{name:'Labor',category:'labor',amountCents:10000},{name:'Materials',category:'materials',costCents:10000,amountCents:13500}],totalCents:23500,depositCents:13500,expiresAt:new Date(Date.now()+86400000).toISOString()});
test('approved quotes reconcile materials markup, deposit, scope and tax review',()=>{
 const b=quoteInput();assert.equal(approvedQuote(b).totalCents,23500);
 for(const patch of [{totalCents:1},{depositCents:99999},{taxReviewed:false},{scopeApproved:false},{items:[{name:'Materials',category:'materials',costCents:10000,amountCents:10000}]},{expiresAt:'2000-01-01'}])assert.throws(()=>approvedQuote({...b,...patch}));
});
async function seedQuote(env,allowFull=1){const b=quoteInput(),id=crypto.randomUUID(),token=crypto.randomUUID()+crypto.randomUUID();await env.BUSINESS_DB.prepare('INSERT INTO project_quotes(id,token,customer_name,customer_email,project_name,scope,items_json,total_cents,deposit_cents,allow_full,approved_by,expires_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,token,b.customerName,b.customerEmail,b.projectName,b.scope,JSON.stringify(b.items),23500,13500,allowFull,'owner@example.test',b.expiresAt).run();return {id,token};}
test('approved deposits and full payment create independent secure checkout and remaining balances',async()=>{
 for(const mode of ['deposit','full']){
  const env=transactionEnv(),q=await seedQuote(env),amount=mode==='full'?23500:13500;let processorCalls=0;
  await withFetch(async()=>{
   const b={token:q.token,mode,expectedTotal:amount,termsAccepted:true};
   const first=await projectCheckout({env,request:request('project-checkout',b)});assert.equal(first.status,200);const payment=await first.json();
   const retry=await projectCheckout({env,request:request('project-checkout',b)});assert.equal((await retry.json()).orderId,payment.orderId);assert.equal(processorCalls,1);
   assert.equal((await projectCheckout({env,request:request('project-checkout',{...b,mode:mode==='full'?'deposit':'full',expectedTotal:mode==='full'?13500:23500})})).status,409);
   await recordPayment(env,'project-pay');
   const paid=await (await status({env,request:new Request('https://example.test/api/payment-status?order='+payment.orderId)})).json();assert.equal(paid.status,'paid');assert.equal(paid.balanceCents,23500-amount);
   assert.equal((await projectCheckout({env,request:request('project-checkout',b)})).status,409);
  },async(url,opts)=>{
   assert.doesNotMatch(String(url),/cjdropshipping/);
   if(String(url).includes('/locations/'))return Response.json({location:{status:'ACTIVE',currency:'USD',capabilities:['CREDIT_CARD_PROCESSING']}});
   if(String(url).includes('/payment-links')){processorCalls++;assert.equal(JSON.parse(opts.body).order.line_items[0].base_price_money.amount,amount);return link('project-order',amount);}
   return Response.json({payment:{id:'project-pay',order_id:'project-order',status:'COMPLETED',location_id:'location',amount_money:{amount,currency:'USD'}}});
  });
 }
});
test('unapproved or expired project estimates cannot collect payment',async()=>{
 const env=transactionEnv(),q=await seedQuote(env,0);
 for(const b of [{token:'unknown',mode:'deposit',expectedTotal:1,termsAccepted:true},{token:q.token,mode:'full',expectedTotal:23500,termsAccepted:true},{token:q.token,mode:'deposit',expectedTotal:1,termsAccepted:true}])assert.notEqual((await projectCheckout({env,request:request('project-checkout',b)})).status,200);
 env.BUSINESS_DB.sqlite.prepare('UPDATE project_quotes SET revoked=1').run();
 assert.equal((await projectQuote({env,request:new Request('https://example.test/api/project-quote?token='+q.token)})).status,404);
});

test('hosted checkout cloned orders reconcile through authoritative reference; duplicate payment IDs require review',async()=>{
 const env=transactionEnv(),args=input(env);let paymentId='payment-one';
 await withFetch(async()=>{
  await createCheckout(args);await recordPayment(env,paymentId);
  assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT status FROM checkout_orders').get().status,'paid');
  await assert.rejects(createCheckout(args),e=>e.status===409);
  paymentId='payment-two';await recordPayment(env,paymentId);
  assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT status FROM checkout_orders').get().status,'review');
 },async url=>{
  if(String(url).includes('/payment-links'))return link();
  if(String(url).includes('/orders/'))return Response.json({order:{location_id:'location',reference_id:args.id,total_money:{amount:10700,currency:'USD'}}});
  return Response.json({payment:{id:paymentId,order_id:'cloned-order',location_id:'location',status:'COMPLETED',amount_money:{amount:10700,currency:'USD'}}});
 });
});

test('processor rejection leaves a retryable durable attempt without claiming payment',async()=>{
 const env=transactionEnv(),args=input(env);let failing=true;
 await withFetch(async()=>{
  await assert.rejects(createCheckout(args));
  assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT status FROM checkout_orders').get().status,'creating');
  failing=false;await createCheckout(args);
  assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT count(*) AS n FROM checkout_orders').get().n,1);
 },async()=>failing?Response.json({errors:[{code:'PAYMENT_METHOD_ERROR'}]},{status:400}):link());
});

test('concurrent CJ requests share authentication and never share tokens across credentials',async()=>{
 const {accessToken}=await import('../functions/_lib/commerce.js');let calls=0;
 await withFetch(async()=>{
  const tokens=await Promise.all(Array.from({length:8},()=>accessToken({CJ_API_KEY:'concurrent-test-key'})));
  assert.equal(calls,1);assert.ok(tokens.every(t=>t==='token-concurrent-test-key'));
  assert.equal(await accessToken({CJ_API_KEY:'other-key'}),'token-other-key');assert.equal(calls,2);
 },async(url,options)=>{calls++;await new Promise(resolve=>setTimeout(resolve,10));const key=JSON.parse(options.body).apiKey;return Response.json({result:true,data:{accessToken:'token-'+key,accessTokenExpiryDate:'2099-01-01T00:00:00Z'}});});
});
