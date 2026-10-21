import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
test('changing ZIP discards a pending delivery quote',async()=>{
 const dom=new JSDOM('<body></body>',{url:'https://niksremodeling.com/furniture.html?category=bedroom',runScripts:'outside-only'});
 const w=dom.window;w.header=w.footer=()=>'';w.updateCartCount=w.initNavMenus=()=>{};
 let resolveQuote;w.fetch=async url=>url.includes('store-product')?{ok:true,json:async()=>({variants:[{id:'1963146233666904066',priceCents:6713}]})}:new Promise(resolve=>{resolveQuote=resolve;});
 w.eval(readFileSync(new URL('../store.js',import.meta.url),'utf8'));
 await new Promise(r=>setTimeout(r,10));
 const zip=w.document.getElementById('delivery-zip');zip.value='30117';
 w.document.getElementById('delivery-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 zip.value='36264';zip.dispatchEvent(new w.Event('input'));
 resolveQuote({ok:true,json:async()=>({zip:'30117',checkoutEnabled:true,productCents:6713,deliveryCents:0,subtotalCents:6713,totalCents:7183,taxCents:470})});
 await new Promise(r=>setTimeout(r,10));
 assert.equal(w.document.getElementById('store-buy').hidden,true);
 assert.equal(w.document.getElementById('order-summary').hidden,true);
 assert.equal(w.document.getElementById('quote-button').disabled,false);dom.window.close();
});
