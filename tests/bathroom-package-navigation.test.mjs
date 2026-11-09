import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const source=readFileSync('project.html','utf8').replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g,(_,src)=>{
 const file=src.split('?')[0].replace(/^\//,'');
 return existsSync(file)?'<script>'+readFileSync(file,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>':'';
});
async function load(id,query=''){
 const dom=new JSDOM(source,{url:'https://niksremodeling.com/project.html?project='+id+query,runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
   w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 }});
 await new Promise(resolve=>dom.window.addEventListener('load',resolve,{once:true}));
 return dom;
}

for(const {id,tiers,prices} of [
 {id:'bathrooms',tiers:['Basic','Standard','Deluxe','Custom'],prices:['$995','$2,195','$3,195']},
 {id:'kitchen-pantry',tiers:['Basic','Standard','Deluxe','Custom'],prices:['$1,995','$6,495','$17,995']},
 {id:'accessibility',tiers:['Basic','Standard','Premium','Custom'],prices:['$435','$755','$3,915']}
]){
 test(id+' uses the same compact package cards without duplicate instructions',async()=>{
  const dom=await load(id);
  try{
   const doc=dom.window.document;
   const cards=[...doc.querySelectorAll('.pkg-choice')];
   assert.equal(cards.length,tiers.length);
   assert.ok(cards.every((x,i)=>x.querySelector('.pkg-image strong')?.textContent.startsWith(tiers[i])),'Package tier labels must remain clear');
   assert.equal(doc.querySelectorAll('.pkg-image-overlay').length,tiers.length-1);
   assert.equal(doc.querySelectorAll('.pkg-mobile-details').length,tiers.length-1);
   assert.equal(doc.querySelectorAll('.pkg-add').length,tiers.length-1);
   assert.ok(cards.every(x=>x.querySelector('.pkg-image img')?.getAttribute('src')));
   assert.ok(prices.every(price=>doc.querySelector('main').textContent.includes(price)));
   assert.ok(!doc.querySelector('main').textContent.includes('Choose a package below'));
   assert.ok(!doc.querySelector('main').textContent.includes('Hover over a photo'));
   assert.ok(!doc.querySelector('main').textContent.includes('Tap “See what'));
   assert.ok(cards.at(-1).querySelector('a[href*="roomMode=individual"]'));
  }finally{dom.window.close()}
 });
}

test('An existing Bathroom package deep link retains its selected card',async()=>{
 const dom=await load('bathrooms','&bathPackage=standard');
 try{assert.match(dom.window.document.querySelector('.pkg-choice.selected .pkg-image strong')?.textContent||'',/Standard/)}
 finally{dom.window.close()}
});
