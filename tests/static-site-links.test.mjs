import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sources=['app.js','room-projects.js','project-options.js','bathroom-shop.js','bathroom-catalog.js','shopping-flow.js','real-products.js','styles.css','index.html','project-cart.html'];
test('static local asset links resolve to actual project files',()=>{
 const missing=[];
 for(const file of sources){
  const text=readFileSync(path.join(root,file),'utf8');
  for(const m of text.matchAll(/\\/assets\\/([A-Za-z0-9_.-]+\\.(?:jpg|jpeg|png|webp|svg|gif))/g)){
   const target=path.join(root,'assets',m[1]);
   if(!existsSync(target))missing.push(file+' -> /assets/'+m[1]);
  }
 }
 assert.deepEqual([...new Set(missing)],[],'Missing images cannot be published as local references');
});
test('static local html page links resolve',()=>{
 const missing=[];
 for(const file of sources){
  const text=readFileSync(path.join(root,file),'utf8');
  for(const m of text.matchAll(/(?:href|src)=["']\\/([A-Za-z0-9_.-]+\\.html)(?:[?#][^"']*)?["']/g)){
   if(!existsSync(path.join(root,m[1])))missing.push(file+' -> /'+m[1]);
  }
 }
 assert.deepEqual([...new Set(missing)],[],'Missing HTML routes should be fixed before release');
});
