import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/store-checkout.js';

test('Square checkout stays blocked even if old payment credentials and flags are configured', async()=>{
  const request=new Request('https://niksremodeling.com/api/store-checkout',{
    method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
    body:JSON.stringify({zip:'36269',expectedTotal:10000,requestId:'quote-only-test-id123'})
  });
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async()=>{throw Error('Payment or supplier APIs must not be contacted in quote-only mode');};
  try{
    const response=await onRequestPost({request,env:{
      STORE_CHECKOUT_ENABLED:'true',STORE_ALLOWED_ZIPS:'36269',
      SQUARE_ACCESS_TOKEN:'old-enabled-token',SQUARE_LOCATION_ID:'old-location',
      STORE_TAX_ID:'old-tax'
    }});
    assert.equal(response.status,503);
    assert.equal(response.headers.get('Cache-Control'),'no-store');
    const data=await response.json();
    assert.equal(data.checkoutEnabled,false);
    assert.match(data.error,/payments are not available/i);
  }finally{globalThis.fetch=originalFetch;}
});
