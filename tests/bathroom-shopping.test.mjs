import {bathroomCatalog} from '../bathroom-catalog.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const src=readFileSync(new URL('../bathroom-shop.js',import.meta.url),'utf8');
// These unit tests load the storefront helpers without starting its async page
// renderer. Supply the DOM operations used by its stylesheet initialization.
const scope={document:{
 addEventListener(){},
 createElement(tag){return {tagName:tag.toUpperCase(),textContent:''};},
 head:{append(){}}
},Intl};
runInNewContext(src+'\nglobalThis.audit={match:bathroomMatch,verified:bathVerified,types:bathroomTypes.map(([id])=>id),toiletMatchesModel};',scope);
const {match,verified,types,toiletMatchesModel}=scope.audit;

test('bathroom storefront includes major fixture families',()=>{
 for(const key of ['toilets','bathtubs','vanities','showers','showerBases','showerDoors','faucets','lighting','ventilation','accessories'])
  assert.ok(types.includes(key),key);
});
test('a bathroom cabinet never appears as a stand-up shower',()=>{
 assert.equal(match('Under sink bathroom pedestal storage cabinet','showers'),false);
 assert.equal(match('Complete shower enclosure kit','showers'),true);
 assert.equal(match('Sliding shower door','showers'),false);
 assert.equal(match('Sliding shower door','showerDoors'),true);
 assert.equal(match('Shower pan 36 inch','showers'),false);
 assert.equal(match('Shower pan 36 inch','showerBases'),true);
});
test('accessory names do not masquerade as complete bathroom fixtures',()=>{
 assert.equal(match('Replacement toilet seat','toilets'),false);
 assert.equal(match('Complete one piece toilet','toilets'),true);
 assert.equal(match('Bathroom vanity light','vanities'),false);
 assert.equal(match('Bathroom vanity light','lighting'),true);
 assert.equal(match('Tub soaking bathtub','bathtubs'),true);
});
test('supplier cleaning products and bathroom accessories are never misrepresented as fixtures',()=>{
 for(const title of [
  'JAYSUING Toilet Bowl Cleaner Tablets, 20 Count',
  'Drawer-equipped Toilet Above Storage Rack',
  'VEVOR Portable Toilet For Camping'
 ])assert.equal(match(title,'toilets'),false,title);
 assert.equal(match('Elongated Dual Flush Ceramic Toilet','toilets'),true);
 for(const title of [
  'Shower Chair Transfer Bench For Bathtub',
  'Wall Mount Faucet For Bathtub',
  'Collapsible Dog Bathtub'
 ])assert.equal(match(title,'bathtubs'),false,title);
 assert.equal(match('Slipper Acrylic Soaking Bathtub','bathtubs'),true);
 assert.equal(match('Black Round Wall Mirror, Bathroom Vanity','vanities'),false);
 assert.equal(match('Pedestal Sink Bathroom Vanity Cabinet','vanities'),true);
});

test('built-in self-cleaning nozzle stays categorized as a smart toilet, not a cleanser',()=>{
 const product='Smart Toilet Bidet Combo With Foot Sensor Open Cover Seat, Self-Cleaning Nozzle, Heated Seat, Auto Flush';
 assert.equal(match(product,'toilets'),true);
 assert.equal(match('JAKEHOE Toilet Bowl Cleaning Powder, 150 g','toilets'),false);
 assert.equal(match('Self-Cleaning Toilet Brush Cleaner','toilets'),false);
});

test('only priced variants with positive physical U.S. warehouse inventory are shown',()=>{
 assert.equal(verified({inStockUS:true,warehouseCountry:'CN',variants:[{priceCents:10000,usStock:4}]}),null);
 assert.equal(verified({inStockUS:true,warehouseCountry:'US',variants:[{priceCents:10000,usStock:0}]}),null);
 assert.equal(verified({inStockUS:true,warehouseCountry:'US',variants:[{priceCents:0,usStock:100}]}),null);
 assert.equal(verified({inStockUS:true,warehouseCountry:'US',variants:[{priceCents:10000,usStock:10}]}).length,1);
});

test('stand-up shower installation and removal are separate unpriced quotes',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const start=app.indexOf('window.BATHROOM_PACKAGES=');
 const end=app.indexOf('];',start);
 const packages=JSON.parse(app.slice(start+'window.BATHROOM_PACKAGES='.length,end+1));
 for(const id of ['standup-shower-install','standup-shower-tile-install','standup-shower-replace','standup-shower-remove']){
  const p=packages.find(x=>x.id===id);
  assert.ok(p,id);
  assert.equal(p.quoteRequired,true);
  assert.equal(p.labor,null);
 }
});

