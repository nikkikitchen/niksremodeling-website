import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const script=readFileSync('lumber-shop.js','utf8');
const reference=JSON.parse(readFileSync('material-price-reference.json','utf8'));

function openLumber(){
 const dom=new JSDOM('<!doctype html><main><section><p class="lead"></p><div class="material-detail-grid"></div></section></main>',{
   url:'https://niksremodeling.com/material-lumber.html',runScripts:'dangerously'
 });
 dom.window.fetch=async()=>({ok:true,json:async()=>reference});
 dom.window.eval(script);
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
const settle=()=>new Promise(resolve=>setTimeout(resolve,20));
function row(doc,group,size){
 const result=[...doc.querySelectorAll('.wood-product-row')].find(node=>node.dataset.group===group&&node.dataset.size===size);
 assert.ok(result,group+' '+size+' should be listed');
 return result;
}
function set(dom,node,value){
 node.value=value;
 node.dispatchEvent(new dom.window.Event('change',{bubbles:true}));
}

test('material lumber includes current wood catalog and publishing config',()=>{
 assert.match(readFileSync('material-lumber.html','utf8'),/src="\/lumber-shop\.js\?v=20261118d"/);
 assert.match(readFileSync('scripts/build.mjs','utf8'),/'lumber-shop\.js'/);
});
test('all lumber categories, board sizes and only two grades are visible',async()=>{
 const dom=openLumber();
 try{
  await settle();
  const doc=dom.window.document;
  const groups=[...doc.querySelectorAll('.wood-family')];
  assert.equal(groups.length,5);
  assert.ok(doc.querySelector('.lumber-selector'));
  assert.equal(doc.querySelectorAll('.lumber-categories button').length,0,'retired one-active-category selector');
  for(const size of ['2×4','2×6','2×8','2×10','2×12']){
   const selection=row(doc,'Interior framing lumber',size);
   const fields=selection.querySelectorAll('select');
   assert.deepEqual([...fields[0].options].map(o=>o.value),['8','12','16']);
   assert.deepEqual([...fields[2].options].map(o=>o.value),['Standard / construction','Premium / select']);
  }
  row(doc,'Pressure-treated & exterior framing','2×8');
  row(doc,'Posts & timbers','4×4');
  row(doc,'Deck surface boards','5/4×6');
  row(doc,'Deck joists & framing','2×12');
  assert.equal(doc.querySelector('[data-group="Interior & finish boards"]'),null);
  assert.equal(doc.querySelector('[data-group="Plywood & OSB"]'),null);
  assert.equal(doc.querySelectorAll('.wood-family img').length,0,'lumber choices should not require photos');
  assert.doesNotMatch(doc.querySelector('.lumber-selector').textContent,/Calculate Materials|Stud spacing/);
 }finally{dom.window.close();}
});
test('Wood separately lists finish boards and sheet goods',async()=>{
 const dom=new JSDOM('<!doctype html><main><section><p class="lead"></p><div class="material-detail-grid"></div></section></main>',{url:'https://niksremodeling.com/material-wood.html',runScripts:'dangerously'});
 dom.window.fetch=async()=>({ok:true,json:async()=>reference});
 dom.window.eval(script);
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 try{
  await settle();
  const doc=dom.window.document;
  assert.equal(doc.querySelectorAll('.wood-family').length,2);
  row(doc,'Interior & finish boards','1×4');
  row(doc,'Plywood & OSB','3/4-in ACX plywood');
  assert.equal(doc.querySelector('[data-group="Interior framing lumber"]'),null);
  assert.ok(doc.querySelector('.wood-list'));
 }finally{dom.window.close();}
});
test('quantity 24 uses exact 2x4x8 reference, other grades and lengths require quotes',async()=>{
 const dom=openLumber();
 try{
  await settle();
  const doc=dom.window.document,selection=row(doc,'Interior framing lumber','2×4');
  const fields=selection.querySelectorAll('select');
  const qty=selection.querySelector('input[type="number"]');
  set(dom,qty,'24');
  assert.match(selection.querySelector('.wood-price').textContent,/\$134\.40/);
  selection.querySelector('button').click();
  let list=JSON.parse(dom.window.localStorage.getItem('nr-wood-lumber-list-v2'));
  assert.equal(list[0].qty,24);
  assert.match(doc.querySelector('.wood-total').textContent,/\$134\.40/);
  set(dom,fields[2],'Premium / select');
  assert.match(selection.querySelector('.wood-price').textContent,/Quote required/);
  set(dom,fields[0],'12');
  assert.match(selection.querySelector('.wood-price').textContent,/Quote required/);
  set(dom,fields[0],'8');
  set(dom,fields[2],'Standard / construction');
  assert.match(selection.querySelector('.wood-price').textContent,/\$134\.40/);
  const outside=row(doc,'Pressure-treated & exterior framing','2×4');
  const treatments=outside.querySelectorAll('select');
  set(dom,treatments[1],'Pressure-treated ground-contact');
  assert.match(outside.querySelector('.wood-price').textContent,/Quote required/);
  outside.querySelector('button').click();
  list=JSON.parse(dom.window.localStorage.getItem('nr-wood-lumber-list-v2'));
  assert.equal(list.length,2);
  assert.match(doc.querySelector('.wood-total').textContent,/1 item type\(s\) require a quote/);
  assert.doesNotMatch(doc.querySelector('.lumber-selector').textContent,/Pay with Square|Proceed to checkout/);
 }finally{dom.window.close();}
});