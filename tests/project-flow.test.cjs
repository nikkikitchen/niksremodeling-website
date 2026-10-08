const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const context={document:{readyState:'loading',addEventListener(){}},Event:class {},saveCart(){},addEventListener(){},dispatchEvent(){}};
context.window=context;vm.createContext(context);
vm.runInContext(readFileSync('labor-catalog.js','utf8'),context);
vm.runInContext(readFileSync('project-flow.js','utf8'),context);
const tasks=context.LABOR_CATALOG.flatMap(c=>c.groups.flatMap(g=>Object.values(g.actions).flat()));
test('approved appliance amounts retain their specific scopes',()=>{
 const expected={'cooktop-install':445,'dishwasher-replace':600,'disposal-replace':300,'microwave-replace':480,'range-install':360,'hood-replace':300,'fridge-install':240,'oven-replace':360,'laundry-install':360};
 for(const [suffix,price] of Object.entries(expected)){const t=tasks.find(t=>t.id==='appliance-'+suffix);assert.equal(t.status,'approved');assert.equal(t.price,price);}
 assert.equal(tasks.find(t=>t.id==='appliance-dishwasher-install').status,'pending');
});
test('repair quotes and draft bath proposals do not become approved prices',()=>{
 for(const t of tasks.filter(t=>t.id.startsWith('toilet-repair-')))assert.equal(t.price,null);
 assert.equal(tasks.find(t=>t.id==='toilet-replace').price,null);
 assert.equal(tasks.find(t=>t.id==='toilet-install').price,480);
 assert.equal(tasks.find(t=>t.id==='toilet-install').status,'draft');
 assert.equal(tasks.find(t=>t.id==='smart-toilet-install').price,600);
 assert.equal(tasks.find(t=>t.id==='misc-hour').price,75);
});
test('same room and catalog task update across shopping and labor paths',()=>{
 const cart=[{room:' Kitchen ',taskId:'appliance-dishwasher-replace',qty:1,source:'labor-catalog'}];
 context.ProjectFlow.upsert(cart,{room:'kitchen',taskId:'appliance-dishwasher-replace',qty:2,source:'project-flow'});
 assert.equal(cart.length,1);assert.equal(cart[0].qty,2);
 context.ProjectFlow.upsert(cart,{room:'Basement',taskId:'appliance-dishwasher-replace',qty:1});assert.equal(cart.length,2);
});
test('a washer alone is not priced as a washer and dryer set',()=>{
 assert.equal(context.ProjectFlow.matching('Washer').length,0);
 assert(context.ProjectFlow.matching('Washer + dryer').some(t=>t.price===360));
});
