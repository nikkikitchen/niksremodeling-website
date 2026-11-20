import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const shop=readFileSync(new URL('../material-shop.js',import.meta.url),'utf8');
function setup(path,body){
 const dom=new JSDOM('<!doctype html><html><head></head><body '+(path==='/materials.html'?'data-page="materials"':'data-page="material-detail" data-material="drywall"')+'><main>'+body+'</main></body></html>',{url:'https://niksremodeling.com'+path,runScripts:'outside-only'});
 dom.window.eval(shop);
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
test('Materials landing renders one text-only full page with accessible direct categories',()=>{
 const dom=setup('/materials.html','<section id="catalog-products"><img src="/old.jpg"></section><div class="legacy">Old calculator</div>');
 try{
  const d=dom.window.document;
  assert.equal(d.querySelector('main h1')?.textContent,'Shop Building Materials');
  assert.equal(d.querySelectorAll('main .nr-material-menu a').length,11);
  assert.equal(d.querySelector('main a[href="/material-lumber.html"]')?.textContent.includes('Lumber'),true);
  assert.ok(d.querySelector('main a[href="/supplies.html"]'));
  assert.equal(d.querySelector('.legacy'),null);
  assert.equal(d.querySelector('main img'),null);
 }finally{dom.window.close();}
});
test('Drywall shopping keeps distinct sizes and consolidates repeat quantities without prices',()=>{
 const html='<div class="wrap"><div class="material-detail-grid">'+
 '<div class="material-option-card"><h3>Drywall Panels</h3></div>'+
 '<div class="material-option-card"><h3>Moisture Resistant Board</h3></div></div>'+
 '<div class="products store-card-grid"><img src="/old.jpg"></div></div>';
 const dom=setup('/material-drywall.html',html);
 try{
  const d=dom.window.document;
  assert.equal(d.querySelectorAll('.material-detail-grid').length,0);
  assert.equal(d.querySelectorAll('.products.store-card-grid').length,0);
  assert.ok(d.querySelector('.nr-material-selector'));
  const buttons=[...d.querySelectorAll('.nr-material-option')];
  buttons.find(x=>x.textContent==='5/8 in').click();
  d.querySelector('.nr-material-stepper button[aria-label="Add ten"]').click();
  d.querySelector('.nr-material-add').click();
  let cart=JSON.parse(dom.window.localStorage.getItem('nr-cart'));
  assert.equal(cart.length,1);
  assert.equal(cart[0].qty,11);
  assert.match(cart[0].name,/5\/8 in/);
  assert.equal(cart[0].price,null);
  assert.equal(cart[0].quoteRequired,true);
  d.querySelector('.nr-material-add').click();
  cart=JSON.parse(dom.window.localStorage.getItem('nr-cart'));
  assert.equal(cart.length,1);
  assert.equal(cart[0].qty,12);
  d.querySelector('.nr-material-option').click();
  d.querySelector('.nr-material-add').click();
  cart=JSON.parse(dom.window.localStorage.getItem('nr-cart'));
  assert.equal(cart.length,2);
 }finally{dom.window.close();}
});

test('Other-material navigation excludes the current category on both clean and HTML URLs',()=>{
 for(const path of ['/material-drywall','/material-drywall.html']){
  const dom=setup(path,'<div class="wrap"><div class="material-detail-grid"><article class="material-option-card"><h3>Drywall Panels</h3></article></div></div>');
  try{
   const d=dom.window.document;
   assert.ok(d.querySelector('.nr-material-selector'),path);
   const hrefs=[...d.querySelectorAll('.nr-material-more .nr-material-menu a')].map(a=>a.getAttribute('href'));
   assert.equal(hrefs.length,10,path);
   assert.equal(hrefs.includes('/material-drywall.html'),false,path);
   assert.ok(hrefs.includes('/material-flooring.html'),path);
  }finally{dom.window.close();}
 }
});
