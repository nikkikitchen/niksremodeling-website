import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {catalog,categories,inCategory} from '../store-catalog.js';
import {retailCatalog} from '../retail-catalog.js';

async function open(hover=false){
 const dom=new JSDOM('<body></body>',{url:'https://niksremodeling.com/appliances.html',runScripts:'dangerously'});
 const w=dom.window;w.matchMedia=()=>({matches:hover});
 const script=text=>{const node=w.document.createElement('script');node.textContent=text;w.document.body.append(node);};
 script(readFileSync('app.js','utf8'));script(readFileSync('room-projects.js','utf8'));
 w.eval('document.body.innerHTML=header()');
 w.__furniture={catalog,categories,inCategory};w.__retail={retailCatalog};
 script(readFileSync('shopping-flow.js','utf8')
  .replace("import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__furniture)")
  .replace("import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__retail)"));
 await new Promise(r=>setTimeout(r,40));return dom;
}

test('all Shopping departments have matching, alphabetical submenus with stock markers',async()=>{
 const dom=await open();
 try{
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=dom.window.document.getElementById(id);
   assert.equal(menu.querySelectorAll(':scope > .shopping-branch').length,7);
   const appliance=menu.querySelector('#'+id+'-appliances');
   assert.deepEqual([...appliance.querySelectorAll('a')].map(a=>a.textContent),['Cords & Connections','Dishwashers','Electric Ranges','Gas Dryers','Gas Ranges','Microwaves & Hoods','Refrigerators','Wall Ovens & Cooktops','Washers & Electric Dryers']);
   assert.match(appliance.querySelector('a[href*="Dishwashers"]').href,/appliances\.html\?category=Dishwashers#catalog-products$/);
   assert.equal(appliance.querySelector('a[href*="Dishwashers"]').classList.contains('shopping-empty'),false);
   assert.equal(appliance.querySelector('a[href*="Gas%20Ranges"]').classList.contains('shopping-empty'),true);
   for(const branch of menu.querySelectorAll(':scope > .shopping-branch')){
    const entries=[...branch.querySelectorAll('.shopping-submenu a')];assert.ok(entries.length>=6);
    assert.equal(new Set(entries.map(a=>a.href)).size,entries.length);
    assert.deepEqual(entries.map(a=>a.textContent),entries.map(a=>a.textContent).sort((a,b)=>a.localeCompare(b)));
   }
   assert.equal(menu.lastElementChild.textContent,'Red dot = No items listed yet.');
  }
 }finally{dom.window.close();}
});

test('tap and keyboard open submenus, close siblings, and return focus without navigation',async()=>{
 const dom=await open();
 try{
  const w=dom.window,menu=w.document.getElementById('mobile-shopping-menu'),branches=menu.querySelectorAll(':scope > .shopping-branch');
  const first=branches[0].querySelector('button'),second=branches[1].querySelector('button');
  first.click();assert.equal(first.getAttribute('aria-expanded'),'true');
  second.click();assert.equal(first.getAttribute('aria-expanded'),'false');assert.equal(second.getAttribute('aria-expanded'),'true');
  second.click();assert.equal(second.getAttribute('aria-expanded'),'false');
  first.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  assert.equal(w.document.activeElement,branches[0].querySelector('nav a'));
  w.document.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(first.getAttribute('aria-expanded'),'false');assert.equal(w.document.activeElement,first);
  assert.equal(w.location.href,'https://niksremodeling.com/appliances.html');
 }finally{dom.window.close();}
});

test('desktop hover opens a department and leaving it closes the submenu',async()=>{
 const dom=await open(true);
 try{
  const w=dom.window,branch=w.document.querySelector('#shopping-menu .shopping-branch'),button=branch.querySelector('button');
  branch.dispatchEvent(new w.MouseEvent('mouseenter'));assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(branch.querySelector('nav').hidden,false);
  branch.dispatchEvent(new w.MouseEvent('mouseleave'));assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(branch.querySelector('nav').hidden,true);
 }finally{dom.window.close();}
});
