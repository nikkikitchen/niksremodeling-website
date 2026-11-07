import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const html=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
 const path=src.split('?')[0].replace(/^\//,'');
 return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
});
async function load(params=''){
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=kitchen-pantry'+params,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
  w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};
 }});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
 return dom;
}

test('Kitchen packages use the shared photo cards and preserve their prices',async()=>{
 for(const [tier,price] of [['basic','1,995'],['standard','6,495'],['deluxe','17,995']]){
  const dom=await load('&roomPackage='+tier);
  try{
   const doc=dom.window.document;
   assert.equal(doc.querySelector('h1')?.textContent,'Kitchen Projects');
   assert.equal(doc.querySelectorAll('.pkg-choice').length,4);
   assert.equal(doc.querySelectorAll('.pkg-image-overlay').length,3);
   assert.equal(doc.querySelectorAll('.pkg-mobile-details').length,3);
   assert.equal(doc.querySelectorAll('.pkg-add').length,3);
   assert.ok(doc.querySelector('.pkg-choice.selected .pkg-pricing')?.textContent.includes(price));
   assert.ok(doc.querySelector('.pkg-choice:last-child a[href*="roomMode=individual"]'));
   assert.equal(doc.querySelector('.bath-photo-card'),null,'Do not keep a second Kitchen-only layout');
  }finally{dom.window.close();}
 }
});

test('Kitchen Custom opens the same detailed work estimator',async()=>{
 const dom=await load('&roomMode=individual');
 try{
  assert.ok(dom.window.document.querySelector('#project-work-grid'),'Custom Kitchen work choices missing');
  assert.equal(dom.window.document.querySelectorAll('.pkg-choice').length,0);
 }finally{dom.window.close();}
});
