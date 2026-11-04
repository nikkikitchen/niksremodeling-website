import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const html=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
});
const load=async params=>{
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/project.html?project=kitchen-pantry'+params,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
  return dom;
};

test('Kitchen packages display four photo tiles with hover contents and complete-package details',async()=>{
  for(const tier of ['basic','standard','deluxe']){
    const dom=await load('&kitchenPackage='+tier);
    try{
      const doc=dom.window.document;
      assert.equal(doc.querySelector('h1')?.textContent,'Kitchen Projects');
      assert.equal(doc.querySelectorAll('.bath-photo-card').length,4);
      assert.equal(doc.querySelectorAll('.bath-photo-hover').length,4);
      assert.ok(doc.querySelector('.bath-photo-card.current')?.href.endsWith('kitchenPackage='+tier));
      const detail=doc.getElementById('bath-package-detail');
      assert.ok(detail?.textContent.includes('Labor, materials, and needed supplies are included'));
      assert.ok(detail?.textContent.includes('Request Package Estimate'));
      assert.equal(detail.querySelector('a[href*="installation.html"]'),null);
      assert.equal(doc.getElementById('project-work-grid'),null);
      assert.ok([...doc.querySelectorAll('.bath-photo-card')].some(x=>x.href.endsWith('kitchenMode=individual')));
    }finally{dom.window.close();}
  }
});
test('Kitchen main link shows four-photo chooser; custom opens original detailed work options',async()=>{
  const chooser=await load('');
  try{
    const doc=chooser.window.document;
    assert.equal(doc.querySelectorAll('.bath-photo-card').length,4);
    assert.equal(doc.querySelector('.bath-photo-card.current'),null);
  }finally{chooser.window.close();}
  const custom=await load('&kitchenMode=individual');
  try{
    const doc=custom.window.document;
    assert.ok(doc.querySelector('#project-work-grid'),'Kitchen custom work grid missing');
    assert.equal(doc.querySelectorAll('.bath-photo-card').length,0);
  }finally{custom.window.close();}
});
