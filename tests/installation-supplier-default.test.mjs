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

test('customer-supplied products preserve approved labor rates and remove material quote pending flag',async()=>{
 const dom=await openInstallation();
 try{
  const w=dom.window,d=w.document;
  const task=d.getElementById('labor-task-door-hinge-existing');
  const toggle=task.querySelector('.labor-customer-materials');
  toggle.checked=true;
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

test('vanity with faucet allowance includes a reviewed 35 percent markup planning budget, not a guaranteed SKU',()=>{
 const app=readFileSync('app.js','utf8');
 assert.match(app,/'vanity-install':\{fixture:740/);
 assert.match(app,/this is not a confirmed product price/i);
 assert.match(readFileSync('scripts/service-pricing-check.cjs','utf8'),/'vanity-install':1040/);
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
