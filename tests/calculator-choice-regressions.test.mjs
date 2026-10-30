import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

// Regression checks for mismatched work choices and broken calculator handoffs.
async function openPage(file, query = '', storage = {}) {
  const html = readFileSync(file, 'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g, (tag, src) => {
    const path = src.split('?')[0].replace(/^\//, '');
    return existsSync(path) ? '<script>' + readFileSync(path, 'utf8').replace(/<\/script/gi, '<\\/script') + '</script>' : '';
  });
  const dom = new JSDOM(html, {
    url: 'https://niksremodeling.com/' + file + query,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.HTMLElement.prototype.scrollIntoView = function () {};
      window.scrollTo = () => {};
      window.alert = () => {};
      for(const [key,value] of Object.entries(storage))window.localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value));
    }
  });
  await new Promise(resolve => setTimeout(resolve, 100));
  return dom;
}

function workCard(document, key) {
  const card = document.querySelector('[data-work-key="' + key + '"]');
  assert.ok(card, 'Missing work section: ' + key);
  return [...card.querySelectorAll(':scope > label input')].map(input => input.value);
}

test('Cart preserves distinct cabinet tasks and shares the visit minimum with hourly work', async () => {
  const dom = await openPage('calculators.html');
  const w = dom.window;
  const estimates = w.eval('materialEstimates');
  estimates.length = 0;
  estimates.push({type:'custom',roomId:'kitchen-cabinets',roomName:'Kitchen',title:'Cabinet / Vanity Work',measurements:{},projectOptions:[],labor:[
    {service:'Install cabinet box',scope:'Cabinet / Vanity Work',quantity:1,unit:'boxes',price:150},
    {service:'Remove cabinet box and haul off',scope:'Cabinet / Vanity Work',quantity:1,unit:'boxes',price:75},
    {service:'Paint cabinet door and matching frame',scope:'Cabinet / Vanity Work',quantity:1,unit:'doors',price:150}
  ]});
  w.addProjectToCart();
  let cart = w.getCart();
  for (const task of estimates[0].labor) assert.ok(cart.some(item => item.name.includes(task.service)), task.service);
  assert.equal(w.serviceEstimateSummary(cart).total,375);
  assert.equal(w.serviceEstimateSummary([{type:'Labor',price:75,qty:1}]).total,150);
  assert.equal(w.serviceEstimateSummary([...cart,{type:'Labor',price:75,qty:1}]).total,450);
  w.addProjectToCart();
  assert.equal(w.getCart().length,3,'Saving the same room must not duplicate charges');
  dom.window.close();
});

test("Kids' Room is only a Themed Rooms subcategory", async () => {
  const themed = await openPage('project.html', '?project=themed-rooms');
  assert.ok(themed.window.document.querySelector('a[href="/project.html?project=kids-room"]'));
  themed.window.close();
  const home = await openPage('index.html');
  assert.equal(home.window.document.querySelector('#projects a[href="/project.html?project=kids-room"]'), null);
  home.window.close();
});

test('Bathroom vanity light can be selected independently of vanity cabinet', async () => {
  const dom = await openPage('project.html', '?project=bathrooms');
  const doc = dom.window.document;
  const light = workCard(doc, 'vanity-light');
  assert.ok(light.includes('Install bathroom vanity light on existing wiring'));
  assert.ok(light.includes('Replace existing bathroom vanity light'));
  assert.ok(!workCard(doc, 'vanity').some(name => /vanity light/i.test(name)));
  assert.ok(!workCard(doc, 'lighting').includes('Vanity Light'));
  dom.window.close();
});

test('Shower, backsplash, and flooring omit unrelated work and supplies', async () => {
  const bath = await openPage('project.html', '?project=bathrooms');
  const shower = workCard(bath.window.document, 'shower');
  assert.ok(shower.includes('Shower Base'));
  for (const name of ['Backsplash Tile', 'Bathtub', 'Underlayment', 'Grout & Setting Materials', 'Backer Board']) {
    assert.ok(!shower.includes(name), 'Shower should not display ' + name);
  }
  bath.window.close();

  const kitchen = await openPage('project.html', '?project=kitchen-pantry');
  const backsplash = workCard(kitchen.window.document, 'backsplash');
  assert.ok(backsplash.includes('Mosaic Tile'));
  for (const name of ['Shower Base', 'Shower Valve / Head', 'Waterproofing Membrane', 'Underlayment']) {
    assert.ok(!backsplash.includes(name), 'Backsplash should not display ' + name);
  }
  const floor = workCard(kitchen.window.document, 'floor');
  assert.ok(!floor.includes('Backer Board') && !floor.includes('Underlayment'));
  kitchen.window.close();
});

