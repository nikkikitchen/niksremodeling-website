import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalog,inCategory,isKidsFurniture,relatedCategories} from '../store-catalog.js';

test('Kids Room accepts only visibly child-oriented merchandise, not adult items tagged as kids',()=>{
 const adult=['Farmington Nightstand','8-Drawer Tall Dresser','Bristol 6-Drawer Dresser','10-Shelf Bookcase','Fluffy Bean Bag Lounge Chair'];
 for(const name of adult){
  const product={name,category:'bedroom',departments:['kids-room','bedroom']};
  assert.equal(isKidsFurniture(product),false,name);
  assert.equal(inCategory(product,'kids-room'),false,name);
  assert.ok(!relatedCategories(product).includes('kids-room'));
 }
 for(const name of ['Kids Christmas Bean Bag Chair','Children Bunk Bed','Toddler Bed','Nursery Crib','Toy Storage Chest','Montessori Shelf','Youth Desk']){
  assert.equal(isKidsFurniture({name}),true,name);
  assert.ok(relatedCategories({name,category:'bedroom'}).includes('kids-room'),name);
 }
 const kids=catalog.filter(p=>inCategory(p,'kids-room'));
 assert.ok(kids.length,'Kids Room must have a real catalog item');
 assert.ok(kids.every(isKidsFurniture),'Generic adult furniture leaked into Kids Room');
});

test('Kids Room project cards use distinct children-oriented pictures for all nine work options',()=>{
 const source=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
 const match=source.match(/const kidsWorkPhotos=\{([\s\S]*?)\n    \};/);
 assert.ok(match,'Missing Kids Room image map');
 const keys=['ceiling','walls','floor','trim','doors','lighting','storage','furniture','other'];
 const photoIds=keys.map(key=>{
  const row=match[1].match(new RegExp('\\b'+key+':\\x27https:\\/\\/images\\.pexels\\.com\\/photos\\/(\\d+)\\/'));
  assert.ok(row,key+' image missing or not a real photograph');
  return row[1];
 });
 assert.equal(new Set(photoIds).size,keys.length,'Repeated Kids Room work-card photograph');
 assert.match(source,/id==='kids-room'\?\(kidsWorkPhotos\[key\]/,'Kids Room needs dedicated pictures, not unrelated stock fallbacks');
});

test('Shopping and Projects both refresh cached Kids Room scripts',()=>{
 const furniture=readFileSync(new URL('../furniture.html',import.meta.url),'utf8');
 const project=readFileSync(new URL('../project.html',import.meta.url),'utf8');
 const store=readFileSync(new URL('../store.js',import.meta.url),'utf8');
 assert.match(furniture,/store\.js\?v=kids-room-verified-20261028/);
 assert.match(project,/project-options\.js\?v=projects-checkbox-20261029b/);
 assert.match(store,/selectedRoom==='kids-room'&&!isKidsFurniture\(p\)/);
 assert.match(store,/selectedRoom==='kids-room'&&!isKidsFurniture\(\{name\}\)/);
});
