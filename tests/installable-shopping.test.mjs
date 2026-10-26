import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync('shopping-flow.js','utf8');
const line=prefix=>source.split('\n').find(s=>s.trim().startsWith(prefix));
const groups=JSON.parse(line('const installableGroups=').split('const installableGroups=')[1].replace(/;$/,''));
const extras=JSON.parse(line('const installableExtras=').split('const installableExtras=')[1].replace(/;$/,''));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');

test('Shopping includes every installed trade group and individual equipment choices',()=>{
 const expected=['Doors, Windows & Access','Electrical, Lighting & Smart Home','Exterior, Decks & Outdoor',
  'Flooring, Walls & Finishes','Heating, Ventilation & Audio','Kitchen & Plumbing'];
 for(const title of expected)assert.ok(groups[title]?.length>=8,title);
 assert.equal(Object.values(groups).reduce((n,v)=>n+v.length,0),70,'Only physical shippable product categories belong in Shopping');
 assert.equal(Object.values(extras).reduce((n,v)=>n+v.length,0),24);
 // Guard against the stale 72/93 expectations that previously blocked Pages builds.
 assert.equal(Object.values(groups).reduce((n,v)=>n+v.length,0)+Object.values(extras).reduce((n,v)=>n+v.length,0),94);
 assert.ok(source.includes('window.INSTALLABLE_SHOP_ITEMS=installableById'));
 assert.ok(source.includes('if(installedMenuChoices[department])return installedMenuChoices[department]'));
});
test('every new installation shopping link resolves to its own product search destination',()=>{
 const ids=new Set();
 for(const [group,products] of Object.entries(groups))for(const [name,keyword,department] of products){
  const id=slug(group)+'-'+slug(name);
  assert.ok(!ids.has(id),'duplicate destination '+id);ids.add(id);
  assert.ok(keyword?.trim(),name+' requires a specific verified product query');
  assert.ok(['materials','appliances','other'].includes(department),name+' needs an existing shopping department');
 }
 for(const [department,products] of Object.entries(extras))for(const [name,keyword,target,direct] of products){
  if(direct){assert.ok(/^\/bathroom\.html\?type=/.test(direct));continue;}
  const id=department+'-'+slug(name);
  assert.ok(!ids.has(id),'duplicate destination '+id);ids.add(id);
  assert.ok(keyword?.trim());
  assert.ok(['materials','appliances'].includes(target));
 }
 assert.equal(ids.size,Object.values(groups).reduce((n,v)=>n+v.length,0)+Object.values(extras).reduce((n,v)=>n+v.filter(item=>!item[3]).length,0),'Every shippable entry has a unique destination');
});
test('Cloudflare build publishes the new paths and listing refuses unknown stock',()=>{
 const build=readFileSync('scripts/build.mjs','utf8');
 for(const name of ['shop-installed.html','shop-installed.js'])assert.ok(build.includes("'"+name+"'"),name);
 const page=readFileSync('shop-installed.js','utf8');
 const catalog=readFileSync('real-products.js','utf8');
 assert.match(page,/INSTALLABLE_SHOP_ITEMS/);
 assert.match(page,/installKeyword:item\.keyword/);
 assert.match(catalog,/\(!installKeyword\|\|matchesListing\(p\.name,installKeyword\)\)/);
 assert.match(catalog,/availableVariants\(data\)/);
});