test('Fixture questions match the actual selected item', async () => {
  const dom = await openPage('calculators.html');
  const options = dom.window.eval('itemOptionFields');
  assert.ok(options('Install bathroom vanity light on existing wiring').some(item => item.label === 'Fixture style'));
  assert.ok(!options('Install bathroom vanity light on existing wiring').some(item => item.label === 'Size' || item.label === 'Top'));
  assert.ok(!options('Outdoor Sound System').some(item => item.label === 'Door type'));
  assert.ok(!options('Mobile / Portable Theater').some(item => item.label === 'Assembly'));
  assert.ok(!options('Raised Garden Beds').some(item => item.label === 'Assembly'));
  assert.ok(options('Interior Door').some(item => item.label === 'Door type'));
  assert.ok(options('Wall Sconce').some(item => item.label === 'Mounting'));
  dom.window.close();
});

test('Projects dropdown selections open only the requested work options without a second selection', async () => {
  for (const [selection,expected] of [
    ['ceiling',['ceiling']],
    ['ceiling,floor,walls',['ceiling','floor','walls']]
  ]) {
    const dom=await openPage('project.html','?project=attic&selectedWorks='+selection);
    try {
      const doc=dom.window.document;
      const all=[...doc.querySelectorAll('#project-work-grid .project-work-card')];
      assert.ok(all.length>=8,'Attic must retain the full work catalog');
      const visible=all.filter(card=>!card.hidden);
      assert.deepEqual(visible.map(card=>card.dataset.workKey).sort(),expected.slice().sort());
      assert.ok(visible.every(card=>card.open),'The selected jobs should show their options immediately');
      assert.ok(visible.every(card=>card.querySelectorAll(':scope > label input[type="checkbox"]').length>0),'Each selected job must show its own material options');
      assert.equal(doc.querySelector('[aria-label="Choose multiple jobs"]'),null,'Do not ask for the same selected jobs again');
      assert.equal(doc.querySelectorAll('#project-work-grid .project-work-card:not([hidden])').length,expected.length);
      assert.match(doc.querySelector('.project-section-title')?.textContent||'',/options/i);
    }finally{dom.window.close();}
  }
});

test('Ceiling shows complete work options without material prices and keeps mixed choices together', async () => {
 for(const project of ['attic','bathrooms','bedroom-guest-room']){
  const dom=await openPage('project.html','?project='+project+'&selectedWorks=ceiling');
  try{
   const w=dom.window,doc=w.document,card=doc.querySelector('[data-work-key="ceiling"]');
   assert.ok(card&&!card.hidden,project+' must show Ceiling work');
   const choices=workCard(doc,'ceiling');
   for(const task of ['Paint ceiling','Prime ceiling','Add ceiling texture (orange peel / knockdown)',
    'Remove popcorn ceiling texture','Repair / patch ceiling drywall',
    'Install ceiling drywall','Install recessed ceiling lights',
    'Install / replace ceiling light','Install / replace ceiling fan',
    'Add / replace ceiling insulation','Install / repair attic access hatch or ladder']){
    assert.ok(choices.includes(task),project+' missing '+task);
   }
   assert.ok(choices.length>=20,'Ceiling needs comprehensive work choices');
   assert.equal(new Set(choices).size,choices.length,'Do not repeat Ceiling tasks');
   assert.equal(card.querySelectorAll('.ceiling-work-heading').length,4,'Group ceiling work to keep the list readable');
   assert.doesNotMatch(card.textContent,/\$50\s*\/\s*gallon|supplies included/i,'Do not sell materials in the work picker');
   const chosen=['Paint ceiling','Add ceiling texture (orange peel / knockdown)','Install recessed ceiling lights'];
   for(const name of chosen){
    const box=[...card.querySelectorAll(':scope > label input[type="checkbox"]')].find(input=>input.value===name);
    assert.ok(box,project+' missing '+name);box.checked=true;
   }
   let target='';
   w.openProjectMeasurements=url=>{target=url};
   card.querySelector('.btn.primary').click();
   assert.ok(target,'Selected ceiling work must proceed to project calculator');
   const params=new URL(target,w.location.origin).searchParams;
   assert.equal(params.get('project'),project);
   assert.equal(params.get('work'),'ceiling');
   assert.equal(params.get('material'),'custom','Mixed ceiling tasks must not use paint-only calculation');
   assert.deepEqual(params.get('materials').split('|'),chosen);
  }finally{dom.window.close();}
 }
});

