import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync('app.js','utf8');
const start=source.indexOf('function initCartShippingQuote(items){');
const end=source.indexOf('\nfunction renderCart(){',start);
assert.ok(start>=0&&end>start);
const code=source.slice(start,end);
const products=[{source:'supplier-retail',productId:'1992983344353558529',
 variantId:'1992983344424861698',qty:1,name:'Faucet'}];
function mount(fetch){
 const dom=new JSDOM(`<form id="cart-shipping-form"><input id="cart-shipping-zip" required pattern="[0-9]{5}" maxlength="5"><button type="submit">Check Shipping & Taxes</button></form>
 <p id="cart-shipping-status"></p><strong id="cart-shipping-amount">Enter ZIP</strong>
 <strong id="cart-tax-amount">Needs confirmation</strong><small id="cart-tax-rate-label"></small><p id="cart-tax-status"></p>
 <strong id="cart-due-now">$0.00</strong><strong id="cart-estimated-total" data-base-cents="10000" data-payable-cents="6000" data-retail-cents="6000" data-pending="false">$100.00 + shipping and tax pending</strong>`,
 {url:'https://niksremodeling.com/'});
 const {document,localStorage}=dom.window;
 new Function('document','localStorage','fetch','items',
  code+'\ninitCartShippingQuote(items);initCartTaxPreview();')
  (document,localStorage,fetch,products);
 const id=name=>document.getElementById(name);
 return {dom,form:id('cart-shipping-form'),zip:id('cart-shipping-zip'),
  shipping:id('cart-shipping-amount'),tax:id('cart-tax-amount'),rateLabel:id('cart-tax-rate-label'),
  info:id('cart-tax-status'),total:id('cart-estimated-total'),due:id('cart-due-now')};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
const submit=ui=>{
 ui.zip.value='36269';
 ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true,bubbles:true}));
};
test('tax preview starts at zero without marking tax as verified',()=>{
 const ui=mount(async()=>{throw Error('No shipping request expected');});
 try{
  assert.equal(ui.tax.textContent,'$0.00');
  assert.equal(ui.tax.dataset.verified,'false','Zero preview must not mark tax as verified');
  assert.equal(ui.rateLabel.textContent,' · unverified');
  assert.equal(ui.total.textContent,'$100.00 + tax pending');
  assert.equal(ui.due.textContent,'$60.00','upfront amount includes merchandise and tax, not $40 labor');
  assert.match(ui.info.textContent,/delivery address and type of work determine the applicable tax/);
  assert.match(ui.info.textContent,/Tax needs confirmation/);
 }finally{ui.dom.window.close();}
});
test('verified freight does not invent a tax rate when tax lookup is unavailable',async()=>{
 let shippingCalls=0,otherCalls=0;
 const ui=mount(async(url,opts)=>{
  if(url!=='/api/cart-shipping'){otherCalls++;throw Error('Unexpected tax or payment API request');}
  shippingCalls++;
  assert.equal(JSON.parse(opts.body).zip,'36269');
  return Response.json({deliveryCents:8100,units:1});
 });
 try{
  submit(ui);
  await flush();await flush();
  assert.equal(shippingCalls,1);
  assert.equal(otherCalls,0,'direct shipping submission does not initiate a duplicate tax lookup');
  assert.equal(ui.shipping.textContent,'$81.00');
  assert.equal(ui.tax.textContent,'$0.00');
  assert.equal(ui.tax.dataset.verified,'false','Zero preview must not mark tax as verified');
  assert.equal(ui.total.textContent,'$181.00 + tax pending');
  assert.equal(ui.due.textContent,'$141.00','upfront amount includes merchandise, freight and tax, not labor');
  assert.equal(ui.rateLabel.textContent,' · unverified');
  ui.zip.value='3011';
  ui.zip.dispatchEvent(new ui.dom.window.Event('input',{bubbles:true}));
  assert.equal(ui.tax.textContent,'$0.00');
  assert.equal(ui.tax.dataset.verified,'false','Zero preview must not mark tax as verified');
  assert.equal(ui.total.textContent,'$100.00 + tax pending');
 }finally{ui.dom.window.close();}
});
test('zero freight preview stays unverified when supplier verification fails',async()=>{
 const ui=mount(async()=>Response.json({error:'Supplier freight unavailable.'},{status:503}));
 try{
  submit(ui);
  await flush();await flush();
  assert.equal(ui.shipping.textContent,'$0.00');
  assert.equal(ui.shipping.dataset.verified,'false');
  assert.match(ui.dom.window.document.getElementById('cart-shipping-status').textContent,/Supplier freight unavailable/);
  assert.equal(ui.tax.textContent,'$0.00');
  assert.equal(ui.tax.dataset.verified,'false','Zero preview must not mark tax as verified');
  assert.equal(ui.total.textContent,'$100.00 + tax pending');
  assert.match(ui.info.textContent,/Tax needs confirmation/);
 }finally{ui.dom.window.close();}
});

