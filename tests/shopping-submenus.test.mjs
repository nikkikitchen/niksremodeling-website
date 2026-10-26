import {bathroomCatalog} from '../bathroom-catalog.js';
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
 w.__furniture={catalog,categories,inCategory};w.__retail={retailCatalog};w.__bathroom={bathroomCatalog};
 script(readFileSync('shopping-flow.js','utf8')
  .replace("import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__furniture)")
  .replace("import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__retail)")
  .replace("import('/bathroom-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__bathroom)"));
 await new Promise(r=>setTimeout(r,40));return dom;
}

test('all Shopping departments have matching, alphabetical submenus with stock markers',async()=>{
 const dom=await open();
 try{
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=dom.window.document.getElementById(id);
   const departments=[...menu.querySelectorAll(':scope > .shopping-branch nav')].map(nav=>nav.getAttribute('aria-label').replace(/ categories$/,''));
   assert.deepEqual(departments,[
    'Appliances','Bathroom Fixtures','Cabinets','Doors, Windows & Access',
    'Electrical, Lighting & Smart Home','Exterior, Decks & Outdoor',
    'Flooring, Walls & Finishes','Furniture & Accessories','Heating, Ventilation & Audio',
    'Kitchen & Plumbing','Materials','Tools','Other'
   ]);
   const appliance=menu.querySelector('#'+id+'-appliances');
   assert.deepEqual([...appliance.querySelectorAll('a')].map(a=>a.textContent),["Beverage Equipment", "Built-In Microwaves", "Coffee Systems", "Cords & Connections", "Dishwashers", "Double Wall Ovens", "Dryer Vent Kits", "Electric Cooktops", "Electric Dryers", "Electric Ranges", "Fireplace Inserts", "Garbage Disposals", "Gas Cooktops", "Gas Dryers", "Gas Ranges", "Microwave/Oven Combos", "Microwaves & Hoods", "Over-Range Microwaves", "Refrigerators", "Single Wall Ovens", "Stacked Washer/Dryer Sets", "Trash Compactors", "Wall Ovens & Cooktops", "Warming Drawers", "Washers & Electric Dryers"].sort((a,b)=>a.localeCompare(b)));
   assert.match(appliance.querySelector('a[href*="Dishwashers"]').href,/appliances\.html\?category=Dishwashers#catalog-products$/);
   assert.equal(appliance.querySelector('a[href*="Dishwashers"]').classList.contains('shopping-empty'),false);
   assert.equal(appliance.querySelector('a[href*="Gas%20Ranges"]').classList.contains('shopping-empty'),false,'Gas ranges now contain verified supplier listings');
   for(const branch of menu.querySelectorAll(':scope > .shopping-branch')){
    const entries=[...branch.querySelectorAll('.shopping-submenu a')];assert.ok(entries.length >= (branch.querySelector('button')?.textContent.includes('Other')?1:6));
    assert.equal(new Set(entries.map(a=>a.href)).size,entries.length);
    assert.deepEqual(entries.map(a=>a.textContent),entries.map(a=>a.textContent).sort((a,b)=>a.localeCompare(b)));
   }
   assert.equal(menu.lastElementChild.textContent,'Red dot = No items listed yet.');
   const walls=menu.querySelector('#'+id+'--shop-installed-flooring-walls-finishes');
   assert.ok(walls,'Flooring, Walls & Finishes dropdown missing');
   assert.ok([...walls.querySelectorAll('a')].some(a=>a.textContent==='Tile'),'Shopping should say Tile');
   assert.equal([...walls.querySelectorAll('a')].some(a=>a.textContent==='Tile Backsplash'),false,'Backsplash is not a floor product');
   assert.ok([...walls.querySelectorAll('a')].some(a=>a.textContent==='Wallpaper'),'Wallpaper is a shippable product type');
   assert.equal([...menu.querySelectorAll('a')].some(a=>a.getAttribute('href')==='/project.html?project=custom'),false,'Custom labor never belongs in Shopping');
  }
 }finally{dom.window.close();}
});

