(() => {
  const style=document.createElement('style');
  style.textContent=`[hidden]{display:none!important}.nav .simple-nav{overflow:visible;gap:36px}.simple-nav>a,.shopping-toggle{font-size:16px;font-weight:700}.shopping-toggle{background:none;border:0;padding:17px 0;cursor:pointer;color:inherit}.simple-nav .review-link{margin-left:auto;display:flex;align-items:center;gap:7px}.review-link .cart-count{position:static;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px}.nav-menu.open .nav-dropdown{display:block}.nav-dropdown a{display:block;padding:11px 17px}.brandbar>.actions .cart-pill,.topline-cart>a,.room-supply-list,a[href*="supplies.html"],.project-related-supplies{display:none!important}.shopping-toggle .nav-main{padding:0}.nav .simple-nav{flex-wrap:wrap}.nav-menu{position:relative}.nav-dropdown{min-width:210px;max-height:min(70vh,520px);overflow-y:auto;overscroll-behavior:contain}.shopping-menu-divider{border-top:1px solid #ddd;margin:8px 0}@media(max-width:620px){.nav-menu .nav-dropdown{max-width:calc(100vw - 24px);max-height:65vh;overflow-y:auto}}.project-grid .tile span{text-align:center}body{padding-bottom:0}.project-shopping-bar{position:fixed;bottom:0;left:0;right:0;z-index:100;background:#fff;border-top:1px solid #ddd;padding:12px 4%;display:flex;align-items:center;gap:12px;box-shadow:0 -2px 10px #0001}.project-shopping-bar span{flex:1;font-size:13px}.project-shopping-bar .btn{white-space:nowrap}@media(max-width:620px){body{padding-bottom:0}.project-shopping-bar{flex-wrap:wrap;padding:10px}.project-shopping-bar span{flex-basis:100%}.project-shopping-bar .btn{font-size:12px;padding:10px}}@media(max-width:620px){.nav .simple-nav{gap:12px}.simple-nav>a,.shopping-toggle{font-size:13px}.simple-nav .review-link{margin-left:0}}`;
  document.head.append(style);
  window.searchProjects=function(e){e.preventDefault();const term=e.target.querySelector('input').value.trim().toLowerCase(),grid=document.getElementById('projects');if(!grid){location.href='/?search='+encodeURIComponent(term)+'#projects';return false;}grid.querySelectorAll('.tile').forEach(t=>t.hidden=!t.textContent.toLowerCase().includes(term));grid.scrollIntoView({behavior:'smooth'});return false;};
  function connect(){
 document.querySelectorAll('.photo-source').forEach(el=>el.remove());
 if(document.querySelector('main')&&!['calculators','project'].includes(document.body.dataset.page)&&!['/','/index.html'].includes(location.pathname)&&!document.getElementById('page-back-button')){const row=document.createElement('div');row.className='wrap';row.style.cssText='padding:20px 0';const back=document.createElement('button');back.id='page-back-button';back.type='button';back.className='btn outline';back.textContent='Back';back.onclick=()=>{if(history.length>1)history.back();else location.href='/#projects';};row.append(back);document.querySelector('main').append(row);}
 if(window.parent!==window)document.querySelectorAll('a[href="/project-cart.html"]').forEach(a=>a.target='_top');
 document.querySelectorAll('a[href="/calculators.html"]').forEach(a=>{a.href='/#projects';a.textContent='Projects';});
document.querySelectorAll('.search').forEach(form=>form.onsubmit=window.searchProjects);}
  connect();document.addEventListener('DOMContentLoaded',()=>{connect();const term=new URLSearchParams(location.search).get('search');if(term){const form=document.querySelector('.search');if(form){form.querySelector('input').value=term;window.searchProjects({preventDefault(){},target:form});}}});

  // One shared Shopping menu for the homepage, product pages and project pages.
  // Each project uses the same URL as the Projects tiles; specialty projects
  // remain available through Outdoor Projects, Themed Rooms and More Ideas.
  const shoppingProductLinks = [
    ['Appliances', '/appliances.html'],
    ['Bathroom Products', '/bathroom.html'],
    ['Furniture', '/furniture.html'],
    ['Materials', '/materials.html'],
    ['Tools', '/products.html']
  ];
  const shoppingProjectIds = [
    'accents', 'bathrooms', 'bedroom-guest-room', 'closets-storage',
    'arches', 'murals', 'decks-railings', 'dining-room',
    'entry-mudroom', 'exterior-improvements', 'fireplaces', 'flooring',
    'home-office', 'home-theater', 'kitchen-pantry', 'laundry-utility',
    'lighting', 'living-family-room', 'music-creative-studio',
    'concrete', 'stairs', 'tile', 'wallpaper', 'themed-rooms',
    'custom', 'other'
  ];
  const shoppingProjectNames = {
    'bathrooms':'Bathroom', 'bedroom-guest-room':'Bedrooms',
    'concrete':'Outdoor Projects', 'custom':'More Ideas',
    'kitchen-pantry':'Kitchens', 'themed-rooms':'Themed Rooms',
    'flooring':'Flooring & Tile Details'
  };
  function syncShoppingMenu() {
    const catalog = typeof PROJECT_CATALOG === 'undefined' ? {} : PROJECT_CATALOG;
    document.querySelectorAll('#shopping-menu').forEach(menu => {
      if (menu.dataset.unifiedShopping === '20261021-compact') return;
      menu.replaceChildren();
      const heading = label => {
        const el = document.createElement('span');
        el.className = 'shopping-menu-heading';
        el.textContent = label;
        menu.append(el);
      };
      const link = (label, href) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        menu.append(a);
      };
      heading('Shop Products');
      shoppingProductLinks.sort((a,b) => a[0].localeCompare(b[0])).forEach(([label,href]) => link(label,href));
      const groups=document.createElement('details');
      groups.className='shopping-projects-details';
      const summary=document.createElement('summary');
      summary.textContent='Browse Projects';
      const links=document.createElement('div');
      links.className='shopping-project-links';
      groups.append(summary,links);
      menu.append(groups);
      shoppingProjectIds
        .filter(id => catalog[id])
        .map(id => [shoppingProjectNames[id] || catalog[id].title, '/project.html?project='+encodeURIComponent(id)])
        .sort((a,b) => a[0].localeCompare(b[0]))
        .forEach(([label,href]) => {
          const a=document.createElement('a');
          a.textContent=label;
          a.href=href;
          links.append(a);
        });
      menu.dataset.unifiedShopping = '20261021-compact';
    });
    // Bookmarks to the old All Shopping page still work, but storefront
    // breadcrumbs and "keep shopping" links must not imply it still exists.
    document.querySelectorAll('a[href="/shopping.html"]').forEach(a => {
      a.href = '/';
      if (a.closest('nav[aria-label="Breadcrumb"]')) a.textContent = 'Home';
    });
  }
  const menuStyle = document.createElement('style');
  menuStyle.textContent = '.shopping-menu-heading{display:block;font-weight:800;font-size:12px;letter-spacing:.04em;padding:10px 17px;background:#eff3f7;color:#344657}.nav-menu .nav-dropdown{min-width:235px;max-height:min(72vh,560px);overflow-y:auto;overscroll-behavior:contain}.shopping-projects-details{border-top:1px solid #d9e1e8;margin-top:6px;padding-top:3px}.shopping-projects-details>summary{list-style:none;cursor:pointer;font-weight:800;padding:12px 17px;font-size:14px}.shopping-projects-details>summary::-webkit-details-marker{display:none}.shopping-projects-details>summary:after{content:" ▾"}.shopping-projects-details[open]>summary:after{content:" ▴"}.shopping-projects-details>summary:hover,.shopping-projects-details>summary:focus-visible{background:#e8f1fa;color:#073c70}.shopping-project-links{max-height:min(42vh,330px);overflow-y:auto;overscroll-behavior:contain;border-top:1px solid #e4e8ed}.shopping-project-links a{padding-left:22px!important}@media(max-width:620px){.nav-menu .nav-dropdown{max-width:calc(100vw - 24px)}.shopping-project-links{max-height:38vh}}';
  document.head.append(menuStyle);
  syncShoppingMenu();
  document.addEventListener('DOMContentLoaded', syncShoppingMenu);
  // Some product pages render their header after asynchronously loading a catalog.
  new MutationObserver(syncShoppingMenu).observe(document.body,{childList:true});

  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.nav-menu').forEach(m=>{m.classList.remove('open');m.querySelector('.nav-toggle')?.setAttribute('aria-expanded','false');});});
})();
