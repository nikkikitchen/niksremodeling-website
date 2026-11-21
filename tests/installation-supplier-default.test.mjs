import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function openInstallation(){
 const html=readFileSync('installation.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');
  return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/installation.html',runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 }});
 await new Promise(resolve=>setTimeout(resolve,100));
 return dom;
}

test('Nik supplies products by default across installation categories, without inventing a final material price',async()=>{
 const dom=await openInstallation();
 try{
  const {window:w}=dom,d=w.document;
  const checks=[
   ['doors','door-hinge-existing'],
   ['cabinets','cabinet-end-panel'],
   ['electrical','ceiling-existing-light'],
   ['carpentry','baseboard-complete'],
   ['paint','paint-accent']
  ];
  for(const [category,id] of checks){
   const task=d.getElementById('labor-task-'+id);
   assert.ok(task,category+' task present');
   const toggle=task.querySelector('.labor-customer-materials');
   assert.ok(toggle,category+' has customer-supplied option');
   assert.equal(toggle.checked,false,category+' defaults to Nik supplying');
   const button=task.querySelector('button');
   button.click();
   const line=w.getCart().find(item=>item.taskId===id);
   assert.ok(line,category+' cart entry');
   assert.equal(line.materialsProvider,'niks');
   assert.equal(line.materialsPricingPending,true);
   assert.equal(line.quoteRequired,true);
   assert.equal(line.price,w.LABOR_CATALOG.flatMap(c=>c.groups).flatMap(g=>Object.values(g.actions).flat()).find(t=>t.id===id).price);
  }
  assert.equal(w.serviceEstimateSummary(w.getCart()).pending,true,'materials quote is not misrepresented as a complete price');
  w.renderCart();
  assert.match(w.document.body.textContent,/Installed price not final/);
  assert.match(w.document.body.textContent,/priced labor portion/);
  assert.match(w.document.body.textContent,/no payment is due/i);
 }finally{dom.window.close();}
});

test('toilet tank and flange repair default to Nik supplied parts without pretending an unverified parts cost is complete',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window;
  for(const [id,labor] of [['toilet-tank-repair',125],['toilet-flange',250]]){
   const p=w.BATHROOM_PACKAGES.find(x=>x.id===id);
   assert.ok(p,id+' exists');
   assert.equal(p.labor,labor,'approved labor unchanged');
   assert.equal(p.materialsPricingPending,true,'Nik-provided parts require landed cost verification');
   const category=w.LABOR_CATALOG.find(x=>x.id==='bathroom');
   const item=category.groups.flatMap(group=>Object.values(group.actions).flat()).find(x=>x.id===id);
   assert.match(item.priceText,/Final installed price pending verified replacement parts/);
   assert.doesNotMatch(item.note,/Labor only|parts not included/i);
  }
  const calculator=readFileSync('project-calculator-options.js','utf8');
  assert.match(calculator,/p\.materialsPricingPending\s*&&\s*!own/,'Nik-supplied missing parts must remain an unpriced quote');
 }finally{dom.window.close();}
});

test('customer-supplied products preserve approved labor rates and remove material quote pending flag',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const task=d.getElementById('labor-task-door-hinge-existing');
  const toggle=task.querySelector('.labor-customer-materials');
  assert.match(task.querySelector('.labor-line-price').textContent,/full installed price pending/i);
  toggle.checked=true;
  toggle.dispatchEvent(new w.Event('change'));
  assert.match(task.querySelector('.labor-line-price').textContent,/Customer-supplied products\/materials · labor price only/);
  assert.doesNotMatch(task.querySelector('.labor-line-price').textContent,/full installed price pending/i);
  toggle.checked=false;
  toggle.dispatchEvent(new w.Event('change'));
  assert.match(task.querySelector('.labor-line-price').textContent,/full installed price pending/i);
  toggle.checked=true;
  toggle.dispatchEvent(new w.Event('change'));
  task.querySelector('button').click();
  const item=w.getCart()[0];
  assert.equal(item.price,15);
  assert.equal(item.materialsProvider,'customer');
  assert.equal(item.customerProvidesMaterials,true);
  assert.equal(item.materialsPricingPending,undefined);
  assert.equal(item.quoteRequired,undefined);
  const remove=d.getElementById('labor-task-door-remove');
  if(remove)assert.equal(remove.querySelector('.labor-customer-materials'),null,'removal/haul-off needs no additional product choice');
 }finally{dom.window.close();}
});