test('Projects > Attic > Paint ceiling estimates the whole job without asking for paint again', async () => {
 const project=await openPage('project.html','?project=attic&selectedWorks=ceiling');
 let target;
 try{
  const doc=project.window.document,card=doc.querySelector('[data-work-key="ceiling"]');
  const paint=[...card.querySelectorAll(':scope > label input')].find(box=>box.value==='Paint ceiling');
  paint.checked=true;
  project.window.openProjectMeasurements=url=>{target=url};
  card.querySelector('.btn.primary').click();
  assert.ok(target,'Ceiling Paint selection should launch the calculator');
  const params=new URL(target,project.window.location.origin).searchParams;
  assert.equal(params.get('material'),'paint','Paint ceiling must use measured paint rather than generic custom work');
  assert.equal(params.get('materials'),'Interior Paint','Paint should be selected automatically');
  assert.equal(params.get('projectMode'),'complete','Projects must be whole-job requests');
  assert.equal(params.get('projectTasks'),'Paint ceiling');
 }finally{project.window.close()}
 const calc=await openPage('calculators.html',target.slice(target.indexOf('?')));
 try{
  const w=calc.window,doc=w.document;
  assert.equal(doc.getElementById('material-type').value,'paint');
  assert.equal(doc.getElementById('paint-surface-ceiling').checked,true);
  assert.equal(doc.querySelector('[name="labor-service"][value="Installation"]').checked,true);
  assert.equal(doc.querySelector('[name="project-option"][value="Materials"]').checked,true);
  const rows=[...doc.querySelectorAll('[name="area-product"]:checked')].map(input=>input.value);
  assert.deepEqual(rows,['Interior Paint'],'Do not ask for the same material again');
  doc.getElementById('ceiling-job-length').value='12';
  doc.getElementById('ceiling-job-width').value='10';
  const condition=doc.getElementById('question-condition');if(condition)condition.value='good';
  // A paint finish is optional to decide now, but the calculator requires a
  // choice or "Help me choose" before estimating a material purchase.
  for(const select of doc.querySelectorAll('.area-product [data-item-option]')){
    if(select.tagName==='SELECT'&&!select.value){
      const answer=[...select.options].find(option=>option.value==='Help me choose')||[...select.options].find(option=>option.value);
      if(answer)select.value=answer.value;
    }
  }
  w.calcMaterial();
  const error=doc.getElementById('mat-error');
  assert.ok(error.hidden,'Ceiling paint calculator failed: '+error.textContent);
  const estimates=w.eval('materialEstimates');
  const item=estimates[estimates.length-1];
  assert.equal(item.measurements.area,120);
  assert.equal(item.products.find(p=>p.name==='Paint').price,50,'Paint price and standard supplies must appear only in estimate');
  assert.equal(item.labor.find(l=>l.service==='Installation').price,216,'Two-coat ceiling painting uses the approved $1.80/sq.ft. labor rate');
  assert.equal(item.supplyChoices.length,0,'Paint includes standard supplies; do not charge again');
  w.addProjectToCart();
  const cart=w.getCart();
  assert.equal(cart.filter(x=>x.type==='Material estimate').length,1);
  assert.equal(cart.filter(x=>x.type==='Labor').length,1);
  assert.equal(cart.filter(x=>x.type==='Included project costs').length,0);
  assert.equal(cart.reduce((sum,item)=>sum+(Number(item.price)||0),0),266,'Complete ceiling project is paint, supplies once, and labor');
 }finally{calc.window.close()}
});

