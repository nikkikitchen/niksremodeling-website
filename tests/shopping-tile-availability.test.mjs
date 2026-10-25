import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {catalog,inCategory} from '../store-catalog.js';
import {retailCatalog} from '../retail-catalog.js';

const source=readFileSync(new URL('../shopping-flow.js',import.meta.url),'utf8')
 .replace("import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__furniture)")
 .replace("import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))","Promise.resolve(window.__retail)");
const tick=()=>new Promise(r=>setTimeout(r,15));
const tile=(id,href)=>`<a id="${id}" class="photo-category-tile" href="${href}"><img alt=""><span><strong>${id}</strong></span></a>`;
function open(html){
 const dom=new JSDOM('<body>'+html+'</body>',{url:'https://niksremodeling.com/appliances.html',runScripts:'outside-only'});
 dom.window.__furniture={catalog,inCategory};dom.window.__retail={retailCatalog};dom.window.eval(source);return dom;
}

test('picture tiles distinguish populated subcategories from empty ones across shopping',async()=>{
 const populated={fridges:'/appliances.html?category=Refrigerators',dishwashers:'/appliances.html?category=Dishwashers',hoods:'/appliances.html?category=Microwaves%20%26%20Hoods',storage:'/cabinets.html?category=Storage%20Cabinets',bedroom:'/furniture.html?category=bedroom',office:'/furniture.html?category=home-office'};
 const empty={gas:'/appliances.html?category=Gas%20Ranges',laundry:'/appliances.html?category=Washers%20%26%20Electric%20Dryers',base:'/cabinets.html?category=Base%20Cabinets',outdoor:'/furniture.html?category=outdoor',decor:'/furniture.html?category=decor',toilets:'/bathroom.html?type=toilets',drywall:'/material-drywall.html'};
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
  assert.equal(doc.querySelector('.material-option-card').classList.contains('shopping-tile-empty'),true);
  doc.querySelector('main').append(doc.createElement('div'));await tick();
  assert.equal(doc.querySelectorAll('.shopping-tile-legend').length,2);
 }finally{dom.window.close();}
});
