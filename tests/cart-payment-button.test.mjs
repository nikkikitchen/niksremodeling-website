import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=app.indexOf('function cartSecureCheckoutPanel(items){');
const end=app.indexOf('\nfunction initCartSecureCheckout(items){',start);
assert.ok(start>=0&&end>start,'Cart secure checkout function exists');
const render=new Function(app.slice(start,end)+'\nreturn cartSecureCheckoutPanel;')();
const domFor=items=>new JSDOM('<body>'+render(items)+'</body>').window.document;

test('verified single merchandise item displays a card payment button and price verification',()=>{
 const d=domFor([{
  source:'supplier-retail',type:'Product',productId:'1963146233541074945',
  variantId:'1963146233666904066',qty:1
 }]);
 assert.match(d.body.textContent,/Secure checkout/);
 assert.ok(d.getElementById('square-check-price'),'Price verification button must be present');
 assert.equal(d.getElementById('square-pay')?.textContent,'Pay securely with Square');
 assert.equal(d.getElementById('square-pay')?.disabled,true,'No payment before price verification');
});

test('project packages present a pay-in-full invoice path without charging an estimate',()=>{
 const d=domFor([{
  source:'room-project-package',type:'Service',packageId:'basic',qty:1,startingAt:1305
 }]);
 assert.ok(d.querySelector('a[href="#cart-scheduling"]'),'Request invoice link must appear');
 assert.equal(d.getElementById('square-pay')?.disabled,true);
 assert.match(d.body.textContent,/approved invoice/);
 assert.equal(d.getElementById('square-check-price'),null);
});

test('mixed carts and empty carts never create a payable button',()=>{
 const product={source:'supplier-retail',type:'Product',productId:'1963146233541074945',variantId:'1963146233666904066',qty:1};
 for(const items of [[],[product,product]]){
  const d=domFor(items);
  assert.equal(d.getElementById('square-pay')?.disabled,true);
  assert.equal(d.getElementById('square-check-price'),null);
 }
});

test('Review Cart renders checkout above cart detail in source, regardless of cart size',()=>{
 const renderStart=app.indexOf('function renderCart(){');
 const renderEnd=app.indexOf('\nfunction removeCart(',renderStart);
 assert.ok(renderStart>=0&&renderEnd>renderStart);
 const source=app.slice(renderStart,renderEnd);
 const header=source.indexOf('Your Cart');
 const panel=source.indexOf('cartSecureCheckoutPanel(c)');
 const conditional=source.indexOf('${c.length?');
 assert.ok(header>=0&&header<panel&&panel<conditional,
  'Payment controls belong immediately below cart header, not hidden by cart-size branch');
});
