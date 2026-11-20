import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

// Script tags marked defer run while the document may be "interactive".
// app.js builds both pages at DOMContentLoaded, so shopping must wait for that.
const shop=readFileSync(new URL('../material-shop.js',import.meta.url),'utf8');

for(const page of ['materials','material-detail']){
 test('deferred Materials selector waits for app DOMContentLoaded on '+page,()=>{
  const slug=page==='material-detail'?' data-material="drywall"':'';
  const url=page==='materials'?'materials.html':'material-drywall.html';
  const dom=new JSDOM('<!doctype html><html><body data-page="'+page+'"'+slug+'><main></main></body></html>',{
   url:'https://niksremodeling.com/'+url,
   runScripts:'outside-only'
  });
  try{
   const {document}=dom.window;
   Object.defineProperty(document,'readyState',{configurable:true,get:()=> 'interactive'});
   // app.js' listener is registered first, but its page has not been rendered yet.
   document.addEventListener('DOMContentLoaded',()=>{
    if(page==='materials'){
     document.querySelector('main').innerHTML='<section><div class="wrap"><h1>Legacy materials</h1></div></section>';
    }else{
     document.querySelector('main').innerHTML='<section><div class="wrap"><div class="material-detail-grid"><article class="material-option-card"><h3>Drywall Panels</h3></article></div></div></section>';
    }
   },{once:true});
   dom.window.eval(shop);
   assert.equal(document.querySelector('.nr-material-selector'),null,'selector must not mount before app.js');
   assert.equal(document.querySelector('main').children.length,0,'page still awaiting app.js');
   document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
   if(page==='materials'){
    assert.equal(document.querySelector('main h1').textContent,'Shop Building Materials');
    assert.equal(document.querySelectorAll('.nr-material-menu a').length,11);
   }else{
    assert.ok(document.querySelector('.nr-material-selector'),'drywall picker appears after app page');
    assert.equal(document.querySelector('.material-detail-grid'),null,'legacy grid replaced');
    assert.ok(document.querySelector('.nr-material-add'),'quantity cart action exists');
   }
  }finally{
   dom.window.close();
  }
 });
}
