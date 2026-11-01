import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost as tax} from '../functions/api/cart-tax.js';
const req=data=>new Request('https://niksremodeling.com/api/cart-tax',{
 method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
 body:JSON.stringify(data)
});
const base={zip:'36269',merchandiseCents:10000,shippingCents:1500};
const env={ZIPTAX_API_KEY:'unit-test-token'};
test('ZIP preview uses the highest listed rate and a conservative shipping amount',async()=>{
 const original=global.fetch;
 global.fetch=async(url,opts)=>{
  assert.equal(new URL(url).searchParams.get('postalcode'),'36269');
  assert.equal(opts.headers['X-API-KEY'],'unit-test-token');
  return Response.json({rCode:100,results:[{taxSales:0.06},{taxSales:0.09},{taxSales:0.08}]});
 };
 try {
  const response=await tax({request:req(base),env});
  assert.equal(response.status,200);
  const output=await response.json();
  assert.equal(output.mode,'zip-upper-estimate');
  assert.equal(output.ratePercent,9);
  assert.equal(output.taxCents,1035);
  assert.equal(output.estimateOnly,true);
 }finally{global.fetch=original;}
});
test('verified street address uses its actual rate and honors freight exemption',async()=>{
 const original=global.fetch;
 global.fetch=async url=>{
  assert.match(new URL(url).searchParams.get('address'),/Heflin/);
  return Response.json({metadata:{response:{code:100}},addressDetail:{
   normalizedAddress:'123 Main St, Heflin, AL 36269-0123, United States'
  },shipping:{taxable:'N'},taxSummaries:[
   {taxType:'SALES_TAX',rate:0.07},
   {taxType:'USE_TAX',rate:0.09}
  ]});
 };
 try{
  const response=await tax({request:req({...base,address:'123 Main St',city:'Heflin',state:'AL'}),env});
  assert.equal(response.status,200);
  const output=await response.json();
  assert.equal(output.mode,'address-estimate');
  assert.equal(output.ratePercent,7);
  assert.equal(output.taxCents,700);
  assert.equal(output.shippingIncludedInEstimate,false);
 }finally{global.fetch=original;}
});
test('tax lookup fails safely without a key or verified rates',async()=>{
 let response=await tax({request:req(base),env:{}});
 assert.equal(response.status,503);
 assert.equal((await response.json()).taxCents,undefined);
 response=await tax({request:req({...base,zip:'bad'}),env});
 assert.equal(response.status,400);
 const original=global.fetch;
 global.fetch=async()=>Response.json({rCode:100,results:[]});
 try{
  response=await tax({request:req(base),env});
  assert.equal(response.status,503);
  assert.equal((await response.json()).taxCents,undefined);
 }finally{global.fetch=original;}
});
