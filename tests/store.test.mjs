import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestGet as quote} from '../functions/api/store-quote.js';
import {onRequestPost as checkout} from '../functions/api/store-checkout.js';
const env={CJ_ACCESS_TOKEN:'private-cj',SQUARE_ACCESS_TOKEN:'private-square',SQUARE_LOCATION_ID:'location',STORE_ALLOWED_ZIPS:'30117',STORE_TAX_ID:'tax1',STORE_CHECKOUT_ENABLED:'true'};
let stock=10,calls=[];
const mock=async(url,opts={})=>{calls.push({url:String(url),body:opts.body});
 if(String(url).includes('/product/query?'))return Response.json({result:true,data:{productNameEn:'Nightstand',variants:[{vid:'1963146233666904066',variantSellPrice:49.72,variantSku:'sku',variantKey:'Brown'}]}});
 if(String(url).includes('queryByVid'))return Response.json({result:true,data:[{countryCode:'US',cjInventoryNum:stock,totalInventoryNum:stock,factoryInventoryNum:0}]});
 if(String(url).includes('freightCalculate'))return Response.json({result:true,data:[{logisticPrice:10,logisticName:'USPS',logisticAging:'3-5'}]});
 if(String(url).includes('/catalog/list'))return Response.json({objects:[{id:'tax1',tax_data:{enabled:true,percentage:'7',applies_to_custom_amounts:true,inclusion_type:'ADDITIVE'}}]});
 if(String(url).includes('/locations/'))return Response.json({location:{status:'ACTIVE',currency:'USD',capabilities:['CREDIT_CARD_PROCESSING']}});
 if(String(url).includes('/payment-links'))return Response.json({payment_link:{url:'https://square.link/u/test'}});
 throw Error('Unexpected request');};
const req=body=>new Request('https://niksremodeling.com/api/store-checkout',{method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},body:JSON.stringify(body)});
test('quote-only store enforces stock and blocks all payment links',async()=>{
 const original=globalThis.fetch;
 calls=[];
 globalThis.fetch=mock;
 try{
  const query=new Request('https://niksremodeling.com/api/store-quote?zip=30117');
  let q=await (await quote({request:query,env})).json();
  assert.equal(q.subtotalCents,8063);
  assert.equal(q.checkoutEnabled,false);
  assert.equal(q.totalCents,8627);
  const body={zip:'30117',expectedTotal:q.totalCents,requestId:'unique-test-request-1234'};
  assert.equal((await checkout({request:req(body),env})).status,503);
  assert.equal((await checkout({request:req({...body,expectedTotal:1}),env})).status,503);
  assert.equal((await checkout({request:req(body),env:{...env,STORE_CHECKOUT_ENABLED:''}})).status,503);
  assert.equal(calls.some(c=>/payment-links|payBalance|createOrder/.test(c.url)),false);
  stock='invalid';
  assert.equal((await quote({request:query,env})).status,503);
  stock=0;
  assert.equal((await quote({request:query,env})).status,503);
  assert.equal((await quote({request:new Request('https://niksremodeling.com/api/store-quote?zip=bad'),env})).status,400);
 }finally{globalThis.fetch=original;stock=10;}
});
