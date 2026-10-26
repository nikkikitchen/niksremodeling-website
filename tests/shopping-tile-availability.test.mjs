import {bathroomCatalog} from '../bathroom-catalog.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {catalog,inCategory} from '../store-catalog.js';
import {retailCatalog} from '../retail-catalog.js';

const source=readFileSync(new URL('../shopping-flow.js',import.meta.url),'utf8')
 .replace("import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__furniture)")
 .replace("import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__retail)")
  .replace("import('/bathroom-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__bathroom)");
const tick=()=>new Promise(r=>setTimeout(r,15));
const tile=(id,href)=>`<a id="${id}" class="photo-category-tile" href="${href}"><img alt=""><span><strong>${id}</strong></span></a>`;
function open(html){
 const dom=new JSDOM('<body>'+html+'</body>',{url:'https://niksremodeling.com/appliances.html',runScripts:'outside-only'});
 dom.window.__furniture={catalog,inCategory};dom.window.__retail={retailCatalog};dom.window.__bathroom={bathroomCatalog};dom.window.eval(source);return dom;
}

test('picture tiles distinguish populated subcategories from empty ones across shopping',async()=>{
 const populated={fridges:'/appliances.html?category=Refrigerators',dishwashers:'/appliances.html?category=Dishwashers',hoods:'/appliances.html?category=Microwaves%20%26%20Hoods',storage:'/cabinets.html?category=Storage%20Cabinets',bedroom:'/furniture.html?category=bedroom',office:'/furniture.html?category=home-office',base:'/cabinets.html?category=Base%20Cabinets',gas:'/appliances.html?category=Gas%20Ranges',laundry:'/appliances.html?category=Washers%20%26%20Electric%20Dryers'};
 const empty={outdoor:'/furniture.html?category=outdoor',decor:'/furniture.html?category=decor'};
 const dom=open('<main><div class="shop-guide-grid">'+Object.entries({...populated,...empty}).map(([id,url])=>tile(id,url)).join('')+'</div><article class="store-card"><h3>Actual merchandise</h3></article></main>');
 try{
  await tick();const doc=dom.window.document;
  for(const id of Object.keys(populated))assert.equal(doc.getElementById(id).classList.contains('shopping-tile-empty'),false,id);
  for(const id of Object.keys(empty))assert.equal(doc.getElementById(id).classList.contains('shopping-tile-empty'),true,id);
  assert.equal(doc.querySelector('.store-card').classList.contains('shopping-tile-empty'),false);
  assert.equal(doc.querySelectorAll('.shopping-tile-legend').length,1);
  assert.equal(doc.querySelector('.shopping-tile-legend').textContent,'Red dot = No items listed yet.');
 }finally{dom.window.close();}
});

test('late-rendered room tiles and material choices receive markers without duplicate notes',async()=>{
 const dom=open('<main></main>');
 try{
  await tick();const doc=dom.window.document;doc.body.dataset.material='flooring';
  doc.querySelector('main').innerHTML='<div class="photo-store-categories">'+tile('kids','/furniture.html?category=kids-room')+tile('dining','/furniture.html?category=dining-room')+'</div><div class="material-detail-grid"><article class="material-option-card"><h3>Hardwood</h3><a href="/material-flooring.html?type=Hardwood">Choose Hardwood</a></article></div>';
  await tick();
  assert.equal(doc.getElementById('kids').classList.contains('shopping-tile-empty'),false);
  assert.equal(doc.getElementById('dining').classList.contains('shopping-tile-empty'),true);
  assert.equal(doc.querySelector('.material-option-card').classList.contains('shopping-tile-empty'),false);
  doc.querySelector('main').append(doc.createElement('div'));await tick();
  assert.equal(doc.querySelectorAll('.shopping-tile-legend').length,1);
 }finally{dom.window.close();}
});


test('installable product links do not falsely imply empty stock from keyword misses',async()=>{
 const html='<main><div class="installed-groups">'+
   '<section class="installed-group">'+
     '<h2>Doors, Windows & Access</h2>'+
     '<a id="attic-access" href="/shop-installed.html?item=doors-windows-access-attic-access-ladders">Attic Access Ladders</a>'+
     '<a id="bifold-doors" href="/shop-installed.html?item=doors-windows-access-bifold-closet-doors">Bifold Closet Doors</a>'+
   '</section>'+
   '</div></main>';
 const dom=open(html);
 try{
  await tick();
  const doc=dom.window.document;
  assert.equal(doc.getElementById('attic-access').classList.contains('shopping-tile-empty'),false);
  assert.equal(doc.getElementById('bifold-doors').classList.contains('shopping-tile-empty'),false);
  assert.equal(doc.querySelector('.installed-group').classList.contains('shopping-tile-empty'),false);
  assert.equal(doc.querySelectorAll('.shopping-tile-legend').length,0);
  doc.querySelector('.installed-group').append(doc.createElement('small'));
  await tick();
  assert.equal(doc.querySelectorAll('.shopping-tile-legend').length,0);
 }finally{dom.window.close()}
});

test('project idea links do not get empty merchandise dots',async()=>{
 const dom=open('<main><div class="shopping-landing-grid">'+tile('custom','/project.html?project=custom')+'</div></main>');
 try{
  await tick();
  assert.equal(dom.window.document.getElementById('custom').classList.contains('shopping-tile-empty'),false);
 }finally{dom.window.close()}
});
