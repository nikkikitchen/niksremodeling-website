import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Materials uses one consolidated text-first selector and includes wood, trim and lumber links',()=>{
 const page=readFileSync('materials.html','utf8');
 const shop=readFileSync('material-shop.js','utf8');
 assert.match(page,/data-page="materials"/);
 assert.match(page,/material-shop\.js\?v=/);
 assert.match(shop,/\['Lumber','\/material-lumber\.html'\]/);
 assert.match(shop,/\['Wood & Trim','\/material-trim-molding\.html'\]/);
 assert.match(shop,/main\.replaceChildren\(section\)/);
 assert.match(shop,/Choose a material category/);
 assert.doesNotMatch(page,/photo-category-tile/);
});
