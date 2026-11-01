import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalog,categories,inCategory,relatedCategories} from '../store-catalog.js';
import {JSDOM} from 'jsdom';

test('furniture can be added without shipping ZIP; one delivery quote happens in Review Cart',async()=>{
 const dom=new JSDOM('<body></body>',{
  url:'https://niksremodeling.com/furniture.html?category=bedroom&product=1963146233541074945',
  runScripts:'outside-only'
 });
 const w=dom.window;
 w.header=w.footer=()=>'';w.updateCartCount=w.initNavMenus=()=>{};
 let added=null;
 w.getCart=()=>[];
 w.saveCart=cart=>{added=cart};
 w.fetch=async url=>{
  if(!String(url).includes('store-product'))throw Error('Delivery must not be requested on product pages');
  return {ok:true,json:async()=>({inStockUS:true,variants:[
   {id:'1963146233666904066',priceCents:6713,usStock:10,sku:'TEST-FURNITURE'}
  ]})};
 };
 w.__catalog={catalog,categories,inCategory,relatedCategories};
 w.__cards={cardHtml:()=>'',priceCards:async()=>{}};
 const script=readFileSync(new URL('../store.js',import.meta.url),'utf8')
  .replace(/await import\('\/store-catalog\.js[^;\n]*/g,'window.__catalog')
  .replace(/await import\('\/store-cards\.js[^;\n]*/g,'window.__cards');
 w.eval(script);
 await new Promise(resolve=>setTimeout(resolve,25));
 assert.equal(w.document.querySelector('#delivery-zip'),null);
 assert.equal(w.document.querySelector('#delivery-form'),null);
 const add=w.document.getElementById('store-add-cart');
 assert.ok(add,'Add to Cart button exists');
 assert.equal(add.disabled,false,'Verified product can be added immediately');
 add.click();
 await new Promise(resolve=>setTimeout(resolve,25));
 assert.equal(added?.length,1,'One product was added to Review Cart');
 assert.equal(added[0].source,'supplier-retail');
 assert.equal(added[0].productId,'1963146233541074945');
 assert.equal(added[0].qty,1);
 assert.equal(added[0].price,67.13);
 assert.equal(added[0].shippingAndTaxNotIncluded,true);
 assert.match(w.document.getElementById('store-message').textContent,/Product added/i);
 assert.ok(w.document.querySelector('a[href="/project-cart.html"]'));
 dom.window.close();
});
