/* Text-first Supplies selector. Approved prices are planning references, never unverified checkout amounts. */
(() => {
  'use strict';
  const CATEGORIES = [
    {id:'paint',label:'Paint & Finishing',hint:'Rollers, brushes, trays, and finishing products',ids:[1,2,3,4,5,12],extras:['Painter’s tape','Paint stir sticks','Disposable paint cup liners'],materials:'/material-paint-finishes.html'},
    {id:'drywall',label:'Drywall Finishing',hint:'Tape, mud tools, sanding, and fasteners',ids:[14,15,16,17],extras:['Paper drywall joint tape','Drywall corner bead','Drywall screws','Joint compound'],materials:'/material-drywall.html'},
    {id:'tile',label:'Tile & Grout',hint:'Trowels, spacers, floats, grout, and setting supplies',ids:[18,19,20],extras:['Thinset tile mortar','Tile grout','Tile leveling clips','Tile waterproofing membrane','Tile backer board'],materials:'/material-tile-stone.html'},
    {id:'flooring',label:'Flooring Installation',hint:'Underlayment, adhesives, spacers, and transitions',ids:[],extras:['Flooring underlayment','Flooring adhesive','Flooring installation spacers','Floor transition strip','Flooring seam tape'],materials:'/material-flooring.html'},
    {id:'trim',label:'Trim & Woodworking',hint:'Fasteners, wood filler, and trim installation supplies',ids:[],extras:['Finish nails','Wood filler','Paintable trim caulk','Wood shims','Trim construction screws'],materials:'/material-trim-molding.html'},
    {id:'adhesive',label:'Adhesives & Sealants',hint:'Construction adhesive, glue, tape, and sealants',ids:[9,10,11,13],extras:['Paintable acrylic latex caulk','100% silicone sealant','Exterior-grade sealant','Caulk gun'],materials:'/materials.html'},
    {id:'protection',label:'Protection & Cleanup',hint:'Drop cloths, plastic, masks, gloves, and cleanup',ids:[6,7,28,29,30,31,33,44,45,46],extras:['Contractor trash bags','Surface protection paper'],materials:'/materials.html'},
    {id:'electrical',label:'Electrical & Fasteners',hint:'Electrical tape, connectors, staples, and screws',ids:[51],extras:['Wire nuts / wire connectors','Cable staples','Electrical box screws','Deck screws','Masonry anchors'],materials:'/materials.html'}
  ];
  const E=(tag,text,className)=>{
    const node=document.createElement(tag);
    if(text!==undefined&&text!==null)node.textContent=text;
    if(className)node.className=className;
    return node;
  };
  const number=x=>Number.isSafeInteger(x)&&x>0&&x<=999;
  const money=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(x);
  const STYLE=[
    '.nr-supplies-layout{max-width:1100px;margin:0 auto}',
    '.nr-supply-categories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0 22px}',
    '.nr-supply-tab{min-height:74px;padding:14px 16px;text-align:left;border:2px solid #c3d6e8;border-radius:10px;background:#fff;color:#164879;font:inherit;font-weight:700;cursor:pointer}',
    '.nr-supply-tab[aria-pressed=true]{background:#164879;color:#fff;border-color:#164879}.nr-supply-tab small{display:block;font-weight:400;margin-top:5px;line-height:1.3;color:#45647d}.nr-supply-tab[aria-pressed=true] small{color:#eef5fc}',
    '.nr-supply-tab:focus-visible,.nr-supply-picker button:focus-visible,.nr-supply-picker select:focus-visible,.nr-supply-picker input:focus-visible{outline:3px solid #246cbb;outline-offset:2px}',
    '.nr-supply-picker{max-width:820px;margin:12px auto 34px}',
    '.nr-supply-panel{border:1px solid #c3d6e8;border-radius:14px;background:#fff;padding:18px;margin:14px 0}',
    '.nr-supply-panel h2{font-size:1.25rem;margin:0 0 8px}.nr-supply-panel h3{font-size:1rem;margin:18px 0 8px}',
    '.nr-supply-search,.nr-supply-picker select,.nr-supply-picker input[type=text]{display:block;width:100%;box-sizing:border-box;min-height:51px;padding:11px;border:2px solid #a9c1d8;background:white;border-radius:10px;font:inherit;color:#164879}',
    '.nr-supply-stepper{display:flex;align-items:center;flex-wrap:wrap;gap:10px}',
    '.nr-supply-stepper button{height:50px;min-width:50px;border:2px solid #164879;border-radius:9px;background:#fff;color:#164879;font-size:1.2rem;font-weight:800;cursor:pointer}',
    '.nr-supply-stepper output{min-width:50px;text-align:center;font-size:1.4rem;font-weight:800}',
    '.nr-supply-add{width:100%;min-height:52px;margin-top:16px}',
    '.nr-supply-status{min-height:24px;color:#257047;font-weight:700}',
    '.nr-supply-row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid #dbe5ee}',
    '.nr-supply-row span{flex:1 1 200px;overflow-wrap:anywhere}',
    '.nr-supply-row button{border:0;background:transparent;color:#ad292f;text-decoration:underline;cursor:pointer;padding:8px}',
    '.nr-supply-bottom{position:sticky;bottom:0;z-index:8;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px;background:#eef5fc;border:1px solid #c3d6e8;border-radius:10px}',
    '.nr-supply-bottom .btn{white-space:nowrap}',
    '.nr-supply-muted{color:#455e72;font-size:.95rem}',
    '@media(max-width:750px){.nr-supply-categories{grid-template-columns:1fr}.nr-supply-panel{padding:13px}}',
    '@media(max-width:420px){.nr-supply-bottom{flex-wrap:wrap}.nr-supply-bottom .btn{flex:1;text-align:center}}'
  ].join('');
  const getCart=()=>{try{
    if(typeof window.getCart==='function')return window.getCart();
    const c=JSON.parse(localStorage.getItem('nr-cart')||'[]');
    return Array.isArray(c)?c:[];
  }catch{return[];}};
  const saveCart=cart=>{try{
    if(typeof window.saveCart==='function')window.saveCart(cart);
    else{localStorage.setItem('nr-cart',JSON.stringify(cart));if(typeof window.updateCartCount==='function')window.updateCartCount();}
    return true;
  }catch{return false;}};
  function mount(){
    if(document.body.dataset.page!=='shopping-home'||!/^\/supplies(?:\.html)?\/?$/.test(location.pathname))return;
    document.body.innerHTML=window.header()+
      '<main class="wrap section nr-supplies-layout">'+
      '<p><a href="/shopping.html">← Shopping</a></p>'+
      '<h1>Supplies</h1>'+
      '<p class="lead">Choose the kind of supply, pick an item and quantity, then keep shopping. Unverified items are saved for a quote, not immediate checkout.</p>'+
      '<section class="nr-supply-picker" aria-label="Supplies shopping picker">'+
      '<h2>What kind of supplies do you need?</h2>'+
      '<nav class="nr-supply-categories" aria-label="Supply categories"></nav>'+
      '<section class="nr-supply-panel" id="nr-supply-selector">'+
      '<h2 id="nr-supply-title"></h2><p class="nr-supply-muted" id="nr-supply-hint"></p>'+
      '<label for="nr-supply-search"><strong>Find a supply</strong></label>'+
      '<input id="nr-supply-search" class="nr-supply-search" type="search" placeholder="Search tape, tile spacers, grout, caulk…" autocomplete="off">'+
      '<h3>Choose an item</h3><select id="nr-supply-item" aria-label="Choose a supply item"></select>'+
      '<label for="nr-supply-variation"><h3>Specific size or variation (if needed)</h3></label>'+
      '<input id="nr-supply-variation" type="text" maxlength="120" placeholder="Leave blank for the listed item">'+
      '<h3>Quantity</h3><div class="nr-supply-stepper">'+
      '<button type="button" id="nr-supply-minus" aria-label="Decrease quantity">−</button>'+
      '<output id="nr-supply-qty" aria-live="polite">1</output>'+
      '<button type="button" id="nr-supply-plus" aria-label="Increase quantity">+</button>'+
      '<button type="button" id="nr-supply-ten" aria-label="Add ten units">+10</button></div>'+
      '<p class="nr-supply-muted" id="nr-supply-price"></p>'+
      '<button type="button" class="btn primary nr-supply-add" id="nr-supply-add">Add 1 to Cart</button>'+
      '<p role="status" class="nr-supply-status" id="nr-supply-status"></p>'+
      '<p class="nr-supply-muted">Prices shown are planning references, already including the 35% markup. Exact stock, variants, delivery and tax are confirmed before payment. Supplies included with installation are not charged twice.</p>'+
      '<p><a id="nr-supply-materials" href="/materials.html">Shop related building materials</a></p>'+
      '</section>'+
      '<section class="nr-supply-panel" aria-label="Supplies in your cart"><h2>Your supply selections</h2><div id="nr-supply-lines"></div></section>'+
      '<div class="nr-supply-bottom"><strong id="nr-supply-cart-count">0 items in cart</strong>'+
      '<a href="/project-cart.html" class="btn primary">Review Cart</a></div>'+
      '<p class="nr-supply-muted">Looking for boards, drywall sheets, paint, or tile instead? <a href="/materials.html">Go to Materials</a>. For equipment and reusable power tools, visit <a href="/products.html">Tools</a>.</p>'+
      '</section></main>'+window.footer();
    document.head.append(E('style',STYLE));
    if(typeof window.updateCartCount==='function')window.updateCartCount();
    if(typeof window.initNavMenus==='function')window.initNavMenus();
    const el=id=>document.getElementById(id);
    const nav=document.querySelector('.nr-supply-categories');
    const choose=el('nr-supply-item'),search=el('nr-supply-search'),variation=el('nr-supply-variation');
    const qtyOut=el('nr-supply-qty'),status=el('nr-supply-status'),price=el('nr-supply-price');
    const add=el('nr-supply-add'),minus=el('nr-supply-minus'),plus=el('nr-supply-plus'),ten=el('nr-supply-ten');
    const lines=el('nr-supply-lines'),cartCount=el('nr-supply-cart-count');
    const requested=new URLSearchParams(location.search).get('supply');
    const alias={adhesives:'adhesive',caulk:'adhesive',safety:'protection',tape:'adhesive'};
    let category=CATEGORIES.find(x=>x.id===(alias[requested]||requested))||CATEGORIES[0],qty=1,approved=[],found=[];
    const keyOf=item=>item.key;
    function allItems(){
      const byId=new Map(approved.map(item=>[item.id,item]));
      return CATEGORIES.flatMap(group=>[
        ...group.ids.map(id=>byId.get(id)).filter(Boolean).map(item=>({
          key:'approved:'+item.id,name:item.name,price:Number(item.price),category:group.id
        })),
        ...group.extras.map((name,i)=>({key:'quote:'+group.id+':'+i,name,price:null,category:group.id}))
      ]);
    }
    function selected(){return found.find(x=>x.key===choose.value);}
    function updateQuantity(){
      qtyOut.textContent=String(qty);minus.disabled=qty<=1;plus.disabled=qty>=999;ten.disabled=qty>989;
      add.textContent='Add '+qty+' to Cart';
    }
    function updatePrice(){
      const item=selected();
      if(!item){price.textContent='No supplies match this search. Try a different term or category.';add.disabled=true;return;}
      add.disabled=false;
      price.textContent=item.price!==null&&!variation.value.trim()
        ? 'Planning unit price: '+money(item.price)+' (markup included). Final price and stock must be confirmed.'
        : 'Price to confirm — this selection can be added for a quote, not paid checkout.';
    }
    function drawItems(){
      const term=search.value.trim().toLowerCase();
      found=allItems().filter(x=>x.category===category.id&&(!term||x.name.toLowerCase().includes(term)));
      const previous=choose.value;choose.replaceChildren();
      for(const item of found){const option=E('option',item.name);option.value=item.key;choose.append(option);}
      if(found.some(x=>x.key===previous))choose.value=previous;
      choose.disabled=!found.length;
      qty=1;variation.value='';updateQuantity();updatePrice();status.textContent='';
    }
    function drawCategory(){
      nav.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.id===category.id)));
      el('nr-supply-title').textContent=category.label;
      el('nr-supply-hint').textContent=category.hint;
      el('nr-supply-materials').href=category.materials;
      search.value='';drawItems();
    }
    function renderCart(){
      const cart=getCart(),chosen=cart.filter(x=>x.source==='material-selector-reference'&&x.materialCategory==='supplies');
      lines.replaceChildren();
      if(!chosen.length)lines.append(E('p','No supplies selected yet. Choose an item above.','nr-supply-muted'));
      for(const item of chosen){
        const row=E('div',null,'nr-supply-row');
        row.append(E('span',(Number(item.qty)||1)+' × '+item.name));
        const remove=E('button','Remove');remove.type='button';
        remove.setAttribute('aria-label','Remove '+item.name);
        remove.addEventListener('click',()=>{
          const next=getCart();const idx=next.findIndex(x=>x.source==='material-selector-reference'&&x.materialCategory==='supplies'&&x.materialKey===item.materialKey);
          if(idx>=0){next.splice(idx,1);if(saveCart(next))renderCart();}
        });
        row.append(remove);lines.append(row);
      }
      const count=cart.filter(x=>!x.hiddenFromCustomer).reduce((n,x)=>n+(Number(x.qty)||1),0);
      cartCount.textContent=count+' item'+(count===1?'':'s')+' in cart';
    }
    for(const group of CATEGORIES){
      const button=E('button',undefined,'nr-supply-tab');button.append(E('strong',group.label),E('small',group.hint));button.type='button';button.dataset.id=group.id;
      button.addEventListener('click',()=>{category=group;drawCategory();});
      nav.append(button);
    }
    search.addEventListener('input',drawItems);
    choose.addEventListener('change',()=>{variation.value='';updatePrice();status.textContent='';});
    variation.addEventListener('input',updatePrice);
    minus.addEventListener('click',()=>{qty=Math.max(1,qty-1);updateQuantity();});
    plus.addEventListener('click',()=>{qty=Math.min(999,qty+1);updateQuantity();});
    ten.addEventListener('click',()=>{qty=Math.min(999,qty+10);updateQuantity();});
    add.addEventListener('click',()=>{
      const item=selected();if(!item||!number(qty))return;
      const note=variation.value.trim(),name=item.name+(note?' — '+note:'');
      const itemKey=['supplies',category.id,keyOf(item),note.toLowerCase()].join('|');
      const cart=getCart(),existing=cart.find(x=>x.source==='material-selector-reference'&&x.materialCategory==='supplies'&&x.materialKey===itemKey);
      if(existing&&Number(existing.qty)+qty>999){status.textContent='Maximum 999 of the same item.';return;}
      if(existing)existing.qty=Number(existing.qty)+qty;
      else cart.push({
        source:'material-selector-reference',materialCategory:'supplies',materialKey:itemKey,
        type:'Supply estimate',name,qty,unit:'items',price:null,
        pricingPending:true,quoteRequired:true,shippingAndTaxNotIncluded:true
      });
      if(!saveCart(cart)){status.textContent='Could not save your selection. Please try again.';return;}
      status.textContent=qty+' × '+name+' added for a quote. You can keep shopping or review your cart.';
      qty=1;updateQuantity();renderCart();
    });
    drawCategory();renderCart();
    fetch('/data/approved-supply-prices.json',{credentials:'same-origin'})
      .then(response=>{if(!response.ok)throw Error('Approved supply guide unavailable');return response.json();})
      .then(data=>{
        if(data.pricesIncludeMarkup!==true||!Array.isArray(data.items))throw Error('Approved supply markup status missing');
        approved=data.items.filter(x=>Number.isInteger(x.id)&&x.name&&Number.isFinite(x.price)&&x.price>0);
        drawItems();
      }).catch(()=>{
        status.textContent='Approved planning prices are temporarily unavailable. You can still select quote-only supplies.';
      });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