test('Multiple selected ceiling jobs stay together and never invent a complete price', async () => {
 const project=await openPage('project.html','?project=attic&selectedWorks=ceiling');
 let url='';
 const tasks=['Paint ceiling','Add ceiling texture (orange peel / knockdown)','Install recessed ceiling lights'];
 try{
  const w=project.window,card=w.document.querySelector('[data-work-key="ceiling"]');
  for(const task of tasks){
   const box=[...card.querySelectorAll(':scope > label input')].find(input=>input.value===task);
   assert.ok(box,'Missing ceiling task '+task);box.checked=true;
  }
  w.openProjectMeasurements=target=>url=target;
  card.querySelector('.btn.primary').click();
  assert.ok(url);
  const p=new URL(url,w.location.origin).searchParams;
  assert.deepEqual(p.get('materials').split('|'),tasks);
  assert.equal(p.get('projectMode'),'complete');
  assert.equal(p.get('material'),'custom','Mixed work cannot be represented as paint materials alone');
 }finally{project.window.close()}
 const calc=await openPage('calculators.html',url.slice(url.indexOf('?')));
 try {
  const w=calc.window,doc=w.document;
  const rows=[...doc.querySelectorAll('.area-product')];
  const selected=rows.filter(row=>row.querySelector('[name="area-product"]')?.checked);
  assert.deepEqual(selected.map(row=>row.querySelector('[name="area-product"]').value),tasks);
  for(const row of selected){
   for(const select of row.querySelectorAll('[data-item-option]')){
    if(select.tagName==='SELECT'&&!select.value){
      const chosen=[...select.options].find(opt=>opt.value==='Help me choose')||[...select.options].find(opt=>opt.value);
      if(chosen)select.value=chosen.value;
    }
   }
  }
  assert.equal(doc.querySelector('[name="project-option"][value="Materials"]').checked,true);
  assert.equal(doc.querySelector('[name="labor-service"][value="Installation"]').checked,true);
  w.calcMaterial();
  assert.ok(doc.getElementById('mat-error').hidden,doc.getElementById('mat-error').textContent);
  const estimate=w.eval('materialEstimates.at(-1)');
  assert.deepEqual(Array.from(estimate.products,p=>p.name),tasks,'All selected tasks need to reach the estimate');
  assert.ok(estimate.products.every(p=>!Number.isFinite(p.price)),'Do not invent fixture and texture retail prices');
  w.addProjectToCart();
  const cart=w.getCart();
  for(const task of tasks)assert.ok(cart.some(item=>item.name.includes(task)),task+' missing from cart');
  assert.ok(cart.some(item=>item.type==='Material estimate'&&!Number.isFinite(item.price)),'Unpriced work must remain a quote request');
 }finally{calc.window.close()}
});

test('Custom work choices transfer to the calculator and cart', async () => {
  const specs = [
    {project: 'kids-room', work: 'lighting', room: 'Kids Room', material: 'custom', location: 'interior', materials: 'Wall Sconce'},
    {project: 'outdoor-sound', work: 'outdoor-media', room: 'Patio', material: 'custom', location: 'exterior', materials: 'Outdoor Sound System'},
    {project: 'bathrooms', work: 'vanity-light', room: 'Bathroom', material: 'bathroom', location: 'interior', materials: 'Install bathroom vanity light on existing wiring'}
  ];
  for (const entry of specs) {
    const query = '?' + new URLSearchParams({...entry, embedded: '1'});
    const dom = await openPage('calculators.html', query);
    const {window} = dom;
    const doc = window.document;
    assert.equal(doc.getElementById('material-type').value, entry.material, 'Material kind not retained for ' + entry.work);
    const box = [...doc.querySelectorAll('[name="area-product"]')].find(input => input.value === entry.materials);
    assert.ok(box && box.checked, 'Selected work not retained: ' + entry.materials);
    for (const select of box.closest('.area-product').querySelectorAll('[data-item-option]')) {
      if (select.tagName === 'SELECT' && !select.value) {
        const choice = [...select.options].find(option => option.value === 'Help me choose') || [...select.options].find(option => option.value);
        if (choice) select.value = choice.value;
      }
    }
    window.calcMaterial();
    const err = doc.getElementById('mat-error');
    assert.ok(err.hidden, 'Failed to calculate ' + entry.work + ': ' + err.textContent);
    assert.ok(window.eval('materialEstimates.length') > 0);
    window.addProjectToCart();
    assert.ok(window.eval('getCart()').some(item => item.room === entry.room || item.name.includes(entry.room)), 'No cart item for ' + entry.work);
    dom.window.close();
  }
});

