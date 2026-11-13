import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestGet as quote} from '../functions/api/store-quote.js';
import {onRequestPost as checkout} from '../functions/api/store-checkout.js';
const env={CJ_ACCESS_TOKEN:'private-cj',SQUARE_ACCESS_TOKEN:'private-square',SQUARE_LOCATION_ID:'location',STORE_ALLOWED_ZIPS:'30117',ZIPTAX_API_KEY:'tax-provider-key'};
const PID='1963146233541074945',VID='1963146233666904066';
let stock=10,wrongTotal=false,calls=[];
const mock=async(url,opts={})=>{
 calls.push({url:String(url),body:opts.body});
 if(String(url).includes('/product/query?'))return Response.json({result:true,data:{productNameEn:'Nightstand',variants:[{vid:VID,variantSellPrice:49.72,variantSku:'sku',variantKey:'Brown'}]}});
 if(String(url).includes('queryByVid'))return Response.json({result:true,data:[{countryCode:'US',cjInventoryNum:stock,totalInventoryNum:stock,factoryInventoryNum:0}]});
 if(String(url).includes('freightCalculate'))return Response.json({result:true,data:[{logisticPrice:10,logisticName:'USPS',logisticAging:'3-5'}]});
 if(String(url).includes('zip-tax.com'))return Response.json({
  metadata:{response:{code:100}},
  taxSummaries:[{taxType:'SALES_TAX',rate:0.07}],
  addressDetail:{normalizedAddress:'123 Main St, Carrollton, GA 30117'},
  shipping:{taxable:'Y'}
 });
 if(String(url).includes('/locations/'))return Response.json({location:{status:'ACTIVE',currency:'USD',capabilities:['CREDIT_CARD_PROCESSING']}});
 if(String(url).includes('/payment-links'))return Response.json({payment_link:{order_id:'order-test',url:'https://square.link/u/test'},related_resources:{orders:[{id:'order-test',total_money:{amount:wrongTotal?8600:8627,currency:'USD'}}]}});
 throw Error('Unexpected request: '+url);
};
const req=body=>new Request('https://niksremodeling.com/api/store-checkout',{method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},body:JSON.stringify(body)});
const order=(total=8627)=>({productId:PID,variantId:VID,quantity:1,zip:'30117',address:'123 Main St',city:'Carrollton',state:'GA',expectedTotal:total,requestId:'unique-test-request-1234'});

test('catalog product gets verified Square link with consistent tax, stock, freight and location',async()=>{
 const previous=globalThis.fetch;stock=10;wrongTotal=false;calls=[];globalThis.fetch=mock;
 try{
  const request=new Request('https://niksremodeling.com/api/store-quote?zip=30117&address=123%20Main%20St&city=Carrollton&state=GA&product='+PID+'&variant='+VID);
  const response=await quote({request,env});
  assert.equal(response.status,200);
  const q=await response.json();
  assert.equal(q.subtotalCents,8063);
  assert.equal(q.totalCents,8627);
  assert.equal(q.checkoutEnabled,true);
  const payment=await checkout({request:req(order(q.totalCents)),env});
  assert.equal(payment.status,200);
  assert.equal((await payment.json()).url,'https://square.link/u/test');
  assert.ok(calls.some(c=>c.url.includes('/payment-links')));
  const paymentRequest=JSON.parse(calls.find(c=>c.url.includes('/payment-links')).body);
  assert.equal(paymentRequest.order.taxes[0].percentage,'7');
  assert.equal(paymentRequest.order.taxes[0].scope,'LINE_ITEM');
  assert.equal(paymentRequest.order.line_items[0].applied_taxes[0].tax_uid,'destination-sales-tax');
 }finally{globalThis.fetch=previous;stock=10;}
});

test('checkout fails closed on stale price or Square total mismatch',async()=>{
 const previous=globalThis.fetch;stock=10;wrongTotal=false;calls=[];globalThis.fetch=mock;
 try{
  const stale=await checkout({request:req(order(100)),env});
  assert.equal(stale.status,409);
  assert.equal(calls.some(c=>c.url.includes('/payment-links')),false);
  wrongTotal=true;
  const mismatch=await checkout({request:req(order()),env});
  assert.equal(mismatch.status,503);
  assert.equal((await mismatch.json()).checkoutEnabled,false);
 }finally{globalThis.fetch=previous;wrongTotal=false;}
});

test('out-of-stock products never proceed to payment, regardless of destination ZIP',async()=>{
 const previous=globalThis.fetch;calls=[];stock=0;globalThis.fetch=mock;
 try{
  for(const zip of ['30117','99999']){
   const unavailable=await checkout({request:req({...order(),zip}),env});
   assert.equal(unavailable.status,503);
  }
  assert.equal(calls.some(c=>c.url.includes('/payment-links')),false);
 }finally{globalThis.fetch=previous;stock=10;}
});

test('verified destinations outside the labor area are eligible for retail checkout',async()=>{
 const previous=globalThis.fetch;calls=[];stock=10;wrongTotal=false;
 globalThis.fetch=async(url,options)=>{
  if(String(url).includes('zip-tax.com'))return Response.json({
   metadata:{response:{code:100}},taxSummaries:[{taxType:'SALES_TAX',rate:0.07}],
   addressDetail:{normalizedAddress:'123 Market St, Atlanta, GA 30303'},shipping:{taxable:'Y'}
  });
  return mock(url,options);
 };
 try{
  const res=await quote({request:new Request('https://niksremodeling.com/api/store-quote?zip=30303&address=123%20Market%20St&city=Atlanta&state=GA&product='+PID+'&variant='+VID),env});
  assert.equal(res.status,200);
  assert.equal((await res.json()).checkoutEnabled,true);
 }finally{globalThis.fetch=previous;}
});
