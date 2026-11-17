/* Reference materials and supplies browser: retail sale quotes are not authorized until supplier verification. */
(() => {
  'use strict';
  const KEY='nr-local-material-plan-v1';
  const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;};
  const safeHref=url=>{try{const u=new URL(url,location.origin);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}};
  const families=[
    ['Lumber, Decking & Trim',/lumber|stud|pine board|plywood|osb|deck|siding|trim|baseboard|crown|shiplap|chair rail|molding|moulding|quarter round|shelf|rod|bracket/i],
    ['Drywall & Insulation',/drywall|sheetrock|insulation|joint compound|tape \(paper|sanding/i],
    ['Paint & Finishes',/paint|primer|sealer|stain|concrete floor/i],
    ['Flooring & Tile',/flooring|vinyl plank|tile|grout|thinset|waterproofing/i],
    ['Plumbing & Bath',/toilet|vanity|faucet|sink|pex|pvc|copper|water heater|sump/i],
    ['Electrical & Lighting',/light|fan|wire|romex|switch|outlet|breaker|detector|thermostat/i],
    ['Fasteners & Adhesives',/fastener|screw|adhesive|glue|caulk|sealant/i],
    ['Protection & Job Supplies',/cloth|sheeting|plastic|glove|safety|wipe|brush|roller|tray|drop|mask|sandpaper|trash|cleanup/i]
  ];
  const category=name=>families.find(([,pattern])=>pattern.test(name))?.[0]||'Other Materials & Supplies';
  const readPlan=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x.name==='string'&&Number.isFinite(x.price)):[];}catch{return[];}};
  const writePlan=entries=>{try{localStorage.setItem(KEY,JSON.stringify(entries));return true;}catch{return false;}};
  function mount(){
    const page=document.body.dataset.page;
    const material=page==='materials';
    const supplies=location.pathname==='/supplies.html';
    if(!material&&!supplies)return;
    const main=document.querySelector('main');if(!main)return;
    const section=el('section','section nr-reference-catalog');
    section.id='retailer-reference-catalog';
    const wrap=el('div','wrap');section.append(wrap);
    const heading=el('h2',null,material?'Building Materials — Detailed Price Guide':'Supplies — Detailed Price Guide');
    const intro=el('p','lead','Browse specifications and quantities. Listed planning prices already contain Nik’s 35% materials markup; pricing and availability are confirmed before purchase. No CJ Dropshipping prices are used here.');
    wrap.append(heading,intro);
    const controls=el('div','nr-reference-controls');
    const search=el('input');search.type='search';search.placeholder='Search type, size, thickness, length, or description';search.setAttribute('aria-label','Search reference products');
    const family=el('select');family.setAttribute('aria-label','Filter by material category');
    const sort=el('select');sort.setAttribute('aria-label','Sort price guide');
    for(const [value,label] of [['name','Name A–Z'],['price-up','Price: low to high'],['price-down','Price: high to low']]){const o=el('option',null,label);o.value=value;sort.append(o);}
    const categoryAll=el('option',null,'All categories');categoryAll.value='all';family.append(categoryAll);
    controls.append(search,family,sort);wrap.append(controls);
    const count=el('p','calc-note');wrap.append(count);
    const cards=el('div','nr-reference-grid');wrap.append(cards);
    const list=el('section','panel nr-reference-plan');list.id='material-price-plan';
    list.append(el('h3',null,'Your material planning list'));
    const items=el('div','nr-reference-plan-items');const totals=el('strong','nr-reference-total');const note=el('p','calc-note','Planning estimate only. Retailer stock, delivery, sales tax and final sale price must be verified. The list is not an order or invoice.');
    const actions=el('div','nr-reference-actions');const print=el('button','btn outline','Print planning list');print.type='button';print.addEventListener('click',()=>window.print());const clear=el('button','btn outline','Clear list');clear.type='button';clear.addEventListener('click',()=>{writePlan([]);renderPlan();});actions.append(print,clear);
    list.append(items,totals,note,actions);wrap.append(list);
    main.insertBefore(section,main.querySelector('#catalog-products')||main.firstElementChild);
    document.head.append(Object.assign(el('style'),{textContent:`
      .nr-reference-catalog{background:#f5f8fc}.nr-reference-controls{display:grid;grid-template-columns:minmax(230px,2fr) minmax(160px,1fr) minmax(145px,1fr);gap:12px;margin:20px 0}
      .nr-reference-controls input,.nr-reference-controls select{width:100%;padding:12px;border:1px solid #b9c8d8;border-radius:8px;background:#fff}
      .nr-reference-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(245px,1fr));gap:16px}
      .nr-reference-card{border:1px solid #d7e1ee;border-radius:12px;background:#fff;padding:16px;display:flex;flex-direction:column;gap:8px}
      .nr-reference-card h3{font-size:1.05rem;margin:0}.nr-reference-price{font-weight:800;font-size:1.3rem;color:#174d81}
      .nr-reference-price small{font-size:.75rem;font-weight:400;color:#475569}.nr-reference-note{font-size:.84rem;color:#526273}
      .nr-reference-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
      .nr-reference-card label{display:flex;gap:8px;align-items:center}.nr-reference-card input[type=number]{max-width:78px;padding:7px;border:1px solid #aabacf;border-radius:6px}
      .nr-reference-plan{margin-top:22px}.nr-reference-plan-row{display:flex;gap:12px;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding:8px 0}.nr-reference-plan-row button{border:0;background:none;color:#b3262d;text-decoration:underline;cursor:pointer}
      @media(max-width:700px){.nr-reference-controls{grid-template-columns:1fr}.nr-reference-grid{grid-template-columns:1fr}}
      @media print{header,.nav,footer,.nr-reference-controls,.nr-reference-grid,.nr-reference-actions,.nr-reference-catalog>.wrap>p:first-of-type, .category-hero,.nr-reference-catalog ~ *{display:none!important}.nr-reference-catalog{padding:0}.nr-reference-plan{border:0;box-shadow:none}.nr-reference-catalog h2{margin-top:0}body{background:#fff}}
    `}));
    const endpoint=material?'/material-price-reference.json':'/data/approved-supply-prices.json';
    function renderPlan(){
      const plan=readPlan();items.replaceChildren();
      if(!plan.length)items.append(el('p',null,'No items selected yet.'));
      plan.forEach((item,i)=>{
        const row=el('div','nr-reference-plan-row'),label=el('span',null,item.qty+' × '+item.name),right=el('span',null,money(item.qty*item.price)),remove=el('button',null,'Remove');
        remove.type='button';remove.setAttribute('aria-label','Remove '+item.name);remove.addEventListener('click',()=>{const p=readPlan();p.splice(i,1);writePlan(p);renderPlan();});
        row.append(label,right,remove);items.append(row);
      });
      totals.textContent='Estimated materials/supplies subtotal: '+money(plan.reduce((s,x)=>s+x.qty*x.price,0));
    }
    fetch(endpoint,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('Price guide unavailable');return r.json();}).then(data=>{
      if(!data.markupAlreadyIncluded&&material)throw Error('Material price markup status missing');
      const products=(data.items||[]).filter(x=>x.name&&Number.isFinite(Number(x.price))&&Number(x.price)>=0).map(x=>({...x,category:category(x.name)}));
      const unique=[...new Set(products.map(x=>x.category))].sort();
      for(const name of unique){const o=el('option',null,name);o.value=name;family.append(o);}
      function draw(){
        cards.replaceChildren();
        const query=search.value.trim().toLowerCase();
        const selected=family.value;
        const filtered=products.filter(x=>(selected==='all'||x.category===selected)&&(!query||(x.name+' '+(x.unit||'')+' '+x.category).toLowerCase().includes(query)));
        filtered.sort((a,b)=>sort.value==='price-up'?a.price-b.price:sort.value==='price-down'?b.price-a.price:a.name.localeCompare(b.name));
        count.textContent=filtered.length+' reference item'+(filtered.length===1?'':'s')+' • Prices already marked up; do not add 35% again';
        for(const item of filtered){
          const card=el('article','nr-reference-card');
          card.append(el('small','nr-reference-note',item.category),el('h3',null,item.name));
          const p=el('div','nr-reference-price',money(item.price));p.append(el('small',null,' / '+(item.unit||'item')));card.append(p);
          card.append(el('p','nr-reference-note',item.priceStatus==='research-provisional'?'Research-based planning allowance — verify SKU and price':item.retailSources?.length?'Retail reference — verify before order':'Approved reference price — exact retailer item not selected'));
          if(item.retailSources?.length){const url=safeHref(item.retailSources[0]);if(url){const a=el('a',null,'See retail reference');a.href=url;a.target='_blank';a.rel='noopener noreferrer';card.append(a);}}
          const row=el('label',null,'Quantity');const qty=el('input');qty.type='number';qty.min='1';qty.max='999';qty.step='1';qty.value='1';row.append(qty);card.append(row);
          const button=el('button','btn primary','Add to planning list');button.type='button';button.addEventListener('click',()=>{
            const n=Number(qty.value);if(!Number.isSafeInteger(n)||n<1||n>999){qty.setCustomValidity('Enter 1–999 units');qty.reportValidity();return;}qty.setCustomValidity('');
            const plan=readPlan(),id=(material?'material:':'supply:')+item.id,existing=plan.find(x=>x.id===id);
            if(existing)existing.qty=Math.min(999,existing.qty+n);
            else plan.push({id,name:item.name,price:Number(item.price),qty:n,unit:item.unit||'each'});
            if(writePlan(plan)){renderPlan();button.textContent='Added ✓';setTimeout(()=>{button.textContent='Add to planning list';},1200);}
          });card.append(button);cards.append(card);
        }
      }
      search.addEventListener('input',draw);family.addEventListener('change',draw);sort.addEventListener('change',draw);draw();
    }).catch(error=>{count.textContent='Price guide unavailable. Please try again later.';});
    renderPlan();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();
