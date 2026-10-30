import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Basement Walls & Finishes includes drywall and custom mirrors in published project options',()=>{
 const source=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
 const section=source.match(/options\.walls\.materials=\[([\s\S]*?)\];/);
 assert.ok(section,'Walls & Finishes options must exist');
 for(const choice of ['Drywall Panels','Custom Mirrors','Wallpaper','Wall Panels','Interior Paint','Primer']){
   assert.ok(section[1].includes("'"+choice+"'"),'Missing wall option: '+choice);
 }
 const page=readFileSync(new URL('../project.html',import.meta.url),'utf8');
 assert.match(page,/\/project-options\.js\?v=walls-finishes-20261030/);
});
