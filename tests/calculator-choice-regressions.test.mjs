import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

// Regression checks for mismatched work choices and broken calculator handoffs.
async function openPage(file, query = '') {
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
    assert.match(w.document.querySelector('.project-total-note').textContent,/supplies are included with labor/);
  }
  item.labor=[{service:'Removal',quantity:100,unit:'sq. ft.',price:150}];
  w.addProjectToCart();
  assert.equal(w.getCart().filter(x=>x.type==='Included project costs').length,0);
  dom.window.close();
});
