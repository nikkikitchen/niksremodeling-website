import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const reference=JSON.parse(readFileSync(new URL('../material-price-reference.json',import.meta.url),'utf8'));
test('standard drywall reference is an already-marked-up half-inch 4x8 sheet',()=>{
 const sheet=reference.items.find(x=>x.id===2);
 assert.equal(sheet.name,'4x8 Sheet of 1/2-in Drywall');
 assert.equal(sheet.price,21.94);
 assert.equal(reference.markupAlreadyIncluded,true);
});
test('only generic standard drywall 4x8 shows reference amount without a selected brand',()=>{
 assert.match(app,/function standardDrywallEstimatePrice\(item\)/);
 assert.match(app,/item\.measurements\?\.sheetArea!==32/);
 assert.match(app,/Drywall Panels\$\/i\.test\(chosen\)/);
 assert.match(app,/window\.NIK_MATERIAL_PRICE_FOR\('drywall'\)/);
 assert.match(app,/if\(item\.exact&&Object\.values\(item\.exact\)/);
 assert.match(app,/standardPrice\?'Standard 1\/2-inch 4 × 8 drywall was priced automatically/);
});
test('drywall waste is fixed at 15 percent in customer calculator',()=>{
 assert.match(app,/wasteSelect\.value='0\.15'/);
 assert.match(app,/wasteSelect\.closest\('\.field'\)\.hidden=true/);
 assert.match(app,/sheetArea:materialPositive\('dry-sheet'\)/);
});