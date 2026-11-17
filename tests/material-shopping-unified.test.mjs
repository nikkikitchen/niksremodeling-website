import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function load(query){
  const html=readFileSync('calculators.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(tag,src)=>{
    const path=src.split('?')[0].replace(/^\//,'');
    return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
  });
  const dom=new JSDOM(html,{
    url:'https://niksremodeling.com/calculators.html'+query,
    runScripts:'dangerously',
    pretendToBeVisual:true,
    beforeParse(window){
      window.HTMLElement.prototype.scrollIntoView=function(){};
      window.scrollTo=()=>{};
    }
  });
  for(let attempt=0;attempt<60;attempt++){
    if(dom.window.document.querySelector('.calc-workspace[data-step]') &&
       dom.window.document.querySelector('.material-only-workflow'))break;
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  return dom;
}

test('Shopping drywall uses the same calculator engine with work already selected',async()=>{
 const dom=await load('?mode=materials&material=drywall&product='+encodeURIComponent('Drywall — Drywall Panels'));
 const {document}=dom.window;
 assert.equal(document.querySelector('.calc-workspace')?.dataset.step,'2');
 assert.ok(document.querySelector('.material-only-workflow'),'same shared project calculator enters materials mode');
 assert.equal(document.querySelector('.calculator-progress').children[1].textContent,'1 · Measurements');
 assert.equal(document.querySelector('#material-name').closest('.field').hidden,true,'room not asked');
 assert.equal(document.querySelector('#material-type').closest('.field').hidden,true,'drywall not asked again');
 assert.equal(document.querySelector('.room-questions').hidden,true,'no duplicate project questions');
 assert.equal(document.querySelector('#material-products').closest('.field').hidden,true,'do not reselect drywall');
 assert.equal(document.querySelector('#material-choice').value,'Drywall — Drywall Panels');
 assert.equal(document.querySelector('#work-services').hidden,true,'installation not assumed for materials-only purchase');
 assert.equal(document.querySelector('#dry-waste').value,'0.15');
 document.querySelector('#dry-length').value='12';
 document.querySelector('#dry-height').value='8';
 document.querySelector('#dry-openings').value='0';
 dom.window.calcMaterial();
 const error=document.querySelector('#mat-error');
 assert.equal(error.hidden,true,error.textContent);
 const saved=dom.window.eval('materialEstimates');
 assert.equal(saved.length,1);
 assert.equal(saved[0].purchase.quantity,4,'12 × 8 × 1.15 = 110.4 square feet = 4 standard sheets');
 assert.equal(saved[0].labor.length,0,'no labor bundled into materials-only');
 dom.window.close();
});

test('Material detail cards use one unified Calculate Materials path',()=>{
 const source=readFileSync('app.js','utf8');
 assert.match(source,/calculators\.html\?mode=materials&product=/);
 assert.match(source,/>Calculate Materials<\/a>/);
 assert.doesNotMatch(source,/>Plan Installation<\/a>/);
});
