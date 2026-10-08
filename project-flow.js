/* Shared shopping, labor and measurement entry points. Prices come only from the catalog. */
(() => {
  const key = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const money = n => n.toLocaleString('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0});
  const el = (tag, text, cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const tasks = () => (window.LABOR_CATALOG || []).flatMap(category=>category.groups.flatMap(group=>Object.entries(group.actions).flatMap(([mode,list])=>list.map(task=>({...task,mode,groupId:group.id,fixture:group.label,categoryId:category.id})))));
  const rules = [
    [/dishwasher/i,'appliance-dishwasher'],[/disposal/i,'appliance-disposal'],[/cooktop/i,'appliance-cooktop'],[/wall oven|\boven\b/i,'appliance-oven'],[/microwave/i,'appliance-microwave'],[/range hood|\bhood\b/i,'appliance-hood'],[/range|stove/i,'appliance-range'],[/refrigerator|fridge/i,'appliance-fridge'],[/washer.*dryer|laundry set/i,'appliance-laundry'],
    [/toilet(?! supply| seat)/i,'toilet'],[/faucet/i,'faucet'],[/vanit/i,'vanity'],[/\bsink\b/i,'sink'],[/bathtub|\btub\b/i,'tub'],[/shower glass|shower door/i,'glass'],[/shower/i,'shower'],[/exhaust fan|vent fan/i,'fan'],[/mirror|grab bar|towel bar/i,'accessory'],[/cabinet/i,'cabinet'],[/hardware/i,'hardware'],[/door/i,'door'],[/window/i,'window'],[/wallpaper/i,'wallpaper']
  ];
  function matching(name){const match=rules.find(([rx])=>rx.test(name));return match?tasks().filter(t=>t.groupId===match[1]):[];}
  function upsert(cart, item){const identity=item.taskId?'labor|'+key(item.room)+'|'+item.taskId:item.flowKey;const i=cart.findIndex(x=>(x.taskId?'labor|'+key(x.room)+'|'+x.taskId:x.flowKey)===identity);if(i<0)cart.push(item);else cart[i]=item;return cart;}
  window.ProjectFlow={matching,upsert,key};
  const originalSave=window.saveCart;
  window.saveCart=function(items){const result=[];for(const item of items){if(item.taskId||item.flowKey)upsert(result,item);else result.push(item);}originalSave(result);window.dispatchEvent(new Event('project-cart-change'));};

  function dialog(id,title){let d=document.getElementById(id);if(d)return d;d=el('dialog',undefined,'project-editor');d.id=id;d.setAttribute('aria-label',title);document.body.append(d);return d;}
  function field(labelText,input){const label=el('label',labelText,'project-editor-field');label.append(input);return label;}
  function input(value,type='text'){const i=el('input');i.type=type;i.value=value||'';return i;}
  function check(text,checked=false){const label=el('label',undefined,'project-editor-check'),box=input('','checkbox');box.checked=checked;label.append(box,document.createTextNode(text));return {label,box};}
  window.openProjectItem=function(options){
    const {name,services=[],material=false}=options;
    const products=options.products?.length?options.products:[name];
    const draftKey='nr-item-draft:'+key(name);let draft={};try{draft=JSON.parse(localStorage.getItem(draftKey)||'{}')}catch{}
    const d=dialog('project-item-editor','Add to your project');d.replaceChildren();
    const form=el('form'),head=el('div',undefined,'project-editor-head'),close=el('button','Close','btn outline');close.type='button';close.onclick=()=>d.close();head.append(el('h2',name),close);form.append(head);
    const room=input(options.room||draft.room||localStorage.getItem('nr-active-room'));room.required=true;room.placeholder='e.g. Main bathroom';
    const qty=input(draft.qty||1,'number');qty.min='0.25';qty.step='0.25';qty.required=true;
    form.append(field('Room / area',room),field('Quantity (or hours for hourly labor)',qty));
    const materials=check('Include '+(products.length>1?'these products':'this product')+' in my quote',draft.material??material);form.append(materials.label);
    const available=[...new Map(products.flatMap(matching).map(t=>[t.id,t])).values()];
    const canonical={Installation:'Install',Replacement:'Replace',Removal:'Remove'};
    for(const service of services){const mode=canonical[service]||service;if(available.some(t=>t.mode===mode))continue;available.push({id:'request-'+key(name)+'-'+key(service),label:service+' — '+name,mode:service,status:'pending',unit:'each',fixture:name});}
    if(!available.length)available.push({id:'request-'+key(name)+'-labor',label:'Labor for '+name,status:'pending',unit:'each',fixture:name});
    form.append(el('h3','Optional labor'),el('p','Choose the exact work. Draft rates and unpriced work are quote requests. The $150 visit minimum applies once across your cart.','calc-note'));
    const existing=getCart().filter(x=>key(x.room)===key(room.value));
    const choices=available.filter(t=>t.status!=='calculator').map(task=>{
      const price=typeof task.price==='number'?money(task.price)+' / '+task.unit+(task.status==='draft'?' · draft':''):'Quote required';
      const requested=services.some(service=>(canonical[service]||service)===task.mode)&&available.filter(t=>t.mode===task.mode).length===1;
      const c=check(task.label+' — '+price,existing.some(x=>x.taskId===task.id)||!!draft.tasks?.includes(task.id)||requested);c.box.dataset.taskId=task.id;form.append(c.label);return {...c,task};
    });
    const supplyNames=[...new Set(products.flatMap(p=>window.materialSupplyList?.(p)||[]))];
    const supplies=supplyNames.map(s=>{const c=check(s,!!draft.supplies?.includes(s));return {...c,name:s};});
    if(supplies.length){form.append(el('h3','Optional supplies'));supplies.forEach(c=>form.append(c.label));}
    const note=input(draft.note||'');form.append(field('Measurements / model / notes (optional)',note));
    const status=el('p','','calc-note');status.setAttribute('role','status');
    const save=el('button','Save to Project Cart','btn primary');save.type='submit';form.append(save,status);
    const remember=()=>{const data={room:room.value,qty:qty.value,material:materials.box.checked,tasks:choices.filter(c=>c.box.checked).map(c=>c.task.id),supplies:supplies.filter(c=>c.box.checked).map(c=>c.name),note:note.value};localStorage.setItem(draftKey,JSON.stringify(data));if(room.value.trim())localStorage.setItem('nr-active-room',room.value.trim());};
    form.addEventListener('input',remember);
    form.onsubmit=e=>{e.preventDefault();const count=Number(qty.value),area=room.value.trim();if(!area||!Number.isFinite(count)||count<=0)return;
      if(!materials.box.checked&&!choices.some(c=>c.box.checked)&&!supplies.some(c=>c.box.checked)){status.textContent='Choose a product, task or supply to save.';return;}
      if(choices.some(c=>c.box.checked&&c.task.unit!=='hours')&&!Number.isInteger(count)){status.textContent='Use a whole number for items; fractional quantities are for hourly labor.';return;}
      let cart=getCart();
      const base={room:area,qty:count,notes:note.value.trim(),product:name};
      products.forEach(product=>{const flowKey='product|'+key(area)+'|'+key(product);cart=cart.filter(x=>x.flowKey!==flowKey);if(materials.box.checked)upsert(cart,{...base,flowKey,name:area+': '+product,product,type:'Product',source:'project-flow'});});
      choices.forEach(({task,box})=>{cart=cart.filter(x=>!(x.taskId===task.id&&key(x.room)===key(area)));if(box.checked)upsert(cart,{...base,source:'labor-catalog',lineId:area+'|'+task.id,taskId:task.id,taskLabel:task.label,fixture:task.fixture,groupId:task.groupId,categoryId:task.categoryId,mode:task.mode,unit:task.unit,name:area+': '+task.label,type:task.status==='approved'?'Labor':'Service',...(task.status==='approved'?{price:task.price}:{}),...(task.status==='draft'&&typeof task.price==='number'?{draftPrice:task.price}:{})});});
      const supplyKey='supplies|'+key(area)+'|'+key(name);cart=cart.filter(x=>x.flowKey!==supplyKey);const selected=supplies.filter(c=>c.box.checked).map(c=>c.name);if(selected.length)upsert(cart,{...base,qty:1,source:'project-flow',flowKey:supplyKey,name:area+': '+name+' supplies',type:'Supplies request',supplyList:selected,forMaterial:name});
      saveCart(cart);remember();status.textContent='Saved. Re-saving updates these selections without adding duplicate charges.';const link=el('a','Review Project Cart','btn outline');link.href='/project-cart.html';status.append(document.createTextNode(' '),link);
    };
    d.append(form);d.showModal();
  };

  window.openProjectCalculator=function(url){
    const target=new URL(url,location.origin);target.searchParams.set('embedded','1');if(!target.searchParams.has('room')&&localStorage.getItem('nr-active-room'))target.searchParams.set('room',localStorage.getItem('nr-active-room'));
    if(target.searchParams.get('material')==='custom'&&target.searchParams.get('product'))return openProjectItem({name:target.searchParams.get('product'),room:target.searchParams.get('room'),material:!target.searchParams.has('labor'),services:(target.searchParams.get('services')||'').split(',').filter(Boolean)});
    let d=document.getElementById('material-calc-dialog');if(!d){d=dialog('material-calc-dialog','Project measurements');d.classList.add('material-calc-dialog');const head=el('div',undefined,'project-editor-head'),close=el('button','Done · Continue Shopping','btn outline');close.type='button';close.onclick=()=>d.close();head.append(el('strong','Measurements for your project'),close);const status=el('p','','calc-note');status.id='material-calc-status';status.setAttribute('role','status');const frame=el('iframe');frame.id='material-calc-frame';frame.title='Project measurements';d.append(head,status,frame);}
    const frame=d.querySelector('iframe');frame.src=target.pathname+target.search;d.showModal();
  };
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='project-cart-saved')return;updateCartCount();const s=document.getElementById('material-calc-status');if(s)s.textContent='Saved to your Project Cart. Continue shopping whenever you’re ready.';});
  window.addEventListener('storage',e=>{if(e.key==='nr-cart')updateCartCount();});
  const originalCart=window.renderCart;
  window.renderCart=function(){
    originalCart();
    const cart=getCart();document.querySelectorAll('.cart-item').forEach((row,i)=>{
      const item=cart[i],copy=row.firstElementChild,price=row.querySelector('.cart-current');
      const priced=typeof item.price==='number'&&Number.isFinite(item.price);
      if(price)price.textContent=priced?money(item.price*(item.qty||1))+' total':typeof item.draftPrice==='number'?money(item.draftPrice*(item.qty||1))+' draft · quote required':'Price to be confirmed';
      if(item.notes)copy.append(el('p',item.notes,'calc-note'));
      if(item.measurements&&Object.keys(item.measurements).length)copy.append(el('p','Measurements: '+Object.entries(item.measurements).map(([k,v])=>k+': '+v).join(' · '),'calc-note'));
      if(item.exact?.identifier)copy.append(el('p',[item.exact.brand,item.exact.model,item.exact.color,item.exact.identifier].filter(Boolean).join(' · '),'calc-note'));
      if(item.roomId){const edit=el('button','Edit saved work','btn outline');edit.type='button';edit.onclick=()=>openProjectCalculator('/calculators.html?editRoom='+encodeURIComponent(item.roomId));copy.append(edit);row.querySelector('button[onclick]')?.replaceChildren(document.createTextNode('Remove saved work'));}
      else if(item.taskId){const edit=el('a','Edit labor','btn outline');edit.href='/installation.html';edit.onclick=()=>localStorage.setItem('nr-active-room',item.room);copy.append(edit);}
    });
  };
  window.removeCart=function(index){const cart=getCart(),item=cart[index];if(item?.roomId){const estimates=JSON.parse(localStorage.getItem('niks-material-estimates-v1')||'[]').filter(x=>x.roomId!==item.roomId);localStorage.setItem('niks-material-estimates-v1',JSON.stringify(estimates));saveCart(cart.filter(x=>x.roomId!==item.roomId));}else{cart.splice(index,1);saveCart(cart);}renderCart();};
  const originalClear=window.clearMaterialEstimates;
  window.clearMaterialEstimates=function(){originalClear();saveCart(getCart().filter(x=>x.source!=='project-calculator'));};
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||document.body.dataset.page==='calculators'||e.ctrlKey||e.metaKey||e.shiftKey)return;const url=new URL(a.href,location.origin);if(url.origin===location.origin&&url.pathname==='/calculators.html'){e.preventDefault();openProjectCalculator(url.href);}});
  function initialize(){
    const style=el('style');style.textContent='.project-editor{width:min(780px,94vw);max-height:90dvh;overflow:auto;border:1px solid #bba58d;border-radius:12px;padding:24px;color:#30291f;background:#fffdf9}.project-editor::backdrop{background:#0008}.project-editor-head{display:flex;justify-content:space-between;align-items:start;gap:16px}.project-editor h2{font-size:1.4rem}.project-editor-field{display:block;margin:14px 0}.project-editor-field input{display:block;width:100%;padding:10px;margin-top:5px;box-sizing:border-box}.project-editor-check{display:flex;align-items:start;gap:10px;margin:12px 0}.project-editor-check input{flex:0 0 18px;width:18px;height:18px;margin-top:3px}.material-calc-dialog{width:min(1150px,96vw);height:92dvh;max-height:94dvh}.material-calc-dialog iframe{width:100%;height:calc(100% - 100px);border:0}.project-editor-head button{flex-shrink:0}.project-editor .btn{white-space:normal}@media(max-width:600px){.project-editor{padding:14px}.project-editor-head{flex-wrap:wrap}.cart-item{flex-wrap:wrap;overflow-wrap:anywhere}}';document.head.append(style);
    const room=document.getElementById('labor-room');if(room){room.value=localStorage.getItem('nr-active-room')||'';room.addEventListener('input',()=>localStorage.setItem('nr-active-room',room.value));}
    if(document.body.dataset.page==='calculators'&&new URLSearchParams(location.search).has('embedded')){const css=el('style');css.textContent='body>header,body>.topbar,body>.nav,body>footer,.cart-return-reminder{display:none!important}';document.head.append(css);}
    if(document.body.dataset.page==='calculators'){
      const query=new URLSearchParams(location.search);query.delete('embedded');
      const draftKey='nr-measurement-draft:'+query.toString();
      setTimeout(()=>{
        let saved;try{saved=JSON.parse(sessionStorage.getItem(draftKey)||'null')}catch{}
        if(saved&&!query.has('editRoom'))for(const item of saved){const target=item.id?document.getElementById(item.id):[...document.querySelectorAll('input[name]')].find(x=>x.name===item.name&&x.value===item.value);if(!target)continue;if(target.type==='checkbox')target.checked=item.checked;else target.value=item.value;target.dispatchEvent(new Event('change',{bubbles:true}));}
        document.addEventListener('input',()=>{const fields=[...document.querySelectorAll('main input,main select,main textarea')].filter(x=>x.id||x.name).map(x=>({id:x.id,name:x.name,value:x.value,checked:x.checked}));sessionStorage.setItem(draftKey,JSON.stringify(fields));const area=document.getElementById('material-name')?.value;if(area)localStorage.setItem('nr-active-room',area);});
      },250);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();
