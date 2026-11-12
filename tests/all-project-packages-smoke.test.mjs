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

test('Accent Walls uses matching visible tier names and keeps existing package links',async()=>{
 const dom=await open('accents');
 try{
  const cards=[...dom.window.document.querySelectorAll('.pkg-choice')];
  assert.deepEqual(cards.map(c=>c.querySelector('.pkg-image strong')?.textContent),['Basic','Standard','Deluxe','Custom']);
  // Preserve existing direct links while customer-facing names are normalized.
  assert.deepEqual(cards.slice(0,3).map(c=>c.querySelector('.pkg-add')?.dataset.package),['basic','deluxe','premium']);
  assert.ok(cards[0].querySelector('.pkg-pricing')?.textContent.includes('Preliminary estimate'));
  assert.ok(cards[1].querySelector('.pkg-pricing')?.textContent.includes('Project quote required'),'Standard faux finishes require a scoped quote');
  assert.ok(cards[2].querySelector('.pkg-pricing')?.textContent.includes('Preliminary estimate'));
 }finally{dom.window.close();}
});
test('Audited attic Basic applies seven-percent labor discount without double material markup',async()=>{
 const dom=await open('attic');
 try{
  const spec=dom.window.NIK_AUDITED_PACKAGE_PRICES?.attic?.basic;
  assert.equal(spec.laborDiscountPercent,7);
  assert.equal(dom.window.NIK_CALCULATE_PACKAGE_BASELINE(spec).startingAt,1735);
  assert.match(dom.window.document.querySelector('.pkg-pricing')?.textContent||'',/Starting at \$1,735/);
 }finally{dom.window.close();}
});
