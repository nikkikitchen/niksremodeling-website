import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function open(){
 const dom=new JSDOM('<body></body>',{url:'https://niksremodeling.com/materials.html',runScripts:'dangerously'});
 const w=dom.window;
 w.matchMedia=()=>({matches:false});
 const script=text=>{const node=w.document.createElement('script');node.textContent=text;w.document.body.append(node);};
 script(readFileSync('app.js','utf8'));
 w.eval('document.body.innerHTML=header()');
 script(readFileSync('shopping-flow.js','utf8').replaceAll(/import\([^)]*\)/g,'Promise.resolve({})'));
 await new Promise(resolve=>setTimeout(resolve,30));
 return dom;
}

test('Shopping has one simple, consistent set of destinations on desktop and mobile',async()=>{
 const dom=await open();
 try{
  const expected=[
   ['All Shopping','/shopping.html'],
   ['Appliances','/appliances.html'],
   ['Bathroom Fixtures','/bathroom.html'],
   ['Cabinets','/cabinets.html'],
   ['Furniture & Accessories','/furniture.html'],
   ['Materials','/materials.html'],
   ['Tools','/products.html'],
   ['Supplies','/supplies.html'],
   ['Other','/other.html']
  ];
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=dom.window.document.getElementById(id);
   assert.ok(menu,id+' exists');
   const links=[...menu.querySelectorAll(':scope > a')].map(a=>[a.textContent,a.getAttribute('href')]);
   assert.deepEqual(links,expected,id+' shows exactly the intended routes');
   assert.equal(menu.querySelectorAll('.shopping-branch,.shopping-submenu,.shopping-category-toggle').length,0,'No nested flyouts');
   assert.equal(new Set(links.map(x=>x[1])).size,expected.length,'No duplicated routes');
   assert.equal(menu.querySelectorAll('.shopping-empty,.shopping-availability-note,.shopping-tile-legend').length,0);
   assert.equal(menu.querySelector('a[href="/materials.html"]').getAttribute('aria-current'),'page');
  }
 }finally{dom.window.close();}
});

test('Shopping keeps the work/cart separation and direct specialty category pages',async()=>{
 const dom=await open();
 try{
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=dom.window.document.getElementById(id);
   assert.ok(menu.querySelector('a[href="/supplies.html"]'));
   assert.ok(menu.querySelector('a[href="/materials.html"]'));
   assert.ok(menu.querySelector('a[href="/shopping.html"]'));
   assert.equal(menu.querySelectorAll('a[href*="project=custom"],a[href*="calculators.html"],a[href*="shop-installed.html"]').length,0);
  }
  assert.ok(dom.window.document.querySelector('a[href="/project-cart.html"]'),'Cart is accessible');
 }finally{dom.window.close();}
});

test('desktop and mobile Shopping dropdowns are accessible without nested state',async()=>{
 const dom=await open();
 try{
  const w=dom.window;
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=w.document.getElementById(id);
   const toggle=w.document.querySelector('[aria-controls="'+id+'"]');
   assert.ok(toggle,'Dropdown toggle exists');
   toggle.click();
   assert.equal(toggle.getAttribute('aria-expanded'),'true');
   assert.ok(menu.querySelector('a[href="/supplies.html"]'));
   toggle.click();
   assert.equal(toggle.getAttribute('aria-expanded'),'false');
  }
 }finally{dom.window.close();}
});
