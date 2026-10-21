const furnitureAssetVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'us-warehouse-20261021';
document.addEventListener('DOMContentLoaded',async()=>{
 const {catalog,categories}=await import('/store-catalog.js?v='+encodeURIComponent(furnitureAssetVersion));
 const {cardHtml,priceCards}=await import('/store-cards.js?v='+encodeURIComponent(furnitureAssetVersion));
 const params=new URLSearchParams(location.search),category=params.get('category'),productId=params.get('product');
 const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const link=p=>'/furniture.html?category='+p.category+'&product='+p.id;
 const finish=()=>{updateCartCount();initNavMenus();};
 if(!productId){
  const list=catalog.filter(p=>!categories[category]||p.category===category).sort((a,b)=>a.name.localeCompare(b.name));
  document.body.innerHTML=header()+`<main class="wrap section"><nav aria-label="Breadcrumb"><a href="/shopping.html">Shopping</a> → <a href="/furniture.html">Furniture</a>${categories[category]?' → '+esc(categories[category]):''}</nav><h1>${esc(categories[category]||'Furniture & Accessories')}</h1><nav class="store-categories" aria-label="Furniture rooms"><a class="btn outline" href="/furniture.html">All Furniture</a>${Object.entries(categories).map(([key,name])=>`<a class="btn outline" href="/furniture.html?category=${encodeURIComponent(key)}">${esc(name)}</a>`).join('')}</nav><p class="lead">Furniture and accessories confirmed in U.S. supplier warehouses. Product manufacturing origin is not verified. Item prices are shown before shipping and tax.</p><div class="store-card-grid" id="store-list">${list.map(cardHtml).join('')}</div><p id="us-load-status" role="status" aria-live="polite">Checking U.S. warehouse inventory and prices…</p><div id="store-more"></div><p>Online payment is coming soon. Check delivery on any available item.</p></main>`+footer();
  finish();
  const grid=document.getElementById('store-list');
  const status=document.getElementById('us-load-status');
  const seen=new Set(list.map(p=>p.id));
  const normalizeName=name=>String(name||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const seenNames=new Set(list.map(p=>normalizeName(p.name)));
  const seenImages=new Set(list.map(p=>p.image).filter(Boolean));
  await priceCards(grid);
  const rooms=categories[category]?[category]:['living-room','bedroom','dining-room','home-office','outdoor'];
  let morePage=1,moreTotal=1;
  // Supplier search is only a list of CANDIDATES. Do not show any card
  // until the product-detail endpoint verifies real US warehouse variant stock.
  // Always replace search-result prices with verified variant retail prices.
  const loadMore=async(cat,page)=>{
   const r=await fetch('/api/us-furniture?category='+encodeURIComponent(cat)+'&page='+page);
   if(!r.ok)throw Error('U.S. supplier catalog temporarily unavailable.');
   const response=await r.json();
   let added=0;
   const candidates=(response.products||[]).slice(0,categories[category]?10:3);
   for(const p of candidates){
    if(seen.has(p.id)||seenNames.has(normalizeName(p.name))||seenImages.has(p.image))continue;
    try{
     const detailResponse=await fetch('/api/store-product?product='+encodeURIComponent(p.id),{cache:'no-store'});
     if(!detailResponse.ok)continue;
     const detail=await detailResponse.json();
     const variants=(detail.variants||[]).filter(v=>
       Number.isSafeInteger(v.priceCents)&&v.priceCents>0&&Number.isFinite(Number(v.usStock))&&Number(v.usStock)>0);
     if(!detail.inStockUS||detail.warehouseCountry!=='US'||!variants.length)continue;
     const currentPrice=Math.min(...variants.map(v=>v.priceCents));
     const name=detail.name||p.name, image=detail.image||p.image, normalized=normalizeName(name);
     if(!normalized||seenNames.has(normalized)||seenImages.has(image))continue;
     const approved={id:p.id,name,category:p.category,image,priceCents:currentPrice,stockVerified:true};
     seen.add(p.id);seenNames.add(normalized);seenImages.add(image);
     grid.insertAdjacentHTML('beforeend',cardHtml(approved));added++;
    }catch{
     // Temporary supplier failures are not evidence of US stock or a valid price.
     // Never publish that item during this attempt.
    }
   }
   if(categories[category])moreTotal=Number(response.totalPages)||page;
   return added;
  };
  let count=0,errors=0;
  for(const room of rooms){
   try{count+=await loadMore(room,1);}
   catch{errors++;}
  }
  const more=document.getElementById('store-more');
  if(categories[category]&&moreTotal>1){
   const btn=document.createElement('button');btn.className='btn outline';
   btn.textContent='Load more U.S. warehouse items';more.appendChild(btn);
   btn.addEventListener('click',async()=>{
    btn.disabled=true;status.textContent='Checking more U.S. supplier stock…';
    try{
     await loadMore(category,++morePage);
     if(morePage>=moreTotal)btn.remove();
     status.textContent='Showing verified U.S. warehouse listings. Manufacturing origin is not verified.';
    }catch{morePage--;status.textContent='Supplier temporarily unavailable. Try again.';}
    btn.disabled=false;
   });
  }
  status.textContent=(grid.querySelectorAll('.store-card').length?
   'Showing U.S. warehouse listings with prices. Country of manufacture is not verified.':
   'No verified U.S. warehouse listings are available in this selection right now.')+
   (errors?' Some supplier searches are temporarily unavailable.':'');
  return;
 }
 let item=catalog.find(p=>p.id===productId);
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
 document.body.innerHTML=header()+`<main class="wrap section"><nav aria-label="Breadcrumb"><a href="/shopping.html">Shopping</a> → <a href="/furniture.html">Furniture</a> → <a href="/furniture.html?category=${item.category}">${esc(categories[item.category])}</a></nav><h1>${esc(item.name)}</h1><div class="store-product"><div><img id="store-photo" alt="${esc(item.name)}" src="${esc(item.image)}"></div><div><p id="store-price" class="price">Checking current price…</p><label for="store-variant">Available option</label><select id="store-variant" disabled></select><p>Ships from a U.S. supplier warehouse. Manufacturing origin not verified. Delivery and applicable tax calculated before payment.</p>${item.id==='1963146233541074945'?'<p>Rustic brown finish with a drawer and open storage. Assembled: 17″ long × 18″ wide × 24″ high. Particle board and MDF. One nightstand.</p>':''}<form id="delivery-form"><label for="delivery-zip">Delivery ZIP code</label><div class="delivery-row"><input id="delivery-zip" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required placeholder="ZIP code"><button class="btn primary" id="quote-button" disabled>Check delivery</button></div></form><p id="store-message" role="status" aria-live="polite"></p><div id="order-summary" hidden></div><button id="store-buy" class="btn primary" hidden>Continue to secure payment</button><p class="calc-note">Questions? <a href="tel:6782314377">Call 678-231-4377</a> or <a href="sms:4709912133">text 470-991-2133</a>.</p><a class="btn outline" href="/furniture.html?category=${item.category}">Keep shopping</a></div></div></main>`+footer();finish();
 const $=id=>document.getElementById(id);let quote=null,quoteVersion=0,variants=[];
 const reset=()=>{quoteVersion++;quote=null;$('store-buy').hidden=true;$('order-summary').hidden=true;$('store-message').textContent='';};
 const option=()=>variants.find(v=>v.id===$('store-variant').value);
 $('delivery-zip').addEventListener('input',reset);
 $('store-variant').addEventListener('change',()=>{reset();const v=option();$('store-price').textContent=money(v.priceCents);$('store-photo').src=v.image||item.image;});
 try{const r=preloaded?null:await fetch('/api/store-product?product='+encodeURIComponent(item.id));const p=preloaded||await r.json();if((r&&!r.ok)||!p.variants?.length||!p.inStockUS)throw Error('This item is temporarily unavailable. Please check back.');variants=p.variants;$('store-variant').innerHTML=variants.map(v=>`<option value="${esc(v.id)}">${esc(v.name||v.sku)}</option>`).join('');if(item.variantId&&variants.some(v=>v.id===item.variantId))$('store-variant').value=item.variantId;$('store-variant').disabled=false;$('store-price').textContent=money(option().priceCents);$('quote-button').disabled=false;}catch(e){$('store-price').textContent='';$('store-message').textContent=e.message;}
 $('delivery-form').addEventListener('submit',async e=>{e.preventDefault();if(!option())return;reset();const version=quoteVersion;$('store-buy').disabled=false;$('quote-button').disabled=true;$('store-message').textContent='Checking availability and delivery…';try{const query=new URLSearchParams({product:item.id,variant:option().id,zip:$('delivery-zip').value});const r=await fetch('/api/store-quote?'+query);const q=await r.json();if(version!==quoteVersion)return;if(!r.ok)throw Error(q.error||'Unable to check delivery.');quote=q;$('order-summary').textContent='Item '+money(q.productCents)+' + delivery '+money(q.deliveryCents)+' = '+money(q.subtotalCents)+' before tax.';$('order-summary').hidden=false;$('store-message').textContent=q.checkoutEnabled?'Review your delivery details before secure payment.':'Delivery quote ready. Online payment is coming soon. Call or text with questions.';$('store-buy').hidden=!q.checkoutEnabled;if(q.totalCents!==null)$('order-summary').textContent+=' Tax '+money(q.taxCents)+'. Total '+money(q.totalCents)+'.';}catch(e){if(version===quoteVersion)$('store-message').textContent=e.message;}finally{$('quote-button').disabled=false;}});
 $('store-buy').addEventListener('click',async()=>{if(!quote?.checkoutEnabled)return;$('store-buy').disabled=true;try{const r=await fetch('/api/store-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:item.id,zip:quote.zip,expectedTotal:quote.totalCents,requestId:crypto.randomUUID()})});const data=await r.json();if(!r.ok)throw Error(data.error);location.assign(data.url);}catch(e){$('store-message').textContent=e.message;$('store-buy').disabled=false;}});
 if(params.get('payment')==='returned')$('store-message').textContent='If your payment was completed, Square will send your receipt. We will verify payment and contact you with order updates.';
});
