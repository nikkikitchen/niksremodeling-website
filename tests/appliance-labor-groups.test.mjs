import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

async function open(query=''){
 const html=readFileSync('installation.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
  const path=src.split('?')[0].replace(/^\//,'');return existsSync(path)?'<script>'+readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
 });
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/installation.html'+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 await new Promise(r=>setTimeout(r,70));return dom;
}
const tasks=category=>category.groups.flatMap(g=>Object.values(g.actions).flat());

test('every original appliance service, scope, ID and rate survives grouping exactly once',async()=>{
 const dom=await open();
 try{
  const w=dom.window,category=w.LABOR_CATALOG.find(c=>c.id==='appliances'),all=JSON.parse(JSON.stringify(tasks(category)));
  const before=JSON.parse(readFileSync('tests/fixtures/appliance-labor-before.json','utf8'));
  assert.equal(before.length,46);assert.equal(all.length,49);assert.equal(new Set(all.map(t=>t.id)).size,49);
  for(const original of before)assert.deepEqual(all.find(t=>t.id===original.id),original,original.label);
  assert.equal(category.groups.length,16);
  assert.equal(all.find(t=>t.label==='Install garbage disposal').price,275);
  assert.equal(all.find(t=>t.label==='Remove garbage disposal without replacement').price,175);
  assert.equal(tasks(w.LABOR_CATALOG.find(c=>c.id==='kitchen')).some(t=>/garbage disposal/i.test(t.label)),false);
  assert.equal(w.document.querySelectorAll('#labor-category-appliances .labor-line').length,49);
  assert.equal(w.document.querySelectorAll('#labor-category-appliances .labor-group:not([hidden])').length,0);
 }finally{dom.window.close();}
});

test('direct appliance links and the selector show only the matching work, including dryer vents',async()=>{
 const dom=await open('?appliance=refrigerators#labor-category-appliances');
 try{
  const w=dom.window,d=w.document,select=d.getElementById('labor-appliance');
  assert.equal(select.value,'refrigerators');assert.equal(d.querySelectorAll('#labor-category-appliances .labor-group:not([hidden])').length,1);
  assert.equal(d.getElementById('labor-appliance-refrigerators').open,true);
  assert.equal(d.getElementById('labor-appliance-refrigerators').querySelectorAll('.labor-line').length,4);
  select.value='dryers';select.dispatchEvent(new w.Event('change'));
  const visible=d.querySelector('#labor-category-appliances .labor-group:not([hidden])');assert.equal(visible.id,'labor-appliance-dryers');
  assert.match(visible.textContent,/New dryer vent installation/);assert.match(visible.textContent,/Dryer vent cleaning/);assert.match(visible.textContent,/Gas dryer installation/);
  assert.equal(d.getElementById('labor-appliance-stacked-laundry').hidden,true);
  for(const id of ['labor-menu','mobile-labor-menu'])assert.equal(d.querySelectorAll('#'+id+'-appliances a').length,16);
 }finally{dom.window.close();}
});

test('installation and haul-off combine at existing prices, and editing reveals the right appliance',async()=>{
 const dom=await open('?appliance=refrigerators');
 try{
  const w=dom.window,d=w.document;d.getElementById('labor-room').value='Kitchen';
  for(const id of ['approved-appliances-10','approved-haul-8'])d.querySelector('#labor-task-'+id+' button').click();
  assert.equal(w.getCart().length,2);assert.equal(w.serviceEstimateSummary(w.getCart()).total,375);
  const select=d.getElementById('labor-appliance');select.value='dryers';select.dispatchEvent(new w.Event('change'));
  d.querySelector('#labor-review-list button').click();
  assert.equal(select.value,'refrigerators');assert.equal(d.getElementById('labor-appliance-refrigerators').hidden,false);
  const task=d.getElementById('labor-task-approved-appliances-10');task.querySelector('input').value=2;task.querySelector('button').click();
  assert.equal(w.getCart().length,2);assert.equal(w.serviceEstimateSummary(w.getCart()).total,600);
 }finally{dom.window.close();}
});

test('the new no-water refrigerator option requests a quote instead of inventing a price',async()=>{
 const dom=await open('?appliance=refrigerators');
 try{
  const w=dom.window,d=w.document;d.getElementById('labor-room').value='Kitchen';
  d.querySelector('#labor-task-refrigerator-no-water button').click();
  const entry=w.getCart()[0];assert.equal(entry.quoteRequired,true);assert.equal(entry.price,undefined);
  assert.match(d.getElementById('labor-task-refrigerator-no-water').textContent,/In-person quote required/);
 }finally{dom.window.close();}
});
