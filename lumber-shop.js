(() => {
'use strict';
// Shop exact material choices here. Project quantity takeoffs stay in Projects.
const groups=[
 // A single deck order includes posts, joists and surface boards; these are shopping
 // choices only, NOT an engineered deck design or an automatic material takeoff.
 {name:'Deck project lumber',desc:'Posts, joists, framing and deck boards together. Pick one size, add its quantity, then choose the next without changing departments.',sizes:['4×4','6×6','2×4','2×6','2×8','2×10','2×12','5/4×6'],lengths:['8','10','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact','Untreated','Cedar'],grades:['Standard / #2','Premium / #1']},
 {name:'Interior framing lumber',desc:'Untreated dimensional lumber for interior framing.',sizes:['2×4','2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Untreated'],grades:['Standard / construction','Premium / select']},
 {name:'Pressure-treated & exterior framing',desc:'Choose the actual treatment rating required for the job.',sizes:['2×4','2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Posts & timbers',desc:'Exterior posts and larger framing. Treatment rating is not interchangeable.',sizes:['4×4','4×6','6×6'],lengths:['8','12','16'],kinds:['Untreated','Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Deck surface boards',desc:'Choose your exact deck board dimensions and type.',sizes:['5/4×6','2×6','2×8'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact','Cedar'],grades:['Standard grade','Premium grade']},
 {name:'Deck joists & framing',desc:'Structural deck framing with separately verified treatment requirements.',sizes:['2×6','2×8','2×10','2×12'],lengths:['8','12','16'],kinds:['Pressure-treated above-ground','Pressure-treated ground-contact'],grades:['Standard / #2','Premium / #1']},
 {name:'Interior & finish boards',desc:'Appearance boards for indoor trim, shelving and finish work.',sizes:['1×2','1×4','1×6','1×8','1×10','1×12'],lengths:['8','12','16'],kinds:['Pine','Primed pine'],grades:['Common / utility','Select / premium']},
 {name:'Plywood & OSB',desc:'Sheet goods: choose exact thickness and sheet dimensions; grades are inherent in the named product.',sizes:['7/16-in OSB','15/32-in OSB','1/2-in plywood','3/4-in ACX plywood','3/4-in treated plywood'],lengths:['4×8','4×10'],kinds:['Standard','Exterior / treated'],grades:null,unit:'sheets'},
 {name:'Wall planks & shiplap',desc:'Wood plank, tongue-and-groove, and shiplap wall coverings. Confirm profile and actual coverage before ordering.',sizes:['1×6 shiplap plank','5.25-in nickel-gap plank','1×6 tongue-and-groove','1×8 tongue-and-groove'],lengths:['8','12','16'],kinds:['Pine','Primed pine','Cedar'],grades:['Common / utility','Select / premium']},
 {name:'Wood paneling & fiberboard',desc:'Wood-based wall and utility panels. Check surface treatment and approved application.',sizes:['1/4-in beadboard panel','3/8-in beadboard panel','1/4-in hardboard panel','3/4-in MDF panel'],lengths:['4×8'],kinds:['Unfinished','Primed'],grades:null,unit:'sheets'},
 {name:'Wood trim & molding',desc:'Select the profile and length. Exact shape, wood species, and finish will be confirmed before purchase.',sizes:['3.25-in baseboard','5.25-in baseboard','2.25-in door casing','3.625-in crown molding','2.5-in chair rail','3/4-in shoe molding','3/4-in quarter round'],lengths:['8','12','16'],kinds:['Unfinished pine','Primed pine','Primed MDF'],grades:['Standard','Premium']},
 {name:'Wood shims',desc:'Wood shims are bought by the pack; the number of shims in each pack is confirmed with the supplier.',sizes:['8-in wood shims','12-in wood shims'],lengths:['Pack (count to confirm)'],kinds:['Pine','Cedar'],grades:null,unit:'packs'}
];
const reference={
 'Interior framing lumber|2×4|8|Untreated|Standard / construction':'2x4x8 Stud Lumber (Standard)',
 'Interior & finish boards|1×4|8|Pine|Select / premium':'1x4x8 Select Pine Board',
 'Plywood & OSB|15/32-in OSB|4×8|Standard|':'4x8 Sheet of 15/32-in OSB Sheathing',
 'Plywood & OSB|3/4-in ACX plywood|4×8|Standard|':'4x8 Sheet of 3/4-in ACX Plywood'
};

const key='nr-wood-lumber-list-v2';
const E=(tag,txt,cls)=>{const el=document.createElement(tag);if(txt!==undefined)el.textContent=txt;if(cls)el.className=cls;return el};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const safeQty=n=>Number.isSafeInteger(n)&&n>=1&&n<=999;
function boot(){
 if(!/^\/material-(wood|lumber)(?:\.html)?\/?$/.test(location.pathname))return;
 const old=document.querySelector('.material-detail-grid');if(!old)return;
 const parent=old.parentElement,lead=parent.querySelector('.lead');
 if(lead)lead.textContent='Tap one item, choose its details, add it to the cart, and keep shopping here. No typing needed.';
 const prices=new Map();
 const id=(g,s,l,k,grade)=>[g.name,s,l,k,grade||''].join('|');
 const unitPrice=k=>{const p=prices.get(reference[k]);return p&&Number(p.price)>0?Number(p.price):null};
 const read=()=>{try{if(typeof window.getCart==='function')return window.getCart();const c=JSON.parse(localStorage.getItem('nr-cart')||'[]');return Array.isArray(c)?c:[]}catch{return[]}};
 const save=cart=>{try{if(typeof window.saveCart==='function')window.saveCart(cart);else{localStorage.setItem('nr-cart',JSON.stringify(cart));localStorage.setItem('nr-cart-updated-at',String(Date.now()));if(typeof window.updateCartCount==='function')window.updateCartCount()}return true}catch{return false}};
 const item=(g,s,l,k,grade,qty)=>{
  const woodKey=id(g,s,l,k,grade),p=unitPrice(woodKey);
  return {source:'wood-lumber-reference',type:'Material estimate',name:g.name+': '+s+(g.unit==='sheets'?' — '+l+' sheet':g.unit==='packs'?' — '+l:' × '+l+' ft')+' — '+k+(grade?' — '+grade:''),woodKey,qty,price:null,pricingPending:true,quoteRequired:true,referenceOnly:p!==null,referenceSubtotal:p===null?null:Math.round(p*qty*100)/100,shippingAndTaxNotIncluded:true};
 };
 const root=E('section',undefined,'lumber-selector');
 root.setAttribute('aria-label','Wood and lumber shopping');
 const quick=E('nav',undefined,'wood-quick-nav');
 quick.setAttribute('aria-label','Quick material selections');
 const shortcuts=[['Deck lumber','Deck project lumber'],['Framing','Interior framing lumber'],['Sheet goods','Plywood & OSB'],['Trim & boards','Wood trim & molding']];
 const label=E('label','More wood categories','wood-category-label');
 const category=E('select',undefined,'wood-category-select');category.setAttribute('aria-label','Choose wood category');
 for(const g of groups){const opt=E('option',g.name);opt.value=g.name;category.append(opt)}
 label.append(category);
 const picker=E('section',undefined,'wood-picker');
 const intro=E('p','Choose one size, length, treatment and quantity. Add it, then choose another size right here. All selections stay together in one cart.','wood-intro');
 const groupDesc=E('p',undefined,'wood-group-info');
 const dims=E('div',undefined,'wood-chip-grid wood-size-choices');
 const lens=E('div',undefined,'wood-chip-grid wood-length-choices');
 const kinds=E('div',undefined,'wood-chip-grid wood-kind-choices');
 const grades=E('div',undefined,'wood-chip-grid wood-grade-choices');
 const sizeTitle=E('h3','1. Item size');
 const lenTitle=E('h3','2. Length');
 const kindTitle=E('h3','3. Type');
 const gradeTitle=E('h3','4. Grade');
 const qtyTitle=E('h3','Quantity');
 const qtyBar=E('div',undefined,'wood-stepper');
 const minus=E('button','−','wood-step-btn wood-qty-minus');
 const plus=E('button','+','wood-step-btn wood-qty-plus');
 const ten=E('button','+10','wood-step-btn wood-qty-ten');
 for(const b of [minus,plus,ten])b.type='button';
 minus.setAttribute('aria-label','Decrease quantity');plus.setAttribute('aria-label','Increase quantity');ten.setAttribute('aria-label','Increase quantity by ten');
 const qtyView=E('output','1','wood-qty-value');qtyView.setAttribute('aria-live','polite');qtyBar.append(minus,qtyView,plus,ten);
 const priceView=E('p',undefined,'wood-price');
 const add=E('button','Add to Cart','btn primary wood-add');add.type='button';
 const status=E('p','','wood-status');status.setAttribute('role','status');
 picker.append(intro,groupDesc,sizeTitle,dims,lenTitle,lens,kindTitle,kinds,gradeTitle,grades,qtyTitle,qtyBar,priceView,add,status);
 const basket=E('section',undefined,'wood-list');basket.id='wood-list';
 const basketItems=E('div',undefined,'wood-cart-lines');basketItems.setAttribute('aria-live','polite');
 const summary=E('p',undefined,'wood-total');
 const basketActions=E('div',undefined,'wood-actions');
 const keep=E('button','Keep Shopping','btn outline');keep.type='button';
 keep.addEventListener('click',()=>category.focus());
 const review=E('a','Review Cart','btn outline');review.href='/project-cart.html';
 basketActions.append(keep,review);
 basket.append(E('h3','Your Cart'),basketItems,summary,basketActions);
 const footer=E('div',undefined,'wood-cart-bar');
 const footerLabel=E('strong','0 items in cart');const footerLink=E('a','Review Cart','btn primary');footerLink.href='/project-cart.html';
 footer.append(footerLabel,footerLink);
 const project=E('p',undefined,'wood-project-cta');
 const projectLink=E('a','Projects calculator');projectLink.href='/#projects';
 project.append('Need to calculate the boards for a project? Use the ',projectLink,' instead.');
 root.append(E('h2','Wood & Lumber'),quick,label,picker,basket,project,footer);
 const chosen={size:null,length:null,kind:null,grade:null,qty:1};
 const group=()=>groups.find(g=>g.name===category.value)||groups[0];
 for(const [title,value] of shortcuts){
  const button=E('button',title,'wood-quick-button');button.type='button';button.dataset.group=value;
  button.addEventListener('click',()=>{
   category.value=value;chosen.size=null;chosen.length=null;chosen.kind=null;chosen.grade=null;chosen.qty=1;
   status.textContent='';draw();
  });
  quick.append(button);
 }
 const availableKinds=g=>g.name!=='Deck project lumber'?g.kinds:chosen.size==='5/4×6'?
  ['Pressure-treated above-ground','Pressure-treated ground-contact','Cedar']:
  ['Pressure-treated above-ground','Pressure-treated ground-contact','Untreated'];
 const availableGrades=g=>g.name==='Deck project lumber'&&chosen.size==='5/4×6'?
  ['Standard grade','Premium grade']:g.grades;
 const chips=(target,options,current,attr,change)=>{
  target.replaceChildren();
  for(const value of options){
   const b=E('button',value,'wood-choice '+attr);b.type='button';b.dataset.value=value;
   if(attr==='wood-size-choice')b.dataset.size=value;
   b.setAttribute('aria-pressed',String(value===current));
   if(value===current)b.classList.add('selected');
   b.addEventListener('click',()=>{change(value);draw()});target.append(b);
  }
 };
 function draw(){
  const g=group();
  if(!g.sizes.includes(chosen.size))chosen.size=g.sizes[0];
  if(!g.lengths.includes(chosen.length))chosen.length=g.lengths[0];
  const kindsForSize=availableKinds(g),gradesForSize=availableGrades(g);
  if(!kindsForSize.includes(chosen.kind))chosen.kind=kindsForSize[0];
  if(!gradesForSize||!gradesForSize.includes(chosen.grade))chosen.grade=gradesForSize?.[0]||null;
  groupDesc.textContent=g.desc;
  chips(dims,g.sizes,chosen.size,'wood-size-choice',v=>chosen.size=v);
  chips(lens,g.lengths,chosen.length,'wood-length-choice',v=>chosen.length=v);
  chips(kinds,kindsForSize,chosen.kind,'wood-kind-choice',v=>chosen.kind=v);
  kindTitle.textContent='3. Treatment / material';
  kindTitle.hidden=kindsForSize.length<2;kinds.hidden=kindsForSize.length<2;
  if(gradesForSize){chips(grades,gradesForSize,chosen.grade,'wood-grade-choice',v=>chosen.grade=v);gradeTitle.hidden=false;grades.hidden=false}
  else{grades.replaceChildren();gradeTitle.hidden=true;grades.hidden=true}
  lenTitle.textContent=g.unit==='sheets'?'2. Sheet size':g.unit==='packs'?'2. Package size':'2. Length';
  qtyView.textContent=String(chosen.qty);
  minus.disabled=chosen.qty<=1;plus.disabled=chosen.qty>=999;ten.disabled=chosen.qty>989;
  for(const button of quick.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.group===g.name));
  const p=unitPrice(id(g,chosen.size,chosen.length,chosen.kind,chosen.grade));
  priceView.textContent=p===null?'Price to confirm':money(p*chosen.qty)+' planning estimate';
  priceView.append(E('small','Final supplier price and stock will be verified before payment.'));
  add.textContent='Add '+chosen.qty+' to Cart';
 }
 function renderCart(){
  const cart=read(),wood=cart.filter(x=>x.source==='wood-lumber-reference');basketItems.replaceChildren();
  if(!wood.length)basketItems.append(E('p','No wood items yet. Add your first item above.'));
  let known=0,pending=0;
  for(const entry of wood){
   const line=E('div',undefined,'wood-cart-line');
   const title=E('span',entry.name,'wood-cart-name');
   const counter=E('div',undefined,'wood-cart-counter');
   const less=E('button','−'),more=E('button','+'),remove=E('button','Remove','wood-cart-remove');
   for(const b of [less,more,remove])b.type='button';
   less.setAttribute('aria-label','Remove one '+entry.name);
   more.setAttribute('aria-label','Add one '+entry.name);
   less.disabled=Number(entry.qty)<=1;more.disabled=Number(entry.qty)>=999;
   const adjust=next=>{
    const fresh=read(),idx=fresh.findIndex(x=>x.source==='wood-lumber-reference'&&x.woodKey===entry.woodKey);
    if(idx<0)return;
    if(next===0)fresh.splice(idx,1);
    else if(safeQty(next)){fresh[idx].qty=next;const p=unitPrice(entry.woodKey);fresh[idx].referenceSubtotal=p===null?null:Math.round(p*next*100)/100;fresh[idx].referenceOnly=p!==null}
    else return;
    if(save(fresh))renderCart();
   };
   less.addEventListener('click',()=>adjust(Number(entry.qty)-1));
   more.addEventListener('click',()=>adjust(Number(entry.qty)+1));
   remove.addEventListener('click',()=>adjust(0));
   counter.append(less,E('strong',String(entry.qty)),more,remove);
   const p=unitPrice(entry.woodKey);
   const display=E('small',p===null?'Price to confirm':money(p*Number(entry.qty))+' planning estimate');
   if(p===null)pending++;else known+=p*Number(entry.qty);
   line.append(title,counter,display);basketItems.append(line);
  }
  summary.textContent=wood.length+' wood item type(s) saved'+(known?' · '+money(known)+' planning estimate':'')+(pending?' · '+pending+' awaiting pricing':'');
  const total=cart.filter(x=>!x.hiddenFromCustomer).reduce((n,x)=>n+(Number(x.qty)||1),0);
  footerLabel.textContent=total+' item'+(total===1?'':'s')+' in cart';
 }
 function adjust(change){chosen.qty=Math.max(1,Math.min(999,chosen.qty+change));draw()}
 minus.addEventListener('click',()=>adjust(-1));plus.addEventListener('click',()=>adjust(1));ten.addEventListener('click',()=>adjust(10));
 category.addEventListener('change',()=>{chosen.size=null;chosen.length=null;chosen.kind=null;chosen.grade=null;chosen.qty=1;status.textContent='';draw()});
 add.addEventListener('click',()=>{
  const g=group(),entry=item(g,chosen.size,chosen.length,chosen.kind,chosen.grade,chosen.qty),cart=read();
  const current=cart.find(x=>x.source==='wood-lumber-reference'&&x.woodKey===entry.woodKey);
  if(current){
   if(Number(current.qty)+chosen.qty>999){status.textContent='Maximum 999 pieces of this selection.';return}
   const nextQty=Number(current.qty)+chosen.qty;
   Object.assign(current,entry,{qty:nextQty,referenceSubtotal:entry.referenceSubtotal===null?null:Math.round(entry.referenceSubtotal*nextQty/chosen.qty*100)/100});
  }else cart.push(entry);
  if(!save(cart)){status.textContent='Could not save to your cart. Please try again.';return}
  status.textContent='Added '+chosen.qty+' to your cart. Stay here and choose another item.';
  chosen.qty=1;draw();renderCart();
 });
 const selectHash=()=>{
  const aliases={'#deck-lumber':'Deck project lumber','#wood-wood-trim-molding':'Wood trim & molding'};
  const match=groups.find(g=>g.name===aliases[location.hash]||'#wood-'+g.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')===location.hash);
  if(match&&category.value!==match.name){category.value=match.name;chosen.size=null;chosen.length=null;chosen.kind=null;chosen.grade=null;draw()}
 };
 const style=E('style');style.textContent=".wood-quick-nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:15px 0}.wood-quick-button{min-height:56px;padding:10px 8px;border:2px solid #b9cde0;border-radius:10px;background:#fff;color:#164879;font:inherit;font-weight:750;cursor:pointer}.wood-quick-button[aria-pressed=true]{background:#164879;color:white;border-color:#164879}.wood-quick-button:focus-visible{outline:3px solid #bd2933;outline-offset:2px}@media(max-width:600px){.wood-quick-nav{grid-template-columns:repeat(2,minmax(0,1fr))}}" + ".lumber-selector{max-width:780px;margin:18px auto 32px}.wood-picker,.wood-list{margin:14px 0;padding:16px;border:1px solid #c3d6e8;border-radius:14px;background:#fff}.wood-picker h3{font-size:1rem;margin:18px 0 9px;color:#164879}.wood-category-label{display:block;font-weight:750;margin:18px 0}.wood-category-select{width:100%;min-height:55px;border:2px solid #9bb6d0;border-radius:10px;padding:12px;font:inherit;color:#153d66;background:#fff}.wood-chip-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:9px}.wood-choice{min-height:52px;border:2px solid #c6d6e5;border-radius:10px;padding:9px;background:#f4f8fc;color:#164879;font:inherit;font-weight:700;cursor:pointer}.wood-choice.selected{background:#164879;border-color:#164879;color:#fff}.wood-choice:focus-visible,.wood-category-select:focus-visible,.wood-step-btn:focus-visible{outline:3px solid #bd2933;outline-offset:2px}.wood-group-info,.wood-intro{color:#52677b}.wood-stepper{display:flex;align-items:center;gap:10px}.wood-step-btn{height:54px;min-width:54px;border:2px solid #164879;border-radius:10px;background:white;color:#164879;font-size:1.35rem;font-weight:800}.wood-step-btn:disabled{opacity:.35}.wood-qty-value{font-size:1.5rem;min-width:60px;text-align:center;font-weight:800}.wood-price{font-size:1.08rem;font-weight:800;margin:18px 0}.wood-price small{display:block;font-size:.78rem;color:#667382;font-weight:400}.wood-add{width:100%;min-height:56px;font-size:1.1rem}.wood-status{min-height:24px;color:#237647;font-weight:700}.wood-cart-line{padding:12px 0;border-bottom:1px solid #dfe7ef;display:grid;gap:8px}.wood-cart-name{font-weight:650;overflow-wrap:anywhere}.wood-cart-counter{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.wood-cart-counter button{min-height:38px;min-width:38px;border:1px solid #aabdd1;border-radius:7px;background:white;color:#164879;font-size:1rem}.wood-cart-counter .wood-cart-remove{border:0;color:#a52c34;text-decoration:underline;font-size:.85rem}.wood-total{font-size:.92rem;color:#52677b}.wood-actions{display:flex;gap:10px;flex-wrap:wrap}.wood-cart-bar{position:sticky;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px;background:#edf5ff;border:1px solid #bfd2e5;border-radius:10px;z-index:8}.wood-cart-bar .btn{white-space:nowrap}@media(max-width:600px){.lumber-selector{padding:0 4px}.wood-picker,.wood-list{padding:12px}.wood-chip-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.wood-cart-bar{bottom:0}.wood-actions>*{flex:1}}";
 old.replaceWith(root);parent.insertBefore(style,root);
 selectHash();draw();renderCart();
 window.addEventListener('hashchange',selectHash);
 if(typeof fetch==='function')fetch('/material-price-reference.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Not available');return r.json()}).then(data=>{
  if(data.markupAlreadyIncluded!==true||!Array.isArray(data.items))throw Error('Not approved');
  for(const entry of data.items)prices.set(entry.name,entry);
  const cart=read();let dirty=false;
  for(const entry of cart)if(entry.source==='wood-lumber-reference'){
   const p=unitPrice(entry.woodKey),sub=p===null?null:Math.round(p*(Number(entry.qty)||1)*100)/100;
   if(entry.referenceSubtotal!==sub||entry.referenceOnly!==(p!==null)){entry.referenceSubtotal=sub;entry.referenceOnly=p!==null;entry.price=null;entry.quoteRequired=true;dirty=true}
  }
  if(dirty)save(cart);
  draw();renderCart();
 }).catch(()=>{draw();renderCart()});
}
if(document.readyState==='complete')boot();
else document.addEventListener('DOMContentLoaded',boot,{once:true});
})();
