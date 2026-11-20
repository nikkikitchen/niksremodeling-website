/* Unified, text-first building material selector. Quote-required entries never enter paid checkout at an unverified price. */
(() => {
  'use strict';
  const MATERIALS=[
    ['Lumber','/material-lumber.html'],
    ['Drywall','/material-drywall.html'],
    ['Tile & Stone','/material-tile-stone.html'],
    ['Flooring','/material-flooring.html'],
    ['Paint & Finishes','/material-paint-finishes.html'],
    ['Wood & Trim','/material-trim-molding.html'],
    ['Insulation','/material-insulation.html'],
    ['Roofing','/material-roofing.html'],
    ['Siding & Exterior','/material-siding-exterior.html'],
    ['Doors & Windows','/material-doors-windows.html'],
    ['Concrete & Masonry','/material-concrete-masonry.html']
  ];
  const CATEGORY_HINTS={
    'Lumber':'Boards, posts, plywood, OSB and sheet goods',
    'Drywall':'Choose sheet thickness and sheet size',
    'Tile & Stone':'Wall, floor and backsplash tile',
    'Flooring':'Vinyl plank, hardwood, laminate and underlayment',
    'Paint & Finishes':'Paint, primer, stains and coatings',
    'Wood & Trim':'Shiplap, baseboard, crown and casing',
    'Insulation':'Batts and rigid foam boards',
    'Roofing':'Shingles and roofing components',
    'Siding & Exterior':'Siding, panels and exterior materials',
    'Doors & Windows':'Interior doors, exterior doors and windows',
    'Concrete & Masonry':'Concrete mix, mortar and masonry products'
  };
  const OPTIONS={
    'Drywall Panels':{size:['1/4 in','1/2 in','5/8 in'],format:['4×8 ft','4×12 ft'],unit:'sheets'},
    'Moisture Resistant Board':{size:['1/2 in','5/8 in'],format:['4×8 ft','4×12 ft'],unit:'sheets'},
    'Joint Compound':{size:['1 gal','3.5 gal','4.5 gal'],unit:'containers'},
    'Tape & Corner Bead':{size:['Paper joint tape','Self-adhesive mesh tape','Metal corner bead','Vinyl corner bead'],unit:'units'},
    'Ceramic Tile':{size:['3×6 in','4×4 in','12×12 in','12×24 in'],unit:'boxes'},
    'Porcelain Tile':{size:['12×12 in','12×24 in','24×24 in'],unit:'boxes'},
    'Natural Stone':{size:['Mosaic','12×12 in','12×24 in'],unit:'boxes'},
    'Mosaic Tile':{size:['Mesh-backed sheet','Individual tile'],unit:'units'},
    'Backsplash Tile':{size:['3×6 in','4×4 in','Mosaic sheet'],unit:'boxes'},
    'Wall Tile':{size:['4×4 in','12×12 in','12×24 in'],unit:'boxes'},
    'Floor Tile':{size:['12×12 in','12×24 in','24×24 in'],unit:'boxes'},
    'Grout & Setting Materials':{size:['Thinset mortar','Grout','Backer board','Waterproofing membrane','Sealant'],unit:'units'},
    'Luxury Vinyl Plank (LVP)':{size:['4 mm','5 mm','6 mm','8 mm'],unit:'boxes'},
    'Hardwood':{size:['Solid hardwood','Engineered hardwood'],unit:'boxes'},
    'Laminate':{size:['8 mm','10 mm','12 mm'],unit:'boxes'},
    'Linoleum':{size:['Sheet','Tile'],unit:'units'},
    'Carpet':{size:['Broadloom','Carpet tile'],unit:'units'},
    'Underlayment':{size:['Roll','Board','Attached-pad product'],unit:'units'},
    'Interior Paint':{size:['1 gallon','5 gallons'],finish:['Flat','Eggshell','Satin','Semi-gloss'],unit:'containers'},
    'Exterior Paint':{size:['1 gallon','5 gallons'],finish:['Flat','Satin','Semi-gloss'],unit:'containers'},
    'Primer':{size:['1 gallon','5 gallons'],unit:'containers'},
    'Stains':{size:['1 quart','1 gallon'],unit:'containers'},
    'Sealers':{size:['1 quart','1 gallon','5 gallons'],unit:'containers'},
    'Specialty Coatings':{size:['1 quart','1 gallon'],unit:'containers'},
    'Wallpaper':{size:['Single roll','Double roll'],unit:'rolls'},
    'Interior Shiplap':{size:['1×6 shiplap','5.25-in nickel-gap','1×6 tongue-and-groove'],format:['8 ft','12 ft','16 ft'],finish:['Pine','Primed pine','Cedar'],unit:'boards'},
    'Baseboards':{size:['3-1/4 in','5-1/4 in'],format:['8 ft','12 ft','16 ft'],finish:['Primed MDF','Primed pine','Unfinished pine'],unit:'pieces'},
    'Crown Molding':{size:['3-5/8 in','4-5/8 in','5-1/4 in'],format:['8 ft','12 ft','16 ft'],unit:'pieces'},
    'Door & Window Casing':{size:['2-1/4 in','3-1/4 in'],format:['8 ft','12 ft','16 ft'],unit:'pieces'},
    'Quarter Round':{size:['3/4 in'],format:['8 ft','12 ft','16 ft'],unit:'pieces'},
    'Decorative Trim':{format:['8 ft','12 ft','16 ft'],unit:'pieces'},
    'Batt Insulation':{size:['R-13','R-19','R-30'],format:['16 in on-center','24 in on-center'],unit:'packages'},
    'Rigid Foam':{size:['1 in','2 in'],format:['4×8 ft sheet'],unit:'sheets'},
    'Asphalt Shingles':{size:['Architectural','Three-tab'],unit:'bundles'},
    'Metal Roofing':{size:['Panel','Trim/accessory'],unit:'pieces'},
    'Vinyl Siding':{size:['Standard lap','Dutch lap'],unit:'boxes'},
    'Fiber Cement':{size:['Lap siding','Panel'],unit:'units'},
    'Interior Doors':{size:['24 in','28 in','30 in','32 in','36 in'],format:['Slab','Prehung'],unit:'doors'},
    'Exterior Doors':{size:['30 in','32 in','36 in'],format:['Slab','Prehung'],unit:'doors'},
    'Windows':{size:['Size to confirm'],unit:'windows'},
    'Concrete Mix':{size:['60 lb','80 lb'],unit:'bags'},
    'Mortar':{size:['60 lb','80 lb'],unit:'bags'}
  };
  const UNIT_BY_CATEGORY={'flooring':'units','tile-stone':'units','drywall':'units','trim-molding':'pieces','paint-finishes':'containers','insulation':'packages','roofing':'units','siding-exterior':'units','doors-windows':'units','concrete-masonry':'units'};
  const E=(tag,value,cls)=>{const node=document.createElement(tag);if(value!==undefined)node.textContent=value;if(cls)node.className=cls;return node;};
  const safeQty=n=>Number.isSafeInteger(n)&&n>=1&&n<=999;
  const readCart=()=>{try{if(typeof window.getCart==='function')return window.getCart();const c=JSON.parse(localStorage.getItem('nr-cart')||'[]');return Array.isArray(c)?c:[]}catch{return[];}};
  const saveCart=cart=>{try{if(typeof window.saveCart==='function')window.saveCart(cart);else {localStorage.setItem('nr-cart',JSON.stringify(cart));if(typeof window.updateCartCount==='function')window.updateCartCount();}return true;}catch{return false;}};
  const STYLE=String.raw`
    .nr-material-menu{width:min(1080px,100%);margin:20px auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .nr-material-menu a{min-height:84px;padding:16px;border:1px solid #c3d6e8;border-radius:10px;background:white;color:#164879;font-weight:750;text-decoration:none;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:6px}.nr-material-menu a small{color:#4b6177;font-weight:400;line-height:1.4}.nr-material-menu a:focus-visible{outline:3px solid #246cbb;outline-offset:2px}
    .nr-material-menu a:hover,.nr-material-menu a:focus-visible{background:#eef5fe;border-color:#195b96}
    .nr-material-selector{max-width:820px;margin:10px auto 36px}.nr-material-more{margin:24px auto;max-width:820px}.nr-material-more summary{cursor:pointer;padding:13px;border:1px solid #c3d6e8;border-radius:9px;color:#164879;font-weight:700}
    .nr-material-quick{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:15px 0}
    .nr-material-quick button,.nr-material-option{min-height:50px;padding:10px;border:2px solid #c3d6e8;border-radius:10px;background:#f4f8fc;color:#164879;font:inherit;font-weight:700;cursor:pointer}
    .nr-material-quick button[aria-pressed=true],.nr-material-option[aria-pressed=true]{background:#164879;color:white;border-color:#164879}
    .nr-material-selector select{width:100%;padding:13px;min-height:54px;background:#fff;border:2px solid #a9c1d8;border-radius:10px;color:#164879;font:inherit}
    .nr-material-panel{background:white;border:1px solid #c3d6e8;border-radius:14px;padding:18px;margin:14px 0}
    .nr-material-panel h3{font-size:1rem;margin:18px 0 9px;color:#164879}
    .nr-material-chips{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:9px}
    .nr-material-stepper{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .nr-material-stepper button{height:51px;min-width:51px;background:#fff;border:2px solid #164879;border-radius:9px;color:#164879;font-size:1.25rem;font-weight:800}
    .nr-material-stepper output{min-width:55px;text-align:center;font-size:1.4rem;font-weight:800}
    .nr-material-add{width:100%;min-height:52px;margin-top:15px}
    .nr-material-status{min-height:22px;font-weight:700;color:#257047}
    .nr-material-cart-line{padding:12px 0;border-bottom:1px solid #dbe5ee;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between}
    .nr-material-cart-line span{flex:1 1 200px;overflow-wrap:anywhere}
    .nr-material-cart-line button{border:1px solid #bccbd9;background:white;padding:8px;color:#164879;border-radius:7px}
    .nr-material-cart-line .nr-remove{border:0;color:#ad292f;text-decoration:underline}
    .nr-material-bottom{position:sticky;bottom:0;z-index:8;display:flex;justify-content:space-between;align-items:center;gap:14px;background:#eef5fc;border:1px solid #c3d6e8;border-radius:10px;padding:10px}
    .nr-material-bottom .btn{white-space:nowrap}
    body[data-page="materials"] .category-hero,body[data-page="material-detail"] .category-hero{background:#e9f2fb!important;color:#163b60!important;min-height:190px}
    body[data-page="materials"] .category-hero h1,body[data-page="material-detail"] .category-hero h1{font-size:clamp(32px,5vw,48px)}
    body[data-page="materials"] .category-hero .hero-points{display:none}
    body[data-page="material-detail"] .material-detail-help{margin-top:18px}
    body[data-page="materials"] #catalog-products .pic,body[data-page="material-detail"] .products .pic{display:none!important}
    @media(max-width:700px){.nr-material-menu{grid-template-columns:1fr}.nr-material-quick{grid-template-columns:repeat(2,minmax(0,1fr))}.nr-material-panel{padding:13px}.nr-material-chips{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:420px){.nr-material-menu{grid-template-columns:1fr}.nr-material-bottom{flex-wrap:wrap}.nr-material-bottom .btn{flex:1}}
  `;
  function boot(){
    const page=document.body.dataset.page,slug=document.body.dataset.material;
    if(page!=='materials'&&page!=='material-detail')return;
    if(!document.getElementById('nr-material-style')){const style=E('style');style.id='nr-material-style';style.textContent=STYLE;document.head.append(style);}
    if(page==='materials'){
      // Render ONE shopping interface. The legacy template creates extra photo tiles,
      // an unrelated product catalog and a calculator below the category list.
      // Replacing only its tabs left the old sections visible at the bottom.
      const main=document.querySelector('main');if(!main)return;
      const section=E('section',undefined,'section');
      const wrap=E('div',undefined,'wrap');
      const title=E('h1','Shop Building Materials');
      const description=E('p','Choose a category, pick an item and its size, then select how many you want. Add more items without a calculator.','lead');
      const nav=E('nav',undefined,'nr-material-menu');
      nav.setAttribute('aria-label','Building material categories');
      for(const [name,href] of MATERIALS){
        const a=E('a');a.href=href;a.append(E('strong',name),E('small',CATEGORY_HINTS[name]||''));nav.append(a);
      }
      const help=E('p','Shopping for installation supplies instead? ');
      const supplyLink=E('a','Shop Supplies');supplyLink.href='/supplies.html';help.append(supplyLink);
      wrap.append(title,description,nav,help);
      section.append(wrap);
      main.replaceChildren(section);
      document.title='Building Materials | Nik\'s Remodeling';
      return;
    }
    if(slug==='wood'||slug==='lumber')return; // already has the approved lumber selector
    const old=document.querySelector('.material-detail-grid');if(!old)return;
    const titles=[...old.querySelectorAll('.material-option-card h3')].map(x=>x.textContent.trim());
    if(slug==='trim-molding'){
      const preferred=['Interior Shiplap','Baseboards','Crown Molding','Door & Window Casing'];
      titles.sort((a,b)=>{
        const ai=preferred.indexOf(a),bi=preferred.indexOf(b);
        return (ai<0?99:ai)-(bi<0?99:bi);
      });
    }
    if(!titles.length)return;
    const picker=E('section',undefined,'nr-material-selector');picker.setAttribute('aria-label','Choose materials by item');
    const quick=E('div',undefined,'nr-material-quick');
    const choose=E('select');choose.setAttribute('aria-label','Choose material item');
    titles.forEach(title=>{const o=E('option',title);o.value=title;choose.append(o);});
    const panel=E('section',undefined,'nr-material-panel');
    const lead=E('p','Choose one item, specify the details you know, enter quantity and add it. Repeat for another item without leaving this page.','calc-note');
    const specHost=E('div');const qtyHeading=E('h3','Quantity');const stepper=E('div',undefined,'nr-material-stepper');
    const minus=E('button','−'),plus=E('button','+'),ten=E('button','+10'),quantity=E('output','1');
    [minus,plus,ten].forEach(b=>b.type='button');
    minus.setAttribute('aria-label','Decrease quantity');plus.setAttribute('aria-label','Increase quantity');ten.setAttribute('aria-label','Add ten');
    stepper.append(minus,quantity,plus,ten);
    const price=E('p','Price to confirm — exact product, stock, tax and delivery are checked before payment.','calc-note');
    const add=E('button','Add to Cart','btn primary nr-material-add');add.type='button';
    const status=E('p','', 'nr-material-status');status.setAttribute('role','status');
    panel.append(lead,specHost,qtyHeading,stepper,price,add,status);
    const basket=E('section',undefined,'nr-material-panel');
    basket.append(E('h3','Your material selections'));
    const lines=E('div');basket.append(lines);
    const actions=E('div',undefined,'nr-material-bottom');const count=E('strong','0 items in cart');
    const review=E('a','Review Cart','btn primary');review.href='/project-cart.html';actions.append(count,review);
    const nav=E('nav',undefined,'nr-material-menu');
    nav.setAttribute('aria-label','Other material categories');
    MATERIALS.filter(x=>!location.pathname.endsWith(x[1])).forEach(([name,href])=>{const a=E('a');a.href=href;a.append(E('strong',name),E('small',CATEGORY_HINTS[name]||''));nav.append(a);});
    const more=E('details',undefined,'nr-material-more');more.append(E('summary','Shop another materials category'),nav);
    const selected={qty:1,specs:{}};
    const current=()=>OPTIONS[choose.value]||{};
    const key=()=>[slug,choose.value,...Object.keys(selected.specs).sort().map(k=>k+'='+selected.specs[k])].join('|');
    const label=()=>{
      const s=Object.values(selected.specs).filter(x=>x&&x!=='To confirm');
      return choose.value+(s.length?' — '+s.join(' — '):'');
    };
    function drawOptions(){
      specHost.replaceChildren();selected.specs={};
      const conf=current();
      for(const [field,heading] of [['size','Size / type'],['format','Format / length'],['finish','Finish']]){
        const values=conf[field]||[];if(!values.length)continue;
        selected.specs[field]=values[0];
        specHost.append(E('h3',heading));
        const chips=E('div',undefined,'nr-material-chips');
        for(const value of values){
          const button=E('button',value,'nr-material-option');button.type='button';
          button.setAttribute('aria-pressed',String(value===values[0]));
          button.addEventListener('click',()=>{
            selected.specs[field]=value;
            chips.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
          });
          chips.append(button);
        }
        specHost.append(chips);
      }
      selected.qty=1;updateQty();
      const unit=conf.unit||UNIT_BY_CATEGORY[slug]||'items';
      qtyHeading.textContent='Quantity ('+unit+')';
      add.textContent='Add to Cart';status.textContent='';
      quick.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.title===choose.value)));
    }
    function updateQty(){
      quantity.textContent=String(selected.qty);minus.disabled=selected.qty<=1;plus.disabled=selected.qty>=999;ten.disabled=selected.qty>989;
      add.textContent='Add '+selected.qty+' to Cart';
    }
    function renderCart(){
      const cart=readCart(),chosen=cart.filter(x=>x.source==='material-selector-reference'&&x.materialCategory===slug);
      lines.replaceChildren();
      if(!chosen.length)lines.append(E('p','No materials selected yet. Choose your first item above.','calc-note'));
      for(const entry of chosen){
        const line=E('div',undefined,'nr-material-cart-line');
        line.append(E('span',entry.qty+' × '+entry.name));
        const button=E('button','Remove','nr-remove');button.type='button';
        button.addEventListener('click',()=>{
          const fresh=readCart(),index=fresh.findIndex(x=>x.source==='material-selector-reference'&&x.materialKey===entry.materialKey);
          if(index>=0){fresh.splice(index,1);if(saveCart(fresh))renderCart();}
        });
        line.append(button);lines.append(line);
      }
      const countAll=cart.filter(x=>!x.hiddenFromCustomer).reduce((n,x)=>n+(Number(x.qty)||1),0);
      count.textContent=countAll+' item'+(countAll===1?'':'s')+' in cart';
    }
    titles.slice(0,4).forEach(title=>{
      const button=E('button',title);button.type='button';button.dataset.title=title;
      button.addEventListener('click',()=>{choose.value=title;drawOptions();});
      quick.append(button);
    });
    if(slug==='trim-molding'&&new URLSearchParams(location.search).get('item')==='shiplap'){
      choose.value='Interior Shiplap';drawOptions();
    }
    choose.addEventListener('change',drawOptions);
    minus.addEventListener('click',()=>{selected.qty=Math.max(1,selected.qty-1);updateQty();});
    plus.addEventListener('click',()=>{selected.qty=Math.min(999,selected.qty+1);updateQty();});
    ten.addEventListener('click',()=>{selected.qty=Math.min(999,selected.qty+10);updateQty();});
    add.addEventListener('click',()=>{
      if(!safeQty(selected.qty))return;
      const cart=readCart(),itemKey=key(),existing=cart.find(x=>x.source==='material-selector-reference'&&x.materialKey===itemKey);
      if(existing&&Number(existing.qty)+selected.qty>999){status.textContent='Maximum 999 units of this selection.';return;}
      if(existing)existing.qty=Number(existing.qty)+selected.qty;
      else cart.push({source:'material-selector-reference',materialCategory:slug,materialKey:itemKey,type:'Material estimate',name:label(),qty:selected.qty,unit:current().unit||UNIT_BY_CATEGORY[slug]||'items',price:null,pricingPending:true,quoteRequired:true,shippingAndTaxNotIncluded:true});
      if(!saveCart(cart)){status.textContent='Could not save to cart. Please try again.';return;}
      status.textContent='Added '+selected.qty+' to your cart. Choose another item or review your cart.';
      selected.qty=1;updateQty();renderCart();
    });
    picker.append(E('p',undefined,'calc-note'));
    picker.firstChild.append(E('a','← All Materials'));picker.firstChild.firstChild.href='/materials.html';
    picker.append(E('h2','Choose '+(document.querySelector('.category-hero h1')?.textContent?.trim()||'a material')),quick,choose,panel,basket,actions);
    old.replaceWith(picker);
    picker.after(more);
    // The old template also renders a second product gallery under the picker.
    // Do not expose duplicate, mismatched photo cards next to a single text-first selector.
    const section=picker.closest('.wrap');
    if(section){
      section.querySelectorAll('.products.store-card-grid').forEach(gallery=>gallery.remove());
      for(const heading of section.querySelectorAll('h2')){
        if(heading!==picker.querySelector('h2')&&heading.textContent.trim()==='Available Products')heading.remove();
      }
    }
    const leadOld=picker.closest('.wrap')?.querySelector('p.lead');
    if(leadOld)leadOld.textContent='Simple shopping by material type and quantity. No project calculator required.';
    renderCart();drawOptions();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
