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

test('merchandise cart shows purchase hold without a checkout or verification button',()=>{
 const d=domFor([{source:'supplier-retail',type:'Product',productId:'1963146233541074945',variantId:'1963146233666904066',qty:1}]);
 assert.match(d.body.textContent,/Online purchases temporarily paused/);
 assert.equal(d.getElementById('square-check-price'),null);
 assert.equal(d.getElementById('square-pay'),null);
 assert.ok(d.querySelector('a[href="#cart-scheduling"]'),'A quote request remains available');
});

test('project packages can request a quote but never make online payment',()=>{
 const d=domFor([{source:'room-project-package',type:'Service',packageId:'basic',qty:1,startingAt:1305}]);
 assert.ok(d.querySelector('a[href="#cart-scheduling"]'));
 assert.equal(d.getElementById('square-pay'),null);
 assert.equal(d.getElementById('square-check-price'),null);
});

test('empty and mixed carts never create a payable button',()=>{
 const product={source:'supplier-retail',type:'Product',productId:'1963146233541074945',variantId:'1963146233666904066',qty:1};
 for(const items of [[],[product,product]]){
  const d=domFor(items);
  assert.equal(d.getElementById('square-pay'),null);
  assert.equal(d.getElementById('square-check-price'),null);
 }
});

test('Review Cart shows items, delivery, order summary and scheduling before the payment button',()=>{
 const start=app.indexOf('function renderCart(){');
 const end=app.indexOf('\nfunction removeCart(',start);
 assert.ok(start>=0&&end>start);
 const source=app.slice(start,end);
 const item=source.indexOf('<h2>Items</h2>');
 const delivery=source.indexOf('nr-cart-zip-top');
 const summary=source.indexOf('cartCheckoutSummary(c)');
 const schedule=source.indexOf('cartSchedulingMarkup(c)');
 const pay=source.indexOf('cartSecureCheckoutPanel(c)');
 assert.ok(item>=0&&item<delivery&&delivery<summary&&summary<schedule&&schedule<pay,
  'Checkout must appear after items, delivery, the summary, and payment choices');
 assert.ok(source.includes("'+cartSecureCheckoutPanel(c)"),'Empty cart should retain checkout section');
});

test('cart keeps one compact delivery address form while online payment is paused',()=>{
 const start=app.indexOf('function renderCart(){');
 const end=app.indexOf('\nfunction removeCart(',start);
 const source=app.slice(start,end);
 assert.ok(source.includes('zipForm.insertAdjacentHTML'),'Address inputs are placed next to the ZIP in the delivery section');
 for(const id of ['square-ship-address','square-ship-city','square-ship-state'])
  assert.ok(source.includes(id),'Missing delivery address input '+id);
 assert.equal((app.match(/id="square-ship-address"/g)||[]).length,1,
  'Address field must appear in only one cart location');
});
