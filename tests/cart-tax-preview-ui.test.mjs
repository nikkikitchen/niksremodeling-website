import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync('app.js','utf8');
const start=source.indexOf('function initCartShippingQuote(items){');
const end=source.indexOf('\nfunction renderCart(){',start);
assert.ok(start>=0 && end>start);
const code=source.slice(start,end);
const products=[{source:'supplier-retail',productId:'1992983344353558529',
 variantId:'1992983344424861698',qty:1,name:'Faucet'}];

function mount(fetch){
 const dom=new JSDOM(`<form id="cart-shipping-form"><input id="cart-shipping-zip" required pattern="[0-9]{5}" maxlength="5"><button type="submit">Check shipping</button></form>
 <p id="cart-shipping-status"></p><strong id="cart-shipping-amount">Enter ZIP</strong>
 <strong id="cart-tax-amount">Awaiting verified lookup</strong><p id="cart-tax-status"></p>
 <input id="cart-tax-street"><input id="cart-tax-city"><input id="cart-tax-state">
 <button type="button" id="cart-tax-refine">Update tax</button>
 <strong id="cart-estimated-total" data-base-cents="10000" data-retail-cents="6000" data-pending="false">$100.00 + shipping and tax pending</strong>`,
 {url:'https://niksremodeling.com/'});
 const {document,localStorage}=dom.window;
 new Function('document','localStorage','fetch','items',
  code+'\ninitCartShippingQuote(items);initCartTaxPreview();')
  (document,localStorage,fetch,products);
 const id=name=>document.getElementById(name);
 return {dom,document,form:id('cart-shipping-form'),zip:id('cart-shipping-zip'),
  shipping:id('cart-shipping-amount'),tax:id('cart-tax-amount'),
  info:id('cart-tax-status'),total:id('cart-estimated-total'),
  street:id('cart-tax-street'),city:id('cart-tax-city'),state:id('cart-tax-state'),
  refine:id('cart-tax-refine')};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('one ZIP shipment plus highest verified ZIP tax builds a transparent preview total',async()=>{
 let shippingCalls=0,taxCalls=0;
 const ui=mount(async(url,opts)=>{
  const body=JSON.parse(opts.body);
  if(url==='/api/cart-shipping'){
   shippingCalls++;assert.equal(body.zip,'36269');
   assert.equal(body.items.length,1);
   return Response.json({deliveryCents:8100,units:1});
  }
  assert.equal(url,'/api/cart-tax');
  taxCalls++;assert.deepEqual(body,{zip:'36269',merchandiseCents:6000,shippingCents:8100});
  return Response.json({estimateOnly:true,mode:'zip-upper-estimate',taxCents:1269});
 });
 try{
  ui.zip.value='36269';
  ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true}));
  await flush();await flush();
  assert.equal(shippingCalls,1);
  assert.equal(taxCalls,1);
  assert.equal(ui.shipping.textContent,'$81.00');
  assert.equal(ui.tax.textContent,'$12.69 (estimate)');
  assert.equal(ui.total.textContent,'$193.69');
  assert.match(ui.info.textContent,/highest verified sales-tax rate/);
 }finally{ui.dom.window.close();}
});
test('updating address reduces tax estimate without recalculating CJ freight',async()=>{
 let shippingCalls=0,taxCalls=0;
 const ui=mount(async(url,opts)=>{
  const body=JSON.parse(opts.body);
  if(url==='/api/cart-shipping'){
   shippingCalls++;return Response.json({deliveryCents:8100,units:1});
  }
  taxCalls++;
  if(body.address){
   assert.equal(body.zip,'36269');
   assert.equal(body.address,'123 Main St');
   assert.equal(body.state,'AL');
   return Response.json({estimateOnly:true,mode:'address-estimate',taxCents:420});
  }
  return Response.json({estimateOnly:true,mode:'zip-upper-estimate',taxCents:1269});
 });
 try{
  ui.zip.value='36269';
  ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true}));
  await flush();await flush();
  assert.equal(ui.total.textContent,'$193.69');
  ui.street.value='123 Main St';ui.city.value='Heflin';ui.state.value='AL';
  ui.refine.click();
  await flush();await flush();
  assert.equal(shippingCalls,1,'address update should not repeat slow CJ quote');
  assert.equal(taxCalls,2);
  assert.equal(ui.tax.textContent,'$4.20 (estimate)');
  assert.equal(ui.total.textContent,'$185.20');
 }finally{ui.dom.window.close();}
});
test('missing API key never turns unknown sales tax into zero or a pretend final total',async()=>{
 const ui=mount(async(url)=>{
  if(url==='/api/cart-shipping')return Response.json({deliveryCents:8100,units:1});
  return Response.json({error:'Location-based tax estimates are not configured yet.',estimateOnly:true},{status:503});
 });
 try{
  ui.zip.value='36269';
  ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true}));
  await flush();await flush();
  assert.equal(ui.tax.textContent,'Awaiting verified calculation');
  assert.equal(ui.total.textContent,'$181.00 + tax pending');
  assert.match(ui.info.textContent,/No guessed tax was added/);
  ui.zip.value='30117';
  ui.zip.dispatchEvent(new ui.dom.window.Event('input',{bubbles:true}));
  assert.equal(ui.tax.textContent,'Awaiting delivery ZIP');
 }finally{ui.dom.window.close();}
});
