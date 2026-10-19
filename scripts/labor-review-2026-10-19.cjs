const {JSDOM}=require('jsdom');const fs=require('node:fs');const assert=require('node:assert/strict');
async function load(file,query='') { let html=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(all,src)=>{const path=src.split('?')[0].replace(/^\//,'');return fs.existsSync(path)?'<script>'+fs.readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':''});const dom=new JSDOM(html,{url:'https://niksremodeling.com/'+file+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.alert=()=>{};w.fetch=async()=>({ok:false,json:async()=>({})});}});await new Promise(r=>setTimeout(r,300));return dom;}

(async()=>{
const d=await load('installation.html'),w=d.window;
const tasks=w.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));
for(const [label,price] of [['Dishwasher installation',275],['New dryer vent installation',250],['Over-the-range microwave installation',325],['Gas range installation with existing connections',225],['Single wall oven installation with existing connections',325],['Double wall oven installation with existing connections',575],['Stacked washer/dryer installation with existing hookups',550],['Refrigerator installation with new water line',275],['Built-in beverage tap / kegerator installation — starting at',350]])assert.equal(tasks.find(t=>t.label===label)?.price,price,label);
assert(!tasks.some(t=>/ice maker/i.test(t.label)));
for(const t of w.LABOR_CATALOG.find(c=>c.id==='appliances').groups[0].actions.Remove)assert.equal(t.price,150,t.label);
for(const [id,price] of [['smart-toilet-install',650],['faucet-replace',225],['shower-valve-install',450],['toilet-flange',250],['vanity-light-replace',175],['tub-remove',500],['tub-install',1200],['tub-replace',1600]])assert.equal(w.BATHROOM_PACKAGES.find(p=>p.id===id)?.labor,price,id);
assert.match(w.BATHROOM_PACKAGES.find(p=>p.id==='shower-valve-install').note,/Drywall repair is not included/);
assert(tasks.some(t=>t.id==='tub-install'));assert(tasks.some(t=>t.id==='tub-remove'));
assert.match(w.document.body.textContent,/vanity faucet/);

const c=await load('calculators.html');
assert(c.window.BATHROOM_PACKAGES.some(p=>p.id==='tub-install'));
assert.equal(c.window.bathroomPackageTotal(c.window.bathroomPackageByLabel('Remove and replace vanity faucet'),true),300);
console.log('October 19 appliance, bathroom, removal, scope and calculator checks passed.');process.exit(0);
})().catch(e=>{console.error(e);process.exitCode=1});
