import test from 'node:test';
import assert from 'node:assert/strict';
import {transactionEnv} from './helpers/transaction-db.mjs';
import {onRequestGet} from '../functions/api/checkout-readiness.js';

const request=new Request('https://niksremodeling.com/api/checkout-readiness?zip=30117');
const check=async env=>{
 const response=await onRequestGet({request,env});
 assert.equal(response.status,200);
 assert.equal(response.headers.get('Cache-Control'),'no-store');
 const result=await response.json();
 assert.equal(result.checkoutPaused,false);
 assert.equal(result.checkoutReadyForVerification,Boolean(result.configurationReadyForTesting));
 assert.ok(['verified retail only','verification required'].includes(result.checks.onlinePurchases));
 return result;
};

test('Square token present but location ID missing: report exact missing configuration without exposing secrets',async()=>{
 const r=await check({SQUARE_ACCESS_TOKEN:'private-token',ZIPTAX_API_KEY:'private-tax',CJ_API_KEY:'private-cj'});
 assert.equal(r.checks.paymentProcessor,'location ID missing');
 assert.equal(r.checks.salesTax,'configured; address verification required');
 assert.equal(r.checks.supplier,'configured');
 const json=JSON.stringify(r);
 assert.equal(json.includes('private-'),false);
});

test('Square credentials missing: do not blame the location ID or call Square',async()=>{
 const r=await check({SQUARE_LOCATION_ID:'private-id'});
 assert.equal(r.checks.paymentProcessor,'credentials missing');
});

test('Square configured but location not active: report verification failure while checkout stays paused',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async(url,opts)=>{
  assert.equal(String(url),'https://connect.squareup.com/v2/locations/a-location');
  assert.equal(opts.headers.Authorization,'Bearer private-token');
  return Response.json({location:{status:'INACTIVE',currency:'USD',capabilities:['CREDIT_CARD_PROCESSING']}});
 };
 try{
  const r=await check({SQUARE_ACCESS_TOKEN:'private-token',SQUARE_LOCATION_ID:'a-location'});
  assert.equal(r.checks.paymentProcessor,'location not verified');
 }finally{globalThis.fetch=original;}
});

test('Verified active Square location allows conditional retail verification',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({location:{status:'ACTIVE',currency:'USD',capabilities:['CREDIT_CARD_PROCESSING']}});
 try{
  const r=await check({...transactionEnv(),SQUARE_ACCESS_TOKEN:'private-token',SQUARE_LOCATION_ID:'a-location',ZIPTAX_API_KEY:'private-tax',CJ_API_KEY:'private-cj'});
  assert.equal(r.checks.paymentProcessor,'ready');
  assert.equal(r.configurationReadyForTesting,true);
  assert.equal(r.checkoutReadyForVerification,true);
  assert.equal(r.checkoutPaused,false);
 }finally{globalThis.fetch=original;}
});