test('five-digit delivery ZIP loads the location tax preview and includes verified shipping in the amount',async()=>{
 let taxCalls=0,shippingCalls=0;
 const ui=mount(async(url,opts)=>{
  if(url==='/api/cart-tax'){
   taxCalls++;
   const body=JSON.parse(opts.body);
   assert.equal(body.zip,'36269');
   assert.equal(body.merchandiseCents,6000);
   return Response.json({zip:'36269',mode:'zip-upper-estimate',ratePercent:9,estimateOnly:true});
  }
  if(url==='/api/cart-shipping'){
   shippingCalls++;
   return Response.json({deliveryCents:8100,units:1});
  }
  throw Error('Unexpected request '+url);
 });
 try{
  ui.zip.value='36269';
  ui.zip.dispatchEvent(new ui.dom.window.Event('input',{bubbles:true}));
  await flush();await flush();
  assert.equal(taxCalls,1);
  assert.equal(shippingCalls,1);
  assert.equal(ui.shipping.textContent,'$81.00');
  assert.equal(ui.tax.textContent,'$12.69');
  assert.equal(ui.total.textContent,'$193.69');
  assert.equal(ui.due.textContent,'$153.69');
  assert.equal(ui.rateLabel.textContent,' · ZIP estimate 9.00%');
  assert.match(ui.info.textContent,/delivery address determines the final tax/);
 }finally{ui.dom.window.close();}
});


test('package-only ZIP adds no separate delivery or sales tax',async()=>{
 const dom=new JSDOM(`<form id="cart-shipping-form"><input id="cart-shipping-zip" required pattern="[0-9]{5}" maxlength="5"></form>
 <p id="cart-shipping-status"></p><strong id="cart-shipping-amount">Package delivery pending</strong>
 <strong id="cart-tax-amount">Needs confirmation</strong><small id="cart-tax-rate-label"></small>
 <p id="cart-tax-status"></p>
 <strong id="cart-due-now" data-package-deposit-cents="40795" data-missing-package-deposit="false"></strong>
 <strong id="cart-estimated-total" data-base-cents="0" data-payable-cents="0" data-retail-cents="0"></strong>
 <strong id="cart-combined-project-total" data-base-cents="192000" data-has-starting="true" data-has-unpriced="false"></strong>`,
 {url:'https://niksremodeling.com/'});
 const {document,localStorage}=dom.window;
 let calls=0;
 const fetch=async()=>{calls++;throw Error('Complete projects must not request extra tax or freight');};
 const items=[{source:'room-project-package',type:'Service',startingAt:1920,depositEstimate:407.95}];
 new Function('document','localStorage','fetch','items',
  code+'\ninitCartShippingQuote(items);initCartTaxPreview();')(document,localStorage,fetch,items);
 try{
  const zip=document.getElementById('cart-shipping-zip');
  zip.value='30117';
  zip.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  await flush();await flush();
  assert.equal(calls,0,'A complete project must not request extra tax or freight');
  assert.equal(document.getElementById('cart-tax-amount').textContent,'$0.00');
  assert.equal(document.getElementById('cart-due-now').textContent,'$407.95');
  assert.equal(document.getElementById('cart-shipping-amount').textContent,'$0.00');
  assert.match(document.getElementById('cart-combined-project-total').textContent,/\$1,920\.00/);
 }finally{dom.window.close();}
});
