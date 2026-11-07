import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const main=[
 ['accents','Accent Walls'],['accessibility','Accessibility Updates'],['attic','Attic'],['basement','Basement'],
 ['bathrooms','Bathroom'],['bedroom-guest-room','Bedroom'],['closets-storage','Closets & Storage'],
 ['dining-room','Dining Room'],['garage','Garage'],['kitchen-pantry','Kitchen'],
 ['laundry-utility','Laundry & Utility'],['living-family-room','Living & Family Room'],
 ['custom','More Ideas'],['concrete','Outdoor Projects'],['room-additions','Room Additions'],
 ['themed-rooms','Themed Rooms']
];
async function load(file='index.html',query=''){
 let html=read(file);
 if(file==='project.html')html=html.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(tag,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(new URL(path,root))?'<script>'+read(path).replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/'+file+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
  w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};
 }});
 dom.window.matchMedia=()=>({matches:true});
 if(file==='index.html')for(const path of ['app.js','room-projects.js']){
  const script=dom.window.document.createElement('script');script.textContent=read(path);dom.window.document.body.append(script);
 }
 await new Promise(resolve=>setTimeout(resolve,130));
 return dom;
}
const page=(id,extra='')=>load('project.html','?project='+id+extra);
test('Projects is the same 16 direct links on homepage, desktop and phone',async()=>{
 const dom=await load();
 try{
  const doc=dom.window.document;
  assert.deepEqual([...doc.querySelectorAll('#projects .project-grid > a.tile')].map(x=>new URL(x.href).searchParams.get('project')),main.map(([id])=>id));
  for(const menuId of ['projects-menu','mobile-projects-menu']){
   const nav=doc.getElementById(menuId);
   assert.ok(nav.classList.contains('projects-mega'));
   assert.deepEqual([...nav.querySelectorAll(':scope > a.project-category-link')].map(x=>[new URL(x.href).searchParams.get('project'),x.textContent]),main);
   assert.equal(nav.querySelectorAll('.project-submenu,.project-category-toggle,input').length,0);
  }
 }finally{dom.window.close()}
});
test('Fallback nav still works when enhanced Projects code has not loaded',()=>{
 const dom=new JSDOM(read('index.html'));
 try{
  for(const id of ['projects-menu','mobile-projects-menu'])
   assert.deepEqual([...dom.window.document.querySelectorAll('#'+id+' a[href*="project="]')].map(x=>new URL(x.href,'https://niksremodeling.com').searchParams.get('project')),main.map(([x])=>x));
 }finally{dom.window.close()}
});
test('Project hub pages show actual nested project pictures',async()=>{
 const dom=await load();
 try{
  const w=dom.window;
  for(const [id,render] of [['custom',()=>w.renderCustomProjects()],['concrete',()=>w.renderOutdoorProjects()],['themed-rooms',()=>w.renderThemedRooms()]]){
   render();w.buildProjectDropdowns();
   const cards=[...w.document.querySelectorAll('#outdoor-project-grid > a.tile')];
   assert.ok(cards.length>=6,id);
   assert.ok(cards.every(c=>c.getAttribute('href').startsWith('/project.html?project=')),id);
   for(const menu of ['projects-menu','mobile-projects-menu'])
    assert.ok(w.document.querySelector('#'+menu+' a.project-category-link[href="/project.html?project='+id+'"]'));
  }
 }finally{dom.window.close()}
});
test('All 40 additional packages have Basic and Premium scope',async()=>{
 const dom=await load();
 try{
  const map=dom.window.PROJECT_PACKAGE_CHOICES;
  assert.equal(Object.keys(map).length,40);
  for(const [id,levels] of Object.entries(map))
   assert.ok(levels.length===2&&levels.every(level=>level.length>=2),id);
 }finally{dom.window.close()}
});
test('Room, specialty, themed and outdoor pages open package choices first',async()=>{
 for(const id of ['attic','basement','bedroom-guest-room','garage','laundry-utility','kids-room','adult-room','outdoor-kitchen','arches','murals']){
  const dom=await page(id);
  try{
   const doc=dom.window.document;
   assert.deepEqual([...doc.querySelectorAll('.pkg-choice .pkg-image strong')].map(x=>x.textContent),['Basic','Premium','Custom'],id);
   assert.equal(doc.querySelector('#project-work-grid'),null,id);
   assert.ok(doc.querySelector('.pkg-choice:last-child a.btn')?.getAttribute('href').includes('roomMode=individual'),id);
  }finally{dom.window.close()}
 }
});
test('Custom and existing work-selection links still open the job estimator',async()=>{
 for(const id of ['attic','bedroom-guest-room','garage']){
  const dom=await page(id,'&roomMode=individual');
  try{assert.ok(dom.window.document.querySelector('#project-work-grid .project-work-card'),id);}
  finally{dom.window.close()}
 }
 const dom=await page('attic','&selectedWorks=ceiling');
 try{
  const cards=[...dom.window.document.querySelectorAll('#project-work-grid .project-work-card')];
  assert.ok(cards.length>=8);
  assert.deepEqual(cards.filter(c=>!c.hidden).map(c=>c.dataset.workKey),['ceiling']);
 }finally{dom.window.close()}
});
test('Room Additions opens four project types before site-specific quotes',async()=>{
 const dom=await page('room-additions');
 try{assert.equal(dom.window.document.querySelectorAll('main a[href*="additionType="]').length,4);}
 finally{dom.window.close()}
 const selected=await page('room-additions','&additionType=Bedroom%20Addition');
 try{assert.match(selected.window.document.querySelector('main')?.textContent||'',/In-person quote required/);}
 finally{selected.window.close()}
});
