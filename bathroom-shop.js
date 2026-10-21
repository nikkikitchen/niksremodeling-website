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
 "all": "/assets/idea-accessibility.jpg",
 "toilets": "/assets/approved-a908c20ce632.jpg",
 "bathtubs": "/assets/tile-shower.jpg",
 "vanities": "/assets/approved-9bfcb89f7800.jpg",
 "showers": "/assets/showers-card.png",
 "showerBases": "/assets/project-stone-real.jpg",
 "showerDoors": "/assets/approved-0ab244a922c8.jpg",
 "faucets": "/assets/approved-b9cdb9084877.jpg",
 "lighting": "/assets/pendant-lighting.jpg",
 "ventilation": "/assets/catalog-8.jpg",
 "accessories": "/assets/approved-a051ee7e1935.jpg"
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
  if(/\b(clean(?:er|ing)?|deodor(?:ant|iz(?:er|ing))|tablets?|powder|sprays?|blocks?|rack|storage|shel(?:f|ves)|paper|holder|accessor(?:y|ies)|urinal|pee|bottle|portable|camping|tent|car|travel|potty|brush|plunger|bowl cleaner)\b/i.test(text))return false;
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
 const tabs='<nav class="store-categories photo-store-categories" aria-label="Bathroom fixture categories">'+
   '<a class="photo-category-tile" href="/bathroom.html"><img src="'+bathroomCategoryPhotos.all+'" alt="" loading="lazy"><span><strong>All Bathroom</strong></span></a>'+
   bathroomTypes.map(([key,label])=>'<a class="photo-category-tile" href="/bathroom.html?type='+key+'"><img src="'+bathroomCategoryPhotos[key]+'" alt="" loading="lazy"><span><strong>'+bathEsc(label)+'</strong></span></a>').join('')+
   '</nav>';
 const base='<main class="wrap section"><nav aria-label="Breadcrumb"><a href="/shopping.html">Shopping</a> → <a href="/bathroom.html">Bathroom</a></nav><h1>Bathroom Fixtures & Supplies</h1>'+
   '<p class="lead">Only items independently checked for U.S. warehouse stock and variant pricing are displayed. Manufacturing country is not verified. Shipping and tax extra.</p>'+
   tabs;
 document.body.innerHTML=header()+base+(product?
   '<div id="bath-detail" role="status">Verifying U.S. inventory and current price…</div>':
   '<h2>'+bathEsc(bathroomNames[type]||'Browse Bathroom')+'</h2><div class="store-card-grid" id="bath-products"></div>'+
   '<p id="bath-status" role="status">Checking U.S. warehouse inventory and prices…</p>'+
   '<div id="bath-more"></div>'+
   '<p>Fixtures are sold separately from installation labor. <a href="/installation.html">View installation & labor</a>. Online payment is not yet available.</p>')+
   '</main>'+footer();
 updateCartCount();initNavMenus();
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
   const image=/^https:\/\//.test(detail.image||'')?detail.image:'';
   root.innerHTML='<article class="store-product"><div><img alt="'+bathEsc(detail.name)+'" src="'+bathEsc(image)+'" loading="lazy"></div>'+
    '<div><h2>'+bathEsc(detail.name)+'</h2><label>Available in-stock option <select id="bath-variant">'+
    variants.map(v=>'<option value="'+bathEsc(v.id)+'">'+bathEsc(v.name||v.sku)+' — '+bathMoney(v.priceCents)+'</option>').join('')+
    '</select></label><p id="bath-price" class="price">'+bathMoney(variants[0].priceCents)+'</p>'+
    '<p>Verified stock in a U.S. supplier warehouse. Country of manufacture not verified. Shipping and tax extra.</p>'+
    '<form id="bath-delivery"><label>Delivery ZIP <input id="bath-zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="ZIP code" required></label> '+
    '<button class="btn primary" type="submit">Check Delivery</button></form><p id="bath-quote" role="status"></p>'+
    '<p>Installation is separate. <a href="/installation.html">Browse bathroom labor</a>.</p>'+ 
    '<button type="button" class="btn primary" id="bath-add-cart">Add Selected Product to Project Cart</button> <a class="btn outline" href="/project-cart.html">Review Cart</a>'+ 
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
     }else{
       cart.push({
         name:detail.name+' — '+(variant.name||variant.sku||'Selected option'),
         type:'Product',
         source:'bathroom-retail',
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
 const state=new Map();
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
  const batch=row.pending.splice(0,type==='all'?2:5);
  let added=0,failures=0;
  for(const p of batch){
   if(seenIds.has(p.id)||seenNames.has(normalized(p.name))||seenImages.has(p.image))continue;
   try{
    const result=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
    if(!result.ok)throw Error('Stock unavailable');
    const detail=await result.json(),variants=bathVerified(detail);
    if(!variants||!bathroomMatch(detail.name,kind))continue;
    const name=detail.name,image=detail.image||p.image;
    if(seenIds.has(p.id)||seenNames.has(normalized(name))||seenImages.has(image))continue;
    const price=Math.min(...variants.map(v=>v.priceCents));
    const href='/bathroom.html?type='+encodeURIComponent(kind)+'&product='+encodeURIComponent(p.id);
    const card=document.createElement('article');card.className='store-card';
    card.innerHTML='<a href="'+href+'"><img loading="lazy" src="'+bathEsc(image)+'" alt="'+bathEsc(name)+'">'+
     '<div class="store-card-copy"><p class="store-card-category">'+bathEsc(bathroomNames[kind])+'</p><h3>'+bathEsc(name)+'</h3>'+
     '<p class="store-card-price">From '+bathMoney(price)+'</p>'+
     '<p class="store-card-note">U.S. warehouse verified · Shipping & tax extra · Origin not verified</p>'+
     '<span class="btn primary">View item</span></div></a>';
    grid.appendChild(card);
    seenIds.add(p.id);seenNames.add(normalized(name));seenImages.add(image);added++;
   }catch{failures++;row.pending.push(p);}
  }
  return {added,failures};
 }
 let total=0,errors=0;
 async function fetchBatch(kinds){
  for(const kind of kinds){
   try{const result=await load(kind);total+=result.added;errors+=result.failures;}
   catch{errors++;}
  }
  status.textContent=total?
   'Showing '+total+' individually checked U.S.-warehouse items with prices.'+(errors?' Some supplier checks are temporarily unavailable.':''):
   'No products could be verified in this selection right now.'+(errors?' Supplier checks are temporarily unavailable.':'');
 }
 // Start with the four main fixtures in All Bathroom, keeping supplier calls modest.
 await fetchBatch(type==='all'?searches.slice(0,4):searches);
 let position=type==='all'?4:0;
 const more=document.getElementById('bath-more'),btn=document.createElement('button');
 btn.className='btn outline';btn.textContent='Load more bathroom items';btn.type='button';
 more.appendChild(btn);
 btn.addEventListener('click',async()=>{
  btn.disabled=true;status.textContent='Checking more U.S. warehouse products and prices…';
  const next=type==='all'?searches.slice(position,position+3):searches;
  if(type==='all'&&position<searches.length)position+=next.length;
  await fetchBatch(next.length?next:searches);
  btn.disabled=false;
 });
});