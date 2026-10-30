import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf('function reconcileBathroomFixtureAllowances(');
const end=app.indexOf('function projectEstimateMarkup(',start);
assert.ok(start>=0&&end>start,'Toilet fixture matching helper must be present');
const reconcile=new Function(app.slice(start,end)+';return reconcileBathroomFixtureAllowances;')();

function install({kind='standard',qty=1,own=false}={}){
 const smart=kind==='smart',fixture=own?0:smart?2000:300,labor=smart?650:175,supplies=smart?100:75;
 return {type:'Labor',source:'project-calculator',
  packageId:smart?'smart-toilet-install':'toilet-install',packageQuantity:qty,
  price:(labor+supplies+fixture)*qty,internalCosts:{labor,supplies,fixture}};
}
function product({kind='round',price=400,qty=1}={}){
 return {type:'Product',source:'bathroom-retail',bathroomFixtureType:'toilets',toiletStyle:kind,price,qty,name:'Selected toilet'};
}
const total=items=>items.reduce((sum,x)=>sum+Number(x.price)*(Number(x.qty)||1),0);

test('one verified round or elongated toilet replaces only its standard fixture allowance',()=>{
 for(const kind of ['round','elongated']){
  const raw=[install(),product({kind})],result=reconcile(raw);
  assert.equal(result[0].price,250);
  assert.equal(total(result),650);
  assert.equal(raw[0].price,550,'original cart must remain unchanged');
 }
});
test('adding a toilet later and removing it restores original fixture allowance',()=>{
 const labor=install(),selected=product();
 assert.equal(total(reconcile([labor])),550);
 assert.equal(total(reconcile([labor,selected])),650);
 assert.equal(total(reconcile([labor])),550);
});
test('one toilet of two replaces only one allowance',()=>{
 const result=reconcile([install({qty:2}),product()]);
 assert.equal(result[0].price,800);
 assert.equal(total(result),1200);
});
test('already customer-supplied fixture has no extra allowance to remove',()=>{
 const result=reconcile([install({own:true}),product()]);
 assert.equal(result[0].price,250);
 assert.equal(total(result),650);
});
test('smart toilet matches only smart installation while wall-hung is not treated as standard labor',()=>{
 const smart=reconcile([install({kind:'smart'}),product({kind:'smart',price:2200})]);
 assert.equal(smart[0].price,750);
 assert.equal(total(smart),2950);
 const specialty=reconcile([install(),product({kind:'specialty',price:450})]);
 assert.equal(specialty[0].price,550,'wall-hung installation must be quoted separately');
});
test('retail products without a matching toilet installation do not alter labor prices',()=>{
 const result=reconcile([install(),{...product(),bathroomFixtureType:'lighting'}]);
 assert.equal(result[0].price,550);
});

test('unlabeled verified standard toilet uses normal installation while a wall-hung model does not',()=>{
 const ordinary=reconcile([install(),{...product(),toiletStyle:null,name:'Classic two-piece porcelain toilet'}]);
 assert.equal(ordinary[0].price,250);
 const wall=reconcile([install(),{...product({kind:'smart'}),name:'Smart wall-mounted toilet'}]);
 assert.equal(wall[0].price,550);
});
