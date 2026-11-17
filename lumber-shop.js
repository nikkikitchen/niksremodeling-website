(()=>{'use strict';
const groups=[
['Framing lumber',['2×4','2×6','2×8','2×10','2×12'],['8','10','12','14','16','20'],['Standard framing','Pressure-treated (rating unverified)','Pressure-treated above-ground','Pressure-treated ground-contact']],
['Posts & timbers',['4×4','4×6','6×6'],['8','10','12','16'],['Pressure-treated (rating unverified)','Pressure-treated above-ground','Pressure-treated ground-contact','Untreated']],
['Deck surface boards',['5/4×6','2×6','2×8'],['8','10','12','14','16','20'],['Pressure-treated (rating unverified)','Pressure-treated above-ground','Pressure-treated ground-contact','Cedar','Composite']],
['Deck joists & framing',['2×6','2×8','2×10','2×12'],['8','10','12','14','16','20'],['Pressure-treated above-ground','Pressure-treated ground-contact','Pressure-treated (rating unverified)']],
['Finish boards',['1×2','1×4','1×6','1×8','1×10','1×12'],['6','8','10','12','16'],['Select pine','Common pine','Primed']],
['Sheet goods',['15/32-in OSB','1/2-in plywood','3/4-in ACX plywood','3/4-in treated plywood'],['4×8','4×10'],['Standard','Exterior / treated']]
];
const reference={
'Framing lumber|2×4|8|Standard framing':'2x4x8 Stud Lumber (Standard)',
'Posts & timbers|4×4|8|Pressure-treated (rating unverified)':'Pressure-Treated 4x4x8 Lumber',
'Deck surface boards|5/4×6|12|Pressure-treated (rating unverified)':'Pressure-Treated 5/4x6x12 Decking Board',
'Finish boards|1×4|8|Select pine':'1x4x8 Select Pine Board',
'Sheet goods|15/32-in OSB|4×8|Standard':'4x8 Sheet of 15/32-in OSB Sheathing',
'Sheet goods|3/4-in ACX plywood|4×8|Standard':'4x8 Sheet of 3/4-in ACX Plywood'
};
const node=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;};
const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
function boot(){
 if(!location.pathname.endsWith('/material-lumber.html'))return;
 const old=document.querySelector('.material-detail-grid');if(!old)return;
 const wrap=old.parentElement,lead=wrap.querySelector('.lead');
 if(lead)lead.textContent='Choose your actual board dimensions, length, material and quantity. No project measurement required.';
 const heading=node('h2','Shop lumber by size');
 const panel=node('section',undefined,'lumber-selector');
 const categories=node('div',undefined,'lumber-categories');
 const fields=node('div',undefined,'lumber-fields');
 function select(label){
  const l=node('label',label,'lumber-field'),s=node('select');l.append(s);fields.append(l);return s;
 }
 const size=select('Board dimensions'),length=select('Length'),treatment=select('Type / treatment');
 const qlabel=node('label','Number of pieces','lumber-field'),qty=node('input');
 qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.value='1';qlabel.append(qty);fields.append(qlabel);
 const output=node('div',undefined,'lumber-output'),description=node('h3'),cost=node('p'),notice=node('p');
 const save=node('button','Add to planning list','btn primary');save.type='button';
 const estimator=node('a','Estimate project materials','btn outline');estimator.href='/calculators.html?mode=materials&material=lumber';
 const actions=node('div',undefined,'lumber-actions');actions.append(save,estimator);
 output.append(description,cost,notice,actions);panel.append(categories,fields,output);
 const disclaimer=node('p','Select an actual board size and treatment rating. Ground-contact lumber is priced only when its exact rating is verified; ordinary pressure-treated references are not assumed to be ground-contact rated. Price, stock, freight and tax must be confirmed before checkout.','calc-note');panel.append(disclaimer);
 old.replaceWith(panel);wrap.insertBefore(heading,panel);
 const style=node('style');style.textContent='.lumber-selector{padding:20px;margin:18px 0 32px;background:#f5f8fc;border:1px solid #cfdce9;border-radius:12px}.lumber-categories,.lumber-actions{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px}.lumber-categories button{padding:12px;border-radius:8px;border:1px solid #a7b9c9;background:white;cursor:pointer;color:#174d81;font-weight:700}.lumber-categories button[aria-pressed=true]{background:#174d81;color:white}.lumber-fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.lumber-field{display:flex;flex-direction:column;gap:6px;font-weight:700}.lumber-field select,.lumber-field input{padding:12px;width:100%;background:white;border:1px solid #abbaca;border-radius:8px}.lumber-output{margin:18px 0 0;background:white;padding:18px;border-radius:8px}.lumber-output h3{margin:0 0 8px}.lumber-actions{margin-top:14px}@media(max-width:750px){.lumber-fields{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:420px){.lumber-fields{grid-template-columns:1fr}}';document.head.append(style);
 let active=groups[0],items=[];
 const params=new URLSearchParams(location.search);
 const setOptions=(s,options)=>{s.replaceChildren();for(const v of options){const o=node('option',v);o.value=v;s.append(o);}};
 const identifier=()=>[active[0],size.value,length.value,treatment.value].join('|');
 const currentItem=()=>items.find(x=>x.name===reference[identifier()]);
 function draw(){
  description.textContent=size.value+' × '+length.value+(active[0]==='Sheet goods'?' ft sheet':' ft')+' — '+treatment.value;
  const item=currentItem(),n=Number(qty.value);
  cost.textContent=item?'Reference: '+currency(Number(item.price))+' each'+(Number.isSafeInteger(n)&&n>0?' · '+currency(Number(item.price)*n)+' subtotal':''):'Exact variant: quote required';
  notice.textContent=item?'Reference price only; not an approved checkout SKU.':'Choose this size to request a quote; no verified price or stock for this exact combination.';
  save.textContent=item?'Add to planning list':'Save quote request';
 }
 function pick(group){
  active=group;categories.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===group[0])));
  setOptions(size,group[1]);setOptions(length,group[2]);setOptions(treatment,group[3]);
  if(group[0]==='Deck surface boards'){size.value='5/4×6';length.value='12';treatment.value='Pressure-treated (rating unverified)';}
  if(group[0]==='Deck joists & framing'){size.value='2×8';length.value='12';treatment.value='Pressure-treated ground-contact';}
  draw();
 }
 for(const group of groups){const b=node('button',group[0]);b.type='button';b.addEventListener('click',()=>pick(group));categories.append(b);}
 [size,length,treatment,qty].forEach(s=>s.addEventListener('change',draw));
 qty.addEventListener('input',draw);
 save.addEventListener('click',()=>{
  const n=Number(qty.value);if(!Number.isSafeInteger(n)||n<1||n>999){qty.reportValidity();return;}
  const item=currentItem(),storageKey=item?'nr-local-material-plan-v1':'nr-lumber-quote-list-v1';
  try{
   let list=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(list))list=[];
   if(item){
    const id='material:'+item.id,existing=list.find(x=>x.id===id);
    if(existing)existing.qty=Math.min(999,existing.qty+n);
    else list.push({id,name:item.name,price:Number(item.price),qty:n,unit:item.unit||'each'});
   }else list.push({name:description.textContent,qty:n,status:'quote-only'});
   localStorage.setItem(storageKey,JSON.stringify(list));
   notice.textContent=item?'Added to materials planning list. Not an order.':'Saved in this browser for a future quote. No price or order was created.';
  }catch{notice.textContent='Browser storage unavailable; please copy the selected dimensions for your quote.';}
 });
 pick(groups.find(g=>g[0]==='Deck surface boards' && /deck/i.test(params.get('type')||''))||groups[0]);
 fetch('/material-price-reference.json').then(r=>{if(!r.ok)throw Error('prices unavailable');return r.json();}).then(j=>{if(j.markupAlreadyIncluded!==true)throw Error('markup status');items=j.items||[];draw();}).catch(()=>{notice.textContent='Reference prices unavailable; all selections are quote-only.';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();