test('Installation supplies are charged once with labor and never added to materials-only orders', async () => {
  const dom = await openPage('calculators.html');
  const w = dom.window;
  const estimates = w.eval('materialEstimates');
  const item = {type:'flooring',roomId:'supply-policy',roomName:'Bedroom',title:'Flooring',measurements:{},products:[{name:'Laminate',quantity:100,unit:'sq. ft.',price:200}],supplyChoices:[{name:'Underlayment',quantity:1,unit:'roll',price:25}],projectOptions:['Materials'],labor:[]};
  estimates.splice(0,estimates.length,item);
  w.addProjectToCart();
  assert.equal(w.getCart().length,1);
  assert.equal(w.getCart()[0].price,200);
  item.labor=[{service:'Installation',scope:'Flooring',quantity:100,unit:'sq. ft.',price:300}];
  for (const materials of [true,false]) {
    item.projectOptions=materials?['Materials']:[];
    w.addProjectToCart();
    w.addProjectToCart();
    const cart=w.getCart();
    assert.equal(cart.filter(x=>x.type==='Included project costs').length,1);
    assert.equal(cart.find(x=>x.type==='Included project costs').price,25);
    assert.equal(cart.filter(x=>x.type==='Material estimate').length,materials?1:0);
    w.renderMaterialEstimates();
    assert.match(w.document.querySelector('.project-total-note').textContent,/Estimated total for selected work/);
  }
  item.labor=[{service:'Removal',quantity:100,unit:'sq. ft.',price:150}];
  w.addProjectToCart();
  assert.equal(w.getCart().filter(x=>x.type==='Included project costs').length,0);
  dom.window.close();
});

test('Ceiling dimensions calculate sheets and gallons; customer materials preserves labor',async()=>{
 const tasks=['Install ceiling drywall','Finish ceiling drywall (tape / mud / sand)','Prime ceiling','Paint ceiling'];
 const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',materials:tasks.join('|'),projectTasks:tasks.join('|'),embedded:'1',projectMode:'complete'});
 const dom=await openPage('calculators.html',query);
 for(let attempt=0;attempt<20&&!dom.window.document.getElementById('customer-provides-materials');attempt++)await new Promise(resolve=>setTimeout(resolve,50));
 try{
  const w=dom.window,doc=w.document;
  doc.getElementById('ceiling-job-length').value='12';doc.getElementById('ceiling-job-width').value='12';
  assert.equal(doc.getElementById('material-products').closest('[hidden]')!==null,true);
  w.calcMaterial();assert.ok(doc.getElementById('mat-error').hidden,doc.getElementById('mat-error').textContent);
  let item=w.eval('materialEstimates')[0];
  assert.equal(item.products.find(x=>x.name==='Drywall').quantity,6);
  for(const name of ['Primer','Paint']){assert.equal(item.products.find(x=>x.name===name).quantity,1);assert.equal(item.products.find(x=>x.name===name).unit,'gallons');}
  assert.equal(item.labor.length,4);const laborTotal=item.labor.reduce((n,x)=>n+x.price,0);
  doc.getElementById('customer-provides-materials').checked=true;w.calcMaterial();
  item=w.eval('materialEstimates')[0];assert.equal(w.eval('materialEstimates.length'),1);
  assert.equal(item.projectOptions.includes('Materials'),false);assert.equal(item.labor.reduce((n,x)=>n+x.price,0),laborTotal);
  w.addProjectToCart();assert.equal(w.getCart().filter(x=>x.type==='Material estimate').length,0);assert.equal(w.getCart().filter(x=>x.type==='Labor').length,4);
 }finally{dom.window.close();}
});

test('Calculator keeps installation supplies pricing out of customer-facing text', async () => {
  const dom = await openPage('calculators.html');
  const {document} = dom.window;
  assert.doesNotMatch(document.querySelector('.labor-choices').textContent, /supplies included/i);
  const source = readFileSync('project-calculator-options.js', 'utf8');
  assert.doesNotMatch(source, /needed supplies included|installation supplies included|supplies included with labor|supplies included\./i);
  dom.window.close();
});