test('vent cleaning remains a labor-only service without an invented product quote',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const service=w.LABOR_CATALOG.flatMap(c=>c.groups).flatMap(g=>Object.values(g.actions).flat()).find(t=>t.label==='Dryer vent cleaning');
  assert.ok(service,'dryer vent cleaning must remain available');
  assert.equal(service.status,'approved');
  assert.equal(service.price,150);
  const row=d.getElementById('labor-task-'+service.id);
  assert.ok(row);
  assert.equal(row.querySelector('.labor-customer-materials'),null,'cleaning does not require a customer-supplied product switch');
  row.querySelector('button').click();
  const line=w.getCart().find(x=>x.taskId===service.id);
  assert.ok(line);
  assert.equal(line.price,150,'approved service charge unchanged');
  assert.equal(line.materialsPricingPending,undefined,'cleaning requires no external material quote');
  assert.equal(line.quoteRequired,undefined);
  assert.doesNotMatch(d.getElementById('labor-review-total').textContent,/installed quote pending/i);
 }finally{dom.window.close();}
});

test('installation summary calls out incomplete installed quote when Nik supplies goods',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const row=d.getElementById('labor-task-cabinet-end-panel');
  assert.ok(row);
  row.querySelector('button').click();
  assert.equal(w.getCart().find(x=>x.taskId==='cabinet-end-panel').materialsPricingPending,true);
  assert.match(d.getElementById('labor-review-total').textContent,/installed quote pending/i);
 }finally{dom.window.close();}
});

test('vanity with faucet allowance includes a reviewed 35 percent markup planning budget, not a guaranteed SKU',()=>{
 const app=readFileSync('app.js','utf8');
 assert.match(app,/'vanity-install':\{fixture:249/);
 assert.match(app,/this is not a confirmed product price/i);
 assert.match(app,/Preliminary \$249 fixture allowance/,'fixture allowance must be clearly labeled preliminary');
 assert.match(app,/freight, applicable tax/,'freight and tax must not be implied included');
});


test('installation cards distinguish unchanged labor component from unverified installed price',async()=>{
 const dom=await openInstallation();
 try{
  const d=dom.window.document;
  for(const id of ['cabinet-box-install','door-hinge-existing','paint-accent']){
   const row=d.getElementById('labor-task-'+id);
   assert.ok(row,'approved task '+id+' exists');
   assert.ok(row.querySelector('.labor-customer-materials'),'Nik supplies materials for '+id);
   assert.match(row.querySelector('.labor-line-price').textContent,/Labor portion only.*full installed price pending/);
   assert.doesNotMatch(row.querySelector('.labor-line-copy').textContent,/Labor only/i,'no contradictory labor-only copy');
  }
 }finally{dom.window.close();}
});


test('approved kitchen backsplash labor and in-person countertop quotes stay consistent',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const kitchen=w.LABOR_CATALOG.find(c=>c.id==='kitchen');
  assert.ok(kitchen,'Kitchen labor section exists');
  const tasks=kitchen.groups.flatMap(g=>Object.values(g.actions).flat());
  const backsplash=tasks.find(t=>t.id==='kitchen-install-backsplash');
  assert.ok(backsplash,'Backsplash labor exists');
  assert.equal(backsplash.label,'Tile backsplash installation');
  assert.equal(backsplash.price,350,'October 24 approved labor starting rate');
  assert.equal(backsplash.status,'approved');
  assert.equal(backsplash.startingAt,true,'$350 is a starting labor rate, not a fixed installed total');
  const row=d.getElementById('labor-task-'+backsplash.id);
  assert.ok(row);
  assert.ok(row.querySelector('.labor-line-price').textContent.includes('Starting at $350'));
  assert.equal(row.querySelector('.labor-customer-materials').checked,false,'Nik supplies materials by default');
  row.querySelector('button').click();
  const cart=w.getCart().find(item=>item.taskId===backsplash.id);
  assert.ok(cart);
  assert.equal(cart.price,350,'Labor starting price remains unchanged');
  assert.equal(cart.materialsPricingPending,true,'No unverified tile or shipping price becomes final');
  assert.equal(cart.quoteRequired,true);
  for(const id of ['kitchen-install-laminate-countertop','kitchen-install-butcher-block-countertop','kitchen-install-granite-countertop','kitchen-install-quartz-countertop']){
   const task=tasks.find(t=>t.id===id);
   assert.ok(task,id+' exists');
   assert.equal(task.price,null,id+' has no invented flat labor rate');
   assert.equal(task.status,'pending',id+' requires in-person estimate');
   assert.match(task.note,/in-person assessment/i);
   const line=d.getElementById('labor-task-'+id);
   assert.ok(line,id+' is visible');
   assert.match(line.querySelector('.labor-line-price').textContent,/In-person quote required/);
  }
 }finally{dom.window.close();}
});

