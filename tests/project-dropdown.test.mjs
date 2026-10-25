import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');

async function load(){
  const dom=new JSDOM(source('index.html'),{
    url:'https://niksremodeling.com/',runScripts:'dangerously'
  });
  dom.window.matchMedia=()=>({matches:true});
  for(const file of ['app.js','room-projects.js']){
    const script=dom.window.document.createElement('script');
    script.textContent=source(file);dom.window.document.body.append(script);
  }
  await new Promise(resolve=>setTimeout(resolve,80));
  return dom;
}

test('desktop and mobile Projects menus share all catalog destinations, including nested specialties',async()=>{
  const dom=await load();
  try{
    const doc=dom.window.document;
    const tiles=[...doc.querySelectorAll('#projects .project-grid > a.tile[href^="/project.html?project="]')];
    const visible=new Set(tiles.map(card=>card.getAttribute('href')));
    assert.ok(visible.size>=15);
    const expected=dom.window.eval('Object.keys(PROJECT_CATALOG).map(id=>"/project.html?project="+encodeURIComponent(id))');
    // Object.keys includes only intentional, non-legacy project destinations.
    assert.ok(expected.length>visible.size,'Specialty projects should appear inside nested menus');
    for(const id of ['attic','basement','garage','room-additions','themed-rooms','kids-room','pet-room','playground','outdoor-kitchen','mechanic-shop','car-wash','accessibility']){
      assert.ok(expected.includes('/project.html?project='+id),'Missing '+id+' in catalog');
    }
    assert.ok(doc.getElementById('expanded-projects-menu-style')?.textContent.includes('overflow-y:auto'));
    for(const id of ['projects-menu','mobile-projects-menu']){
      const menu=doc.getElementById(id);
      assert.ok(menu?.classList.contains('projects-mega'),id+' must use shared menu builder');
      const branches=[...menu.querySelectorAll(':scope > .project-branch')];
      assert.deepEqual(branches.map(b=>b.querySelector('button').textContent.replace('›','').trim()),[
        'Rooms & Projects','Themed Rooms','Outdoor Projects','More Ideas & Finishes'
      ]);
      const links=[...menu.querySelectorAll('a[href^="/project.html?project="]')].map(a=>a.getAttribute('href'));
      assert.deepEqual([...links].sort(),[...expected].sort(),id+' is missing published projects');
      assert.equal(links.length,new Set(links).size,id+' contains duplicate project links');
      assert.ok([...visible].every(href=>links.includes(href)),id+' misses a homepage card');
      assert.ok(menu.querySelector('a[href="/#projects"]'),'All Projects link must remain');
      assert.ok(menu.querySelector('a[href="/calculators.html?from=projects-menu"]'),'Calculator link must remain');
    }
  }finally{dom.window.close()}
});

test('Projects sections expand on tap or hover, close siblings and fit the viewport',async()=>{
  const dom=await load();
  try{
    const w=dom.window,menu=w.document.getElementById('mobile-projects-menu');
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
    const desktop=w.document.querySelector('#projects-menu .project-branch');
    desktop.dispatchEvent(new w.MouseEvent('mouseenter'));
    assert.equal(desktop.querySelector('button').getAttribute('aria-expanded'),'true');
  }finally{dom.window.close()}
});
