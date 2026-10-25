import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
async function open(file,query=''){
 const html=readFileSync(file,'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{const p=src.split('?')[0].replace(/^\//,'');return existsSync(p)?'<script>'+readFileSync(p,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';});
 const dom=new JSDOM(html,{url:'https://niksremodeling.com/'+file+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 await new Promise(r=>setTimeout(r,100));return dom;
}
test('room package cart uses the approved total and replacing its scope never duplicates a charge',async()=>{
 const dom=await open('room-labor.html','?package=full'),w=dom.window,d=w.document;
 assert.equal(d.getElementById('room-price').textContent,'$2,340.00');
 d.getElementById('room-add').click();assert.equal(w.serviceEstimateSummary(w.getCart()).total,2340);
 const select=d.getElementById('room-service');select.value='hang-finish';select.dispatchEvent(new w.Event('input'));d.getElementById('room-add').click();
 assert.equal(w.getCart().length,1);assert.equal(w.serviceEstimateSummary(w.getCart()).total,1668);
 d.getElementById('room-length').value=5;d.getElementById('room-width').value=8;select.value='full';select.dispatchEvent(new w.Event('input'));assert.equal(d.getElementById('room-price').textContent,'$1,305.00');
 d.getElementById('room-length').value=10;d.getElementById('room-width').value=25;select.dispatchEvent(new w.Event('input'));assert.equal(d.getElementById('room-price').textContent,'$3,450.00');
 dom.window.close();
});
test('the catalog removes seam-foot pricing, retains accent $175, and matches crown rates',async()=>{
 const dom=await open('installation.html'),w=dom.window;const tasks=w.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));
 assert(!tasks.some(t=>t.label==='Finish drywall seams'));const finish=tasks.find(t=>t.label==='Drywall finishing — ready for primer');assert.equal(finish.price,2.25);assert.equal(finish.unit,'sq. ft.');assert.equal(tasks.find(t=>t.id==='paint-accent').price,175);
 for(const task of tasks.filter(t=>/crown molding/i.test(t.label)&&/Install|installation/.test(t.label)&&!/finishing/i.test(t.label)))assert.equal(task.price,4);
 const row=w.document.getElementById('labor-task-'+finish.id);row.querySelector('input').value='32.5';w.document.getElementById('labor-room').value='Wall';row.querySelector('button').click();assert.equal(w.getCart()[0].price*w.getCart()[0].qty,73.125);assert.equal(w.serviceEstimateSummary(w.getCart()).total,150);
 dom.window.close();
});
test('ceiling premium applies only to overhead work and remains in the combined package cart',async()=>{
 const dom=await open('room-labor.html','?package=full&surfaces=both'),w=dom.window,d=w.document;
 assert.equal(d.getElementById('room-price').textContent,'$3,438.00');
 assert.equal(w.roomLaborQuote(0,'full',144).amount,1098);
 assert.equal(w.roomLaborQuote(384,'full').amount,2340);
 d.getElementById('room-add').click();assert.equal(w.getCart()[0].ceilingArea,144);assert.equal(w.serviceEstimateSummary(w.getCart()).total,3438);
 const surface=d.getElementById('room-surfaces');surface.value='ceiling';surface.dispatchEvent(new w.Event('input'));d.getElementById('room-service').value='paint2';d.getElementById('room-service').dispatchEvent(new w.Event('input'));
 assert.equal(d.getElementById('room-price').textContent,'$259.20');d.getElementById('room-add').click();assert.equal(w.getCart().length,1);assert.equal(w.getCart()[0].price,259.2);
 dom.window.close();
});

test('trim combined services equal the separate work and medium-room target',async()=>{const dom=await open('installation.html');const tasks=dom.window.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));const rate=label=>tasks.find(t=>t.label===label).price;assert.equal(rate('Baseboard installation')+rate('Baseboard finishing and painting'),rate('Baseboard installation, finishing and painting'));assert.equal(rate('Crown molding installation')+rate('Crown molding finishing and painting'),rate('Crown molding installation, finishing and painting'));assert.equal(rate('Baseboard installation, finishing and painting')*48,300);assert.equal(rate('Crown molding installation, finishing and painting')*48,396);const d=dom.window.document;d.getElementById('labor-room').value='Medium room';for(const id of ['baseboard-complete','crown-complete']){const row=d.getElementById('labor-task-'+id);row.querySelector('input').value=48;row.querySelector('button').click();}assert.equal(dom.window.serviceEstimateSummary(dom.window.getCart()).total,696);assert.equal(dom.window.getCart().length,2);dom.window.close();});