test('unverified installable product categories do not falsely show empty dots',async()=>{
 const dom=await open();
 try{
  for(const id of ['shopping-menu','mobile-shopping-menu']){
   const menu=dom.window.document.getElementById(id);
   const unlisted=menu.querySelector('a[href*="shop-installed.html?item=doors-windows-access-attic-access-ladders"]');
   assert.ok(unlisted,'Installable-product link must be discoverable');
   assert.equal(unlisted.classList.contains('shopping-empty'),false,'Unverified keyword searches must not falsely indicate empty stock');
   const emptyGroup=[...menu.querySelectorAll('.shopping-branch')].find(b=>b.querySelector('button')?.textContent.includes('Doors, Windows & Access'));
   assert.ok(emptyGroup,'Specialty department must remain navigable when some item counts are unknown');
   const quoteGroup=[...menu.querySelectorAll('.shopping-branch')].find(b=>b.querySelector('button')?.textContent.includes('Other Ideas'));
   assert.equal(quoteGroup,undefined,'Custom labor and project ideas must not appear in Shopping');
   const cabinet=menu.querySelector('a[href*="category=Storage%20Cabinets"]');
   assert.ok(cabinet&&!cabinet.classList.contains('shopping-empty'),'Populated products must not show a red dot');
   const material=menu.querySelector('a[href*="/material-flooring.html"]');
   assert.ok(material&&!material.classList.contains('shopping-empty'),'Stocked flooring materials must not be marked empty');
  }
 }finally{dom.window.close()}
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

test('desktop hover stays open across the department-to-submenu boundary and closes only after leaving Shopping',async()=>{
 const dom=await open(true);
 try{
  const w=dom.window,branch=w.document.querySelector('#shopping-menu .shopping-branch'),button=branch.querySelector('button');
  branch.dispatchEvent(new w.MouseEvent('mouseenter'));assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(branch.querySelector('nav').hidden,false);
  branch.dispatchEvent(new w.MouseEvent('mouseleave'));assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(branch.querySelector('nav').hidden,false);
  const wrapper=branch.closest('.nav-menu');
  wrapper.dispatchEvent(new w.MouseEvent('mouseleave'));
  assert.equal(button.getAttribute('aria-expanded'),'true');
  await new Promise(r=>setTimeout(r,380));
  assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(branch.querySelector('nav').hidden,true);
 }finally{dom.window.close();}
});

test('returning to Shopping before the hover grace period keeps the submenu open without a click',async()=>{
 const dom=await open(true);
 try{
  const w=dom.window,menu=w.document.getElementById('shopping-menu'),wrapper=menu.parentElement;
  const branch=menu.querySelector('.shopping-branch'),button=branch.querySelector('button');
  menu.dispatchEvent(new w.MouseEvent('mouseenter'));branch.dispatchEvent(new w.MouseEvent('mouseenter'));
  wrapper.dispatchEvent(new w.MouseEvent('mouseleave'));menu.dispatchEvent(new w.MouseEvent('mouseenter'));
  await new Promise(r=>setTimeout(r,380));
  assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(wrapper.classList.contains('open'),true);
  assert.equal(w.location.href,'https://niksremodeling.com/appliances.html');
 }finally{dom.window.close();}
});

test('long desktop menus scroll and lower flyouts stay inside the viewport',async()=>{
 const dom=await open(true);
 try{
  const w=dom.window;
  Object.defineProperty(w,'innerWidth',{value:1200,configurable:true});
  Object.defineProperty(w,'innerHeight',{value:600,configurable:true});
  const menu=w.document.getElementById('shopping-menu');
  const branch=menu.querySelector('.shopping-branch');
  const submenu=branch.querySelector('nav');
  menu.getBoundingClientRect=()=>({top:160,left:800,right:1040});
  branch.getBoundingClientRect=()=>({top:530});
  Object.defineProperty(submenu,'scrollHeight',{value:900});
  branch.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(menu.style.getPropertyValue('--shopping-menu-height'),'424px');
  assert.equal(submenu.style.getPropertyValue('--shopping-submenu-top'),'12px');
  const last=[...menu.querySelectorAll(':scope > .shopping-branch')].at(-1);
  last.getBoundingClientRect=()=>({top:570});
  last.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(last.querySelector('nav').style.getPropertyValue('--shopping-submenu-top'),'12px');
  assert.equal(last.querySelector('nav').style.getPropertyValue('--shopping-submenu-height'),'568px');
  assert.equal(submenu.style.getPropertyValue('--shopping-submenu-left'),'520px');
  assert.equal(submenu.style.getPropertyValue('--shopping-submenu-height'),'568px');
  Object.defineProperty(w,'innerHeight',{value:400,configurable:true});
  w.dispatchEvent(new w.Event('resize'));
  assert.equal(menu.style.getPropertyValue('--shopping-menu-height'),'224px');
  assert.equal(last.querySelector('nav').style.getPropertyValue('--shopping-submenu-height'),'368px','Open flyout must resize with the viewport');
 }finally{dom.window.close();}
});
