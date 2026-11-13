import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const load=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const garage=load('data/package-bundle-baselines.json').baselines.garage.standard;
const materials=new Map(load('material-price-reference.json').items.map(x=>[x.id,x.price]));
const supplies=new Map(load('data/approved-supply-prices.json').items.map(x=>[x.id,x.price]));
const cents=n=>Math.round(n*100);
const cost=(entries,prices)=>entries.reduce((total,[id,qty])=>{
 assert.ok(prices.has(id),'Unmapped cost reference '+id);
 assert.ok(Number.isSafeInteger(qty)&&qty>0);
 return total+cents(prices.get(id)*qty);
},0);

test('Garage Standard starting estimate reconciles labor, discount, materials, supplies and fees',()=>{
 const materialsCents=cost(garage.materials,materials);
 const consumableCents=cost(garage.consumables,supplies)+cost(garage.materialConsumables||[],materials);
 const laborGrossCents=garage.labor.reduce((sum,[,qty,rate])=>sum+cents(qty*rate),0);
 const laborDiscountCents=Math.round(laborGrossCents*garage.laborDiscountPercent/100);
 const laborNetCents=laborGrossCents-laborDiscountCents;
 const feeMinimumCents=Math.round((materialsCents+consumableCents+laborGrossCents)*garage.projectFeePercent/100);
 const totalCents=Math.ceil((materialsCents+consumableCents+laborNetCents+feeMinimumCents)/500)*500;
 const feesCents=totalCents-materialsCents-consumableCents-laborNetCents;
 assert.equal(laborGrossCents,142500);
 assert.equal(laborDiscountCents,9975);
 assert.equal(materialsCents,38837);
 assert.equal(consumableCents,1958);
 assert.equal(materialsCents+consumableCents,40795);
 assert.equal(laborNetCents,132525);
 assert.equal(feesCents,18680);
 assert.equal(totalCents,192000);
 assert.equal(materialsCents+consumableCents+laborNetCents+feesCents,totalCents,
   'Deposit, labor and included fees must reconcile without duplicate charge');
});

test('Customer cart and terms do not promise weekly draws or enable payment',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const terms=readFileSync(new URL('../terms.html',import.meta.url),'utf8');
 assert.doesNotMatch(app,/labor in weekly draws|weekly draw amounts/i);
 assert.doesNotMatch(terms,/weekly progress draws/i);
 assert.match(app,/labor draws tied to approved work completed/i);
 assert.match(terms,/progress draws tied to completed work/i);
 assert.match(app,/if\(button\)button\.disabled=true; \/\/ Never enable/);
});
