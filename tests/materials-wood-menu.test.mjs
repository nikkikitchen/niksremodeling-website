import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Materials shows direct lumber and finish wood shortcuts without extra accordion',()=>{
 const app=readFileSync('app.js','utf8');
 const materials=readFileSync('materials.html','utf8');
 assert.match(app,/function materialWoodMenu\(\)/);
 assert.match(app,/return '<div class="material-wood-subcategories"/);
 assert.match(app,/href="\/material-lumber\.html"/);
 assert.match(app,/<a href="\/material-lumber\.html#wood-wood-trim-molding"><strong>Wood &amp; Trim<\/strong>/);
 assert.match(app,/<a href="\/material-lumber\.html"><strong>Lumber<\/strong>/);
 assert.match(app,/href="\/material-lumber\.html#wood-wood-trim-molding"/);
 assert.match(app,/p\.tabs\.filter\(x=>page!=='materials'\|\|!\['Wood','Lumber','Trim & Molding'\]\.includes\(x\)\)/);
 assert.match(materials,/material-wood-subcategories/);
 assert.match(materials,/app\.js\?v=lumber-consolidated-20261119a/);
});
