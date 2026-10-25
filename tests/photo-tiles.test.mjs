import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const begin=app.indexOf('const SHOP_PICTURE_TILES=');
const end=app.indexOf('function shopPhoto(',begin);
assert.ok(begin>=0&&end>begin,'photo tile mapping must exist');
const sandbox={};
runInNewContext(app.slice(begin,end)+'\nglobalThis.map=SHOP_PICTURE_TILES;globalThis.previews=PRODUCT_CARD_PHOTOS;',sandbox);
const map=sandbox.map;
const previews=sandbox.previews;
// These supplier photographs are the existing beverage category images.
const approvedSupplierPhotos=new Set([
 'https://cf.cjdropshipping.com/17639424/f6fb41ac-34f8-4679-91f1-389c65fd1385.jpg',
 'https://cf.cjdropshipping.com/17639424/08f44f66-17e9-44d3-84a6-ff86a3d4d230.jpg'
]);
test('all shopping guides use distinct approved pictures',()=>{
 for(const page of ['materials','furniture','appliances','cabinets','tools','supplies']){
  const paths=Object.values(map[page]||{});
  assert.ok(paths.length>=6,page+' should have photo categories');
  assert.equal(new Set(paths).size,paths.length,page+' has duplicate photos');
  for(const path of paths){
   if(path.startsWith('/assets/'))assert.equal(existsSync(new URL('..'+path,import.meta.url)),true,'Missing '+path);
   else if(!approvedSupplierPhotos.has(path))assert.match(path,/^https:\/\/images\.unsplash\.com\/photo-[^\s]+$/,'Unapproved image host '+path);
  }
 }
});
test('materials use image tiles rather than text-only category tabs',()=>{
 assert.ok(app.includes('picture-category-tabs'));
 assert.ok(app.includes("shopPictureTile('materials',x"));
 assert.ok(app.includes('photo-guide-grid'));
});
test('photo navigation changes do not alter approved labor amounts',()=>{
 for(const [id,labor] of [['toilet-install',150],['vanity-install',300],['tub-replace',1600]]){
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

test('appliance dryers show a laundry image, not kitchen images',()=>{
 assert.notEqual(map.appliances['Gas Dryers'],'/assets/approved-493d744bf5f7.jpg');
 assert.notEqual(map.appliances['Washers & Electric Dryers'],'/assets/approved-807c60a6001a.jpg');
 assert.notEqual(map.appliances['Gas Dryers'],map.appliances['Washers & Electric Dryers']);
});
test('shopping no longer renders illustrative sample products',()=>{
 assert.ok(app.includes('const PRODUCT_CARD_PHOTOS='));
 assert.ok(!app.includes('Planning example · Not verified'));
 assert.ok(app.includes('loadRealCatalog(page)'));
 assert.ok(!app.includes('src="${imgs[i%imgs.length]}"'));
});

test('product preview photos exist, match each SKU mapping and do not repeat within a page',()=>{
 for(const page of ['appliances','tools','materials','supplies','cabinets']){
  const entries=Object.entries(previews[page]||{});
  assert.ok(entries.length>=10,page+' should have representative pictures for the catalog');
  const paths=entries.map(([,path])=>path);
  assert.equal(new Set(paths).size,paths.length,page+' repeats a preview image');
  for(const [sku,path] of entries){
   assert.ok(/^[A-Z]{2}-/.test(sku),'Unexpected SKU in '+page+': '+sku);
   if(path.startsWith('/assets/'))assert.equal(existsSync(new URL('..'+path,import.meta.url)),true,'Missing '+path);
   else assert.match(path,/^https:\/\/images\.unsplash\.com\/photo-[^\s]+$/,'Unapproved image host '+path);
  }
 }
});
test('specialist photo cards show their subjects, not unrelated generic project covers',()=>{
 assert.notEqual(map.materials.Drywall,'/assets/project-basement.jpg');
 assert.notEqual(map.materials.Lumber,'/assets/arches-columns.jpg');
 assert.notEqual(map.materials['Siding & Exterior'],'/assets/entryways-card.jpg');
 assert.notEqual(map.tools['Measuring & Layout'],'/assets/stairs-card.jpg');
 assert.notEqual(map.cabinets.Hardware,'/assets/approved-d2807423c8f0.jpg');
 assert.notEqual(map.supplies['Appliance Cords & Connections'],'/assets/approved-b9cdb9084877.jpg');
 const bathroom=readFileSync(new URL('../bathroom-shop.js',import.meta.url),'utf8');
 assert.ok(!bathroom.includes('"ventilation": "/assets/project-attic.jpg"'));
 assert.ok(!bathroom.includes('"accessories": "/assets/approved-8d4db6742d08.jpg"'));
});

test('every material detail page shows a unique picture per material option',()=>{
 const jsonBetween=(start,end)=>app.split(start)[1].split(end)[0].trim().replace(/;$/,'');
 const pages=JSON.parse(jsonBetween('const MATERIAL_DETAIL_PAGES=','const FLOORING_PRODUCT_TYPES='));
 const options=JSON.parse(jsonBetween('const MATERIAL_ITEM_PICTURES=','const cardImages='));
 const fallbacks=JSON.parse(jsonBetween('const materialChoicePhotos=','const MATERIAL_ITEM_PICTURES=').replace(/'/g,'"'));
 const additional={'tile-stone':['Wall Tile','Decorative Stone Slabs','Stacked Stone Veneer'],'siding-exterior':['Exterior-Grade Shiplap'],'trim-molding':['Interior Shiplap'],'lumber':['Shiplap Boards']};
 for(const [slug,category] of Object.entries(pages)){
  const pictures=[...category.items,...(additional[slug]||[])].map((item,i)=>options[slug]?.[item]||fallbacks[slug]?.[i%fallbacks[slug].length]);
  assert.ok(pictures.every(Boolean),'Every '+slug+' option needs a photo');
  assert.equal(new Set(pictures).size,pictures.length,'Repeated material photos in '+slug);
  for(const photo of pictures){
   if(photo.startsWith('/assets/'))assert.equal(existsSync(new URL('..'+photo,import.meta.url)),true,'Missing '+photo);
   else assert.ok(photo.startsWith('https://images.unsplash.com/photo-'),'Unrecognized photo source '+photo);
  }
 }
});