test('all approved physical installation and finishing services need a verified goods path',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const physicalWork=/\b(?:install(?:ation)?|replac(?:e|ement)|repair|paint(?:ing)?|stain(?:ing)?|finish(?:ing)?|prim(?:e|ing)|patch|seal|caulk|grout|texture|resurface|insulat(?:e|ion)|wiring|supply line|hookup|hardware|mount(?:ing)?|refinish(?:ing)?|recaulk(?:ing)?|regrout(?:ing)?|waterproof(?:ing)?|coat(?:ing)?|glue|adhesive|tile|hang(?:ing)?|plumb(?:ing)?|polish(?:ing)?)\b/i;
  let checked=0;
  for(const category of w.LABOR_CATALOG){
   for(const group of category.groups){
    for(const tasks of Object.values(group.actions)){
     for(const task of tasks){
      if(task.status!=='approved'||!physicalWork.test(task.label))continue;
      const row=d.getElementById('labor-task-'+task.id);
      assert.ok(row,task.id+' is rendered');
      const toggle=row.querySelector('.labor-customer-materials');
      assert.ok(toggle,task.id+' requires a Nik-supplied product or consumables cost path');
      assert.equal(toggle.checked,false,task.id+' defaults to Nik supplying');
      assert.match(row.querySelector('.labor-line-price').textContent,/installed price pending/i,task.id+' does not imply final installed pricing');
      checked++;
     }
    }
   }
  }
  assert.ok(checked>35,'audit broad enough to cover category services');
 }finally{dom.window.close();}
});


