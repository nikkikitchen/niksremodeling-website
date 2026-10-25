(() => {
  const style=document.createElement('style');
  style.textContent=`[hidden]{display:none!important}.nav .simple-nav{overflow:visible;gap:36px}.simple-nav>a,.shopping-toggle{font-size:16px;font-weight:700}.shopping-toggle{background:none;border:0;padding:17px 0;cursor:pointer;color:inherit}.simple-nav .review-link{margin-left:auto;display:flex;align-items:center;gap:7px}.review-link .cart-count{position:static;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px}.nav-menu.open .nav-dropdown{display:block}.nav-dropdown a{display:block;padding:11px 17px}.brandbar>.actions .cart-pill,.topline-cart>a,.room-supply-list,a[href*="supplies.html"],.project-related-supplies{display:none!important}.shopping-toggle .nav-main{padding:0}.nav .simple-nav{flex-wrap:wrap}.nav-menu{position:relative}.nav-dropdown{min-width:210px;max-height:min(70vh,520px);overflow-y:auto;overscroll-behavior:contain}.shopping-menu-divider{border-top:1px solid #ddd;margin:8px 0}@media(max-width:620px){.nav-menu .nav-dropdown{max-width:calc(100vw - 24px);max-height:65vh;overflow-y:auto}}.project-grid .tile span{text-align:center}body{padding-bottom:0}.project-shopping-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:#fff;border-top:1px solid #ddd;padding:12px 4%;display:flex;align-items:center;gap:12px;box-shadow:0 -2px 10px #0001}.project-shopping-bar span{flex:1;font-size:13px}.project-shopping-bar .btn{white-space:nowrap}@media(max-width:620px){body{padding-bottom:0}.project-shopping-bar{flex-wrap:wrap;padding:10px}.project-shopping-bar span{flex-basis:100%}.project-shopping-bar .btn{font-size:12px;padding:10px}}@media(max-width:620px){.nav .simple-nav{gap:12px}.simple-nav>a,.shopping-toggle{font-size:13px}.simple-nav .review-link{margin-left:0}}`;
  style.textContent+=`#shopping-menu a.shopping-empty,#mobile-shopping-menu a.shopping-empty{position:relative;padding-left:32px}#shopping-menu a.shopping-empty::before,#mobile-shopping-menu a.shopping-empty::before{content:"";position:absolute;left:15px;top:50%;transform:translateY(-50%);width:9px;height:9px;border-radius:50%;background:#d71920}.shopping-availability-note{margin:6px 0 0;padding:12px 15px;border-top:1px solid #ddd;font-size:12px;line-height:1.4;color:#555;white-space:normal}.shopping-availability-note span{display:inline-block;width:9px;height:9px;background:#d71920;border-radius:50%;margin-right:6px}`;
  style.textContent+='.installed-groups a.shopping-tile-empty::before{content:"";display:inline-block;width:10px;height:10px;margin-right:8px;border-radius:50%;vertical-align:middle;background:#d71920}.installed-group.shopping-tile-empty>h2::before{content:"";display:inline-block;width:10px;height:10px;margin-right:8px;border-radius:50%;background:#d71920}';
  style.textContent+=`.shopping-tile-empty strong::before,.shopping-tile-empty h3::before{content:"";display:inline-block;width:10px;height:10px;background:#d71920;border-radius:50%;margin-right:8px;vertical-align:middle}.shopping-tile-legend{margin:10px 0 20px;font-size:13px;color:#555}.shopping-tile-legend span{display:inline-block;width:9px;height:9px;background:#d71920;border-radius:50%;margin-right:6px}`;
  style.textContent+=`
#shopping-menu,#mobile-shopping-menu,#labor-menu,#mobile-labor-menu{overflow-y:auto!important;overflow-x:hidden!important;max-height:var(--shopping-menu-height,65vh)!important;min-width:240px}
.shopping-branch{position:relative}.shopping-category-toggle{position:relative;display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px;border:0;background:transparent;padding:12px 16px;text-align:left;font-family:inherit;font-size:14px;font-weight:700;line-height:1.3;color:inherit;cursor:pointer;border-radius:6px}
.shopping-category-toggle:hover,.shopping-category-toggle:focus-visible,.shopping-category-toggle[aria-expanded="true"]{background:#e8f1fa;color:#073c70}
.shopping-category-toggle.shopping-empty{padding-left:32px}.shopping-category-toggle.shopping-empty::before{content:"";position:absolute;left:15px;top:50%;transform:translateY(-50%);width:9px;height:9px;background:#d71920;border-radius:50%}
.shopping-submenu{position:fixed;left:var(--shopping-submenu-left,0px);top:var(--shopping-submenu-top,16px);width:290px;max-width:calc(100vw - 24px);height:var(--shopping-submenu-height,calc(100dvh - 32px));max-height:calc(100dvh - 32px);overflow-y:auto;background:#fff;border:1px solid #dfe5ea;border-radius:8px;padding:8px;box-shadow:0 14px 36px #1423321f;z-index:110}
.shopping-flyout-left .shopping-submenu{left:var(--shopping-submenu-left,0px);right:auto}
.shopping-submenu a{white-space:normal!important;line-height:1.4}
@media(max-width:900px),(hover:none){#shopping-menu,#mobile-shopping-menu,#labor-menu,#mobile-labor-menu{overflow-y:auto!important;overflow-x:hidden!important;max-height:65vh!important;min-width:0}.shopping-submenu,.shopping-flyout-left .shopping-submenu{position:static;width:auto;max-width:none;height:auto!important;max-height:none;overflow:visible;margin:0 4px 8px 14px;border:0;border-left:2px solid #dfe5ea;border-radius:0;box-shadow:none;padding:0 0 0 6px}.shopping-category-toggle{min-height:44px}.shopping-category-toggle[aria-expanded="true"] .shopping-submenu-arrow{transform:rotate(90deg)}}`;
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
  const links=[["Appliances","/appliances.html"],["Bathroom Fixtures","/bathroom.html"],["Cabinets","/cabinets.html"],["Furniture & Accessories","/furniture.html"],["Materials","/materials.html"],["Tools","/products.html"]];

  // Retail equipment/material choices complement (never change) approved labor prices.
  // No unverified item receives a sale price until inventory/variants are confirmed.
  const installedMenuChoices={},installableById={};
  const installableGroups={"Doors, Windows & Access":[["Attic Access Ladders","attic ladder","materials"],["Bifold Closet Doors","bifold door","materials"],["Door Hardware & Locks","door handle","materials"],["Exterior Doors","exterior door","materials"],["French Doors","french door","materials"],["Garage Door Insulation Kits","garage door insulation kit","materials"],["Grab Bars & Handrails","grab bar","materials"],["Interior Prehung Doors","prehung door","materials"],["Interior Slab Doors","interior door slab","materials"],["Pocket Doors","pocket door","materials"],["Sliding Barn Doors","barn door","materials"],["Storm Doors","storm door","materials"],["Thresholds & Weatherstripping","door threshold","materials"],["Windows","replacement window","materials"]],"Electrical, Lighting & Smart Home":[["Ceiling Fans","ceiling fan","materials"],["Ceiling Lights","ceiling light fixture","materials"],["Dimmer Switches","dimmer switch","materials"],["Doorbells & Smart Doorbells","smart doorbell","materials"],["Electrical Outlets & GFCI","gfci outlet","materials"],["Hardwired Smoke & CO Detectors","smoke detector","materials"],["Heated Towel Racks","heated towel rack","materials"],["Light Switches","light switch","materials"],["Smart Light Switches","smart light switch","materials"],["Smart Lighting Systems","smart light system","materials"],["Smart Thermostats","smart thermostat","materials"],["Under-Cabinet Lighting","under cabinet lighting","materials"],["Vanity Lights","vanity light","materials","/bathroom.html?type=lighting"]],"Exterior, Decks & Outdoor":[["Composite Deck Boards","composite decking","materials"],["Concrete Pavers","concrete paver","materials"],["Deck Boards","deck board","materials"],["Exterior Siding","exterior siding","materials"],["Exterior-Grade Shiplap","exterior shiplap","materials"],["Gutters","rain gutter","materials"],["Outdoor Light Fixtures","outdoor wall light","materials"],["Pergolas & Gazebos","pergola","materials"],["Roof Shingles","roof shingles","materials"],["Soffit & Fascia","soffit fascia","materials"]],"Flooring, Walls & Finishes":[["Baseboards & Shoe Molding","baseboard molding","materials"],["Carpet","carpet flooring","materials"],["Tile","ceramic tile","materials"],["Crown Molding","crown molding","materials"],["Door & Window Casing","door casing","materials"],["Drywall Panels","drywall panel","materials"],["Hardwood Flooring","hardwood flooring","materials"],["Interior Shiplap","shiplap boards","materials"],["Laminate Flooring","laminate flooring","materials"],["Luxury Vinyl Plank (LVP)","vinyl plank flooring","materials"],["Paint & Primer","interior wall paint","materials"],["Stone Veneer","stone veneer","materials"],["Wall Insulation","insulation board","materials"],["Wallpaper","wallpaper","materials"],["Wood Stain & Finish","wood stain","materials"]],"Heating, Ventilation & Audio":[["Built-In Speakers","in wall speaker","materials"],["Dryer Vent Kits","dryer vent duct","materials"],["Electric Wall Heaters","electric wall heater","materials"],["Exhaust Fans","exhaust fan","materials"],["Fireplace Inserts","electric fireplace insert","appliances"],["Infrared Heaters","infrared wall heater","materials"],["Outdoor Speakers","outdoor speaker","materials"],["Speaker Brackets","speaker wall mount","materials"],["TV Wall Mounts","tv wall mount","materials"]],"Kitchen & Plumbing":[["Backsplash Tile","backsplash tile","materials"],["Countertops","kitchen countertop","materials"],["Garbage Disposals","garbage disposal","appliances"],["Kitchen Faucets","kitchen faucet","materials"],["Kitchen Sinks","kitchen sink","materials"],["Shower Faucets & Valves","shower mixing valve","materials"],["Sink Drains & Plumbing Connections","sink drain assembly","materials"],["Water Supply Lines","refrigerator water supply line","materials"]]};
  for(const [group,products] of Object.entries(installableGroups)){
    const groupSlug=group.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
    const path='/shop-installed-'+groupSlug;
    installedMenuChoices[path]=products.map(([name,keyword,department,direct])=>{
      const id=(groupSlug+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-')).replace(/-$/,'');
      installableById[id]={name,keyword,department,group};
      return [name,direct||'/shop-installed.html?item='+encodeURIComponent(id)];
    });
    links.push([group,path]);
  }
  window.INSTALLABLE_SHOP_ITEMS=installableById;
  window.INSTALLABLE_SHOP_GROUPS=installableGroups;
  const installableExtras={"appliances":[["Beverage Refrigerators","beverage cooler","appliances"],["Built-In Microwaves","built in microwave","appliances"],["Double Wall Ovens","double wall oven","appliances"],["Dryer Vent Kits","dryer vent duct","materials"],["Electric Cooktops","electric cooktop","appliances"],["Electric Dryers","electric dryer","appliances"],["Fireplace Inserts","electric fireplace insert","appliances"],["Garbage Disposals","garbage disposal","appliances"],["Gas Cooktops","gas cooktop","appliances"],["Microwave/Oven Combinations","microwave oven combo","appliances"],["Over-Range Microwaves","over range microwave","appliances"],["Single Wall Ovens","single wall oven","appliances"],["Stacked Washer & Dryer Sets","stackable washer dryer","appliances"],["Trash Compactors","trash compactor","appliances"],["Warming Drawers","warming drawer","appliances"]],"cabinets":[["Cabinet End Panels","cabinet end panel","materials"],["Cabinet Filler Strips","cabinet filler strip","materials"],["Cabinet Toe Kicks","cabinet toe kick","materials"],["Cabinet Crown Molding","cabinet crown molding","materials"]],"bathroom":[["Round Toilets",null,null,"/bathroom.html?type=toilets&model=round"],["Elongated & Comfort Height Toilets",null,null,"/bathroom.html?type=toilets&model=elongated"],["Smart Toilets",null,null,"/bathroom.html?type=toilets&model=smart"],["Wall-Hung & Specialty Toilets",null,null,"/bathroom.html?type=toilets&model=specialty"],["Shower Faucets & Mixing Valves","shower mixing valve","materials"],["Toilet Tank Repair Parts","toilet fill flush valve","materials"]]};
  const extraMenuLinks={};
  for(const [department,items]of Object.entries(installableExtras)){
    extraMenuLinks[department]=items.map(([name,keyword,retailDepartment,direct])=>{
      if(direct)return [name,direct];
      const key=department+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
      installableById[key]={name,keyword,department:retailDepartment,group:department};
      return [name,'/shop-installed.html?item='+encodeURIComponent(key)];
    });
  }

  const departmentByPath={'/appliances.html':'appliances','/bathroom.html':'bathroom','/cabinets.html':'cabinets','/furniture.html':'furniture','/materials.html':'materials','/products.html':'tools'};
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
      if(department!=='furniture'&&department!=='custom')listedCounts[department]=retailCatalog.filter(p=>p.department===department).length;
    }
    syncShoppingMenu();syncTileAvailability();
  }).catch(()=>{});
  function submenuLinks(department){
    if(installedMenuChoices[department])return installedMenuChoices[department];
    const page=departmentByPath[department];
    if(page==='furniture')return Object.entries(furnitureCategories).map(([key,name])=>[name,'/furniture.html?category='+encodeURIComponent(key)]);
    if(page==='bathroom')return [['toilets','Toilets'],['bathtubs','Bathtubs'],['vanities','Vanities & Sinks'],['showers','Stand-up Showers'],['showerBases','Shower Pans & Bases'],['showerDoors','Shower Doors'],['faucets','Bathroom Faucets'],['lighting','Bathroom Lighting'],['ventilation','Ventilation & Fans'],['accessories','Mirrors & Accessories']].map(([key,name])=>[name,'/bathroom.html?type='+key]).concat(extraMenuLinks.bathroom);
    if(page==='materials'&&typeof MATERIAL_DETAIL_PAGES!=='undefined')return Object.entries(MATERIAL_DETAIL_PAGES).map(([key,p])=>[p.title,'/material-'+key+'.html']);
    if(typeof SHOP_GUIDES!=='undefined')return (SHOP_GUIDES[page]||[]).map(([name])=>[name,department+'?category='+encodeURIComponent(name)+'#catalog-products']).concat(extraMenuLinks[page]||[]);
    return [];
  }
  const hoverMenus=()=>Boolean(window.matchMedia?.('(hover: hover) and (pointer: fine)').matches);
  function fitShoppingMenu(menu){
    const top=menu.getBoundingClientRect().top;
    menu.style.setProperty('--shopping-menu-height',Math.max(80,window.innerHeight-Math.max(8,top)-16)+'px');
  }
  function positionShoppingSubmenu(branch){
    const menu=branch.parentElement,submenu=branch.querySelector('.shopping-submenu');
    if(!hoverMenus()||window.innerWidth<=900)return;
    const bounds=menu.getBoundingClientRect();
    const width=Math.min(290,window.innerWidth-24);
    // Every department opens a full-height flyout, even near the bottom.
    const top=16;
    const left=bounds.right+width>window.innerWidth-12?bounds.left-width+10:bounds.right-10;
    submenu.style.setProperty('--shopping-submenu-left',Math.max(12,Math.min(left,window.innerWidth-width-12))+'px');
    submenu.style.setProperty('--shopping-submenu-top',top+'px');
    submenu.style.setProperty('--shopping-submenu-height',Math.max(120,window.innerHeight-32)+'px');
  }
  function bindShoppingHover(menu){
    const wrapper=menu.parentElement;
    if(wrapper.dataset.shoppingHoverBound)return;
    wrapper.dataset.shoppingHoverBound='true';
    let closeTimer;
    const fit=()=>{fitShoppingMenu(menu);menu.querySelectorAll('.shopping-branch').forEach(branch=>{if(!branch.querySelector('.shopping-submenu').hidden)positionShoppingSubmenu(branch);});};
    wrapper.addEventListener('mouseenter',fit);
    wrapper.addEventListener('click',()=>setTimeout(fit,0));
    menu.addEventListener('scroll',fit);
    window.addEventListener('resize',fit);
    window.addEventListener('scroll',fit);

    // Opening from the top navigation label must not require a click.
    wrapper.addEventListener('mouseenter',()=>{
      if(!hoverMenus())return;
      clearTimeout(closeTimer);
      document.querySelectorAll('.nav-menu.open').forEach(other=>{
        if(other===wrapper)return;
        other.classList.remove('open');
        other.querySelector(':scope > .nav-toggle')?.setAttribute('aria-expanded','false');
        other.querySelectorAll(':scope > .nav-dropdown > .shopping-branch').forEach(branch=>openShoppingBranch(branch,false));
      });
      wrapper.classList.add('open');
      wrapper.querySelector(':scope > .nav-toggle')?.setAttribute('aria-expanded','true');
    });
    menu.addEventListener('mouseenter',()=>{
      // Keep the submenu open when the mouse returns before the close delay.
      if(!hoverMenus())return;
      clearTimeout(closeTimer);
      wrapper.classList.add('open');
      wrapper.querySelector(':scope > .nav-toggle')?.setAttribute('aria-expanded','true');
    });
    wrapper.addEventListener('mouseleave',()=>{
      if(!hoverMenus())return;
      clearTimeout(closeTimer);
      closeTimer=setTimeout(()=>{
        if(wrapper.matches(':hover'))return;
        for(const branch of menu.querySelectorAll(':scope > .shopping-branch'))openShoppingBranch(branch,false);
        wrapper.classList.remove('open');
        wrapper.querySelector(':scope > .nav-toggle')?.setAttribute('aria-expanded','false');
      },350);
    });
  }
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
    if(open){fitShoppingMenu(menu);positionShoppingSubmenu(branch);}
  }
  function markEmpty(control,label,count){
    if(count!==0)return;
    control.classList.add('shopping-empty');control.title='No items listed yet';
    control.setAttribute('aria-label',label+' — no items listed yet');
  }
  function bindCategoryBranch(branch){
    const button=branch.querySelector('.shopping-category-toggle'),submenu=branch.querySelector('.shopping-submenu');
button.addEventListener('click',event=>openShoppingBranch(branch,hoverMenus()&&event.detail>0?true:submenu.hidden));
        branch.addEventListener('mouseenter',()=>{if(hoverMenus())openShoppingBranch(branch,true);});
        branch.addEventListener('keydown',event=>{
          if(['Escape','ArrowLeft'].includes(event.key)&&!submenu.hidden){event.preventDefault();event.stopPropagation();openShoppingBranch(branch,false);button.focus();}
          else if(event.target===button&&['ArrowRight','ArrowDown'].includes(event.key)){event.preventDefault();openShoppingBranch(branch,true);submenu.querySelector('a')?.focus();}
        });
  }
  function syncShoppingMenu(){
    document.querySelectorAll('#shopping-menu, #mobile-shopping-menu').forEach(menu=>{
      const state='nested-shopping-v2-'+Boolean(listedCounts);
      if(menu.dataset.unifiedShopping===state)return;
      bindShoppingHover(menu);
      menu.replaceChildren();
      const ordered=links.slice().sort((a,b)=>a[0].startsWith('Other')?1:b[0].startsWith('Other')?-1:a[0].localeCompare(b[0]));
      for(const [label,url] of ordered){
        const children=submenuLinks(url).sort((a,b)=>a[0].localeCompare(b[0]));
        const branch=document.createElement('div');branch.className='shopping-branch';
        const button=document.createElement('button');button.type='button';button.className='shopping-category-toggle';
        button.append(document.createTextNode(label));const arrow=document.createElement('span');arrow.className='shopping-submenu-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');button.append(arrow);
        const submenu=document.createElement('nav');submenu.className='shopping-submenu';submenu.id=menu.id+'-'+(departmentByPath[url]||url.replace(/[^a-z0-9]+/gi,'-'));submenu.hidden=true;submenu.setAttribute('aria-label',label+' categories');
        button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',submenu.id);
        const department=departmentByPath[url];
        const childCounts=[];
        for(const [name,href] of children){
          const link=document.createElement('a');link.textContent=name;link.href=href;
          const count=tileListingCount(link);childCounts.push(count);
          markEmpty(link,name,count);submenu.append(link);
        }
        // Specialty shopping groups have no matching retail-catalog department.
        const count=listedCounts?.[department];
        markEmpty(button,label,count===undefined&&children.length&&childCounts.every(n=>n===0)?0:count);
        if(!children.length){const link=document.createElement('a');link.textContent=label;link.href=url;submenu.append(link);}
        branch.append(button,submenu);menu.append(branch);
        bindCategoryBranch(branch);
      }
      const note=document.createElement('p');note.className='shopping-availability-note';note.innerHTML='<span aria-hidden="true"></span>Red dot = No items listed yet.';menu.append(note);
      menu.dataset.unifiedShopping=state;
    });
  }
  // Menu groups link to existing expandable labor sections; installation.html
  // supplies the current catalog, while all other pages use matching group IDs.
  const laborNavFallback=[{"id":"appliances","label":"Appliances","groups":[]},{"id":"bathroom","label":"Bathroom","groups":[{"id":"toilet","label":"Toilets"},{"id":"faucet","label":"Faucets"},{"id":"sink","label":"Sinks"},{"id":"vanity","label":"Vanities"},{"id":"vanity-lights","label":"Vanity Lights"},{"id":"tub","label":"Bathtubs"},{"id":"shower","label":"Walk-in Showers"},{"id":"glass","label":"Shower Doors"},{"id":"fan","label":"Vent Fans"},{"id":"accessory","label":"Mirrors & Accessories"},{"id":"bath-tile","label":"Tile & Grout"},{"id":"bath-surfaces","label":"Walls & Ceilings"}]},{"id":"cabinets","label":"Cabinets & Vanities","groups":[{"id":"cabinet","label":"Cabinet Installation & Removal"},{"id":"refinishing","label":"Cabinet Refinishing"},{"id":"hardware","label":"Hardware"},{"id":"cabinet-adjustment","label":"Cabinet Adjustment"},{"id":"approved-cabinet-additions","label":"Trim & Preparation"}]},{"id":"carpentry","label":"Carpentry & Trim","groups":[{"id":"stairs","label":"Stairs & Railings"},{"id":"custom","label":"Custom Carpentry"},{"id":"carpentry-reviewed","label":"Carpentry & Trim Services"}]},{"id":"doors","label":"Doors & Windows","groups":[{"id":"doors-reviewed","label":"Doors & Windows"}]},{"id":"drywall","label":"Drywall & Texture","groups":[{"id":"drywall-reviewed","label":"Drywall Services"},{"id":"drywall-sheet-work","label":"Drywall Installation & Removal"},{"id":"drywall-packages","label":"Drywall Room Packages"},{"id":"ceiling-drywall","label":"Ceiling Drywall"},{"id":"ceiling-patches","label":"Ceiling Repairs"},{"id":"wall-ceiling-packages","label":"Walls & Ceiling Packages"}]},{"id":"electrical","label":"Electrical & Smart Home","groups":[{"id":"electrical-reviewed","label":"Electrical & Smart Home"}]},{"id":"exterior","label":"Exterior & Outdoor","groups":[{"id":"siding","label":"Siding"},{"id":"deck","label":"Decks & Steps"},{"id":"concrete","label":"Concrete"},{"id":"insulation","label":"Insulation"}]},{"id":"flooring","label":"Flooring & Tile","groups":[{"id":"flooring-calc","label":"Flooring Installation"},{"id":"floor-repair","label":"Flooring Repairs"},{"id":"grout","label":"Grout & Caulk"}]},{"id":"kitchen","label":"Kitchens & Countertops","groups":[{"id":"kitchen-plumbing","label":"Kitchen Sinks & Plumbing"},{"id":"kitchen-surfaces","label":"Countertops & Backsplash"}]},{"id":"other","label":"Other Labor & Delivery","groups":[{"id":"misc","label":"Miscellaneous Labor"},{"id":"assembly","label":"Furniture Assembly"},{"id":"delivery","label":"Delivery & Debris"},{"id":"approved-support","label":"Delivery, Placement & Demolition"}]},{"id":"paint","label":"Painting & Wallpaper","groups":[{"id":"painting","label":"Painting"},{"id":"wallpaper","label":"Wallpaper"},{"id":"door-finish","label":"Door Painting & Staining"},{"id":"paint-room-prices","label":"Room Painting"},{"id":"ceiling-room-paint","label":"Ceiling Painting"}]}];
  function syncLaborMenus(){
    document.querySelectorAll('#labor-menu,#mobile-labor-menu').forEach(menu=>{
      if(menu.dataset.unifiedLabor==='labor-all-v1')return;
      bindShoppingHover(menu);
      const categories=window.LABOR_CATALOG||laborNavFallback;
      menu.replaceChildren();
      const all=document.createElement('a');all.href='/installation.html';all.textContent='All Installation & Labor';menu.append(all);
      for(const category of categories.slice().sort((a,b)=>a.label.localeCompare(b.label))){
        const branch=document.createElement('div');branch.className='shopping-branch';
        const button=document.createElement('button');button.type='button';button.className='shopping-category-toggle';
        button.append(document.createTextNode(category.label));
        const arrow=document.createElement('span');arrow.className='shopping-submenu-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');button.append(arrow);
        const submenu=document.createElement('nav');submenu.id=menu.id+'-'+category.id;submenu.className='shopping-submenu';submenu.hidden=true;submenu.setAttribute('aria-label',category.label+' labor options');
        button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',submenu.id);
        const main='/installation.html#labor-category-'+category.id;
        const allCategory=document.createElement('a');allCategory.href=main;allCategory.textContent='All '+category.label;if(category.id!=='appliances')submenu.append(allCategory);
        const groups=category.id==='appliances'&&window.APPLIANCE_LABOR_GROUPS
          ? window.APPLIANCE_LABOR_GROUPS.map(g=>({id:g.id,label:g.label}))
          : category.groups||[];
        if(groups.length>1||category.id==='appliances'){
          for(const group of groups.slice().sort((a,b)=>a.label.localeCompare(b.label))){
            const link=document.createElement('a');link.textContent=group.label;
            link.href=category.id==='appliances'
              ? '/installation.html?appliance='+encodeURIComponent(group.id)+'#labor-category-appliances'
              : '/installation.html#labor-group-'+category.id+'-'+group.id;
            submenu.append(link);
          }
        }
        branch.append(button,submenu);menu.append(branch);bindCategoryBranch(branch);
      }
      menu.dataset.unifiedLabor='labor-all-v1';
    });
  }
  function installedListingCount(item){
    if(!item||!item.department||!item.keyword)return 0;
    const ignored=new Set(['wall','electric','kitchen','bathroom','hand','exterior','interior','appliance','new','kit']);
    const words=item.keyword.toLowerCase().split(/[^a-z0-9]+/g).filter(word=>word&&!ignored.has(word));
    return retailListings.filter(p=>{
      if(p.department!==item.department)return false;
      const name=String(p.name||'').toLowerCase();
      return words.length>0&&words.every(word=>name.includes(word));
    }).length;
  }
  function tileListingCount(tile){
    if(!listedCounts||!tile)return null;
    // Material choices on detail pages carry their product type in the card heading.
    if(tile.matches('.material-option-card')){
      const material=document.body.dataset.material;
      const type=tile.querySelector('h3')?.textContent.trim();
      return retailListings.filter(p=>p.department==='materials'&&p.material===material&&p.materialType===type).length;
    }
    if(!tile.href)return null;
    const url=new URL(tile.href,location.href);
    if(url.origin!==location.origin)return null;
    // Specialty links were skipped before, leaving unlisted goods without dots.
    if(url.pathname==='/shop-installed.html'){
      const id=url.searchParams.get('item');
      return id?installedListingCount(installableById[id]):null;
    }
    const material=url.pathname.match(/^\/material-([a-z-]+)\.html$/)?.[1];
    if(material){
      const type=url.searchParams.get('type');
      return retailListings.filter(p=>p.department==='materials'&&p.material===material&&(!type||p.materialType===type)).length;
    }
    // Project planning/in-person quotes are services, not empty retail shelves.
    if(url.pathname==='/project.html')return null;
    const department=departmentByPath[url.pathname];
    if(!department||department==='custom')return null;
    if(department==='furniture'){
      const category=url.searchParams.get('category');
      return furnitureListings.filter(p=>!category||furnitureCategoryMatch(p,category)).length;
    }
    const category=url.searchParams.get('category'),type=url.searchParams.get('type'),model=url.searchParams.get('model');
    return retailListings.filter(p=>p.department===department&&(!category||p.category===category)&&(!type||p.type===type)&&(!model||p.model===model)).length;
  }
  function syncTileAvailability(){
    if(!listedCounts)return;
    document.querySelectorAll('main .photo-category-tile,main .toilet-choice-tile,main .material-option-card,main .installed-groups a').forEach(tile=>{
      const count=tileListingCount(tile);if(count===null)return;
      tile.classList.toggle('shopping-tile-empty',count===0);
      if(count===0){tile.setAttribute('title','No items listed yet');}
      else if(tile.getAttribute('title')==='No items listed yet')tile.removeAttribute('title');
    });
    document.querySelectorAll('.installed-group').forEach(group=>{
      const items=[...group.querySelectorAll('a[href*="/shop-installed.html?item="]')];
      group.classList.toggle('shopping-tile-empty',items.length>0&&items.every(item=>item.classList.contains('shopping-tile-empty')));
    });
    document.querySelectorAll('.shopping-landing-grid,.shop-guide-grid,.picture-category-tabs,.photo-store-categories,.toilet-choice-grid,.material-detail-grid,.installed-groups').forEach(grid=>{
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
  syncShoppingMenu();syncLaborMenus();document.querySelectorAll('#projects-menu,#mobile-projects-menu').forEach(bindShoppingHover);syncTileAvailability();connectSearchForms();
  document.addEventListener('DOMContentLoaded',()=>{syncShoppingMenu();syncLaborMenus();document.querySelectorAll('#projects-menu,#mobile-projects-menu').forEach(bindShoppingHover);syncTileAvailability();connectSearchForms();});
  new MutationObserver(()=>{syncShoppingMenu();syncLaborMenus();document.querySelectorAll('#projects-menu,#mobile-projects-menu').forEach(bindShoppingHover);syncTileAvailability();connectSearchForms();}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.nav-menu').forEach(m=>{m.classList.remove('open');m.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');});});
})();
