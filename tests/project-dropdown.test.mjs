import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');
const approved=[
  ['accessibility','Accessibility Updates'],['attic','Attic'],['basement','Basement'],
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
    const primary=branch.querySelector('.project-category-link');
    const button=branch.querySelector('.project-category-toggle');
    assert.ok(button?.getAttribute('aria-label').includes('choices'));
    const multiJob=!['themed-rooms','concrete','custom','room-additions'].includes(id);
    if(multiJob){
     assert.equal(primary.tagName,'BUTTON',id+' should expand choices without navigation');
     const boxes=[...branch.querySelectorAll('.project-submenu input[type="checkbox"]')];
     assert.ok(boxes.length>=2,id+' missing job checkboxes');
     assert.equal(new Set(boxes.map(x=>x.value)).size,boxes.length);
     assert.equal(branch.querySelectorAll('.project-submenu a:not(.project-continue)').length,0,'Old job links remain');
     assert.equal(branch.querySelector('.project-submenu a.project-continue')?.textContent,'Continue');
     assert.equal(branch.querySelector('.project-submenu button'),null,'Use a real mobile-friendly Continue link');
    }else{
     assert.equal(primary.getAttribute('href'),href(id));
     const links=[...branch.querySelectorAll('.project-submenu a')];
     assert.ok(links.length>=2,id+' missing subcategories');
     assert.equal(new Set(links.map(a=>a.href)).size,links.length);
    }
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
    const sub=[...branch.querySelectorAll('.project-submenu a')]
     .map(a=>[a.textContent,a.getAttribute('href')]);
    assert.deepEqual(sub,pageCards,'Every '+id+' flyout link and title must equal the picture-card page');
   }
   if(id==='themed-rooms'){
    assert.ok(pageCards.some(([t,u])=>t==='Adult Room'&&u===href('adult-room')),'Adult Room must appear on the Themed Rooms page and dropdowns');
    assert.ok(pageCards.some(([t,u])=>t==="Kids' Room"&&u===href('kids-room')));
    assert.ok(pageCards.some(([t,u])=>t==='Fitness & Wellness Room'&&u===href('fitness-wellness')));
    assert.ok(pageCards.some(([t,u])=>t==='Home Theater'&&u===href('home-theater')));
   }
  }
 }finally{dom.window.close()}
});

test('Attic checkbox selection stays within dropdown, including reopen',async()=>{
 const dom=await load();
 try{
  const w=dom.window,doc=w.document,menu=doc.getElementById('mobile-projects-menu');
  const branch=menu.querySelector('.project-branch[data-project="attic"]');
  const primary=branch.querySelector('.project-category-link');
  primary.click();
  const submenu=branch.querySelector('.project-submenu');
  assert.equal(submenu.hidden,false);
  assert.equal(primary.getAttribute('aria-expanded'),'true');
  assert.equal(submenu.querySelectorAll('a').length,0);
  const framing=submenu.querySelector('input[value="framing"]');
  const ceiling=submenu.querySelector('input[value="ceiling"]');
  assert.ok(framing&&ceiling);
  for(const box of [framing,ceiling]){box.checked=true;box.dispatchEvent(new w.Event('change',{bubbles:true}));}
  assert.equal(submenu.querySelectorAll('input:checked').length,2);
  branch.querySelector('.project-category-toggle').click();
  assert.equal(submenu.hidden,true);
  primary.click();
  assert.ok(framing.checked&&ceiling.checked);
 }finally{dom.window.close()}
});

