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

async function load(){
  const dom=new JSDOM(source('index.html'),{
    url:'https://niksremodeling.com/',runScripts:'dangerously'
  });
  dom.window.matchMedia=()=>({matches:true});
  for(const file of ['app.js','room-projects.js']){
    const script=dom.window.document.createElement('script');
    script.textContent=source(file);dom.window.document.body.append(script);
  }
  await new Promise(resolve=>setTimeout(resolve,90));
  return dom;
}

test('Homepage tiles and both Projects dropdowns match the exact fifteen approved projects',async()=>{
  const dom=await load();
  try{
    const doc=dom.window.document;
    const cards=[...doc.querySelectorAll('#projects .project-grid > a.tile')];
    assert.equal(cards.length,15,'There must only be 15 main project picture cards');
    const cardIds=cards.map(a=>new URL(a.href).searchParams.get('project'));
    assert.deepEqual(cardIds,approved.map(([id])=>id),'Homepage picture cards not in approved order');
    assert.deepEqual(cards.map(a=>a.querySelector('span')?.childNodes[0]?.textContent.trim()),approved.map(([,label])=>label));
    for(const id of ['projects-menu','mobile-projects-menu']){
      const menu=doc.getElementById(id);
      assert.ok(menu?.classList.contains('projects-mega'),id+' is missing');
      const branches=[...menu.querySelectorAll(':scope > .project-branch')];
      assert.equal(branches.length,15,id+' has unwanted top-level categories');
      assert.deepEqual(branches.map(b=>[b.dataset.project,b.querySelector('button > span').textContent]),approved,id+' main list differs');
      assert.equal(menu.querySelectorAll(':scope > a').length,0,'No extra first-level links allowed');
      for(const branch of branches){
        const options=[...branch.querySelectorAll('.project-submenu a')];
        assert.ok(options.length>=2,'Every project needs relevant choices: '+branch.dataset.project);
        assert.ok(options[0].href.includes('project='+branch.dataset.project),'The first option must browse that project');
        assert.equal(new Set(options.map(a=>a.href)).size,options.length,'Duplicate submenu destination for '+branch.dataset.project);
      }
    }
  }finally{dom.window.close()}
});

test('Themed rooms offer Kids Room, Workout and other actual project destinations',async()=>{
  const dom=await load();
  try{
    for(const id of ['projects-menu','mobile-projects-menu']){
      const doc=dom.window.document;
      const themed=doc.querySelector('#'+id+' .project-branch[data-project="themed-rooms"]');
      const items=[...themed.querySelectorAll('.project-submenu a')];
      assert.ok(items.some(a=>a.textContent==="Kids' Room"&&a.href.includes('project=kids-room')));
      assert.ok(items.some(a=>a.textContent==='Workout / Fitness Room'&&a.href.includes('project=fitness-wellness')));
      assert.ok(items.some(a=>a.href.includes('project=home-theater')));
      const outdoor=doc.querySelector('#'+id+' .project-branch[data-project="concrete"]');
      assert.ok([...outdoor.querySelectorAll('a')].some(a=>a.href.includes('project=playground')));
      assert.ok([...outdoor.querySelectorAll('a')].some(a=>a.href.includes('project=outdoor-kitchen')));
      const bath=doc.querySelector('#'+id+' .project-branch[data-project="bathrooms"]');
      assert.ok([...bath.querySelectorAll('a')].some(a=>a.href.includes('project=bathrooms&work=toilet')));
      const additions=doc.querySelector('#'+id+' .project-branch[data-project="room-additions"]');
      assert.ok([...additions.querySelectorAll('a')].some(a=>a.href.includes('additionType=Bedroom%20Addition')));
    }
  }finally{dom.window.close()}
});

test('Dropdowns support mouse hover, phone tap and keyboard without clipped menu height',async()=>{
  const dom=await load();
  try{
    const w=dom.window,doc=w.document,menu=doc.getElementById('mobile-projects-menu');
    const buttons=[...menu.querySelectorAll('.project-category-toggle')];
    buttons[0].click();
    assert.equal(buttons[0].getAttribute('aria-expanded'),'true');
    assert.equal(buttons[0].nextElementSibling.hidden,false);
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
  }finally{dom.window.close()}
});
