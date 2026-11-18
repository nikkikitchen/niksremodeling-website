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
 if(lead)lead.textContent='Choose any wood products, set a separate quantity for each, and build one combined list. Project measurements are optional.';
 const heading=node('h2','Wood & Lumber — Build Your Material List');
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
 output.append(description,cost,notice,actions);
 const listSection=node('section',undefined,'wood-list');
 const listHeading=node('h3','Your Wood & Lumber List');
 const listIntro=node('p','Add different boards one at a time. Each selection keeps its own size, treatment and quantity.');
 const listRows=node('div');listRows.setAttribute('aria-live','polite');
 const totals=node('p');totals.className='wood-total';
 const clear=node('button','Clear wood list','btn outline');clear.type='button';
 listSection.append(listHeading,listIntro,listRows,totals,clear);
 panel.append(categories,fields,output,listSection);
 const disclaimer=node('p','Select an actual board size and treatment rating. Ground-contact lumber is priced only when its exact rating is verified; ordinary pressure-treated references are not assumed to be ground-contact rated. Price, stock, freight and tax must be confirmed before checkout.','calc-note');panel.append(disclaimer);
 old.replaceWith(panel);wrap.insertBefore(heading,panel);
 const style=node('style');style.textContent='.lumber-selector{padding:20px;margin:18px 0 32px;background:#f5f8fc;border:1px solid #cfdce9;border-radius:12px}.lumber-categories,.lumber-actions{display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px}.lumber-categories button{padding:12px;border-radius:8px;border:1px solid #a7b9c9;background:white;cursor:pointer;color:#174d81;font-weight:700}.lumber-categories button[aria-pressed=true]{background:#174d81;color:white}.lumber-fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.lumber-field{display:flex;flex-direction:column;gap:6px;font-weight:700}.lumber-field select,.lumber-field input{padding:12px;width:100%;background:white;border:1px solid #abbaca;border-radius:8px}.lumber-output{margin:18px 0 0;background:white;padding:18px;border-radius:8px}.lumber-output h3{margin:0 0 8px}.wood-list{margin-top:22px;padding:16px;background:#fff;border:1px solid #d7e3ef;border-radius:9px}.wood-list-row{display:grid;grid-template-columns:minmax(0,1fr) 85px auto auto;align-items:center;gap:10px;border-bottom:1px solid #e3e8ef;padding:10px 0}.wood-list-row input{width:80px;padding:7px}.wood-total{font-weight:700}.wood-list-row button{border:0;text-decoration:underline;background:transparent;cursor:pointer;color:#9e2020}@media(max-width:550px){.wood-list-row{grid-template-columns:minmax(0,1fr) 70px}.wood-list-row button{justify-self:start}}.lumber-actions{margin-top:14px}@media(max-width:750px){.lumber-fields{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:420px){.lumber-fields{grid-template-columns:1fr}}';document.head.append(style);
 let active=groups[0],items=[];
 const params=new URLSearchParams(location.search);
 const setOptions=(s,options)=>{s.replaceChildren();for(const v of options){const o=node('option',v);o.value=v;s.append(o);}};
 const identifier=()=>[active[0],size.value,length.value,treatment.value].join('|');
 const currentItem=()=>items.find(x=>x.name===reference[identifier()]);
 function draw(){
  description.textContent=size.value+' × '+length.value+(active[0]==='Sheet goods'?' ft sheet':' ft')+' — '+treatment.value;
  const calcType=active[0]==='Framing lumber'||active[0]==='Deck joists & framing'?'lumber':'custom';
  const calcProduct=active[0]==='Deck surface boards'?'Decking Boards':active[0]==='Sheet goods'?(size.value.includes('OSB')?'OSB & Sheathing':'Plywood'):active[0]==='Finish boards'?'Specialty Wood':active[0]==='Posts & timbers'?'Pressure Treated Lumber':'Framing Lumber';
  estimator.href='/calculators.html?'+new URLSearchParams({mode:'materials',material:calcType,product:'Lumber — '+calcProduct}).toString();
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

 const woodKey='nr-wood-lumber-list-v1';
 function readWood(){try{const v=JSON.parse(localStorage.getItem(woodKey)||'[]');return Array.isArray(v)?v:[];}catch{return [];}}
 function writeWood(rows){try{localStorage.setItem(woodKey,JSON.stringify(rows));return true;}catch{return false;}}
 function drawWood(){
  const rows=readWood();listRows.replaceChildren();
  if(!rows.length)listRows.append(node('p','Your list is empty. Choose a board above and add it.'));
  let subtotal=0,quoted=0;
  rows.forEach((row,i)=>{
   const line=node('div',undefined,'wood-list-row');
   const name=node('span',row.name),count=node('input'),price=node('span',row.price===null?'Quote required':currency(row.price*row.qty));
   if(row.price===null)quoted++;else subtotal+=row.price*row.qty;
   count.type='number';count.min='1';count.max='999';count.step='1';count.value=String(row.qty);count.setAttribute('aria-label','Quantity for '+row.name);
   count.addEventListener('change',()=>{
    const n=Number(count.value);if(!Number.isSafeInteger(n)||n<1||n>999){count.value=String(row.qty);return;}
    const updated=readWood();if(updated[i])updated[i].qty=n;if(writeWood(updated))drawWood();
   });
   const remove=node('button','Remove');remove.type='button';remove.addEventListener('click',()=>{const updated=readWood();updated.splice(i,1);if(writeWood(updated))drawWood();});
   line.append(name,count,price,remove);listRows.append(line);
  });
  totals.textContent='Priced reference subtotal: '+currency(subtotal)+(quoted?' · '+quoted+' item type(s) still need a quote':'')+'. Freight and taxes not included.';
 }
 clear.addEventListener('click',()=>{if(writeWood([]))drawWood();});
 save.addEventListener('click',()=>{
  const n=Number(qty.value);if(!Number.isSafeInteger(n)||n<1||n>999){qty.reportValidity();return;}
  const item=currentItem(),id=identifier(),rows=readWood(),existing=rows.find(r=>r.id===id);
  if(existing)existing.qty=Math.min(999,existing.qty+n);
  else rows.push({id,name:description.textContent,qty:n,price:item&&Number.isFinite(Number(item.price))?Number(item.price):null,referenceId:item?item.id:null});
  if(writeWood(rows)){drawWood();notice.textContent='Added '+n+' pieces to your wood list. Keep choosing other sizes below.';}
  else notice.textContent='Could not save your list in this browser.';
 });
 drawWood();
 pick(groups.find(g=>g[0]==='Deck surface boards' && /deck/i.test(params.get('type')||''))||groups[0]);
 fetch('/material-price-reference.json').then(r=>{if(!r.ok)throw Error('prices unavailable');return r.json();}).then(j=>{if(j.markupAlreadyIncluded!==true)throw Error('markup status');items=j.items||[];draw();}).catch(()=>{notice.textContent='Reference prices unavailable; all selections are quote-only.';});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();