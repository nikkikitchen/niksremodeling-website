import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../bathroom-shop.js',import.meta.url),'utf8');
const start=source.indexOf(' const packageSlotRules=');
const end=source.indexOf(' const product=params.get(\'product\');',start);
assert.ok(start>0&&end>start,'Package shopping rules should exist');
const evaluate=new Function('params','getCart','bathroomNames','URLSearchParams',
 source.slice(start,end)+
 ' return {slot,packageBudget,shopParams,type,eligibleForPackage};');
const pkg=(tier='deluxe',allowance=150)=>({
 source:'room-project-package',projectId:'bathrooms',packageId:tier,
 priceBasis:{materials:[{name:'Standard vanity light',unitPrice:allowance}]}
});
const route=(params,cart)=>evaluate(new URLSearchParams(params),()=>cart,
 {lighting:'Bathroom Lighting',accessories:'Mirrors & Accessories'},URLSearchParams);

test('package shopping ignores forged high allowance and uses actual saved package',()=>{
 const view=route('packageShop=light&packageBudget=9999&packageTier=deluxe',[pkg('standard',150)]);
 assert.equal(view.packageBudget,150);
 assert.equal(view.type,'lighting');
 assert.equal(view.eligibleForPackage('Bathroom vanity light',12500),true);
 assert.equal(view.eligibleForPackage('Bathroom vanity light',14500),false); // 8% reserve
 assert.equal(view.eligibleForPackage('Standard toilet',100),false);
});
test('unowned package slot is never treated as an included fixture category',()=>{
 const view=route('packageShop=light&packageBudget=150',[pkg('basic',150)]);
 assert.equal(view.slot,null);
 assert.equal(view.packageBudget,null);
});
test('no package or multiple package contexts cannot silently authorize allowance',()=>{
 assert.equal(route('packageShop=light&packageBudget=9999',[]).slot,null);
 assert.equal(route('packageShop=light&packageBudget=9999',[pkg(),pkg()]).slot,null);
});
test('cheap eligible fixtures in Deluxe are allowed regardless of price tier',()=>{
 const view=route('packageShop=light',[pkg('deluxe',150)]);
 assert.equal(view.eligibleForPackage('Bathroom vanity light',4300),true);
 assert.equal(view.eligibleForPackage('Bathroom vanity light',16000),false);
});
test('only the matching fixture category is eligible in package shopping',()=>{
 const view=route('packageShop=mirror',[pkg('deluxe',150)]);
 assert.equal(view.type,'accessories');
 assert.equal(view.eligibleForPackage('Round black wall mirror',4000),true);
 assert.equal(view.eligibleForPackage('Bathroom vanity cabinet',4000),false);
});
