import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function load(query){
  const browserErrors=[];
  const html=readFileSync('calculators.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(tag,src)=>{
    const path=src.split('?')[0].replace(/^\//,'');
    return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
  });
  const dom=new JSDOM(html,{
    url:'https://niksremodeling.com/calculators.html'+query,
    runScripts:'dangerously',
    pretendToBeVisual:true,
    beforeParse(window){
      window.addEventListener('error',event=>{browserErrors.push(event.error?.stack||event.message);});
      window.HTMLElement.prototype.scrollIntoView=function(){};
      window.scrollTo=()=>{};
    }
  });
  for(let attempt=0;attempt<60;attempt++){
    if(dom.window.document.querySelector('.calc-workspace[data-step]') &&
       dom.window.document.querySelector('.material-only-workflow'))break;
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  if(!dom.window.document.querySelector('.calc-workspace[data-step]'))assert.fail('Shared calculator was not initialized: '+browserErrors.join(' | '));
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
 assert.equal(document.querySelector('#material-products').parentElement.hidden,true,'do not reselect drywall');
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

test('Non-sheet materials reuse the shared calculator without inventing drywall sheet or stud counts',async()=>{
 const cases=[
  {kind:'custom',product:'Drywall — Joint Compound',unit:'pails'},
  {kind:'custom',product:'Drywall — Tape & Corner Bead',unit:'rolls'},
  {kind:'custom',product:'Lumber — Plywood',unit:'sheets'},
  {kind:'custom',product:'Lumber — Decking Boards',unit:'pieces'},
  {kind:'custom',product:'Trim & Molding — Crown Molding',unit:'linear ft.'},
  {kind:'custom',product:'Insulation — Batt Insulation',unit:'sq. ft.'},
  {kind:'custom',product:'Roofing — Asphalt Shingles',unit:'bundles'},
  {kind:'custom',product:'Paint & Finishes — Wallpaper',unit:'pieces'}
 ];
 for(const item of cases){
  const dom=await load('?mode=materials&material='+item.kind+'&product='+encodeURIComponent(item.product));
  try{
   const w=dom.window,doc=w.document;
   assert.equal(doc.querySelector('.calc-workspace').dataset.step,'2',item.product);
   assert.equal(doc.querySelector('#material-name').closest('.field').hidden,true,item.product);
   assert.equal(doc.querySelector('#material-type').closest('.field').hidden,true,item.product);
   assert.equal(doc.querySelector('#custom-unit').value,item.unit,item.product);
   assert.equal(doc.querySelector('[data-material="custom"]').hidden,false,item.product);
   assert.equal(doc.querySelector('#work-services').hidden,true,item.product);
   doc.querySelector('#custom-quantity').value='2';
   w.calcMaterial();
   assert.equal(doc.querySelector('#mat-error').hidden,true,item.product+': '+doc.querySelector('#mat-error').textContent);
   const results=w.eval('materialEstimates');
   assert.equal(results.length,1,item.product);
   assert.equal(results[0].purchase.quantity,2,item.product);
   assert.equal(results[0].purchase.unit,item.unit,item.product);
   assert.ok(results[0].result.includes(item.unit),item.product);
   assert.equal(results[0].labor.length,0,item.product);
  }finally{dom.window.close()}
 }
});
test('Every Materials tile points to the same estimator with the material already chosen',async()=>{
 const categories=['flooring','tile-stone','drywall','wood','lumber','trim-molding','paint-finishes','insulation','roofing','siding-exterior','doors-windows','concrete-masonry'];
 const pageFiles=categories.map(slug=>'material-'+slug+'.html');
 for(const file of pageFiles){
  const html=readFileSync(file,'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(tag,src)=>{
    const path=src.split('?')[0].replace(/^\//,'');
    return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
  });
  const dom=new JSDOM(html,{url:'https://niksremodeling.com/'+file,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};}});
  try{
   await new Promise(resolve=>setTimeout(resolve,70));
   // Lumber uses a dimension-first selector instead of the retired generic tile grid.
   if(file==='material-lumber.html'||file==='material-wood.html'){
    const selector=dom.window.document.querySelector('.lumber-selector');
    assert.ok(selector,'Wood & Lumber shopping catalog must render');
    assert.ok(selector.querySelectorAll('.wood-size-choice').length>=4,'selected category must show large size buttons');
    assert.equal(selector.querySelector('.wood-category-select').options.length,12);
    assert.ok(selector.querySelector('.wood-list'),'selections must build a list');
    assert.equal(selector.querySelectorAll('a[href*="calculators.html"]').length,0,'shopping lumber must not send customers to the project calculator');
    const projectsLink=selector.querySelector('.wood-project-cta a');
    assert.ok(projectsLink,'takeoff should be reached under Projects');
    assert.equal(new URL(projectsLink.href).pathname,'/');
    continue;
   }
   const links=[...dom.window.document.querySelectorAll('.material-option-card .card-actions a[href*="calculators.html"]')];
   assert.ok(links.length>0,file+' must offer calculator links');
   for(const link of links){
    const url=new URL(link.href);
    assert.equal(url.pathname,'/calculators.html',file);
    assert.equal(url.searchParams.get('mode'),'materials',file);
    assert.ok(url.searchParams.get('product'),file);
    assert.ok(url.searchParams.get('material'),file);
    assert.equal(link.textContent.trim(),'Calculate Materials',file);
   }
  }finally{dom.window.close()}
 }
});
