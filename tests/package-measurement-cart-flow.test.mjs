import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM, VirtualConsole} from 'jsdom';

const root=new URL('../',import.meta.url);
const renderHtml=(page)=>readFileSync(new URL(page,root),'utf8')
  .replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
    const path=src.split('?')[0].replace(/^\//,'');
    return existsSync(new URL(path,root))
      ?'<script>'+readFileSync(new URL(path,root),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>'
      :'';
  });
async function load(page,query='',cart=[]){
  const virtualConsole=new VirtualConsole();
  // JSDOM does not implement cross-page navigation after the cart has been saved.
  virtualConsole.on('jsdomError',e=>{if(!/Not implemented: navigation/.test(e.message))throw e;});
  const dom=new JSDOM(renderHtml(page),{
    url:'https://niksremodeling.com/'+page+query,
    runScripts:'dangerously',pretendToBeVisual:true,virtualConsole,
    beforeParse(w){
      w.HTMLElement.prototype.scrollIntoView=function(){};
      w.scrollTo=()=>{};
      w.localStorage.setItem('nr-cart',JSON.stringify(cart));
    }
  });
  await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
  return dom;
}
const packageCases=[
  {project:'bathrooms',source:'room-project-package',button:'.pkg-add[data-package="standard"]',tier:'standard'},
  {project:'kitchen-pantry',source:'room-project-package',button:'.pkg-add[data-package="standard"]',tier:'standard'},
  {project:'attic',source:'room-project-package',button:'.pkg-add[data-package="basic"]',tier:'basic'}
];
for(const entry of packageCases)test(entry.project+' package collects measurements before cart and includes labor',async()=>{
  const dom=await load('project.html','?project='+entry.project);
  try{
    const w=dom.window,d=w.document,btn=d.querySelector(entry.button);
    assert.ok(btn,entry.project+' package button missing');
    assert.equal(btn.textContent,'Calculate Quote');
    btn.click();
    assert.ok(d.querySelector('#pkg-measure-form'),'Package button must open measurements');
    assert.equal(JSON.parse(w.localStorage.getItem('nr-cart')).length,0,'No unmeasured cart entry');
    assert.equal(d.querySelector('#pkg-measure-result').hidden,true);
    const set=(id,value)=>d.getElementById(id).value=value;
    set('pkg-length-ft','10');set('pkg-width-ft','10');set('pkg-height-ft','8');
    d.querySelector('#pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.querySelector('#pkg-measure-result').hidden,false,'Measured estimate should display');
    assert.match(d.querySelector('#pkg-measure-summary').textContent,/100 sq\. ft\./);
    d.querySelector('#pkg-confirm-add').click();
    const items=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(items.length,1);
    assert.equal(items[0].source,entry.source);
    assert.equal(items[0].packageId,entry.tier);
    assert.equal(items[0].measurements.floorArea,100);
    assert.equal(items[0].measurements.ceilingArea,100);
    assert.equal(items[0].quoteRequired,true,'A starting price must not be treated as a final invoice');
    assert.equal(items[0].price,null);
    w.renderCart();
    assert.match(d.body.textContent,/Complete package:.*Labor, materials and standard supplies included/);
    assert.equal(d.querySelector('.nr-cart-actions a[href="/installation.html"]'),null,
      'Do not suggest paying for installation twice for a complete package');
    assert.ok(d.querySelector('.nr-cart-meta')?.textContent);
    assert.match(d.body.textContent,/Measurements:/);
  } finally {dom.window.close();}
});
test('Bathroom measured paint and estimate do not silently add separate labor charges',async()=>{
  const dom=await load('project.html','?project=bathrooms');
  try{
    const w=dom.window,d=w.document;
    d.querySelector('.pkg-add[data-package="standard"]').click();
    d.getElementById('pkg-length-ft').value='10';
    d.getElementById('pkg-width-ft').value='10';
    d.getElementById('pkg-height-ft').value='8';
    d.getElementById('pkg-openings').value='20';
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.match(d.getElementById('pkg-measure-summary').textContent,/300 sq\. ft\./);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/2 gallons/);
    d.getElementById('pkg-confirm-add').click();
    const item=JSON.parse(w.localStorage.getItem('nr-cart'))[0];
    assert.equal(item.measurements.wallArea,300);
    assert.equal(item.measurements.wallPaintGallons,2);
    assert.equal(item.measurements.wallPaintLabor,450);
    assert.equal(item.startingAt,1470,'A larger measured bathroom includes the extra paint labor and fees without charging labor twice');
    assert.equal(item.price,null,'Measured painting breakdown must not be added atop bundled starting price');
  } finally {dom.window.close();}
});
test('Legacy unmeasured package has direct measurement link; measuring it does not duplicate the cart row',async()=>{
  const old={name:'Bathroom — Standard Upgrade',qty:1,type:'Service',source:'bathroom-project-package',packageId:'standard',startingAt:2195,price:null,quoteRequired:true};
  const cart=await load('project-cart.html','',[old]);
  let href;
  try{
    const d=cart.window.document;
    href=d.querySelector('a[href*="quote=1"]')?.getAttribute('href');
    assert.ok(href,'Existing package should offer to enter measurements');
    assert.match(href,/bathPackage=standard/);
    assert.equal(d.querySelector('.nr-cart-actions a[href="/installation.html"]'),null);
  }finally{cart.window.close();}
  const url=new URL(href,'https://niksremodeling.com');
  const page=await load('project.html',url.search,[old]);
  try{
    const w=page.window,d=w.document;
    assert.ok(d.getElementById('pkg-measure-form'),'Link should open measurements directly');
    d.getElementById('pkg-length-ft').value='10';
    d.getElementById('pkg-width-ft').value='10';
    d.getElementById('pkg-height-ft').value='8';
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    d.getElementById('pkg-confirm-add').click();
    const items=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(items.length,1,'Legacy unmeasured package must be replaced, not duplicated');
    assert.equal(items[0].measurements.floorArea,100);
  }finally{page.window.close();}
});

