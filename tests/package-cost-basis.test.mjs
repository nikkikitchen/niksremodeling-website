import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const draft=JSON.parse(read('data/package-bundle-baselines.json')).baselines;
const materials=new Map(JSON.parse(read('material-price-reference.json')).items.map(x=>[x.id,x]));
const supplies=new Map(JSON.parse(read('data/approved-supply-prices.json')).items.map(x=>[x.id,x]));
const code=read('room-projects.js');
const matched=code.match(/window\.NIK_PROVISIONAL_PACKAGE_PRICES=(\{.*?\});\nfor\(const \[id,tiers\]/s);
assert.ok(matched,'Embedded draft package baselines should exist');
const live=JSON.parse(matched[1]);
function get(entries,map){
 return entries.map(([id,quantity])=>{
  const p=map.get(id);
  assert.ok(p,'Missing catalog item '+id);
  assert.ok(Number.isInteger(quantity)&&quantity>0);
  return {name:p.name,quantity,unitPrice:p.price};
 });
}
test('All provisional package prices match source materials, supplies and 7 percent labor discount',()=>{
 for(const [id,tiers] of Object.entries(draft)){
  if(id==='wallpaper'){assert.equal(live[id],undefined);continue;}
  for(const [tier,spec] of Object.entries(tiers)){
   const p=live[id]?.[tier];assert.ok(p,id+' '+tier+' not embedded');
   assert.equal(p.priceStatus,'research-provisional');
   assert.deepEqual(p.work,spec.work);
   assert.equal(p.scenario,spec.scenario);
   assert.deepEqual(p.materials,get(spec.materials,materials));
   assert.deepEqual(p.consumables,[...get(spec.consumables,supplies),...get(spec.materialConsumables||[],materials)]);
   assert.deepEqual(p.labor,spec.labor.map(([name,quantity,unitPrice])=>({name,quantity,unitPrice})));
   assert.equal(p.laborDiscountPercent,7);
   assert.equal(p.projectFeePercent,10);
   assert.ok([...p.materials,...p.consumables,...p.labor].every(x=>x.quantity>0&&x.unitPrice>0));
  }
 }
});
test('Paint consumables use tape and sandpaper from correct reference, not bucket and lid',()=>{
 const list=live['bedroom-guest-room'].basic.consumables;
 assert.equal(list.find(x=>x.name.startsWith('Painters Tape'))?.unitPrice,11.48);
 assert.equal(list.find(x=>x.name.startsWith('Sandpaper Sheets'))?.unitPrice,8.10);
 assert.equal(list.some(x=>/Bucket Lid|Plastic 5-Gallon Bucket/.test(x.name)),false);
});
