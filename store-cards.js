import {catalog,categories} from './store-catalog.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
export function cardHtml(p){return `<article class="store-card" data-product="${p.id}"><a href="/furniture.html?category=${p.category}&product=${p.id}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><div class="store-card-copy"><p class="store-card-category">${esc(categories[p.category])}</p><h3>${esc(p.name)}</h3><p class="store-card-price" aria-live="polite">Checking price…</p><p class="store-card-note">Delivery &amp; tax calculated separately</p><span class="btn primary">View item</span></div></a></article>`;}
export async function priceCards(container){
 for(const card of container.querySelectorAll('[data-product]')){
  const label=card.querySelector('.store-card-price');
  try{const r=await fetch('/api/store-product?product='+card.dataset.product);const p=await r.json();const prices=(p.variants||[]).map(v=>v.priceCents).filter(n=>Number.isSafeInteger(n)&&n>0);if(!r.ok||!prices.length)throw Error();label.textContent=(new Set(prices).size>1?'From ':'')+money(Math.min(...prices));}
  catch{label.textContent='Price temporarily unavailable';}
 }
}
export function renderRoomCards(container,category){const items=catalog.filter(p=>p.category===category).sort((a,b)=>a.name.localeCompare(b.name));container.classList.add('store-card-grid');container.innerHTML=items.map(cardHtml).join('');return priceCards(container);}
