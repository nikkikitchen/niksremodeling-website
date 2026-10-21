import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,relatedCategories,inCategory} from '../store-catalog.js';

const byName=name=>{
 const p=catalog.find(product=>product.name===name);
 assert.ok(p, 'Product should exist: '+name);
 return p;
};
test('bookshelves appear across sensible shopping rooms using one product record',()=>{
 const bookcase=byName('10-Shelf Bookcase');
 for(const room of ['bedroom','kids-room','home-office','living-room','storage'])
  assert.equal(inCategory(bookcase,room),true,room);
 assert.equal(catalog.filter(p=>p.id===bookcase.id).length,1);
});
test('holiday kids beanbag is listed in bedrooms and living room as well as kids room',()=>{
 const chair=byName('Kids Christmas Bean Bag Chair with Removable Cushion');
 for(const room of ['bedroom','kids-room','living-room'])
  assert.equal(inCategory(chair,room),true,room);
 assert.equal(inCategory(chair,'bathroom'),false);
});
test('a store product has one ID even with multiple room tags',()=>{
 assert.equal(new Set(catalog.map(p=>p.id)).size,catalog.length);
 for(const product of catalog){
  const rooms=relatedCategories(product);
  assert.equal(rooms.length,new Set(rooms).size,product.name);
  assert.ok(rooms.includes(product.category),product.name);
 }
});
test('unstocked pink and gray kids bookcases are not in any room catalog',()=>{
 for(const id of ['2003348098417340418','2003347794848272385'])
  assert.equal(catalog.some(product=>product.id===id),false);
});
