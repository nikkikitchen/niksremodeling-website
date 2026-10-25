import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');

test('desktop and mobile Projects dropdowns contain every visible project picture card',async()=>{
  const dom=new JSDOM(source('index.html'),{
    url:'https://niksremodeling.com/',
    runScripts:'dangerously'
  });
  const doc=dom.window.document;
  for(const file of ['app.js','room-projects.js']){
    const script=doc.createElement('script');
    script.textContent=source(file);
    doc.body.append(script);
  }
  await new Promise(resolve=>setTimeout(resolve,80));
  const tiles=[...doc.querySelectorAll('#projects .project-grid > a.tile[href^="/project.html?project="]')];
  const expected=tiles.map(card=>card.getAttribute('href'));
  assert.ok(expected.length>=15,'Projects page needs its picture cards');
  assert.equal(expected.length,new Set(expected).size,'Duplicate picture card destinations');
  for(const id of ['attic','basement','garage','room-additions','themed-rooms']){
    assert.ok(expected.includes('/project.html?project='+id),id+' must have a picture card');
  }
  const visibilityStyle=doc.getElementById('expanded-projects-menu-style');
  assert.ok(visibilityStyle,'Projects menus need the full-height two-column layout');
  assert.match(visibilityStyle.textContent,/grid-template-columns:repeat\\(2,minmax\\(0,1fr\\)\\)/);
  for(const id of ['projects-menu','mobile-projects-menu']){
    const menu=doc.getElementById(id);
    assert.ok(menu,id+' is missing');
    const links=[...menu.querySelectorAll('a[href^="/project.html?project="]')]
      .map(link=>link.getAttribute('href'));
    assert.deepEqual([...links].sort(),[...expected].sort(),id+' does not match the Projects page');
    assert.equal(links.length,new Set(links).size,id+' contains duplicate project links');
    assert.ok(menu.querySelector('a[href="/#projects"]'),'All Projects link must remain');
    assert.ok(menu.querySelector('a[href="/calculators.html?from=projects-menu"]'),'Calculator link must remain');
  }
  dom.window.close();
});
