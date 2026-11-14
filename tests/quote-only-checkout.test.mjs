import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/store-checkout.js';

test('Square checkout blocks malformed orders before contacting any processor or supplier',async()=>{
 const request=new Request('https://niksremodeling.com/api/store-checkout',{
  method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
  body:JSON.stringify({zip:'36269',expectedTotal:10000,requestId:'invalid-without-product'})
 });
 const previous=globalThis.fetch;
 globalThis.fetch=async()=>{throw Error('Invalid checkout must never make an API request');};
 try{
  const response=await onRequestPost({request,env:{
   STORE_ALLOWED_ZIPS:'36269',SQUARE_ACCESS_TOKEN:'test-token',
   SQUARE_LOCATION_ID:'location',STORE_TAX_ID:'tax'
  }});
  assert.equal(response.status,400);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal((await response.json()).checkoutEnabled,false);
 }finally{globalThis.fetch=previous;}
});

test('Square checkout requires a fresh verified destination tax and supplier quote',async()=>{
 const request=new Request('https://niksremodeling.com/api/store-checkout',{
  method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
  body:JSON.stringify({
   productId:'1963146233541074945',variantId:'1963146233666904066',
   quantity:1,zip:'99999',address:'123 Example St',city:'Example',state:'GA',
   expectedTotal:8627,requestId:'valid-test-request-123456'
  })
 });
 const previous=globalThis.fetch;
 globalThis.fetch=async()=>{throw Error('No supplier verification available');};
 try{
  const result=await onRequestPost({request,env:{CJ_ACCESS_TOKEN:'mock',ZIPTAX_API_KEY:'mock',SQUARE_ACCESS_TOKEN:'mock',SQUARE_LOCATION_ID:'location'}});
  assert.equal(result.status,503);
  assert.equal((await result.json()).checkoutEnabled,false);
 }finally{globalThis.fetch=previous;}
});

test('valid direct orders cannot bypass the hard hold with credentials or enable flags',async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;throw Error('Purchase hold must run before supplier or processor access');};
 try{
  for(const extras of [{},{checkoutEnabled:true,checkoutReadyForVerification:true,totalCents:1},{shippingCents:0,taxCents:0,paymentMode:'full'}]){
   const request=new Request('https://niksremodeling.com/api/store-checkout',{
    method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
    body:JSON.stringify({productId:'1963146233541074945',variantId:'1963146233666904066',quantity:1,zip:'30117',address:'Test address',city:'Carrollton',state:'GA',expectedTotal:100,requestId:'mock-request-12345678',...extras})
   });
   const response=await onRequestPost({request,env:{CHECKOUT_ENABLED:'true',SQUARE_ACCESS_TOKEN:'mock',SQUARE_LOCATION_ID:'mock',CJ_ACCESS_TOKEN:'mock',ZIPTAX_API_KEY:'mock'}});
   assert.equal(response.status,503);const body=await response.json();
   assert.equal(body.checkoutEnabled,false);assert.equal(body.url,undefined);
   assert.equal(response.headers.get('Cache-Control'),'no-store');
  }
  assert.equal(calls,0);
 }finally{globalThis.fetch=original;}
});

test('CJ retries a temporary rate limit once and succeeds without changing the quote',async()=>{
 const {cj}=await import('../functions/_lib/commerce.js');
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{
  calls++;
  return calls===1?new Response(JSON.stringify({result:false,code:'1600200'}),{status:429}):
   new Response(JSON.stringify({result:true,data:[{logisticName:'Verified CJ Delivery',logisticPrice:12.5}]}),{status:200});
 };
 try{
  const result=await cj({CJ_ACCESS_TOKEN:'mock'},'/logistic/freightCalculate',{zip:'30117'});
  assert.equal(calls,2);
  assert.equal(result[0].logisticPrice,12.5);
 }finally{globalThis.fetch=original;}
});

test('CJ does not retry a permanent authentication error',async()=>{
 const {cj}=await import('../functions/_lib/commerce.js');
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({result:false,code:'401'}),{status:401});};
 try{
  await assert.rejects(cj({CJ_ACCESS_TOKEN:'mock'},'/product/query?pid=example'),/Supplier unavailable/);
  assert.equal(calls,1);
 }finally{globalThis.fetch=original;}
});

test('CJ reports sanitized upstream status and numeric error code after bounded failure',async()=>{
 const {cj}=await import('../functions/_lib/commerce.js');
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(JSON.stringify({result:false,code:'1600000',message:'secret not for clients'}),{status:503});};
 try {
  await assert.rejects(cj({CJ_ACCESS_TOKEN:'mock'},'/product/query?pid=example'),error=>{
   assert.match(error.message,/HTTP 503 CJ code 1600000/);
   assert.doesNotMatch(error.message,/secret not for clients/);
   return true;
  });
  assert.equal(calls,2);
 }finally{globalThis.fetch=original;}
});