test('smart installation prices reach the cart without a second basic setup charge',async()=>{const dom=await open('installation.html');const w=dom.window,d=w.document,tasks=w.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));d.getElementById('labor-room').value='Main room';for(const [label,amount]of [['Smart light switch installation (existing connections)',175],['Smart thermostat installation (existing connections)',200],['Smart doorbell installation (existing connections)',175]]){const task=tasks.find(t=>t.label===label);assert.equal(task.price,amount);assert.equal(task.startingAt,false);d.getElementById('labor-task-'+task.id).querySelector('button').click();}assert.equal(w.getCart().length,3);assert.equal(w.serviceEstimateSummary(w.getCart()).total,550);const setup=tasks.find(t=>t.label==='Whole-home smart lighting setup');assert.equal(setup.price,null);assert.equal(setup.status,'pending');assert.match(d.getElementById('labor-task-'+setup.id).textContent,/In-person quote required/);dom.window.close();});

test('speaker quantities charge per speaker and share the minimum trip charge',async()=>{const dom=await open('installation.html');const w=dom.window,d=w.document,tasks=w.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));const wall=tasks.find(t=>t.label==='Wall-mounted speaker installation (existing wiring)'),builtIn=tasks.find(t=>t.label==='Built-in speaker installation (existing wiring)');assert.equal(wall.price,100);assert.equal(builtIn.price,150);assert.equal(wall.startingAt,true);assert.equal(wall.unit,'speaker');d.getElementById('labor-room').value='Living room';const row=d.getElementById('labor-task-'+wall.id);row.querySelector('button').click();assert.equal(w.serviceEstimateSummary(w.getCart()).total,150);row.querySelector('input').value=2;row.querySelector('button').click();assert.equal(w.getCart().length,1);assert.equal(w.serviceEstimateSummary(w.getCart()).total,200);assert.equal(tasks.find(t=>t.id==='speaker-new-system').price,null);dom.window.close();});
test('the remaining approved voice-review prices are present and door discounts combine across rooms',async()=>{
 const dom=await open('installation.html'),w=dom.window,d=w.document,tasks=w.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));
 const expected=[['Microwave/oven combination installation',650],['Interior prehung door installation (including closet doors)',100],['Interior slab door installation',250],['Storm door installation',175],['French door installation',250],['Bifold closet door installation',175],['Window removal and haul-off',250],['Attic access ladder replacement — existing opening',350],['New attic access ladder installation',450],['Garage door insulation kit installation — single-car door',150],['Garage door insulation kit installation — double-car door',225],['Kitchen sink hookup, including drain connection',225],['Kitchen faucet installation',175],['Remove kitchen sink and haul off',125],['Tile backsplash installation',350],['Under-cabinet lighting installation (existing connections)',375],['Under-cabinet lighting installation (new wiring and switch)',575],['Heated towel rack installation, plug-in (existing outlet)',150],['Heated towel rack installation, hardwired (existing connections)',275],['Heated towel rack installation (new wiring and switch)',475],['Ceiling fan installation (existing connections)',175],['Ceiling fan installation with new wiring',450],['Hardwired smoke or CO detector installation (existing connections)',150],['Electric wall heater replacement (existing opening and wiring)',225],['Wall-mounted infrared heater installation (existing connections)',225],['Chair rail installation, finishing and painting',6.25],['Door and window casing installation, finishing and painting',6.25]];
 for(const[label,price]of expected){const task=tasks.find(t=>t.label===label);assert.ok(task,label);assert.equal(task.price,price,label);assert.equal(task.status,'approved',label);}
 for(const label of ['Remove countertop and haul off','Remove backsplash','New electric wall heater installation','Miscellaneous labor','Demolition labor']){const task=tasks.find(t=>t.label===label);assert.equal(task.price,null,label);}
 for(const label of ['Door trim repair','Window trim repair','Threshold adjustment','Replace ceiling light with ceiling fan (existing connections)'])assert(!tasks.some(t=>t.label===label),label);
 const add=(label,qty,room)=>{const task=tasks.find(t=>t.label===label),row=d.getElementById('labor-task-'+task.id);d.getElementById('labor-room').value=room;row.querySelector('input').value=qty;row.querySelector('button').click();};
 add('Interior door removal and haul-off',2,'Bedroom');assert.equal(w.serviceEstimateSummary(w.getCart()).total,200);
 add('Exterior door removal and haul-off',1,'Front');assert.equal(w.serviceEstimateSummary(w.getCart()).total,255);assert(w.getCart().every(t=>t.price===85));
 add('Storm door removal and haul-off',1,'Back');assert.equal(w.serviceEstimateSummary(w.getCart()).total,300);
 w.saveCart(w.getCart().filter(t=>t.room!=='Back'));assert.equal(w.serviceEstimateSummary(w.getCart()).total,255);
 add('Window removal and haul-off',1,'Kitchen');assert.equal(w.serviceEstimateSummary(w.getCart()).total,505);
 assert.equal(tasks.find(t=>t.label==='Dishwasher removal and haul-off').price,150);assert.equal(tasks.find(t=>t.label==='Stacked washer/dryer removal and haul-off').price,300);
 assert.match(d.body.textContent,/\$150 minimum trip charge/);
 w.saveCart([]);add('Cabinet removal and haul-off',2,'Kitchen');add('Cabinet removal and haul-off',2,'Bath');assert.equal(w.serviceEstimateSummary(w.getCart()).total,260);
 const grouped=w.repriceRemovalGroups([{removalGroup:'cabinets',removalCount:2,qty:1},{removalGroup:'cabinets',removalCount:2,qty:1}]);assert.equal(grouped.reduce((n,x)=>n+x.price,0),260);
 dom.window.close();
});

