const furnitureAssetVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'us-warehouse-20261021';

const furnitureCategoryPhotos={
 'all':'/assets/approved-7e5510c3dce7.jpg',
 'bathroom':'/assets/approved-a908c20ce632.jpg',
 'bedroom':'/assets/approved-807c60a6001a.jpg',
 'decor':'/assets/approved-8d4db6742d08.jpg',
 'dining-room':'/assets/approved-a051ee7e1935.jpg',
 'entryway':'/assets/approved-4de99f88049f.jpg',
 'home-office':'/assets/approved-6075be404407.jpg',
 'kids-room':'/assets/kids-room.jpg',
 'lighting':'/assets/lighting-card.jpg',
 'living-room':'/assets/approved-4822ff53e23f.jpg',
 'outdoor':'/assets/approved-a11ab0fcd37f.jpg',
 'storage':'/assets/approved-8a9d216224b8.jpg'
};

document.addEventListener('DOMContentLoaded',async()=>{
 const {catalog,categories,inCategory,relatedCategories}=await import('/store-catalog.js?v='+encodeURIComponent(furnitureAssetVersion));
 const {cardHtml,priceCards}=await import('/store-cards.js?v='+encodeURIComponent(furnitureAssetVersion));
 const params=new URLSearchParams(location.search),requestedCategory=params.get('category'),productId=params.get('product');
 const categoryAliases={"living room":"living-room","bedroom":"bedroom","dining room":"dining-room","home office":"home-office","outdoor furniture":"outdoor","décor & accessories":"decor"};
 const category=categories[requestedCategory]?requestedCategory:(categoryAliases[(requestedCategory||'').trim().toLowerCase()]||requestedCategory);
 const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const link=p=>'/furniture.html?category='+p.category+'&product='+p.id;
 const finish=()=>{updateCartCount();initNavMenus();};
 if(!productId){
  const list=catalog.filter(p=>inCategory(p,category)).sort((a,b)=>a.name.localeCompare(b.name));
  document.body.innerHTML=header()+`<main class="wrap section"><nav aria-label="Breadcrumb"><a href="/shopping.html">Shopping</a> → <a href="/furniture.html">Furniture</a>${categories[category]?' → '+esc(categories[category]):''}</nav><h1>${esc(categories[category]||'Furniture & Accessories')}</h1>${categories[category]?'':`<nav class="store-categories photo-store-categories" aria-label="Furniture rooms"><a class="photo-category-tile" href="/furniture.html"><img loading="lazy" src="${furnitureCategoryPhotos.all}" alt=""><span><strong>All Furniture</strong></span></a>${Object.entries(categories).map(([key,name])=>`<a class="photo-category-tile" href="/furniture.html?category=${encodeURIComponent(key)}"><img loading="lazy" src="${furnitureCategoryPhotos[key]}" alt=""><span><strong>${esc(name)}</strong></span></a>`).join('')}</nav>`}<p class="lead">Browse furniture and accessories by room. Prices include our markup; delivery and tax are extra. Dated prices are the last checked prices and need confirmation before ordering.</p><div class="store-card-grid" id="store-list">${list.map(p=>cardHtml({...p,category:categories[category]?category:p.category})).join('')}</div><p id="us-load-status" role="status" aria-live="polite">Checking U.S. warehouse inventory and prices…</p><div id="store-more"></div><p>Online payment is coming soon. Check delivery on any available item.</p></main>`+footer();
  finish();
  const grid=document.getElementById('store-list');
  const status=document.getElementById('us-load-status');
  const seen=new Set(list.map(p=>p.id));
  const normalizeName=name=>String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const seenNames=new Set(list.map(p=>normalizeName(p.name)));
  const seenImages=new Set(list.map(p=>p.image).filter(Boolean));
  await priceCards(grid);
  // Each supplier result is only a candidate until we independently confirm
  // US warehouse variant stock and a current variant retail price.
  const selectedRoom=categories[category]?category:null;
  // Fetch sensible cross-room candidates, and then use the same stock check
  // and product ID regardless of how many categories show the item.
  const sourceRooms={
   'bedroom':['bedroom','living-room','home-office','kids-room'],
   'kids-room':['kids-room','living-room','bedroom','home-office'],
   'living-room':['living-room','bedroom','home-office'],
   'home-office':['home-office','bedroom','storage'],
   'storage':['storage','bedroom','home-office'],
   'dining-room':['dining-room','living-room'],
   'entryway':['entryway','living-room','storage'],
   'lighting':['lighting','decor'],
   'decor':['decor','lighting'],
   'bathroom':['bathroom','storage'],
   'outdoor':['outdoor']
  };
  const wantedSources=selectedRoom?(sourceRooms[selectedRoom]||[selectedRoom]):
    ['living-room','bedroom','dining-room','home-office','outdoor','kids-room'];
  const rooms=wantedSources.map(cat=>({cat,search:''}));
  if(!selectedRoom||['bedroom','kids-room','living-room','home-office','storage'].includes(selectedRoom)){
   rooms.push({cat:selectedRoom||'home-office',search:'shelving'});
  }
  if(!selectedRoom||['bedroom','kids-room','living-room'].includes(selectedRoom)){
   rooms.push({cat:'kids-room',search:'seating'});
  }
  const states=new Map();
  let supplierErrors=0,verificationErrors=0;
  const roomKey=room=>room.cat+':'+room.search;
  const showStatus=()=>{
   const visible=[...grid.querySelectorAll('.store-card')].filter(el=>!el.hidden&&el.dataset.verified==='true').length;
   const previews=[...grid.querySelectorAll('.store-card')].filter(el=>!el.hidden&&el.dataset.verified!=='true').length;
   status.textContent=(visible?
     'Showing '+visible+' furniture items with confirmed U.S. warehouse stock and checked prices.':
     'No furniture items could be verified for this view right now.')+
     (previews?' '+previews+' items need current price or stock confirmation. Dated prices show the last checked amount.':'')+
     (supplierErrors||verificationErrors?' Some supplier checks are temporarily unavailable.':'')+
     ' Manufacturing origin is not verified.';
  };
  const loadMore=async(room)=>{
   const key=roomKey(room);
   let state=states.get(key);
   if(!state){state={page:1,totalPages:1,pending:[],exhausted:false};states.set(key,state);}
   if(!state.pending.length&&!state.exhausted){
    try{
     const qs=new URLSearchParams({category:room.cat,page:String(state.page)});
     if(room.search)qs.set('search',room.search);
     const r=await fetch('/api/us-furniture?'+qs,{cache:'no-store'});
     if(!r.ok)throw Error('Supplier search unavailable');
     const data=await r.json();
     state.pending=(data.products||[]).filter(p=>p?.id&&p.name);
     state.totalPages=Math.max(state.page,Number(data.totalPages)||state.page);
     state.page++;
     state.exhausted=state.page>state.totalPages;
    }catch{supplierErrors++;return 0;}
   }
   const batch=state.pending.splice(0,selectedRoom?4:3);
   let added=0;
   for(const p of batch){
    if(seen.has(p.id)||seenNames.has(normalizeName(p.name))||seenImages.has(p.image))continue;
    try{
     const resp=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
     if(resp.status===503){verificationErrors++;state.pending.push(p);continue;}
     if(!resp.ok)continue;
     const detail=await resp.json();
     const variants=(detail.variants||[]).filter(v=>
       Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number(v.usStock)>0);
     if(!detail.inStockUS||detail.warehouseCountry!=='US'||!variants.length)continue;
     const name=detail.name||p.name;
     const normalized=normalizeName(name);
     const image=detail.image||p.image;
     const related=relatedCategories({name,category:room.cat});
     // One product can appear in several relevant rooms, never twice on a page.
     if(selectedRoom&&!related.includes(selectedRoom))continue;
     const displayCategory=selectedRoom||(/\b(kids?|children|child|toddler|nursery|playroom)\b/i.test(name)?'kids-room':room.cat);
     if(!normalized||seenNames.has(normalized)||seenImages.has(image))continue;
     const currentPrice=Math.min(...variants.map(v=>v.priceCents));
     const approved={id:p.id,name,category:displayCategory,image,priceCents:currentPrice,stockVerified:true};
     seen.add(p.id);seenNames.add(normalized);seenImages.add(image);
     grid.insertAdjacentHTML('beforeend',cardHtml(approved));
     added++;
    }catch{verificationErrors++;state.pending.push(p);}
   }
   return added;
  };
  for(const room of rooms)await loadMore(room);
  const more=document.getElementById('store-more');
  const btn=document.createElement('button');
  btn.className='btn outline';
  btn.type='button';
  btn.textContent='Load more U.S. warehouse furniture';
  more.appendChild(btn);
  btn.addEventListener('click',async()=>{
   btn.disabled=true;
   status.textContent='Verifying more U.S. warehouse inventory and prices…';
   let added=0;
   for(const room of rooms)added+=await loadMore(room);
   showStatus();
   if(!added)status.textContent+=' If stock checks fail, try again later.';
   btn.disabled=false;
  });
  showStatus();
  return;
 }
 let item=catalog.find(p=>p.id===productId);
 if(item&&categories[category]&&inCategory(item,category))item={...item,category};
 let preloaded=null;
 if(!item&&/^[\w-]{8,64}$/.test(productId)){
  try{
   const r=await fetch('/api/store-product?product='+encodeURIComponent(productId));
   const data=await r.json();
   if(r.ok&&data.inStockUS&&data.variants?.length){
    preloaded=data;
    item={id:data.id,name:data.name,image:data.image||'',category:categories[category]?category:'bedroom'};
   }
  }catch{}
 }
 if(!item){document.body.innerHTML=header()+'<main class="wrap section"><h1>Item not available from a U.S. warehouse</h1><a href="/furniture.html">Browse U.S. furniture</a></main>'+footer();finish();return;}
 document.body.innerHTML=header()+`<main class="wrap section"><nav aria-label="Breadcrumb"><a href="/shopping.html">Shopping</a> → <a href="/furniture.html">Furniture</a> → <a href="/furniture.html?category=${item.category}">${esc(categories[item.category])}</a></nav><h1>${esc(item.name)}</h1><div class="store-product"><div><img id="store-photo" alt="${esc(item.name)}" src="${esc(item.image)}"></div><div><p id="store-price" class="price">${Number.isSafeInteger(item.priceCents)&&item.priceCents>0?'Last checked: from '+money(item.priceCents):'Checking current price…'}</p><label for="store-variant">Available option</label><select id="store-variant" disabled></select><p>Ships from a U.S. supplier warehouse. Manufacturing origin not verified. Delivery and applicable tax calculated before payment.</p>${item.id==='1963146233541074945'?'<p>Rustic brown finish with a drawer and open storage. Assembled: 17″ long × 18″ wide × 24″ high. Particle board and MDF. One nightstand.</p>':''}<form id="delivery-form"><label for="delivery-zip">Delivery ZIP code</label><div class="delivery-row"><input id="delivery-zip" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required placeholder="ZIP code"><button class="btn primary" id="quote-button" disabled>Check delivery</button></div></form><p id="store-message" role="status" aria-live="polite"></p><div id="order-summary" hidden></div><button id="store-buy" class="btn primary" hidden>Continue to secure payment</button><p class="calc-note">Questions? <a href="tel:6782314377">Call 678-231-4377</a> or <a href="sms:4709912133">text 470-991-2133</a>.</p><a class="btn outline" href="/furniture.html?category=${item.category}">Keep shopping</a></div></div></main>`+footer();finish();
 const $=id=>document.getElementById(id);let quote=null,quoteVersion=0,variants=[];
 const reset=()=>{quoteVersion++;quote=null;$('store-buy').hidden=true;$('order-summary').hidden=true;$('store-message').textContent='';};
 const option=()=>variants.find(v=>v.id===$('store-variant').value);
 $('delivery-zip').addEventListener('input',reset);
 $('store-variant').addEventListener('change',()=>{reset();const v=option();$('store-price').textContent=money(v.priceCents);$('store-photo').src=v.image||item.image;});
 try{const r=preloaded?null:await fetch('/api/store-product?product='+encodeURIComponent(item.id));const p=preloaded||await r.json();if((r&&!r.ok)||!p.variants?.length||!p.inStockUS)throw Error('This item is temporarily unavailable. Please check back.');variants=p.variants;$('store-variant').innerHTML=variants.map(v=>`<option value="${esc(v.id)}">${esc(v.name||v.sku)}</option>`).join('');if(item.variantId&&variants.some(v=>v.id===item.variantId))$('store-variant').value=item.variantId;$('store-variant').disabled=false;$('store-price').textContent=money(option().priceCents);$('quote-button').disabled=false;}catch(e){$('store-price').textContent=Number.isSafeInteger(item.priceCents)&&item.priceCents>0?'Last checked: from '+money(item.priceCents):'Price confirmation needed';$('store-message').textContent=(item.priceCheckedAt?'Price checked '+item.priceCheckedAt+'. ':'')+'Current price and availability need confirmation. Call or text us about this item.';}
 $('delivery-form').addEventListener('submit',async e=>{e.preventDefault();if(!option())return;reset();const version=quoteVersion;$('store-buy').disabled=false;$('quote-button').disabled=true;$('store-message').textContent='Checking availability and delivery…';try{const query=new URLSearchParams({product:item.id,variant:option().id,zip:$('delivery-zip').value});const r=await fetch('/api/store-quote?'+query);const q=await r.json();if(version!==quoteVersion)return;if(!r.ok)throw Error(q.error||'Unable to check delivery.');quote=q;$('order-summary').textContent='Item '+money(q.productCents)+' + delivery '+money(q.deliveryCents)+' = '+money(q.subtotalCents)+' before tax.';$('order-summary').hidden=false;$('store-message').textContent=q.checkoutEnabled?'Review your delivery details before secure payment.':'Delivery quote ready. Online payment is coming soon. Call or text with questions.';$('store-buy').hidden=!q.checkoutEnabled;if(q.totalCents!==null)$('order-summary').textContent+=' Tax '+money(q.taxCents)+'. Total '+money(q.totalCents)+'.';}catch(e){if(version===quoteVersion)$('store-message').textContent=e.message;}finally{$('quote-button').disabled=false;}});
 $('store-buy').addEventListener('click',async()=>{if(!quote?.checkoutEnabled)return;$('store-buy').disabled=true;try{const r=await fetch('/api/store-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:item.id,zip:quote.zip,expectedTotal:quote.totalCents,requestId:crypto.randomUUID()})});const data=await r.json();if(!r.ok)throw Error(data.error);location.assign(data.url);}catch(e){$('store-message').textContent=e.message;$('store-buy').disabled=false;}});
 if(params.get('payment')==='returned')$('store-message').textContent='If your payment was completed, Square will send your receipt. We will verify payment and contact you with order updates.';
});
