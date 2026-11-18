(() => {
'use strict';
// Shop exact material choices here. Project quantity takeoffs stay in Projects.
const groups=[
 {name:'Interior framing lumber',desc:'Untreated dimensional lumber for interior framing.',sizes:['2×4','2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Untreated'],grades:['Standard / construction','Premium / select']},
 {name:'Pressure-treated & exterior framing',desc:'Choose the actual treatment rating required for the job.',sizes:['2×4','2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Posts & timbers',desc:'Exterior posts and larger framing. Treatment rating is not interchangeable.',sizes:['4×4','4×6','6×6'],lengths:['8','12','16'],kinds:['Untreated','Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Deck surface boards',desc:'Choose your exact deck board dimensions and type.',sizes:['5/4×6','2×6','2×8'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact','Cedar'],grades:['Standard grade','Premium grade']},
 {name:'Deck joists & framing',desc:'Structural deck framing with separately verified treatment requirements.',sizes:['2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Interior & finish boards',desc:'Appearance boards for indoor trim, shelving and finish work.',sizes:['1×2','1×4','1×6','1×8','1×10','1×12'],lengths:['8','12','16'],kinds:['Pine','Primed pine'],grades:['Common / utility','Select / premium']},
 {name:'Plywood & OSB',desc:'Sheet goods: choose exact thickness and sheet dimensions; grades are inherent in the named product.',sizes:['7/16-in OSB','15/32-in OSB','1/2-in plywood','3/4-in ACX plywood','3/4-in treated plywood'],lengths:['4×8','4×10'],kinds:['Standard','Exterior / treated'],grades:null}
];
const reference={
 'Interior framing lumber|2×4|8|Untreated|Standard / construction':'2x4x8 Stud Lumber (Standard)',
 'Interior & finish boards|1×4|8|Pine|Select / premium':'1x4x8 Select Pine Board',
 'Plywood & OSB|15/32-in OSB|4×8|Standard|':'4x8 Sheet of 15/32-in OSB Sheathing',
 'Plywood & OSB|3/4-in ACX plywood|4×8|Standard|':'4x8 Sheet of 3/4-in ACX Plywood'
};
const key='nr-wood-lumber-list-v2';
const element=(tag,label,cls)=>{const e=document.createElement(tag);if(label!==undefined)e.textContent=label;if(cls)e.className=cls;return e;};
const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const validQty=n=>Number.isSafeInteger(n)&&n>=1&&n<=999;
function boot(){
 if(!/^\/material-lumber(?:\.html)?\/?$/.test(location.pathname))return;
 const old=document.querySelector('.material-detail-grid');if(!old)return;
 const parent=old.parentElement;
 const lead=parent.querySelector('.lead');
 if(lead)lead.textContent='Choose a board, length, grade, treatment and number of pieces. Everything is shown below. Project measurements and material takeoffs belong under Projects.';
 const heading=element('h2','Wood & Lumber Catalog');
 const catalog=element('section',undefined,'lumber-selector');
 const menu=element('nav',undefined,'wood-jump-links');
 menu.setAttribute('aria-label','Lumber sections');
 const descriptions=element('p','Shop wood directly—no generic calculator. We offer standard and premium grades where appropriate instead of a confusing middle grade.','calc-note');
 catalog.append(descriptions,menu);
 const references=new Map();
 const updateRows=[];
 const itemId=(g,size,length,kind,grade)=>[g,size,length,kind,grade||''].join('|');
 const getPrice=id=>{
  const name=reference[id];const entry=name&&references.get(name);
  return entry&&Number.isFinite(Number(entry.price))&&Number(entry.price)>0?Number(entry.price):null;
 };
 const read=()=>{try{const rows=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.id==='string'&&validQty(Number(r.qty))):[];}catch{return[];}};
 const write=rows=>{try{localStorage.setItem(key,JSON.stringify(rows));return true;}catch{return false;}};
 const list=element('section',undefined,'wood-list');
 list.id='wood-list';
 list.append(element('h3','Your Wood & Lumber List'),element('p','Add different sizes and quantities. Each exact choice stays separate. Unverified choices remain quote requests—not zero-dollar items.'));
 const listing=element('div');listing.setAttribute('aria-live','polite');list.append(listing);
 const total=element('p',undefined,'wood-total');list.append(total);
 const listActions=element('div',undefined,'wood-actions');
 const clear=element('button','Clear list','btn outline');clear.type='button';
 const message=element('a','Text your lumber list for a quote','btn outline');
 listActions.append(clear,message);list.append(listActions);
 function drawList(){
  const rows=read();listing.replaceChildren();let subtotal=0,unpriced=0;
  if(!rows.length)listing.append(element('p','No boards added yet. Use the rows above to start your list.'));
  for(const row of rows){
   const line=element('div',undefined,'wood-list-row');
   line.append(element('span',row.name));
   const qty=element('input');qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.value=String(row.qty);
   qty.setAttribute('aria-label','Quantity for '+row.name);
   qty.addEventListener('change',()=>{
    const n=Number(qty.value);if(!validQty(n)){qty.value=String(row.qty);return;}
    const next=read(),target=next.find(r=>r.id===row.id);if(target){target.qty=n;if(write(next))drawList();}
   });
   const unit=getPrice(row.id);
   if(unit===null)unpriced++;else subtotal+=unit*row.qty;
   const price=element('span',unit===null?'Quote required':currency(unit*row.qty),'wood-list-price');
   const remove=element('button','Remove');remove.type='button';
   remove.addEventListener('click',()=>{if(write(read().filter(r=>r.id!==row.id)))drawList();});
   line.append(qty,price,remove);listing.append(line);
  }
  total.textContent='Priced reference subtotal: '+currency(subtotal)+(unpriced?' · '+unpriced+' item type(s) require a quote':'')+'. Shipping and tax not included.';
  message.href='sms:6782314377?body='+encodeURIComponent('Wood and lumber quote request:\n'+(rows.map(r=>r.qty+' × '+r.name).join('\n')||'Please help me select materials.'));
 }
 clear.addEventListener('click',()=>{if(write([]))drawList();});
 function select(options,label){
  const s=element('select');s.setAttribute('aria-label',label);
  for(const value of options){const op=element('option',value);op.value=value;s.append(op);}return s;
 }
 function field(label,control){
  const l=element('label',undefined,'wood-field');l.append(element('span',label),control);return l;
 }
 function product(group,size){
  const row=element('article',undefined,'wood-product-row');
  row.dataset.size=size;row.dataset.group=group.name;
  row.append(element('strong',size,'wood-dimension'));
  const length=select(group.lengths,'Length or sheet size for '+size);
  const kind=select(group.kinds,'Treatment or material for '+size);
  const grade=group.grades?select(group.grades,'Grade for '+size):null;
  const qty=element('input');qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.inputMode='numeric';qty.value='1';
  qty.setAttribute('aria-label','Pieces for '+size);
  const price=element('div',undefined,'wood-price');
  const amount=element('strong');
  const note=element('small');
  price.append(amount,note);
  const button=element('button','Add to list','btn primary');button.type='button';
  const status=element('span',undefined,'wood-status');status.setAttribute('role','status');
  const currentId=()=>itemId(group.name,size,length.value,kind.value,grade?.value||'');
  const currentName=()=>size+' × '+length.value+(group.name==='Plywood & OSB'?' ft sheet':' ft')+' — '+kind.value+(grade?' — '+grade.value:'');
  const draw=()=>{
   const number=Number(qty.value),unit=getPrice(currentId());
   button.disabled=!validQty(number);
   amount.textContent=!validQty(number)?'Enter 1–999 pieces':unit===null?'Quote required':currency(unit*number)+' subtotal';
   note.textContent=unit===null?'Exact grade, size and treatment need pricing':currency(unit)+' each · planning reference';
   status.textContent='';
  };
  row.append(field(group.name==='Plywood & OSB'?'Sheet size':'Length (ft)',length),field('Type / treatment',kind));
  if(grade)row.append(field('Grade',grade));
  row.append(field('Pieces',qty),price,button,status);
  for(const input of [length,kind,grade,qty].filter(Boolean)){
   input.addEventListener('change',draw);input.addEventListener('input',draw);
  }
  button.addEventListener('click',()=>{
   const n=Number(qty.value);if(!validQty(n)){qty.reportValidity();return;}
   const id=currentId(),rows=read(),existing=rows.find(r=>r.id===id);
   if(existing)existing.qty=Math.min(999,existing.qty+n);
   else rows.push({id,name:currentName(),qty:n});
   if(write(rows)){drawList();status.textContent='Added '+n+' piece(s) to your lumber list.';}
   else status.textContent='Could not save in this browser.';
  });
  updateRows.push(draw);draw();
  return row;
 }
 for(const group of groups){
  const section=element('section',undefined,'wood-family');
  section.id='wood-'+group.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const link=element('a',group.name);link.href='#'+section.id;menu.append(link);
  section.append(element('h3',group.name),element('p',group.desc,'wood-family-note'));
  const rows=element('div',undefined,'wood-family-rows');
  for(const size of group.sizes)rows.append(product(group,size));
  section.append(rows);catalog.append(section);
 }
 catalog.append(list);
 catalog.append(element('p','All shown prices are planning references only and already include the established materials markup where listed. Prices do not prove stock, grade, treatment rating or availability; do not charge until a supplier item is verified.','calc-note'));
 const project=element('p',undefined,'wood-project-cta');
 const projectLink=element('a','Calculate a project material takeoff');projectLink.href='/#projects';
 project.append('Need the website to estimate how many boards to buy? ',projectLink,'. The deck calculator stays under Projects.');
 catalog.prepend(project);
 old.replaceWith(catalog);parent.insertBefore(heading,catalog);
 const style=element('style');
 style.textContent='.lumber-selector{margin:18px 0 32px}.wood-jump-links{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.wood-jump-links a{display:inline-block;background:#eef5fd;border:1px solid #c8d8e8;border-radius:6px;padding:8px 10px}.wood-family,.wood-list{margin:16px 0;padding:16px;border:1px solid #cbd9e8;border-radius:10px;background:#fff}.wood-family h3{margin:0 0 6px;color:#164879}.wood-family-note{margin:0 0 15px;color:#576474}.wood-family-rows{display:grid;gap:9px}.wood-product-row{display:grid;grid-template-columns:70px minmax(75px,.7fr) minmax(150px,1.5fr) minmax(125px,1.25fr) 75px minmax(125px,1.2fr) auto;gap:9px;align-items:end;padding:12px;border-radius:8px;background:#f5f8fc;border:1px solid #e1e7ee}.wood-product-row:not(:has(.wood-field:nth-of-type(4))){grid-template-columns:70px minmax(75px,.7fr) minmax(150px,1.5fr) 75px minmax(125px,1.2fr) auto}.wood-dimension{align-self:center}.wood-field{display:flex;flex-direction:column;gap:5px;font-weight:650;font-size:13px}.wood-field select,.wood-field input{width:100%;min-width:0;border:1px solid #aabaca;border-radius:6px;padding:10px;background:white}.wood-price{align-self:center}.wood-price strong,.wood-price small{display:block}.wood-price small{color:#596575}.wood-product-row button{margin:0}.wood-status{grid-column:1/-1;color:#237647;font-size:13px}.wood-status:empty{display:none}.wood-list{background:#f6f9fd}.wood-list-row{display:grid;grid-template-columns:minmax(0,1fr) 80px 135px auto;align-items:center;gap:10px;border-bottom:1px solid #dce3ea;padding:11px 0}.wood-list-row input{width:75px;padding:8px}.wood-list-row button{border:0;background:transparent;color:#9b2828;text-decoration:underline;cursor:pointer}.wood-total{font-weight:700}.wood-actions{display:flex;gap:12px;flex-wrap:wrap}@media(max-width:1000px){.wood-product-row,.wood-product-row:not(:has(.wood-field:nth-of-type(4))){grid-template-columns:repeat(3,minmax(0,1fr))}.wood-dimension{grid-column:1/-1}.wood-product-row button{align-self:center}}@media(max-width:600px){.wood-family{padding:10px}.wood-product-row,.wood-product-row:not(:has(.wood-field:nth-of-type(4))){grid-template-columns:repeat(2,minmax(0,1fr))}.wood-dimension{grid-column:1/-1}.wood-product-row button{min-width:0}.wood-list-row{grid-template-columns:minmax(0,1fr) 75px}.wood-list-price{grid-column:1}.wood-list-row button{justify-self:start}}';
 document.head.append(style);drawList();
 if(typeof fetch==='function')fetch('/material-price-reference.json').then(r=>{if(!r.ok)throw Error('Unavailable');return r.json();}).then(data=>{
  if(data.markupAlreadyIncluded!==true||!Array.isArray(data.items))throw Error('Unapproved reference');
  for(const entry of data.items)references.set(entry.name,entry);
  for(const draw of updateRows)draw();drawList();
 }).catch(()=>{for(const draw of updateRows)draw();drawList();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();