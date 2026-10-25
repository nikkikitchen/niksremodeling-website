import {retailCatalog} from './retail-catalog.js';
import {priceCards} from './store-cards.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>(c/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
export function availableVariants(detail){
 if(!detail?.inStockUS||detail.warehouseCountry!=='US')return [];
 return (detail.variants||[]).filter(v=>v.id&&Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number(v.usStock)>0);
}
const categorySearch={
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
 if(['refrigerator','dishwasher','washing machine','range hood','microwave','gas dryer','electric stove','cooktop'].includes(keyword)){
  if(/\b(cleaner|cleaning|tablets|detergent|stickers?|emblems?|pedestal|stand|organizer|divider|holder|container|repair|bender|pump|backsplash)\b|dishwasher[ -]safe|hood filters|wall shield|mobile base|knife set|bowl set|plate set|frying pan/i.test(n))return false;
 }
 const words=keyword.toLowerCase().split(/\s+/).filter(x=>!['electric','kitchen','bathroom','wall','hand','appliance','exterior'].includes(x));
 return words.every(word=>n.includes(word));
}
function itemLink(p){return '/'+(p.department==='tools'?'products':p.department)+'.html?product='+encodeURIComponent(p.id);}
function card(p,current=false){
 return `<article class="card store-card" data-product="${esc(p.id)}" data-category="${esc(p.category)}" data-verified="${current}" data-saved-price="${p.priceCents}" data-price-checked="${esc(p.priceCheckedAt)}"><a href="${itemLink(p)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><div class="store-card-copy"><h3>${esc(p.name)}</h3><p class="store-card-price">${current?'From ':'Last checked: from '}${money(p.priceCents)}</p><p class="store-card-note">${current?'U.S. warehouse stock checked':'Price checked '+esc(p.priceCheckedAt)+' · Confirm current price and stock'} · Shipping &amp; tax extra</p><span class="btn primary">View item</span></div></a></article>`;
}
async function detailView(target,id,department){
 const saved=retailCatalog.find(p=>p.id===id&&p.department===department);
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
  target.innerHTML=`<article class="store-product"><img id="retail-photo" src="${esc(variants[0].image||data.image)}" alt="${esc(name)}"><div>${pageTitle?'':'<h2>'+esc(name)+'</h2>'}<label for="retail-option">Available option</label><select id="retail-option">${variants.map(v=>`<option value="${esc(v.id)}">${esc(v.name||v.sku)}</option>`).join('')}</select><p id="retail-price" class="price"></p><p id="retail-sku"></p><p>Product only. Shipping, tax and installation are extra. U.S. warehouse stock checked.</p><button type="button" id="retail-add" class="btn primary">Add to Cart</button><p id="retail-status" role="status"></p><form id="retail-delivery"><label>Delivery ZIP <input id="retail-zip" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required></label><button class="btn outline">Check delivery</button></form><p id="retail-quote" role="status"></p><p>Online payment is not yet available. Nothing is charged from this page.</p><a class="btn outline" href="/${department==='tools'?'products':department}.html">Keep shopping</a></div></article>`;
  const $=id=>target.querySelector('#'+id),chosen=()=>variants.find(v=>String(v.id)===$('retail-option').value);
  const update=()=>{const v=chosen();$('retail-price').textContent=money(v.priceCents);$('retail-sku').textContent='Supplier SKU: '+v.sku;$('retail-photo').src=v.image||data.image;$('retail-status').textContent='';$('retail-quote').textContent='';};
  update();$('retail-option').addEventListener('change',update);
  $('retail-add').addEventListener('click',()=>{
   const v=chosen(),cart=getCart();const existing=cart.find(x=>x.source==='supplier-retail'&&x.productId===id&&x.variantId===String(v.id));
   if(existing){existing.qty=Math.min(99,(Number(existing.qty)||1)+1);existing.price=v.priceCents/100;}
   else cart.push({name:name+' — '+(v.name||v.sku),type:'Product',source:'supplier-retail',productId:id,variantId:String(v.id),sku:v.sku,qty:1,price:v.priceCents/100,priceVerifiedAt:new Date().toISOString(),shippingAndTaxNotIncluded:true});
   saveCart(cart);$('retail-status').textContent='Added to cart at '+money(v.priceCents)+' each. Delivery, tax and installation extra.';
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
export async function mountCatalog(target,{department,material,type}={}){
 if(!document.querySelector('link[href^="/store.css"]')){
  const css=document.createElement('link');css.rel='stylesheet';css.href='/store.css';document.head.append(css);
 }
 const params=new URLSearchParams(location.search),id=params.get('product'),category=params.get('category');
 target.classList.add('store-card-grid');
 if(id&&/^[\w-]{8,64}$/.test(id)){target.classList.remove('store-card-grid');target.classList.add('retail-item-preview');return detailView(target,id,department);}
 const saved=retailCatalog.filter(p=>p.department===department&&(!category||p.category===category)&&(!material||p.material===material));
 const seen=new Set(saved.map(p=>p.id)),names=new Set(saved.map(p=>p.name.toLowerCase())),images=new Set(saved.map(p=>p.image));
 target.innerHTML=saved.map(p=>card(p)).join('')||'<p class="empty" role="status">Checking available products…</p>';
 await priceCards(target);
 const keyword=type?({'LVP':'vinyl flooring','Luxury Vinyl Plank (LVP)':'vinyl flooring','Hardwood':'hardwood flooring','Laminate':'laminate flooring','Floor Tile':'floor tile','Underlayment':'floor underlayment'}[type]||type):material?materialSearch[material]:category?categorySearch[category]:({appliances:'refrigerator',cabinets:'storage cabinet',tools:'electric drill',materials:'wall panel',supplies:'construction adhesive'}[department]);
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
 if(!target.querySelector('[data-product]'))target.innerHTML='<p class="empty">No confirmed products are available in this category yet. Please check back.</p>';
}
