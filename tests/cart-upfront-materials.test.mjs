import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync('app.js','utf8');
const start=source.indexOf('function cartCheckoutSummary(items){');
const end=source.indexOf('\nfunction cartShoppingChoices(',start);
assert.ok(start>=0&&end>start,'cart summary function exists');
const checkout=new Function('items','serviceEstimateSummary','customEstimate','requiresInPersonQuote',
 source.slice(start,end)+'\nreturn cartCheckoutSummary(items);');
const serviceSummary=items=>({
 hasServices:true,
 total:items.filter(x=>x.type==='Labor').reduce((s,x)=>s+Number(x.price||0)*(Number(x.qty)||1),0),
 pending:false
});
const make=(packagePrice,fixtureReplaced=0)=>[
 {name:'Bathroom installation package',type:'Labor',source:'project-calculator',qty:1,
  packageQuantity:2,price:packagePrice,internalCosts:{labor:300,supplies:50,fixture:100},
  fixtureAllowanceReplaced:fixtureReplaced},
 {name:'Beer conversion kit',type:'Product',source:'supplier-retail',
  qty:1,price:200,productId:'p1',variantId:'v1'}
];
const render=items=>checkout(items,serviceSummary,()=>false,()=>false);

test('Due now includes materials inside a labor package but excludes the labor itself',()=>{
 const html=render(make(900));
 assert.match(html,/Products &amp; materials<\/span><strong>\$500\.00/);
 assert.match(html,/Labor<\/span><strong>\$600\.00/);
 assert.match(html,/id="cart-tax-amount">\$40\.00/);
 assert.match(html,/id="cart-estimated-total"[^>]*>\$1,140\.00/);
 assert.match(html,/id="cart-due-now">\$540\.00/);
});

test('Replacing a packaged fixture does not charge its allowance twice',()=>{
 const html=render(make(800,100));
 assert.match(html,/Products &amp; materials<\/span><strong>\$400\.00/);
 assert.match(html,/Labor<\/span><strong>\$600\.00/);
 assert.match(html,/id="cart-tax-amount">\$32\.00/);
 assert.match(html,/id="cart-estimated-total"[^>]*>\$1,032\.00/);
 assert.match(html,/id="cart-due-now">\$432\.00/);
});
