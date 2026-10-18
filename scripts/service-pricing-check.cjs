const {JSDOM}=require('jsdom');const fs=require('node:fs');const assert=require('node:assert/strict');
async function load(file,query='') { let html=fs.readFileSync(file,'utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(all,src)=>{const path=src.split('?')[0].replace(/^\//,'');return fs.existsSync(path)?'<script>'+fs.readFileSync(path,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':''});const dom=new JSDOM(html,{url:'https://niksremodeling.com/'+file+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.scrollTo=()=>{};w.alert=()=>{};}});await new Promise(r=>setTimeout(r,80));return dom;}

(async()=>{
const d=await load('installation.html');const w=d.window,doc=w.document;
const approvedBathroomTotals={
 'toilet-install':550,'smart-toilet-install':2550,
 'toilet-tank-repair':150,'toilet-wax-ring':150,
 'toilet-remove':150,'vanity-remove':150,'bath-drywall-repair':225,
 'vanity-install':1475,'faucet-replace':400,'tub-resurface':675,
 'tub-replace':3500,'shower-valve-install':625,
 'vanity-light-install':300,'vanity-light-replace':300
};
for(const [id,expected] of Object.entries(approvedBathroomTotals)){
 const p=w.BATHROOM_PACKAGES.find(x=>x.id===id);
 assert(p,'Missing bathroom package '+id);
 assert.equal(w.bathroomPackageTotal(p),expected,'Incorrect installed total for '+id);
}
for(const id of ['toilet-remove','vanity-remove','bath-drywall-repair']){
 const p=w.BATHROOM_PACKAGES.find(x=>x.id===id);
 assert.equal(p.supplies,0,'Approved total must include supplies for '+id);
}
const bathroomCatalog=w.LABOR_CATALOG.find(c=>c.id==='bathroom');
const toiletInstall=bathroomCatalog.groups.find(g=>g.id==='toilet').actions.Install.find(t=>t.id==='toilet-install');
assert.match(toiletInstall.priceText,/Labor: \$175/);
assert.match(toiletInstall.priceText,/Installed estimate.*\$550/);
const toiletRemoval=bathroomCatalog.groups.find(g=>g.id==='toilet').actions.Remove.find(t=>t.id==='toilet-remove');
assert.match(toiletRemoval.priceText,/\$150.*included/);
const vanityLights=bathroomCatalog.groups.find(g=>g.id==='vanity-lights');
assert(vanityLights,'Vanity lights must appear separately from vanity cabinetry on labor page');
assert.match(vanityLights.actions.Install[0].priceText,/Labor: \$150/);
assert.match(vanityLights.actions.Replace[0].priceText,/Installed estimate.*\$300/);assert(!/Replace fill valve|Replace flush valve|Replace flapper|Price to set/.test(doc.body.textContent));assert.match(doc.body.textContent,/Diagnose and replace toilet tank parts/);assert.match(doc.body.textContent,/150 service charge/);assert.equal(w.bathroomPackageTotal(w.BATHROOM_PACKAGES.find(p=>p.id==='faucet-replace')),400);assert.equal(w.bathroomPackageTotal(w.BATHROOM_PACKAGES.find(p=>p.id==='faucet-replace'),true),250);assert.equal(w.serviceEstimateSummary([{type:'Labor',packageId:'toilet-wax-ring',price:150,qty:1}]).total,150);assert.equal(w.serviceEstimateSummary([{type:'Labor',price:75,qty:1}]).total,150);const cabinetRemoval=w.LABOR_CATALOG.find(c=>c.id==='cabinets').groups.find(g=>g.id==='cabinet').actions.Remove[0];assert.equal(cabinetRemoval.price,125);assert.match(cabinetRemoval.note,/Haul-off included/i);assert.equal(w.serviceEstimateSummary([{type:'Labor',price:cabinetRemoval.price,qty:1}]).total,150);assert.equal(w.serviceEstimateSummary([{type:'Labor',price:cabinetRemoval.price,qty:2}]).total,250);assert.match(w.cartPriceMarkup({name:'Repair flange',type:'Labor'}),/In-person quote required/);assert(!w.projectEstimateMarkup([{name:'Flange',type:'Labor'}]).includes('$150'));d.window.close();
for(const id of ['toilet-tank-repair','toilet-wax-ring','toilet-flange']){
const base=await load('calculators.html');const p=base.window.BATHROOM_PACKAGES.find(p=>p.id===id);base.window.close();
const page=await load('calculators.html','?'+new URLSearchParams({room:'Bathroom',location:'interior',material:'bathroom',materials:p.label}));const w=page.window,doc=w.document;
for(const input of doc.querySelectorAll('#room-planner input[type=number]'))if(!input.closest('[hidden]')&&!input.disabled)input.value='1';
w.calcMaterial();assert(doc.querySelector('#mat-error').hidden,doc.querySelector('#mat-error').textContent);const total=doc.querySelector('.project-total-price').textContent;assert.equal(total,id==='toilet-flange'?'In-person quote required':'$150.00');w.addProjectToCart();const cart=w.getCart();assert(cart.length);if(id==='toilet-flange')assert(cart.some(x=>x.quoteRequired));else assert.equal(w.serviceEstimateSummary(cart).total,150);page.window.close();}
const home=await load('index.html');assert(!home.window.document.querySelector('.photo-source'));assert(!home.window.document.querySelector('a[href="/project.html?project=other"]'));assert.match(home.window.document.querySelector('a[href="/project.html?project=custom"]').textContent,/More Ideas/);home.window.close();console.log('Service prices, minimum exceptions, flange quote, cart requests, shared faucet prices and tile cleanup passed.');
})().catch(e=>{console.error(e);process.exit(1)});
