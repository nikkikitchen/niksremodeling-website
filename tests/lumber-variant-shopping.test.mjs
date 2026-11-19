import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const script=readFileSync('lumber-shop.js','utf8');
const ref=JSON.parse(readFileSync('material-price-reference.json','utf8'));
function load(path='/material-lumber.html',items=[]){
 const dom=new JSDOM('<main><section><p class="lead"></p><div class="material-detail-grid"></div></section></main>',{url:'https://niksremodeling.com'+path,runScripts:'dangerously'});
 dom.window.localStorage.setItem('nr-cart',JSON.stringify(items));
 dom.window.fetch=async()=>({ok:true,json:async()=>ref});
 dom.window.eval(script);
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
const data=dom=>JSON.parse(dom.window.localStorage.getItem('nr-cart'));
const choose=(doc,selector,v)=>{
 const b=[...doc.querySelectorAll(selector)].find(x=>x.dataset.value===v);
 assert.ok(b,selector+' '+v);b.click();
};
test('both Wood and Lumber show the same compact catalog, not a long chart',async()=>{
 assert.match(readFileSync('material-lumber.html','utf8'),/lumber-shop\.js\?v=20261119a/);
 for(const path of ['/material-lumber.html','/material-wood.html']){
  const dom=load(path);
  try{
   await tick();const d=dom.window.document;
   assert.ok(d.querySelector('.lumber-selector'));
   assert.equal(d.querySelector('.wood-category-select').options.length,12);
   assert.equal(d.querySelectorAll('.wood-size-choice').length,8);
   assert.equal(d.querySelectorAll('.wood-product-row').length,0);
   assert.equal(d.querySelector('input'),null,'no typing');
   assert.ok(d.querySelector('.wood-list'));
   assert.ok(d.querySelector('.wood-view-cart')||d.querySelector('a[href="/project-cart.html"]'));
  }finally{dom.window.close()}
 }
});
test('single item picker offers plus/minus and keeps added items in the real site cart',async()=>{
 const dom=load('/material-lumber.html',[{name:'Toilet',qty:1,type:'Product',source:'supplier-retail',price:200}]);
 try{
  await tick();const d=dom.window.document;
  const category=d.querySelector('.wood-category-select');
  category.value='Interior framing lumber';category.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
  choose(d,'.wood-size-choice','2×4');choose(d,'.wood-length-choice','8');
  d.querySelector('.wood-qty-ten').click();d.querySelector('.wood-qty-plus').click();
  assert.equal(d.querySelector('.wood-qty-value').textContent,'12');
  assert.match(d.querySelector('.wood-price').textContent,/\$67\.20/);
  d.querySelector('.wood-add').click();
  let cart=data(dom);assert.equal(cart.length,2);assert.equal(cart[0].name,'Toilet');
  assert.equal(cart[1].qty,12);assert.equal(cart[1].price,null);assert.equal(cart[1].quoteRequired,true);
  assert.equal(cart[1].referenceSubtotal,67.2);
  assert.match(d.querySelector('.wood-cart-bar').textContent,/13 items in cart/);
  assert.equal(d.querySelector('.wood-qty-value').textContent,'1');
  d.querySelector('.wood-add').click();assert.equal(data(dom)[1].qty,13,'same selection merges');
  choose(d,'.wood-size-choice','2×6');d.querySelector('.wood-add').click();
  cart=data(dom);assert.equal(cart.length,3);
  assert.equal(cart[2].referenceSubtotal,null);
  assert.match(d.querySelector('.wood-cart-lines').textContent,/Price to confirm/);
  assert.equal(d.querySelector('.wood-category-select').value,'Interior framing lumber');
 }finally{dom.window.close()}
});
test('one category at a time, all wood-based families accessible',async()=>{
 const dom=load('/material-wood.html');
 try{
  await tick();const d=dom.window.document,s=d.querySelector('.wood-category-select');
  for(const [g,v] of [['Plywood & OSB','3/4-in ACX plywood'],['Wood trim & molding','3.25-in baseboard'],['Wood shims','8-in wood shims'],['Posts & timbers','4×4']]){
   s.value=g;s.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
   assert.ok([...d.querySelectorAll('.wood-size-choice')].some(button=>button.dataset.value===v),'Category '+g+' should offer '+v);
   choose(d,'.wood-size-choice',v);
   assert.equal(d.querySelector('.wood-size-choice.selected').dataset.value,v);
  }
  d.querySelector('.wood-add').click();assert.equal(data(dom)[0].source,'wood-lumber-reference');
  const addOne=d.querySelector('.wood-cart-counter button[aria-label^="Add one"]');
  addOne.click();assert.equal(data(dom)[0].qty,2);
  d.querySelector('.wood-cart-remove').click();assert.equal(data(dom).length,0);
 }finally{dom.window.close()}
});

test('deck project combines posts, joists and decking in the same cart without switching categories',async()=>{
 const dom=load('/material-lumber.html');
 try{
  await tick();const d=dom.window.document;
  assert.equal(d.querySelector('.wood-category-select').value,'Deck project lumber');
  assert.equal(d.querySelectorAll('.wood-quick-button').length,4);
  choose(d,'.wood-size-choice','4×4');
  assert.ok([...d.querySelectorAll('.wood-kind-choice')].some(x=>x.dataset.value==='Pressure-treated ground-contact'));
  assert.ok(![...d.querySelectorAll('.wood-kind-choice')].some(x=>x.dataset.value==='Cedar'),'do not allow cedar for structural posts');
  d.querySelector('.wood-qty-plus').click();d.querySelector('.wood-add').click();
  choose(d,'.wood-size-choice','2×8');
  d.querySelector('.wood-qty-ten').click();d.querySelector('.wood-add').click();
  choose(d,'.wood-size-choice','5/4×6');
  assert.ok([...d.querySelectorAll('.wood-kind-choice')].some(x=>x.dataset.value==='Cedar'));
  assert.ok(![...d.querySelectorAll('.wood-kind-choice')].some(x=>x.dataset.value==='Untreated'));
  d.querySelector('.wood-qty-ten').click();d.querySelector('.wood-qty-ten').click();
  d.querySelector('.wood-qty-plus').click();d.querySelector('.wood-qty-plus').click();d.querySelector('.wood-qty-plus').click();
  d.querySelector('.wood-add').click();
  const cart=data(dom);
  assert.equal(cart.length,3);
  assert.deepEqual(cart.map(x=>x.qty),[2,11,24]);
  assert.equal(new Set(cart.map(x=>x.woodKey)).size,3);
  assert.ok(cart.every(x=>x.price===null&&x.quoteRequired===true),'unverified selections must not be charged');
  assert.equal(d.querySelector('.wood-category-select').value,'Deck project lumber');
  assert.match(d.querySelector('.wood-cart-bar').textContent,/37 items in cart/);
  d.querySelector('.wood-quick-button[data-group="Plywood & OSB"]').click();
  assert.equal(d.querySelector('.wood-category-select').value,'Plywood & OSB');
  assert.equal(data(dom).length,3,'switching shortcuts must not clear the cart');
 }finally{dom.window.close()}
});

test('deep links into trim and deck open the requested section',async()=>{
 for(const [hash,expected] of [['#wood-wood-trim-molding','Wood trim & molding'],['#deck-lumber','Deck project lumber']]){
  const dom=load('/material-lumber.html'+hash);
  try{await tick();assert.equal(dom.window.document.querySelector('.wood-category-select').value,expected);}
  finally{dom.window.close()}
 }
});
