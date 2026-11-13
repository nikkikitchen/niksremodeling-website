const version=new URL(import.meta.url).searchParams.get('v')||'catalog';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>(c/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
let catalogPromise;
export async function catalog(){
 if(!catalogPromise)catalogPromise=fetch('/api/catalog',{cache:'no-store'}).then(async response=>{
  const data=await response.json();return {configured:data.configured===true,products:response.ok?data.products:[],categories:response.ok?data.categories:[],error:response.ok?null:data.error};
 }).catch(()=>({configured:false,products:[],categories:[]}));
 return catalogPromise;
}
function card(product,context){return '<article class="central-product card"><img loading="lazy" src="'+esc(product.images[0])+'" alt="'+esc(product.name)+'"><div><h3>'+esc(product.name)+'</h3><p>'+esc(product.description)+'</p><strong>'+money(product.sellingPriceCents)+' / '+esc(product.unit)+'</strong><p>'+(product.shippingRequired?'Shipping and tax need confirmation.':'Tax needs confirmation.')+'</p><a class="btn outline" href="/catalog.html?'+new URLSearchParams({product:product.id,...(context?{context}:{})})+'">View item</a></div></article>';}
function addStyles(){if(document.getElementById('central-catalog-style'))return;const style=document.createElement('style');style.id='central-catalog-style';style.textContent='.central-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}.central-product{min-width:0;overflow:hidden;border:1px solid #d6e0e8;border-radius:10px}.central-product img{width:100%;height:220px;object-fit:cover}.central-product>div{padding:16px}.central-product h3{margin:0 0 8px}.central-product p{overflow-wrap:anywhere}.central-product-detail img{max-width:100%;max-height:440px;object-fit:contain}.central-links{display:flex;flex-wrap:wrap;gap:10px;margin:15px 0}.central-related{margin:25px 0;padding:20px;border-top:1px solid #d6e0e8}';document.head.append(style);}
export async function mountManagedCatalog(target,contexts=[]){
 const data=await catalog();if(!data.configured)return false;
 addStyles();const products=data.products.filter(p=>!contexts.length||p.contexts.some(c=>contexts.includes(c)||contexts.some(prefix=>c.startsWith(prefix+'/'))));
 target.innerHTML=data.error?'<p role="status">The product catalog is temporarily unavailable.</p>':products.length?'<div class="central-products">'+products.map(p=>card(p,contexts[0])).join('')+'</div>':'<p role="status">No verified available products in this category. Please contact us for a product quote.</p>';
 return true;
}
export async function managedDepartment(department){
 const data=await catalog();if(!data.configured)return false;
 const params=new URLSearchParams(location.search),category=params.get('category')||params.get('type');
 document.body.innerHTML=header()+'<main class="wrap section"><a href="/shopping.html">← Shopping</a><h1>'+esc(department==='bathroom'?'Bathroom Fixtures':department[0].toUpperCase()+department.slice(1))+'</h1><div id="central-department"></div></main>'+footer();
 const key='shopping:'+department+(category?'/'+category.toLowerCase().replace(/[^a-z0-9]+/g,'-'):'');
 await mountManagedCatalog(document.getElementById('central-department'),[key]);updateCartCount();initNavMenus();await syncPlacements();return true;
}
export async function mountSearch(target,query){
 const data=await catalog();if(!data.configured)return false;addStyles();
 const words=String(query).toLowerCase().split(/\s+/).filter(Boolean);
 const matches=data.products.filter(p=>words.every(word=>(p.name+' '+p.description).toLowerCase().includes(word)));
 target.innerHTML='<p>'+matches.length+' available products</p><div class="central-products">'+matches.map(p=>card(p,null)).join('')+'</div>';return true;
}
async function syncPlacements(){
 const data=await catalog();if(!data.configured)return;addStyles();
 // All placements come from the same records, including new owner-created categories.
 const occupied=new Set(data.products.flatMap(p=>p.contexts));
 for(const id of ['shopping-menu','mobile-shopping-menu']){
  const menu=document.getElementById(id);if(!menu)continue;
  menu.querySelectorAll('[data-central-link]').forEach(x=>x.remove());
  for(const category of data.categories.filter(c=>c.context.startsWith('shopping:')&&occupied.has(c.context))){
   const a=document.createElement('a');a.dataset.centralLink='true';a.textContent=category.label;a.href='/catalog.html?'+new URLSearchParams({context:category.context});menu.append(a);
  }
 }
 const params=new URLSearchParams(location.search),project=params.get('project'),work=params.get('material');
 let contexts=[];
 if(project)contexts.push('project:'+project);
 if(document.body.dataset.page==='installation'||location.pathname==='/installation.html')contexts.push(...data.categories.filter(c=>c.context.startsWith('labor:')).map(c=>c.context));
 if(work)contexts.push('work:'+work);
 const cart=typeof getCart==='function'?getCart():[];
 for(const item of cart)if(item.projectId&&item.packageId)contexts.push(...data.categories.filter(c=>c.context.startsWith('package:'+item.projectId+'/'+item.packageId+'/')).map(c=>c.context));
 const matched=data.categories.filter(c=>contexts.includes(c.context));
 if(!matched.length)return;
 document.getElementById('central-related')?.remove();
 const section=document.createElement('section');section.id='central-related';section.className='central-related wrap';
 const heading=document.createElement('h2');heading.textContent='Products for this work';section.append(heading);
 const links=document.createElement('div');links.className='central-links';
 for(const c of matched){const a=document.createElement('a');a.className='btn outline';a.textContent=c.label;a.href='/catalog.html?'+new URLSearchParams({context:c.context});links.append(a);}section.append(links);document.querySelector('main')?.append(section);
}
async function renderPage(){
 if(!document.getElementById('central-catalog'))return;
 document.body.innerHTML=header()+'<main class="wrap section"><a href="/shopping.html">← Shopping</a><h1>Available Products</h1><div id="central-catalog"></div></main>'+footer();
 const data=await catalog(),target=document.getElementById('central-catalog'),params=new URLSearchParams(location.search),context=params.get('context'),id=params.get('product');
 if(!data.configured){target.innerHTML='<p role="status">The managed catalog is being connected. <a href="/shopping.html">Browse current Shopping categories</a>.</p>';initNavMenus();return;}
 if(!id){await mountManagedCatalog(target,context?[context]:[]);initNavMenus();return;}
 const product=data.products.find(p=>p.id===id&&(!context||p.contexts.includes(context)));
 if(!product){target.textContent='This item is not currently available for a product quote.';initNavMenus();return;}
 addStyles();target.innerHTML='<article class="central-product-detail"><h2>'+esc(product.name)+'</h2>'+product.images.map(src=>'<img src="'+esc(src)+'" alt="'+esc(product.name)+'">').join('')+'<p>'+esc(product.description)+'</p><strong>'+money(product.sellingPriceCents)+' / '+esc(product.unit)+'</strong><p>Availability is checked again when adding to your quote. Shipping, tax and package fit require confirmation. Online payments are disabled.</p>'+(product.installationPriceCents!==null?'<p>Installation labor: '+money(product.installationPriceCents)+' per item; scope and supplies confirmed in the project quote.</p>':'')+'<form id="central-selection"><label>Quantity <input name="quantity" type="number" min="1" max="10000" step="1" value="1" required></label><button class="btn primary">Add to project quote</button></form><p id="central-selection-status" role="status"></p><a href="/project-cart.html">Review Cart</a></article>';
 document.getElementById('central-selection').onsubmit=async event=>{
  event.preventDefault();const button=event.target.querySelector('button'),status=document.getElementById('central-selection-status');button.disabled=true;
  try{
   const response=await fetch('/api/catalog-selection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:id,quantity:Number(event.target.elements.quantity.value),context}),cache:'no-store'}),result=await response.json();if(!response.ok)throw Error(result.error);
   const cart=getCart();const name=result.product.name+' — '+result.quantity+' '+result.product.unit;
   const line={source:'central-catalog',type:'Product quote',name,qty:result.quantity,productId:id,price:null,quoteRequired:true,
    catalogContext:context,catalogSellingPriceCents:result.product.sellingPriceCents,merchandiseEstimateCents:result.merchandiseCents,
    allowanceCents:result.allowanceCents,minimumUpgradeCents:result.minimumUpgradeCents,shippingAndTaxNotIncluded:true};
   const index=cart.findIndex(x=>x.source===line.source&&x.productId===id&&x.catalogContext===context);if(index<0)cart.push(line);else cart[index]=line;saveCart(cart);updateCartCount();
   status.textContent='Added to your project quote. '+(result.allowanceCents!==null?'Minimum merchandise upgrade: '+money(result.minimumUpgradeCents)+'. Delivered allowance still needs shipping and tax confirmation.':'Merchandise estimate: '+money(result.merchandiseCents)+'. Shipping and tax need confirmation.');
  }catch(error){status.textContent=error.message||'The product could not be verified.';}finally{button.disabled=false;}
 };initNavMenus();
}
if(typeof document!=='undefined'){
 const init=()=>{renderPage().then(syncPlacements).catch(()=>{});};
 let scheduled=false;
 new MutationObserver(()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;syncPlacements().catch(()=>{});},0);}).observe(document.body,{childList:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
}
