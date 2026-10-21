const assetVersion=new URL(import.meta.url).searchParams.get('v')||'us-warehouse-20261021';
const {catalog,categories}=await import('./store-catalog.js?v='+encodeURIComponent(assetVersion));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
export function cardHtml(p){
 const priced=Number.isSafeInteger(p.priceCents)&&p.priceCents>0;
 const price=priced?'From '+money(p.priceCents):'Checking U.S. warehouse stock…';
 return `<article class="store-card" data-product="${esc(p.id)}" ${priced?'':'hidden'}><a href="/furniture.html?category=${encodeURIComponent(p.category)}&product=${encodeURIComponent(p.id)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><div class="store-card-copy"><p class="store-card-category">${esc(categories[p.category]||p.category)}</p><h3>${esc(p.name)}</h3><p class="store-card-price" aria-live="polite">${price}</p><p class="store-card-note">U.S. warehouse stock · Shipping &amp; tax extra · Origin not verified</p><span class="btn primary">View item</span></div></a></article>`;
}
export async function priceCards(container){
 for(const card of container.querySelectorAll('[data-product]')){
  const label=card.querySelector('.store-card-price');
  try{
   const r=await fetch('/api/store-product?product='+encodeURIComponent(card.dataset.product));
   const p=await r.json();
   const prices=(p.variants||[]).map(v=>v.priceCents).filter(n=>Number.isSafeInteger(n)&&n>0&&vIsInStock(p,n));
   if(!r.ok||!prices.length||!p.inStockUS)throw Error('No confirmed U.S. stock');
   label.textContent=(new Set(prices).size>1?'From ':'')+money(Math.min(...prices));
   card.hidden=false;
  }catch{card.remove();}
 }
}
function vIsInStock(p,n){return (p.variants||[]).some(v=>v.priceCents===n&&Number(v.usStock)>0);}
export function renderRoomCards(container,category){
 const items=catalog.filter(p=>p.category===category).sort((a,b)=>a.name.localeCompare(b.name));
 container.classList.add('store-card-grid');container.innerHTML=items.map(cardHtml).join('');
 return priceCards(container);
}
