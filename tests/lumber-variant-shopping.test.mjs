import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const script=readFileSync('lumber-shop.js','utf8');
const reference=JSON.parse(readFileSync('material-price-reference.json','utf8'));
const build=readFileSync('scripts/build.mjs','utf8');

function openLumber(){
 const dom=new JSDOM('<!doctype html><main><section><p class="lead">Lumber</p><div class="material-detail-grid"></div></section></main>',{
  url:'https://niksremodeling.com/material-lumber.html',
  runScripts:'dangerously'
 });
 dom.window.fetch=async()=>({ok:true,json:async()=>reference});
 dom.window.eval(script);
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
async function settled(){
 await new Promise(resolve=>setTimeout(resolve,20));
}
function field(doc,label){
 const root=[...doc.querySelectorAll('.lumber-field')].find(x=>x.textContent.includes(label));
 assert.ok(root,'Missing '+label);
 return root.querySelector('input,select');
}
function set(dom,control,value){
 control.value=value;
 control.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
}

test('wood variant selector is included in the actual publish list',()=>{
 assert.match(readFileSync('material-lumber.html','utf8'),/src="\/lumber-shop\.js/);
 assert.match(build,/'lumber-shop\.js'/);
});
test('wood and decking reference prices apply once to exact size, length and treatment',async()=>{
 const dom=openLumber();
 try{
  await settled();
  const doc=dom.window.document;
  const size=field(doc,'Board dimensions'),length=field(doc,'Length');
  const treatment=field(doc,'Type / treatment'),qty=field(doc,'Number of pieces');
  assert.equal(size.value,'2×4');
  assert.equal(length.value,'8');
  assert.equal(treatment.value,'Standard framing');
  assert.match(doc.querySelector('.lumber-output').textContent,/\$5\.60/);
  set(dom,qty,'3');
  assert.match(doc.querySelector('.lumber-output').textContent,/\$16\.80/);
  const deck=[...doc.querySelectorAll('.lumber-categories button')].find(x=>x.textContent==='Deck surface boards');
  deck.click();
  assert.equal(size.value,'5/4×6');
  assert.equal(length.value,'12');
  assert.equal(treatment.value,'Pressure-treated (rating unverified)');
  assert.match(doc.querySelector('.lumber-output').textContent,/\$22\.28/);
  assert.match(doc.querySelector('.lumber-output').textContent,/\$66\.84/);
  set(dom,treatment,'Pressure-treated ground-contact');
  assert.match(doc.querySelector('.lumber-output').textContent,/Exact variant: quote required/);
  assert.doesNotMatch(doc.querySelector('.lumber-output').textContent,/\$22\.28/,'Do not silently substitute an unverified treatment rating');
  const save=doc.querySelector('.lumber-actions button');
  save.click();
  const requests=JSON.parse(dom.window.localStorage.getItem('nr-wood-lumber-list-v1'));
  assert.equal(requests.length,1);
  assert.equal(requests[0].price,null,'Unverified grade must not become zero-dollar purchasable item');
  set(dom,treatment,'Pressure-treated (rating unverified)');
  set(dom,qty,'2');
  save.click();
  const list=JSON.parse(dom.window.localStorage.getItem('nr-wood-lumber-list-v1'));
  assert.equal(list.length,2);
  assert.equal(list[1].qty,2);
  assert.equal(list[1].price,22.28);
  assert.match(doc.querySelector('.wood-total').textContent,/\$44\.56/);
  assert.match(doc.querySelector('.wood-total').textContent,/1 item type\(s\) still need a quote/);
  assert.doesNotMatch(doc.querySelector('.lumber-selector').textContent,/Pay with Square|Proceed to checkout/);
 }finally{dom.window.close();}
});
