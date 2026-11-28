import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const source=read('room-projects.js');
const published=JSON.parse(read('docs/package-audit-2026-11-13.json'));
const provisional=JSON.parse(source.match(/window\.NIK_PROVISIONAL_PACKAGE_PRICES=(\{.*?\});\nfor\(const \[id,tiers\]/s)?.[1]||'null');

function extractJsonObject(marker) {
 const start=source.indexOf(marker);
 assert.ok(start>=0,marker+' missing');
 const position=start+marker.length;
 let depth=0,inside=false,escape=false;
 for(let i=position;i<source.length;i++){
  const c=source[i];
  if(inside){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')inside=false;}
  else if(c==='"')inside=true;
  else if(c==='{')depth++;
  else if(c==='}'&&!--depth)return JSON.parse(source.slice(position,i+1));
 }
 throw Error('Unterminated '+marker);
}
const recalculated=extractJsonObject('window.NIK_RECALCULATED_PACKAGE_SPECS=');
const prices=new Map(published.flatMap(group=>group.packages.map(p=>{
 const match=p.price.match(/Starting at \$([\d,]+)/);
 return [ [group.id,p.name.toLowerCase()].join(':'),match?Number(match[1].replaceAll(',','')):null ];
})));
const cents=value=>Math.round(Number(value)*100);
function componentTotal(lines){
 return lines.reduce((total,line)=>{
  assert.ok(Number.isSafeInteger(line.quantity)&&line.quantity>0,line.name+' invalid qty');
  assert.ok(Number.isFinite(line.unitPrice)&&line.unitPrice>=0,line.name+' invalid price');
  return total+cents(line.quantity*line.unitPrice);
 },0);
}
function minimum(spec){
 const materials=componentTotal(spec.materials),consumables=componentTotal(spec.consumables),labor=componentTotal(spec.labor);
 const discount=Math.round(labor*spec.laborDiscountPercent/100);
 const fees=Math.round((materials+consumables+labor)*spec.projectFeePercent/100);
 return Math.ceil((materials+consumables+labor-discount+fees)/500)*5;
}

test('all 27 provisional and five bathroom/kitchen costed starting prices cover recorded formula',()=>{
 const combined=[...Object.entries(provisional).flatMap(([id,tiers])=>Object.entries(tiers).map(([tier,spec])=>({id,tier,spec}))),
   ...Object.entries(recalculated).flatMap(([id,tiers])=>Object.entries(tiers).map(([tier,spec])=>({id,tier,spec})))];
 assert.equal(combined.length,32);
 for(const {id,tier,spec} of combined){
  const actual=prices.get(id+':'+tier);
  assert.ok(actual!==null&&actual!==undefined,'Missing published price '+id+' '+tier);
  assert.ok(actual>=minimum(spec),id+' '+tier+' price below computed baseline: '+actual+' < '+minimum(spec));
 }
});

test('never treat an unpriced package as approved for payment',()=>{
 const entries=published.flatMap(group=>group.packages.map(p=>({id:group.id,name:p.name,price:p.price})));
 assert.equal(entries.length,172,'Audit snapshot changed: review scope coverage');
 for(const entry of entries){
  assert.match(entry.price,/Starting at \$[\d,]+|Project quote required|Individually quoted/,'Unknown package price status '+entry.id+' '+entry.name);
 }
});

test('costed estimates must not be confused with verified actual cash profitability',()=>{
 assert.match(source,/priceStatus='quote-required'/);
 assert.match(source,/price:null,quoteRequired:true/);
});
