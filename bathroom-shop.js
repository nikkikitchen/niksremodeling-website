/* Nik's Remodeling bathroom retail: never show a sale card without individually
   confirmed physical U.S. warehouse stock and a priced available variant. */
const bathroomTypes=[
 ['toilets','Toilets'],['bathtubs','Bathtubs'],['vanities','Vanities & Sinks'],
 ['showers','Stand-up Showers'],['showerBases','Shower Pans & Bases'],
 ['showerDoors','Shower Doors'],['faucets','Bathroom Faucets'],
 ['lighting','Bathroom Lighting'],['ventilation','Ventilation & Fans'],
 ['accessories','Mirrors & Accessories']
];
const bathroomNames=Object.fromEntries(bathroomTypes);
const bathroomCategoryPhotos={
 "all": "/assets/tile-shower.jpg",
 "toilets": "/assets/approved-a908c20ce632.jpg",
 "bathtubs": "https://images.unsplash.com/photo-1773177930136-afe2bac0090a?auto=format&fit=crop&w=900&q=82",
 "vanities": "https://images.unsplash.com/photo-1770987685744-630d3c2494bd?auto=format&fit=crop&w=900&q=82",
 "showers": "/assets/showers-card.png",
 "showerBases": "/assets/approved-0ab244a922c8.jpg",
 "showerDoors": "https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&w=900&q=82",
 "faucets": "https://images.unsplash.com/photo-1761353854551-361b1c804849?auto=format&fit=crop&w=900&q=82",
 "lighting": "https://images.unsplash.com/photo-1763485956232-45c74e1e8610?auto=format&fit=crop&w=900&q=82",
 "ventilation": "https://images.unsplash.com/photo-1572081790780-1a7739896259?auto=format&fit=crop&w=900&q=82",
 "accessories": "https://images.unsplash.com/photo-1685084844860-5d94e6c82939?auto=format&fit=crop&w=900&q=82"
};
const bathroomRules={
 toilets:/\b(toilets?|commodes?|intelligent toilets?)\b/i,
 bathtubs:/\b(bathtubs?|bath tubs?|soaking tubs?|freestanding tubs?|alcove tubs?|walk.?in tubs?|whirlpool tubs?)\b/i,
 vanities:/\b(vanit(?:y|ies)|under.?sink cabinets?|sink base cabinets?|bathroom sink cabinets?|bathroom basin cabinets?)\b/i,
 showers:/\b(shower (?:enclosures?|stalls?|cabins?|kits?|surrounds?|wall kits?|cubicles?)|walk.?in showers?|complete showers?)\b/i,
 showerBases:/\b(shower (?:bases?|pans?|trays?|receptors?)|wet room trays?)\b/i,
 showerDoors:/\b(shower (?:doors?|screens?)|frameless shower doors?|sliding shower doors?)\b/i,
 faucets:/\b(bathroom (?:faucets?|taps?)|vanity (?:faucets?|taps?)|basin (?:faucets?|taps?)|sink (?:faucets?|taps?)|lavatory faucets?)\b/i,
 lighting:/\b(vanity lights?|bathroom lights?|bathroom lighting|bathroom sconces?|illuminated bathroom mirrors?|lighted bathroom mirrors?|led bathroom mirrors?)\b/i,
 ventilation:/\b(bathroom (?:exhaust|vent|ventilation) fans?|bath fans?|exhaust fans?|ceiling ventilation fans?)\b/i,
 accessories:/\b(bathroom (?:mirrors?|accessories|cabinets?)|medicine cabinets?|towel (?:bars?|rails?|racks?|rings?))\b/i
};
const bathroomExcludes={
 toilets:/\b(toilet (?:papers?|brush(?:es)?|seats?|covers?|cleaners?|plungers?|parts?|tank parts?|lids?))\b/i,
 bathtubs:/\b(bath (?:mats?|rugs?)|bathroom rugs?|bathtub (?:trays?|caddies|shelves|faucets?|drains?|plugs?))\b/i,
 vanities:/\b(vanity (?:lights?|mirrors?|stools?|chairs?|makeup tables?|organizers?)|makeup vanities?|dressing tables?)\b/i,
 showers:/\b(shower (?:curtains?|doors?|heads?|faucets?|valves?|hoses?|arms?|rods?|caddies|shelves|filters?|drains?|bases?|pans?|trays?|gels?))\b/i,
 showerBases:/\b(shower (?:drains?|curtains?|doors?|heads?|hoses?|valves?|faucets?))\b/i,
 showerDoors:/\b(shower (?:hinges?|rollers?|curtains?|rods?|seals?|sweeps?|handles? only))\b/i,
 faucets:/\b(faucet (?:aerators?|cartridges?|handles?|hoses?|filters?)|shower faucets?)\b/i,
 lighting:/\b(vanity (?:tables?|chairs?|stools?|cabinets?))\b/i,
 ventilation:/\b(fan (?:blades?|motors? only|grilles? only|covers? only|remotes?)|range hoods?)\b/i
};
function bathroomMatch(name,type){
 const text=String(name||'').toLowerCase();
 if(!bathroomRules[type]?.test(text)||bathroomExcludes[type]?.test(text))return false;
 // Conservative fixture classification. Keyword matches alone routinely confuse
 // toilet cleaners, pet bathtubs, shower chairs and vanity mirrors with fixtures.
 if(type==='toilets'){
  // Built-in self-cleaning nozzles are a SMART TOILET feature, not a toilet cleaner.
  // Keep actual cleansers, additives, portable toilets and accessories excluded.
  const builtInNozzle=/\bsmart[ -]?toilet\b/.test(text)&&/\bself[ -]?cleaning nozzle\b/.test(text);
  if(/\bclean(?:er|ing)?\b/.test(text)&&!builtInNozzle)return false;
  if(/\b(deodor(?:ant|iz(?:er|ing))|tablets?|powder|sprays?|blocks?|rack|storage|shel(?:f|ves)|paper|holder|accessor(?:y|ies)|urinal|pee|bottle|portable|camping|tent|car|travel|potty|brush|plunger)\b/i.test(text))return false;
  return /\b(one[ -]?piece|two[ -]?piece|dual[ -]?flush|single[ -]?flush|flush[ -]?toilet|smart[ -]?toilet|intelligent[ -]?toilet|elongated|round[ -]?front|comfort[ -]?height|ceramic[ -]?toilet|porcelain[ -]?toilet|water[ -]?closet|gravity[ -]?flush|wall[ -]?hung[ -]?toilet|bathroom[ -]?toilet|compact[ -]?toilet)\b/i.test(text);
 }
 if(type==='bathtubs'){
  if(/\b(chairs?|seats?|benches?|transfer|stools?|faucets?|mixers?|taps?|valves?|fillers?|caddies|organizers?|racks?|curtains?|shelves|dogs?|pets?|cats?|ice[ -]?bath|cold[ -]?plunge|plunge[ -]?pools?|shampoos?|showers?[ -]?heads?)\b/i.test(text))return false;
  return /\b(bathtubs?|bath tubs?|soaking tubs?|freestanding tubs?|alcove tubs?|walk[ -]?in tubs?|whirlpool tubs?)\b/i.test(text);
 }
 if(type==='vanities'){
  if(/\b(mirrors?|lights?|lighting|sconces?|stools?|chairs?|makeup|dressing[ -]?tables?|medicine[ -]?cabinets?)\b/i.test(text))return false;
 }
 return true;
}

