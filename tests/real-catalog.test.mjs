import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import {retailCatalog} from '../retail-catalog.js';
import {availableVariants,matchesListing,mountCatalog} from '../real-products.js';

test('old sample merchandise and flooring demo cards are retired',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 for(const text of ['Ashford 84','Whirlpool 36','Cordless Drill Kit','Pick a sample format to test the flow','Sample item number:'])assert.equal(app.includes(text),false,text);
 assert.ok(retailCatalog.length>0);
 for(const p of retailCatalog){
  assert.match(p.id,/^\d{19}$/);
  assert.ok(p.priceCents>0);
  assert.match(p.image,/^https:\/\/cf\.cjdropshipping\.com\//);
  assert.match(p.priceCheckedAt,/^2026-\d{2}-\d{2}$/,'A dated supplier price is required');
 }
});

test('supplier candidates require stocked U.S. variants and relevant product names',()=>{
 assert.deepEqual(availableVariants({inStockUS:true,warehouseCountry:'CN',variants:[{id:'a',priceCents:100,usStock:5}]}),[]);
 assert.deepEqual(availableVariants({inStockUS:true,warehouseCountry:'US',variants:[{id:'a',priceCents:100,usStock:0}]}),[]);
 assert.equal(matchesListing('Mermaid Diamond Painting Drill Kit','electric drill'),false);
 assert.equal(matchesListing('Refrigerator Divider Clip','refrigerator'),false);
 assert.equal(matchesListing('JAKEHOE Refrigerator Cleaning Tablets, 20 Count','refrigerator'),false);
 assert.equal(matchesListing('Mini Fridge Stand, Washer and Refrigerator Mobile Base','refrigerator'),false);
 assert.equal(matchesListing('Ceramic Nonstick Egg Pan, Dishwasher Safe','dishwasher'),false);
 assert.equal(matchesListing('30 Inch Range Hood With Baffle Filters','range hood'),true);
 assert.equal(matchesListing('Cordless Electric Drill Kit','electric drill'),true);
});

test('a real product detail transfers the chosen supplier variant and retail price to cart',async()=>{
 const old={fetch:globalThis.fetch,document:globalThis.document,location:globalThis.location,getCart:globalThis.getCart,saveCart:globalThis.saveCart};
 const item=retailCatalog[0],dom=new JSDOM('<head></head><main></main>',{url:'https://niksremodeling.com/cabinets.html?product='+item.id});
 globalThis.document=dom.window.document;globalThis.location=dom.window.location;
 const cart=[];globalThis.getCart=()=>cart;globalThis.saveCart=()=>{};
 globalThis.fetch=async()=>Response.json({name:item.name,image:item.image,inStockUS:true,warehouseCountry:'US',variants:[
  {id:'white',sku:'REAL-WHITE',name:'White',priceCents:8423,usStock:230},
  {id:'black',sku:'REAL-BLACK',name:'Black',priceCents:9000,usStock:10}
 ]});
 try{
  const target=document.querySelector('main');await mountCatalog(target,{department:'cabinets'});
  const select=document.getElementById('retail-option');select.value='black';select.dispatchEvent(new dom.window.Event('change'));
  document.getElementById('retail-add').click();
  assert.equal(cart.length,1);assert.equal(cart[0].variantId,'black');assert.equal(cart[0].sku,'REAL-BLACK');assert.equal(cart[0].price,90);
  assert.equal(cart[0].shippingAndTaxNotIncluded,true);
 }finally{Object.assign(globalThis,old);dom.window.close();}
});

test('a supplier failure cannot turn a dated listing into an addable product',async()=>{
 const old={fetch:globalThis.fetch,document:globalThis.document,location:globalThis.location};
 const item=retailCatalog[0],dom=new JSDOM('<head></head><main></main>',{url:'https://niksremodeling.com/cabinets.html?product='+item.id});
 globalThis.document=dom.window.document;globalThis.location=dom.window.location;
 globalThis.fetch=async()=>Response.json({error:'Unavailable'},{status:503});
 try{
  const target=document.querySelector('main');await mountCatalog(target,{department:'cabinets'});
  assert.match(target.textContent,/Last checked price/);assert.equal(document.getElementById('retail-add'),null);
 }finally{Object.assign(globalThis,old);dom.window.close();}
});

