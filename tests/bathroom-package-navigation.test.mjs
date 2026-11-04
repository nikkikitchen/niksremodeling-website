import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

test('Bathroom packages lead to Custom work while preset packages stay simple', async()=>{
 const html=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 for(const tier of ['basic','standard','deluxe']){
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=bathrooms&bathPackage='+tier,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
  try{
   await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
   const doc=dom.window.document;
   assert.equal(doc.querySelector('h1').textContent,'Bathroom Projects');
   const cards=[...doc.querySelectorAll('.bath-photo-card')];
   assert.equal(cards.length,4,'Package links must keep the four-photo chooser visible');
   assert.ok(cards.find(c=>c.classList.contains('current'))?.href.endsWith('bathPackage='+tier));
   assert.equal(doc.querySelectorAll('.bath-photo-hover').length,4,'Each photo must describe the included work');
   assert.ok(doc.querySelector('.bath-photo-card.current .bath-hover-price')?.textContent.includes('Starting at '));
   assert.ok(doc.querySelector('.project-back')?.href.endsWith('/project.html?project=bathrooms'));
   assert.ok(doc.querySelector('#bath-package-detail')?.textContent.includes('Request Package Estimate'));
   assert.ok(doc.querySelector('#bath-package-detail')?.textContent.includes('Labor, materials and standard supplies included'));
   assert.equal(doc.querySelector('#bath-package-detail ul'),null,'No duplicate checklist below photo tiles');
   assert.ok(!doc.querySelector('#bath-package-detail')?.textContent.includes('Installation Only'));
   assert.equal(doc.querySelector('#bath-package-detail a[href*="/installation.html"]'),null);
   assert.equal(doc.querySelector('#project-work-grid'),null);
  }finally{dom.window.close();}
 }
 const chooser=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=bathrooms',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 try{
  await new Promise(resolve=>chooser.window.addEventListener('load',resolve,{once:true}));
  assert.equal(chooser.window.document.querySelectorAll('.bath-photo-card').length,4);
  assert.equal(chooser.window.document.querySelectorAll('.bath-photo-hover').length,4);
  assert.ok([...chooser.window.document.querySelectorAll('.bath-photo-card')].some(c=>c.href.endsWith('bathMode=individual')));
  assert.equal(chooser.window.document.querySelector('.bath-photo-card.current'),null);
  assert.equal(chooser.window.document.querySelector('#project-work-grid'),null);
 }finally{chooser.window.close();}
});

test('Kitchen project tiles match Bathroom and retain prices and Custom choice', async()=>{
 const html=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 for(const [tier,price] of [['basic','1,995'],['standard','6,495'],['deluxe','17,995']]){
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=kitchen-pantry&kitchenPackage='+tier,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
  try{
   await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
   const doc=dom.window.document;
   assert.equal(doc.querySelector('h1')?.textContent,'Kitchen Projects');
   assert.equal(doc.querySelectorAll('.bath-photo-card').length,4);
   assert.equal(doc.querySelectorAll('.bath-photo-hover').length,4);
   assert.equal(doc.querySelectorAll('.bath-card-add').length,3);
   assert.ok(doc.querySelector('.bath-photo-card.current')?.href.endsWith('kitchenPackage='+tier));
   assert.ok(doc.querySelector('.bath-photo-card.current .bath-hover-price')?.textContent.includes(price));
   assert.ok(doc.querySelector('#bath-package-detail')?.textContent.includes('Labor, materials and standard supplies included'));
   assert.ok([...doc.querySelectorAll('.bath-photo-card')].some(c=>c.href.endsWith('kitchenMode=individual')));
   assert.equal(doc.querySelector('#project-work-grid'),null);
  }finally{dom.window.close();}
 }
});
