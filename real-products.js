const assetVersion=new URL(import.meta.url).searchParams.get('v')||'item-preview-20261025';
const {retailCatalog}=await import('./retail-catalog.js?v='+encodeURIComponent(assetVersion));
const otherCandidates=[
 {
  "id": "1895403578650173442",
  "name": "VEVOR 7-in-1 WiFi Weather Station",
  "image": "https://cf.cjdropshipping.com/2dc5699a-3c29-42ae-9469-72c438cdec5a.jpg",
  "category": "Weather Stations",
  "department": "other"
 },
 {
  "id": "1866317511508512768",
  "name": "VEVOR Wireless Weather Station",
  "image": "https://cf.cjdropshipping.com/cea54a1a-0652-4414-8ed6-b07953ca3671.jpg",
  "category": "Weather Stations",
  "department": "other"
 },
 {
  "id": "1939497398590070785",
  "name": "Wireless Weather Station with Indoor/Outdoor Sensor",
  "image": "https://cf.cjdropshipping.com/31fb0479-0ad0-444a-bff7-c9196508327b.jpg",
  "category": "Weather Stations",
  "department": "other"
 },
 {
  "id": "1976906004078157826",
  "name": "IP44 Waterproof Wireless Doorbell",
  "image": "https://cf.cjdropshipping.com/791949c0-d084-415d-aa51-bbf251f87a71.png",
  "category": "Doorbells",
  "department": "other"
 },
 {
  "id": "1941426779125358594",
  "name": "Wireless Smart Video Doorbell Intercom",
  "image": "https://cf.cjdropshipping.com/e5982a7e-ffe5-42dd-aa38-b90d92433d9b.png",
  "category": "Doorbells",
  "department": "other"
 },
 {
  "id": "2001464568861663234",
  "name": "2K Wireless Video Doorbell with Night Vision",
  "image": "https://cf.cjdropshipping.com/17660160/f84ca115-9b8d-4570-b62d-72eec021afbf.jpg",
  "category": "Doorbells",
  "department": "other"
 },
 {
  "id": "1849681100705517568",
  "name": "VEVOR Retractable Garden Water Hose Reel",
  "image": "https://cf.cjdropshipping.com/44f5da26-4ee7-4566-a993-080f633dc977.jpg",
  "category": "Garden Hose Reels",
  "department": "other"
 },
 {
  "id": "2001893418949980162",
  "name": "84-Foot Wall-Mounted Garden Hose Reel",
  "image": "https://cf.cjdropshipping.com/17661024/9939f2b1-679a-4ae2-bac1-5502ba272c35.jpg",
  "category": "Garden Hose Reels",
  "department": "other"
 },
 {
  "id": "1992975637810016258",
  "name": "Heavy-Duty 300-Foot Hose Reel Cart",
  "image": "https://cf.cjdropshipping.com/17639424/c92c9e85-412b-44d0-8a4b-03f3fef0a85e.jpg",
  "category": "Garden Hose Reels",
  "department": "other"
 },
 {
  "id": "2001853555240382465",
  "name": "Large Dog Door for Sliding Glass Doors",
  "image": "https://cf.cjdropshipping.com/17661024/159e3a52-b6f8-43d3-a41f-1d7e536d9a32.jpg",
  "category": "Pet Doors",
  "department": "other"
 },
 {
  "id": "2001853311429685249",
  "name": "Small Dog Door for Sliding Glass Doors",
  "image": "https://cf.cjdropshipping.com/17661024/b44081b6-2a3c-4c23-9e12-3ab34f312104.jpg",
  "category": "Pet Doors",
  "department": "other"
 },
 {
  "id": "2001918224323883010",
  "name": "Adjustable RV Screen Door Pet Protector",
  "image": "https://cf.cjdropshipping.com/17661024/f66758ef-1179-4e14-a58c-0f089acf049c.jpg",
  "category": "Pet Doors",
  "department": "other"
 }
];
const {priceCards}=await import('./store-cards.js?v='+encodeURIComponent(assetVersion));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>(c/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
export function availableVariants(detail){
 if(!detail?.inStockUS||detail.warehouseCountry!=='US')return [];
 return (detail.variants||[]).filter(v=>v.id&&Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number(v.usStock)>0);
}
const categorySearch={
 'Beverage Equipment':'beer tower','Coffee Systems':'espresso machine','Beverage Taps':'beer tower','Kegerators':'kegerator',
 'Refrigerators':'refrigerator','Gas Ranges':'gas range','Electric Ranges':'electric stove',
 'Wall Ovens & Cooktops':'cooktop','Dishwashers':'dishwasher','Microwaves & Hoods':'microwave',
 'Washers & Electric Dryers':'washing machine','Gas Dryers':'gas dryer','Cords & Connections':'appliance power cord',
 'Base Cabinets':'kitchen base cabinet','Wall & Upper Cabinets':'kitchen wall cabinet',
 'Bathroom Vanities':'bathroom vanity cabinet','Pantry & Tall Cabinets':'pantry cabinet',
 'Garage Storage Cabinets':'garage cabinet','Storage Cabinets':'storage cabinet','Hardware':'cabinet handle',
 'Power Tools':'electric drill','Hand Tools':'hand wrench','Specialty Tools':'work light',
 'Drills & Impacts':'electric drill','Saws & Cutting':'circular saw','Measuring & Layout':'laser measure',
 'Paint & Finishes':'paint roller','Fasteners & Adhesives':'construction adhesive','Plumbing Supplies':'plumbing fitting',
 'Electrical Supplies':'electrical connector','Appliance Cords & Connections':'appliance power cord',
 'Protection & Consumables':'drop cloth'
};
const materialSearch={'flooring':'vinyl flooring','tile-stone':'ceramic tile','drywall':'drywall panel','lumber':'lumber',
 'trim-molding':'wall molding','paint-finishes':'wallpaper','insulation':'insulation board','roofing':'roof shingle',
 'siding-exterior':'exterior siding','doors-windows':'window','concrete-masonry':'concrete paver'};
export function matchesListing(name,keyword){
 const n=String(name).toLowerCase();
 if(/nail art|rhinestone|diamond painting|dollhouse|miniature|toy|cartoon|magnet|conversion|replacement parts|refrigerator (?:magnet|organizer|divider)/i.test(n))return false;
 // Keep cleaning kits, drip pans, portable coffee makers and unrelated accessories
 // out of the equipment categories; supplier prices/US stock must still verify.
 if(keyword==='kegerator'&&!/\bkegerator\b/.test(n))return false;
 if(keyword==='kegerator'&&/\b(clean|cleaner|cleaning|drip tray|pan|cover|replacement|kit only)\b/.test(n))return false;
 if(keyword==='beer tower'&&!/\b(beer|draft|keg)\b/.test(n))return false;
 if(keyword==='beer tower'&&/\b(cleaner|cleaning|drip tray|decal|sticker|table sign)\b/.test(n))return false;
 if(keyword==='espresso machine'&&/\b(portable|camping|cordless|toy|cleaner|cleaning|descaler|filter only|pod holder|cups|spare parts)\b/.test(n))return false;
 if(['refrigerator','dishwasher','washing machine','range hood','microwave','gas dryer','electric stove','cooktop'].includes(keyword)){
  if(/\b(cleaner|cleaning|tablets|detergent|stickers?|emblems?|pedestal|stand|organizer|divider|holder|container|repair|bender|pump|backsplash)\b|dishwasher[ -]safe|hood filters|wall shield|mobile base|knife set|bowl set|plate set|frying pan/i.test(n))return false;
 }
 // A gas *range* must be an actual cooking appliance, never an auto part for a Range Rover.
 if(keyword==='gas range'&&!/(?:gas\s+(?:range|stove|oven)|(?:range|stove)\s+(?:gas|oven)|freestanding\s+gas\s+range)/i.test(n))return false;
 if(keyword==='gas range'&&/range rover|hood lift|strut|vehicle|car part|automotive/i.test(n))return false;
 const words=keyword.toLowerCase().split(/\s+/).filter(x=>!['electric','kitchen','bathroom','wall','hand','appliance','exterior'].includes(x));
 return words.every(word=>n.includes(word));
}
function itemLink(p){return '/'+(p.department==='tools'?'products':p.department)+'.html?product='+encodeURIComponent(p.id);}
function card(p,current=false){
 const priced=Number.isSafeInteger(p.priceCents)&&p.priceCents>0;
 const price=priced?(current?'From ':'Last checked: from ')+money(p.priceCents):'Price confirmation needed';
 const note=priced?(current?'U.S. warehouse stock checked':'Price checked '+esc(p.priceCheckedAt)+' · Confirm current price and stock'):'Awaiting current supplier price and U.S. availability';
 return `<article class="card store-card" data-product="${esc(p.id)}" data-category="${esc(p.category)}" data-verified="${current}" ${priced?'data-saved-price="'+p.priceCents+'" data-price-checked="'+esc(p.priceCheckedAt)+'"':''}><a href="${itemLink(p)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><div class="store-card-copy"><h3>${esc(p.name)}</h3><p class="store-card-price">${price}</p><p class="store-card-stock" role="status" aria-live="polite" data-state="unknown">Stock not confirmed</p><p class="store-card-note">${note} · Shipping &amp; tax extra</p><span class="btn primary">View item</span></div></a></article>`;
}
async function detailView(target,id,department){
 const saved=retailCatalog.find(p=>p.id===id&&p.department===department)||otherCandidates.find(p=>p.id===id&&department==='other');
 const pageTitle=document.getElementById('retail-page-title');
 const setTitle=name=>{document.title=name+" | Nik's Remodeling";if(pageTitle)pageTitle.textContent=name;};
 const preview=message=>saved?`<article class="store-product"><img src="${esc(saved.image)}" alt="${esc(saved.name)}"><div>${pageTitle?'':'<h2>'+esc(saved.name)+'</h2>'}<p class="price">Last checked price: from ${money(saved.priceCents)}</p><p>Price checked ${esc(saved.priceCheckedAt)}. Shipping, tax and installation extra.</p><p role="status">${message}</p></div></article>`:`<p role="status">${message}</p>`;
 if(saved)setTitle(saved.name);
 target.innerHTML=preview('Checking this item’s current price and availability…');
 try{
  const r=await fetch('/api/store-product?product='+encodeURIComponent(id));const data=await r.json();
  const variants=availableVariants(data);if(!r.ok||!variants.length)throw Error('Unavailable');
  const name=saved?.name||data.name;
  setTitle(name);
  target.innerHTML=`<article class="store-product"><img id="retail-photo" src="${esc(variants[0].image||data.image)}" alt="${esc(name)}"><div>${pageTitle?'':'<h2>'+esc(name)+'</h2>'}<label for="retail-option">Available option</label><select id="retail-option">${variants.map(v=>`<option value="${esc(v.id)}">${esc(v.name||v.sku)}</option>`).join('')}</select><p id="retail-price" class="price"></p><p id="retail-sku"></p><p>U.S. warehouse stock checked. Shipping and tax are calculated before payment.</p><fieldset style="border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0"><legend>Completing your project</legend><label style="display:block"><input type="checkbox" id="retail-install"> Would you like Nik’s Remodeling to install this?</label><label id="retail-supplies-choice" style="display:block;margin-top:10px"><input type="checkbox" id="retail-supplies"> Include matching supplies</label><small>We select the appropriate installation supplies. Labor and supply prices are reviewed with your project; nothing is charged here.</small></fieldset><button type="button" id="retail-add" class="btn primary">Add to Cart</button><p id="retail-status" role="status"></p><form id="retail-delivery"><label>Delivery ZIP <input id="retail-zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required></label><button class="btn outline">Check delivery</button></form><p id="retail-quote" role="status"></p><p>Online payment is not yet available. Nothing is charged from this page.</p><a class="btn outline" href="/${department==='tools'?'products':department}.html">Keep shopping</a></div></article>`;
  const $=id=>target.querySelector('#'+id),chosen=()=>variants.find(v=>String(v.id)===$('retail-option').value);
  const update=()=>{const v=chosen();$('retail-price').textContent=money(v.priceCents);$('retail-sku').textContent='Supplier SKU: '+v.sku;$('retail-photo').src=v.image||data.image;$('retail-status').textContent='';$('retail-quote').textContent='';};
  update();$('retail-option').addEventListener('change',update);
  const syncInstallation=()=>{const installed=$('retail-install').checked;$('retail-supplies-choice').style.display=installed?'none':'block';if(installed)$('retail-supplies').checked=false;};
  $('retail-install').addEventListener('change',syncInstallation);syncInstallation();
  $('retail-add').addEventListener('click',async()=>{
   const button=$('retail-add'),status=$('retail-status');button.disabled=true;status.textContent='Rechecking current U.S. warehouse price and stock…';
   let v=chosen();
   try{
    const reply=await fetch('/api/store-product?product='+encodeURIComponent(id),{cache:'no-store'});
    if(!reply.ok)throw Error('Supplier unavailable');
    const fresh=await reply.json();
    const selected=availableVariants(fresh).find(x=>String(x.id)===String(v.id));
    if(!selected)throw Error('Selected option not currently available');
    v=selected;
   }catch{status.textContent='Stock or price could not be verified. Nothing was added to cart.';button.disabled=false;return;}
   button.disabled=false;
   const cart=getCart();const existing=cart.find(x=>x.source==='supplier-retail'&&x.productId===id&&x.variantId===String(v.id));
   if(existing){existing.qty=Math.min(99,(Number(existing.qty)||1)+1);existing.price=v.priceCents/100;existing.installationRequested=existing.installationRequested||$('retail-install').checked;existing.suppliesRequested=existing.suppliesRequested||$('retail-supplies').checked;}
   else cart.push({name:name+' — '+(v.name||v.sku),type:'Product',source:'supplier-retail',productId:id,variantId:String(v.id),sku:v.sku,qty:1,price:v.priceCents/100,priceVerifiedAt:new Date().toISOString(),shippingAndTaxNotIncluded:true,installationRequested:$('retail-install').checked,suppliesRequested:$('retail-supplies').checked});
   saveCart(cart);$('retail-status').innerHTML='Added to your cart. <a href="/project-cart.html">Review cart and project options</a>. Shipping and tax are calculated before payment.';
  });
  let quoteVersion=0;
  const clearQuote=()=>{quoteVersion++;$('retail-quote').textContent='';};
  $('retail-option').addEventListener('change',clearQuote);$('retail-zip').addEventListener('input',clearQuote);
  $('retail-delivery').addEventListener('submit',async e=>{
   e.preventDefault();const version=++quoteVersion;$('retail-quote').textContent='Checking delivery…';
   try{const qs=new URLSearchParams({product:id,variant:chosen().id,zip:$('retail-zip').value});const r=await fetch('/api/store-quote?'+qs);const q=await r.json();if(version!==quoteVersion)return;if(!r.ok)throw Error(q.error||'Delivery could not be confirmed.');$('retail-quote').textContent='Item '+money(q.productCents)+' + delivery '+money(q.deliveryCents)+' = '+money(q.subtotalCents)+' before tax.';}catch(e){if(version===quoteVersion)$('retail-quote').textContent=e.message;}
  });
 }catch{
  target.innerHTML=preview('Current availability could not be confirmed. Please retry before adding this item to your cart.')+'<button type="button" class="btn outline" id="retail-retry">Retry availability</button>';
  target.querySelector('#retail-retry').addEventListener('click',()=>detailView(target,id,department));
 }
}
export async function mountCatalog(target,{department,material,type,installKeyword}={}){
 if(!document.querySelector('link[href^="/store.css"]')){
  const css=document.createElement('link');css.rel='stylesheet';css.href='/store.css?v='+encodeURIComponent(assetVersion);document.head.append(css);
 }
 const params=new URLSearchParams(location.search),id=params.get('product'),requestedCategory=params.get('category'),category=['Beverage Taps','Kegerators'].includes(requestedCategory)?'Beverage Equipment':requestedCategory;
 target.classList.add('store-card-grid');
 if(id&&/^[\w-]{8,64}$/.test(id)){target.classList.remove('store-card-grid');target.classList.add('retail-item-preview');return detailView(target,id,department);}
 if(department==='other'){
  if(id&&/^[0-9]{19}$/.test(id)){
   target.classList.remove('store-card-grid');target.classList.add('retail-item-preview');
   return detailView(target,id,department);
  }
  // Real CJ catalog items with actual supplier photographs, never invented prices.
  // A current US-warehouse variant check is mandatory before any cart add.
  target.innerHTML=otherCandidates.filter(p=>!requestedCategory||p.category===requestedCategory).map(p=>'<article class="card store-card"><a href="/other.html?product='+encodeURIComponent(p.id)+'"><img src="'+esc(p.image)+'" alt="'+esc(p.name)+'" loading="lazy"><div class="store-card-copy"><p class="store-card-category">'+esc(p.category)+'</p><h3>'+esc(p.name)+'</h3><p class="store-card-price">Check current price</p><p class="store-card-note">Supplier product · Price, U.S. stock and shipping must be verified before cart</p><span class="btn primary">View item</span></div></a></article>').join('');
  return;
 }
 const flooringTypes={'Hardwood':/\\bhardwood flooring\\b|\\bsolid hardwood\\b|\\bengineered hardwood\\b/i,'Laminate':/\\blaminate flooring\\b/i,'LVP':/\\bvinyl plank flooring\\b|\\bluxury vinyl plank\\b/i,'Luxury Vinyl Plank (LVP)':/\\bvinyl plank flooring\\b|\\bluxury vinyl plank\\b/i,'Floor Tile':/\\bfloor tile\\b|\\bflooring tile\\b/i,'Underlayment':/\\bunderlayment\\b/i};
 const matchesRequestedType=p=>!type||!(department==='materials'&&material==='flooring')||
  (type==='Hardwood' ? p.category==='Hardwood'||flooringTypes.Hardwood.test(p.name||'') :
   p.category===type||(flooringTypes[type]?.test(p.name||'')??false));
 const saved=retailCatalog.filter(p=>p.department===department&&(!category||p.category===category)&&(!material||p.material===material)&&matchesRequestedType(p)&&(!installKeyword||matchesListing(p.name,installKeyword)));
 // On the unfiltered Appliances landing page, surface installed beverage equipment first
 // instead of burying taps below refrigerator and coffee listings.
 if(department==='appliances'&&!category&&!installKeyword){
  const priority={'Beverage Equipment':0};
  saved.sort((a,b)=>(priority[a.category]??2)-(priority[b.category]??2));
 }
 const seen=new Set(saved.map(p=>p.id)),names=new Set(saved.map(p=>p.name.toLowerCase())),images=new Set(saved.map(p=>p.image));
 target.innerHTML=saved.map(p=>card(p)).join('')||'<p class="empty" role="status">Checking available products…</p>';
 await priceCards(target);
 // Candidate IDs are not retail offers. Each item is shown only after the
 // existing product API independently confirms a priced U.S.-warehouse variant.
 const equipmentCandidates={
  'Beverage Equipment':['1993033437579866113','1992983344353558529','1992915023801270274','1992915068682805249','1992915110470656002'],
  'Coffee Systems':['1997963905444204545','2104817591011717121']
 };
 const equipmentKeyword={'Beverage Equipment':'beer','Coffee Systems':'espresso machine'}[category];
 for(const candidateId of (department==='appliances'?equipmentCandidates[category]||[]:[])){
  try{
   const response=await fetch('/api/store-product?product='+encodeURIComponent(candidateId),{cache:'no-store'});
   if(!response.ok)continue;
   const data=await response.json(),vs=availableVariants(data),name=data.name||'',image=data.image||'';
   if(!vs.length||!matchesListing(name,equipmentKeyword)||!/^https:\/\//.test(image)||seen.has(candidateId)||names.has(name.toLowerCase())||images.has(image))continue;
   target.querySelectorAll('.empty').forEach(el=>el.remove());
   target.insertAdjacentHTML('beforeend',card({
    id:candidateId,department,name,image,category,
    priceCents:Math.min(...vs.map(v=>v.priceCents)),
    priceCheckedAt:new Date().toISOString().slice(0,10)
   },true));
   seen.add(candidateId);names.add(name.toLowerCase());images.add(image);
  }catch{ /* Never advertise items whose current U.S. stock cannot be checked. */ }
 }
 const keyword=installKeyword||(type?({'LVP':'vinyl flooring','Luxury Vinyl Plank (LVP)':'vinyl flooring','Hardwood':'hardwood flooring','Laminate':'laminate flooring','Floor Tile':'floor tile','Underlayment':'floor underlayment'}[type]||type):material?materialSearch[material]:category?categorySearch[category]:({appliances:'refrigerator',cabinets:'storage cabinet',tools:'electric drill',materials:'wall panel',supplies:'construction adhesive'}[department]));
 if(keyword){try{
  const r=await fetch('/api/cj-products?keyword='+encodeURIComponent(keyword));const d=await r.json();if(!r.ok)throw Error('Unavailable');
  for(const p of (d.products||[]).filter(p=>matchesListing(p.name,keyword)).slice(0,6)){
   if(seen.has(p.id))continue;
   try{const r=await fetch('/api/store-product?product='+encodeURIComponent(p.id));const data=await r.json();const vs=availableVariants(data);if(!r.ok||!vs.length)continue;
    const image=data.image||p.image,name=data.name||p.name;if(!/^https:\/\//.test(image)||names.has(name.toLowerCase())||images.has(image)||!matchesListing(name,keyword))continue;
    target.querySelectorAll('.empty').forEach(el=>el.remove());
    target.insertAdjacentHTML('beforeend',card({id:p.id,department,name,image,category:category||department,priceCents:Math.min(...vs.map(v=>v.priceCents)),priceCheckedAt:new Date().toISOString().slice(0,10)},true));
    seen.add(p.id);names.add(name.toLowerCase());images.add(image);
   }catch{}
  }
 }catch{}}
 await priceCards(target); // Update newly discovered product cards, including archived inventory decisions.
 if(!target.querySelector('[data-product]'))target.innerHTML='<p class="empty">No confirmed products are available in this category yet. Please check back.</p>';
}
