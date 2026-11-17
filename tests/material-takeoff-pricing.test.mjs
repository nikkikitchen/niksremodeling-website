import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function openCalculator(kind,product){
 const html=readFileSync('calculators.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const file=src.split('?')[0].replace(/^\//,'');
  return existsSync(file)?'<script>'+readFileSync(file,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 const browserErrors=[];
 const dom=new JSDOM(html,{
  url:'https://niksremodeling.com/calculators.html?'+new URLSearchParams({mode:'materials',material:kind,product}),
  runScripts:'dangerously',pretendToBeVisual:true,
  beforeParse(w){
   w.HTMLElement.prototype.scrollIntoView=function(){};
   w.scrollTo=()=>{};
   w.addEventListener('error',e=>browserErrors.push(e.message));
  }
 });
 for(let attempt=0;attempt<70;attempt++){
  if(dom.window.document.querySelector('.material-only-workflow')&&
    typeof dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE==='function')break;
  await new Promise(r=>setTimeout(r,35));
 }
 assert.ok(dom.window.document.querySelector('.material-only-workflow'),'Material calculator did not initialize: '+browserErrors.join(' | '));
 assert.equal(typeof dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE,'function');
 return dom;
}
function calculate(dom,inputs){
 for(const [id,value] of Object.entries(inputs))dom.window.document.getElementById(id).value=String(value);
 dom.window.calcMaterial();
 const error=dom.window.document.getElementById('mat-error');
 assert.ok(error.hidden,error.textContent);
 const entry=dom.window.eval('materialEstimates').at(-1);
 assert.ok(entry);
 return entry;
}
function money(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)}

test('standard drywall is priced at marked-up reference selling rate once and flows into a non-payable cart estimate',async()=>{
 const dom=await openCalculator('drywall','Drywall — Drywall Panels');
 try{
  const item=calculate(dom,{'dry-length':12,'dry-height':8,'dry-openings':0,'dry-sheet':32});
  const quote=dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE(item);
  assert.equal(quote.referenceId,2);
  assert.equal(quote.units,4);
  assert.equal(quote.unitPrice,21.94);
  assert.equal(quote.subtotal,87.76);
  assert.equal(quote.markupAlreadyIncluded,true);
  const price=dom.window.document.querySelector('.nr-reference-quote');
  assert.ok(price);
  assert.match(price.textContent,/\$87\.76/);
  assert.match(price.textContent,/35% materials markup already included/);
  const add=[...dom.window.document.querySelectorAll('.material-result button')].find(x=>x.textContent==='Add materials estimate to cart');
  assert.ok(add,'priced material Add to Cart button must be rendered. Found: '+[...dom.window.document.querySelectorAll('.material-result button')].map(x=>x.textContent).join(' | ')+'; quote ancestry: '+price.parentElement?.outerHTML.slice(0,900));
  add.click();
  const cart=JSON.parse(dom.window.localStorage.getItem('nr-cart'));
  assert.ok(Array.isArray(cart),'Add to Cart must persist the reference estimate');
  assert.equal(cart.length,1);
  assert.equal(cart[0].referenceSubtotal,87.76);
  assert.equal(cart[0].quoteRequired,true);
  assert.equal(cart[0].price,null);
  assert.equal(cart[0].referenceOnly,true);
 }finally{dom.window.close()}
});
test('known compound, plywood, lumber and trim get standard reference amounts, never 35% added again',async()=>{
 const samples=[
  {kind:'custom',product:'Drywall — Joint Compound',inputs:{'custom-quantity':2},total:56.70,id:33,units:2},
  {kind:'custom',product:'Lumber — Plywood',inputs:{'custom-quantity':3},total:210.60,id:4,units:3},
  {kind:'custom',product:'Lumber — OSB & Sheathing',inputs:{'custom-quantity':2},total:49.96,id:3,units:2},
  {kind:'lumber',product:'Lumber — Framing Lumber',inputs:{'wood-length':12,'wood-height':8,'wood-spacing':16},total:67.20,id:1,units:12},
  {kind:'custom',product:'Trim & Molding — Baseboards',inputs:{'custom-quantity':24},total:64.80,id:14,units:3}
 ];
 for(const c of samples){
  const dom=await openCalculator(c.kind,c.product);
  try{
   const item=calculate(dom,c.inputs);
   const quote=dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE(item);
   assert.ok(quote,c.product);
   assert.equal(quote.referenceId,c.id,c.product);
   assert.equal(quote.units,c.units,c.product);
   assert.equal(quote.subtotal,c.total,c.product);
   assert.ok(dom.window.document.querySelector('.nr-reference-quote').textContent.includes(money(c.total)),c.product);
  }finally{dom.window.close()}
 }
});
test('do not guess prices for nonstandard drywall, specialty materials, unknown pack sizes or chosen brands',async()=>{
 const dom=await openCalculator('drywall','Drywall — Drywall Panels');
 try{
  const item=calculate(dom,{'dry-length':12,'dry-height':8,'dry-sheet':48});
  assert.equal(dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE(item),null);
  const base={...item,product:'Drywall — Moisture Resistant Board',measurements:{...item.measurements,sheetArea:32}};
  assert.equal(dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE(base),null);
  const brand={...base,product:'Drywall — Drywall Panels',exact:{brand:'Manufacturer'}};
  assert.equal(dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE(brand),null);
  assert.equal(dom.window.NIK_STANDALONE_MATERIAL_ESTIMATE({...item,product:'Roofing — Metal Roofing',type:'custom'}),null);
 }finally{dom.window.close()}
});
test('reference material cart lines display their estimated amounts but remain quote-only',()=>{
 const source=readFileSync('app.js','utf8');
 assert.match(source,/referencePlanningTotal/);
 assert.match(source,/referenceOnly:true,quoteRequired:true,pricingPending:true/);
 assert.match(source,/source==='material-price-reference'/);
 assert.match(source,/Reference materials estimate:/);
});