// Classify toilet models for labor/cart pricing, not navigation filters.
function toiletStyleFor(name){
 if(!bathroomMatch(name,'toilets'))return null;
 const n=String(name).toLowerCase();
 if(/\b(smart|intelligent|bidet toilet|electronic toilet|heated seat|automatic flush)\b/i.test(n))return 'smart';
 if(/\b(wall[- ]?(?:hung|mounted)|floating toilet|concealed cistern|in[- ]wall tank|tankless)\b/i.test(n))return 'specialty';
 if(/\b(elongated|oval|comfort[- ]?height|chair[- ]?height|tall[- ]?toilet|right height|universal height)\b/i.test(n))return 'elongated';
 if(/\b(round|round[- ]?front|standard[- ]?height|short[- ]?toilet)\b/i.test(n))return 'round';
 return null;
}
const toiletChoices=[
 ['all','All Toilets'],['elongated','Elongated Toilets'],['round','Round Toilets'],
 ['smart','Smart Toilets'],['parts','Toilet Repair Parts'],['specialty','Wall-Mounted Toilets']
];
const toiletMatchesModel=(name,model)=>!model||model==='all'||toiletStyleFor(name)===model;
const projectReturnStyle=document.createElement('style');
projectReturnStyle.textContent='.project-shopping-return{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}';
document.head.append(projectReturnStyle);
const planningStyle=document.createElement('style');
planningStyle.textContent='.bath-plan-fallback{margin:22px 0;padding:18px 20px;background:#f2f7fa;border:1px solid #cbdbe6;border-radius:10px}.bath-plan-fallback p{margin:0 0 12px;max-width:650px;line-height:1.5}.bath-plan-fallback .btn{display:inline-flex;white-space:normal;text-align:center}';
document.head.append(planningStyle);
const toiletChoiceStyle=document.createElement('style');
toiletChoiceStyle.textContent='.toilet-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:22px 0}.toilet-choice-tile{display:flex;min-height:112px;padding:20px;align-items:center;justify-content:center;text-align:center;text-decoration:none;color:#153b5a;background:#f5f9fc;border:1px solid #d1dce7;border-radius:12px;font-size:18px;font-weight:700}.toilet-choice-tile:hover,.toilet-choice-tile:focus-visible{background:#e8f2fb;border-color:#24629a;outline-offset:3px}';
document.head.append(toiletChoiceStyle);


const bathEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bathMoney=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
const bathVerified=detail=>{
 const variants=(detail?.variants||[]).filter(v=>Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number(v.usStock)>0);
 return detail?.inStockUS===true&&detail?.warehouseCountry==='US'&&variants.length?variants:null;
};
document.addEventListener('DOMContentLoaded',async()=>{
 const params=new URLSearchParams(location.search);
 const type=bathroomNames[params.get('type')]?params.get('type'):'all';
 const product=params.get('product');
 const toiletModel=type==='toilets'&&toiletChoices.some(([id])=>id!=='parts'&&id===params.get('model'))?params.get('model'):null;
 const choosingToilet=type==='toilets'&&!toiletModel&&!product;
 const projectId=['bathrooms','bath-remodel'].includes(params.get('project'))?params.get('project'):null;
 const projectWork=/^[a-z0-9-]{1,60}$/.test(params.get('work')||'')?params.get('work'):null;
 const fromProject=!!projectId&&params.get('fromProject')==='1';
 const projectParams=new URLSearchParams({project:projectId||'bathrooms'});
 if(projectWork)projectParams.set('work',projectWork);
 const projectReturn='/project.html?'+projectParams.toString();
 const selectedCategory=bathroomNames[type]||'Bathroom Products';
 const projectBack='<a class="btn outline" href="'+projectReturn+'">← Back to Project</a>';
 const projectControls=fromProject?'<div class="project-shopping-return">'+projectBack+' <a class="btn outline" href="/project-cart.html">Review Cart</a></div>':'';
 // Preserve a route to project planning when retail warehouse stock is unavailable.
 const bathWorkByType={toilets:'toilet',bathtubs:'tub',vanities:'vanity',showers:'shower',showerBases:'shower',showerDoors:'shower',faucets:'faucet-service',lighting:'vanity-light',ventilation:'ventilation',accessories:'mirror'};
 const planningWork=bathWorkByType[type]||'';
 const planningParams=new URLSearchParams({project:'bathrooms'});
 if(planningWork)planningParams.set('work',planningWork);
 const planningUrl='/project.html?'+planningParams.toString();
 const planWithoutProduct='<div class="bath-plan-fallback"><p>No verified product yet? You can still plan the work and request a quote. Stock and product prices are not assumed.</p><a class="btn primary" href="'+bathEsc(planningUrl)+'">'+(type==='toilets'?'Plan Toilet Installation / Request Quote':'Plan '+bathEsc(selectedCategory)+' / Request Quote')+'</a></div>';

 const toiletChoiceHref=id=>{
  if(id==='parts')return '/shop-installed.html?item=bathroom-toilet-tank-repair-parts';
  const q=new URLSearchParams({type:'toilets',model:id});
  if(fromProject){q.set('fromProject','1');q.set('project',projectId);if(projectWork)q.set('work',projectWork);}
  return '/bathroom.html?'+q.toString();
 };
 const toiletChoiceMarkup='<nav class="toilet-choice-grid" aria-label="Choose toilet type">'+toiletChoices.map(([id,label])=>'<a class="toilet-choice-tile" href="'+bathEsc(toiletChoiceHref(id))+'">'+bathEsc(label)+'</a>').join('')+'</nav>';
 const tabs='<nav class="store-categories photo-store-categories" aria-label="Bathroom fixture categories">'+
   '<a class="photo-category-tile" href="/bathroom.html"><img src="'+bathroomCategoryPhotos.all+'" alt="" loading="lazy"><span><strong>All Bathroom</strong></span></a>'+
   bathroomTypes.map(([key,label])=>'<a class="photo-category-tile" href="/bathroom.html?type='+key+'"><img src="'+bathroomCategoryPhotos[key]+'" alt="" loading="lazy"><span><strong>'+bathEsc(label)+'</strong></span></a>').join('')+
   '</nav>';
 const base='<main class="wrap section"><nav aria-label="Breadcrumb">'+
   (fromProject?'<a href="'+projectReturn+'">Bathroom Project</a> → '+bathEsc(selectedCategory):'<a href="/">Home</a> → <a href="/bathroom.html">Bathroom</a>')+'</nav>'+
   '<h1>'+(type==='all'?'Bathroom Fixtures & Supplies':bathEsc(selectedCategory))+'</h1>'+
   '<p class="lead">'+(type==='toilets'?(choosingToilet?'Choose the type of toilet or repair part you need.':'Browse products for the selected toilet type.'):'Choose products and see prices when items are available.')+'</p>'+
   projectControls+(type!=='all'?'':tabs)+(type==='toilets'&&toiletModel?'<p><a href="/bathroom.html?type=toilets">← All toilet types</a></p>':'');
 document.body.innerHTML=header()+base+(choosingToilet?toiletChoiceMarkup:product?
   '<div id="bath-detail" role="status">Checking product options and price…</div>':
   '<h2>'+bathEsc(type==='toilets'?(toiletChoices.find(([id])=>id===toiletModel)?.[1]||'Toilets'):(bathroomNames[type]||'Browse Bathroom'))+'</h2>'+
   '<div class="store-card-grid" id="bath-products"></div>'+
   '<p id="bath-status" role="status">Loading available products…</p>'+
   '<div id="bath-more"></div>'+
   '<p>Delivery and tax are estimated in Review Cart.</p>'+planWithoutProduct+projectControls)+
   '</main>'+footer();
 updateCartCount();initNavMenus();
 if(choosingToilet)return;
 const {bathroomCatalog:bathroomSaved}=await import('/bathroom-catalog.js');
 if(product){
  const root=document.getElementById('bath-detail');
  if(!/^[\w-]{8,64}$/.test(product)){root.textContent='Item unavailable.';return;}
  const savedItem=bathroomSaved.find(p=>p.id===product);
  if(savedItem)root.innerHTML='<article class="store-product"><img src="'+bathEsc(savedItem.image)+'" alt="'+bathEsc(savedItem.name)+'"><div><h2>'+bathEsc(savedItem.name)+'</h2><p>Last checked: from '+bathMoney(savedItem.price)+' on October 26, 2026</p><p>Confirming current supplier availability. Payment and cart selection will appear only if the live stock check succeeds.</p></div></article>';
  try{
   // Bound supplier latency so an item preview never sits indefinitely on Checking.
   const getDetail=async()=>{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),9000);try{return await fetch('/api/store-product?product='+encodeURIComponent(product),{cache:'no-store',signal:controller.signal});}finally{clearTimeout(timeout)}};
   let resp=await getDetail();
   if(resp.status===503)resp=await getDetail();
   if(!resp.ok)throw Error('Product cannot be verified currently.');
   const detail=await resp.json();
   const variants=bathVerified(detail);
   if(!variants)throw Error('This product has no verified U.S. warehouse stock or current price.');
   if(type!=='all'&&!bathroomMatch(detail.name,type))throw Error('Product does not belong to this bathroom category.');
   const image=/^https:\/\//.test(detail.image||'')?detail.image:'';
   root.innerHTML='<article class="store-product"><div><img alt="'+bathEsc(detail.name)+'" src="'+bathEsc(image)+'" loading="lazy"></div>'+
    '<div><h2>'+bathEsc(detail.name)+'</h2><label>Available in-stock option <select id="bath-variant">'+
    variants.map(v=>'<option value="'+bathEsc(v.id)+'">'+bathEsc(v.name||v.sku)+' — '+bathMoney(v.priceCents)+'</option>').join('')+
    '</select></label><p id="bath-price" class="price">'+bathMoney(variants[0].priceCents)+'</p>'+
    '<fieldset style="border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0"><legend>Completing your project</legend>'+
    '<label style="display:block"><input type="checkbox" id="bath-install"> I want Nik’s Remodeling to install this</label>'+
    '<label id="bath-supplies-choice" style="display:block;margin-top:10px"><input type="checkbox" id="bath-supplies"> Include matching supplies</label></fieldset>'+
    '<button type="button" class="btn primary" id="bath-add-cart">Add to Cart</button> <a class="btn outline" href="/project-cart.html">Review Cart</a>'+
    '<p id="bath-cart-status" role="status"></p></div></article>';
   const select=document.getElementById('bath-variant');
   const price=document.getElementById('bath-price');
   const installChoice=document.getElementById('bath-install');
   const suppliesChoice=document.getElementById('bath-supplies');
   const suppliesRow=document.getElementById('bath-supplies-choice');
   installChoice.addEventListener('change',()=>{
    suppliesRow.style.display=installChoice.checked?'none':'block';
    if(installChoice.checked)suppliesChoice.checked=false;
   });
   select.addEventListener('change',()=>{price.textContent=bathMoney(variants.find(v=>v.id===select.value).priceCents);});
   document.getElementById('bath-add-cart').addEventListener('click',async()=>{
     const button=document.getElementById('bath-add-cart'),feedback=document.getElementById('bath-cart-status');
     button.disabled=true;feedback.textContent='Rechecking current U.S. stock and price…';
     let variant=variants.find(v=>String(v.id)===select.value);
     try{
       const response=await fetch('/api/store-product?product='+encodeURIComponent(product),{cache:'no-store'});
       if(!response.ok)throw Error('Unavailable');
       const fresh=await response.json();
       const inStock=bathVerified(fresh);
       const freshVariant=inStock?.find(v=>String(v.id)===String(variant?.id));
       if(!freshVariant)throw Error('Out of stock');
       variant=freshVariant;
     }catch{feedback.textContent='Supplier stock is not confirmed. Nothing was added to your cart.';button.disabled=false;return;}
     button.disabled=false;
     if(!variant||!Number.isSafeInteger(variant.priceCents)||variant.priceCents<=0||Number(variant.usStock)<=0){
       feedback.textContent='That option is not available at a verified price right now.';
       return;
     }
     const cart=getCart();
     const existing=cart.find(x=>x.source==='bathroom-retail'&&x.productId===product&&String(x.variantId)===String(variant.id));
     if(existing){
       existing.qty=Math.min(99,(Number(existing.qty)||1)+1);
       existing.price=variant.priceCents/100;
       existing.projectId=existing.projectId||projectId||'bathrooms';
       existing.workKey=existing.workKey||projectWork||null;
       existing.bathroomFixtureType=type;
       existing.installationRequested=existing.installationRequested||installChoice.checked;
       existing.suppliesRequested=existing.suppliesRequested||suppliesChoice.checked;
       if(type==='toilets')existing.toiletStyle=toiletStyleFor(detail.name)||null;
     }else{
       cart.push({
         name:detail.name+' — '+(variant.name||variant.sku||'Selected option'),
         type:'Product',
         source:'bathroom-retail',
         projectId:projectId||'bathrooms',
         workKey:projectWork,
         bathroomFixtureType:type,
         ...(type==='toilets'?{toiletStyle:toiletStyleFor(detail.name)||null}:{}),
         productId:product,
         variantId:String(variant.id),
         sku:variant.sku||'',
         price:variant.priceCents/100,
         qty:1,
         priceVerifiedAt:new Date().toISOString(),
         shippingAndTaxNotIncluded:true,
         installationRequested:installChoice.checked,
         suppliesRequested:suppliesChoice.checked
       });
     }
     saveCart(cart);
     const chosenProduct=existing||cart.find(x=>x.source==='bathroom-retail'&&x.productId===product&&String(x.variantId)===String(variant.id));
     feedback.innerHTML='Added to <a href="/project-cart.html">Review Cart</a>.'+
       (chosenProduct.installationRequested?' Installation added; labor price will be confirmed with your estimate.':'');
   });


  }catch(e){if(savedItem){const p=root.querySelector('article div:last-child');if(p){const msg=p.querySelector('[data-stock-note]');if(msg)msg.textContent='Supplier stock check did not complete. Item cannot be added to cart yet.';else p.insertAdjacentHTML('beforeend','<p role="status">Supplier stock cannot be confirmed. Please check again to select this item.</p>');}}else root.textContent=e.message||'Unable to verify product.';}
  return;
 }
 const grid=document.getElementById('bath-products'),status=document.getElementById('bath-status');
 // Last-verified catalog entries remain visible when live supplier search times out.
 // Prices are clearly dated; details/cart still require a fresh US stock check.

 const archiveIds=await fetch('/inventory-status.json',{cache:'no-store'}).then(r=>r.ok?r.json():{items:{}}).then(data=>new Set(Object.entries(data.items||{}).filter(([,v])=>v.archived===true).map(([id])=>id))).catch(()=>new Set());
 const savedVisible=bathroomSaved.filter(p=>(type==='all'||p.type===type)&&!archiveIds.has(p.id)&&(type!=='toilets'||toiletMatchesModel(p.name,toiletModel)));
 async function updateBathroomStock(){
  const jobs=[...savedVisible];
  async function worker(){
   while(jobs.length){
    const p=jobs.shift(),node=grid.querySelector('[data-bath-stock="'+p.id+'"]');
    if(!node)continue;
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    try{
     const r=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store',signal:controller.signal});
     if(!r.ok)throw Error('Unverified');
     const d=await r.json();
     const verified=bathVerified(d);
     if(!verified)throw Error('No currently verified, priced U.S. stock');
     const count=verified.reduce((n,v)=>n+Math.max(0,Number(v.usStock)||0),0);
     node.textContent='In stock (U.S.): '+count;
     node.dataset.state=count>0?'available':'out';
     const card=node.closest('.store-card');
     if(card)card.hidden=count<=0;
    }catch{node.textContent='Stock not confirmed';node.dataset.state='unknown';const card=node.closest('.store-card');if(card)card.hidden=true;}
    finally{clearTimeout(timer);}
   }
  }
  await Promise.all([worker(),worker(),worker()]);
 }
 if(savedVisible.length){status.textContent='Checking current U.S. warehouse stock before displaying saved products…';}
 grid.insertAdjacentHTML('beforeend',savedVisible.map(p=>{
  const href='/bathroom.html?'+new URLSearchParams({type:p.type,product:p.id});
  return '<article class="store-card" hidden><a href="'+bathEsc(href)+'"><img loading="lazy" src="'+bathEsc(p.image)+'" alt="'+bathEsc(p.name)+'"><div class="store-card-copy"><p class="store-card-category">'+bathEsc(bathroomNames[p.type])+'</p><h3>'+bathEsc(p.name)+'</h3><p class="store-card-price">Last checked: from '+bathMoney(p.price)+'</p><p data-bath-stock="'+bathEsc(p.id)+'" role="status" class="store-card-stock" data-state="unknown">Checking U.S. stock…</p><p class="store-card-note">Price checked October 26, 2026 · Confirm current U.S. stock and price · Shipping and tax extra</p><span class="btn primary">View item</span></div></a></article>';
 }).join(''));
 updateBathroomStock().then(()=>{const visible=grid.querySelectorAll('.store-card:not([hidden])').length;status.textContent=visible?'Showing '+visible+' products with currently confirmed U.S. stock.':'No saved products with confirmed U.S. stock right now.';const help=document.querySelector('.bath-plan-fallback');if(help)help.hidden=visible>0;});
 setInterval(()=>{if(!document.hidden&&grid.isConnected)updateBathroomStock();},15*60*1000);
 const seenIds=new Set(savedVisible.map(p=>p.id)),seenNames=new Set(savedVisible.map(p=>p.name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim())),seenImages=new Set(savedVisible.map(p=>p.image));
 // Curated fixture discovery queue. IDs are NOT offers: every card below still
 // requires a current priced US-warehouse variant from /api/store-product.
 // This keeps relevant fixtures discoverable when supplier search ranks accessories first.
 const bathroomStartingIds={
  faucets:['2096917349794078722','2096972386499059713','2096656741040947202','2096916661072584706'],
  lighting:['2100541805733785601','1947604343984668673','2004469127873077249','2001924466316451842'],
  ventilation:['2001504264391147521','2001529158386499586','2001504349855391745','2001511583781941249']
 };
 const state=new Map(Object.entries(bathroomStartingIds).map(([kind,ids])=>[kind,{
  page:1,pending:ids.map(id=>({id,name:'',image:''})),max:1,exhausted:false
 }]));
 const searches=type==='all'?bathroomTypes.map(x=>x[0]):[type];
 const normalized=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 async function load(kind){
  const row=state.get(kind)||{page:1,pending:[],max:1,exhausted:false};
  state.set(kind,row);
  if(!row.pending.length&&!row.exhausted){
   const q=new URLSearchParams({category:'bathroom',search:kind,page:String(row.page)});
   const request=await fetch('/api/us-furniture?'+q,{cache:'no-store'});
   if(!request.ok)throw Error('Supplier search unavailable');
   const feed=await request.json();
   row.pending=(feed.products||[]).filter(p=>bathroomMatch(p.name,kind));
   row.max=Math.min(100,Math.max(row.page,Number(feed.totalPages)||row.page));
   row.page++;row.exhausted=row.page>row.max;
  }
  const batch=row.pending.splice(0,bathroomStartingIds[kind]?4:(type==='all'?2:5));
  let added=0,failures=0;
  for(const p of batch){
   if(archiveIds.has(p.id)||seenIds.has(p.id)||seenNames.has(normalized(p.name))||seenImages.has(p.image))continue;
   try{
    let result=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
    // Supplier API intermittently returns 503; retry once before hiding a valid item.
    if(result.status===503)result=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
    if(!result.ok)throw Error('Stock unavailable');
    const detail=await result.json(),variants=bathVerified(detail);
    if(!variants||!bathroomMatch(detail.name,kind)||(kind==='toilets'&&!toiletMatchesModel(detail.name,toiletModel)))continue;
    const name=detail.name,image=detail.image||p.image;
    if(seenIds.has(p.id)||seenNames.has(normalized(name))||seenImages.has(image))continue;
    const price=Math.min(...variants.map(v=>v.priceCents));
    const detailParams=new URLSearchParams({type:kind,product:p.id});
    if(fromProject){
      detailParams.set('fromProject','1');
      detailParams.set('project',projectId);
      if(projectWork)detailParams.set('work',projectWork);
    }
    const href='/bathroom.html?'+detailParams.toString();
    const card=document.createElement('article');card.className='store-card';
    card.innerHTML='<a href="'+href+'"><img loading="lazy" src="'+bathEsc(image)+'" alt="'+bathEsc(name)+'">'+
     '<div class="store-card-copy"><p class="store-card-category">'+bathEsc(bathroomNames[kind])+'</p><h3>'+bathEsc(name)+'</h3>'+
     '<p class="store-card-price">From '+bathMoney(price)+'</p>'+
     '<p class="store-card-note">Delivery and tax calculated separately</p>'+
     '<span class="btn primary">View item</span></div></a>';
    grid.appendChild(card);
    seenIds.add(p.id);seenNames.add(normalized(name));seenImages.add(image);added++;
   }catch{failures++;row.pending.push(p);}
  }
  return {added,failures};
 }
 let total=savedVisible.length,errors=0;
 // Featured supplier product ID is only a lookup hint, never a stock or price claim.
 // Its card is added only after a fresh US warehouse inventory AND retail price check.
 // The product detail page checks both again before anything can enter the cart.
 async function loadVerifiedSmartToilet(){
  if(type!=='toilets'||(toiletModel!=='all'&&toiletModel!=='smart'))return;
  const id='2046529401898950658';
  if(archiveIds.has(id))return;
  try{
   const reply=await fetch('/api/store-product?product='+id,{cache:'no-store'});
   if(!reply.ok)return;
   const detail=await reply.json(),variants=bathVerified(detail);
   if(!variants||!bathroomMatch(detail.name,'toilets')||toiletStyleFor(detail.name)!=='smart')return;
   const name=String(detail.name||''),image=String(detail.image||'');
   if(!/^https:\/\//.test(image)||seenIds.has(id)||seenNames.has(normalized(name))||seenImages.has(image))return;
   const price=Math.min(...variants.map(v=>v.priceCents));
   const query=new URLSearchParams({type:'toilets',product:id});
   if(fromProject){query.set('fromProject','1');query.set('project',projectId);if(projectWork)query.set('work',projectWork);}
   const card=document.createElement('article');card.className='store-card';
   card.innerHTML='<a href="/bathroom.html?'+bathEsc(query.toString())+'"><img loading="lazy" src="'+bathEsc(image)+'" alt="'+bathEsc(name)+'">'+
    '<div class="store-card-copy"><p class="store-card-category">Smart Toilets</p><h3>'+bathEsc(name)+'</h3>'+
    '<p class="store-card-price">From '+bathMoney(price)+'</p>'+
    '<p class="store-card-note">US stock verified now. Delivery and tax calculated separately.</p>'+
    '<span class="btn primary">View item</span></div></a>';
   grid.appendChild(card);
   seenIds.add(id);seenNames.add(normalized(name));seenImages.add(image);total++;
  }catch{
   // If supplier verification fails, do not advertise outdated stock or price.
  }
 }
 async function fetchBatch(kinds){
  for(const kind of kinds){
   try{const result=await load(kind);total+=result.added;errors+=result.failures;}
   catch{errors++;}
  }
  status.textContent=total?
   'Showing '+total+' available '+(total===1?'product.':'products.'):
   'No products listed in this category yet.';
 }
 // Check this supplier-confirmed item directly; search ranking often buries fixtures behind cleaners.
 await loadVerifiedSmartToilet();
 // Start with the four main fixtures in All Bathroom, keeping supplier calls modest.
 await fetchBatch(type==='all'?[...searches.slice(0,4),'faucets','lighting','ventilation']:searches);
 let position=type==='all'?4:0;
 const more=document.getElementById('bath-more'),btn=document.createElement('button');
 btn.className='btn outline';btn.textContent=type==='all'?'Load more bathroom items':'Load more '+selectedCategory;btn.type='button';
 more.appendChild(btn);
 btn.addEventListener('click',async()=>{
  btn.disabled=true;status.textContent='Loading more products…';
  const next=type==='all'?searches.slice(position,position+3):searches;
  if(type==='all'&&position<searches.length)position+=next.length;
  await fetchBatch(next.length?next:searches);
  btn.disabled=false;
 });
});