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
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=bathrooms&bathPackage='+tier,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
  try{
   await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
   const doc=dom.window.document;
   assert.equal(doc.querySelector('h1').textContent,'Bathroom Projects');
   assert.equal(doc.querySelectorAll('.bath-tier-link').length,4);
   assert.ok(doc.querySelector('.bath-tier-link.current').href.endsWith('bathPackage='+tier));
   assert.equal(doc.querySelector('#project-work-grid'),null);
   if(tier==='custom')assert.ok([...doc.querySelectorAll('a')].some(a=>a.textContent==='Choose Custom Work'&&a.href.endsWith('bathMode=individual')));
  }finally{dom.window.close();}
 }
});
