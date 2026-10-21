import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const begin=app.indexOf('const SHOP_PICTURE_TILES=');
const end=app.indexOf('function shopPhoto(',begin);
assert.ok(begin>=0&&end>begin,'photo tile mapping must exist');
const sandbox={};
runInNewContext(app.slice(begin,end)+'\nglobalThis.map=SHOP_PICTURE_TILES;',sandbox);
const map=sandbox.map;
test('all shopping guides use distinct approved local pictures',()=>{
 for(const page of ['materials','furniture','appliances','cabinets','tools','supplies']){
  const paths=Object.values(map[page]||{});
  assert.ok(paths.length>=6,page+' should have photo categories');
  assert.equal(new Set(paths).size,paths.length,page+' has duplicate photos');
  for(const path of paths){
   assert.match(path,/^\/assets\//);
   assert.equal(existsSync(new URL('..'+path,import.meta.url)),true,'Missing '+path);
  }
 }
});
test('materials use image tiles rather than text-only category tabs',()=>{
 assert.ok(app.includes('picture-category-tabs'));
 assert.ok(app.includes("shopPictureTile('materials',x"));
 assert.ok(app.includes('photo-guide-grid'));
});
test('photo navigation changes do not alter approved labor amounts',()=>{
 for(const [id,labor] of [['toilet-install',175],['vanity-install',350],['tub-replace',1600]]){
  const start=app.indexOf('window.BATHROOM_PACKAGES=');
  const end=app.indexOf('];',start);
  const packages=JSON.parse(app.slice(start+'window.BATHROOM_PACKAGES='.length,end+1));
  assert.equal(packages.find(x=>x.id===id)?.labor,labor,id);
 }
});
test('retail checkout stays opt-in server-side',()=>{
 const status=readFileSync(new URL('../functions/api/store-quote.js',import.meta.url),'utf8');
 assert.ok(status.includes('STORE_CHECKOUT_ENABLED'));
 const checkout=readFileSync(new URL('../functions/api/store-checkout.js',import.meta.url),'utf8');
 assert.ok(checkout.includes('checkoutEnabled'));
});
