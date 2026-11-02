import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync('app.js','utf8');
const retail=readFileSync('real-products.js','utf8');
const bathroom=readFileSync('bathroom-shop.js','utf8');
const begin=app.indexOf('function reconcileRetailInstallationCart(items){');
const end=app.indexOf('\nfunction getCart(){',begin);
assert.ok(begin>=0&&end>begin,'shared installation reconciler exists');
const reconcile=new Function('items',app.slice(begin,end)+'\nreturn reconcileRetailInstallationCart(items);');
const product=(source,variant='v1')=>({
 source,productId:'bath-product',variantId:variant,department:'bathroom',
 name:'Bathroom Vanity Light',type:'Product',qty:2,price:65,installationRequested:true
});

test('Every Shopping product detail uses one installation checkbox and Add to Cart',()=>{
 for(const [name,source] of [['standard',retail],['bathroom',bathroom]]){
  assert.match(source,/I want Nik’s Remodeling to install this/,name);
  assert.match(source,/>Add to Cart</,name);
  assert.doesNotMatch(source,/Add Selected Product to Project Cart|Continue Bathroom Project & Add Labor/,name);
 }
});

test('Checked installation creates one visible labor cart line, not just a flag',()=>{
 const retailCart=reconcile([product('supplier-retail')]);
 const bathCart=reconcile([product('bathroom-retail')]);
 for(const cart of [retailCart,bathCart]){
  assert.equal(cart.length,2);
  const labor=cart.find(x=>x.source==='retail-installation');
  assert.ok(labor,'installation must be a separate cart item');
  assert.equal(labor.type,'Labor');
  assert.equal(labor.qty,2);
  assert.equal(labor.productId,'bath-product');
  assert.equal(labor.variantId,'v1');
  assert.equal(labor.hiddenFromCustomer,undefined);
  assert.equal(labor.pricingPending,true);
  assert.equal(reconcile(cart).length,2,'do not add labor twice');
 }
});

test('Linked labor follows correct variants, never stays after the product is removed',()=>{
 const cart=reconcile([product('supplier-retail','v1'),product('bathroom-retail','v2')]);
 assert.equal(cart.length,4);
 assert.equal(cart.filter(x=>x.type==='Labor').length,2);
 assert.equal(reconcile(cart.filter(x=>x.variantId!=='v1')).length,2);
 const unchecked={...product('bathroom-retail'),installationRequested:false};
 assert.equal(reconcile([unchecked,...cart.filter(x=>x.variantId==='v1'&&x.type==='Labor')]).length,1);
});