test('original labor price table tracks final October 24 approvals',()=>{
 const html=readFileSync('installation.html','utf8');
 const match=html.match(/const rates=(\\{[^\\n]+\\});\\nconst catalog=window\\.LABOR_CATALOG;/);
 assert.ok(match,'The original rates must be readable and centrally reviewed.');
 const rates=JSON.parse(match[1]);
 const expected={
  appliances:{'Microwave/oven combination installation':650},
  electrical:{
   'Under-cabinet lighting installation (existing connections)':375,
   'Heated towel rack installation, plug-in (existing outlet)':150,
   'Smart thermostat installation (existing connections)':200,
   'Replace existing ceiling fan (existing connections)':175,
   'Install ceiling fan with new wiring':450,
   'Smart light switch installation (existing connections)':175,
   'Built-in speaker installation (existing wiring)':150,
   'Wall-mounted speaker installation':100,
   'Smart doorbell installation (existing connections)':175,
   'Under-cabinet lighting installation (new wiring and switch)':575,
   'Heated towel rack installation (new wiring and switch)':475,
   'Hardwired smoke or CO detector installation (existing connections)':150
  },
  doors:{
   'Interior prehung door installation (including closet doors)':100,
   'Interior slab door installation':250,
   'Storm door installation':175,
   'French door installation':250,
   'Bifold door installation':175
  },
  carpentry:{
   'Attic access ladder installation':350,
   'Garage door insulation kit installation':150
  }
 };
 for(const [category,items] of Object.entries(expected)){
  for(const [name,price] of Object.entries(items)){
   const entries=rates[category].filter(([label])=>label===name);
   assert.equal(entries.length,1,name+' should have one source entry');
   assert.equal(entries[0][1],price,name+' must match final owner approval');
  }
 }
 const app=readFileSync('app.js','utf8');
 const bathMatch=app.match(/window\\.BATHROOM_PACKAGES=(\\[[^\\n]+\\]);/);
 assert.ok(bathMatch);
 const packages=JSON.parse(bathMatch[1]);
 for(const [id,price] of Object.entries({'toilet-install':150,'smart-toilet-install':750,'vanity-install':300,'faucet-replace':150,'vanity-light-replace':150}))
  assert.equal(packages.find(item=>item.id===id)?.labor,price,'Bathroom package '+id);
});
