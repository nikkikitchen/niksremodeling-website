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

const toiletStyles=[
 {key:'round',name:'Standard Round',desc:'Classic round bowl and standard seat height.'},
 {key:'elongated',name:'Elongated & Comfort Height',desc:'Longer bowls and taller seating options.'},
 {key:'smart',name:'Smart Toilets',desc:'Advanced washing, bidet and comfort features.'},
 {key:'specialty',name:'Wall-Hung & Specialty',desc:'Wall-mounted and space-saving models.'}
];
const toiletStyleNames=Object.fromEntries(toiletStyles.map(x=>[x.key,x.name]));
function toiletStyleFor(name){
 if(!bathroomMatch(name,'toilets'))return null;
 const n=String(name).toLowerCase();
 if(/\b(smart|intelligent|bidet toilet|electronic toilet|heated seat|automatic flush)\b/i.test(n))return 'smart';
 if(/\b(wall[- ]?(?:hung|mounted)|floating toilet|concealed cistern|in[- ]wall tank|tankless)\b/i.test(n))return 'specialty';
 if(/\b(elongated|oval|comfort[- ]?height|chair[- ]?height|tall[- ]?toilet|right height|universal height)\b/i.test(n))return 'elongated';
 if(/\b(round|round[- ]?front|standard[- ]?height|short[- ]?toilet)\b/i.test(n))return 'round';
 return null;
}
// Real representative manufacturer/retailer product photography, not merchandise offers.
// Each style picture is illustrative; verified supplier listings show actual sale items.
const toiletStylePhotos={"round":{"src":"https://www.americanstandard-us.com/cdn/shop/files/53999_3332DB101CR020_2_0_CDNwebp.webp?v=1774639118&width=2000","alt":"Standard white round-front toilet, with compact bowl and floor-mounted tank"},"elongated":{"src":"https://mobileimages.lowes.com/productimages/56cbf3cf-22af-4bd9-bd4e-1e1d83b850df/67531300.jpeg","alt":"White elongated chair-height toilet with longer oval bowl and traditional tank"},"smart":{"src":"https://bathify.com/cdn/shop/files/958a89d6e426938a2ab11e8d447a8f74b99e2907_8fdc20bb-4a65-41ab-9e1a-624e051b2559.jpg?v=1759504050&width=1946","alt":"Modern white one-piece smart toilet with electronic controls and integrated bidet"},"specialty":{"src":"https://img.reuter.de/products/fg/1400x1400/fg-39899000_0.jpg","alt":"White wall-hung toilet mounted above the floor with concealed plumbing"}};
function toiletArt(kind){
 const image=toiletStylePhotos[kind];
 if(!image)return '';
 return '<img src="'+bathEsc(image.src)+'" alt="'+bathEsc(image.alt)+'" loading="lazy" decoding="async">';
}
function toiletStyleTiles(qs){
 return '<div class="toilet-choice-grid">'+toiletStyles.map(style=>{
   const params=new URLSearchParams(qs);params.set('type','toilets');params.set('model',style.key);params.delete('product');
   return '<a class="toilet-choice-tile" href="/bathroom.html?'+bathEsc(params.toString())+'">'+
     '<span class="toilet-choice-art">'+toiletArt(style.key)+'</span><strong>'+bathEsc(style.name)+
     '</strong><small>'+bathEsc(style.desc)+'</small><span class="toilet-choice-action">Explore style →</span></a>';
 }).join('')+'</div>';
}
const toiletStyleCSS=document.createElement('style');
toiletStyleCSS.textContent='.toilet-choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:18px;margin:24px 0 28px}.toilet-choice-tile{display:flex;flex-direction:column;align-items:center;gap:9px;padding:18px 14px;border:1px solid #dde5eb;border-radius:12px;background:#fff;box-shadow:0 4px 16px #16202a0a;transition:box-shadow .15s,border-color .15s}.toilet-choice-tile:hover,.toilet-choice-tile:focus-visible{border-color:#0b5aa6;box-shadow:0 6px 18px #16202a18}.toilet-choice-art{display:grid;place-items:center;width:100%;height:147px;background:#f3f7f9;border-radius:9px}.toilet-choice-art img{width:100%;height:100%;max-height:147px;object-fit:contain;object-position:center;border-radius:8px}.toilet-choice-tile strong{font-size:1.05rem;text-align:center}.toilet-choice-tile small{text-align:center;color:#50606b;line-height:1.4;min-height:40px}.toilet-choice-action{color:#0b5aa6;font-weight:700;margin-top:auto}.project-shopping-return{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.toilet-back-link{display:inline-block;margin-bottom:10px}';
document.head.append(toiletStyleCSS);
const planningStyle=document.createElement('style');
planningStyle.textContent='.bath-plan-fallback{margin:22px 0;padding:18px 20px;background:#f2f7fa;border:1px solid #cbdbe6;border-radius:10px}.bath-plan-fallback p{margin:0 0 12px;max-width:650px;line-height:1.5}.bath-plan-fallback .btn{display:inline-flex;white-space:normal;text-align:center}';
document.head.append(planningStyle);


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
 const toiletModel=type==='toilets'&&toiletStyleNames[params.get('model')]?params.get('model'):null;
 const projectId=['bathrooms','bath-remodel'].includes(params.get('project'))?params.get('project'):null;
 const projectWork=/^[a-z0-9-]{1,60}$/.test(params.get('work')||'')?params.get('work'):null;
 const fromProject=!!projectId&&params.get('fromProject')==='1';
 const projectParams=new URLSearchParams({project:projectId||'bathrooms'});
 if(projectWork)projectParams.set('work',projectWork);
 const projectReturn='/project.html?'+projectParams.toString();
 const selectedCategory=bathroomNames[type]||'Bathroom Products';
 const projectBack='<a class="btn outline" href="'+projectReturn+'">← Back to Bathroom Project / Add Labor</a>';
 const projectControls=fromProject?'<div class="project-shopping-return">'+projectBack+' <a class="btn outline" href="/project-cart.html">Review Cart</a></div>':'';
 // Preserve a route to project planning when retail warehouse stock is unavailable.
 const bathWorkByType={toilets:'toilet',bathtubs:'tub',vanities:'vanity',showers:'shower',showerBases:'shower',showerDoors:'shower',faucets:'faucet-service',lighting:'vanity-light',ventilation:'ventilation',accessories:'mirror'};
 const planningWork=bathWorkByType[type]||'';
 const planningParams=new URLSearchParams({project:'bathrooms'});
 if(planningWork)planningParams.set('work',planningWork);
 if(toiletModel)planningParams.set('toiletStyle',toiletModel);
 const planningUrl='/project.html?'+planningParams.toString();
 const planWithoutProduct='<div class="bath-plan-fallback"><p>No verified product yet? You can still plan the work and request a quote. Stock and product prices are not assumed.</p><a class="btn primary" href="'+bathEsc(planningUrl)+'">'+(type==='toilets'?(toiletModel?'Plan '+bathEsc(toiletStyleNames[toiletModel])+' / Request Quote':'Plan Toilet Installation / Request Quote'):'Plan '+bathEsc(selectedCategory)+' / Request Quote')+'</a></div>';

 const tabs='<nav class="store-categories photo-store-categories" aria-label="Bathroom fixture categories">'+
   '<a class="photo-category-tile" href="/bathroom.html"><img src="'+bathroomCategoryPhotos.all+'" alt="" loading="lazy"><span><strong>All Bathroom</strong></span></a>'+
   bathroomTypes.map(([key,label])=>'<a class="photo-category-tile" href="/bathroom.html?type='+key+'"><img src="'+bathroomCategoryPhotos[key]+'" alt="" loading="lazy"><span><strong>'+bathEsc(label)+'</strong></span></a>').join('')+
   '</nav>';
 const base='<main class="wrap section"><nav aria-label="Breadcrumb">'+
   (fromProject?'<a href="'+projectReturn+'">Bathroom Project</a> → '+bathEsc(selectedCategory):'<a href="/">Home</a> → <a href="/bathroom.html">Bathroom</a>')+'</nav>'+
   '<h1>'+(type==='all'?'Bathroom Fixtures & Supplies':bathEsc(toiletModel?toiletStyleNames[toiletModel]:selectedCategory))+'</h1>'+
   '<p class="lead">'+(type==='toilets'?'Choose a toilet style to explore available models.':'Choose products and see prices when items are available.')+'</p>'+
   projectControls+(type!=='all'?'':tabs);
 const toiletHub=type==='toilets'&&!toiletModel&&!product;
 const chosenStyle=type==='toilets'&&toiletModel;
 const indexParams=new URLSearchParams(params);
 indexParams.delete('model');indexParams.delete('product');
 const allStylesBack=chosenStyle?'<a class="btn outline toilet-back-link" href="/bathroom.html?'+
   bathEsc(indexParams.toString())+'">← All Toilet Styles</a>':'';
 document.body.innerHTML=header()+base+(toiletHub?
   '<h2>Choose Your Toilet Style</h2>'+toiletStyleTiles(params)+
   '<p class="calc-note">Representative toilet photos illustrate the four styles, not items currently for sale. Exact fixture prices appear only when supplier stock and pricing are verified.</p>'+planWithoutProduct:
   product?'<div id="bath-detail" role="status">Checking product options and price…</div>':
   allStylesBack+'<h2>'+bathEsc(chosenStyle?toiletStyleNames[toiletModel]:(bathroomNames[type]||'Browse Bathroom'))+'</h2>'+
   '<div class="store-card-grid" id="bath-products"></div>'+
   '<p id="bath-status" role="status">Loading available products…</p>'+
   '<div id="bath-more"></div>'+
   '<p>Product prices exclude delivery, tax and installation. Online payment is not yet available.</p>'+planWithoutProduct+projectControls)+
   '</main>'+footer();
 updateCartCount();initNavMenus();
 if(toiletHub)return;
 if(product){
  const root=document.getElementById('bath-detail');
  if(!/^[\w-]{8,64}$/.test(product)){root.textContent='Item unavailable.';return;}
  try{
   const resp=await fetch('/api/store-product?product='+encodeURIComponent(product),{cache:'no-store'});
   if(!resp.ok)throw Error('Product cannot be verified currently.');
   const detail=await resp.json();
   const variants=bathVerified(detail);
   if(!variants)throw Error('This product has no verified U.S. warehouse stock or current price.');
   if(type!=='all'&&!bathroomMatch(detail.name,type))throw Error('Product does not belong to this bathroom category.');
   if(toiletModel&&toiletStyleFor(detail.name)!==toiletModel)throw Error('This item is not listed under the selected toilet style.');
   const image=/^https:\/\//.test(detail.image||'')?detail.image:'';
   root.innerHTML='<article class="store-product"><div><img alt="'+bathEsc(detail.name)+'" src="'+bathEsc(image)+'" loading="lazy"></div>'+
    '<div><h2>'+bathEsc(detail.name)+'</h2><label>Available in-stock option <select id="bath-variant">'+
    variants.map(v=>'<option value="'+bathEsc(v.id)+'">'+bathEsc(v.name||v.sku)+' — '+bathMoney(v.priceCents)+'</option>').join('')+
    '</select></label><p id="bath-price" class="price">'+bathMoney(variants[0].priceCents)+'</p>'+
    '<p>Item price excludes delivery, tax and installation.</p>'+
    '<form id="bath-delivery"><label>Delivery ZIP <input id="bath-zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="ZIP code" required></label> '+
    '<button class="btn primary" type="submit">Check Delivery</button></form><p id="bath-quote" role="status"></p>'+
    '<p>Installation is separate. <a href="/installation.html">Browse bathroom labor</a>.</p>'+ 
    '<button type="button" class="btn primary" id="bath-add-cart">Add Selected Product to Project Cart</button> <a class="btn outline" href="/project-cart.html">Review Cart</a> <a class="btn outline" href="'+projectReturn+'">Continue Bathroom Project & Add Labor</a>'+ 
    '<p id="bath-cart-status" role="status">Product price excludes delivery, tax and installation. Cart is for review, not payment.</p>'+ 
    '<p>Online checkout is currently disabled.</p></div></article>';
   const select=document.getElementById('bath-variant');
   const price=document.getElementById('bath-price');
   select.addEventListener('change',()=>{price.textContent=bathMoney(variants.find(v=>v.id===select.value).priceCents);document.getElementById('bath-quote').textContent='';});
   document.getElementById('bath-add-cart').addEventListener('click',()=>{
     const variant=variants.find(v=>String(v.id)===select.value);
     const feedback=document.getElementById('bath-cart-status');
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
       if(type==='toilets')existing.toiletStyle=toiletModel||toiletStyleFor(detail.name)||null;
     }else{
       cart.push({
         name:detail.name+' — '+(variant.name||variant.sku||'Selected option'),
         type:'Product',
         source:'bathroom-retail',
         projectId:projectId||'bathrooms',
         workKey:projectWork,
         bathroomFixtureType:type,
         ...(type==='toilets'?{toiletStyle:toiletModel||toiletStyleFor(detail.name)||null}:{}),
         productId:product,
         variantId:String(variant.id),
         sku:variant.sku||'',
         price:variant.priceCents/100,
         qty:1,
         priceVerifiedAt:new Date().toISOString(),
         shippingAndTaxNotIncluded:true
       });
     }
     saveCart(cart);
     feedback.textContent='Added '+detail.name+' to Project Cart at '+bathMoney(variant.priceCents)+
       ' each before delivery, tax and installation. Price and stock are rechecked before purchase.';
   });

   document.getElementById('bath-zip').addEventListener('input',()=>document.getElementById('bath-quote').textContent='');
   document.getElementById('bath-delivery').addEventListener('submit',async event=>{
    event.preventDefault();
    const target=document.getElementById('bath-quote');
    target.textContent='Checking current delivery and warehouse availability…';
    try{
     const q=new URLSearchParams({product,variant:select.value,zip:document.getElementById('bath-zip').value});
     const result=await fetch('/api/store-quote?'+q,{cache:'no-store'});
     const quote=await result.json();
     if(!result.ok||!Number.isSafeInteger(quote.productCents)||!Number.isSafeInteger(quote.deliveryCents)||Number(quote.stock)<=0)throw Error(quote.error||'Delivery unavailable.');
     target.textContent='Item '+bathMoney(quote.productCents)+' + delivery '+bathMoney(quote.deliveryCents)+
       ' = '+bathMoney(quote.productCents+quote.deliveryCents)+' before applicable tax. Payment not yet available.';
    }catch(e){target.textContent=e.message||'Unable to verify delivery.';}
   });
  }catch(e){root.textContent=e.message||'Unable to verify product.';}
  return;
 }
 const grid=document.getElementById('bath-products'),status=document.getElementById('bath-status');
 const seenIds=new Set(),seenNames=new Set(),seenImages=new Set();
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
   row.pending=(feed.products||[]).filter(p=>bathroomMatch(p.name,kind)&&(!toiletModel||toiletStyleFor(p.name)===toiletModel));
   row.max=Math.min(100,Math.max(row.page,Number(feed.totalPages)||row.page));
   row.page++;row.exhausted=row.page>row.max;
  }
  const batch=row.pending.splice(0,type==='all'?2:5);
  let added=0,failures=0;
  for(const p of batch){
   if(seenIds.has(p.id)||seenNames.has(normalized(p.name))||seenImages.has(p.image))continue;
   try{
    const result=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
    if(!result.ok)throw Error('Stock unavailable');
    const detail=await result.json(),variants=bathVerified(detail);
    if(!variants||!bathroomMatch(detail.name,kind)||(toiletModel&&toiletStyleFor(detail.name)!==toiletModel))continue;
    const name=detail.name,image=detail.image||p.image;
    if(seenIds.has(p.id)||seenNames.has(normalized(name))||seenImages.has(image))continue;
    const price=Math.min(...variants.map(v=>v.priceCents));
    const detailParams=new URLSearchParams({type:kind,product:p.id});
    if(toiletModel)detailParams.set('model',toiletModel);
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
 let total=0,errors=0;
 // Featured supplier product ID is only a lookup hint, never a stock or price claim.
 // Its card is added only after a fresh US warehouse inventory AND retail price check.
 // The product detail page checks both again before anything can enter the cart.
 async function loadVerifiedSmartToilet(){
  if(type!=='toilets'||toiletModel!=='smart')return;
  const id='2046529401898950658';
  try{
   const reply=await fetch('/api/store-product?product='+id,{cache:'no-store'});
   if(!reply.ok)return;
   const detail=await reply.json(),variants=bathVerified(detail);
   if(!variants||!bathroomMatch(detail.name,'toilets')||toiletStyleFor(detail.name)!=='smart')return;
   const name=String(detail.name||''),image=String(detail.image||'');
   if(!/^https:\/\//.test(image)||seenIds.has(id)||seenNames.has(normalized(name))||seenImages.has(image))return;
   const price=Math.min(...variants.map(v=>v.priceCents));
   const query=new URLSearchParams({type:'toilets',model:'smart',product:id});
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
   (toiletModel?'No '+toiletStyleNames[toiletModel].toLowerCase()+' models listed yet.':'No products listed in this category yet.');
 }
 // Check this supplier-confirmed item directly; search ranking often buries fixtures behind cleaners.
 await loadVerifiedSmartToilet();
 // Start with the four main fixtures in All Bathroom, keeping supplier calls modest.
 await fetchBatch(type==='all'?searches.slice(0,4):searches);
 let position=type==='all'?4:0;
 const more=document.getElementById('bath-more'),btn=document.createElement('button');
 btn.className='btn outline';btn.textContent=type==='all'?'Load more bathroom items':'Load more '+(toiletModel?toiletStyleNames[toiletModel]:selectedCategory);btn.type='button';
 more.appendChild(btn);
 btn.addEventListener('click',async()=>{
  btn.disabled=true;status.textContent='Loading more products…';
  const next=type==='all'?searches.slice(position,position+3):searches;
  if(type==='all'&&position<searches.length)position+=next.length;
  await fetchBatch(next.length?next:searches);
  btn.disabled=false;
 });
});