test('Accessibility package asks relevant feature counts instead of an unrelated room size',async()=>{
  const dom=await load('project.html','?project=accessibility');
  try{
    const w=dom.window,d=w.document;
    const button=d.querySelector('.pkg-add[data-package="standard"]');
    assert.equal(button?.textContent,'Calculate Quote');
    button.click();
    assert.ok(d.querySelector('#pkg-feature-grid')||d.querySelector('.pkg-feature-grid'));
    assert.equal(d.getElementById('pkg-length-ft'),null,'No whole-room dimensions for grab bars');
    assert.equal(JSON.parse(w.localStorage.getItem('nr-cart')).length,0);
    d.getElementById('pkg-grab-bars').value='2';
    d.getElementById('pkg-handrail-length').value='12';
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.getElementById('pkg-measure-result').hidden,false);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/12 ft/);
    d.getElementById('pkg-confirm-add').click();
    const [item]=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(item.source,'room-project-package');
    assert.equal(item.measurements.grabBars,2);
    assert.equal(item.measurements.handrailLength,12);
    assert.equal(item.quoteRequired,true);
    assert.equal(item.inPersonQuoteRequired,true);
    assert.equal(item.price,null);
    w.renderCart();
    assert.equal(d.querySelector('.nr-cart-actions a[href="/installation.html"]'),null);
    assert.match(d.body.textContent,/2 grab bars/);
  }finally{dom.window.close();}
});

test('Accent package measures only the chosen wall length × height and uses approved $175 painting labor',async()=>{
  const dom=await load('project.html','?project=accents');
  try{
    const w=dom.window,d=w.document;
    const button=d.querySelector('.pkg-add[data-package="basic"]');
    assert.ok(button);
    button.click();
    assert.ok(d.getElementById('pkg-length-ft'));
    assert.ok(d.getElementById('pkg-height-ft'));
    assert.equal(d.getElementById('pkg-width-ft'),null,'Accent walls must not ask for room width');
    d.getElementById('pkg-length-ft').value='12';
    d.getElementById('pkg-height-ft').value='8';
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.getElementById('pkg-measure-result').hidden,false);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/96 sq\. ft\./);
    d.getElementById('pkg-confirm-add').click();
    const [item]=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(item.measurements.wallArea,96);
    assert.equal(item.measurements.floorArea,0);
    assert.equal(item.measurements.accentOnly,true);
    assert.equal(item.measurements.wallPaintLabor,175);
    assert.equal(item.price,null,'Fixed accent painting is part of the package, not a second charge');
    w.renderCart();
    assert.match(d.body.textContent,/12 × 8 ft\. accent wall/);
  }finally{dom.window.close();}
});

