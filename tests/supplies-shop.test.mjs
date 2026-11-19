import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync(new URL('../supplies-shop.js',import.meta.url),'utf8');
const prices=JSON.parse(readFileSync(new URL('../data/approved-supply-prices.json',import.meta.url),'utf8'));

async function mount(path='/supplies.html'){
  const dom=new JSDOM('<!doctype html><html><head></head><body data-page="shopping-home"></body></html>',{
    url:'https://niksremodeling.com'+path,
    runScripts:'outside-only'
  });
  const {window}=dom;
  window.header=()=>'<header><nav>Shopping</nav></header>';
  window.footer=()=>'<footer>Everything Under The Roof</footer>';
  window.updateCartCount=()=>{};
  window.initNavMenus=()=>{};
  window.fetch=async()=>({ok:true,json:async()=>prices});
  window.eval(source);
  if(!window.document.getElementById('nr-supply-item')){
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  }
  // Allow the approved-price fetch to resolve.
  for(let i=0;i<5;i++)await Promise.resolve();
  return {window,document:window.document,close:()=>window.close()};
}
const click=(document,label)=>[...document.querySelectorAll('.nr-supply-tab')].find(x=>x.textContent===label)?.click();

test('Supplies uses compact text categories and does not render image tiles',async()=>{
  const t=await mount();
  try {
    assert.equal(t.document.querySelectorAll('.nr-supply-tab').length,8);
    assert.equal(t.document.querySelectorAll('img,.picture-category-tabs,.store-card-grid').length,0);
    assert.ok(t.document.querySelector('a[href="/materials.html"]'));
    assert.ok(t.document.querySelector('a[href="/tools.html"]'));
    assert.equal(t.document.querySelectorAll('script[src*="real-products"]').length,0);
  }finally{t.close();}
});

test('Tile Supplies displays real approved items plus quote-only choices',async()=>{
  const t=await mount('/supplies.html?supply=tile');
  try {
    assert.equal(t.document.getElementById('nr-supply-title').textContent,'Tile & Grout');
    const select=t.document.getElementById('nr-supply-item');
    const options=[...select.options].map(x=>x.textContent);
    assert.ok(options.some(x=>x.includes('Tile Spacers')));
    assert.ok(options.some(x=>x.includes('Grout Float')));
    assert.ok(options.includes('Thinset tile mortar'));
    assert.ok(options.includes('Tile waterproofing membrane'));
    const trowel=[...select.options].find(x=>x.textContent.includes('Notched Tile Trowel'));
    assert.ok(trowel);
    select.value=trowel.value;
    select.dispatchEvent(new t.window.Event('change'));
    assert.match(t.document.getElementById('nr-supply-price').textContent,/\$12\.83/);
  }finally{t.close();}
});

test('Approved-priced supplies remain quote-only in the cart with no double markup',async()=>{
  const t=await mount();
  try {
    click(t.document,'Tile & Grout');
    const select=t.document.getElementById('nr-supply-item');
    const priced=[...select.options].find(x=>x.textContent.includes('Notched Tile Trowel'));
    assert.ok(priced);
    select.value=priced.value;
    select.dispatchEvent(new t.window.Event('change'));
    assert.match(t.document.getElementById('nr-supply-price').textContent,/\$12\.83/);
    t.document.getElementById('nr-supply-ten').click();
    t.document.getElementById('nr-supply-add').click();
    const [item]=JSON.parse(t.window.localStorage.getItem('nr-cart'));
    assert.equal(item.qty,11);
    assert.equal(item.price,null);
    assert.equal(item.pricingPending,true);
    assert.equal(item.quoteRequired,true);
    assert.equal(item.materialCategory,'supplies');
  }finally{t.close();}
});

test('Custom size requests are distinct and remain unpriced',async()=>{
  const t=await mount();
  try {
    click(t.document,'Drywall Finishing');
    const input=t.document.getElementById('nr-supply-variation');
    input.value='Different width';
    input.dispatchEvent(new t.window.Event('input'));
    assert.match(t.document.getElementById('nr-supply-price').textContent,/Price to confirm/);
    t.document.getElementById('nr-supply-add').click();
    const [item]=JSON.parse(t.window.localStorage.getItem('nr-cart'));
    assert.match(item.name,/Different width/);
    assert.equal(item.price,null);
  }finally{t.close();}
});

test('Reusable hardware tools stay out of Supplies selections',async()=>{
  const t=await mount();
  try {
    const labels=[...t.document.querySelectorAll('#nr-supply-item option')].map(o=>o.textContent);
    assert.ok(!labels.some(x=>x.includes('Stud Finder')));
    assert.ok(!source.includes('mountCatalog'));
    assert.ok(!source.includes('real-products.js'));
  }finally{t.close();}
});
