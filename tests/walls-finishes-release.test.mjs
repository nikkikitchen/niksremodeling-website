import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Walls & Finishes retains shared grouped work choices',()=>{
 const source=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
 const group=source.match(/const wallWorkGroups=\[([\s\S]*?)\n  \];/);
 assert.ok(group,'Grouped wall work options must exist');
 for(const choice of ['Drywall Panels','Custom Mirrors','Wallpaper','Wall Panels','Interior Paint','Primer']){
   assert.ok(group[1].includes("'"+choice+"'"),'Missing wall option: '+choice);
 }
 assert.match(source,/options\.walls\.groups=wallWorkGroups/);
 const page=readFileSync(new URL('../project.html',import.meta.url),'utf8');
 assert.match(page,/\/project-options\.js\?v=[^"\s]+/);
});
