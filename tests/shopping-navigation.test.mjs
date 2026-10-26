import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const app=readFileSync('app.js','utf8');
async function open(page,query=''){
 const dom=new JSDOM('<body data-page="'+page+'"></body>',{url:'https://niksremodeling.com/'+(page==='tools'?'products':page)+'.html'+query,runScripts:'dangerously'});
 const script=dom.window.document.createElement('script');script.textContent=app;dom.window.document.body.append(script);
 await new Promise(r=>setTimeout(r,20));
 return dom;
}
for(const page of ['appliances','cabinets','tools'])test(page+' category cards open distinct filtered destinations',async()=>{
 const home=await open(page);
 const links=[...home.window.document.querySelectorAll('.shop-guide .photo-category-tile')].map(a=>a.href);
 assert.ok(links.length>=6);
 home.window.close();
 for(const href of links){
  const url=new URL(href),category=url.searchParams.get('category');
  const dom=await open(page,url.search),doc=dom.window.document;
  assert.equal(doc.querySelector('h1').textContent,category);
  assert.equal(doc.body.textContent.includes('No current listings for'),false,'Wait for supplier listing load before declaring the category empty');
  assert.equal(doc.querySelector('.shop-guide'),null,'Do not show the same category picker again');
  assert.equal(doc.querySelector('.category-hero a').getAttribute('href'),'/'+(page==='tools'?'products':page)+'.html');
  const allowed=dom.window.eval('SHOP_GUIDE_CATEGORIES')[page][category];
  const cards=[...doc.querySelectorAll('.products .card')].filter(c=>!c.hidden);
  for(const card of cards)assert.ok(allowed.includes(card.dataset.category));
  if(!cards.length)assert.ok(doc.querySelector('.products .empty'));
  dom.window.close();
 }
});

for(const page of ['appliances','cabinets','tools'])test(page+' product links open a dedicated preview instead of the category introduction',async()=>{
 const dom=await open(page,'?product=1997962863887962114');
 try{
  const doc=dom.window.document;
  assert.equal(doc.querySelector('.category-hero'),null);
  assert.equal(doc.querySelector('.shop-guide'),null);
  assert.ok(doc.querySelector('#retail-page-title'));
  assert.equal(doc.querySelector('main nav a').getAttribute('href'),'/'+(page==='tools'?'products':page)+'.html');
  assert.ok(doc.querySelector('main .products'));
 }finally{dom.window.close();}
});

test('new beverage and coffee shopping categories have distinct appliance destinations',()=>{
 const app=readFileSync('app.js','utf8');
 for(const name of ['Beverage Equipment','Coffee Systems']){
  assert.ok(app.includes('SHOP_GUIDES=')&&app.includes('"'+name+'"'),name+' menu and picture card');
  assert.ok(app.includes("'"+name+"':[]"),name+' category filter');
 }
});