test('Known ceiling drywall and primer labor never forces an in-person quote for unpriced materials', async () => {
 for (const [task,expected,product] of [
  ['Install ceiling drywall',450,'Drywall'],
  ['Prime ceiling',129.6,'Primer']
 ]) {
  const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',projectTasks:task,materials:task,embedded:'1',projectMode:'complete'});
  const dom=await openPage('calculators.html',query);
  for(let attempt=0;attempt<20&&!dom.window.document.getElementById('customer-provides-materials');attempt++)await new Promise(resolve=>setTimeout(resolve,50));
  try {
   const w=dom.window,d=dom.window.document;
   d.getElementById('ceiling-job-length').value='12';
   d.getElementById('ceiling-job-width').value='12';
   w.calcMaterial();
   assert.ok(d.getElementById('mat-error').hidden,task+': '+d.getElementById('mat-error').textContent);
   const item=w.eval('materialEstimates[0]');
   assert.equal(item.labor[0].price,expected,task+' should use its ceiling labor rate');
   assert.ok(item.products.some(x=>x.name===product));
   assert.match(d.querySelector('.project-total-note').textContent,/Material price to be confirmed/);
   assert.doesNotMatch(d.querySelector('.project-total-note').textContent,/In-person quote required/);
   assert.doesNotMatch(d.getElementById('add-project-to-cart').textContent,/Quote Required/);
   d.getElementById('customer-provides-materials').checked=true;
   w.calcMaterial();
   assert.equal(w.eval('materialEstimates.length'),1);
   assert.equal(w.eval('materialEstimates[0].labor[0].price'),expected);
   assert.equal(d.querySelector('.project-total-note').textContent,'Estimated total for selected work.');
   w.addProjectToCart();
   const cart=w.getCart();
   assert.equal(cart.filter(x=>x.type==='Material estimate').length,0);
   assert.equal(cart.filter(x=>x.type==='Labor').length,1);
   assert.ok(cart.filter(x=>x.type==='Labor')[0].price>0);
  }finally{dom.window.close();}
 }
});

test('Ceiling installation is labeled separately from drywall repair throughout every project and calculator',async()=>{
  for(const project of ['attic','bathrooms','bedroom-guest-room']){
    const dom=await openPage('project.html','?project='+project+'&selectedWorks=ceiling');
    try{
      const options=workCard(dom.window.document,'ceiling');
      assert.ok(options.includes('Install ceiling drywall'),project+' missing installation');
      assert.ok(options.includes('Repair / patch ceiling drywall'),project+' missing repair');
      assert.ok(!options.includes('Install / replace ceiling drywall'),project+' must not combine installation and repair');
    }finally{dom.window.close();}
  }
  const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',projectTasks:'Install ceiling drywall',materials:'Install ceiling drywall',embedded:'1',projectMode:'complete'});
  const dom=await openPage('calculators.html',query);
  try{
    const w=dom.window,d=w.document;
    d.getElementById('ceiling-job-length').value='12';
    d.getElementById('ceiling-job-width').value='12';
    w.calcMaterial();
    assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
    const item=w.eval('materialEstimates.at(-1)');
    assert.equal(item.labor.length,1);
    assert.equal(item.labor[0].scope,'Install ceiling drywall');
    assert.equal(item.labor[0].price,450,'Installation remains $90 per estimated 4x8 ceiling sheet');
    assert.ok(!item.labor[0].scope.includes('replace'));
    assert.equal(item.products.find(x=>x.name==='Drywall').quantity,6);
  }finally{dom.window.close();}
});

test('Prior ceiling drywall installation links retain their installation rate and new label',async()=>{
  const oldTask='Install / replace ceiling drywall';
  const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',projectTasks:oldTask,materials:oldTask,embedded:'1',projectMode:'complete'});
  const dom=await openPage('calculators.html',query);
  try{
    const w=dom.window,d=w.document;
    d.getElementById('ceiling-job-length').value='12';
    d.getElementById('ceiling-job-width').value='12';
    w.calcMaterial();
    assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
    assert.equal(w.eval('materialEstimates.at(-1).labor[0].scope'),'Install ceiling drywall');
    assert.equal(w.eval('materialEstimates.at(-1).labor[0].price'),450);
  }finally{dom.window.close();}
});

