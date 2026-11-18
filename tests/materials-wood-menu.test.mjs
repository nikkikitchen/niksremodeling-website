import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Materials groups lumber, wood boards and trim beneath one accessible dropdown',()=>{
 const app=readFileSync('app.js','utf8');
 const materials=readFileSync('materials.html','utf8');
 assert.match(app,/function materialWoodMenu\(\)/);
 assert.match(app,/<details class="material-wood-menu">/);
 assert.match(app,/href="\/material-lumber\.html"/);
 assert.match(app,/href="\/material-wood\.html"/);
 assert.match(app,/href="\/material-trim-molding\.html"/);
 assert.match(app,/p\.tabs\.filter\(x=>page!=='materials'\|\|!\['Wood','Lumber','Trim & Molding'\]\.includes\(x\)\)/);
 assert.match(materials,/material-wood-subcategories/);
 assert.match(materials,/app\.js\?v=wood-menu-20261118d/);
});