test('Continue uses current Attic checkboxes for one or multiple jobs on desktop and phone',async()=>{
 const dom=await load();
 try{
  const w=dom.window,doc=w.document;
  for(const menuId of ['projects-menu','mobile-projects-menu']){
   const branch=doc.querySelector('#'+menuId+' .project-branch[data-project="attic"]');
   const nav=branch.querySelector('.project-submenu'),go=nav.querySelector('.project-continue');
   const boxes=[...nav.querySelectorAll('input[type="checkbox"]')];
   const byValue=value=>boxes.find(x=>x.value===value);
   const params=()=>new URL(go.href).searchParams;
   // Prevent jsdom trying a real navigation, while still running the Continue click.
   go.addEventListener('click',event=>event.preventDefault(),true);
   branch.querySelector('.project-category-link').click();
   assert.equal(nav.hidden,false);
   byValue('ceiling').checked=true;
   go.click();
   assert.equal(params().get('project'),'attic');
   assert.equal(params().get('selectedWorks'),'ceiling',menuId+' failed single selection without a change event');
   for(const value of ['floor','walls']){
    const box=byValue(value);box.checked=true;
    box.dispatchEvent(new w.Event('change',{bubbles:true}));
   }
   go.click();
   assert.equal(params().get('selectedWorks'),'ceiling,floor,walls',menuId+' failed multiple jobs');
   byValue('ceiling').checked=false;
   byValue('floor').checked=false;
   go.click();
   assert.equal(params().get('selectedWorks'),'walls',menuId+' failed after deselecting jobs');
   byValue('walls').checked=false;
   const event=new w.MouseEvent('click',{bubbles:true,cancelable:true});
   go.dispatchEvent(event);
   assert.equal(event.defaultPrevented,true,'Empty selection must not navigate');
   assert.match(nav.textContent,/Choose at least one job/);
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
  assert.ok(Number.parseInt(short.style.getPropertyValue('--project-submenu-height'))>=180,'Short flyout must fit its links');
  assert.ok(Number.parseInt(short.style.getPropertyValue('--project-submenu-top'))>=12);
  last.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.ok(Number.parseInt(long.style.getPropertyValue('--project-submenu-height'))<=626,'Long flyout must fit viewport');
  assert.ok(Number.parseInt(long.style.getPropertyValue('--project-submenu-top'))>=12);
  // A lower category with a small number of options keeps the same height as
  // an upper category and moves upward instead of losing options.
  Object.defineProperty(long,'scrollHeight',{value:180,configurable:true});
  first.dispatchEvent(new w.MouseEvent('mouseenter'));
  last.dispatchEvent(new w.MouseEvent('mouseenter'));
  assert.ok(Number.parseInt(long.style.getPropertyValue('--project-submenu-height'))>=180);
  assert.ok(Number.parseInt(long.style.getPropertyValue('--project-submenu-top'))>=12);
  assert.match(doc.getElementById('expanded-projects-menu-style').textContent,/height:var\(--project-submenu-height,auto\)/);

 }finally{dom.window.close()}
});

test('Desktop and phone menus expose Adult Room and Room Additions, with expandable choices',async()=>{
 const dom=await load();
 try{
  const w=dom.window,doc=w.document;
  const staticMenu=source('app.js');
  assert.ok(staticMenu.includes('<a href="/project.html?project=room-additions">Room Additions</a><a href="/project.html?project=themed-rooms">Themed Rooms</a><a href="/project.html?project=adult-room">Adult Room</a></div></div><div class="nav-menu"><button class="nav-toggle shopping-toggle" type="button" aria-expanded="false" aria-controls="mobile-shopping-menu">'),'Phone fallback must contain both additions and Adult Room');
  for(const [name,width,menuId] of [['desktop',1280,'projects-menu'],['phone',390,'mobile-projects-menu']]){
   Object.defineProperty(w,'innerWidth',{value:width,configurable:true});
   const menu=doc.getElementById(menuId);
   const themed=menu?.querySelector('[data-project="themed-rooms"]');
   const addition=menu?.querySelector('[data-project="room-additions"]');
   assert.ok(themed&&addition,name+' missing category');
   const button=themed.querySelector('.project-category-toggle');
   button.click();
   const options=themed.querySelector('.project-submenu');
   assert.equal(button.getAttribute('aria-expanded'),'true',name+' branch did not open');
   assert.equal(options.hidden,false,name+' submenu hidden');
   const adult=options.querySelector('a[href="/project.html?project=adult-room"]');
   assert.ok(adult&&adult.textContent==='Adult Room',name+' Adult Room missing or wrong link');
   assert.ok(Number.parseInt(menu.style.getPropertyValue('--project-menu-height'),10)>0,name+' menu not sized');
   assert.deepEqual([...menu.querySelectorAll(':scope > .project-branch')].map(b=>b.dataset.project),approved.map(([id])=>id));
  }
 }finally{dom.window.close()}
});
