import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/cart-shipping.js';

const PIDS=['1992983344353558529','1992915023801270274','1993033437579866113'];
const VIDS=['1992983344424861698','1992915023850000001','1993033437590000001'];
const items=PIDS.map((productId,i)=>({
  productId,variantId:VIDS[i],quantity:1,name:['Dual-tap tower','Lavatory faucet','Towel item'][i]
}));
const json=(data,result=true)=>({ok:true,json:async()=>({result,data})});
const context=products=>({
 request:new Request('https://niksremodeling.com/api/cart-shipping',{
  method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},
  body:JSON.stringify({zip:'36269',items:products})
 }),
 env:{CJ_ACCESS_TOKEN:'unit-test-only'}
});
function mockCJ({combinedCharge=null,unquotableIndex=-1}={}) {
 return async (url,opts={})=>{
  const path=String(url);
  if(path.includes('/product/query?')) {
   const id=new URL(path).searchParams.get('pid');
   const index=PIDS.indexOf(id);
   assert.notEqual(index,-1);
   return json({productNameEn:items[index].name,variants:[{
    vid:VIDS[index],variantSku:'TEST'+index,variantSellPrice:100,
    variantWeight:1000
   }]});
  }
  if(path.includes('/product/stock/queryByVid?'))
   return json([{countryCode:'US',cjInventory:7}]);
  if(path.includes('/logistic/freightCalculateTip'))
   return json([]);
  if(path.includes('/logistic/freightCalculate')) {
   const body=JSON.parse(opts.body);
   const products=body.products;
   if(products.length>1)
     return combinedCharge===null ? json([],false)
      :json([{logisticName:'CJ combined service',totalPostageFee:combinedCharge}]);
   const index=VIDS.indexOf(products[0].vid);
   if(index===unquotableIndex)return json([]);
   return json([{logisticName:'CJ individual service',totalPostageFee:10*(index+1)}]);
  }
  throw Error('Unexpected supplier URL '+path);
 };
}
test('one ZIP obtains a confirmed rate for every cart item when CJ cannot quote mixed freight',async()=>{
 const original=global.fetch;
 global.fetch=mockCJ();
 try {
  const response=await onRequestPost(context(items));
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.zip,'36269');
  assert.equal(body.units,3);
  assert.equal(body.productLines,3);
  assert.equal(body.quoteMode,'separate-lines');
  assert.equal(body.deliveryCents,8100); // (10 + 20 + 30) * retail markup
  assert.equal(body.shippingMethod,'CJ individual service');
 }finally{global.fetch=original;}
});
test('one ZIP uses supplier verified combined shipping instead of charging individual shipping again',async()=>{
 const original=global.fetch;
 global.fetch=mockCJ({combinedCharge:12});
 try {
  const response=await onRequestPost(context(items));
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.quoteMode,'combined');
  assert.equal(body.deliveryCents,1620);
 }finally{global.fetch=original;}
});
test('missing freight for one item identifies the item, never shows a partial or zero charge',async()=>{
 const original=global.fetch;
 global.fetch=mockCJ({unquotableIndex:2});
 try{
  const response=await onRequestPost(context(items));
  assert.equal(response.status,503);
  const body=await response.json();
  assert.match(body.error,/Towel item/);
  assert.match(body.error,/No partial shipping total/);
  assert.equal(body.deliveryCents,undefined);
  assert.equal(body.unavailable?.length,1);
 }finally{global.fetch=original;}
});