test('saved item previews remain visible while stock loads and after a failed check',async()=>{
 const old={fetch:globalThis.fetch,document:globalThis.document,location:globalThis.location};
 const item=retailCatalog.find(p=>p.department==='appliances');
 const dom=new JSDOM('<head></head><h1 id="retail-page-title">Item preview</h1><main></main>',{url:'https://niksremodeling.com/appliances?product='+item.id});
 globalThis.document=dom.window.document;globalThis.location=dom.window.location;
 let finishCheck;globalThis.fetch=()=>new Promise(resolve=>{finishCheck=resolve;});
 try{
  const target=document.querySelector('main'),pending=mountCatalog(target,{department:'appliances'});
  assert.equal(document.getElementById('retail-page-title').textContent,item.name);
  assert.equal(target.querySelector('img').getAttribute('src'),item.image);
  assert.match(target.textContent,/Checking this item/);
  assert.equal(document.getElementById('retail-add'),null);
  finishCheck(Response.json({error:'Unavailable'},{status:503}));await pending;
  assert.equal(target.querySelector('img').getAttribute('src'),item.image);
  assert.match(target.textContent,/Last checked price/);
  assert.ok(document.getElementById('retail-retry'));
  assert.equal(document.getElementById('retail-add'),null);
 }finally{Object.assign(globalThis,old);dom.window.close();}
});

test('category searches omit overseas inventory and unrelated sample-like results',async()=>{
 const old={fetch:globalThis.fetch,document:globalThis.document,location:globalThis.location};
 const dom=new JSDOM('<head></head><main></main>',{url:'https://niksremodeling.com/products.html?category=Drills%20%26%20Impacts'});
 globalThis.document=dom.window.document;globalThis.location=dom.window.location;
 globalThis.fetch=async url=>{
  if(String(url).includes('/cj-products?'))return Response.json({products:[
   {id:'drill-overseas',name:'Cordless Electric Drill'},
   {id:'nail-art',name:'Nail Art Electric Drill'},
   {id:'drill-us',name:'Cordless Electric Drill Kit'}
  ]});
  const us=String(url).includes('drill-us');
  return Response.json({id:us?'drill-us':'drill-overseas',name:'Cordless Electric Drill Kit',image:'https://example.com/drill.jpg',inStockUS:us,warehouseCountry:us?'US':'CN',variants:[{id:'variant',priceCents:5000,usStock:us?5:0}]});
 };
 try{
  const target=document.querySelector('main');await mountCatalog(target,{department:'tools'});
  const cards=target.querySelectorAll('[data-product]');assert.equal(cards.length,1);assert.equal(cards[0].dataset.product,'drill-us');
  assert.equal(cards[0].querySelector('a').getAttribute('href'),'/products.html?product=drill-us');
  assert.match(cards[0].textContent,/\$50.00/);assert.equal(cards[0].dataset.verified,'true');
 }finally{Object.assign(globalThis,old);dom.window.close();}
});

test('equipment shopping categories match actual installable appliances',()=>{
 const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
 const source=readFileSync(new URL('../real-products.js',import.meta.url),'utf8');
 const labor=readFileSync(new URL('../installation.html',import.meta.url),'utf8');
 for(const name of ['Beverage Equipment','Coffee Systems']){
   assert.ok(app.includes('"'+name+'"')||app.includes("'"+name+"'"),name+' has a Shopping picture category');
   assert.ok(source.includes("'"+name+"':"),name+' uses live supplier search');
   assert.ok(app.includes("'"+name+"':[]"),name+' cannot accidentally inherit unrelated demo products');
 }
 assert.match(labor,/labor-shop-equipment/);
 assert.match(labor,/category=\x27\+encodeURIComponent\(shopCategory\)/);
});
