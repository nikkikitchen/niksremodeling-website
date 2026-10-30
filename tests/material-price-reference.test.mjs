import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync('material-prices.js','utf8');
const reference=JSON.parse(readFileSync('material-price-reference.json','utf8'));
function simpleDom(page='not-rendered'){
 const dom=new JSDOM('<!doctype html><body data-page="'+page+'"></body>',{url:'https://niksremodeling.com/',runScripts:'dangerously'});
 dom.window.eval(source);
 return dom;
}
function priced(window,name,qty,unit,other={}){
 const item={products:[{name,quantity:qty,unit,...other}]};
 return {updated:window.NIK_PRICE_PROJECT_PRODUCTS(item),product:item.products[0]};
}

test('All uploaded material prices are unchanged, marked-up, and reference-only',()=>{
 const dom=simpleDom(),w=dom.window;
 assert.equal(reference.markupAlreadyIncluded,true);
 assert.equal(reference.items.length,56);
 assert.deepEqual(JSON.parse(JSON.stringify(w.NIK_MATERIAL_REFERENCE)),reference);
 assert.equal(w.NIK_MATERIAL_REFERENCE.items.length,52);
 assert.ok(reference.items.every(x=>x.price>0&&x.unit&&x.name));
 assert.equal(w.NIK_MATERIAL_PRICE_FOR('Vinyl Plank Flooring').price,3.78);
 assert.equal(w.NIK_MATERIAL_PRICE_FOR('4x8 Sheet of 1/2-in Drywall').price,21.94);
 assert.equal(w.NIK_MATERIAL_PRICE_FOR('Porcelain Ceramic Tile').price,3.38);
 dom.window.close();
});

test('Project calculator uses missing fallback material prices with safe package units',()=>{
 const dom=simpleDom(),w=dom.window;
 const lvp=priced(w,'Luxury Vinyl Plank (LVP)',160,'sq. ft.');
 assert.ok(lvp.updated);assert.equal(lvp.product.price,604.8);
 assert.equal(lvp.product.referencePriceId,12);
 assert.equal(lvp.product.referenceOnly,true);
 assert.equal(priced(w,'Floor Tile',120,'sq. ft.').product.price,405.6);
 assert.equal(priced(w,'Drywall Panels',5,'Sheets').product.price,109.7);
 assert.equal(priced(w,'OSB & Sheathing',3,'Sheets').product.price,74.94);
 assert.equal(priced(w,'Baseboards',26,'Linear feet').product.price,64.8);
 assert.equal(priced(w,'Quarter Round',17,'Linear feet').product.price,31.38);
 assert.equal(priced(w,'Concrete Mix',7,'Bags').product.price,54.32);
 assert.equal(priced(w,'Vinyl Plank Flooring',100,'Boxes').updated,false,'Do not mistake boxes for square feet');
 assert.equal(priced(w,'Concrete Mix',4,'Cubic yards').updated,false,'Do not treat yards as bags');
 assert.equal(priced(w,'Underlayment',100,'sq. ft.').updated,false,'No made-up price for unlisted underlayment');
 const approved=priced(w,'Interior Paint',3,'Gallons',{price:150});
 assert.equal(approved.updated,false);assert.equal(approved.product.price,150);
 const supplier=priced(w,'Luxury Vinyl Plank (LVP)',100,'sq. ft.',{source:'supplier-retail'});
 assert.equal(supplier.updated,false);
 dom.window.close();
});

test('Reference page displays every material alphabetically without claiming live stock',async()=>{
 const dom=new JSDOM('<!doctype html><body data-page="material-prices"></body>',{
  url:'https://niksremodeling.com/material-price-reference.html',runScripts:'dangerously',
  beforeParse(w){w.header=()=>'<header>Header</header>';w.footer=()=>'<footer>Footer</footer>';w.updateCartCount=()=>{};w.initNavMenus=()=>{};}
 });
 dom.window.eval(source);
 await new Promise(r=>setTimeout(r,20));
 const doc=dom.window.document;
 const rows=[...doc.querySelectorAll('.reference-material-prices tbody tr')];
 assert.equal(rows.length,56);
 const labels=rows.map(tr=>tr.firstElementChild.textContent);
 assert.deepEqual(labels,labels.slice().sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'})));
 assert.equal(doc.querySelectorAll('.reference-material-prices a[href*="checkout"]').length,0);
 assert.match(doc.querySelector('.reference-material-prices .calc-note').textContent,/not confirmed U.S. warehouse stock/i);
 dom.window.close();
});

async function openCalculator(query){
 const html=readFileSync('calculators.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 const dom=new JSDOM(html,{
  url:'https://niksremodeling.com/calculators.html'+query,
  runScripts:'dangerously',pretendToBeVisual:true,
  beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.alert=()=>{};}
 });
 await new Promise(resolve=>setTimeout(resolve,150));
 dom.window.eval(source);
 return dom;
}

test('LVP from Projects displays updated material allowance and carries it to cart',async()=>{
 const dom=await openCalculator('?project=bathrooms&work=floor&material=flooring&room=Bathroom&location=interior&materials=Luxury%20Vinyl%20Plank%20(LVP)');
 try{
  const w=dom.window,d=w.document;
  assert.equal(d.querySelectorAll('#question-padding').length,1,'Padding question remains single');
  d.getElementById('floor-length').value='12';d.getElementById('floor-width').value='12';
  w.calcMaterial();
  assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
  const estimate=w.eval('materialEstimates')[0];
  assert.ok(estimate?.products.length);
  const product=estimate.products.find(x=>x.name==='Luxury Vinyl Plank (LVP)');
  assert.ok(product);
  assert.equal(product.referencePriceId,12);
  assert.ok(product.price>0);
  assert.match(d.querySelector('.project-total-price').textContent,/\$/);
  w.addProjectToCart();
  const cart=w.getCart();
  assert.ok(cart.some(x=>x.type==='Material estimate'&&x.price===product.price));
  assert.ok(cart.some(x=>x.type==='Labor'),'Approved labor still independent');
 }finally{dom.window.close();}
});