test('Attic ceiling drywall patch uses approved small, medium and large repair labor instead of requiring a new quote',async()=>{
 const task='Repair / patch ceiling drywall';
 const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',location:'interior',materials:task,projectTasks:task,embedded:'1',projectMode:'complete'});
 const dom=await openPage('calculators.html',query);
 for(let i=0;i<20&&!dom.window.document.getElementById('customer-provides-materials');i++)await new Promise(resolve=>setTimeout(resolve,50));
 try {
  const d=dom.window.document,w=dom.window;
  assert.equal(d.querySelector('#ceiling-job-length').closest('.calc-fields').hidden,true,'Patch only should not ask for full room size');
  for(const [size,rate] of [['small',210],['medium',330],['large',540]]){
   d.getElementById('ceiling-patch-size').value=size;
   w.calcMaterial();assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
   const item=w.eval('materialEstimates.at(-1)');
   assert.equal(item.labor[0].price,rate,size+' ceiling repair labor mismatch');
   assert.doesNotMatch(d.querySelector('.project-total-note').textContent,/In-person quote required/);
  }
  d.getElementById('customer-provides-materials').checked=true;
  w.calcMaterial();
  assert.equal(d.querySelector('.project-total-note').textContent,'Estimated total for selected work.');
 }finally{dom.window.close();}
});

test('Miscellaneous and prep labor calculate at the approved $75 hourly rate without an unnecessary visit quote',async()=>{
 for(const [type,hours,price] of [['misc',3,225],['prep',2,150]]){
  const query='?'+new URLSearchParams({room:'Garage',material:type,location:'interior'});
  const dom=await openPage('calculators.html',query);
  for(let i=0;i<20&&!dom.window.document.getElementById('customer-provides-materials');i++)await new Promise(resolve=>setTimeout(resolve,50));
  try{
   const w=dom.window,d=w.document;
   assert.equal(d.getElementById('material-type').value,type);
   assert.equal(d.getElementById('misc-hours').disabled,false);
   d.getElementById('misc-hours').value=hours;
   w.calcMaterial();
   assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
   const item=w.eval('materialEstimates.at(-1)');
   assert.equal(item.labor[0].price,price);
   assert.doesNotMatch(d.body.textContent,/Miscellaneous work requires an in-person visit before pricing/);
   w.addProjectToCart();
   assert.equal(w.getCart().find(x=>x.type==='Labor')?.price,price);
  }finally{dom.window.close();}
 }
});

