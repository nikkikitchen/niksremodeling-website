(() => {
  const style=document.createElement('style');
  style.textContent=`[hidden]{display:none!important}.nav .simple-nav{overflow:visible;gap:36px}.simple-nav>a,.shopping-toggle{font-size:16px;font-weight:700}.shopping-toggle{background:none;border:0;padding:17px 0;cursor:pointer;color:inherit}.simple-nav .review-link{margin-left:auto;display:flex;align-items:center;gap:7px}.review-link .cart-count{position:static;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px}.nav-menu.open .nav-dropdown{display:block}.nav-dropdown a{display:block;padding:11px 17px}.brandbar>.actions .cart-pill,.topline-cart>a,.room-supply-list,a[href*="supplies.html"],.project-related-supplies{display:none!important}.shopping-toggle .nav-main{padding:0}.nav .simple-nav{flex-wrap:wrap}.nav-menu{position:relative}.nav-dropdown{min-width:210px;max-height:min(70vh,520px);overflow-y:auto;overscroll-behavior:contain}.shopping-menu-divider{border-top:1px solid #ddd;margin:8px 0}@media(max-width:620px){.nav-menu .nav-dropdown{max-width:calc(100vw - 24px);max-height:65vh;overflow-y:auto}}.project-grid .tile span{text-align:center}body{padding-bottom:0}.project-shopping-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:#fff;border-top:1px solid #ddd;padding:12px 4%;display:flex;align-items:center;gap:12px;box-shadow:0 -2px 10px #0001}.project-shopping-bar span{flex:1;font-size:13px}.project-shopping-bar .btn{white-space:nowrap}@media(max-width:620px){body{padding-bottom:0}.project-shopping-bar{flex-wrap:wrap;padding:10px}.project-shopping-bar span{flex-basis:100%}.project-shopping-bar .btn{font-size:12px;padding:10px}}@media(max-width:620px){.nav .simple-nav{gap:12px}.simple-nav>a,.shopping-toggle{font-size:13px}.simple-nav .review-link{margin-left:0}}`;
  style.textContent+=`#shopping-menu a.shopping-empty,#mobile-shopping-menu a.shopping-empty{position:relative;padding-left:32px}#shopping-menu a.shopping-empty::before,#mobile-shopping-menu a.shopping-empty::before{content:"";position:absolute;left:15px;top:50%;transform:translateY(-50%);width:9px;height:9px;border-radius:50%;background:#d71920}.shopping-availability-note{margin:6px 0 0;padding:12px 15px;border-top:1px solid #ddd;font-size:12px;line-height:1.4;color:#555;white-space:normal}.shopping-availability-note span{display:inline-block;width:9px;height:9px;background:#d71920;border-radius:50%;margin-right:6px}`;
  document.head.append(style);
  window.searchProjects=function(e){e.preventDefault();const term=e.target.querySelector('input').value.trim().toLowerCase(),grid=document.getElementById('projects');if(!grid){location.href='/?search='+encodeURIComponent(term)+'#projects';return false;}grid.querySelectorAll('.tile').forEach(t=>t.hidden=!t.textContent.toLowerCase().includes(term));grid.scrollIntoView({behavior:'smooth'});return false;};
  function connect(){
 document.querySelectorAll('.photo-source').forEach(el=>el.remove());
 if(document.querySelector('main')&&!['calculators','project'].includes(document.body.dataset.page)&&!['/','/index.html'].includes(location.pathname)&&!document.getElementById('page-back-button')){const row=document.createElement('div');row.className='wrap';row.style.cssText='padding:20px 0';const back=document.createElement('button');back.id='page-back-button';back.type='button';back.className='btn outline';back.textContent='Back';back.onclick=()=>{if(history.length>1)history.back();else location.href='/#projects';};row.append(back);document.querySelector('main').append(row);}
 if(window.parent!==window)document.querySelectorAll('a[href="/project-cart.html"]').forEach(a=>a.target='_top');
 document.querySelectorAll('a[href="/calculators.html"]').forEach(a=>{a.href='/#projects';a.textContent='Projects';});
/* Search forms submit to /product-search.html; do not hijack them. */}
  connect();document.addEventListener('DOMContentLoaded',()=>{connect();});


  // Every page (including catalog pages with late-rendered headers) gets one
  // compact Shopping menu. All links go to the same project and product routes.
  const links=[["Appliances","/appliances.html"],["Bathroom Fixtures","/bathroom.html"],["Cabinets","/cabinets.html"],["Furniture & Accessories","/furniture.html"],["Materials","/materials.html"],["Other Ideas","/project.html?project=custom"],["Tools","/products.html"]];
  const departmentByPath={'/appliances.html':'appliances','/bathroom.html':'bathroom','/cabinets.html':'cabinets','/furniture.html':'furniture','/materials.html':'materials','/products.html':'tools','/project.html?project=custom':'custom'};
  let listedCounts=null;
  const availabilityVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'shopping-dots-20261025';
  Promise.all([
    import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion)),
    import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))
  ]).then(([{catalog},{retailCatalog}])=>{
    listedCounts={furniture:catalog.length};
    for(const department of Object.values(departmentByPath)){
      if(department!=='furniture')listedCounts[department]=retailCatalog.filter(p=>p.department===department).length;
    }
    syncShoppingMenu();
  }).catch(()=>{});
  function syncShoppingMenu(){
    document.querySelectorAll('#shopping-menu, #mobile-shopping-menu').forEach(menu=>{
      const state='category-links-v4-'+Boolean(listedCounts);
      if(menu.dataset.unifiedShopping===state)return;
      menu.replaceChildren();
      for(const [label,url] of links){
        const a=document.createElement('a');a.textContent=label;a.href=url;
        const department=departmentByPath[url];
        if(department&&listedCounts?.[department]===0){
          a.classList.add('shopping-empty');
          a.title='No products listed yet';
          a.setAttribute('aria-label',label+' — no products listed yet');
        }
        menu.append(a);
      }
      const note=document.createElement('p');note.className='shopping-availability-note';
      note.innerHTML='<span aria-hidden="true"></span>Red dot = No items listed yet.';
      menu.append(note);
      menu.dataset.unifiedShopping=state;
    });
  }
  function connectSearchForms(){
    document.querySelectorAll('form.search').forEach(form=>{
      form.setAttribute('action','/product-search.html');
      form.setAttribute('method','get');
      form.removeAttribute('onsubmit');
      form.onsubmit=null;
      const input=form.querySelector('input');
      if(input){
        input.name='q';
        input.setAttribute('aria-label','Search products and projects');
        input.placeholder='Search products and projects…';
      }
    });
  }
  syncShoppingMenu();connectSearchForms();
  document.addEventListener('DOMContentLoaded',()=>{syncShoppingMenu();connectSearchForms();});
  new MutationObserver(()=>{syncShoppingMenu();connectSearchForms();}).observe(document.body,{childList:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.nav-menu').forEach(m=>{m.classList.remove('open');m.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');});});
})();