test('approved labor anchor rates remain unchanged when supplier defaults change',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window;
  const approvedBathroomLabor={
   'toilet-install':175,
   'smart-toilet-install':650,
   'toilet-tank-repair':125,
   'toilet-wax-ring':125,
   'toilet-flange':250,
   'vanity-install':300,
   'faucet-replace':225,
   'vanity-light-install':175,
   'tub-resurface':450,
   'tub-replace':1600,
   'shower-valve-install':450
  };
  for(const [id,expected] of Object.entries(approvedBathroomLabor)){
   const task=w.BATHROOM_PACKAGES.find(p=>p.id===id);
   assert.ok(task,'Bathroom labor task '+id+' exists');
   assert.equal(task.labor,expected,id+' owner-approved LABOR component must not be replaced with a fixture allowance');
  }
  const approvedOtherLabor={
   'cabinet-box-install':150,
   'cabinet-crown':3,
   'cabinet-filler':15,
   'cabinet-hole-prep':15,
   'cabinet-end-panel':75,
   'door-hinge-existing':15,
   'window-trim-complete':150,
   'door-adjust':75,
   'ceiling-existing-light':150,
   'recessed-light-replace':175,
   'drywall-sheet-install':75,
   'kitchen-install-kitchen-sink':225,
   'kitchen-replace-kitchen-faucet':175,
   'kitchen-install-backsplash':350
  };
  const tasks=w.LABOR_CATALOG.flatMap(c=>c.groups).flatMap(g=>Object.values(g.actions).flat());
  for(const [id,expected] of Object.entries(approvedOtherLabor)){
   const matches=tasks.filter(t=>t.id===id);
   assert.equal(matches.length,1,id+' must exist exactly once across the labor catalog');
   assert.equal(matches[0].price,expected,id+' approved labor component must not drift when material prices change');
   assert.equal(matches[0].status,'approved',id+' should remain approved');
  }
  assert.deepEqual(Array.from(w.FLOORING_LABOR_RATES.LVP),[350,575,800],
   'existing LVP labor size chart stays unchanged');
  assert.equal(w.serviceEstimateSummary([{type:'Labor',price:75,qty:1}]).total,150,
   'single service minimum remains $150');
 }finally{dom.window.close();}
});


test('installation review labels unverified installed amounts as labor portions, not final prices',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const row=d.getElementById('labor-task-door-hinge-existing');
  row.querySelector('button').click();
  let review=d.getElementById('labor-review-list').textContent;
  assert.match(review,/Labor portion\s*·\s*\$15(?:\.00)?(?=\D|$)/,'Nik-supplied goods keep the labor amount explicitly provisional regardless of currency formatter decimals');
  assert.match(review,/Final installed total pending verified costs/);
  assert.match(d.getElementById('labor-review-total').textContent,/installed quote pending/);
  row.querySelector('.labor-customer-materials').checked=true;
  row.querySelector('button').click();
  review=d.getElementById('labor-review-list').textContent;
  assert.match(review,/Customer supplies products\/materials/);
  assert.doesNotMatch(review,/Labor portion\s*·/,'labor-only opt-out does not imply an unverified Nik-supplied installed quote');
 }finally{dom.window.close();}
});

test('customer-supplied labor-only work never retains Nik consumable reserve, including edits',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const row=d.getElementById('labor-task-paint-accent');
  const toggle=row.querySelector('.labor-customer-materials');
  const button=row.querySelector('button');
  assert.equal(toggle.checked,false);
  button.click();
  let item=w.getCart().find(x=>x.taskId==='paint-accent');
  assert.equal(item.materialsProvider,'niks');
  assert.equal(item.internalSupplyBudget,25,'Nik-supplied painting keeps its hidden consumable reserve');
  const edit=d.querySelector('.labor-review-row button');
  assert.ok(edit,'selected labor item can be edited');
  edit.click();
  toggle.checked=true;
  toggle.dispatchEvent(new w.Event('change'));
  button.click();
  item=w.getCart().find(x=>x.taskId==='paint-accent');
  assert.equal(item.materialsProvider,'customer');
  assert.equal(item.internalSupplyBudget,0,'customer-supplied option excludes Nik reserve');
  assert.equal(item.materialsPricingPending,undefined);
  const editAgain=d.querySelector('.labor-review-row button');
  editAgain.click();
  toggle.checked=false;
  toggle.dispatchEvent(new w.Event('change'));
  button.click();
  item=w.getCart().find(x=>x.taskId==='paint-accent');
  assert.equal(item.materialsProvider,'niks');
  assert.equal(item.internalSupplyBudget,25,'switching back restores Nik internal consumable reserve');
  assert.equal(item.materialsPricingPending,true);
 }finally{dom.window.close();}
});