test('Accent Wall package advertises the new chair-rail starting price and never takes payment',async()=>{
 const dom=await load('project.html','?project=accents');
 try{
  const w=dom.window,d=w.document;
  assert.ok(d.querySelector('.pkg-pricing')?.textContent.includes('$585'));
  assert.equal(d.querySelectorAll('.pkg-choice').length,4);
  d.querySelector('.pkg-add[data-package="basic"]').click();
  d.getElementById('pkg-length-ft').value='12';
  d.getElementById('pkg-height-ft').value='8';
  d.querySelector('#pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  assert.equal(d.querySelector('#pkg-measure-result').hidden,false);
  d.getElementById('pkg-confirm-add').click();
  const [item]=JSON.parse(w.localStorage.getItem('nr-cart'));
  assert.equal(item.startingAt,585);
  assert.equal(item.measurements.wallArea,96);
  assert.equal(item.price,null);
  assert.equal(item.quoteRequired,true);
  w.renderCart();
  assert.equal(d.getElementById('cart-due-now').textContent,'$0.00');
 }finally{dom.window.close()}
});

test('Larger accent walls keep their measured size and require a confirmed quote',async()=>{
 const dom=await load('project.html','?project=accents');
 try{
  const w=dom.window,d=w.document;
  d.querySelector('.pkg-add[data-package="basic"]').click();
  d.getElementById('pkg-length-ft').value='20';
  d.getElementById('pkg-height-ft').value='10';
  d.querySelector('#pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  assert.equal(d.getElementById('pkg-measure-result').hidden,false);
  assert.match(d.getElementById('pkg-measure-summary').textContent,/200 sq\. ft\./);
  d.getElementById('pkg-confirm-add').click();
  const [item]=JSON.parse(w.localStorage.getItem('nr-cart'));
  assert.equal(item.measurements.wallArea,200);
  assert.equal(item.measurements.wallPaintLabor,300);
  assert.equal(item.quoteRequired,true);
  assert.equal(item.price,null);
  assert.ok(item.startingAt>585,'Larger accent walls must increase the measured starting estimate');
 }finally{dom.window.close()}
});

test('Combined project total includes quoted package minimum plus separate product and 8% estimated tax',async()=>{
  const cart=[
    {name:'Accent Wall — Basic',source:'room-project-package',projectId:'accents',packageId:'basic',
      type:'Service',qty:1,price:null,startingAt:350,depositEstimate:147.13,
      laborEstimate:166.25,overheadAllowance:36.62,quoteRequired:true},
    {name:'Customer-selected merchandise',source:'supplier-retail',type:'Product',qty:1,price:100}
  ];
  const dom=await load('project-cart.html','',cart);
  try{
    const d=dom.window.document;
    const combined=d.getElementById('cart-combined-project-total');
    assert.ok(combined,'A combined project estimate must be visible');
    assert.match(d.body.textContent,/Combined Project Total/);
    assert.equal(combined.textContent,'$458.00+',
      'Include $350 package starting price plus $100 product and $8 estimated product tax');
    assert.equal(d.getElementById('cart-due-now').textContent,'$108.00',
      'The unconfirmed $350 package must never enter the amount due now');
    assert.equal(d.getElementById('cart-tax-amount').textContent,'$8.00',
      'Do not assess interim retail tax on unconfirmed package labor');
  }finally{dom.window.close();}
});

test('Deluxe Bathroom cart credits included vanity light and mirror, keeps replacement vanity separate, and offers full payment',async()=>{
 const fixtureLines=[
  {name:'Standard vanity light (provisional allowance; confirm supplier price)',quantity:1,unitPrice:150},
  {name:'Standard bathroom mirror (provisional allowance; confirm supplier price)',quantity:1,unitPrice:100}
 ];
 const items=[
  {name:'Bathroom — Deluxe Refresh',qty:1,type:'Service',source:'room-project-package',projectId:'bathrooms',packageId:'deluxe',
   startingAt:2560,depositEstimate:633.17,laborEstimate:1680.41,overheadAllowance:246.42,priceBasis:{materials:fixtureLines},price:null,quoteRequired:true,
   measurements:{roomName:'Bathroom',length:14,width:14,height:8,floorArea:196,wallArea:448,perimeter:56,paintGallons:4}},
  {name:'Bathroom Vanity Light Bar 24-Inch Black',type:'Product',source:'bathroom-retail',department:'bathroom',qty:1,productId:'1111111111111111111',variantId:'a',price:43.10,installationRequested:true},
  {name:'Black Round Wall Mirror 20-Inch',type:'Product',source:'bathroom-retail',department:'bathroom',qty:1,productId:'2222222222222222222',variantId:'b',price:47.73,installationRequested:true},
  {name:'White particleboard bathroom vanity unit with two doors',type:'Product',source:'bathroom-retail',department:'bathroom',qty:1,productId:'3333333333333333333',variantId:'c',price:56.03}
 ];
 const dom=await load('project-cart.html','',items);
 try{
  const w=dom.window,d=w.document;
  const text=d.querySelector('.nr-cart-products').textContent;
  assert.match(text,/Included — \$0 extra/);
  assert.equal((text.match(/Included — \$0 extra/g)||[]).length,2,'Light and mirror should be included exactly once');
  assert.match(text,/vanity unit/i);
  assert.match(text,/\$56\.03/,'New vanity cabinet is not part of cosmetic Deluxe');
  assert.match(d.querySelector('.nr-cart-summary').textContent,/Products & materials\$56\.03/);
  assert.match(d.getElementById('cart-combined-project-total').textContent,/\$2,620\.51/);
  assert.ok(d.querySelector('button[data-cart-request="full"]'),'Customer can request a single full-payment invoice');
  assert.ok(d.querySelector('button[data-cart-request="deposit"]'),'Deposit and weekly draws remain optional');
  assert.equal(d.querySelectorAll('.nr-cart-line').length,4,'Included fixture installation must not be added again');
  const saved=JSON.parse(w.localStorage.getItem('nr-cart'));
  assert.equal(saved[1].price,43.10,'Fixture credit is a display calculation and must not corrupt cart storage');
  assert.equal(saved[2].price,47.73);
 }finally{dom.window.close();}
});

test('Basic Bathroom does not silently include a mirror or vanity light',async()=>{
 const items=[
  {name:'Bathroom — Basic Refresh',qty:1,type:'Service',source:'room-project-package',projectId:'bathrooms',packageId:'basic',
   startingAt:875,depositEstimate:300,laborEstimate:450,overheadAllowance:125,
   priceBasis:{materials:[{name:'Vanity faucet (provisional allowance)',quantity:1,unitPrice:125}]},price:null,quoteRequired:true},
  {name:'Black Round Wall Mirror 20-Inch',type:'Product',source:'bathroom-retail',qty:1,productId:'2222222222222222222',variantId:'b',price:47.73}
 ];
 const dom=await load('project-cart.html','',items);
 try{
  const d=dom.window.document;
  assert.doesNotMatch(d.querySelector('.nr-cart-products').textContent,/Included — \$0 extra/);
  assert.match(d.querySelector('.nr-cart-summary').textContent,/Products & materials\$47\.73/);
 }finally{dom.window.close()}
});

test('Deluxe Bathroom includes one of two eligible fixtures, not both',async()=>{
 const items=[
  {name:'Bathroom — Deluxe Refresh',qty:1,type:'Service',source:'room-project-package',projectId:'bathrooms',packageId:'deluxe',
   startingAt:1990,priceBasis:{materials:[{name:'Standard vanity light',quantity:1,unitPrice:150}]},price:null,quoteRequired:true},
  {name:'Bathroom vanity light bar',type:'Product',source:'bathroom-retail',department:'bathroom',
   qty:2,productId:'1111111111111111111',variantId:'a',price:100}
 ];
 const dom=await load('project-cart.html','',items);
 try{
  const d=dom.window.document,txt=d.querySelector('.nr-cart-products').textContent;
  assert.match(txt,/\$100\.00/,'One light is covered; other light remains a $100 purchase');
  assert.match(txt,/fixture allowance/i);
  assert.match(d.querySelector('.nr-cart-summary').textContent,/Products & materials\$100\.00/);
 }finally{dom.window.close();}
});
