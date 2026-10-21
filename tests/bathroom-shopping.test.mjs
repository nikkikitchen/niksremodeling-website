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
runInNewContext(src+'\nglobalThis.audit={match:bathroomMatch,verified:bathVerified,types:bathroomTypes.map(([id])=>id)};',scope);
const {match,verified,types}=scope.audit;

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
