import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');
const approved=[
  ['accessibility','Disability Updates'],['attic','Attic'],['basement','Basement'],
  ['bathrooms','Bathroom'],['bedroom-guest-room','Bedrooms'],
  ['closets-storage','Closets & Storage'],['dining-room','Dining Room'],
  ['garage','Garage'],['kitchen-pantry','Kitchens'],
  ['laundry-utility','Laundry & Utility'],['living-family-room','Living & Family Room'],
  ['custom','More Ideas'],['concrete','Outdoor Projects'],
  ['room-additions','Room Additions'],['themed-rooms','Themed Rooms']
];
const href=project=>'/project.html?project='+project;

async function load(){
 const dom=new JSDOM(source('index.html'),{url:'https://niksremodeling.com/',runScripts:'dangerously'});
 dom.window.matchMedia=()=>({matches:true});
 for(const file of ['app.js','room-projects.js']){
  const script=dom.window.document.createElement('script');script.textContent=source(file);
  dom.window.document.body.append(script);
 }
 await new Promise(resolve=>setTimeout(resolve,90));
 return dom;
}

test('Homepage cards and both dropdowns have exactly the same fifteen project names and destinations',async()=>{
 const dom=await load();
 try{
  const doc=dom.window.document;
  const tiles=[...doc.querySelectorAll('#projects .project-grid > a.tile')];
  assert.equal(tiles.length,15,'15 main picture cards required');
  const cardPairs=tiles.map(a=>[new URL(a.href).searchParams.get('project'),a.querySelector('span')?.firstChild?.textContent.trim()]);
  assert.deepEqual(cardPairs.slice().sort((a,b)=>a[0].localeCompare(b[0])),approved.slice().sort((a,b)=>a[0].localeCompare(b[0])));
  for(const id of ['projects-menu','mobile-projects-menu']){
   const menu=doc.getElementById(id);
   assert.ok(menu?.classList.contains('projects-mega'),id+' missing');
   const branches=[...menu.querySelectorAll(':scope > .project-branch')];
   assert.equal(branches.length,15,'Unapproved first-level Projects present');
   const names=branches.map(b=>[b.dataset.project,b.querySelector('.project-category-link').textContent]);
   assert.deepEqual(names,approved,'Dropdown choices/order do not mirror 15 main picture cards');
   assert.equal(menu.querySelectorAll(':scope > a').length,0,'Extra top-level links in Projects');
   for(const branch of branches){
    const id=branch.dataset.project;
    assert.equal(branch.querySelector('.project-category-link')?.getAttribute('href'),href(id),'Project name must open its picture-card destination');
    const button=branch.querySelector('.project-category-toggle');
    assert.ok(button?.getAttribute('aria-label').includes('choices'),'Arrow must expand subcategories');
    const sub=[...branch.querySelectorAll('.project-submenu a')];
    assert.ok(sub.length>=2,id+' missing relevant suboptions');
    assert.equal(sub[0].getAttribute('href'),href(id),'First subchoice must visit the same project');
    assert.equal(new Set(sub.map(a=>a.href)).size,sub.length,'Duplicate subchoice URL '+id);
   }
  }
 }finally{dom.window.close()}
});

test('Themed Rooms, Outdoor Projects and More Ideas flyouts match their actual picture-card pages exactly',async()=>{
 const dom=await load();
 try{
  const w=dom.window,doc=w.document;
  const samples=[
   ['themed-rooms',()=>w.renderThemedRooms()],
   ['concrete',()=>w.renderOutdoorProjects()],
   ['custom',()=>w.renderCustomProjects()]
  ];
  for(const [id,render] of samples){
   render();
   // The live hub page renders a fresh header; rebuild the menu for that page.
   w.buildProjectDropdowns();
   const pageCards=[...doc.querySelectorAll('#outdoor-project-grid > a.tile')]
     .map(a=>[a.querySelector('span')?.firstChild?.textContent,a.getAttribute('href')]);
   assert.ok(pageCards.length>=6,'Too few '+id+' picture cards');
   for(const menuId of ['projects-menu','mobile-projects-menu']){
    const branch=doc.querySelector('#'+menuId+' .project-branch[data-project="'+id+'"]');
    assert.ok(branch,'Missing '+id+' on '+menuId);
    const sub=[...branch.querySelectorAll('.project-submenu a')].slice(1)
     .map(a=>[a.textContent,a.getAttribute('href')]);
    assert.deepEqual(sub,pageCards,'Every '+id+' flyout link and title must equal the picture-card page');
   }
   if(id==='themed-rooms'){
    assert.ok(pageCards.some(([t,u])=>t==="Kids' Room"&&u===href('kids-room')));
    assert.ok(pageCards.some(([t,u])=>t==='Fitness & Wellness Room'&&u===href('fitness-wellness')));
    assert.ok(pageCards.some(([t,u])=>t==='Home Theater'&&u===href('home-theater')));
   }
  }
 }finally{dom.window.close()}
});

test('Arrow tap expands flyout, mouse hover opens it and keyboard navigation is supported',async()=>{
 const dom=await load();
 try{
  const w=dom.window,doc=w.document,menu=doc.getElementById('mobile-projects-menu');
  const buttons=[...menu.querySelectorAll('.project-category-toggle')];
  buttons[0].click();
  assert.equal(buttons[0].getAttribute('aria-expanded'),'true');
  assert.equal(buttons[0].closest('.project-branch').querySelector('.project-submenu').hidden,false);
  buttons[1].click();
  assert.equal(buttons[0].getAttribute('aria-expanded'),'false');
  assert.equal(buttons[1].getAttribute('aria-expanded'),'true');
  buttons[1].click();
  assert.equal(buttons[1].getAttribute('aria-expanded'),'false');
  assert.ok(Number.parseInt(menu.style.getPropertyValue('--project-menu-height'))>0);
  const desktop=doc.querySelector('#projects-menu .project-branch');
  desktop.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(desktop.querySelector('button').getAttribute('aria-expanded'),'true');
  assert.match(doc.getElementById('expanded-projects-menu-style').textContent,/overflow-y:auto/);
  // Compact options have a compact panel, while a long flyout scrolls and
  // shifts upward near the bottom instead of shrinking or clipping.
  Object.defineProperty(w,'innerHeight',{value:650,configurable:true});
  const branches=[...doc.querySelectorAll('#projects-menu .project-branch')];
  const first=branches[0],last=branches[branches.length-1];
  const short=first.querySelector('.project-submenu');
  const long=last.querySelector('.project-submenu');
  first.getBoundingClientRect=()=>({top:150});
  last.getBoundingClientRect=()=>({top:580});
  Object.defineProperty(short,'scrollHeight',{value:180,configurable:true});
  Object.defineProperty(long,'scrollHeight',{value:1000,configurable:true});
  first.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(short.style.getPropertyValue('--project-submenu-height'),'180px');
  assert.equal(short.style.getPropertyValue('--project-submenu-top'),'150px');
  last.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(long.style.getPropertyValue('--project-submenu-height'),'626px');
  assert.equal(long.style.getPropertyValue('--project-submenu-top'),'12px');
  // A lower category with a small number of options keeps the same height as
  // an upper category and moves upward instead of losing options.
  Object.defineProperty(long,'scrollHeight',{value:180,configurable:true});
  last.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.equal(long.style.getPropertyValue('--project-submenu-height'),'180px');
  assert.equal(long.style.getPropertyValue('--project-submenu-top'),'458px');
  assert.match(doc.getElementById('expanded-projects-menu-style').textContent,/height:var\(--project-submenu-height,auto\)/);

 }finally{dom.window.close()}
});