test('ceiling texture matching is a patch-size quote, distinct from whole-ceiling application',async()=>{
 for(const project of ['attic','bathrooms','bedroom-guest-room']){
  const d=await openPage('project.html','?project='+project+'&selectedWorks=ceiling');
  try{
   const choices=workCard(d.window.document,'ceiling');
   assert.ok(choices.includes('Match existing ceiling texture (patch)'));
   assert.ok(choices.includes('Add ceiling texture (orange peel / knockdown)'));
  }finally{d.window.close();}
 }
 for(const [size,expected]of [['small',180],['medium',270],['large',420]]){
  const task='Match existing ceiling texture (patch)';
  const query='?'+new URLSearchParams({project:'attic',work:'ceiling',room:'Attic',material:'custom',projectTasks:task,materials:task,embedded:'1',projectMode:'complete'});
  const dom=await openPage('calculators.html',query);
  for(let i=0;i<20&&!dom.window.document.getElementById('customer-provides-materials');i++)await new Promise(resolve=>setTimeout(resolve,50));
  try{
   const w=dom.window,d=w.document;
   assert.equal(d.querySelector('#ceiling-job-length').closest('.calc-fields').hidden,true,'Patch only should not request whole-ceiling dimensions');
   d.getElementById('ceiling-patch-size').value=size;
   w.calcMaterial();assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
   const item=w.eval('materialEstimates.at(-1)');assert.equal(item.labor.length,1);assert.equal(item.labor[0].price,expected);assert.equal(item.products[0].name,'Texture matching materials');
   assert.match(d.querySelector('.project-total-note').textContent,/Material price to be confirmed/);
   d.getElementById('customer-provides-materials').checked=true;w.calcMaterial();
   assert.equal(d.querySelector('.project-total-note').textContent,'Estimated total for selected work.');
   w.addProjectToCart();assert.equal(w.getCart().filter(x=>x.type==='Labor').length,1);
  }finally{dom.window.close();}
 }
 const source=readFileSync('project-calculator-options.js','utf8');
 assert.doesNotMatch(source,/['"]Add ceiling texture \(orange peel \/ knockdown\)['"]\s*:\s*(?:180|270|420)/,'Full-ceiling texturing must not be priced like patch matching');
});

test('fresh basement ceiling texture work does not reload old estimates after clearing cart',async()=>{
 const task='Match existing ceiling texture (patch)';
 const stale=[
  {roomId:'room-old-ceiling',roomName:'Old Attic',projectScopeKey:'attic|old attic|ceiling',type:'ceiling',title:'Ceiling work',result:'old paint',measurements:{area:250},labor:[{service:'Installation',scope:'Paint ceiling',price:450,quantity:1}]},
  {roomId:'room-old-floor',roomName:'Old Bedroom',type:'flooring',title:'Flooring',result:'old flooring',measurements:{area:144},labor:[{service:'Installation',scope:'LVP',price:575,quantity:1}]}
 ];
 const oldState={'niks-material-estimates-v1':stale,'nr-cart':[]};
 const project=await openPage('project.html','?project=basement&selectedWorks=ceiling',oldState);
 let target='';
 try{
  const card=project.window.document.querySelector('[data-work-key="ceiling"]');
  const checkbox=[...card.querySelectorAll(':scope > label input')].find(x=>x.value===task);
  assert.ok(checkbox);checkbox.checked=true;
  project.window.openProjectMeasurements=url=>target=url;
  card.querySelector('button.btn.primary').click();
  assert.ok(target,'Basement ceiling should open the calculator');
  const params=new URL(target,project.window.location.origin).searchParams;
  assert.ok(params.get('projectStart'),'New project must carry a fresh-session marker');
  assert.equal(params.get('editRoom'),null,'Old work must not be reopened automatically');
 }finally{project.window.close();}
 const quote=await openPage('calculators.html',target.slice(target.indexOf('?')),oldState);
 try{
  const w=quote.window,d=w.document;
  assert.equal(w.eval('materialEstimates.length'),0,'Fresh project must begin with no stale estimates');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('niks-material-estimates-v1')||'[]'),[]);
  assert.equal(w.getCart().length,0);
  d.getElementById('ceiling-patch-size').value='small';
  w.calcMaterial();
  assert.ok(d.getElementById('mat-error').hidden,d.getElementById('mat-error').textContent);
  assert.equal(w.eval('materialEstimates.length'),1,'Only the current texture work is estimated');
  assert.equal(w.eval('materialEstimates[0].labor[0].price'),180);
  w.addProjectToCart();
  const cart=w.getCart();
  assert.equal(cart.filter(x=>x.type==='Labor').length,1);
  assert.equal(w.serviceEstimateSummary(cart).total,180);
  assert.ok(cart.every(x=>!x.name.includes('Old Attic')&&!x.name.includes('Old Bedroom')));
  assert.ok(cart.length<=3,'Single patch must not create nine old items');
 }finally{quote.window.close();}
});

test('removing the final cart item removes stale calculator drafts too',async()=>{
 const state={
  'nr-cart':[{name:'Old Room: Paint ceiling',type:'Labor',source:'project-calculator',roomId:'previous-draft',qty:1,price:450}],
  'niks-material-estimates-v1':[{roomId:'previous-draft',roomName:'Old Room',type:'ceiling',title:'Ceiling work',result:'old ceiling',labor:[{service:'Installation',scope:'Paint ceiling',price:450}]}]
 };
 const dom=await openPage('project-cart.html','',state);
 try{
  const w=dom.window;
  assert.equal(w.getCart().length,1);
  w.removeCart(0);
  assert.equal(w.getCart().length,0);
  assert.ok(!JSON.parse(w.localStorage.getItem('niks-material-estimates-v1')||'[]').length,'Removed items may not return');
  assert.match(w.document.body.textContent,/Your project cart is empty/);
 }finally{dom.window.close();}
});
