import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
test('quantity calculator does not force a retailer product selection for a generic material',()=>{
 assert.match(app,/details\.id='optional-exact-product'/);
 assert.match(app,/Specify an exact brand or product \(optional\)/);
 assert.match(app,/product details are optional/);
 assert.match(app,/details\.append\(detailSummary,exactPanel\)/);
});
test('retailer SKU identifier can be forwarded from the item link',()=>{
 assert.match(app,/params\.get\('sku'\)\|\|params\.get\('productId'\)\|\|params\.get\('variantId'\)/);
 assert.match(app,/getElementById\('exact-identifier'\)\.value=exactId/);
});
