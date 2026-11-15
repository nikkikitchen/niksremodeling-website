import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('Review Cart presents simple package totals without exposing internal cost accounting',()=>{
 for(const term of ['Summary','Package estimate','Deposit estimate','Balance','Delivery / shipping','Estimated sales tax'])
  assert.ok(app.includes(term),'Missing '+term);
 for(const retired of ['Materials &amp; supplies deposit (included)','Labor after package discount (included)','Package fees and details'])
  assert.ok(!app.includes(retired),'Retired cart detail: '+retired);
 assert.doesNotMatch(app,/Overhead (?:and|&) Contingenc(?:y|ies)/i);
 assert.ok(app.includes('data-package-deposit-cents='),'Deposit calculations must remain');
 assert.ok(app.includes('cart-combined-project-total'),'Total calculation must remain');
});
