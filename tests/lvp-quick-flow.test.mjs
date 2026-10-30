import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function openPage(file, query = '') {
  const html=readFileSync(file,'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(tag,src)=>{
    const path=src.split('?')[0].replace(/^\//,'');
    return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
  });
  const dom=new JSDOM(html,{
    url:'https://niksremodeling.com/'+file+query,
    runScripts:'dangerously',
    pretendToBeVisual:true,
    beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.alert=()=>{};}
  });
  await new Promise(resolve=>setTimeout(resolve,100));
  return dom;
}

test('LVP from Projects asks about pad only once and accepts a two-measurement quote',async()=>{
  const project=await openPage('project.html','?project=bathrooms&selectedWorks=floor');
  let target='';
  try {
    const w=project.window,card=w.document.querySelector('[data-work-key="floor"]');
    assert.ok(card,'Floor work must be available');
    const inputs=[...card.querySelectorAll(':scope > label input')];
    assert.ok(inputs.some(box=>box.value==='Luxury Vinyl Plank (LVP)'));
    for(const box of inputs)box.checked=box.value==='Luxury Vinyl Plank (LVP)';
    w.openProjectMeasurements=url=>target=url;
    card.querySelector('button.btn.primary').click();
    assert.ok(target,'LVP selection must reach the calculator');
    assert.equal(new URL(target,w.location.origin).searchParams.get('materials'),'Luxury Vinyl Plank (LVP)');
  } finally { project.window.close(); }

  const calc=await openPage('calculators.html',target.slice(target.indexOf('?')));
  try {
    const w=calc.window,d=w.document;
    const row=[...d.querySelectorAll('.area-product')].find(el=>el.querySelector('[name="area-product"]')?.value==='Luxury Vinyl Plank (LVP)');
    assert.ok(row,'Selected LVP should be carried into calculator');
    assert.equal(row.querySelector('[name="area-product"]').checked,true);
    assert.equal(row.querySelector('[data-item-option="Padding"]'),null,'No second padding question in material options');
    assert.equal(d.querySelectorAll('#question-padding').length,1,'Pad is asked once under Project details');
    assert.equal(row.querySelector('[data-item-option="Installation"]')?.value,'Floating','Default to ordinary floating installation');
    for(const key of ['base','padding'])assert.equal(d.getElementById('question-'+key)?.value,'unsure','Uncertain details must not block the quick quote');
    assert.equal(d.getElementById('question-trim')?.value,'yes','Approved perimeter trim is included by default, with a no-trim option');
    assert.equal(d.getElementById('material-name').value,'Bathroom');
    d.getElementById('floor-length').value='12';
    d.getElementById('floor-width').value='12';
    d.getElementById('question-padding').value='yes';
    d.getElementById('question-base').value='wood';
    d.getElementById('question-trim').value='no';
    w.calcMaterial();
    assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
    const item=w.eval('materialEstimates')[0];
    assert.ok(item,'Quick project estimate saved');
    assert.equal(item.answers.padding,'yes','Pad answer is retained for supply planning');
    assert.equal(item.products[0].name,'Luxury Vinyl Plank (LVP)');
    assert.equal(item.products[0].options.Padding,undefined,'No conflicting second pad answer');
    assert.ok(!item.supplyChoices.some(s=>s.name==='Compatible underlayment' || s.name==='Underlayment seam tape'),'Do not include extra padded underlayment when flooring has attached pad');
    assert.equal(item.measurements.area,144);
    assert.ok(w.flooringLaborEstimate(item,'Installation')?.amount>0,'Existing flooring labor pricing preserved');
    w.addProjectToCart();
    assert.ok(w.getCart().some(x=>x.type==='Labor'),'Labor reaches cart');
  } finally { calc.window.close(); }
});

test('Changing selected LVP from floating to glue-down removes pad question',async()=>{
  const calc=await openPage('calculators.html','?project=bathrooms&work=floor&material=flooring&room=Bathroom&location=interior&materials=Luxury%20Vinyl%20Plank%20(LVP)');
  try {
    const d=calc.window.document;
    const install=d.querySelector('[data-item-option="Installation"]');
    assert.equal(install?.value,'Floating');
    install.value='Glue down';
    install.dispatchEvent(new calc.window.Event('change',{bubbles:true}));
    assert.equal(d.getElementById('floor-kind').value,'glue');
    assert.equal(d.getElementById('question-padding'),null,'Glue-down does not use floating pad');
  } finally {calc.window.close();}
});


test('Concrete, wood, and unknown LVP pad options do not produce duplicate or unsuitable supplies',async()=>{
  for(const [base,padding,expectPad,expectBarrier] of [
    ['concrete','yes',false,true],
    ['wood','yes',false,false],
    ['wood','no',true,false],
    ['concrete','no',true,true],
    ['wood','unsure',false,false],
    ['unsure','unsure',false,true]
  ]){
    const calc=await openPage('calculators.html','?project=bathrooms&work=floor&material=flooring&room=Bathroom&location=interior&materials=Luxury%20Vinyl%20Plank%20(LVP)');
    try{
      const w=calc.window,d=w.document;
      assert.equal(d.querySelectorAll('#question-padding').length,1);
      d.getElementById('question-base').value=base;
      d.getElementById('question-padding').value=padding;
      d.getElementById('question-padding').dispatchEvent(new w.Event('change',{bubbles:true}));
      d.getElementById('floor-length').value='12';
      d.getElementById('floor-width').value='12';
      d.getElementById('question-trim').value='no';
      w.calcMaterial();
      assert.equal(d.getElementById('mat-error').hidden,true,d.getElementById('mat-error').textContent);
      const estimate=w.eval('materialEstimates')[0];
      assert.ok(estimate,'Estimate must be available');
      const names=estimate.supplyChoices.map(x=>x.name);
      assert.equal(names.includes('Compatible underlayment'),expectPad,base+'/'+padding);
      assert.equal(names.includes('Moisture or vapor barrier'),expectBarrier,base+'/'+padding);
      assert.equal(names.includes('Underlayment seam tape'),expectPad,base+'/'+padding);
      const guidance=d.getElementById('lvp-padding-guidance').textContent;
      assert.match(guidance,base==='wood'?/do not put plastic/i:base==='concrete'?/check slab moisture/i:/confirm the actual subfloor/i);
      if(padding==='yes')assert.match(guidance,/no extra cushioning/i);
    }finally{calc.window.close();}
  }
});
