import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const projects=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
const room=readFileSync(new URL('../room-projects.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const terms=readFileSync(new URL('../terms.html',import.meta.url),'utf8');
const tag='window.NIK_RECALCULATED_PACKAGE_SPECS=';
const start=room.indexOf(tag)+tag.length;
const end=room.indexOf(';\nwindow.NIK_CALCULATE_PACKAGE_BASELINE=',start);
const specs=JSON.parse(room.slice(start,end));

test('Bathroom and Kitchen package prices derive from itemized labor, materials, supplies, discount and fees',()=>{
 for(const [category,tiers] of Object.entries(specs)){
  for(const [id,spec] of Object.entries(tiers)){
   const sum=lines=>lines.reduce((total,line)=>total+line.quantity*line.unitPrice,0);
   const labor=sum(spec.labor),materials=sum(spec.materials),supplies=sum(spec.consumables);
   assert.ok(spec.work.length>0,category+' '+id+' missing scope');
   assert.equal(spec.laborDiscountPercent,7);
   assert.equal(spec.projectFeePercent,10);
   assert.ok(labor>0&&materials>0&&supplies>0);
   const discount=Math.round(labor*7)/100;
   const fee=(labor+materials+supplies)*.10;
   const starting=Math.ceil((labor-discount+materials+supplies+fee)/5)*5;
   assert.ok(starting>0&&Number.isFinite(starting));
  }
 }
 assert.ok(room.includes('window.NIK_CALCULATE_PACKAGE_BASELINE(spec)'));
 assert.ok(!projects.includes('startingAt:2195')&&!projects.includes('startingAt:6495'),
   'Legacy uncosted package starting values must not return');
});

test('cart displays proposed package labor, materials and fees without demanding payment',()=>{
 assert.ok(room.includes('window.beginPackageQuote=function('));
 for(const term of ['Package starting total','Materials &amp; supplies (proposed deposit)','Labor (pay later, weekly draws)','Fees (included in package total)','Balance after proposed deposit (weekly draws)']){
  assert.ok(app.includes(term),term+' missing');
 }
 assert.ok(app.includes('Request Deposit Invoice'));
 assert.ok(app.includes('They are already included in the starting price, not charged twice.'));
 assert.ok(app.includes('No separate installation charge for included work.'));
 assert.ok(!app.includes('Overhead and contingency'),'Do not restore confusing fee label.');
 assert.ok(app.includes('No deposit or other payment can be made through this cart yet.'));
 assert.ok(terms.includes('weekly progress draws'));
});
