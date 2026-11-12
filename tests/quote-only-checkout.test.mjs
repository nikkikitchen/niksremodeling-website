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

test('Square checkout rejects any destination absent from configured allowed ZIPs',async()=>{
 const request=new Request('https://niksremodeling.com/api/store-checkout',{
  method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
  body:JSON.stringify({
   productId:'1963146233541074945',variantId:'1963146233666904066',
   quantity:1,zip:'99999',expectedTotal:8627,requestId:'valid-test-request-123456'
  })
 });
 const previous=globalThis.fetch;
 globalThis.fetch=async()=>{throw Error('Unapproved destination must not contact APIs');};
 try{
  const result=await onRequestPost({request,env:{STORE_ALLOWED_ZIPS:'30117'}});
  assert.equal(result.status,503);
  assert.equal((await result.json()).checkoutEnabled,false);
 }finally{globalThis.fetch=previous;}
});
