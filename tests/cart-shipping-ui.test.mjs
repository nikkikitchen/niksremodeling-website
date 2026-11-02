import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync('app.js','utf8');
const start=source.indexOf('function initCartShippingQuote(items){');
const end=source.indexOf('\nfunction renderCart(){',start);
assert.ok(start>=0 && end>start, 'Cart shipping init can be exercised independently');
const code=source.slice(start,end);
const items=[
 {source:'supplier-retail',productId:'1992983344353558529',variantId:'1992983344424861698',qty:1,name:'Kitchen faucet'},
 {source:'bathroom-retail',productId:'1992915023801270274',variantId:'1992915023850000001',qty:1,name:'Towel bar'},
 {source:'supplier-retail',productId:'1993033437579866113',variantId:'1993033437590000001',qty:1,name:'Bathroom vanity'}
];
function mount(fetch){
 const dom=new JSDOM(`<form id="cart-shipping-form"><input id="cart-shipping-zip" required pattern="[0-9]{5}" maxlength="5"><button type="submit">Check shipping</button></form>
 <p id="cart-shipping-status"></p><strong id="cart-shipping-amount">Enter ZIP to check</strong>
 <strong id="cart-estimated-total" data-base-cents="10000" data-pending="false">$100.00 + shipping pending</strong>`,{url:'https://niksremodeling.com/'});
 const {document,localStorage}=dom.window;
 new Function('document','localStorage','fetch','items',code+'\nreturn initCartShippingQuote(items);')
  (document,localStorage,fetch,items);
 const form=document.getElementById('cart-shipping-form');
 const input=document.getElementById('cart-shipping-zip');
 const button=form.querySelector('button');
 const status=document.getElementById('cart-shipping-status');
 const shipping=document.getElementById('cart-shipping-amount');
 const total=document.getElementById('cart-estimated-total');
 return {dom,document,form,input,button,status,shipping,total};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('A new ZIP immediately re-enables Check shipping and invalidates the stale quote',async()=>{
 let finish;
 const fetch=()=>new Promise(resolve=>{finish=resolve});
 const ui=mount(fetch);
 try{
  ui.input.value='36269';
  ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true,bubbles:true}));
  assert.equal(ui.button.disabled,true);
  ui.input.value='3011';
  ui.input.dispatchEvent(new ui.dom.window.Event('input',{bubbles:true}));
  assert.equal(ui.button.disabled,false);
  assert.equal(ui.shipping.textContent,'Pending ZIP');
  finish(Response.json({deliveryCents:9000,units:3}));
  await flush();
  assert.equal(ui.shipping.textContent,'Pending ZIP','stale response cannot overwrite new ZIP');
  assert.equal(ui.total.textContent,'$100.00 + shipping pending');
 }finally{ui.dom.window.close();}
});
test('A mixed supplier cart requests all products under one ZIP and displays one freight total',async()=>{
 let payload;
 const fetch=async(url,opts)=>{
  assert.equal(url,'/api/cart-shipping');
  payload=JSON.parse(opts.body);
  return Response.json({deliveryCents:8100,units:3,shippingMethod:'CJ verified freight'});
 };
 const ui=mount(fetch);
 try{
  ui.input.value='36269';
  ui.form.dispatchEvent(new ui.dom.window.Event('submit',{cancelable:true,bubbles:true}));
  await flush();
  assert.equal(payload.zip,'36269');
  assert.equal(payload.items.length,3);
  assert.equal(ui.shipping.textContent,'$81.00');
  assert.equal(ui.total.textContent,'$181.00');
  assert.equal(ui.button.disabled,false);
  assert.match(ui.status.textContent,/Delivery estimated for 36269/);
 }finally{ui.dom.window.close();}
});
