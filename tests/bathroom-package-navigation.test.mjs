import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

test('Bathroom packages lead to Custom work while preset packages stay simple', async()=>{
 const html=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 for(const tier of ['basic','standard','deluxe','custom']){
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=bathrooms&bathPackage='+tier,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false});}});
  try{
   await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
   const doc=dom.window.document;
   assert.equal(doc.querySelector('h1').textContent,'Bathroom Projects');
   const cards=[...doc.querySelectorAll('.bath-photo-card')];
   assert.equal(cards.length,4,'One page must show four Bathroom choices');
   assert.ok(cards.every(c=>c.tagName==='BUTTON'&&c.querySelector('img')),'Each choice is a local-preview picture button');
   assert.equal(doc.querySelectorAll('.bath-card-preview').length,4,'Every picture previews included work');
   assert.equal(doc.querySelector('#project-work-grid'),null);
   assert.equal(doc.querySelector('.bath-photo-card.current')?.dataset.bathTier,tier);
   const detail=doc.querySelector('#bath-package-details');
   assert.ok(detail.textContent.includes(tier==='basic'?'Minor Painting':tier==='standard'?'Two coats of paint':tier==='deluxe'?'Recaulking and sealing':'Choose individual bathroom work'));
   cards.find(c=>c.dataset.bathTier==='standard').click();
   assert.ok(detail.textContent.includes('Paint existing baseboards'),'Clicking changes the details in place');
   assert.equal(doc.querySelectorAll('.bath-photo-card').length,4);
   assert.equal(dom.window.location.pathname,'/project.html','Package selection stays on the same page');
  }finally{dom.window.close();}
 }
 const chooser=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=bathrooms',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.matchMedia=()=>({matches:false});}});
 try{
  await new Promise(resolve=>chooser.window.addEventListener('load',resolve,{once:true}));
  assert.equal(chooser.window.document.querySelectorAll('.bath-photo-card').length,4);
  assert.equal(chooser.window.document.querySelector('.bath-photo-card.current'),null);
  assert.ok(chooser.window.document.querySelector('a[href$="bathMode=individual"]'),'Custom work calculator remains available');
 }finally{chooser.window.close();}
});
