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


test('Package summary shows proposed deposit and deferred balance, including missing-cost warning',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const start=app.indexOf('function cartCheckoutSummary(items){');
 const end=app.indexOf('\nfunction cartShoppingChoices(',start);
 const fn=new Function('items','serviceEstimateSummary','customEstimate','requiresInPersonQuote',app.slice(start,end)+'\nreturn cartCheckoutSummary(items);');
 const svc=()=>({hasServices:false,total:0,pending:false});
 const pkg=deposit=>({name:'Garage Standard',source:'room-project-package',type:'Service',price:null,qty:1,startingAt:1920,depositEstimate:deposit,laborEstimate:1325.25,overheadAllowance:186.8,quoteRequired:true});
 const priced=fn([pkg(407.95)],svc,()=>false,()=>false);
 assert.match(priced,/Materials &amp; supplies deposit \(included\)/);
 assert.match(priced,/\$407\.95/);
 assert.match(priced,/Estimated balance after deposit \(paid as work is completed\)/);
 assert.match(priced,/\$1,512\.05/);
 assert.match(priced,/id="cart-pay-button"[^>]*disabled/);
 const pending=fn([pkg(null)],svc,()=>false,()=>false);
 assert.match(pending,/deposit itemization pending/);
 assert.match(pending,/To be itemized/);
 assert.match(pending,/id="cart-pay-button"[^>]*disabled/);
});


test('Package shipping remains pending even when retail CJ shipping is quoted',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const start=app.indexOf('function cartCheckoutSummary(items){');
 const end=app.indexOf('\nfunction cartShoppingChoices(',start);
 const render=new Function('items','serviceEstimateSummary','customEstimate','requiresInPersonQuote',app.slice(start,end)+'\nreturn cartCheckoutSummary(items);');
 const service=()=>({hasServices:false,total:0,pending:false});
 const cart=[
  {name:'Garage Standard',type:'Service',source:'room-project-package',qty:1,price:null,
   startingAt:1920,depositEstimate:407.95,laborEstimate:1325.25,overheadAllowance:186.8},
  {name:'Retail light',type:'Product',source:'supplier-retail',qty:1,price:100,
   productId:'1992983344353558529',variantId:'1992983344424861698'}
 ];
 const html=render(cart,service,()=>false,()=>false);
 assert.match(html,/Enter ZIP for retail items; package delivery pending/);
 assert.match(html,/data-pending="true"/);
 assert.match(html,/data-package-deposit-cents="40795"/);
 assert.match(html,/\$507\.95/);
 assert.match(html,/\$2,020\.00/);
 assert.match(html,/id="cart-pay-button"[^>]*disabled/);
});
