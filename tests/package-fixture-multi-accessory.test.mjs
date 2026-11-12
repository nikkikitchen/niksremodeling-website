import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const code=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const a=code.indexOf('const NR_PACKAGE_FIXTURE_SLOTS='),b=code.indexOf('function projectEstimateMarkup(',a);
assert.ok(a>0&&b>a);
const reconcile=new Function(code.slice(a,b)+'\nreturn reconcileProjectPackageFixtureChoices;')();
const pkg=(tier)=>({
 source:'room-project-package',projectId:'bathrooms',packageId:tier,startingAt:1600,
 priceBasis:{materials:[{name:'Bathroom accessories',unitPrice:tier==='basic'?45:70}]}
});
const product=(name,price,quantity=1,id=name)=>({
 source:'bathroom-retail',department:'bathroom',name,price,qty:quantity,productId:id,variantId:'v'
});
const charge=items=>items.reduce((a,x)=>a+Number(x.price)*(Number(x.qty)||1),0);
test('Basic allowance covers two separate accessories up to the shared $45 limit',()=>{
 const cart=[pkg('basic'),product('Towel bar',20),product('Toilet paper holder',20)];
 const out=reconcile(cart).slice(1);
 assert.equal(charge(out),0);
 assert.equal(out.reduce((v,x)=>v+(x.packageAllowanceCredit||0),0),40);
});
test('Two accessories above the category allowance charge only the difference',()=>{
 const out=reconcile([pkg('basic'),product('Towel bar',30),product('Toilet paper holder',30)]).slice(1);
 assert.equal(charge(out),15);
 assert.equal(out.reduce((v,x)=>v+(x.packageAllowanceCredit||0),0),45);
});
test('Deluxe 3-piece accessory set consumes one shared $70 allowance',()=>{
 const out=reconcile([pkg('deluxe'),product('3-Piece Bathroom Hardware Accessories Set',66.10),
   product('Towel bar',15)]).slice(1);
 assert.equal(Math.round(charge(out)*100),1500);
 assert.equal(out[0].packageAllowanceCredit,66.1);
 assert.equal(out[1].packageAllowanceCredit,undefined);
});
test('Unspecified accessory sets cannot automatically consume included installation slots',()=>{
 const out=reconcile([pkg('deluxe'),product('Bathroom accessory set',55)]).slice(1);
 assert.equal(charge(out),55);
 assert.equal(out[0].packageAllowanceCredit,undefined);
});
test('Ordinary standalone toilet remains fully priced even in a Deluxe Bathroom refresh',()=>{
 const out=reconcile([pkg('deluxe'),product('Deluxe smart toilet',300)]).slice(1);
 assert.equal(charge(out),300);
});