test('Shopping Toilets opens one simple choice page, with repair parts inside it',async()=>{
 const {JSDOM}=await import('jsdom');
 async function open(path){
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://niksremodeling.com'+path,runScripts:'outside-only'});
  const w=dom.window;
  w.header=()=>'<header></header>';w.footer=()=>'<footer></footer>';
  w.updateCartCount=()=>{};w.initNavMenus=()=>{};
  w.fetch=async()=>({ok:true,json:async()=>({items:{},products:[],totalPages:1})});
  w.__bathroom={bathroomCatalog};
  w.eval(src.replace("import('/bathroom-catalog.js')","Promise.resolve(window.__bathroom)"));
  await new Promise(resolve=>setTimeout(resolve,75));
  return dom;
 }
 const landing=await open('/bathroom.html?type=toilets');
 try{
  assert.equal(landing.window.document.querySelector('h1')?.textContent,'Toilets');
  assert.equal(landing.window.document.querySelector('#bath-products'),null,'Choose type before fetching toilet products');
  const tiles=[...landing.window.document.querySelectorAll('.toilet-choice-tile')];
  assert.deepEqual(tiles.map(x=>x.textContent),['All Toilets','Elongated Toilets','Round Toilets','Smart Toilets','Toilet Repair Parts','Wall-Mounted Toilets']);
  assert.match(tiles.find(x=>x.textContent==='Round Toilets').href,/type=toilets&model=round$/);
  assert.match(tiles.find(x=>x.textContent==='Toilet Repair Parts').href,/shop-installed\.html\?item=bathroom-toilet-tank-repair-parts$/);
 }finally{landing.window.close();}
 for(const kind of ['all','elongated','round','smart','specialty']){
  const dom=await open('/bathroom.html?type=toilets&model='+kind);
  try{
   assert.ok(dom.window.document.querySelector('#bath-products'),kind+' must lead to a product grid');
   assert.equal(dom.window.document.querySelector('.toilet-choice-grid'),null,'No repeated chooser in selected type');
   assert.ok(dom.window.document.querySelector('a[href="/bathroom.html?type=toilets"]'),'Back to types');
  }finally{dom.window.close();}
 }
});

test('toilet type choices filter real models without presenting accessories as whole toilets',()=>{
 assert.equal(toiletMatchesModel('Round Front Two Piece Toilet','round'),true);
 assert.equal(toiletMatchesModel('Round Front Two Piece Toilet','elongated'),false);
 assert.equal(toiletMatchesModel('Elongated Dual Flush Ceramic Toilet','elongated'),true);
 assert.equal(toiletMatchesModel('Smart Toilet Bidet Combo with Heated Seat','smart'),true);
 assert.equal(toiletMatchesModel('Wall Mounted Ceramic Toilet','specialty'),true);
 assert.equal(toiletMatchesModel('Toilet Tank Cleaner','all'),true,'All style filter never replaces the full toilet matching check');
 assert.equal(match('Toilet Tank Cleaner','toilets'),false);
});

test('featured smart toilet is displayed only with live verified U.S. stock and a price',async()=>{
 const {JSDOM}=await import('jsdom');
 async function open(stock){
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{
   url:'https://niksremodeling.com/bathroom.html?type=toilets&model=smart',
   runScripts:'outside-only'
  });
  const w=dom.window;
  w.header=()=>'<header></header>';w.footer=()=>'<footer></footer>';
  w.updateCartCount=()=>{};w.initNavMenus=()=>{};
  w.fetch=async url=>({
   ok:true,
   json:async()=>String(url).includes('/api/store-product')
    ?{id:'2046529401898950658',name:'Smart Toilet Bidet Combo with Self-Cleaning Nozzle and Heated Seat',
      image:'https://example.com/smart-toilet.jpg',warehouseCountry:'US',inStockUS:stock,
      variants:[{id:'us-white',name:'White',priceCents:69471,usStock:stock?25:0}]}
    :{products:[],totalPages:1}
  });
  w.__bathroom={bathroomCatalog};
  w.eval(src.replace("import('/bathroom-catalog.js')","Promise.resolve(window.__bathroom)"));
  await new Promise(resolve=>setTimeout(resolve,100));
  return dom;
 }
 const available=await open(true);
 try{
  const link=available.window.document.querySelector('#bath-products a[href*="product=2046529401898950658"]');
  assert.ok(link,'Verified smart toilet must appear in its category');
  assert.ok(link.textContent.includes('$694.71'),'Displayed price must use current verified retail variant');
 }finally{available.window.close();}
 const unavailable=await open(false);
 try{
  assert.equal(unavailable.window.document.querySelector('#bath-products a[href*="product=2046529401898950658"]'),null,
   'An unverified toilet must never appear as in-stock merchandise');
 }finally{unavailable.window.close();}
});
