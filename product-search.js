// One discovery index; every entry resolves to an existing catalog or project
// URL. Product prices/stock are determined by the destination store, never guessed.
(() => {
  const routes=[
    ['Toilets','Bathroom','Standard, round, elongated, smart and wall-hung toilet styles','/bathroom.html?type=toilets','toilet commode bathroom flush'],
    ['Standard Round Toilets','Bathroom','Compact round-bowl models','/bathroom.html?type=toilets&model=round','round standard short toilet'],
    ['Elongated & Comfort Height Toilets','Bathroom','Elongated bowls and taller models','/bathroom.html?type=toilets&model=elongated','tall oval toilet chair height oblong'],
    ['Smart Toilets','Bathroom','Electronic bidet and smart features','/bathroom.html?type=toilets&model=smart','bidet automatic electronic toilet'],
    ['Wall-Hung & Specialty Toilets','Bathroom','Wall mounted and specialty toilets','/bathroom.html?type=toilets&model=specialty','wall hung floating toilet'],
    ['Bathtubs','Bathroom','Bathtubs and soaking tubs','/bathroom.html?type=bathtubs','bath soaking alcove freestanding tub'],
    ['Shower Enclosures','Bathroom','Shower stalls, enclosures and surrounds','/bathroom.html?type=showers','shower shower kits'],
    ['Shower Doors','Bathroom','Sliding and frameless shower doors','/bathroom.html?type=showerDoors','glass shower door'],
    ['Shower Bases','Bathroom','Shower pans and bases','/bathroom.html?type=showerBases','tray shower pans'],
    ['Bathroom Vanities & Sinks','Bathroom','Sink and vanity options','/bathroom.html?type=vanities','vanity basin'],
    ['Bathroom Faucets','Bathroom','Sink faucets and fixtures','/bathroom.html?type=faucets','tap bathroom plumbing'],
    ['Bathroom Lights','Bathroom','Vanity lights and bathroom lighting','/bathroom.html?type=lighting','lighting vanity'],
    ['Bathroom Fans','Bathroom','Exhaust fans and ventilation','/bathroom.html?type=ventilation','vent fan'],
    ['Bathroom Mirrors & Accessories','Bathroom','Mirrors and finishing accessories','/bathroom.html?type=accessories','medicine cabinet'],
    ['Kitchen Cabinets','Cabinets','Find cabinets and kitchen options','/cabinets.html','kitchen pantry cabinet storage'],
    ['Kitchen Projects','Projects','Cabinets, counters, appliances and more','/project.html?project=kitchen-pantry','kitchen pantry remodel'],
    ['Refrigerators & Freezers','Appliances','Refrigerators, ice makers and freezers','/appliances.html?category=Refrigerators','fridge freezer deep freezer chest upright kitchen garage'],
    ['Ranges & Cooktops','Appliances','Stoves, ovens and cooking ranges','/appliances.html?category=Wall%20Ovens%20%26%20Cooktops','stove oven cooktop'],
    ['Dishwashers','Appliances','Dishwasher options','/appliances.html?category=Dishwashers','dish washer'],
    ['Microwaves & Range Hoods','Appliances','Kitchen microwaves and vents','/appliances.html?category=Microwaves%20%26%20Hoods','microwave hood ventilation'],
    ['Washers & Dryers','Appliances','Laundry appliances','/appliances.html?category=Washers%20%26%20Electric%20Dryers','laundry washing machine'],
    ['Living Room Furniture','Furniture','Sofas, recliners and seating','/furniture.html?category=living-room','couch sectional sofa chair table'],
    ['Bedroom Furniture','Furniture','Beds, dressers and nightstands','/furniture.html?category=bedroom','bed nightstand bedroom dresser'],
    ['Kids Room Furniture','Furniture','Furniture for children','/furniture.html?category=kids-room','kids bean bag children'],
    ['Home Office Furniture','Furniture','Desks, chairs and storage','/furniture.html?category=home-office','office desk'],
    ['Dining Room Furniture','Furniture','Dining tables and chairs','/furniture.html?category=dining-room','dining table'],
    ['Outdoor Furniture','Furniture','Patio furniture and seating','/furniture.html?category=outdoor','patio outdoor'],
    ['All Furniture','Furniture','Browse furniture and accessories','/furniture.html','furniture decor furnishings'],
    ['Flooring','Materials','Flooring types, supplies and project planning','/material-flooring.html','lvp plank hardwood laminate carpet floor'],
    ['Tile & Stone','Materials','Ceramic, porcelain and natural stone','/material-tile-stone.html','mosaic backsplash wall tile grout'],
    ['Paint & Finishes','Materials','Paint, stains and finishes','/material-paint-finishes.html','painting primer finish'],
    ['Drywall','Materials','Drywall panels and finishing materials','/material-drywall.html','sheetrock sheet wallboard'],
    ['Lumber','Materials','Framing lumber, plywood and wood','/material-lumber.html','wood studs'],
    ['Doors & Windows','Materials','Door and window materials','/material-doors-windows.html','exterior interior'],
    ['Trim & Molding','Materials','Baseboards, crown molding and trim','/material-trim-molding.html','casing crown'],
    ['All Materials','Materials','Browse materials and supplies','/materials.html','building hardware roofing concrete insulation siding'],
    ['Tools','Tools','Power tools and jobsite equipment','/products.html','drill saw equipment hand tools'],
    ['Bathroom Project','Projects','Plan fixtures, flooring, installation and labor','/project.html?project=bathrooms','bath remodel labor'],
    ['Outdoor Projects','Projects','Decks, patios and outside spaces','/project.html?project=concrete','outdoor garage yard'],
    ['Themed Rooms','Projects','Bedrooms, offices, theaters and other rooms','/project.html?project=themed-rooms','rooms bedroom office theater']
  ];
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function resultPhoto(name,group){
    const specific={
      'Bathroom Project':'/assets/showers-card.png','Kitchen Projects':'/assets/approved-9bfcb89f7800.jpg',
      'Outdoor Projects':'/assets/approved-a11ab0fcd37f.jpg','Themed Rooms':'/assets/bed.jpg',
      'Refrigerators & Freezers':'/assets/approved-26657e8bc7bd.jpg',
      'Ranges & Cooktops':'/assets/kitchen.jpg','Dishwashers':'/assets/approved-b9cdb9084877.jpg',
      'Microwaves & Range Hoods':'/assets/catalog-8.jpg','Washers & Dryers':'/assets/approved-493d744bf5f7.jpg',
      'Bedroom Furniture':'/assets/approved-807c60a6001a.jpg','Kids Room Furniture':'/assets/bed.jpg',
      'Home Office Furniture':'/assets/approved-6075be404407.jpg','Dining Room Furniture':'/assets/approved-a051ee7e1935.jpg',
      'Outdoor Furniture':'/assets/approved-a11ab0fcd37f.jpg','Bathroom Lights':'/assets/pendant-lighting.jpg',
      'Shower Enclosures':'/assets/showers-card.png','Shower Doors':'/assets/tile-shower.jpg'
    };
    if(specific[name])return specific[name];
    if(group==='Materials')return shopPhoto('materials',name);
    return {Bathroom:'/assets/approved-a908c20ce632.jpg',Cabinets:'/assets/approved-9bfcb89f7800.jpg',Furniture:'/assets/approved-4822ff53e23f.jpg',Tools:'/assets/approved-d2807423c8f0.jpg'}[group]||'/assets/approved-b5c632fcfbc0.jpg';
  }
  function matched(query){
    const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if(!terms.length)return routes.filter(r=>['Toilets','Refrigerators & Freezers','All Furniture','All Materials','Tools','Kitchen Projects','Bathroom Project'].includes(r[0]));
    return routes.map((r,i)=>{
      const title=r[0].toLowerCase(),rest=(r[1]+' '+r[2]+' '+r[4]).toLowerCase();
      const score=terms.reduce((sum,term)=>sum+(title.includes(term)?5:rest.includes(term)?2:0),0);
      return {r,i,score,ok:terms.every(term=>title.includes(term)||rest.includes(term))};
    }).filter(x=>x.ok).sort((a,b)=>b.score-a.score||a.i-b.i).map(x=>x.r);
  }
  function results(q){
    const entries=matched(q),root=document.getElementById('product-search-results');
    root.innerHTML='<p class="search-count">'+(entries.length?entries.length+' matching '+(entries.length===1?'destination':'destinations'):'No matching categories yet. Try another product name or browse by project.')+'</p>'+
      (entries.length?'<div class="product-search-results">'+entries.map(([name,group,description,url])=>
        '<a class="product-search-result" href="'+esc(url)+'"><img class="product-search-photo" src="'+esc(resultPhoto(name,group))+'" alt="" loading="lazy"><span class="product-search-group">'+esc(group)+'</span>'+
        '<strong>'+esc(name)+'</strong><span>'+esc(description)+'</span><span class="product-search-arrow">View options →</span></a>').join('')+'</div>':'');
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const params=new URLSearchParams(location.search);
    const term=params.get('q')||'';
    document.title='Search Products | Nik’s Remodeling';
    document.body.innerHTML=header()+'<main class="wrap section"><p><a href="/">← Home</a></p>'+
      '<h1>Search Products</h1><p class="lead">Find the right category, then choose an available product and see its price.</p>'+
      '<form id="product-lookup" role="search"><label for="product-query">Product or room</label><div class="product-search-form">'+
      '<input id="product-query" name="q" type="search" autocomplete="off" placeholder="Try toilet, refrigerator, flooring, sofa…" value="'+esc(term)+'" aria-label="Search product types">'+
      '<button class="btn primary" type="submit">Search</button></div></form>'+
      '<div id="product-search-results" aria-live="polite"></div><p class="calc-note">Individual products appear only when pricing and availability can be confirmed. <a href="/#projects">Shop by Project</a></p>'+
      '</main>'+footer();
    const style=document.createElement('style');
    style.textContent='.product-search-form{display:flex;gap:10px;margin:8px 0 24px}.product-search-form input{min-width:0;flex:1;padding:13px;border:1px solid #becbd6;border-radius:8px}.product-search-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:12px 0 24px}.product-search-result{display:flex;flex-direction:column;gap:8px;border:1px solid #dce5ec;border-radius:10px;padding:18px;background:white}.product-search-result:hover,.product-search-result:focus-visible{border-color:#0b5aa6;box-shadow:0 4px 16px #16202a13}.product-search-photo{display:block;width:calc(100% + 36px);max-width:none;height:180px;object-fit:cover;margin:-18px -18px 8px;border-radius:9px 9px 0 0}.product-search-result strong{font-size:1.06rem}.product-search-group{font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:#4a6377;font-weight:700}.product-search-arrow{color:#0b5aa6;font-weight:700;margin-top:auto}.search-count{color:#53606d;font-size:14px}@media(max-width:480px){.product-search-form{flex-direction:column}}';
    document.head.append(style);
    const input=document.getElementById('product-query');
    const form=document.getElementById('product-lookup');
    const perform=()=>{
      const q=input.value.trim();
      const url=new URL(location.href);
      if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');
      history.replaceState(null,'',url.pathname+url.search);
      results(q);
    };
    form.addEventListener('submit',e=>{e.preventDefault();perform()});
    results(term);
    initNavMenus();updateCartCount();
  });
})();
