import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const projects=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const terms=readFileSync(new URL('../terms.html',import.meta.url),'utf8');
const basic=projects.slice(projects.indexOf('// Isolated Bathroom package pilot.'),projects.indexOf('// Kitchen packages'));

test('whole Bathroom packages include material deposits, labor, and overhead without exceeding starting price',()=>{
  const tiers=[
    {id:'basic',total:995,deposit:320,labor:525,overhead:150},
    {id:'standard',total:2195,deposit:545,labor:1350,overhead:300},
    {id:'deluxe',total:3195,deposit:745,labor:1950,overhead:500}
  ];
  for(const p of tiers){
    assert.ok(basic.includes("id:'"+p.id+"'"));
    const match=basic.match(new RegExp("id:'"+p.id+"'[^\\n]*startingAt:(\\d+),depositEstimate:(\\d+),laborEstimate:(\\d+),overheadAllowance:(\\d+)"));
    assert.ok(match,p.id+' missing pricing breakdown');
    assert.deepEqual(match.slice(1).map(Number),[p.total,p.deposit,p.labor,p.overhead]);
    assert.equal(p.deposit+p.labor+p.overhead,p.total);
  }
});

test('cart displays complete package labor and deposit separately from cash due now',()=>{
 assert.ok(projects.includes('source:\'bathroom-project-package\''));
 for(const term of ['Bathroom package starting total','Materials and supplies (proposed deposit)','Labor included in package','Overhead and contingency','Remaining balance after deposit (progress draws)']){
  assert.ok(app.includes(term),term+' missing');
 }
 assert.ok(app.includes("Request Deposit Invoice"));
 assert.ok(app.includes('No deposit or other payment can be made through this cart yet.'));
 assert.ok(terms.includes('weekly progress draws'));
});
