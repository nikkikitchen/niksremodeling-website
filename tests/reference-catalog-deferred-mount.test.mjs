import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

for(const [page,path] of [['Materials','/materials.html'],['Supplies','/supplies.html']]){
 test(page+' deferred price guide mounts after page DOM construction',()=>{
  const dom=new JSDOM('<!doctype html><html><body data-page="'+(page==='Materials'?'materials':'supplies')+'"></body></html>',{
   url:'https://niksremodeling.com'+path,runScripts:'dangerously'
  });
  try{
   const {document}=dom.window;
   Object.defineProperty(document,'readyState',{configurable:true,get:()=> 'interactive'});
   // The page renderer (app.js or an inline script) builds <main> on DOMContentLoaded.
   document.addEventListener('DOMContentLoaded',()=>{
    document.body.insertAdjacentHTML('beforeend','<main><div id="catalog-products"></div></main>');
   },{once:true});
   dom.window.fetch=async()=>({ok:true,json:async()=>({markupAlreadyIncluded:true,items:[]})});
   dom.window.eval(readFileSync('reference-catalog.js','utf8'));
   assert.equal(document.querySelector('.nr-reference-catalog'),null,'must wait for page renderer');
   document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
   assert.ok(document.querySelector('.nr-reference-catalog'),'price guide mounted after page renderer');
   assert.ok(document.querySelector('.nr-reference-plan'),'quantity planning list present');
  }finally{dom.window.close();}
 });
}
