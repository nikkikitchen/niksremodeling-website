// This page never invents prices or adds an item without verified supplier stock.
document.addEventListener('DOMContentLoaded',()=>{
 const entries=window.INSTALLABLE_SHOP_ITEMS||{};
 const groups=window.INSTALLABLE_SHOP_GROUPS||{};
 const key=new URLSearchParams(location.search).get('item');
 const item=entries[key];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
 // Take shoppers to the relevant labor category, not the generic top of the page.
 const installationLink=item=>{
  const department=String(item.department||'').toLowerCase();
  const group=String(item.group||'').toLowerCase();
  const name=String(item.name||'').toLowerCase();
  const category=department==='appliances'||group.includes('appliance')?'appliances':
   department==='bathroom'||group.includes('bath')?'bathroom':
   group.includes('electrical')||group.includes('lighting')?'electrical':
   group.includes('door')||group.includes('window')?'doors':
   group.includes('flooring')?'flooring':
   group.includes('exterior')||group.includes('deck')||group.includes('outdoor')?'exterior':
   group.includes('heating')||group.includes('ventilation')||group.includes('audio')?'electrical':
   group.includes('kitchen')||group.includes('plumbing')?'kitchen':
   name.includes('cabinet')?'cabinets':
   name.includes('drywall')?'drywall':
   name.includes('paint')||name.includes('wallpaper')||name.includes('stain')?'paint':
   name.includes('baseboard')||name.includes('molding')||name.includes('casing')||name.includes('shiplap')?'carpentry':null;
  return '/installation.html'+(category?'#labor-category-'+category:'');
 };
 let inner='';
 if(item){
  document.title=item.name+' | Nik’s Remodeling';
  inner='<a class="installed-back" href="/shop-installed.html">← All products we install</a>'+
   '<h1>'+esc(item.name)+'</h1><p class="installed-note">Shop '+esc(item.name.toLowerCase())+
   '. Prices and U.S.-warehouse stock must be verified before a product can be added to your cart. Equipment and installation labor are separate.</p>'+
   '<div id="installed-products" class="products" aria-live="polite"><p>Checking available products…</p></div>'+
   '<p><a href="'+esc(installationLink(item))+'" class="btn outline">View matching installation labor</a></p>';
 }else{
  inner='<a class="installed-back" href="/shopping.html">← Shopping</a><h1>Products We Install</h1>'+
   '<p class="installed-note">Choose a product type to find matching equipment or building materials. '+
   'Listings only become purchasable after current supplier availability and pricing are confirmed.</p>'+
   '<div class="installed-groups">'+Object.entries(groups).map(([name,products])=>'<section class="installed-group"><h2>'+esc(name)+'</h2>'+
    products.map(([label])=>{const id=slug(name)+'-'+slug(label);return '<a href="/shop-installed.html?item='+encodeURIComponent(id)+'">'+esc(label)+'</a>';}).join('')+
    '</section>').join('')+'</div>';
 }
 document.body.innerHTML=header()+'<main class="installed-shop">'+inner+'</main>'+footer();
 updateCartCount();initNavMenus();
 if(item){
  import('/real-products.js?v=installed-shopping-20261025').then(m=>
   m.mountCatalog(document.getElementById('installed-products'),{department:item.department,installKeyword:item.keyword})
  ).catch(()=>{const target=document.getElementById('installed-products');if(target)target.textContent='Current product availability could not be confirmed. Please try again.';});
 }
});
