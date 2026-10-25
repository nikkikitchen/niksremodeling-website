(() => {
  const style=document.createElement('style');
  style.textContent=`[hidden]{display:none!important}.nav .simple-nav{overflow:visible;gap:36px}.simple-nav>a,.shopping-toggle{font-size:16px;font-weight:700}.shopping-toggle{background:none;border:0;padding:17px 0;cursor:pointer;color:inherit}.simple-nav .review-link{margin-left:auto;display:flex;align-items:center;gap:7px}.review-link .cart-count{position:static;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px}.nav-menu.open .nav-dropdown{display:block}.nav-dropdown a{display:block;padding:11px 17px}.brandbar>.actions .cart-pill,.topline-cart>a,.room-supply-list,a[href*="supplies.html"],.project-related-supplies{display:none!important}.shopping-toggle .nav-main{padding:0}.nav .simple-nav{flex-wrap:wrap}.nav-menu{position:relative}.nav-dropdown{min-width:210px;max-height:min(70vh,520px);overflow-y:auto;overscroll-behavior:contain}.shopping-menu-divider{border-top:1px solid #ddd;margin:8px 0}@media(max-width:620px){.nav-menu .nav-dropdown{max-width:calc(100vw - 24px);max-height:65vh;overflow-y:auto}}.project-grid .tile span{text-align:center}body{padding-bottom:0}.project-shopping-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:#fff;border-top:1px solid #ddd;padding:12px 4%;display:flex;align-items:center;gap:12px;box-shadow:0 -2px 10px #0001}.project-shopping-bar span{flex:1;font-size:13px}.project-shopping-bar .btn{white-space:nowrap}@media(max-width:620px){body{padding-bottom:0}.project-shopping-bar{flex-wrap:wrap;padding:10px}.project-shopping-bar span{flex-basis:100%}.project-shopping-bar .btn{font-size:12px;padding:10px}}@media(max-width:620px){.nav .simple-nav{gap:12px}.simple-nav>a,.shopping-toggle{font-size:13px}.simple-nav .review-link{margin-left:0}}`;
  style.textContent+=`#shopping-menu a.shopping-empty,#mobile-shopping-menu a.shopping-empty{position:relative;padding-left:32px}#shopping-menu a.shopping-empty::before,#mobile-shopping-menu a.shopping-empty::before{content:"";position:absolute;left:15px;top:50%;transform:translateY(-50%);width:9px;height:9px;border-radius:50%;background:#d71920}.shopping-availability-note{margin:6px 0 0;padding:12px 15px;border-top:1px solid #ddd;font-size:12px;line-height:1.4;color:#555;white-space:normal}.shopping-availability-note span{display:inline-block;width:9px;height:9px;background:#d71920;border-radius:50%;margin-right:6px}`;
  style.textContent+=`.shopping-tile-empty strong::before,.shopping-tile-empty h3::before{content:"";display:inline-block;width:10px;height:10px;background:#d71920;border-radius:50%;margin-right:8px;vertical-align:middle}.shopping-tile-legend{margin:10px 0 20px;font-size:13px;color:#555}.shopping-tile-legend span{display:inline-block;width:9px;height:9px;background:#d71920;border-radius:50%;margin-right:6px}`;
  style.textContent+=`
#shopping-menu,#mobile-shopping-menu{overflow:visible!important;max-height:none!important;min-width:240px}
.shopping-category-toggle{position:relative;display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;border:0;background:transparent;padding:12px 16px;text-align:left;font-family:inherit;font-size:14px;font-weight:700;line-height:1.3;color:inherit;cursor:pointer;border-radius:6px}
.shopping-category-toggle:hover,.shopping-category-toggle:focus-visible,.shopping-category-toggle[aria-expanded="true"]{background:#e8f1fa;color:#073c70}
.shopping-category-toggle.shopping-empty{padding-left:32px}.shopping-category-toggle.shopping-empty::before{content:"";position:absolute;left:15px;top:50%;transform:translateY(-50%);width:9px;height:9px;background:#d71920;border-radius:50%}
.shopping-submenu{position:absolute;left:100%;top:0;width:290px;max-width:calc(100vw - 24px);max-height:var(--shopping-submenu-height,65vh);overflow-y:auto;background:#fff;border:1px solid #dfe5ea;border-radius:8px;padding:8px;box-shadow:0 14px 36px #1423321f;z-index:110}
.shopping-flyout-left .shopping-submenu{left:auto;right:100%}
.shopping-submenu a{white-space:normal!important;line-height:1.4}
@media(max-width:900px),(hover:none){#shopping-menu,#mobile-shopping-menu{overflow-y:auto!important;overflow-x:hidden!important;max-height:65vh!important;min-width:0}.shopping-submenu,.shopping-flyout-left .shopping-submenu{position:static;width:auto;max-width:none;max-height:none;overflow:visible;margin:0 4px 8px 14px;border:0;border-left:2px solid #dfe5ea;border-radius:0;box-shadow:none;padding:0 0 0 6px}.shopping-category-toggle{min-height:44px}.shopping-category-toggle[aria-expanded="true"] .shopping-submenu-arrow{transform:rotate(90deg)}}`;
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
  let listedCounts=null, furnitureListings=[], retailListings=[], furnitureCategoryMatch=null, furnitureCategories={};
  const availabilityVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'shopping-dots-20261025';
  Promise.all([
    import('/store-catalog.js?v='+encodeURIComponent(availabilityVersion)),
    import('/retail-catalog.js?v='+encodeURIComponent(availabilityVersion))
  ]).then(([{catalog,inCategory,categories},{retailCatalog}])=>{
    furnitureCategories=categories||{};
    furnitureListings=catalog;retailListings=retailCatalog;furnitureCategoryMatch=inCategory;
    listedCounts={furniture:catalog.length};
    for(const department of Object.values(departmentByPath)){
      if(department!=='furniture')listedCounts[department]=retailCatalog.filter(p=>p.department===department).length;
    }
    syncShoppingMenu();syncTileAvailability();
  }).catch(()=>{});
  function submenuLinks(department){
    const page=departmentByPath[department];
    if(page==='furniture')return Object.entries(furnitureCategories).map(([key,name])=>[name,'/furniture.html?category='+encodeURIComponent(key)]);
    if(page==='bathroom')return [['toilets','Toilets'],['bathtubs','Bathtubs'],['vanities','Vanities & Sinks'],['showers','Stand-up Showers'],['showerBases','Shower Pans & Bases'],['showerDoors','Shower Doors'],['faucets','Bathroom Faucets'],['lighting','Bathroom Lighting'],['ventilation','Ventilation & Fans'],['accessories','Mirrors & Accessories']].map(([key,name])=>[name,'/bathroom.html?type='+key]);
    if(page==='materials'&&typeof MATERIAL_DETAIL_PAGES!=='undefined')return Object.entries(MATERIAL_DETAIL_PAGES).map(([key,p])=>[p.title,'/material-'+key+'.html']);
    if(page==='custom'&&typeof PROJECT_CATALOG!=='undefined')return Object.entries(PROJECT_CATALOG).filter(([key,p])=>p.customGroup).map(([key,p])=>[p.title,'/project.html?project='+key]);
    if(typeof SHOP_GUIDES!=='undefined')return (SHOP_GUIDES[page]||[]).map(([name])=>[name,department+'?category='+encodeURIComponent(name)+'#catalog-products']);
    return [];
  }
  const hoverMenus=()=>Boolean(window.matchMedia?.('(hover: hover) and (min-width: 901px)').matches);
  function openShoppingBranch(branch,open){
    const menu=branch.parentElement;
    if(open){
      for(const sibling of menu.querySelectorAll(':scope > .shopping-branch'))if(sibling!==branch)openShoppingBranch(sibling,false);
      const bounds=menu.getBoundingClientRect();
      menu.classList.toggle('shopping-flyout-left',bounds.right+290>window.innerWidth&&bounds.left>=290);
      menu.style.setProperty('--shopping-submenu-height',Math.max(180,window.innerHeight-bounds.top-16)+'px');
    }
    branch.querySelector('.shopping-category-toggle').setAttribute('aria-expanded',String(open));
    branch.querySelector('.shopping-submenu').hidden=!open;
  }
  function markEmpty(control,label,count){
    if(count!==0)return;
    control.classList.add('shopping-empty');control.title='No items listed yet';
    control.setAttribute('aria-label',label+' — no items listed yet');
  }
  function syncShoppingMenu(){
    document.querySelectorAll('#shopping-menu, #mobile-shopping-menu').forEach(menu=>{
      const state='nested-shopping-v1-'+Boolean(listedCounts);
      if(menu.dataset.unifiedShopping===state)return;
      menu.replaceChildren();
      const ordered=links.slice().sort((a,b)=>a[0].startsWith('Other')?1:b[0].startsWith('Other')?-1:a[0].localeCompare(b[0]));
      for(const [label,url] of ordered){
        const children=submenuLinks(url).sort((a,b)=>a[0].localeCompare(b[0]));
        const branch=document.createElement('div');branch.className='shopping-branch';
        const button=document.createElement('button');button.type='button';button.className='shopping-category-toggle';
        button.append(document.createTextNode(label));const arrow=document.createElement('span');arrow.className='shopping-submenu-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');button.append(arrow);
        const submenu=document.createElement('nav');submenu.className='shopping-submenu';submenu.id=menu.id+'-'+departmentByPath[url];submenu.hidden=true;submenu.setAttribute('aria-label',label+' categories');
        button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',submenu.id);
        markEmpty(button,label,listedCounts?.[departmentByPath[url]]);
        for(const [name,href] of children){const link=document.createElement('a');link.textContent=name;link.href=href;markEmpty(link,name,tileListingCount(link));submenu.append(link);}
        if(!children.length){const link=document.createElement('a');link.textContent=label;link.href=url;submenu.append(link);}
        branch.append(button,submenu);menu.append(branch);
        button.addEventListener('click',event=>openShoppingBranch(branch,hoverMenus()&&event.detail>0?true:submenu.hidden));
        branch.addEventListener('mouseenter',()=>{if(hoverMenus())openShoppingBranch(branch,true);});
        branch.addEventListener('mouseleave',()=>{if(hoverMenus()&&!branch.contains(document.activeElement))openShoppingBranch(branch,false);});
        branch.addEventListener('keydown',event=>{
          if(['Escape','ArrowLeft'].includes(event.key)&&!submenu.hidden){event.preventDefault();event.stopPropagation();openShoppingBranch(branch,false);button.focus();}
          else if(event.target===button&&['ArrowRight','ArrowDown'].includes(event.key)){event.preventDefault();openShoppingBranch(branch,true);submenu.querySelector('a')?.focus();}
        });
      }
      const note=document.createElement('p');note.className='shopping-availability-note';note.innerHTML='<span aria-hidden="true"></span>Red dot = No items listed yet.';menu.append(note);
      menu.dataset.unifiedShopping=state;
    });
  }
  function tileListingCount(tile){
    if(!listedCounts)return null;
    // Material type cards are planning/category choices, never merchandise cards.
    if(tile.matches('.material-option-card')){
      const material=document.body.dataset.material;
      const type=tile.querySelector('h3')?.textContent.trim();
      return retailListings.filter(p=>p.department==='materials'&&p.material===material&&p.materialType===type).length;
    }
    const url=new URL(tile.href,location.href);
    if(url.origin!==location.origin)return null;
    const material=url.pathname.match(/^\/material-([a-z-]+)\.html$/)?.[1];
    if(material){
      const type=url.searchParams.get('type');
      return retailListings.filter(p=>p.department==='materials'&&p.material===material&&(!type||p.materialType===type)).length;
    }
    const department=departmentByPath[url.pathname]||(url.pathname==='/project.html'&&(url.searchParams.get('project')==='custom'||(typeof PROJECT_CATALOG!=='undefined'&&PROJECT_CATALOG[url.searchParams.get('project')]?.customGroup))?'custom':null);
    if(!department)return null;
    if(department==='furniture'){
      const category=url.searchParams.get('category');
      return furnitureListings.filter(p=>!category||furnitureCategoryMatch(p,category)).length;
    }
    const category=url.searchParams.get('category'),type=url.searchParams.get('type'),model=url.searchParams.get('model');
    return retailListings.filter(p=>p.department===department&&(!category||p.category===category)&&(!type||p.type===type)&&(!model||p.model===model)).length;
  }
  function syncTileAvailability(){
    if(!listedCounts)return;
    document.querySelectorAll('main .photo-category-tile,main .toilet-choice-tile,main .material-option-card').forEach(tile=>{
      const count=tileListingCount(tile);if(count===null)return;
      tile.classList.toggle('shopping-tile-empty',count===0);
      if(count===0){tile.setAttribute('title','No items listed yet');}
      else if(tile.getAttribute('title')==='No items listed yet')tile.removeAttribute('title');
    });
    document.querySelectorAll('.shopping-landing-grid,.shop-guide-grid,.picture-category-tabs,.photo-store-categories,.toilet-choice-grid,.material-detail-grid').forEach(grid=>{
      const existing=grid.nextElementSibling?.matches('.shopping-tile-legend')?grid.nextElementSibling:null;
      if(grid.querySelector('.shopping-tile-empty')){
        if(!existing){const note=document.createElement('p');note.className='shopping-tile-legend';note.innerHTML='<span aria-hidden="true"></span>Red dot = No items listed yet.';grid.after(note);}
      }else existing?.remove();
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
  syncShoppingMenu();syncTileAvailability();connectSearchForms();
  document.addEventListener('DOMContentLoaded',()=>{syncShoppingMenu();syncTileAvailability();connectSearchForms();});
  new MutationObserver(()=>{syncShoppingMenu();syncTileAvailability();connectSearchForms();}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.nav-menu').forEach(m=>{m.classList.remove('open');m.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');});});
})();
