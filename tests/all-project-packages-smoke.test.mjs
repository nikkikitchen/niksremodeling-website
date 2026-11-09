import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('project.html',root),'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
 const p=src.split('?')[0].replace(/^\//,'');
 return existsSync(new URL(p,root))?'<script>'+readFileSync(new URL(p,root),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
});
async function open(id){
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project='+id,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 }});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
 return dom;
}
test('Every scoped project has four usable picture packages and an active measurement entry point',async()=>{
 const template=await open('attic');
 const categories=Object.keys(template.window.PROJECT_PACKAGE_CHOICES||{});
 template.window.close();
 assert.equal(categories.length,40);
 for(const id of categories){
  const dom=await open(id);
  try{
   const doc=dom.window.document;
   const cards=[...doc.querySelectorAll('.pkg-choice')];
   assert.equal(cards.length,4,id+' must show four packages');
   assert.equal(doc.querySelectorAll('.pkg-add').length,3,id+' needs three quote buttons');
   assert.equal(doc.querySelectorAll('.pkg-image-overlay').length,3,id+' needs three scope overlays');
   const labels=cards.map(c=>c.querySelector('.pkg-image strong')?.textContent);
   assert.ok(labels.every(Boolean),id+' needs visible tier names');
   assert.equal(new Set(labels).size,4,id+' must not repeat tier names');
   assert.ok(cards.every(c=>c.querySelector('img')?.getAttribute('src')),id+' needs pictures');
   assert.ok(cards.slice(0,3).every(c=>/Starting at|Project quote required/.test(c.querySelector('.pkg-pricing')?.textContent||'')),id+' needs honest pricing');
   assert.ok(cards.at(-1).querySelector('a[href*="roomMode=individual"]'),id+' must offer Custom');
   assert.ok(!doc.querySelector('main').textContent.includes('Choose a package below'),id+' has duplicate directions');
   const basic=doc.querySelector('.pkg-add[data-package="basic"]');
   assert.ok(basic,id+' needs a Basic quote button');
   basic.click();
   assert.ok(doc.querySelector('#pkg-measure-form'),id+' Basic must lead to measurements');
  }finally{dom.window.close();}
 }
});
