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
  {project:'bathrooms',source:'bathroom-project-package',button:'.bath-card-add[data-bath-package="standard"]',tier:'standard'},
  {project:'kitchen-pantry',source:'kitchen-project-package',button:'.bath-card-add[data-kitchen-package="standard"]',tier:'standard'},
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
    set('pkg-length-ft','10');set('pkg-width-ft','10');
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
    d.querySelector('.bath-card-add[data-bath-package="standard"]').click();
    d.getElementById('pkg-length-ft').value='10';
    d.getElementById('pkg-width-ft').value='10';
    d.getElementById('pkg-openings').value='20';
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.match(d.getElementById('pkg-measure-summary').textContent,/300 sq\. ft\./);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/2 gallons/);
    d.getElementById('pkg-confirm-add').click();
    const item=JSON.parse(w.localStorage.getItem('nr-cart'))[0];
    assert.equal(item.measurements.wallArea,300);
    assert.equal(item.measurements.wallPaintGallons,2);
    assert.equal(item.measurements.wallPaintLabor,450);
    assert.equal(item.startingAt,2195);
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
    const button=d.querySelector('[data-accessibility-package="basic"]');
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
    assert.equal(item.source,'accessibility-project-package');
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

test('Audited Basic Accent Wall includes real materials, consumables, discount and a cart starting price',async()=>{
  const dom=await load('project.html','?project=accents');
  try{
    const w=dom.window,d=w.document;
    const spec=w.NIK_AUDITED_PACKAGE_PRICES?.accents?.basic;
    assert.ok(spec,'Accent package must have itemized pricing');
    assert.ok(!spec.consumables.some(x=>/silicone|paint roller frame|drop cloth/i.test(x.name)),
      'Do not bill unsuitable caulk or reusable painting equipment');
    const quote=w.NIK_CALCULATE_PACKAGE_BASELINE(spec);
    assert.equal(quote.startingAt,350);
    assert.equal(quote.depositEstimate,147.13);
    assert.equal(quote.laborEstimate,166.25);
    assert.equal(quote.priceBasis.laborDiscount,8.75);
    assert.equal(quote.overheadAllowance,36.62);
    assert.equal(quote.startingAt,quote.depositEstimate+quote.laborEstimate+quote.overheadAllowance);
    assert.match(d.querySelector('.pkg-pricing')?.textContent||'',/Starting at \$350/);
    const button=d.querySelector('.pkg-add[data-package="basic"]');
    assert.ok(button);
    button.click();
    d.getElementById('pkg-length-ft').value='12';
    d.getElementById('pkg-height-ft').value='8';
    assert.equal(d.getElementById('pkg-width-ft'),null,'A single accent wall must not request full room dimensions');
    d.getElementById('pkg-measure-form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.getElementById('pkg-measure-result').hidden,false);
    d.getElementById('pkg-confirm-add').click();
    const cart=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(cart.length,1);
    assert.equal(cart[0].startingAt,350);
    assert.equal(cart[0].quoteRequired,true,'Starting estimates are not invoices');
    assert.equal(cart[0].price,null,'Do not collect a project deposit automatically');
    assert.deepEqual(cart[0].priceBasis.materials.map(x=>x.unitPrice),[48.60,47.22]);
    w.renderCart();
    assert.match(d.querySelector('.nr-cart-line-price').textContent,/Starting at \$350/);
    assert.equal(d.getElementById('cart-due-now').textContent,'$0.00');
  }finally{dom.window.close();}
});

test('Audited accent wall recalculates a larger measured scope without charging twice',async()=>{
  const dom=await load('project.html','?project=accents');
  try{
    const w=dom.window,d=w.document;
    d.querySelector('.pkg-add[data-package="basic"]').click();
    const length=d.getElementById('pkg-length-ft');
    const height=d.getElementById('pkg-height-ft');
    const submit=()=>d.getElementById('pkg-measure-form')
      .dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    length.value='20';height.value='10';
    submit();
    assert.equal(d.getElementById('pkg-measure-result').hidden,false);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/200 sq\. ft\./);
    assert.match(d.getElementById('pkg-measure-summary').textContent,/measured minimum/i);
    d.getElementById('pkg-confirm-add').click();
    let [item]=JSON.parse(w.localStorage.getItem('nr-cart'));
    assert.equal(item.measurements.wallArea,200);
    assert.equal(item.measurements.wallPaintLabor,300,'Larger walls need more than the small-wall flat labor');
    assert.deepEqual(item.priceBasis.materials.map(x=>x.quantity),[2,1],
      '200 square feet requires two gallons of two-coat paint and one gallon of primer');
    assert.equal(item.priceBasis.laborAfterDiscount,285);
    assert.ok(item.startingAt>350,'Measured wall cannot retain the 96-square-foot minimum');
    assert.equal(item.startingAt,item.depositEstimate+item.laborEstimate+item.overheadAllowance);
    assert.equal(item.price,null);
    assert.equal(item.quoteRequired,true);
    w.renderCart();
    assert.match(d.querySelector('.nr-cart-line-price').textContent,/Starting at \$/);
    assert.equal(d.getElementById('cart-due-now').textContent,'$0.00');
  }finally{dom.window.close();}
});
