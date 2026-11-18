import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

test('deferred Lumber script waits for app DOMContentLoaded page construction',()=>{
 const dom=new JSDOM('<!doctype html><html><body><main></main></body></html>',{
  url:'https://niksremodeling.com/material-lumber.html',runScripts:'dangerously'
 });
 try{
  const {document}=dom.window;
  Object.defineProperty(document,'readyState',{configurable:true,get:()=> 'interactive'});
  // app.js registered first; it creates the destination only at DOMContentLoaded.
  document.addEventListener('DOMContentLoaded',()=>{
   document.querySelector('main').innerHTML='<section><p class="lead"></p><div class="material-detail-grid"></div></section>';
  },{once:true});
  dom.window.fetch=async()=>({ok:true,json:async()=>({markupAlreadyIncluded:true,items:[]})});
  dom.window.eval(readFileSync('lumber-shop.js','utf8'));
  assert.equal(document.querySelector('.lumber-selector'),null,'deferred script must not boot too soon');
  document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  assert.ok(document.querySelector('.lumber-selector'),'lumber catalog must mount after app page render');
  assert.ok(document.querySelector('[data-size="2×6"]'),'size/quantity choices should appear on first visit');
 }finally{dom.window.close();}
});
