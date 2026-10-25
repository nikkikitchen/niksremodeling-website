const assetVersion=new URL(import.meta.url).searchParams.get('v')||'us-warehouse-20261021';
const {catalog,categories}=await import('./store-catalog.js?v='+encodeURIComponent(assetVersion));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
export function cardHtml(p){
 const priced=Number.isSafeInteger(p.priceCents)&&p.priceCents>0;
 const verified=priced&&p.stockVerified===true;
 const price=priced?(verified?'From ':'Last checked: from ')+money(p.priceCents):'Price confirmation needed';
 const note=verified?'U.S. warehouse stock checked':priced?'Price checked '+esc(p.priceCheckedAt)+' · Confirm current price and stock':'Contact us for current price and availability';
 return `<article class="store-card" data-product="${esc(p.id)}" data-verified="${verified?'true':'false'}"${priced&&!verified?` data-saved-price="${p.priceCents}" data-price-checked="${esc(p.priceCheckedAt)}"`:''}><a href="/furniture.html?category=${encodeURIComponent(p.category)}&product=${encodeURIComponent(p.id)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><div class="store-card-copy"><p class="store-card-category">${esc(categories[p.category]||p.category)}</p><h3>${esc(p.name)}</h3><p class="store-card-price" aria-live="polite">${price}</p><p class="store-card-note">${note} · Shipping &amp; tax extra</p><span class="btn primary">View item</span></div></a></article>`;
}
export async function priceCards(container){
 for(const card of container.querySelectorAll('[data-product]')){
  const label=card.querySelector('.store-card-price');
  const note=card.querySelector('.store-card-note');
  try{
   const r=await fetch('/api/store-product?product='+encodeURIComponent(card.dataset.product));
   const p=await r.json();
   const prices=(p.variants||[]).filter(v=>Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number(v.usStock)>0).map(v=>v.priceCents);
   if(!r.ok||!prices.length||!p.inStockUS||p.warehouseCountry!=='US')throw Error('No confirmed U.S. stock');
   label.textContent=(new Set(prices).size>1?'From ':'')+money(Math.min(...prices));
   card.hidden=false;card.dataset.verified='true';
   note.textContent='U.S. warehouse stock checked · Shipping & tax extra';
  }catch{
   card.hidden=false;card.dataset.verified='false';
   const saved=Number(card.dataset.savedPrice);
   label.textContent=Number.isSafeInteger(saved)&&saved>0?'Last checked: from '+money(saved):'Price confirmation needed';
   note.textContent=(saved>0?'Price checked '+card.dataset.priceChecked+' · Confirm current price and stock':'Contact us for current price and availability')+' · Shipping & tax extra';
  }
 }
}
export function renderRoomCards(container,category){
 const items=catalog.filter(p=>p.category===category).sort((a,b)=>a.name.localeCompare(b.name));
 container.classList.add('store-card-grid');container.innerHTML=items.map(cardHtml).join('');
 return priceCards(container);
}
