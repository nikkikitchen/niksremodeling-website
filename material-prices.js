// Generated from material-price-reference.json. The JSON is the source of truth.
// Approved fallback reference only; not supplier stock or a purchasable listing.
(()=>{
  'use strict';
  const reference={"description":"Nik’s Remodeling approved fallback material reference prices; use only if an existing approved material price is missing; not supplier-backed shopping listings; excludes labor/shipping/taxes","currency":"USD","markupAlreadyIncluded":true,"items":[{"id":1,"name":"2x4x8 Stud Lumber (Standard)","unit":"each","price":5.6},{"id":2,"name":"4x8 Sheet of 1/2-in Drywall","unit":"sheet","price":21.94},{"id":3,"name":"4x8 Sheet of 15/32-in OSB Sheathing","unit":"sheet","price":24.98},{"id":4,"name":"4x8 Sheet of 3/4-in ACX Plywood","unit":"sheet","price":70.2},{"id":5,"name":"60-lb Bag of Concrete Mix","unit":"bag","price":7.76},{"id":6,"name":"1-Gallon Interior Flat Latex Paint","unit":"gallon","price":48.6},{"id":7,"name":"5-Gallon Interior Semi-Gloss Paint","unit":"5-gallon pail","price":209.25},{"id":8,"name":"12-3 Romex Wire (100 ft)","unit":"100-ft roll","price":164.7},{"id":9,"name":"14-2 Romex Wire (250 ft)","unit":"250-ft roll","price":186.3},{"id":10,"name":"3-Tab Asphalt Roof Shingles (Bundle)","unit":"bundle","price":52.65},{"id":11,"name":"Fiberglass Insulation R-13 Roll","unit":"roll","price":51.3},{"id":12,"name":"Vinyl Plank Flooring","unit":"sq ft","price":3.78},{"id":13,"name":"Porcelain Ceramic Tile","unit":"sq ft","price":3.38},{"id":14,"name":"MDF Baseboard Trim (9/16-in x 5-1/4-in x 12-ft)","unit":"12-ft piece","price":21.6},{"id":15,"name":"Prehung Interior Door (6-Panel Composite)","unit":"each","price":168.75},{"id":16,"name":"Exterior Steel Entry Door (Prehung)","unit":"each","price":418.5},{"id":17,"name":"Standard Double-Hung Vinyl Window (24x36)","unit":"each","price":249.75},{"id":18,"name":"1/2-in x 10-ft PEX Pipe","unit":"10-ft length","price":7.02},{"id":19,"name":"1/2-in x 10-ft PVC Schedule 40 Pipe","unit":"10-ft length","price":11.14},{"id":20,"name":"3/4-in x 10-ft Copper Pipe (Type L)","unit":"10-ft length","price":62.1},{"id":21,"name":"Toilet (Two-Piece 1.28 GPF)","unit":"each","price":195.75},{"id":22,"name":"Bathroom Vanity with Top (30-in)","unit":"each","price":283.5},{"id":23,"name":"Kitchen Faucet (Pull-Down Stainless Steel)","unit":"each","price":216},{"id":24,"name":"Stainless Steel Undermount Kitchen Sink","unit":"each","price":297},{"id":25,"name":"Garbage Disposal (1/2 HP)","unit":"each","price":133.65},{"id":26,"name":"Ceiling Fan with Light Kit (52-in)","unit":"each","price":128.25},{"id":27,"name":"LED Recessed Downlight (6-in, 4-pack)","unit":"4-pack","price":45.9},{"id":28,"name":"Decora Light Switch (10-pack)","unit":"10-pack","price":29.7},{"id":29,"name":"Duplex Tamper-Resistant Outlet (10-pack)","unit":"10-pack","price":25.65},{"id":30,"name":"20-Amp Single-Pole Circuit Breaker","unit":"each","price":14.18},{"id":31,"name":"Contractor Trash Bags (42-Gallon, 50-count)","unit":"50-count box","price":43.2},{"id":32,"name":"Construction Adhesive (10 oz Tube)","unit":"tube","price":8.78},{"id":33,"name":"All-Purpose Drywall Joint Compound (5-Gallon)","unit":"5-gallon pail","price":28.35},{"id":34,"name":"Drywall Tape (Paper, 250 ft)","unit":"250-ft roll","price":6.75},{"id":35,"name":"Deck Screws (#8 x 2-1/2-in, 5-lb box)","unit":"5-lb box","price":48.6},{"id":36,"name":"Grout (25-lb Bag)","unit":"bag","price":30.38},{"id":37,"name":"Tile Thinset Mortar (50-lb Bag)","unit":"bag","price":33.75},{"id":38,"name":"Quarter Round Molding (3/4-in x 8-ft Pine)","unit":"8-ft piece","price":10.46},{"id":39,"name":"1x4x8 Select Pine Board","unit":"each","price":19.58},{"id":40,"name":"Pressure-Treated 4x4x8 Lumber","unit":"each","price":18.23},{"id":41,"name":"Pressure-Treated 5/4x6x12 Decking Board","unit":"each","price":22.28},{"id":42,"name":"Cedar Bevel Siding","unit":"linear ft","price":5.13},{"id":43,"name":"Caulk (10.1 oz Silicone Tub & Tile)","unit":"tube","price":10.12},{"id":44,"name":"Painters Tape (1.88-in x 60 yds)","unit":"roll","price":11.48},{"id":45,"name":"Sandpaper Sheets (Assorted Grit, 5-pack)","unit":"5-pack","price":8.1},{"id":46,"name":"HVAC Pleated Air Filter (1-in, 4-pack)","unit":"4-pack","price":59.4},{"id":47,"name":"Programmable Wi-Fi Thermostat","unit":"each","price":174.15},{"id":48,"name":"Smoke & Carbon Monoxide Detector (Hardwired)","unit":"each","price":74.25},{"id":49,"name":"Gas Water Heater (40-Gallon Tall)","unit":"each","price":972},{"id":50,"name":"Sump Pump (1/2 HP Submersible)","unit":"each","price":222.75},{"id":51,"name":"Cabinet Knob (Classic Satin Nickel, 10-pack)","unit":"10-pack","price":35.1},{"id":52,"name":"Deadbolt & Entry Lockset Combo Pack","unit":"combo pack","price":60.75}]};
  const byId=new Map(reference.items.map(item=>[item.id,item]));
  const normalized=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const exact=new Map(reference.items.map(item=>[normalized(item.name),item]));
  const aliasIds={
    'luxury vinyl plank (lvp)':12,
    'luxury vinyl plank':12,
    'lvp':12,
    'vinyl plank flooring':12,
    'ceramic tile':13,
    'porcelain tile':13,
    'floor tile':13,
    'drywall panels':2,
    'drywall':2,
    'osb & sheathing':3,
    'osb sheathing':3,
    'baseboards':14,
    'quarter round':38,
    'framing lumber':1,
    'joint compound':33,
    'primer':53,
    'drywall primer':53,
    'pva primer':53,
    'ceiling primer':53,
    'bonding primer':54,
    'tape & corner bead':34,
    'asphalt shingles':10,
    'grout & setting materials':37,
    'concrete mix':5,
    'decking boards':41
  };
  const aliases=new Map(Object.entries(aliasIds).map(([name,id])=>[normalized(name),id]));
  function referenceFor(name){
    return exact.get(normalized(name))||byId.get(aliases.get(normalized(name)))||null;
  }
  function priceForProduct(product){
    if(!product||!Number.isFinite(Number(product.quantity))||Number(product.quantity)<=0)return null;
    // A prior approved price, exact selected item price, or verified supplier
    // price always takes precedence over these general reference figures.
    if(product.price!==undefined&&product.price!==null&&product.price!=='')return null;
    if(product.priceVerifiedAt||product.source==='supplier-retail'||product.isSample)return null;
    const ref=referenceFor(product.name);if(!ref)return null;
    // This reference covers ceramic/porcelain tile, not natural stone.
    if(ref.id===13&&product.options?.Material&&
       !/ceramic|porcelain/i.test(product.options.Material))return null;
    const unit=normalized(product.unit),qty=Number(product.quantity);
    const square=['sq ft','square feet','square foot'].includes(unit);
    const pieces=['each','pieces','piece'].includes(unit);
    const sheets=['sheets','sheet'].includes(unit);
    const linear=['linear feet','linear ft','linear foot'].includes(unit);
    const bags=['bags','bag'].includes(unit);
    let count=null,unitDetail=ref.unit;
    if(ref.unit==='sq ft'&&square)count=qty;
    else if(ref.id===2&&sheets)count=qty; // 4x8 1/2-in reference only
    else if(ref.id===3&&sheets)count=qty; // 15/32-in sheathing allowance
    else if(ref.id===14&&linear){count=Math.ceil(qty/12);unitDetail='12-ft pieces';}
    else if(ref.id===38&&linear){count=Math.ceil(qty/8);unitDetail='8-ft pieces';}
    else if(ref.unit==='bag'&&bags)count=qty;
    else if(ref.unit==='each'&&pieces)count=qty;
    else if(ref.unit==='bundle'&&['bundle','bundles'].includes(unit))count=qty;
    else if(normalized(product.unit)===normalized(ref.unit))count=qty;
    // Product shapes/sizes must not be guessed (e.g., 4x12 drywall
    // against a 4x8 sheet price, or cubic yards against bags).
    if(!Number.isFinite(count)||count<=0)return null;
    const amount=Math.round(count*ref.price*100)/100;
    return {price:amount,referenceId:ref.id,referenceName:ref.name,count,unit:unitDetail,eachPrice:ref.price};
  }
  function applyFallbackPrices(estimate){
    if(!estimate||!Array.isArray(estimate.products)||estimate.isSample)return false;
    let changed=false;
    for(const product of estimate.products){
      const price=priceForProduct(product);
      if(!price)continue;
      product.price=price.price;
      if(referenceFor(product.name)?.unit==='sq ft')product.unitPrice=price.eachPrice;
      product.referencePriceId=price.referenceId;
      product.referenceOnly=true;
      product.detail=(product.detail?product.detail+' ':'')+
        'Approved material allowance: '+price.count+' '+price.unit+' at $'+
        price.eachPrice.toFixed(2)+' ('+price.referenceName+'). Exact specification and availability subject to confirmation.';
      changed=true;
    }
    return changed;
  }
  window.NIK_MATERIAL_REFERENCE=reference;
  window.NIK_MATERIAL_PRICE_FOR=referenceFor;
  window.NIK_PRICE_PROJECT_PRODUCTS=applyFallbackPrices;
  const groups={
    'lumber':[1,3,4,39,40,41],
    'drywall':[2,33,34],
    'concrete-masonry':[5],
    'paint-finishes':[6,7,31,32,43,44,45],
    'roofing':[10],
    'insulation':[11],
    'flooring':[12],
    'tile-stone':[13,36,37],
    'trim-molding':[14,38],
    'doors-windows':[15,16,17,52],
    'siding-exterior':[42]
  };
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const sortItems=items=>items.slice().sort((a,b)=>a.name.localeCompare(b.name,'en',{sensitivity:'base'}));
  function referenceSection(items,full=false){
    const section=document.createElement('section');
    section.className='panel reference-material-prices';
    section.style.cssText='margin:24px 0;padding:20px';
    const title=document.createElement('h2');title.textContent=full?'Approved Material Price Reference':'Material Price References';
    const intro=document.createElement('p');intro.className='calc-note';
    intro.textContent='Prices include the approved markup. Reference amounts only—not confirmed U.S. warehouse stock or checkout prices. Labor, delivery, and tax are extra. Existing approved prices take priority.';
    section.append(title,intro);
    const wrap=document.createElement('div');wrap.style.cssText='overflow-x:auto';
    const table=document.createElement('table');table.style.cssText='width:100%;border-collapse:collapse;text-align:left';
    const head=document.createElement('thead');head.innerHTML='<tr><th scope="col">Material</th><th scope="col">Unit</th><th scope="col">Reference price</th></tr>';
    const body=document.createElement('tbody');
    for(const item of sortItems(items)){
      const tr=document.createElement('tr');
      for(const cellText of [item.name,item.unit,money(item.price)]){
        const td=document.createElement('td');td.textContent=cellText;td.style.cssText='padding:9px 8px;border-bottom:1px solid #dce4e9';tr.append(td);
      }
      body.append(tr);
    }
    table.append(head,body);wrap.append(table);section.append(wrap);
    if(!full){
      const p=document.createElement('p');const a=document.createElement('a');
      a.href='/material-price-reference.html';a.textContent='View all 52 approved reference prices';
      p.append(a);section.append(p);
    }
    return section;
  }
  function renderPage(){
    const page=document.body.dataset.page;
    if(page==='material-prices'){
      document.title='Material Price Reference | Nik’s Remodeling';
      document.body.innerHTML=header()+'<main class="wrap section"><a href="/materials.html">← All Materials</a><h1>Approved Material Prices</h1><p>Planning prices for materials, not live supplier listings.</p><div id="material-reference-list"></div></main>'+footer();
      document.getElementById('material-reference-list').append(referenceSection(reference.items,true));
      updateCartCount();initNavMenus();
    }else if(page==='materials'){
      const main=document.querySelector('main');
      if(main){
        const section=document.createElement('section');section.className='wrap section';
        section.innerHTML='<h2>Material Price References</h2><p>See approved material price allowances, with units and sizes, before planning your project.</p><p><a class="btn primary" href="/material-price-reference.html">View all 52 material prices</a></p>';
        main.append(section);
      }
    }else if(page==='material-detail'){
      const slug=document.body.dataset.material;
      const matched=(groups[slug]||[]).map(id=>byId.get(id)).filter(Boolean);
      const main=document.querySelector('main');
      if(main&&matched.length){
        const section=document.createElement('div');section.className='wrap';
        section.append(referenceSection(matched));
        main.append(section);
      }
    }else if(page==='calculators'&&typeof window.calcMaterial==='function'){
      // An estimate can be saved before this reference asset finishes loading.
      // Fill only missing material prices and rerender the existing quote once.
      if(typeof materialEstimates!=='undefined'){
        let updated=false;
        for(const item of materialEstimates)if(applyFallbackPrices(item))updated=true;
        if(updated){
          if(typeof saveMaterialEstimates==='function')saveMaterialEstimates();
          if(typeof window.renderMaterialEstimates==='function')window.renderMaterialEstimates();
        }
      }
      const original=window.calcMaterial;
      window.calcMaterial=function(...args){
        const result=original.apply(this,args);
        let changed=false;
        if(typeof materialEstimates!=='undefined'){
          for(const item of materialEstimates)if(applyFallbackPrices(item))changed=true;
        }
        if(changed){
          if(typeof saveMaterialEstimates==='function')saveMaterialEstimates();
          if(typeof window.renderMaterialEstimates==='function')window.renderMaterialEstimates();
        }
        return result;
      };
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderPage);
  else renderPage();
})();