const retailAssetVersion=new URL(document.currentScript?.src||location.href).searchParams.get('v')||'item-preview-20261025';
window.APPLIANCE_LABOR_GROUPS=[
 {id:'stacked-laundry',label:'Stacked Washer & Dryer Sets',match:/stacked washer\/dryer/i},
 {id:'ovens',label:'Ovens & Warming Drawers',match:/wall oven|microwave\/oven|warming drawer/i},
 {id:'microwaves',label:'Microwaves',match:/microwave/i},
 {id:'range-hoods',label:'Range Hoods',match:/range hood/i},
 {id:'ranges',label:'Ranges & Stoves',match:/\brange\b/i},
 {id:'cooktops',label:'Cooktops',match:/cooktop/i},
 {id:'refrigerators',label:'Refrigerators',match:/refrigerator/i},
 {id:'beverage-coolers',label:'Wine & Beverage Coolers',match:/wine cooler|beverage fridge/i},
 {id:'dishwashers',label:'Dishwashers',match:/dishwasher/i},
 {id:'garbage-disposals',label:'Garbage Disposals',match:/garbage disposal/i},
 {id:'dryers',label:'Dryers & Vents',match:/dryer/i},
 {id:'washers',label:'Washers',match:/washing machine/i},
 {id:'coffee-systems',label:'Coffee Systems',match:/coffee system/i},
 {id:'beverage-taps',label:'Beverage Equipment',match:/beverage tap|kegerator/i},
 {id:'trash-compactors',label:'Trash Compactors',match:/trash compactor/i},
 {id:'fireplace-inserts',label:'Fireplace Inserts',match:/fireplace/i}
];
window.BATHROOM_PACKAGES=[{"id":"toilet-install","label":"Assemble and install standard toilet","labor":175,"supplies":75,"fixture":300,"note":"Existing sound flange and water connection; removal separate."},{"id":"wall-mounted-toilet-install","label":"Install wall-mounted toilet","labor":0,"supplies":0,"fixture":0,"quoteRequired":true,"note":"Wall-mounted frames, concealed tanks, structural support, and wall access vary. In-person quote required."},{"id":"smart-toilet-install","label":"Assemble and install smart toilet","labor":650,"supplies":100,"fixture":2000,"note":"Existing suitable electrical outlet and plumbing required; electrical work separate."},{"id":"toilet-tank-repair","label":"Diagnose and replace toilet tank parts","labor":125,"supplies":0,"fixture":0,"note":"Labor only; replacement parts not included."},{"id":"toilet-remove","label":"Remove toilet and haul off","labor":150,"supplies":0,"fixture":0,"note":"$150 includes removal, standard job supplies and haul-off. No separate disposal charge."},{"id":"vanity-light-install","label":"Install bathroom vanity light on existing wiring","labor":175,"supplies":25,"fixture":125,"note":"Standard vanity wall light using a suitable existing electrical box and wiring. Fixture allowance is provisional. New wiring, relocation, or wall repair requires a separate quote. Licensed electrical work where required."},{"id":"vanity-light-replace","label":"Replace existing bathroom vanity light","labor":175,"supplies":25,"fixture":125,"note":"Remove existing vanity light and install a standard replacement on sound existing wiring and box. Fixture allowance is provisional. Electrical repairs or relocation quoted separately. Licensed electrical work where required."},{"id":"vanity-install","label":"Vanity/sink combo and faucet installation","labor":300,"supplies":125,"fixture":1000,"note":"Standard single vanity up to 36 inches; existing connections. Removal separate."},{"id":"vanity-remove","label":"Remove vanity and sink and haul off","labor":150,"supplies":0,"fixture":0,"note":"$150 includes removal, standard job supplies and haul-off. No separate disposal charge."},{"id":"faucet-replace","label":"Remove and replace vanity faucet","labor":225,"supplies":75,"fixture":150,"note":"Existing compatible plumbing connections; vanity faucet and materials extra. New plumbing and drywall repair are not included."},{"id":"tub-resurface","label":"Resurface bathtub","labor":450,"supplies":225,"fixture":0,"note":"Subject to surface suitability; compatible resurfacing system."},{"id":"tub-replace","label":"Remove and replace bathtub and surround","labor":1600,"supplies":300,"fixture":1600,"note":"Existing compatible opening and plumbing connections; standard bathtub and molded surround. Removal and haul-off included. Cast iron, tile, hidden damage and drywall repair are extra."},{"id":"bath-drywall-repair","label":"Tub-related drywall repair and touch-up","labor":225,"supplies":0,"fixture":0,"note":"$225 add-on includes standard repair consumables for up to one sheet and touch-up with existing matching paint when available."},{"id":"shower-valve-install","label":"Install shower faucet / mixing valve","labor":450,"supplies":100,"fixture":250,"note":"Existing compatible plumbing connections; valve, trim and materials extra. Drywall repair is not included. New or relocated connections require an in-person quote."},{"id":"toilet-wax-ring","label":"Replace wax ring and reset toilet","labor":125,"supplies":0,"fixture":0,"flatService":true,"note":"Service charge includes standard wax ring and resetting toilet on a sound flange."},{"id":"toilet-flange","label":"Repair or replace toilet flange","labor":250,"supplies":0,"fixture":0,"quoteRequired":false,"note":"Labor only; flange and materials extra. Surrounding floor damage and plumbing alterations require a separate in-person quote."},{"id":"tub-remove","label":"Remove bathtub and surround and haul off","labor":500,"supplies":0,"fixture":0,"note":"Removal and haul-off included; cast iron, tile and hidden damage are extra."},{"id":"tub-install","label":"Install bathtub and surround","labor":1200,"supplies":300,"fixture":1600,"note":"Existing compatible opening and plumbing connections; standard bathtub and molded surround. Removal, haul-off and drywall repair are not included. Cast iron, tile, hidden damage and new connections require a separate quote."},{"id":"standup-shower-install","label":"Install stand-up shower (prefabricated enclosure)","labor":null,"supplies":0,"fixture":0,"quoteRequired":true,"note":"In-person quote required. Measure enclosure, walls, floor, shower base, waterproofing, drain, shower valve, and existing plumbing. Quote must distinguish labor and fixture/material costs; electrical/plumbing alterations, permits and unexpected damage assessed separately."},{"id":"standup-shower-tile-install","label":"Install tiled walk-in / stand-up shower","labor":null,"supplies":0,"fixture":0,"quoteRequired":true,"note":"In-person quote required for pan, waterproofing, drain slope, tile layout, tile, grout, glass, labor and materials. Licensed trades or permits where required; no fixed labor-only charge approved."},{"id":"standup-shower-replace","label":"Remove and replace stand-up shower","labor":null,"supplies":0,"fixture":0,"quoteRequired":true,"note":"In-person quote required. Includes evaluation of demolition, disposal, base, walls, waterproofing, fixtures, plumbing and any damage. Tub replacement price does not apply."},{"id":"standup-shower-remove","label":"Remove existing stand-up shower","labor":null,"supplies":0,"fixture":0,"quoteRequired":true,"note":"In-person quote required. Demolition, haul-off, plumbing disconnection and substrate condition must be reviewed."}];
window.bathroomPackageByLabel=label=>window.BATHROOM_PACKAGES.find(p=>p.label===label||p.id===({'Remove and replace sink faucet':'faucet-replace','Repair toilet flange':'toilet-flange','Replace needed toilet tank parts':'toilet-tank-repair','Remove and replace bathroom sink faucet':'faucet-replace'}[label]));
window.bathroomPackageTotal=(p,own=false)=>p.quoteRequired?null:p.labor+p.supplies+(own?0:p.fixture);

const SITE={phone:'678-231-4377',text:'470-991-2133',email:'contact@niksremodeling.com'};
const PAGES={
 furniture:{title:'Furniture & Accessories',heroTitle:'Furniture & Accessories',tag:'Functional. Beautiful. Yours.',desc:'Find furniture, décor, appliances and finishing touches for every space — or explore custom-built and reclaimed pieces to make it truly yours.',hero:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85',tabs:["Living Room","Bedroom","Dining Room","Home Office","Outdoor Furniture","Décor & Accessories"]},
 appliances:{title:'Appliances',heroTitle:'Performance for Real Life.',tag:'Reliable. Stylish. Built for Your Home.',desc:'Trusted brands, modern features and practical options for delivery, installation and project planning.',hero:'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1800&q=85',tabs:["Refrigerators","Gas Ranges","Electric Ranges","Wall Ovens & Cooktops","Dishwashers","Microwaves & Hoods","Washers & Electric Dryers","Gas Dryers","Cords & Connections"]},
 cabinets:{title:'Cabinets',heroTitle:'Quality Cabinets for Every Space.',tag:'Beautiful. Durable. Designed for Your Home.',desc:'Style, storage and cabinet solutions for kitchens, baths and custom spaces, brought together around your project.',hero:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=85',tabs:["Base Cabinets","Wall & Upper Cabinets","Bathroom Vanities","Pantry & Tall Cabinets","Garage Storage Cabinets","Hardware"]},
 tools:{title:'Tools',heroTitle:'The Right Tools for the Job.',tag:'DIY or professional-grade.',desc:'Everyday essentials and professional-grade equipment to keep remodeling projects moving.',hero:'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1800&q=85',tabs:["Power Tools","Hand Tools","Specialty Tools","Drills & Impacts","Saws & Cutting","Measuring & Layout"]},
 materials:{title:'Materials',heroTitle:'Build It Right from the Start.',tag:'Plan quantities first. Buy with confidence.',desc:'Core remodeling materials organized by project so you can plan quantities, products and installation together.',hero:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85',tabs:['Flooring','Tile & Stone','Drywall','Lumber','Trim & Molding','Paint & Finishes','Insulation','Roofing','Siding & Exterior','Doors & Windows','Concrete & Masonry']},
 supplies:{title:'Supplies',heroTitle:'Everything That Keeps the Job Moving.',tag:'The right supplies for the work ahead.',desc:'Fasteners, adhesives, paint supplies, plumbing and electrical essentials, protection and jobsite consumables.',hero:'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1800&q=85',tabs:["Paint & Finishes","Fasteners & Adhesives","Plumbing Supplies","Electrical Supplies","Appliance Cords & Connections","Protection & Consumables"]},
 installation:{title:'Installation & Labor',heroTitle:'From the First Idea to the Final Detail.',tag:'Nik’s Remodeling brings your project together.',desc:'Installation and labor options coordinated around the products and scope you choose. Final labor pricing is confirmed from the actual scope before work is scheduled.',hero:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85',tabs:['Kitchen','Bathroom','Flooring','Painting','Trim','Exterior','Custom Work']}
};
const PRODUCT_IMAGES={
 furniture:[
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1532372320572-cda25653a694?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1598300053650-8a2b67f5f0a0?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=82'
 ],
 appliances:[
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82'
 ],
 cabinets:[
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=82'
 ],
 tools:[
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=82'
 ],
 materials:[
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82'
 ],
 supplies:[
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=82'
 ],
 installation:[
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=82',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=82'
 ]
};

// Retail listings come from verified supplier records, never planning examples.
const PRODUCTS={furniture:[],appliances:[],cabinets:[],tools:[],materials:[],supplies:[]};

function getCart(){try{const cart=JSON.parse(localStorage.getItem('nr-cart')||'[]');const cleaned=Array.isArray(cart)?cart.filter(Boolean).map(item=>/^(Supply request|Supplies request|Supplies)$/.test(item.type)?{...item,hiddenFromCustomer:true,pricingPending:item.price==null}:item):[];if(cleaned.length!==cart.length)localStorage.setItem('nr-cart',JSON.stringify(cleaned));return cleaned}catch{return[]}}
function saveCart(c){c=repriceRemovalGroups(c);const previous=getCart();if(c.length>previous.length||c.some((x,i)=>JSON.stringify(x)!==JSON.stringify(previous[i]))&&c.length>=previous.length){setTimeout(()=>{let note=document.getElementById('cart-added-confirmation');if(!note){note=document.createElement('div');note.id='cart-added-confirmation';note.className='wrap panel';note.setAttribute('role','status');document.querySelector('main')?.append(note);}note.innerHTML='Added to cart. <a class="btn outline" target="_top" href="/#projects">Keep shopping</a>';},0);}localStorage.setItem('nr-cart',JSON.stringify(c));if(c.length)localStorage.setItem('nr-cart-updated-at',String(Date.now()));else{localStorage.removeItem('nr-cart-updated-at');localStorage.removeItem('nr-cart-reminder-dismissed-until')}updateCartCount()}
function updateCartCount(){const n=getCart().filter(x=>!x.hiddenFromCustomer).reduce((s,x)=>s+(x.qty||1),0);document.querySelectorAll('.cart-count').forEach(e=>e.textContent=n)}
function addItem(name){
 if(isCustomLabel(name)){showCustomQuote(name);return;}
 const card=[...document.querySelectorAll('article')].find(el=>el.querySelector('h3')?.textContent===name);
 const url=card?.querySelector('[data-calc-url]')?.dataset.calcUrl||'/calculators.html?material=custom&product='+encodeURIComponent(name);
 if(typeof openMaterialCalculator==='function'&&document.getElementById('material-calc-dialog'))openMaterialCalculator(url);else location.href=url;
}
const CABINET_MATERIALS=['Bonding Primer','Cabinet / Trim Paint','Stain','Clear Finish','Hardware','Other material'];
const CABINET_WORK_OPTIONS=[
 {key:'installation',label:'Install cabinet boxes — hardware separate',fields:[['units','Number of cabinet boxes','Install cabinet box','boxes']]},
 {key:'removal',label:'Remove cabinet boxes — haul-off included',fields:[['remove-units','Number of cabinet boxes to remove','Remove cabinet box and haul off','boxes']]},
 {key:'door-paint',label:'Cabinet painting or staining — $150 outside only',fields:[['paint-doors','Cabinets','Paint cabinet door and matching box','cabinets']]},
 {key:'interiors',label:'Cabinet painting or staining — $225 inside and out',fields:[['interior-count','Cabinets','Paint cabinet interiors','cabinets']]},
 {key:'install-paint-out',label:'Install and paint outside — $275 per cabinet',fields:[['install-paint-out-count','Cabinets','Install cabinet and paint outside','cabinets']]},
 {key:'install-paint-all',label:'Install and paint inside and out — $325 per cabinet',fields:[['install-paint-all-count','Cabinets','Install cabinet and paint inside and out','cabinets']]},
 {key:'door-adjust',label:'Adjust cabinet door — $75 per hours',fields:[['door-adjust-qty','Quantity','Adjust cabinet door','hours']]},
 {key:'cabinet-crown',label:'Install cabinet crown molding — $4 per linear foot',fields:[['crown-feet','Cabinet crown molding length (feet)','Install cabinet crown molding','linear foot']]},
 {key:'toe-kick',label:'Install cabinet toe-kick — $1.25 per linear foot',fields:[['toe-feet','Cabinet toe-kick length (feet)','Install cabinet toe-kick','linear foot']]},
 {key:'filler',label:'Install cabinet filler strips — $15 each',fields:[['filler-count','Filler strips','Install cabinet filler strip','strips']]},
 {key:'end-panel',label:'Install cabinet end panels — $75 each',fields:[['panel-count','End panels','Install cabinet end panel','panels']]},
 {key:'hardware',label:'Install cabinet knob, pull or hinge — $15 each, labor only',fields:[['hardware-count','Number of hardware pieces','Install cabinet hardware','pieces']]},
 {key:'hole-prep',label:'Fill old hardware holes and touch up paint where possible — $15 per door or drawer',fields:[['prep-holes','Doors and drawers','Fill cabinet hardware hole and touch up paint if possible','doors or drawers']]}
];
function cabinetScopeForm(){
 return '<h3>Cabinet / Vanity Work</h3><p class="calc-note">Cabinet painting and staining include doors and drawer fronts. Choose one finish or installation package per cabinet.</p><div class="calc-fields">'+materialField('cabinet-doors','Doors to refinish or stain — quote required',{step:1,value:0})+materialField('cabinet-drawers','Drawer fronts to refinish',{step:1,value:0})+'</div>'+CABINET_WORK_OPTIONS.filter(x=>x.fields.length).map(option=>'<div class="project-options"><label><input type="checkbox" id="cabinet-'+option.key+'"> '+option.label+'</label></div><div id="cabinet-'+option.key+'-details" hidden><div class="calc-fields">'+option.fields.map(([id,label])=>materialField('cabinet-'+id,label,{step:id==='door-adjust-qty'?0.25:1,value:0})).join('')+'</div></div>').join('')+'<p class="calc-note">Cabinet labor: install $150 each. Removal and haul-off: 1–2 cabinets $75 each; 3–5 $65; 6–9 $55; 10+ $50. $150 minimum trip charge. Hardware separate.</p>';
}
function cabinetOptionPicker(context=''){
 return '<details class="cabinet-option-picker" data-context="'+escapeCartText(context)+'"><summary>Cabinet / Vanity Options</summary><div class="project-options">'+CABINET_WORK_OPTIONS.map(option=>'<label><input type="checkbox" style="width:18px;height:18px;flex:0 0 18px" data-cabinet-option="'+option.key+'" value="'+option.key+'"> '+option.label+'</label>').join('')+'</div><a class="btn outline cabinet-plan-link" href="/calculators.html?material=refinish">Plan Selected Cabinet Work</a></details>';
}
function bindCabinetOptionPickers(root=document){root.querySelectorAll('.cabinet-option-picker').forEach(picker=>{
 if(picker.dataset.bound)return;picker.dataset.bound='1';
 const update=()=>{const params=new URLSearchParams({material:'refinish',cabinetOptions:[...picker.querySelectorAll('input:checked')].map(x=>x.value).join('|')});if(picker.dataset.context)params.set('cabinetItem',picker.dataset.context);const room=document.getElementById('scope-room')?.value.trim();if(room)params.set('room',room);picker.querySelector('.cabinet-plan-link').href='/calculators.html?'+params.toString();};
 picker.addEventListener('change',update);picker.querySelector('.cabinet-plan-link').addEventListener('click',update);update();
 });}
const WORK_MATERIAL_CATEGORIES={flooring:'flooring',tile:'tile-stone',paint:'paint-finishes',lumber:'lumber',trim:'trim-molding',drywall:'drywall',concrete:'concrete-masonry','doors-windows':'doors-windows',insulation:'insulation',roofing:'roofing','siding-exterior':'siding-exterior'};
function workMaterialNames(kind){return window.WORK_MATERIAL_OPTIONS?.[kind]?.slice()||(kind==='refinish'?CABINET_MATERIALS.slice():(MATERIAL_DETAIL_PAGES[WORK_MATERIAL_CATEGORIES[kind]]?.items.slice()||['Other material']));}
function serviceChoices(page){return {materials:['Installation','Removal','Prep'],furniture:['Delivery','Delivery and setup'],cabinets:['Cabinet installation','Hardware installation'],appliances:['Delivery and hookup','Appliance installation']}[page]||[]}
function servicePicker(name,choices){if(!choices.length)return '';const multi=true;return `<div class="service-picker">${multi?`<details class="service-dropdown"><summary>Choose services ▾</summary><div class="service-dropdown-options">${choices.map(choice=>`<label><input type="checkbox" value="${choice}"> ${choice}</label>`).join('')}</div></details>`:`<label>Optional service <select aria-label="Optional service for ${name}">${choices.map(choice=>`<option>${choice}</option>`).join('')}</select></label>`}<button class="btn outline service-add" type="button" data-service-item="${encodeURIComponent(name)}">${multi?'Add Services':'Add Service'}</button></div>`}
function bindServicePickers(){document.querySelectorAll('.service-add').forEach(button=>button.addEventListener('click',()=>{const name=decodeURIComponent(button.dataset.serviceItem),services=[...button.parentElement.querySelectorAll('input:checked')].map(input=>input.value);if(!services.length&&button.parentElement.querySelector('select'))services.push(button.parentElement.querySelector('select').value);if(!services.length){button.textContent='Choose a service';setTimeout(()=>button.textContent=button.parentElement.querySelector('.service-dropdown')?'Add Services':'Add Service',2000);return}if(button.closest('.material-option-card')||button.closest('.catalog')?.querySelector('.catalog-head h2')?.textContent==='Materials'){const calcUrl=button.closest('.card')?.querySelector('.material-calc-trigger')?.dataset.calcUrl;location.href=(calcUrl||'/calculators.html?product='+encodeURIComponent(name))+'&labor=1&services='+encodeURIComponent(services.join(','))+(button.closest('.material-option-card')?.dataset.calcKind?'&material='+button.closest('.material-option-card').dataset.calcKind:'');return}const cart=getCart();services.forEach(service=>{const entry=`${service}: ${name}`;if(!cart.some(item=>item.name===entry&&item.type==='Service'))cart.push({name:entry,qty:1,type:'Service'})});saveCart(cart);button.textContent='Service added';setTimeout(()=>button.textContent='Add Service',2000)}))}
function header(){return `<div class="topline"><div class="wrap"><div>Office: ${SITE.phone} &nbsp; • &nbsp; Text/Personal: ${SITE.text}</div><div class="topline-cart"><span>SUPPLY. PLAN. BUILD. TOGETHER.</span><a href="/project-cart.html">Review Cart <span class="cart-count">0</span></a></div></div></div><div class="wrap brandbar"><div class="logo"><img class="brand-logo" src="/assets/niks-remodeling-logo-approved.png" alt="Nik's Remodeling NR logo" width="175" height="201"><span><strong>NIK'S REMODELING</strong><em>EVERYTHING UNDER THE ROOF</em></span></div><form class="search" action="/product-search.html" method="get"><input name="q" aria-label="Search products and projects" placeholder="Search products and projects…"><button type="submit">Search</button></form><div class="actions"><a class="cart-pill" href="/project-cart.html">Review Cart <span class="cart-count">0</span></a><a href="tel:${SITE.phone.replaceAll('-','')}">Account / Call</a></div></div><nav class="nav"><div class="wrap simple-nav"><a href="/">Home</a><div class="nav-menu"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="projects-menu">Projects ▾</button><div id="projects-menu" class="nav-dropdown"><a href="/#projects">All Projects</a><a href="/project.html?project=bathrooms">Bathroom Projects</a><a href="/project.html?project=bedroom-guest-room">Bedrooms</a><a href="/project.html?project=custom">Custom &amp; Other Ideas</a><a href="/project.html?project=lighting">Lighting &amp; Electrical</a><a href="/project.html?project=kitchen-pantry">Kitchens</a><a href="/project.html?project=concrete">Outdoor Projects</a><a href="/calculators.html?from=projects-menu">Project Calculator</a><a href="/project.html?project=room-additions">Room Additions</a><a href="/project.html?project=themed-rooms">Themed Rooms</a><a href="/project.html?project=adult-room">Adult Room</a></div></div><div class="nav-menu"><button class="nav-toggle shopping-toggle" type="button" aria-expanded="false" aria-controls="shopping-menu">Shopping ▾</button><div id="shopping-menu" class="nav-dropdown"><a href="/appliances.html">Appliances</a><a href="/bathroom.html">Bathroom Fixtures</a><a href="/cabinets.html">Cabinets</a><a href="/furniture.html">Furniture &amp; Accessories</a><a href="/materials.html">Materials</a><a href="/products.html">Tools</a><a href="/other.html">Other</a></div></div><div class="nav-menu"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="labor-menu" aria-label="Installation and Labor"><span class="nav-label-full">Installation &amp; Labor</span><span class="nav-label-compact">Installation<br>&amp; Labor</span><span class="nav-caret" aria-hidden="true"> ▾</span></button><div id="labor-menu" class="nav-dropdown"><a href="/installation.html">All Installation &amp; Labor</a><a href="/installation.html#labor-category-appliances">Appliances</a><a href="/installation.html#labor-category-bathroom">Bathroom</a><a href="/installation.html#labor-category-cabinets">Cabinets &amp; Vanities</a><a href="/installation.html#labor-category-carpentry">Carpentry &amp; Trim</a><a href="/installation.html#labor-category-doors">Doors &amp; Windows</a><a href="/installation.html#labor-category-drywall">Drywall &amp; Texture</a><a href="/installation.html#labor-category-electrical">Electrical &amp; Smart Home</a><a href="/installation.html#labor-category-exterior">Exterior &amp; Outdoor</a><a href="/installation.html#labor-category-flooring">Flooring &amp; Tile</a><a href="/installation.html#labor-category-kitchen">Kitchen</a><a href="/installation.html#labor-category-other">Other Labor &amp; Delivery</a><a href="/installation.html#labor-category-paint">Painting &amp; Wallpaper</a></div></div><a href="/project-cart.html" class="review-link" aria-label="Review Cart"><span class="nav-label-full">Review Cart</span><span class="nav-label-compact">Cart</span> <span class="cart-count">0</span></a></div><div class="mobile-top-nav" aria-label="Mobile site navigation"><a href="/">Home</a><div class="nav-menu"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-projects-menu">Projects ▾</button><div id="mobile-projects-menu" class="nav-dropdown"><a href="/#projects">All Projects</a><a href="/project.html?project=bathrooms">Bathroom Projects</a><a href="/project.html?project=bedroom-guest-room">Bedrooms</a><a href="/project.html?project=custom">Custom &amp; Other Ideas</a><a href="/project.html?project=lighting">Lighting &amp; Electrical</a><a href="/project.html?project=kitchen-pantry">Kitchens</a><a href="/project.html?project=concrete">Outdoor Projects</a><a href="/calculators.html?from=projects-menu">Project Calculator</a><a href="/project.html?project=room-additions">Room Additions</a><a href="/project.html?project=themed-rooms">Themed Rooms</a><a href="/project.html?project=adult-room">Adult Room</a></div></div><div class="nav-menu"><button class="nav-toggle shopping-toggle" type="button" aria-expanded="false" aria-controls="mobile-shopping-menu">Shop ▾</button><div id="mobile-shopping-menu" class="nav-dropdown"><a href="/appliances.html">Appliances</a><a href="/bathroom.html">Bathroom Fixtures</a><a href="/cabinets.html">Cabinets</a><a href="/furniture.html">Furniture &amp; Accessories</a><a href="/materials.html">Materials</a><a href="/products.html">Tools</a><a href="/other.html">Other</a></div></div><div class="nav-menu"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-labor-menu" aria-label="Installation and Labor"><span class="nav-label-full">Installation &amp; Labor</span><span class="nav-label-compact">Installation<br>&amp; Labor</span><span class="nav-caret" aria-hidden="true"> ▾</span></button><div id="mobile-labor-menu" class="nav-dropdown"><a href="/installation.html">All Installation &amp; Labor</a><a href="/installation.html#labor-category-appliances">Appliances</a><a href="/installation.html#labor-category-bathroom">Bathroom</a><a href="/installation.html#labor-category-cabinets">Cabinets &amp; Vanities</a><a href="/installation.html#labor-category-carpentry">Carpentry &amp; Trim</a><a href="/installation.html#labor-category-doors">Doors &amp; Windows</a><a href="/installation.html#labor-category-drywall">Drywall &amp; Texture</a><a href="/installation.html#labor-category-electrical">Electrical &amp; Smart Home</a><a href="/installation.html#labor-category-exterior">Exterior &amp; Outdoor</a><a href="/installation.html#labor-category-flooring">Flooring &amp; Tile</a><a href="/installation.html#labor-category-kitchen">Kitchen</a><a href="/installation.html#labor-category-other">Other Labor &amp; Delivery</a><a href="/installation.html#labor-category-paint">Painting &amp; Wallpaper</a></div></div><a href="/project-cart.html" class="review-link" aria-label="Review Cart"><span class="nav-label-full">Review Cart</span><span class="nav-label-compact">Cart</span> <span class="cart-count">0</span></a></div></nav>`}
function footer(){return `<div class="assurance"><div class="wrap"><span>🚚 Delivery / Local Pickup Options</span><span>🛡️ Quality Products</span><span>🏠 Installation Available</span><span>💬 Real Support</span></div></div><footer class="footer"><div class="wrap"><div class="footgrid"><div><h3>Everything under the roof</h3><p>SUPPLY. PLAN. BUILD. TOGETHER.</p><p><strong>From the first idea to the final detail, Nik’s Remodeling brings your project together.</strong></p></div><div><h3>Shop</h3><a href="/materials.html">Materials</a><a href="/tools.html">Tools</a><a href="/furniture.html">Furniture</a><a href="/bathroom.html">Bathroom</a><a href="/appliances.html">Appliances</a><a href="/cabinets.html">Cabinets</a></div><div><h3>Project</h3><a href="/#projects">Projects</a><a href="/installation.html">Installation & Labor</a><a href="/project-cart.html">Review Cart</a></div><div><h3>Contact</h3><a href="tel:${SITE.phone.replaceAll('-','')}">${SITE.phone}</a><a href="sms:${SITE.text.replaceAll('-','')}">${SITE.text}</a><a href="mailto:${SITE.email}">${SITE.email}</a></div></div><div class="fine">© 2026 Nik's Remodeling. All rights reserved. West Georgia & East Alabama.</div></div></footer>`}

function fallbackProducts(page){
 const names={installation:['Kitchen Installation','Bathroom Installation','Flooring Installation','Interior Painting','Trim & Finish Work','Custom Project Labor','Cabinet Installation','Appliance Installation','Tile Installation','Exterior Work','Deck / Outdoor Work','Project Coordination']}[page]||[];
 return names.map((name,i)=>({name,sku:`NR-${page.slice(0,3).toUpperCase()}-${String(i+1).padStart(2,'0')}`,category:PAGES[page]?.title||page,details:['Scope Review','Project Coordination','Scheduling Available']}));
}
const PROJECT_FLOW={calculators:{number:1,label:'Project Calculator',previous:'materials',next:'materials',nextLabel:'Shop Materials'},materials:{number:1,label:'Materials',next:'furniture',nextLabel:'Furniture'},furniture:{number:2,label:'Furniture',previous:'materials',next:'appliances',nextLabel:'Appliances'},appliances:{number:3,label:'Appliances',previous:'furniture',next:'supplies',nextLabel:'Supplies'},supplies:{number:4,label:'Supplies',previous:'appliances',next:'tools',nextLabel:'Tools'},tools:{number:5,label:'Tools',previous:'supplies',next:'installation',nextLabel:'Labor'},installation:{number:6,label:'Labor',previous:'tools',next:'cart',nextLabel:'Review & Checkout'},cart:{number:7,label:'Review & Checkout',previous:'installation'}};
function projectFlow(page){return '<section class="project-flow"><div class="wrap project-flow-inner"><a class="btn outline" href="/#projects">Choose a Room or Project</a><a class="btn outline" href="/shopping.html">Keep Shopping</a><a class="btn primary" href="/project-cart.html">Review Cart</a></div></section>';}
function materialCalcLink(product){const kind=Object.keys(WORK_MATERIAL_CATEGORIES).find(key=>MATERIAL_DETAIL_PAGES[WORK_MATERIAL_CATEGORIES[key]].title===product.category);if(!kind)return null;return `/calculators.html?material=${encodeURIComponent(kind)}&product=${encodeURIComponent(product.name)}`;}
function materialShopLink(item){const kind=item.type==='flooring'?(item.floorKind==='tile'?'tile':'flooring'):item.type==='drywall'?'drywall':item.type==='lumber'?'lumber':'';return kind?`/materials.html?type=${encodeURIComponent(kind)}`:'/materials.html'}
function applyMaterialShopFilter(){const type=new URLSearchParams(location.search).get('type');if(!type)return;const allowed={tile:['Tile & Stone'],flooring:['Flooring'],drywall:['Drywall'],lumber:['Lumber']}[type];if(!allowed)return;const products=document.querySelectorAll('.products .card');products.forEach(card=>{card.hidden=!allowed.includes(card.dataset.category)});const catalog=document.querySelector('.catalog-head');if(catalog){const note=document.createElement('p');note.className='calc-note';note.textContent=`Showing ${type==='tile'?'tile & stone':type} materials from your calculation. `;const clear=document.createElement('a');clear.href='/materials.html';clear.textContent='See all materials';note.append(clear);catalog.append(note)}}
const SHOP_GUIDES={"furniture":[["Living Room","Sofas, chairs, tables and media storage."],["Bedroom","Beds, dressers, nightstands and accents."],["Dining Room","Dining tables, seating and storage."],["Home Office","Desks, shelves and office seating."],["Outdoor Furniture","Patio seating, tables and outdoor pieces."],["Décor & Accessories","Rugs, lighting, mirrors and finishing touches."]],"cabinets":[["Base Cabinets","Kitchen base units, drawers and sink bases."],["Wall & Upper Cabinets","Upper kitchen cabinets and display storage."],["Bathroom Vanities","Vanity cabinets and bath storage."],["Pantry & Tall Cabinets","Tall units, pantry and utility storage."],["Garage Storage Cabinets","Durable storage for garages and workshops."],["Storage Cabinets","Freestanding storage cabinets and drawer units."],["Hardware","Cabinet hardware and accessories."]],"appliances":[["Beverage Equipment","Kegerators, draft taps, beer towers and beverage dispensing equipment."],["Coffee Systems","Built-in, countertop and espresso coffee equipment."],["Cords & Connections","Power cords, hoses and connection accessories."],["Dishwashers","Built-in and compact dishwashers."],["Electric Ranges","Electric and induction ranges."],["Gas Dryers","Gas laundry dryers."],["Gas Ranges","Gas stoves and ranges."],["Microwaves & Hoods","Microwaves, vents and range hoods."],["Refrigerators","Full-size, counter-depth and specialty refrigeration."],["Wall Ovens & Cooktops","Built-in ovens and cooking surfaces."],["Washers & Electric Dryers","Laundry machines and electric dryers."]],"supplies":[["Paint & Finishes","Paint, primer, stain and prep supplies."],["Fasteners & Adhesives","Screws, nails, glue, mortar and sealants."],["Plumbing Supplies","Pipe, fittings and water connections."],["Electrical Supplies","Wire, switches, boxes and devices."],["Appliance Cords & Connections","Range and dryer cords, hoses and installation accessories."],["Protection & Consumables","Tape, drop cloths, safety gear and jobsite supplies."]],"tools":[["Power Tools","Drills, impact drivers, saws and sanders."],["Hand Tools","Hammers, screwdrivers, wrenches and pliers."],["Specialty Tools","Hammer drills, tile tools and job-specific equipment."],["Drills & Impacts","Drills, impact drivers and bits."],["Saws & Cutting","Circular saws, blades and cutters."],["Measuring & Layout","Tape measures, levels and layout tools."]]};

/* Existing approved photographs power category navigation; product inventory is
   verified separately. No original project images are removed or replaced. */
const SHOP_PICTURE_TILES={
 materials:{
  'Flooring':'/assets/approved-de82473d9ce3.jpg',
  'Tile & Stone':'/assets/tile-shower.jpg',
  'Drywall':'https://images.unsplash.com/photo-1768321917995-2d992c50854b?auto=format&fit=crop&w=900&q=82',
  'Lumber':'https://images.unsplash.com/photo-1681752972950-6229ca099fbc?auto=format&fit=crop&w=900&q=82',
  'Trim & Molding':'/assets/approved-e9fee5a04016.jpg',
  'Paint & Finishes':'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=82',
  'Insulation':'/assets/project-attic.jpg',
  'Roofing':'https://images.unsplash.com/photo-1655373617557-7138d45582d4?auto=format&fit=crop&w=900&q=82',
  'Siding & Exterior':'https://images.unsplash.com/photo-1775695161075-f286033564df?auto=format&fit=crop&w=900&q=82',
  'Doors & Windows':'/assets/approved-4de99f88049f.jpg',
  'Concrete & Masonry':'/assets/patio-concrete.webp'
 },
 cabinets:{
  'Base Cabinets':'/assets/approved-9bfcb89f7800.jpg',
  'Wall & Upper Cabinets':'/assets/kitchen.jpg',
  'Bathroom Vanities':'/assets/approved-a908c20ce632.jpg',
  'Pantry & Tall Cabinets':'/assets/catalog-9.jpg',
  'Garage Storage Cabinets':'/assets/approved-8a9d216224b8.jpg',
  'Storage Cabinets':'/assets/approved-6075be404407.jpg',
  'Hardware':'https://images.unsplash.com/photo-1679990130718-78143499971d?auto=format&fit=crop&w=900&q=82'
 },
 appliances:{
  'Beverage Equipment':'https://cf.cjdropshipping.com/17639424/f6fb41ac-34f8-4679-91f1-389c65fd1385.jpg',
  'Coffee Systems':'/assets/idea-snack-beverage.jpg',
  'Kegerators':'https://cf.cjdropshipping.com/17639424/08f44f66-17e9-44d3-84a6-ff86a3d4d230.jpg',
  'Refrigerators':'/assets/approved-26657e8bc7bd.jpg',
  'Gas Ranges':'https://images.unsplash.com/photo-1773867567732-556eb4351fd7?auto=format&fit=crop&w=900&q=82',
  'Electric Ranges':'https://images.unsplash.com/photo-1569810861372-e9860b7bbc65?auto=format&fit=crop&w=900&q=82',
  'Wall Ovens & Cooktops':'https://images.unsplash.com/photo-1722152250374-a5584aca7de6?auto=format&fit=crop&w=900&q=82',
  'Dishwashers':'https://images.unsplash.com/photo-1721742608799-4bddb1d4b331?auto=format&fit=crop&w=900&q=82',
  'Microwaves & Hoods':'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=900&q=82',
  'Washers & Electric Dryers':'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=82',
  'Gas Dryers':'/assets/catalog-8.jpg',
  'Cords & Connections':'/assets/approved-d2807423c8f0.jpg'
 },
 tools:{
  'Power Tools':'/assets/approved-d2807423c8f0.jpg',
  'Hand Tools':'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=900&q=82',
  'Specialty Tools':'https://images.unsplash.com/photo-1685320198649-781e83a61de4?auto=format&fit=crop&w=900&q=82',
  'Drills & Impacts':'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?auto=format&fit=crop&w=900&q=82',
  'Saws & Cutting':'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=900&q=82',
  'Measuring & Layout':'https://images.unsplash.com/photo-1716698286313-9a2349d41110?auto=format&fit=crop&w=900&q=82'
 },
 supplies:{
  'Paint & Finishes':'https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=82',
  'Fasteners & Adhesives':'/assets/approved-d2807423c8f0.jpg',
  'Plumbing Supplies':'/assets/approved-b9cdb9084877.jpg',
  'Electrical Supplies':'/assets/lighting-card.jpg',
  'Appliance Cords & Connections':'https://images.unsplash.com/photo-1775714351784-51e93e4c12a7?auto=format&fit=crop&w=900&q=82',
  'Protection & Consumables':'/assets/catalog-8.jpg'
 },
 furniture:{
  'Living Room':'/assets/approved-4822ff53e23f.jpg',
  'Bedroom':'/assets/approved-807c60a6001a.jpg',
  'Dining Room':'/assets/approved-a051ee7e1935.jpg',
  'Home Office':'/assets/approved-6075be404407.jpg',
  'Outdoor Furniture':'/assets/approved-a11ab0fcd37f.jpg',
  'Décor & Accessories':'/assets/approved-8d4db6742d08.jpg'
 }
};
/* Choose a photo of the listed product type, not a rotating unrelated picture.
   Preview photographs are illustrative, never claimed as verified supplier images. */
const PRODUCT_CARD_PHOTOS={"appliances":{"WH-FD36":"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=82","SA-ER58":"https://images.unsplash.com/photo-1569810861372-e9860b7bbc65?auto=format&fit=crop&w=900&q=82","LG-DWSS":"https://images.unsplash.com/photo-1721742608799-4bddb1d4b331?auto=format&fit=crop&w=900&q=82","GE-OTRMW":"https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=900&q=82","MA-WDSET":"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=82","KA-SWO":"https://images.unsplash.com/photo-1772567733108-38d940269d86?auto=format&fit=crop&w=900&q=82","FR-GC30":"https://images.unsplash.com/photo-1773867567732-556eb4351fd7?auto=format&fit=crop&w=900&q=82","ZL-WMRH":"https://images.unsplash.com/photo-1778731525489-439d0dff9e31?auto=format&fit=crop&w=900&q=82","CA-WC24":"https://images.unsplash.com/photo-1654710695378-106a19fcbe90?auto=format&fit=crop&w=900&q=82","GE-NIM":"/assets/idea-snack-beverage.jpg","LG-SBS":"/assets/approved-26657e8bc7bd.jpg","SA-DWO":"https://images.unsplash.com/photo-1722152250374-a5584aca7de6?auto=format&fit=crop&w=900&q=82"},"tools":{"TL-DRILL":"https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?auto=format&fit=crop&w=900&q=82","TL-CIRSAW":"https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=900&q=82","TL-LASER":"/assets/stairs-card.jpg","TL-OSC":"https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=82","TL-IMPACT":"https://images.unsplash.com/photo-1776711763505-4105861e0d41?auto=format&fit=crop&w=900&q=82","TL-VAC":"/assets/catalog-8.jpg","TL-MITER":"https://images.unsplash.com/photo-1552442341-9b17c7a9edf4?auto=format&fit=crop&w=900&q=82","TL-LEVEL":"https://images.unsplash.com/photo-1567361808976-260065224468?auto=format&fit=crop&w=900&q=82","TL-STORAGE":"/assets/idea-mechanic-shop.jpg","TL-SAFETY":"https://images.unsplash.com/photo-1755925193287-275aa7fe64f0?auto=format&fit=crop&w=900&q=82","TL-SANDER":"/assets/project-stone-real.jpg","TL-LIGHT":"/assets/lighting-card.jpg"},"materials":{"MT-LVP":"/assets/flooring-card.jpg","MT-PTILE":"/assets/tile-shower.jpg","MT-DRYWALL":"/assets/project-basement.jpg","MT-CROWN":"/assets/approved-e9fee5a04016.jpg","MT-PTL":"/assets/arches-columns.jpg","MT-STONE":"/assets/project-stone-real.jpg","MT-BACKER":"/assets/showers-card.png","MT-UNDER":"/assets/approved-de82473d9ce3.jpg","MT-TRIM":"/assets/entryways-card.jpg","MT-DECK":"/assets/idea-backyard-retreat.jpg","MT-WALL":"/assets/accent-walls-card.jpg","MT-COUNTER":"/assets/kitchen.jpg"},"supplies":{"SP-ADH":"/assets/approved-d2807423c8f0.jpg","SP-DSCR":"/assets/catalog-8.jpg","SP-PAINT":"/assets/murals-card.jpg","SP-PLUMB":"/assets/approved-b9cdb9084877.jpg","SP-ELEC":"/assets/lighting-card.jpg","SP-FLOOR":"/assets/flooring-card.jpg","SP-SEAL":"/assets/approved-0ab244a922c8.jpg","SP-GROUT":"/assets/tile-shower.jpg","SP-FAST":"/assets/arches-columns.jpg","SP-DROP":"https://images.unsplash.com/photo-1535673774336-ef95d2851cf3?auto=format&fit=crop&w=900&q=82","SP-TAPE":"/assets/approved-0af816f48fb0.jpg","SP-CLEAN":"https://images.unsplash.com/photo-1759846866217-e627e4478f82?auto=format&fit=crop&w=900&q=82"},"cabinets":{"CB-SHK-SET":"/assets/kitchen.jpg","CB-MG-BASE":"/assets/approved-9bfcb89f7800.jpg","CB-VAN-01":"/assets/showers-card.png","CB-PANTRY":"/assets/catalog-9.jpg","CB-WALL":"/assets/approved-8a9d216224b8.jpg","CB-BASE":"https://images.unsplash.com/photo-1560562125-ab512e4d9d29?auto=format&fit=crop&w=900&q=82","CB-ISLAND":"/assets/approved-a051ee7e1935.jpg","CB-OPEN":"/assets/office.jpg","CB-GLASS":"/assets/approved-a908c20ce632.jpg","CB-CORNER":"/assets/approved-e9fee5a04016.jpg","CB-DRAWER":"https://images.unsplash.com/photo-1772475385426-ebd50c772229?auto=format&fit=crop&w=900&q=82","CB-HWSET":"/assets/approved-d2807423c8f0.jpg"}};
function productCardPhoto(page,item,index){
 return PRODUCT_CARD_PHOTOS[page]?.[item.sku] || PRODUCT_IMAGES[page]?.[index] || '/assets/custom-projects-card.jpg';
}
function shopPhoto(page,name){return SHOP_PICTURE_TILES[page]?.[name]||'/assets/approved-b5c632fcfbc0.jpg';}
function shopPictureTile(page,name,description,url){
 const photo=shopPhoto(page,name);
 const subtitle=description?'<small>'+description+'</small>':'';
 return '<a class="photo-category-tile" href="'+url+'"><img src="'+photo+'" alt="" loading="lazy"><span><strong>'+name+'</strong>'+subtitle+'</span></a>';
}
function shopGuideId(name){return 'browse-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}
function shopGuide(page){
 const choices=SHOP_GUIDES[page];if(!choices||new URLSearchParams(location.search).has('category'))return '';
 return '<section class="section shop-guide"><div class="wrap"><h2>Browse '+PAGES[page].title+'</h2>'+
  '<p class="lead">Explore categories with pictures. Product prices and U.S. warehouse stock must be independently verified before sale.</p>'+
  '<div class="shop-guide-grid photo-guide-grid">'+choices.map(([name,description])=>
   '<article id="'+shopGuideId(name)+'">'+shopPictureTile(page,name,description,
    '/'+(page==='tools'?'products':page)+'.html?category='+encodeURIComponent(page==='furniture'?({"Living Room":"living-room","Bedroom":"bedroom","Dining Room":"dining-room","Home Office":"home-office","Outdoor Furniture":"outdoor","Décor & Accessories":"decor"}[name]||name):name)+'#catalog-products')+'</article>'
  ).join('')+'</div></div></section>';
}

function renderCategory(page){
 const p=PAGES[page],products=PRODUCTS[page]||fallbackProducts(page),imgs=PRODUCT_IMAGES[page]||PRODUCT_IMAGES.installation;
 const productId=new URLSearchParams(location.search).get('product');
 if(page!=='furniture'&&Object.hasOwn(PRODUCTS,page)&&/^[\w-]{8,64}$/.test(productId||'')){
  const back='/'+(page==='tools'?'products':page)+'.html';
  document.title="Item Preview | Nik's Remodeling";
  document.body.innerHTML=header()+`<main class="wrap section"><nav aria-label="Breadcrumb"><a href="${back}">← ${p.title}</a></nav><h1 id="retail-page-title">Item preview</h1><div class="products" aria-live="polite"></div></main>`+footer();
  updateCartCount();loadRealCatalog(page);return;
 }
 document.title=`${p.title} | Nik's Remodeling`;
 document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('${p.hero}')"><div class="wrap"><div class="eyebrow">${p.title}</div><h1>${p.heroTitle}</h1><h2>${p.tag}</h2><p>${p.desc}</p><div class="hero-points"><span>✓ Product Photos</span><span>✓ Product Details</span><span>✓ Delivery Options</span><span>✓ Add to Review Cart</span></div></div></section>${SHOP_GUIDES[page]?'':`<div class="wrap category-tabs picture-category-tabs">${p.tabs.map(x=>page==='materials'?shopPictureTile('materials',x,'Browse '+x.toLowerCase()+' materials','/material-'+x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')+'.html'):SHOP_GUIDES[page]?shopPictureTile(page,x,'Browse '+x,'#'+shopGuideId(x)):shopPictureTile(page,x,'Browse '+x,'#catalog-products')).join('')}</div>`}${shopGuide(page)}${page==='appliances'?'<div class="wrap" style="padding:12px 0 4px"><strong>Shop draft beverage equipment:</strong> <a class="btn outline" href="/appliances.html?category=Beverage%20Equipment#catalog-products">See Beverage Equipment</a></div>':''}${page==='cabinets'?'<section class="section"><div class="wrap">'+cabinetOptionPicker()+'</div></section>':''}${page==='supplies'?'<section class="section" id="suggested-supplies"><div class="wrap" id="supply-recommendations"></div></section>':''}${page==='appliances'?'<div class="wrap appliance-supply-cta"><p>Add an appliance to your project to see possible connection supplies.</p><a class="btn outline" href="/supplies.html#suggested-supplies">Review Suggested Supplies →</a></div>':''}<section class="section alt" id="catalog-products"><div class="wrap catalog"><aside class="filters"><h3>Product Pricing</h3><p class="filter-note">Item prices include our markup. Delivery, tax and installation are extra.</p></aside><div><div class="catalog-head"><div><h2>${p.title}</h2><p class="lead">Only actual supplier listings appear here. Categories without confirmed products remain empty.</p></div><select><option>Featured</option><option>Name A–Z</option></select></div><div class="products"><p class="empty">Checking available products…</p></div></div></div></section>${'<dialog class="material-calc-dialog" id="material-calc-dialog" aria-label="Material quantity calculator"><div class="material-calc-dialog-head"><strong>Calculate while you shop</strong><button type="button" class="btn outline" onclick="closeMaterialCalculator()">Done · Continue Shopping</button></div><p id="material-calc-status" role="status"></p><iframe title="Material quantity calculator" id="material-calc-frame"></iframe></dialog>'}</main>`+projectFlow(page)+footer();updateCartCount();if(Object.hasOwn(PRODUCTS,page))loadRealCatalog(page);if(page==='supplies')renderSupplyPlan();if(page==='materials')applyMaterialShopFilter();if(SHOP_GUIDES[page])applyShopGuideFilter(page);bindServicePickers();bindCabinetOptionPickers();document.querySelectorAll('.material-calc-trigger').forEach(button=>button.addEventListener('click',()=>openMaterialCalculator(button.dataset.calcUrl)))
}
const SHOP_GUIDE_CATEGORIES={
 furniture:{'Living Room':['Living Room','Media & TV','Accent Seating'],'Bedroom':['Bedroom'],'Dining Room':['Dining Room'],'Home Office':['Home Office'],'Outdoor Furniture':['Outdoor'],'Décor & Accessories':['Rugs & Décor','Lighting']},
 cabinets:{'Base Cabinets':['Base Cabinets','Kitchen Cabinets'],'Wall & Upper Cabinets':['Wall Cabinets'],'Bathroom Vanities':['Bathroom Vanities'],'Pantry & Tall Cabinets':['Pantry Cabinets'],'Garage Storage Cabinets':[],'Storage Cabinets':['Storage Cabinets'],'Hardware':['Hardware','Accessories']},
 appliances:{'Beverage Equipment':[],'Coffee Systems':[],'Refrigerators':['Refrigerators','Wine Coolers','Ice Makers'],'Gas Ranges':['Ranges'],'Electric Ranges':['Ranges'],'Wall Ovens & Cooktops':['Ovens','Cooktops'],'Dishwashers':['Dishwashers'],'Microwaves & Hoods':['Microwaves','Range Hoods'],'Washers & Electric Dryers':['Laundry'],'Gas Dryers':['Laundry'],'Cords & Connections':[]},
 supplies:{'Paint & Finishes':['Paint'],'Fasteners & Adhesives':['Fasteners','Adhesives','Tile'],'Plumbing Supplies':['Plumbing'],'Electrical Supplies':['Electrical'],'Appliance Cords & Connections':[],'Protection & Consumables':['Protection','Cleanup']},
 tools:{'Power Tools':['Power Tools','Drilling','Sawing'],'Hand Tools':['Measuring'],'Specialty Tools':['Jobsite'],'Drills & Impacts':['Drilling'],'Saws & Cutting':['Sawing'],'Measuring & Layout':['Measuring']}
};
function applyShopGuideFilter(page){const category=new URLSearchParams(location.search).get('category');if(!category)return;const match=SHOP_GUIDE_CATEGORIES[page]?.[category];if(!match)return;
 const pageUrl='/'+(page==='tools'?'products':page)+'.html';
 document.title=category+" | Nik's Remodeling";
 const hero=document.querySelector('.category-hero');
 if(hero){hero.querySelector('h1').textContent=category;hero.querySelector('h2')?.remove();hero.querySelector('p').textContent='Browse '+category.toLowerCase()+'.';const back=document.createElement('a');back.className='btn light';back.href=pageUrl;back.textContent='← All '+PAGES[page].title;hero.querySelector('.wrap').prepend(back);}
 document.querySelector('.catalog-head h2').textContent=category;
 let count=0;document.querySelectorAll('.products .card').forEach(card=>{let visible=card.dataset.category===category||match.includes(card.dataset.category);if(page==='appliances'&&['Gas Ranges','Electric Ranges','Gas Dryers','Washers & Electric Dryers'].includes(category)){const name=card.querySelector('h3')?.textContent||'';visible=visible&&(category.startsWith('Gas')?/gas/i.test(name):category==='Electric Ranges'?/electric|induction/i.test(name):/washer|electric dryer/i.test(name))}card.hidden=!visible;if(visible)count++});const head=document.querySelector('.catalog-head');if(head){const note=document.createElement('p');note.className='calc-note';note.textContent='Showing '+category+' listings. ';
 const laborAppliance={'Coffee Systems':'coffee-systems','Kegerators':'beverage-taps','Beverage Taps':'beverage-taps'}[category];
 if(page==='appliances'&&laborAppliance){
  const link=document.createElement('a');link.href='/installation.html?appliance='+laborAppliance+'#labor-category-appliances';
  link.textContent='Add installation labor';note.append(link,document.createTextNode(' · '));
 }const clear=document.createElement('a');clear.href=pageUrl;clear.textContent='See all '+page;note.append(clear);head.append(note);}}
function openMaterialCalculator(url){if(customUrl(url)){showCustomQuote();return;}const dialog=document.getElementById('material-calc-dialog'),frame=document.getElementById('material-calc-frame');if(!dialog||!url)return;document.getElementById('material-calc-status').textContent='';frame.src=url+'&embedded=1';dialog.showModal()}
function closeMaterialCalculator(){const dialog=document.getElementById('material-calc-dialog');dialog.close();document.getElementById('material-calc-frame').src='about:blank'}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='material-estimate-saved')return;const status=document.getElementById('material-calc-status');if(status){status.textContent='Estimate saved. Continue shopping or review your cart. ';const link=document.createElement('a');link.href='/project-cart.html';link.textContent='Review Cart →';status.append(link)}});
const MATERIAL_ESTIMATES_KEY='niks-material-estimates-v1';
let materialEstimates=[];
function materialField(id,label,opts={}){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="number" min="0" step="${opts.step||'0.1'}" ${opts.value!==undefined?`value="${opts.value}"`:''} ${opts.placeholder?`placeholder="${opts.placeholder}"`:''}></div>`}
function renderCalculators(){
 if(new URLSearchParams(location.search).has('sample')){location.replace('/material-flooring.html');return;}
 // A new Projects → Calculator click is a fresh work session. Do not
 // populate this job with previously saved searches or other rooms.
 // A session marker keeps reloading the same job from resetting its progress.
 const newProjectStart=new URLSearchParams(location.search).get('projectStart');
 if(newProjectStart){
  try{
   if(sessionStorage.getItem('nr-calculator-project-start-v1')!==newProjectStart){
    sessionStorage.setItem('nr-calculator-project-start-v1',newProjectStart);
    localStorage.removeItem(MATERIAL_ESTIMATES_KEY);
   }
  }catch{materialEstimates=[];}
 }
 document.title='Project Calculator | Nik\'s Remodeling';
 document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85')"><div class="wrap"><div class="eyebrow">Plan Your Project</div><h1>Project Calculator</h1><p>Estimate quantities for several materials in one project. Confirm final quantities and product sizes before ordering.</p></div></section><section class="section"><div class="wrap calc-workspace"><div class="panel"><h2>Material Quantities</h2><div class="field"><label for="material-name">Room or area (optional)</label><input id="material-name" type="text" maxlength="60" placeholder="Example: living room"></div><div class="panel exact-product-fields" id="exact-product-fields" hidden><h3>Choose the exact product</h3><p class="calc-note">Enter the brand, product line, color, and an item number or product link. We need these details to identify the exact material and confirm its price and coverage.</p><div class="calc-fields"><div class="field"><label for="exact-brand">Brand</label><input id="exact-brand" maxlength="80" placeholder="Example: manufacturer"></div><div class="field"><label for="exact-model">Collection / model</label><input id="exact-model" maxlength="100" placeholder="Product line or model"></div><div class="field"><label for="exact-color">Color / design</label><input id="exact-color" maxlength="100" placeholder="Exact finish"></div><div class="field"><label for="exact-identifier">Item number or product link</label><input id="exact-identifier" maxlength="300" placeholder="SKU, item number, or URL"></div></div><p class="calc-note">Still deciding? Calculate the area now; you can choose a product later. The item is saved for a price request; availability and supplier cost must be checked before an order.</p></div><div class="field"><label for="material-type">Material</label><select id="material-type" onchange="showMaterialFields()"><option value="flooring">Flooring</option><option value="tile">Tile &amp; Stone</option><option value="paint">Paint &amp; Finishes</option><option value="lumber">Lumber</option><option value="trim">Trim &amp; Molding</option><option value="drywall">Drywall</option><option value="concrete">Concrete &amp; Masonry</option><option value="doors-windows">Doors &amp; Windows</option><option value="insulation">Insulation</option><option value="roofing">Roofing</option><option value="siding-exterior">Siding &amp; Exterior</option><option value="custom">Other item / material</option></select></div>
 <div class="material-fields" data-material="flooring"><h3>Flooring / Tile</h3><div class="field"><label for="floor-kind">Flooring type</label><select id="floor-kind"><option value="tile">Tile</option><option value="floating">LVP / Vinyl Plank Flooring</option><option value="glue">Glue-Down Flooring</option><option value="nail">Nail-Down Wood Flooring</option></select></div><div class="calc-fields">${materialField('floor-length','Area length (ft)',{value:12})}${materialField('floor-width','Area width (ft)',{value:10})}<div class="field"><label for="floor-waste">Waste allowance</label><select id="floor-waste"><option value="0.05">5%</option><option value="0.10" selected>10%</option><option value="0.15">15%</option><option value="0.20">20%</option></select></div>${materialField('floor-box','Coverage per box (sq. ft., optional)',{placeholder:'From product label'})}</div></div>
 <div class="material-fields" data-material="paint" hidden><h3>Paint</h3><fieldset class="field project-options paint-surfaces"><legend>What are you painting? Choose all that apply.</legend>${['Ceiling','Walls','Trim','Other'].map(name=>`<label><input type="checkbox" name="paint-surface" value="${name.toLowerCase()}" id="paint-surface-${name.toLowerCase()}" onchange="showPaintSurfaceFields()"> ${name}</label>`).join('')}</fieldset><div data-paint-surface="ceiling" hidden><h4>Ceiling</h4><div class="calc-fields">${materialField('paint-ceiling-length','Ceiling length (ft)')}${materialField('paint-ceiling-width','Ceiling width (ft)')}</div></div><div data-paint-surface="trim" hidden><h4>Trim</h4><div class="calc-fields">${materialField('paint-trim-length','Total trim length (linear ft)')}${materialField('paint-trim-width','Painted trim width (inches)',{placeholder:'Total width of faces to paint'})}</div></div><div data-paint-surface="walls" hidden><h4>Walls</h4><div class="calc-fields">${materialField('paint-length','Total length of the walls (ft)')}${materialField('paint-height','Wall height (ft)')}${materialField('paint-openings','Doors/windows to subtract (sq. ft.)',{value:0})}</div></div><div data-paint-surface="other" hidden><h4>Other surface</h4><div class="field"><label for="paint-other-description">What are you painting?</label><input id="paint-other-description" placeholder="Doors, cabinets, deck, fence, or another surface"></div><div class="calc-fields">${materialField('paint-other-area','Total paintable area (sq. ft.)')}</div></div><div class="calc-fields">${materialField('paint-coats','Number of coats',{step:1,value:2})}${materialField('paint-coverage','Coverage per gallon per coat (sq. ft.)',{step:1,value:350})}</div></div>
 <div class="material-fields" data-material="lumber" hidden><h3>Wood / Wall Framing</h3><div class="calc-fields">${materialField('wood-length','Wall length (ft)',{value:12})}${materialField('wood-height','Wall height (ft)',{value:8})}<div class="field"><label for="wood-spacing">Stud spacing, on center</label><select id="wood-spacing"><option value="16">16 in.</option><option value="24">24 in.</option></select></div></div><p class="calc-note">Counts one stud at each end and three plate runs. Add lumber for openings, corners and blocking after reviewing the plan.</p></div>
 <div class="material-fields" data-material="drywall" hidden><h3>Drywall</h3><div class="calc-fields">${materialField('dry-length','Total wall length (ft)',{value:40})}${materialField('dry-height','Wall height (ft)',{value:8})}${materialField('dry-openings','Doors/windows to subtract (sq. ft.)',{value:0})}<div class="field"><label for="dry-sheet">Sheet size</label><select id="dry-sheet"><option value="32">4 × 8 ft.</option><option value="48">4 × 12 ft.</option></select></div><div class="field"><label for="dry-waste">Waste allowance</label><select id="dry-waste"><option value="0.10">10%</option><option value="0.15" selected>15%</option><option value="0.20">20%</option></select></div></div></div>
 <div class="material-fields" data-material="custom" hidden><h3>Other item / material</h3><div class="calc-fields">${materialField('custom-quantity','Quantity needed',{value:1})}<div class="field"><label for="custom-unit">Unit</label><select id="custom-unit"><option value="pieces">Pieces</option><option value="linear ft.">Linear feet</option><option value="sq. ft.">Square feet</option></select></div></div><p class="calc-note">Enter the measured quantity. Confirm coverage or pack size with the actual product before ordering.</p></div>
 <div class="material-fields" data-material="concrete" hidden><h3>Concrete Slab</h3><div class="calc-fields">${materialField('concrete-length','Length (ft)',{value:12})}${materialField('concrete-width','Width (ft)',{value:10})}${materialField('concrete-depth','Depth (in.)',{value:4})}<div class="field"><label for="concrete-waste">Extra allowance</label><select id="concrete-waste"><option value="0.05" selected>5%</option><option value="0.10">10%</option></select></div></div></div>
 <fieldset class="field labor-choices"><legend>Optional labor</legend><label><input type="checkbox" name="labor-service" value="Installation"> Installation</label><label><input type="checkbox" name="labor-service" value="Removal"> Removal</label><label><input type="checkbox" name="labor-service" value="Prep"> Prep</label></fieldset><button class="btn primary" type="button" onclick="calcMaterial()">Add Calculation</button><p class="calc-error" id="mat-error" role="alert" hidden></p></div><div class="calc-side"><div class="panel"><div class="calc-results-head"><h2>Project Material List</h2><button class="btn outline" type="button" onclick="clearMaterialEstimates()" id="clear-materials" hidden>Clear All</button></div><div id="material-results" aria-live="polite"><p class="calc-note">Add a material to see the estimate here.</p></div><p><a class="btn primary" href="/materials.html">Next: Shop Materials →</a></p><p><a href="/materials.html">Shop All Materials</a> · </p><p class="calc-note">Planning estimates only. Product coverage, cuts, openings and site conditions can change what you need. No prices are shown.</p></div><div class="panel"><h2>Installation / Labor</h2><p>Check Installation before adding a calculation, then add the labor scope to your Review Cart. The measured quantity helps us prepare a quote; removal, prep, layout, access and finish details are confirmed during review.</p><div class="btns"><a class="btn primary" href="tel:${SITE.phone.replaceAll('-','')}">Call for Scope Review</a><a class="btn outline" href="sms:${SITE.text.replaceAll('-','')}">Text Project Details</a></div></div></div></div></section></main>`+footer();
 try{const saved=JSON.parse(localStorage.getItem(MATERIAL_ESTIMATES_KEY)||'[]');materialEstimates=Array.isArray(saved)?saved.filter(x=>x&&typeof x.title==='string'&&typeof x.result==='string').slice(0,50):[]}catch{materialEstimates=[]}
 renderMaterialEstimates();updateCartCount();if(new URLSearchParams(location.search).has('embedded'))document.body.classList.add('embedded-calculator');
 const params=new URLSearchParams(location.search),kind=params.get('material'),product=params.get('product');const selected={refinish:'refinish',prep:'prep',misc:'misc',delivery:'delivery',debris:'debris',tile:'flooring',flooring:'flooring',drywall:'drywall',lumber:'lumber',paint:'paint',concrete:'concrete',custom:'custom'}[kind];if(selected){document.getElementById('material-type').value=selected;if(kind==='tile'||kind==='flooring')document.getElementById('floor-kind').value=['tile','floating','glue','nail'].includes(params.get('floorKind'))?params.get('floorKind'):kind==='tile'?'tile':'floating';showMaterialFields()}if(product&&!selected){document.getElementById('material-type').value='custom';showMaterialFields()}if(params.has('labor')){const chosen=(params.get('services')||params.get('service')||'Installation').split(',');document.querySelectorAll('[name="labor-service"]').forEach(box=>{box.checked=chosen.includes(box.value)})}if(product){document.getElementById('exact-product-fields').hidden=false;const sample=params.get('sample'),sampleModel=params.get('sampleLabel');if(sampleModel){document.getElementById('exact-brand').value='Sample only';document.getElementById('exact-model').value=sampleModel;document.getElementById('exact-color').value='Choose color later';document.getElementById('exact-identifier').value=params.get('sampleCode')||'DEMO-'+sample.toUpperCase();document.getElementById('exact-product-fields').insertAdjacentHTML('afterbegin','<p class="calc-note">Sample selection for layout testing. No actual product or price is available yet.</p>')}const note=document.createElement('p');note.className='calc-note';note.textContent=`Planning quantity for ${product}. Add your measurements below.`;const returnType=params.get('returnType');if(returnType){const back=document.createElement('a');back.href='/material-flooring.html?type='+encodeURIComponent(returnType);back.textContent=' ← Change sample';note.append(back)}document.querySelector('.calc-workspace .panel').prepend(note)}
}
function showMaterialFields(){const selected=document.getElementById('material-type').value;const type=selected==='refinish'?'refinish':selected==='tile'?'flooring':['trim','doors-windows','insulation','roofing','siding-exterior'].includes(selected)?'custom':selected;const floorKind=document.getElementById('floor-kind');if(selected==='tile'&&floorKind)floorKind.value='tile';document.querySelectorAll('.material-fields').forEach(el=>{el.hidden=el.dataset.material!==type});document.getElementById('mat-error').hidden=true}
function showPaintSurfaceFields(){document.querySelectorAll('[data-paint-surface]').forEach(el=>{el.hidden=!document.getElementById('paint-surface-'+el.dataset.paintSurface)?.checked})}
function paintMeasurementPlan(){
 const selected=[...document.querySelectorAll('[name="paint-surface"]:checked')].map(el=>el.value);
 if(!selected.length)throw Error('Choose the surfaces you are painting.');
 const coats=materialPositive('paint-coats'),coverage=materialPositive('paint-coverage');
 if(!Number.isInteger(coats))throw Error('Enter a whole number of coats.');
 const surfaces=selected.map(surface=>{
  const area=surface==='other'?materialPositive('paint-other-area'):surface==='ceiling'?materialPositive('paint-ceiling-length')*materialPositive('paint-ceiling-width'):surface==='trim'?materialPositive('paint-trim-length')*materialPositive('paint-trim-width')/12:materialPositive('paint-length')*materialPositive('paint-height')-materialNumber('paint-openings');
  if(area<=0)throw Error('Wall area must be larger than the openings.');
  if(surface==='other'&&!document.getElementById('paint-other-description').value.trim())throw Error('Tell us what other surface you are painting.');
  return {surface,label:surface==='other'?document.getElementById('paint-other-description').value.trim():surface[0].toUpperCase()+surface.slice(1),area,gallons:Math.ceil(area*coats/coverage)};
 });
 return {area:surfaces.reduce((sum,x)=>sum+x.area,0),gallons:surfaces.reduce((sum,x)=>sum+x.gallons,0),surfaces,coats,coverage};
}
function materialNumber(id){const input=document.getElementById(id),n=Number(input.value);if(input.value.trim()===''||!Number.isFinite(n)||n<0)throw Error('Enter valid, nonnegative numbers for the selected material.');return n}
function materialPositive(id){const n=materialNumber(id);if(n<=0){const field=document.getElementById(id);field?.focus();const question={'paint-height':'How tall is the wall?','dry-height':'How tall is the wall?','paint-length':'How long is the wall?','dry-length':'How long is the wall?','floor-length':'What is the length?','floor-width':'What is the width?'}[id];const label=document.querySelector('label[for=\"'+id+'\"]')?.textContent||'this measurement';throw Error(question||'Enter '+label+' to continue.');}return n}
function selectedProjectOptions(){
 const selected=[...document.querySelectorAll('[name="project-option"]:checked')].map(box=>box.value);
 if(selected.includes('Materials'))selected.push('Supplies');
 return selected;
}
function selectedDeliveryTypes(){
 if(!document.querySelector('[name="project-option"][value="Delivery"]:checked'))return [];
 const selected=[...document.querySelectorAll('[name="delivery-type"]:checked')].map(box=>box.value);
 if(!selected.length)throw Error('Choose Store Pickup & Delivery, Furniture & Appliance Delivery, or both.');
 return selected;
}
function calcMaterial(){
 const selectedType=document.getElementById('material-type').value;const type=selectedType==='refinish'?'refinish':selectedType==='tile'?'flooring':['trim','doors-windows','insulation','roofing','siding-exterior'].includes(selectedType)?'custom':selectedType,error=document.getElementById('mat-error');error.hidden=true;
 const labels={flooring:'Flooring / Tile',paint:'Paint',lumber:'Wood / Framing Lumber',drywall:'Drywall',concrete:'Concrete',custom:'Other item / material'};
 try{
  const deliveryTypes=selectedDeliveryTypes();
  const materials=document.querySelector('[name="project-option"][value="Materials"]');
  if(!materials?.checked && !document.querySelector('[name="labor-service"]:checked, [name="labor-hourly"]:checked'))throw Error('Select Materials, Installation, or Miscellaneous labor.');
  if(!materials?.checked && !document.querySelector('[name="labor-service"]:checked')) {
   const rawHours=document.getElementById('misc-hours').value.trim(),hours=Number(rawHours);
   if(!rawHours || !Number.isFinite(hours) || hours<=0)throw Error('Enter estimated misc. hours greater than zero.');
   const areaName=document.getElementById('material-name').value.trim();
   materialEstimates.push({type:'plan',title:areaName||'Miscellaneous labor',result:`${hours} hours of miscellaneous labor`,detail:'Estimated at $75 per hour.',measurements:{},labor:[{service:'Miscellaneous labor',scope:areaName||'Project',quantity:hours,unit:'hours',hourlyRate:75,price:hours*75}],projectOptions:selectedProjectOptions(),deliveryTypes});
   if(materialEstimates.length>50)materialEstimates.shift();saveMaterialEstimates();renderMaterialEstimates();
   if(window.parent!==window)window.parent.postMessage({type:'material-estimate-saved'},location.origin);
   return;
  }
  const materialChoice=document.getElementById('material-choice');
  const selectedMaterial=materialChoice?.value;
  const projectLocation=document.getElementById('project-location')?.value||'interior';
  if(materials?.checked && materialChoice && !selectedMaterial)throw Error('Choose the material you need.');
  const materialDescription=document.getElementById('material-description')?.value.trim();
  if(materials?.checked && selectedMaterial==='Other material' && !materialDescription)throw Error('Enter the material name in Material details.');
  if(materials?.checked && document.getElementById('quantity-method')?.value==='known') {
   if(document.querySelector('[name="labor-service"]:checked'))throw Error('Choose Calculate from measurements for an installation quote, so labor uses the project dimensions.');
   const quantity=materialPositive('known-quantity'),unit=document.getElementById('known-unit').value;
   const labor=[];
   if(document.querySelector('[name="labor-hourly"]:checked')){const hours=materialPositive('misc-hours');labor.push({service:'Miscellaneous labor',scope:selectedMaterial,quantity:hours,unit:'hours',hourlyRate:75,price:hours*75});}
   materialEstimates.push({type:'custom',title:(/^(Interior|Exterior) /i.test(selectedMaterial)?'':projectLocation==='exterior'?'Exterior ':'Interior ')+selectedMaterial+(materialDescription?' — '+materialDescription:''),result:`${quantity} ${unit}`,detail:'Quantity entered by customer.',purchase:{quantity,unit},measurements:{quantity,unit},labor,projectOptions:selectedProjectOptions(),deliveryTypes});
   saveMaterialEstimates();renderMaterialEstimates();return;
  }
  let result='',detail='';
  if(type==='flooring'){
   const area=materialPositive('floor-length')*materialPositive('floor-width'),waste=materialNumber('floor-waste'),needed=area*(1+waste),box=document.getElementById('floor-box').value.trim();
   result=`${Math.ceil(needed)} sq. ft. to cover`;detail=`${area.toFixed(1)} sq. ft. area + ${Math.round(waste*100)}% waste`;
   if(box){const coverage=materialPositive('floor-box');result+=` · ${Math.ceil(needed/coverage)} boxes at ${coverage} sq. ft./box`}
  }else if(type==='paint'){
   const paint=paintMeasurementPlan();
   result=`${paint.gallons} gallons estimated`;
   detail=paint.surfaces.map(x=>`${x.label}: ${x.area.toFixed(1)} sq. ft., ${x.gallons} gallons`).join(' · ')+` · ${paint.coats} coats at ${paint.coverage} sq. ft./gallon. Each surface estimated separately.`;
  }else if(type==='lumber'){
   const length=materialPositive('wood-length'),height=materialPositive('wood-height'),spacing=materialPositive('wood-spacing');
   result=`${Math.ceil(length*12/spacing)+1} studs, each at least ${height} ft. · ${(length*3).toFixed(1)} linear ft. of plates`;detail=`${length} ft. wall at ${spacing} in. on center; two top plates and one bottom plate`;
  }else if(type==='drywall'){
   const area=materialPositive('dry-length')*materialPositive('dry-height')-materialNumber('dry-openings'),sheet=materialPositive('dry-sheet'),waste=materialNumber('dry-waste');
   if(area<=0)throw Error('Wall area must be larger than the openings.');
   result=`${Math.ceil(area*(1+waste)/sheet)} sheets (${sheet===32?'4 × 8':'4 × 12'} ft.)`;detail=`${area.toFixed(1)} sq. ft. net wall area + ${Math.round(waste*100)}% waste`;
  }else if(type==='concrete'){
   const cubicYards=materialPositive('concrete-length')*materialPositive('concrete-width')*materialPositive('concrete-depth')/12/27,waste=materialNumber('concrete-waste');
   result=`${(Math.ceil(cubicYards*(1+waste)*100)/100).toFixed(2)} cubic yards`;detail=`${cubicYards.toFixed(2)} cu. yd. slab volume + ${Math.round(waste*100)}% allowance`;
  }
  if(type==='custom'){const quantity=materialPositive('custom-quantity'),unit=document.getElementById('custom-unit').value;result=`${quantity} ${unit} needed`;detail='Measured quantity supplied by customer; verify package coverage and product specifications.'}
  if(!result)throw Error('Choose a material.');
  const areaName=document.getElementById('material-name').value.trim();let measurements={};
  if(type==='flooring'){const length=materialPositive('floor-length'),width=materialPositive('floor-width');measurements={area:length*width,coverage:length*width*(1+materialNumber('floor-waste')),perimeter:2*(length+width)}}
  if(type==='paint'){measurements=paintMeasurementPlan()}
  if(type==='lumber'){measurements={length:materialPositive('wood-length'),studs:Math.ceil(materialPositive('wood-length')*12/materialPositive('wood-spacing'))+1}}
  if(type==='drywall'){measurements={area:materialPositive('dry-length')*materialPositive('dry-height')-materialNumber('dry-openings'),sheets:Math.ceil((materialPositive('dry-length')*materialPositive('dry-height')-materialNumber('dry-openings'))*(1+materialNumber('dry-waste'))/materialPositive('dry-sheet'))}}
  if(type==='concrete'){measurements={area:materialPositive('concrete-length')*materialPositive('concrete-width'),yards:materialPositive('concrete-length')*materialPositive('concrete-width')*materialPositive('concrete-depth')/12/27,perimeter:2*(materialPositive('concrete-length')+materialPositive('concrete-width'))}}
  if(type==='custom')measurements={quantity:materialPositive('custom-quantity'),unit:document.getElementById('custom-unit').value};
  const laborUnits=type==='lumber'?'linear ft.':type==='custom'?measurements.unit:'sq. ft.';const laborQuantity=type==='lumber'?measurements.length:type==='custom'?measurements.quantity:measurements.area;const chosenServices=[...document.querySelectorAll('[name="labor-service"]:checked')].map(box=>box.value);const projectOptions=selectedProjectOptions();const scope=(type==='paint'?'Paint: '+measurements.surfaces.map(x=>x.label).join(', '):null)||new URLSearchParams(location.search).get('product')|| (type==='flooring'?document.getElementById('floor-kind').selectedOptions[0].textContent:labels[type]);const labor=chosenServices.map(service=>({service,scope,quantity:Number(laborQuantity.toFixed(1)),unit:laborUnits}));[...document.querySelectorAll('[name="labor-hourly"]:checked')].forEach(box=>{const hours=materialPositive('misc-hours');labor.push({service:box.value,scope,quantity:hours,unit:'hours',hourlyRate:75,price:hours*75})});
  const chosenProduct=new URLSearchParams(location.search).get('product');const isSample=new URLSearchParams(location.search).has('sample');const exact=chosenProduct?{brand:document.getElementById('exact-brand').value.trim(),model:document.getElementById('exact-model').value.trim(),color:document.getElementById('exact-color').value.trim(),identifier:document.getElementById('exact-identifier').value.trim()}:null;const purchase=type==='flooring'?{quantity:Math.ceil(measurements.coverage),unit:'sq. ft.'}:type==='paint'?{quantity:Number.parseInt(result,10),unit:'gallons'}:type==='drywall'?{quantity:measurements.sheets,unit:'sheets'}:type==='concrete'?{quantity:Number.parseFloat(result),unit:'cubic yards'}:type==='custom'?{quantity:measurements.quantity,unit:measurements.unit}:null;
  materialEstimates.push({product:chosenProduct,exact,isSample,purchase,type,floorKind:type==='flooring'?document.getElementById('floor-kind').value:undefined,title:`${/^(Interior|Exterior) /i.test(selectedMaterial||'')?'':projectLocation==='exterior'?'Exterior ':'Interior '}${selectedMaterial||labels[type]}${type==='paint'?' ('+measurements.surfaces.map(x=>x.label).join(', ')+')':''}${materialDescription?' ('+materialDescription+')':''}${areaName?` — ${areaName}`:''}`,result,detail,measurements,labor,projectOptions,deliveryTypes});
  if(materialEstimates.length>50)materialEstimates.shift();saveMaterialEstimates();renderMaterialEstimates();if(window.parent!==window)window.parent.postMessage({type:'material-estimate-saved'},location.origin);
 }catch(e){error.textContent=e.message;error.hidden=false}
}
function saveMaterialEstimates(){try{localStorage.setItem(MATERIAL_ESTIMATES_KEY,JSON.stringify(materialEstimates))}catch{}}
function flooringLaborEstimate(item, service){
 if(service!=='Installation'||item.type!=='flooring')return null;
 // Coatings do not use the approved plank/tile installation packages.
 if((item.products||[]).some(p=>p.name==='Concrete Floor Paint'))return null;
 const area=Number(item.measurements?.area);if(!Number.isFinite(area)||area<=0)return null;
 const primary=(item.products||[]).find(p=>! /underlayment|backer|trim/i.test(p.name));
 const kind=/laminate/i.test(primary?.name||item.materialChoice||'')?'Laminate':item.floorKind==='tile'?'Tile':item.floorKind==='floating'?'LVP':item.floorKind==='glue'?'Glue-down':'Hardwood';
 const rates={LVP:[350,575,800],Laminate:[300,500,700],'Glue-down':[400,650,900],Hardwood:[500,900,1300],Tile:[650,1000,1500]};
 const key=kind==='LVP'?'LVP':kind; const tier=area<=40?0:area<=144?1:2; const base=rates[key][tier]; const amount=key==='LVP'&&area>250?Math.ceil(4250*(area/1200)):area<=250?base:Math.ceil(base+((area-250)*(rates[key][2]-rates[key][1])/(250-144))); const sizeLabel=area>250?'Large project':tier===0?'Small':tier===1?'Average':'Large';
 return {amount,tier:sizeLabel,label:key,includes:key==='Tile'?'Includes grout and perimeter trim.':'Includes perimeter trim.'};
}
function renderMaterialEstimates(){const list=document.getElementById('material-results');list.replaceChildren();document.getElementById('clear-materials').hidden=materialEstimates.length===0;if(!materialEstimates.length){const p=document.createElement('p');p.className='calc-note';p.textContent='Add a material to see the estimate here.';list.append(p);return}materialEstimates.forEach((item,index)=>{const row=document.createElement('article');row.className='material-result';const info=document.createElement('div'),title=document.createElement('strong'),amount=document.createElement('div'),detail=document.createElement('small'),remove=document.createElement('button');title.textContent=item.title;amount.textContent=item.result;detail.textContent=item.detail;remove.type='button';remove.className='remove-material';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${item.title}`);remove.onclick=()=>{materialEstimates.splice(index,1);saveMaterialEstimates();renderMaterialEstimates()};info.append(title,amount,detail);const shop=document.createElement('a');shop.href=materialShopLink(item);shop.textContent='Shop matching materials →';if(!['plan','bathroom'].includes(item.type))info.append(shop);if(Array.isArray(item.projectOptions)){if(item.projectOptions.includes('Supplies')){const link=document.createElement('a');link.href='/supplies.html#suggested-supplies';link.textContent='Review suggested supplies →';info.append(link)}if(item.projectOptions.includes('Tools')){const link=document.createElement('a');link.href='/tools.html';link.textContent='Browse tools →';info.append(link)}const requests=[];if(item.projectOptions.includes('Debris Removal'))requests.push('Debris Removal');if(item.projectOptions.includes('Delivery'))requests.push(...(Array.isArray(item.deliveryTypes)&&item.deliveryTypes.length?item.deliveryTypes:['Delivery']));requests.forEach(service=>{const addService=document.createElement('button');addService.type='button';addService.className='btn outline';addService.textContent=`Add ${service} to Review Cart`;addService.onclick=()=>{const name=`${service}: ${item.title}`;const cart=getCart();if(!cart.some(x=>x.name===name&&x.type==='Service')){cart.push({name,qty:1,type:'Service'});saveCart(cart)}addService.textContent='Added to Review Cart';addService.disabled=true};info.append(addService)})}if(item.product&&item.purchase&&Number.isFinite(item.purchase.quantity)&&item.purchase.quantity>0){const exact=item.exact,complete=exact&&exact.brand&&exact.model&&exact.color&&exact.identifier;if(item.isSample||!complete){const missing=document.createElement('p');missing.className='calc-note';missing.textContent=item.isSample?'Sample product selected. Quantity is for testing; this item cannot be ordered or priced yet.':'Quantity calculated. Choose the exact brand, model, color and item number or product link before requesting a price.';info.append(missing)}else{const identification=document.createElement('p');identification.className='calc-note';identification.textContent=`${exact.brand} · ${exact.model} · ${exact.color} · ${exact.identifier}`;info.append(identification);const addMaterial=document.createElement('button');addMaterial.type='button';addMaterial.className='btn outline';addMaterial.textContent=`Request price for ${item.purchase.quantity} ${item.purchase.unit}`;addMaterial.onclick=()=>{const name=`${item.product}: ${exact.brand} ${exact.model}, ${exact.color} [${exact.identifier}] — ${item.purchase.quantity} ${item.purchase.unit}`,cart=getCart();if(!cart.some(x=>x.name===name&&x.type==='Material quote')){cart.push({name,qty:1,type:'Material quote'});saveCart(cart)}addMaterial.textContent='Added to quote request';addMaterial.disabled=true};info.append(addMaterial)}}(Array.isArray(item.labor)?item.labor:item.labor?[item.labor]:[]).forEach(service=>{if(!Number.isFinite(service.quantity)||service.quantity<=0)return;const labor=document.createElement('p'),add=document.createElement('button');labor.className='calc-note';const quote=flooringLaborEstimate(item,service.service); labor.textContent=service.quoteRequired||service.fixedPackage&&!Number.isFinite(service.price)?`${service.scope}: In-person quote required.`:service.fixedPackage?`${service.scope}: $${service.price.toLocaleString()} (${service.quantity} each). ${service.packageNote}`:quote?`${service.service||'Installation'} TOTAL: ${quote.amount.toLocaleString()} (${quote.tier} ${quote.label}, ${service.quantity} ${service.unit}). ${quote.includes}`:service.unitPrice?`${service.service} TOTAL: ${service.price.toLocaleString()} (${service.quantity} ${service.unit} at ${service.unitPrice}/${service.service==='Paint cabinet door and matching box'?'door':'box'}). ${service.service==='Paint cabinet door and matching box'?'Associated box included; paint and other materials extra.':service.service==='Remove cabinet box and haul off'?'Haul-off included; $150 minimum trip charge.':'Hardware separate.'}`:service.price?`${service.service} TOTAL: ${service.price.toLocaleString()} (${service.quantity} hours at ${service.hourlyRate}/hr).`:`${service.service||'Installation'} requested: ${service.quantity} ${service.unit} of ${service.scope}; pricing after scope review.`;add.type='button';add.className='btn outline';add.textContent=`Add ${service.service||'Installation'} to Review Cart`;add.onclick=()=>{const name=quote?`${service.service||'Installation'}: ${quote.label} — ${service.quantity} ${service.unit} — ${quote.amount}`:`${service.service||'Installation'}: ${service.scope} (${service.quantity} ${service.unit})`;const cart=getCart();if(!cart.some(x=>x.name===name&&x.type==='Labor')){cart.push({name,qty:1,type:'Labor',price:quote?.amount||service.price||null});saveCart(cart)}add.textContent='Added to Review Cart';add.disabled=true};info.append(labor,add)});row.append(info,remove);list.append(row)})}
function clearMaterialEstimates(){materialEstimates=[];saveMaterialEstimates();renderMaterialEstimates()}
const APPLIANCE_SUPPLY_GUIDE={
 'Refrigerators':{label:'Refrigerator Connections',items:[['Water supply line and fittings','For models with an ice maker or dispenser; match the valve and appliance.'],['Water shutoff valve','If an accessible compatible valve is not already in place.'],['Water filter','If the model uses a replaceable filter and one is not included.']]},
 'Ranges':{label:'Electric Range Connections',items:[['Model-compatible range power cord','Confirm the outlet, wiring and installation instructions before choosing a cord.'],['Anti-tip bracket and hardware','Check whether the model already includes the correct bracket.'],['Range gap or trim kit','Only if needed for the cabinet opening.']]},
 'Dishwashers':{label:'Dishwasher Connections',items:[['Water supply line and compatible elbow or adapters','Match the shutoff and dishwasher inlet.'],['Power cord kit or approved hardwire parts','Follow the model instructions and existing connection.'],['Drain hose, extension or air-gap parts','Only as needed for the sink connection and local requirements.'],['Mounting brackets and fasteners','Check what is included with the dishwasher.']]},
 'Microwaves':{label:'Over-the-Range Microwave',items:[['Model-specific mounting bracket and hardware','Check the supplied kit before buying extras.'],['Vent duct, damper and outside cap','For an outside-vented installation.'],['Charcoal filter or recirculation kit','For a ductless installation if required by the model.']]},
 'Laundry':{label:'Washer & Dryer Connections',items:[['Hot and cold washer inlet hoses','Match the valves and washer.'],['Washer drain hose or extension','If the supplied hose does not fit the drain layout.'],['Electric dryer cord or approved gas connector','Depends on the dryer fuel type and existing hookup.'],['Dryer vent duct, clamps and exterior vent parts','For vented dryers; match the installation instructions.'],['Stacking kit or drain pan','Only if the layout calls for one.']]},
 'Ovens':{label:'Wall Oven Connections',items:[['Model-specified electrical connection parts','Confirm circuit and connection method before selection.'],['Cabinet support or trim kit','Only if required by the opening and model.']]},
 'Cooktops':{label:'Gas Cooktop Connections',items:[['Approved gas connector and shutoff parts','Match the installation instructions and existing supply.'],['LP conversion kit','Only for propane installations; check what is included.'],['Cooktop seal or trim kit','If specified by the model.']]},
 'Range Hoods':{label:'Range Hood Connections',items:[['Vent duct, elbows, damper and outside cap','For ducted exhaust.'],['Recirculation filter kit','For ductless installations if allowed by the model.'],['Mounting hardware and electrical connection parts','Check the model kit and installation method.']]},
 'Wine Coolers':{label:'Wine Cooler Setup',items:[['Cabinet trim or ventilation kit','Only if specified for built-in installation.'],['Anti-tip hardware','If required by the model.']]},
 'Ice Makers':{label:'Ice Maker Connections',items:[['Water supply line, shutoff and fittings','Match the model and existing valve.'],['Drain line or pump kit','Only for models requiring a drain.'],['Water filter','If specified and not included.']]}
};
function applianceSupplyGroup(item){const match=PRODUCTS.appliances.find(p=>p.name===item.name);return match&&APPLIANCE_SUPPLY_GUIDE[match.category]?match.category:null}
const SUPPLY_QUANTITIES_KEY='niks-supply-quantities-v1';
function supplyStartingQuantity(group,name,estimates){const matching=estimates.filter(item=>estimateSupplyGroup(item)===group);if(!matching.length)return null;
 const rules={
 tile:{'Compatible tile mortar':[m=>m.coverage/50,'50 lb. bags, 50 sq. ft./bag assumed'],'Grout':[m=>m.coverage/100,'bags, 100 sq. ft./bag assumed'],'Tile spacers or leveling clips':[m=>m.coverage/100,'packs, 100 sq. ft./pack assumed'],'Backer board, screws and alkali-resistant tape or uncoupling membrane':[m=>m.coverage/15,'4 × 4 ft. board equivalents or 15 sq. ft. membrane sections'],'Waterproofing membrane and seam tape':[m=>m.coverage,'sq. ft. coverage, if waterproofing is required']},
 floating:{'Compatible underlayment':[m=>m.coverage,'sq. ft. coverage'],'Moisture or vapor barrier':[m=>m.coverage,'sq. ft. coverage, if required'],'Underlayment seam tape':[m=>m.coverage/500,'rolls, 500 sq. ft./roll assumed'],'Baseboard or shoe molding':[m=>m.perimeter,'linear ft. perimeter']},
 glue:{'Manufacturer-approved flooring adhesive':[m=>m.coverage/150,'pails, 150 sq. ft./pail assumed']},
 nail:{'Approved flooring nails or staples':[m=>m.coverage/200,'boxes, 200 sq. ft./box assumed'],'Specified underlayment or flooring paper':[m=>m.coverage,'sq. ft. coverage'],'Baseboard or shoe molding':[m=>m.perimeter,'linear ft. perimeter']},
 flooring:{'Subfloor preparation supplies':[m=>m.coverage,'sq. ft. to assess']},
 paint:{'Primer':[m=>m.area/m.paintCoverage,'gallons, one coat at entered coverage'],'Patching compound or spackle':[m=>m.area/500,'containers, one per 500 sq. ft. assumed'],'Sandpaper or sanding screens':[m=>m.area/400,'packs, one per 400 sq. ft. assumed'],"Painter’s tape and masking film":[m=>m.area/400,'rolls, one per 400 sq. ft. assumed'],'Drop cloths':[m=>m.area/400,'cloths, one per 400 sq. ft. assumed'],'Brushes, roller covers, frame and tray':[m=>m.area/400,'roller kits, one per 400 sq. ft. assumed']},
 lumber:{'Framing nails or approved structural screws':[m=>m.studs/100,'boxes, one per 100 studs assumed'],'Treated bottom plate and sill gasket':[m=>m.length,'linear ft. bottom plate, if required']},
 drywall:{'Drywall screws':[m=>m.sheets/5,'lb., one per 5 sheets assumed'],'Joint tape':[m=>m.sheets/20,'rolls, one per 20 sheets assumed'],'Joint compound':[m=>m.sheets/10,'buckets, one per 10 sheets assumed'],'Sanding supplies and drywall primer':[m=>m.area/350,'gallons primer, 350 sq. ft./gallon assumed']},
 concrete:{'Compactible gravel or crushed stone':[m=>m.area*4/12/27,'cu. yd. base, 4 in. depth assumed'],'Form boards, stakes and fasteners':[m=>m.perimeter,'linear ft. of form boards'],'Reinforcement and supports':[m=>m.area,'sq. ft. reinforcement area, if specified'],'Vapor barrier and seam tape':[m=>m.area,'sq. ft. coverage, if required'],'Curing compound or curing cover':[m=>m.area/200,'gallons compound, 200 sq. ft./gallon assumed']}
 };
 const rule=rules[group]?.[name];if(!rule)return null;let total=0;for(const item of matching){const old=Number.parseFloat(item.result),detail=Number.parseFloat(item.detail),raw=item.measurements||{};const m={coverage:raw.coverage||old,area:raw.area||detail||old,perimeter:raw.perimeter||0,paintCoverage:raw.coverage||350,length:raw.length||Number.parseFloat(item.detail)||0,studs:raw.studs||old,sheets:raw.sheets||old};const value=rule[0](m);if(Number.isFinite(value)&&value>0)total+=value}return total?{quantity:Math.ceil(total),unit:rule[1]}:null}

const SUPPLY_CHECKS_KEY='niks-supply-checks-v1';
const SUPPLY_GUIDE={
 general:{label:'General Job Supplies',items:[['Floor and surface protection','Protect finishes along work paths.'],['Painter’s tape and masking film','For masking and temporary protection.'],['Drop cloths and plastic sheeting','For dust and surface protection.'],['Construction adhesive','Only where the product assembly calls for it.'],['Caulk and sealant','Match interior, exterior, wet-area or paintable use.'],['Assorted compatible fasteners','Select for the material and substrate.'],['Shims and spacers','For fitting and alignment.'],['Cleaning supplies and trash bags','For worksite cleanup.'],['Safety glasses, gloves and dust protection','Choose for the task and product directions.']]},
 tile:{label:'Tile',items:[['Compatible tile mortar','Match the tile, membrane and substrate.'],['Grout','Choose the type and color for the joint width.'],['Tile spacers or leveling clips','Match the desired joint and tile size.'],['Tile edge trim and transitions','Where tile ends or meets another floor.'],['Flexible sealant','At changes of plane and movement joints.'],['Backer board, screws and alkali-resistant tape or uncoupling membrane','Select the required substrate system.'],['Waterproofing membrane and seam tape','For showers and other wet areas.'],['Subfloor patch, primer or leveler','If preparation is needed.'],['Grout sealer','Only when the selected grout requires it.']]},
 floating:{label:'Click Flooring',items:[['Compatible underlayment','Only if not already attached or otherwise specified.'],['Moisture or vapor barrier','As required for the subfloor and floor product.'],['Underlayment seam tape','If the chosen system requires taped seams.'],['Expansion spacers','To maintain the product’s perimeter gap.'],['Transition strips and thresholds','At doors and changes in flooring.'],['Baseboard or shoe molding','To cover the perimeter gap.'],['Subfloor patch or leveler','If the subfloor needs preparation.']]},
 glue:{label:'Glue-Down Flooring',items:[['Manufacturer-approved flooring adhesive','Match the flooring and substrate.'],['Subfloor primer, patch or leveler','If preparation is needed.'],['Moisture mitigation system','If testing and product directions require it.'],['Transition strips and thresholds','At doors and changes in flooring.'],['Baseboard or shoe molding','As needed at the perimeter.']]},
 nail:{label:'Nail-Down Wood Flooring',items:[['Approved flooring nails or staples','Match the product and subfloor.'],['Specified underlayment or flooring paper','Follow the flooring directions.'],['Transition strips and thresholds','At doors and changes in flooring.'],['Baseboard or shoe molding','At the perimeter.'],['Subfloor patch or repair materials','If preparation is needed.']]},
 flooring:{label:'Flooring / Tile',items:[['Subfloor preparation supplies','The exact products depend on the floor and substrate.'],['Transition strips and thresholds','Where the new floor meets another surface.'],['Perimeter trim','As needed for the chosen floor.']]},
 paint:{label:'Paint',items:[['Primer','For bare, repaired or otherwise specified surfaces.'],['Patching compound or spackle','For holes and surface repairs.'],['Sandpaper or sanding screens','For preparation between coats as needed.'],['Paintable caulk','For appropriate trim gaps.'],["Painter’s tape and masking film",'To protect adjacent surfaces.'],['Drop cloths','To protect floors and furnishings.'],['Brushes, roller covers, frame and tray','Choose for the paint and surface texture.'],['Tray liners, stir sticks and cleanup rags','For application and cleanup.']]},
 lumber:{label:'Wood / Framing Lumber',items:[['Framing nails or approved structural screws','Match the framing plan.'],['Blocking and headers','For openings and specified support.'],['Shims','For alignment where needed.'],['Anchors and connectors','As specified for the wall and substrate.'],['Treated bottom plate and sill gasket','Where required at concrete contact.'],['Sheathing, weather barrier and flashing','For applicable exterior assemblies.']]},
 drywall:{label:'Drywall',items:[['Drywall screws','Length and type depend on framing and panel.'],['Joint tape','For seams and inside corners.'],['Joint compound','For tape, fasteners and finishing coats.'],['Corner bead or edge trim','For exposed corners and edges.'],['Backing or patch material','Where support or repairs are needed.'],['Sanding supplies and drywall primer','For finishing before paint.'],['Specified fire or acoustic sealant','Where the assembly requires it.']]},
 concrete:{label:'Concrete',items:[['Compactible gravel or crushed stone','For the specified base.'],['Form boards, stakes and fasteners','To shape and secure the slab.'],['Form release','If appropriate for the forms.'],['Reinforcement and supports','If specified for the slab.'],['Vapor barrier and seam tape','Where the slab assembly requires it.'],['Isolation or expansion joint material','At adjoining structures and specified joints.'],['Curing compound or curing cover','To support the chosen curing method.'],['Joint sealant','Where specified after curing.']]}
};
function estimateSupplyGroup(item){if(item.type==='flooring')return SUPPLY_GUIDE[item.floorKind]?item.floorKind:'flooring';if(SUPPLY_GUIDE[item.type])return item.type;const title=item.title||'';if(title.startsWith('Flooring / Tile'))return 'flooring';if(title.startsWith('Paint'))return 'paint';if(title.startsWith('Wood / Framing'))return 'lumber';if(title.startsWith('Drywall'))return 'drywall';if(title.startsWith('Concrete'))return 'concrete';return null}
function renderSupplyPlan(){
 const root=document.getElementById('supply-recommendations');if(!root)return;root.replaceChildren();
 const heading=document.createElement('h2');heading.textContent='Supplies for Your Project';root.append(heading);
 let estimates=[];try{const data=JSON.parse(localStorage.getItem(MATERIAL_ESTIMATES_KEY)||'[]');if(Array.isArray(data))estimates=data}catch{}
 const suggested=[...new Set([...estimates.map(estimateSupplyGroup),...getCart().map(applianceSupplyGroup)].filter(Boolean))];
 const allGroups=[...new Set([...Object.keys(SUPPLY_GUIDE),...Object.keys(APPLIANCE_SUPPLY_GUIDE)])];
 const intro=document.createElement('p');intro.className='lead';intro.textContent=suggested.length?'Review supplies related to your materials and appliances below. Choose only what your project needs.':'Calculate material quantities to see a measured supply list. You can still browse all offered supplies below.';root.append(intro);
 const planning=document.createElement('div');planning.className='panel supply-planning-step';const planText=document.createElement('div'),planTitle=document.createElement('h3'),planDescription=document.createElement('p'),planLink=document.createElement('a');planTitle.textContent=estimates.length?'Material quantities saved':'Start with your measurements';planDescription.textContent=estimates.length?'Supply estimates below use your saved material measurements. Adjust the calculator if your project changes.':'Enter room measurements first to estimate supplies such as underlayment, primer, drywall compound, and tile mortar.';planLink.className=estimates.length?'btn outline':'btn primary';planLink.href='/calculators.html';planLink.textContent=estimates.length?'Adjust Measurements →':'Calculate Material Quantities →';planText.append(planTitle,planDescription);planning.append(planText,planLink);root.append(planning);
 let checked={};try{const saved=JSON.parse(localStorage.getItem(SUPPLY_CHECKS_KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))checked=saved}catch{}
 let quantities={};try{const saved=JSON.parse(localStorage.getItem(SUPPLY_QUANTITIES_KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))quantities=saved}catch{}
 const count=document.createElement('p');count.id='supply-selected-count';count.className='supply-selection-count';root.append(count);
 const featured=document.createElement('div');featured.className='supply-guide-grid';root.append(featured);
 const other=document.createElement('details');other.className='supply-all-offered';const summary=document.createElement('summary');summary.textContent='See All Offered Supplies';other.append(summary);
 const allGrid=document.createElement('div');allGrid.className='supply-guide-grid';other.append(allGrid);
 const boxes=()=>root.querySelectorAll('.supply-choice input[type="checkbox"]');
 const updateCount=()=>{const n=[...boxes()].filter(box=>box.checked).length;count.textContent=`${n} supply ${n===1?'item':'items'} selected`};
 const saveChecks=()=>{try{localStorage.setItem(SUPPLY_CHECKS_KEY,JSON.stringify(checked))}catch{}updateCount()};
 const selectWithin=area=>{area.querySelectorAll('.supply-choice input[type="checkbox"]').forEach(box=>{box.checked=true;checked[box.dataset.key]=true});saveChecks()};
 function addGroup(group,container){const guide=SUPPLY_GUIDE[group]||APPLIANCE_SUPPLY_GUIDE[group],card=document.createElement('section'),h=document.createElement('h3'),list=document.createElement('div');card.className='panel supply-guide-card';h.textContent=guide.label;list.className='supply-guide-list';card.append(h);if(suggested.includes(group)){const badge=document.createElement('span');badge.className='supply-match';badge.textContent='From your project';card.append(badge)}card.append(list);
  for(const [name,note] of guide.items){const key=group+':'+name,row=document.createElement('div'),choice=document.createElement('label'),box=document.createElement('input'),copy=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');row.className='supply-choice';box.type='checkbox';box.checked=!!checked[key];box.dataset.key=key;box.dataset.name=name;box.setAttribute('aria-label',`Need ${name} for ${guide.label}`);box.addEventListener('change',()=>{checked[key]=box.checked;saveChecks()});strong.textContent=name;small.textContent=note;copy.append(strong,small);choice.append(box,copy);row.append(choice);const estimate=supplyStartingQuantity(group,name,estimates),qty=document.createElement('input'),qtyLabel=document.createElement('label');qty.type='number';qty.min='1';qty.max='99999';qty.step='1';qty.value=Number.isSafeInteger(quantities[key])&&quantities[key]>0?quantities[key]:(estimate?.quantity||1);qty.className='supply-qty';qty.dataset.key=key;qty.dataset.name=name;qtyLabel.className='supply-qty-label';qtyLabel.textContent=estimate?`Estimated: ${estimate.unit}. Qty: `:'Qty (adjust): ';qtyLabel.append(qty);qty.addEventListener('change',()=>{const value=Number(qty.value);qty.value=Number.isSafeInteger(value)&&value>0&&value<=99999?value:1;quantities[key]=Number(qty.value);try{localStorage.setItem(SUPPLY_QUANTITIES_KEY,JSON.stringify(quantities))}catch{}});row.append(qtyLabel);list.append(row)}
  const selectGroup=document.createElement('button');selectGroup.type='button';selectGroup.className='btn outline supply-select-group';selectGroup.textContent='Select All in This List';selectGroup.addEventListener('click',()=>selectWithin(list));card.append(selectGroup);container.append(card)}
 suggested.forEach(group=>addGroup(group,featured));
 allGroups.filter(group=>!suggested.includes(group)).forEach(group=>addGroup(group,allGrid));
 if(suggested.length){const selectSuggested=document.createElement('button');selectSuggested.type='button';selectSuggested.className='btn outline supply-select-visible';selectSuggested.textContent='Select All Suggested Supplies';selectSuggested.addEventListener('click',()=>selectWithin(featured));root.append(selectSuggested)}
 const selectAll=document.createElement('button');selectAll.type='button';selectAll.className='btn outline supply-select-visible';selectAll.textContent='Select All Offered Supplies';selectAll.addEventListener('click',()=>selectWithin(allGrid));other.append(selectAll);root.append(other);updateCount();
 const actions=document.createElement('div');actions.className='supply-actions';
 const clear=document.createElement('button');clear.type='button';clear.className='btn outline';clear.textContent='Clear Selection';clear.addEventListener('click',()=>{boxes().forEach(box=>{box.checked=false;checked[box.dataset.key]=false});saveChecks()});
 const add=document.createElement('button');add.type='button';add.className='btn primary';add.textContent='Add Selected to Project';const status=document.createElement('p');status.className='calc-note';status.setAttribute('role','status');add.addEventListener('click',()=>{const chosen=[...boxes()].filter(box=>box.checked);if(!chosen.length){status.textContent='Select at least one supply first.';return}const wanted=new Map();for(const box of chosen){const input=box.closest('.supply-choice').querySelector('.supply-qty'),quantity=Number(input.value);if(!Number.isSafeInteger(quantity)||quantity<1||quantity>99999){status.textContent='Enter a whole quantity from 1 to 99,999 for each selected supply.';input.focus();return}wanted.set(box.dataset.name,Math.max(wanted.get(box.dataset.name)||0,quantity))}const cart=getCart();let added=0;for(const [name,qty] of wanted){const existing=cart.find(item=>item.name===name);if(existing){existing.qty=Math.max(existing.qty||1,qty)}else{cart.push({name,qty,type:'Supplies'});added++}}saveCart(cart);status.textContent=added?`${added} supplies added to your Review Cart with selected quantities.`:'Review Cart quantities updated.'});
 actions.append(clear,add);root.append(actions,status);const note=document.createElement('p');note.className='calc-note';note.textContent='Your selections stay on this device. Check product compatibility and final quantities before ordering. No prices are shown.';root.append(note)
}
function cartSuggestions(cart){const names=cart.map(item=>item.name);const hasAppliance=names.some(name=>PRODUCTS.appliances.some(p=>p.name===name));const hasMaterial=names.some(name=>PRODUCTS.materials.some(p=>p.name===name));const hasFurniture=names.some(name=>PRODUCTS.furniture.some(p=>p.name===name));const hasSupply=cart.some(item=>item.type==='Supplies');const suggestions=[];
 let hasEstimate=false;try{hasEstimate=JSON.parse(localStorage.getItem(MATERIAL_ESTIMATES_KEY)||'[]').length>0}catch{}

 if(hasMaterial)suggestions.push({title:'Tools for the work',description:'See tools and safety gear for a DIY project.',url:'/tools.html',action:'Browse Tools'});
 if(hasFurniture)suggestions.push({title:'Finishing touches',description:'Browse lighting, décor and other furniture options.',url:'/furniture.html',action:'Browse Furniture'});
 return suggestions.slice(0,3)}
function serviceEstimateSummary(items){
 items=items.filter(x=>!customEstimate(x));
 const services=items.filter(x=>['Labor','Service'].includes(x.type));
 const priced=services.filter(x=>x.price!==null && x.price!==undefined && x.price!=='' && Number.isFinite(Number(x.price)) && Number(x.price)>=0);
 const subtotal=priced.reduce((sum,x)=>sum+Number(x.price)*(Number(x.qty)||1),0);
 const adjustment=priced.length&&!priced.every(x=>x.flatService||window.BATHROOM_PACKAGES.find(p=>p.id===x.packageId)?.flatService)?Math.max(0,150-subtotal):0;
 return {hasServices:services.length>0,subtotal,adjustment,total:subtotal+adjustment,pending:priced.length<services.length};
}

function installationSupplies(item){
 const labor=Array.isArray(item.labor)?item.labor:item.labor?[item.labor]:[];
 if(!labor.some(x=>x.service==='Installation')||item.paintPackage||item.stoneMaterialPackage)return [];
 return item.supplyChoices?.length?item.supplyChoices:(item.products||[]).flatMap(p=>(p.supplies||window.materialSupplyList(p.name)||[]).map(name=>({name,quantity:null,unit:'quantity to confirm'})));
}

function includedProjectCosts(supplies){
 const list=(supplies||[]).map(s=>({...s,selected:true}));
 const value=s=>s.price!==null&&s.price!==undefined&&s.price!==''?Number(s.price):s.unitPrice!==null&&s.unitPrice!==undefined&&s.unitPrice!==''&&s.quantity!==null&&s.quantity!==undefined?Number(s.unitPrice)*Number(s.quantity):NaN;
 const values=list.map(value),priced=values.filter(v=>Number.isFinite(v)&&v>=0);
 return {hiddenFromCustomer:true,supplyQuantities:list,supplyList:list.map(s=>s.name+' — '+(s.quantity==null?'quantity to confirm':s.quantity+' '+s.unit)),price:priced.reduce((a,b)=>a+b,0),pricingPending:false};
}
// Replace provisional fixture allowances when matching verified toilets are in the cart.
// This is display-only: removing a product restores the original planning allowance.
function reconcileBathroomFixtureAllowances(cart){
 const items=cart.map(entry=>({...entry}));
 const purchased={standard:0,smart:0};
 for(const item of items){
  if(item.source!=='bathroom-retail')continue;
  const toilet=item.bathroomFixtureType==='toilets'||(item.bathroomFixtureType==null&&/\btoilet\b/i.test(item.name||''));
  if(!toilet)continue;
  const label=String(item.name||'');
  const wallMounted=/wall[- ]?(?:hung|mounted)|floating toilet|concealed cistern|in[- ]wall tank/i.test(label);
  const style=wallMounted?'specialty':item.toiletStyle||(/\bsmart|intelligent|bidet toilet\b/i.test(label)?'smart':/\belongated|comfort.height|chair.height\b/i.test(label)?'elongated':'round');
  const group=style==='smart'?'smart':['round','elongated'].includes(style)?'standard':null;
  if(group)purchased[group]+=Number.isSafeInteger(Number(item.qty))&&Number(item.qty)>0?Number(item.qty):1;
 }
 for(const item of items){
  const group=item.packageId==='toilet-install'?'standard':item.packageId==='smart-toilet-install'?'smart':null;
  if(!group||purchased[group]<=0||item.source!=='project-calculator')continue;
  const costs=item.internalCosts||{},fixture=Number(costs.fixture);
  if(!Number.isFinite(fixture)||fixture<=0||!Number.isFinite(Number(item.price)))continue;
  const unit=Number(costs.labor)+Number(costs.supplies)+fixture;
  const quantity=Number.isSafeInteger(Number(item.packageQuantity))&&Number(item.packageQuantity)>0
   ?Number(item.packageQuantity):unit>0?Math.round(Number(item.price)/unit):0;
  const matched=Math.min(purchased[group],Math.max(0,quantity));
  if(!matched)continue;
  item.price=Math.max(0,Math.round((Number(item.price)-matched*fixture)*100)/100);
  item.fixtureAllowanceReplaced=matched*fixture;
  purchased[group]-=matched;
 }
 return items;
}
function projectEstimateMarkup(items){
 items=items.filter(x=>!customEstimate(x));
 if(!items.length)return '';
 if(items.every(requiresInPersonQuote))return '<p><strong>In-person quote required</strong></p><p>Schedule a visit to price your selected work.</p>';
 const services=serviceEstimateSummary(items);
 const others=items.filter(x=>!['Labor','Service'].includes(x.type));
 const known=x=>x.price!==null&&x.price!==undefined&&x.price!==''&&Number.isFinite(Number(x.price))&&Number(x.price)>=0;
 const total=services.total+others.filter(known).reduce((n,x)=>n+Number(x.price)*(Number(x.qty)||1),0);
 const pending=services.pending||others.some(x=>!known(x)||x.pricingPending);
 return `<div class="result service-estimate"><strong>${pending?'Priced portion of estimate':'Estimated project total'}: ${total.toLocaleString('en-US',{style:'currency',currency:'USD'})}</strong>${services.adjustment?`<div>Includes ${services.adjustment.toLocaleString('en-US',{style:'currency',currency:'USD'})} to meet the $150 minimum trip charge.</div>`:''}${pending?'<div>Unpriced materials or services need price confirmation before ordering.</div>':''}</div>`;
}

function serviceEstimateMarkup(items){
 const s=serviceEstimateSummary(items);if(!s.hasServices)return '';
 const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
 return `<div class="result service-estimate"><strong>Estimated service total: ${money(s.total)}</strong>${s.adjustment?`<div>Includes ${money(s.adjustment)} to meet the $150 minimum trip charge.</div>`:''}${s.pending?'<div>In-person quote required for unpriced services.</div>':''}</div>`;
}
function cartRequestMessage(cart){return `${cart.some(requiresInPersonQuote)?'I need to schedule an in-person quote. ':''}Hi Nik’s Remodeling, please review my project and send current pricing and availability for: ${cart.map(item=>`${item.name} (qty ${item.qty||1})`).join('; ')}. ${serviceEstimateSummary(cart).hasServices?'Estimated service total: $'+serviceEstimateSummary(cart).total.toFixed(2)+(serviceEstimateSummary(cart).adjustment?' (includes $'+serviceEstimateSummary(cart).adjustment.toFixed(2)+' to meet the $150 minimum trip charge)':'')+'. ':''}Please let me know about delivery and installation options.`}
function cartSuggestionMarkup(cart){const suggestions=cartSuggestions(cart);return suggestions.length?`<section class="cart-addons"><h3>Complete Your Project</h3><p>These may be useful with what you saved. Check fit and availability before adding anything.</p><div class="cart-addon-grid">${suggestions.map(item=>`<article class="panel"><h4>${item.title}</h4><p>${item.description}</p><a class="btn outline" href="${item.url}">${item.action} →</a></article>`).join('')}</div></section>`:''}
function renderCartReminder(){const cart=getCart();if(!cart.length)return;let updated=Number(localStorage.getItem('nr-cart-updated-at'));if(!updated||!Number.isFinite(updated)){localStorage.setItem('nr-cart-updated-at',String(Date.now()));return}if(Date.now()-updated<24*60*60*1000||Date.now()<Number(localStorage.getItem('nr-cart-reminder-dismissed-until')||0))return;const nav=document.querySelector('.nav');if(!nav)return;const banner=document.createElement('aside');banner.className='cart-return-reminder';banner.setAttribute('aria-label','Saved project reminder');const wrap=document.createElement('div');wrap.className='wrap';const message=document.createElement('span');message.textContent=`Your project cart is saved with ${cart.length} item ${cart.length===1?'type':'types'}. Ready to review it?`;const link=document.createElement('a');link.className='btn primary';link.href='/project-cart.html';link.textContent='Review Saved Project';const close=document.createElement('button');close.type='button';close.className='cart-reminder-close';close.setAttribute('aria-label','Dismiss saved project reminder');close.textContent='×';close.onclick=()=>{localStorage.setItem('nr-cart-reminder-dismissed-until',String(Date.now()+7*24*60*60*1000));banner.remove()};wrap.append(message,link,close);banner.append(wrap);nav.after(banner)}
const PROJECT_CATALOG={
 'bath-remodel':{title:'Bath Remodel',image:'/assets/tile-shower.jpg?v=3',intro:'Plan your bathroom update, from a tiled shower to a new vanity and finishing details.',materials:['Bathroom Vanity','Countertop Surface','Porcelain Tile','Backer Board','Waterproofing Membrane','Shower Glass','Bath Fixtures','Light Fixture','Trim Board']},
 'kitchen-remodel':{title:'Kitchen Remodel',image:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=85',intro:'Bring your kitchen together with cabinets, countertops, backsplash tile, appliances and finishing details.',materials:['Kitchen Cabinets','Countertop Surface','Backsplash Tile','Kitchen Sink','Kitchen Faucet','Kitchen Appliances','Flooring','Light Fixture','Cabinet Hardware','Trim Board']},
 tile:{title:'Tile & Stone',image:'/assets/project-stone-real.jpg?v=1',intro:'Choose the finish and substrate materials for tile or stone work.',materials:['Porcelain Tile','Stone Veneer','Backer Board','Waterproofing Membrane','Grout'],calc:'tile'},
 arches:{title:'Custom Carpentry',image:'/assets/arches-columns.jpg?v=3',intro:'Plan framing and finish materials for archways, columns, and trim.',materials:['Framing Lumber','Drywall Sheet','Trim Board','Primed Crown Molding','Decorative Column Material'],calc:'lumber'},
 stairs:{title:'Stairs & Railings',image:'/assets/stairs-card.jpg?v=2',intro:'Compare the main pieces for a stair and railing update.',materials:['Stair Treads','Risers','Handrail','Balusters','Newel Posts','Landing Tile','Trim Board']},
 murals:{title:'Custom Painting & Murals',image:'/assets/murals-card.jpg?v=4',intro:'Start with wall preparation and the finish materials for a custom painted space.',materials:['Interior Paint','Primer','Wall Patching Compound','Painter’s Tape','Mural Paint'],calc:'paint'},
 wallpaper:{title:'Wallpaper',image:'/assets/wallpaper-card.jpg?v=1',intro:'Plan the covering, surface preparation, and matching installation materials.',materials:['Wallpaper Rolls','Wallpaper Primer','Wallpaper Paste (if required)','Wall Patching Compound','Edge Trim']},
 fireplaces:{title:'Fireplaces',image:'/assets/fireplace-card.jpg?v=1',intro:'Explore surround and finish options. Confirm fire-rated assembly requirements before choosing materials.',materials:['Stone Veneer','Hearth Surface','Mantel','Suitable Backer Material','Trim Board']},
 bathrooms:{title:'Bathrooms & Showers',image:'/assets/showers-card.png?v=5',intro:'See tile, waterproofing, enclosure, and vanity options for the space.',materials:['Porcelain Tile','Backer Board','Waterproofing Membrane','Shower Glass','Bathroom Vanity','Countertop Surface'],calc:'tile'},
 concrete:{title:'Concrete & Outdoor',image:'/assets/concrete-card.png?v=5',intro:'Plan the slab, base, forms, and reinforcement for an outdoor project.',materials:['Concrete Mix or Ready-Mix','Compactible Gravel Base','Form Boards','Reinforcement','Decking'],calc:'concrete'},
 flooring:{title:'Flooring & Tile Details',image:'/assets/flooring-card.jpg?v=1',intro:'Choose a floor finish and the materials needed at the edges and below it.',materials:['Luxury Vinyl Plank','Porcelain Tile','Underlayment','Transition Strips','Baseboard or Shoe Molding'],calc:'flooring'},
 entryways:{title:'Entryways & Finishing Details',image:'/assets/entryways-card.jpg?v=1',intro:'Compare doors, thresholds, porch details, railings, and finishing trim.',materials:['Exterior Door','Threshold','Trim Board','Porch Treads','Handrail','Wall Panel']},
 accents:{title:'Accent Walls',image:'/assets/accent-walls-card.jpg?v=1',intro:'Pick a surface finish and the matching trim for a feature wall.',materials:['Interior Paint','Wall Panel','Wallpaper Rolls','Stone Veneer','Trim Board'],calc:'paint'},
 custom:{title:'Custom Projects',image:'/assets/custom-projects-card.jpg?v=1',intro:'Choose a direction for a one-of-a-kind build. Final materials depend on your design.',materials:['Porcelain Tile','Stone Veneer','Wall Panel','Trim Board','Countertop Surface']},
 lighting:{title:'Lighting & Electrical',image:'/assets/lighting-card.jpg?v=1',intro:'Explore fixture and finish options. Confirm electrical parts and installation with a qualified professional.',materials:['Light Fixture','Dimmer or Switch','Fixture Mounting Hardware','Ceiling Medallion','Trim Board']}
};
const PROJECT_SUPPLIES={
 'bath-remodel':['Compatible tile mortar / adhesive','Grout','Tile spacers','Waterproofing seam tape','Backer board screws and tape','Wet-area sealant','Vanity mounting hardware','Surface protection'],
 'kitchen-remodel':['Cabinet mounting screws','Cabinet shims','Compatible backsplash adhesive','Grout','Tile spacers','Flexible sealant','Plumbing connection supplies','Surface protection'],
 tile:['Compatible tile mortar / adhesive','Grout','Tile spacers or leveling clips','Backer board fasteners and seam tape','Waterproofing seam tape (wet areas)','Flexible sealant','Tile edge trim','Subfloor patch or leveler (if needed)'],
 arches:['Framing fasteners','Drywall screws','Joint tape and compound','Construction adhesive (if specified)','Finish nails','Paintable caulk','Primer'],
 stairs:['Tread adhesive (if specified)','Compatible stair fasteners','Handrail brackets and anchors','Shims','Wood filler','Stain or finish','Protective masking'],
 murals:['Wall primer','Patching compound','Sandpaper','Painter’s tape and masking film','Brushes and roller covers','Drop cloths','Cleanup supplies'],
 wallpaper:['Wallcovering primer','Wallpaper adhesive (if required)','Smoothing tool','Seam roller','Cutting blades','Wall patching compound','Drop cloths'],
 fireplaces:['Compatible veneer mortar or adhesive','Grout (if applicable)','Mantel anchors and fasteners','Specified fire-rated sealant','Surface protection','Caulk for non-heated trim'],
 bathrooms:['Compatible tile mortar / adhesive','Grout','Tile spacers','Waterproofing seam tape','Backer board screws and tape','Wet-area sealant','Subfloor patch or leveler'],
 concrete:['Form stakes and fasteners','Compactible gravel base','Reinforcement supports','Vapor barrier (if required)','Isolation joint material','Curing compound or cover','Joint sealant'],
 flooring:['Compatible underlayment','Moisture barrier (if required)','Flooring adhesive (glue-down only)','Flooring nails or staples (nail-down only)','Expansion spacers (click floor)','Transition strips','Subfloor patch or leveler'],
 entryways:['Exterior-rated fasteners','Door shims','Weatherstripping','Threshold sealant','Flashing tape (if required)','Construction adhesive (if specified)','Exterior caulk'],
 accents:['Wall primer','Patching compound','Painter’s tape','Paintable caulk','Panel adhesive (if specified)','Finish nails (for paneling)','Wallpaper adhesive (if wallpaper)','Drop cloths'],
 custom:['Compatible construction adhesive (if specified)','Project-specific fasteners','Primer','Caulk or sealant','Surface protection','Cleaning supplies'],
 lighting:['Fixture mounting hardware','Compatible electrical box (if needed)','Approved connectors','Switch or dimmer (if compatible)','Cover plate','Surface protection']
};
function projectQuantityUnit(projectId,name){
 const n=name.toLowerCase();
 if(/edge trim|transition|perimeter trim|baseboard|shoe molding|molding|handrail|threshold|trim board/.test(n))return 'linear ft.';
 if(projectId==='concrete'||/concrete|gravel|reinforcement|vapor barrier|curing|joint sealant/.test(n))return 'cu. yd. / sq. ft.';
 if(projectId==='murals'||projectId==='accents'||/paint|primer|patching|sandpaper|drop cloth|wallpaper|adhesive|caulk|sealant/.test(n))return /paint|primer/.test(n)?'gallons':'pieces';
 if(projectId==='tile'||projectId==='bathrooms'||projectId==='flooring'||/tile|stone|veneer|backer board|waterproofing|underlayment|wall panel/.test(n))return 'sq. ft.';
 if(projectId==='arches'||projectId==='stairs'||projectId==='entryways'||/trim|lumber|drywall|molding|board|tread|riser|handrail|baluster|newel|threshold/.test(n))return 'linear ft. / pieces';
 return 'pieces';
}
function selectAllProjectSupplies(){document.querySelectorAll('.project-supply-choice input[type="checkbox"]').forEach(box=>box.checked=true)}
function addSelectedProjectSupplies(){const rows=[...document.querySelectorAll('.project-supply-choice')].filter(row=>row.querySelector('input[type="checkbox"]').checked),status=document.getElementById('project-supply-status');if(!rows.length){status.textContent='Choose at least one item first.';return}const cart=getCart();let added=0;for(const row of rows){const name=row.dataset.name,qty=Number(row.querySelector('input[type="number"]').value);if(!Number.isSafeInteger(qty)||qty<1||qty>99999){status.textContent='Enter a whole quantity from 1 to 99,999.';return}const existing=cart.find(item=>item.name===name);if(existing)existing.qty=Math.max(existing.qty||1,qty);else{cart.push({name,qty,type:'Supplies'});added++}}saveCart(cart);status.textContent=added?`${added} items added to your Review Cart.`:'Review Cart quantities updated.'}
function renderProject(){const id=new URLSearchParams(location.search).get('project'),project=PROJECT_CATALOG[id];if(!project){location.replace('/#projects');return}document.title=`${project.title} | Nik's Remodeling`;
 if(window.renderProjectOptions){window.renderProjectOptions(id,project);return;}
 const items=[...new Set([...project.materials,...PROJECT_SUPPLIES[id]])];
 document.body.innerHTML=header()+`<main><section class="project-detail-hero"><img src="${project.image}" alt="${project.title} project" class="project-detail-photo"><div class="wrap"><a class="project-back" href="/#projects">← All Projects</a><h1>${project.title}</h1><p>${project.intro}</p></div></section><section class="section"><div class="wrap"><section class="project-related-supplies" id="project-related-supplies"><h2>Materials & Supplies for ${project.title}</h2><p class="lead">Choose what your project needs. Adjust quantities, then add the selected items to your Review Cart. Check product compatibility and availability before ordering.</p><div class="project-supply-grid">${items.map(name=>{const unit=projectQuantityUnit(id,name);return `<div class="panel project-supply-choice" data-name="${name}" data-unit="${unit}"><label><input type="checkbox"> ${name}</label><label class="project-supply-qty">Qty (${unit}) <input type="number" min="1" max="99999" step="1" value="1"></label></div>`}).join('')}</div><div class="project-supply-actions"><button class="btn outline" type="button" onclick="selectAllProjectSupplies()">Select All Items</button><button class="btn primary" type="button" onclick="addSelectedProjectSupplies()">Add Selected to Review Cart</button></div><p class="calc-note" id="project-supply-status" role="status"></p></section><div class="project-detail-actions">${project.calc?`<a href="/calculators.html?material=${project.calc}">Calculate Quantities →</a>`:''}<a href="/installation.html">Installation Options →</a><a href="/materials.html">Browse All Materials →</a></div></div></section></main>`+footer();updateCartCount()}

function escapeCartText(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function cartPriceMarkup(x){
 if(customEstimate(x)||requiresInPersonQuote(x))return 'In-person quote required';
 const known=x.price!==null&&x.price!==undefined&&x.price!==''&&Number.isFinite(Number(x.price));
 if(x.type==='Material estimate'&&!known)return 'Material price to be confirmed';
 const costs=x.internalCosts;
 const scope=x.fixtureAllowanceReplaced?'Labor + supplies · selected toilet priced separately':costs?(costs.fixture>0?'Materials + labor · supplies included':'Labor · supplies included'):['Labor','Service'].includes(x.type)?'Labor only':/material|suppl/i.test(x.type||'')?'Materials only':'Item only';
 return (known?(Number(x.price)*(Number(x.qty)||1)).toLocaleString('en-US',{style:'currency',currency:'USD'}):'Quote needed')+'<small class="cart-price-scope">'+scope+'</small>';
}
function cartSchedulingMarkup(c){
 const request=encodeURIComponent(cartRequestMessage(c));
 return `<section class="panel" id="cart-scheduling" aria-labelledby="cart-scheduling-heading" style="margin-top:20px">
 <h3 id="cart-scheduling-heading">Let's Get Your Project Scheduled!</h3>
 <p><strong>Ready to get started?</strong> Purchasing your required installation supplies helps move your project toward the <strong>next available installation date</strong>, after the project and labor estimate are confirmed and approved.</p>
 <p>Plans change? Supply payments may be refunded if your project cannot proceed, subject to our <a href="/terms.html">refund policy</a>. The listed supplies price covers standard installation needs; any additional materials require your approval. Labor is quoted separately and is not charged at checkout.</p>
 <p><strong>Not ready to purchase supplies?</strong> Request a <strong>FREE estimate confirmation</strong> with no upfront payment or obligation.</p>
 <label style="display:flex;align-items:flex-start;gap:10px;margin:16px 0"><input type="checkbox" id="cart-terms-agree" onchange="updateCartRequestButtons()" style="margin-top:4px"> <span>I have read and agree to the <a href="/terms.html" target="_blank" rel="noopener">Terms &amp; Conditions, scheduling and refund policy</a>.</span></label>
 <div class="btns">
 <button class="btn primary" type="button" data-cart-request="supplies" disabled onclick="submitCartRequest('supplies')">Arrange Supplies Purchase &amp; Scheduling</button>
 <button class="btn outline" type="button" data-cart-request="free" disabled onclick="submitCartRequest('free')">Request FREE Estimate Confirmation</button>
 </div>
 <p class="calc-note">We will confirm supply prices and payment instructions before collecting payment. No payment is taken on this page. Scheduling follows final approval and availability.</p>
 </section>`;
}
function updateCartRequestButtons(){
 const agreed=!!document.getElementById('cart-terms-agree')?.checked;
 document.querySelectorAll('[data-cart-request]').forEach(b=>b.disabled=!agreed);
}
function submitCartRequest(choice){
 if(!document.getElementById('cart-terms-agree')?.checked)return;
 const c=getCart();
 const heading=choice==='supplies'?'Supplies purchase and installation scheduling request':'Free estimate confirmation request';
 const message=heading+'\\n\\n'+cartRequestMessage(c)+'\\n\\nI agree to the Terms & Conditions and request confirmation before any payment or installation scheduling.';
 location.href='mailto:'+SITE.email+'?subject='+encodeURIComponent(heading)+'&body='+encodeURIComponent(message);
}
function cartCheckoutSummary(items){
 const paidItems=items.filter(x=>!x.hiddenFromCustomer&&!['Labor','Service'].includes(x.type)&&!x.internalCosts&&!customEstimate(x)&&!requiresInPersonQuote(x));
 const amount=paidItems.reduce((sum,x)=>{const n=Number(x.price);return sum+(Number.isFinite(n)&&n>=0?n*(Number(x.qty)||1):0)},0);
 const unpriced=paidItems.some(x=>x.price===null||x.price===undefined||x.price===''||!Number.isFinite(Number(x.price))||x.pricingPending);
 const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
 const estimatedLabor=serviceEstimateSummary(items);
 const packaged=items.filter(x=>x.internalCosts&&Number.isFinite(Number(x.internalCosts.supplies))&&Number(x.internalCosts.supplies)>=0);
 const packagedSupplies=packaged.reduce((sum,x)=>sum+Number(x.internalCosts.supplies)*(Number(x.packageQuantity)||Number(x.qty)||1),0);
 const standalone=items.filter(x=>x.hiddenFromCustomer&&Number.isFinite(Number(x.price))&&Number(x.price)>=0);
 const standaloneSupplies=standalone.reduce((sum,x)=>sum+Number(x.price)*(Number(x.qty)||1),0);
 const laborCatalogSupplies=items.filter(x=>x.source==='labor-catalog'&&x.supplyPackage&&Number.isFinite(Number(x.supplyPackage.price)));
 const laborCatalogTotal=laborCatalogSupplies.reduce((sum,x)=>sum+Number(x.supplyPackage.price)*(Number(x.qty)||1),0);
 const supplyEstimate=packagedSupplies+standaloneSupplies+laborCatalogTotal;
 const hasSupplyEstimate=packaged.length>0||standalone.length>0||laborCatalogSupplies.length>0;
 const pendingSupplies=items.some(x=>x.hiddenFromCustomer&&x.pricingPending)||items.some(x=>x.source==='supplier-retail'&&x.suppliesRequested&&!x.installationRequested)||items.some(x=>x.source==='labor-catalog'&&['Labor','Service'].includes(x.type)&&!x.supplyPackage);
 const suppliesLabel=hasSupplyEstimate?money(supplyEstimate)+(pendingSupplies?' + additional supplies to confirm':''):pendingSupplies?'Price to be confirmed':'Not applicable';
 const payableSubtotal=amount+supplyEstimate;
 return `<section class="panel cart-checkout-summary" aria-label="Order summary" style="margin:18px 0;padding:20px">
 <h3>Order Summary</h3>
 <div class="cart-item"><span>Materials &amp; merchandise subtotal</span><strong>${money(amount)}${unpriced?' + items awaiting price':''}</strong></div>
 <div class="cart-item"><span>Installation supplies</span><strong>${suppliesLabel}</strong></div>
 <div class="cart-item"><span>Delivery / shipping</span><strong>Calculated before payment</strong></div>
 <div class="cart-item"><span>Sales tax</span><strong>Calculated before payment</strong></div>
 <div class="cart-item"><span>Estimated labor (not charged today)</span><strong>${estimatedLabor.hasServices?money(estimatedLabor.total):'Not selected'}${estimatedLabor.pending?' + quote required':''}</strong></div>
 <div class="cart-item"><span><strong>Purchase subtotal (before shipping/tax)</strong></span><strong>${money(payableSubtotal)}${unpriced||pendingSupplies? " + pending prices":""}</strong></div>
 <p class="calc-note"><strong>Pay nothing unless you choose to purchase.</strong> No payment is collected on this page. Before any payment, we'll confirm the exact supplies amount, delivery fee, tax, availability and total. Your installation supplies are included at the price shown. Should your project require anything beyond the standard installation, we'll discuss the options and pricing with you before proceeding. Supplies already included in a package are not charged twice. The dropshipping supplier handles merchandise shipping; installation labor is billed separately once approved.</p>
 </section>`;
}
function cartShoppingChoices(items){
 const interested=items.filter(x=>x.source==='supplier-retail'&&(x.installationRequested||x.suppliesRequested));
 if(!interested.length)return '';
 const wantsInstall=interested.some(x=>x.installationRequested);
 const wantsSupplies=interested.some(x=>x.suppliesRequested&&!x.installationRequested);
 return `<section class="panel" style="margin:14px 0;padding:18px"><h3>Complete Your Project</h3>
 ${wantsInstall?'<p><strong>Installation requested, not yet priced.</strong> Choose the labor service to add it to your estimate. Products are not charged twice.</p>'+[...new Set(interested.filter(x=>x.installationRequested).map(x=>({appliances:'appliances',bathroom:'bathroom',cabinets:'cabinets',doors:'doors',flooring:'flooring',lighting:'electrical'})[x.department]).filter(Boolean))].map(category=>'<a class="btn primary" style="margin:4px" href="/installation.html#labor-category-'+category+'">Choose '+category+' installation</a>').join('')+'<a class="btn outline" href="/installation.html">All installation services</a>':''}
 ${wantsSupplies?'<p><strong>Matching supplies requested.</strong> We will select the appropriate supplies for your chosen products and confirm the charge before payment. Installation is not added unless you request it.</p>':''}
 </section>`;
}
function renderCart(){const c=reconcileBathroomFixtureAllowances(getCart());document.title='Review Cart | Nik\'s Remodeling';document.body.innerHTML=header()+`<main><section class="section"><div class="wrap"><h2>Review Your Cart</h2><p class="lead">Review your estimate or keep shopping.</p><p class="calc-note">Materials and labor are separate choices. When you choose installation, any needed supplies are included in the installation estimate and charged only once. Materials-only orders do not automatically include installation supplies.</p>${c.some(x=>x.fixtureAllowanceReplaced)?'<p class="calc-note">Your selected toilet price replaces the matching standard fixture allowance. Labor and required supplies stay unchanged. Delivery and tax are confirmed with your quote.</p>':''}<div class="panel"><div class="cart-list">${c.length?c.map((x,i)=>x.hiddenFromCustomer?'':`<div class="cart-item"><div><strong>${escapeCartText(x.name)}</strong><div>${escapeCartText(x.type||'Project')} item · Qty ${x.qty||1}</div></div><div class="cart-current">${cartPriceMarkup(x)}</div><button class="btn outline" onclick="removeCart(${i})">${x.source==='project-calculator'?'Remove project':'Remove'}</button></div>`).join(''):'<div class="empty">Your project cart is empty. Browse products and add items when you are ready.</div>'}</div>${c.some(x=>x.source==='bathroom-retail')?'<div class="btns"><a class="btn outline" href="/project.html?project=bathrooms'+(c.find(x=>x.source==='bathroom-retail'&&x.workKey)?.workKey?'&work='+encodeURIComponent(c.find(x=>x.source==='bathroom-retail'&&x.workKey).workKey):'')+'">Continue Bathroom Project / Add Labor</a></div>':''}${projectEstimateMarkup(c)}${c.length?`${cartShoppingChoices(c)}${cartCheckoutSummary(c)}<div class="result">Materials, supplies and estimated labor are shown for planning. Labor is not payable here; supply purchases require confirmed pricing and separate payment instructions.</div>${cartSchedulingMarkup(c)}<div class="btns"><a class="btn outline" href="tel:${SITE.phone.replaceAll('-','')}">Call Nik’s Remodeling</a><a class="btn outline" href="/">Keep Shopping</a></div>`:''}</div>${c.length?cartSuggestionMarkup(c):''}</div></section></main>`+projectFlow('cart')+footer();updateCartCount()}
function removeCart(i){const c=getCart();if(!Number.isInteger(i)||i<0||i>=c.length)return;c.splice(i,1);saveCart(c);
 // Once the user removes the last cart item, don't retain stale calculator
 // drafts that would otherwise restore deleted work into another estimate.
 if(!c.length){try{localStorage.removeItem(MATERIAL_ESTIMATES_KEY)}catch{}}
 renderCart();initNavMenus();}
const MATERIAL_DETAIL_PAGES={"flooring":{"title":"Flooring","items":["Linoleum","Luxury Vinyl Plank (LVP)","Hardwood","Laminate","Carpet","Floor Tile","Underlayment","Baseboards","Quarter Round"]},"tile-stone":{"title":"Tile & Stone","items":["Ceramic Tile","Porcelain Tile","Natural Stone","Mosaic Tile","Backsplash Tile","Stone Veneer","Grout & Setting Materials"]},"drywall":{"title":"Drywall","items":["Drywall Panels","Moisture Resistant Board","Joint Compound","Tape & Corner Bead","Texture","Repair Materials"]},"lumber":{"title":"Lumber","items":["Framing Lumber","Plywood","OSB & Sheathing","Pressure Treated Lumber","Specialty Wood","Decking Boards"]},"trim-molding":{"title":"Trim & Molding","items":["Baseboards","Crown Molding","Door & Window Casing","Wainscoting","Decorative Trim","Stair Trim","Quarter Round"]},"paint-finishes":{"title":"Paint & Finishes","items":["Interior Paint","Exterior Paint","Primer","Stains","Sealers","Specialty Coatings","Painting Prep","Wallpaper","Limewash","Venetian Plaster","Textured Plaster","Metallic Finish"]},"insulation":{"title":"Insulation","items":["Batt Insulation","Blown Insulation","Rigid Foam","Spray Foam","Sound Control","Vapor Barriers"]},"roofing":{"title":"Roofing","items":["Asphalt Shingles","Metal Roofing","Underlayment","Flashing","Roof Ventilation","Gutters"]},"siding-exterior":{"title":"Siding & Exterior","items":["Vinyl Siding","Fiber Cement","Wood Siding","Exterior Trim","House Wrap","Soffit & Fascia"]},"doors-windows":{"title":"Doors & Windows","items":["Interior Doors","Exterior Doors","Windows","Patio Doors","Frames & Thresholds","Weatherstripping"]},"concrete-masonry":{"title":"Concrete & Masonry","items":["Concrete Mix","Block & Brick","Mortar","Pavers","Stone","Repair & Resurfacing"]}};
const FLOORING_PRODUCT_TYPES=new Set(['Laminate','LVP','Luxury Vinyl Plank (LVP)','Hardwood','Floor Tile','Underlayment']);
function renderFlooringSamples(type){
 document.title=type+" | Nik's Remodeling";
 document.body.innerHTML=header()+'<main class="wrap section"><a href="/material-flooring.html">← Flooring</a><h1>'+escapeCartText(type)+'</h1><div class="products store-card-grid"><p class="empty">Checking available products…</p></div></main>'+footer();
 updateCartCount();loadRealCatalog('materials','flooring',type);
}
function loadRealCatalog(department,material,type){
 const target=document.querySelector('.products');if(!target)return;
 if(!target.children.length)target.innerHTML='<p class="empty">Checking available products…</p>';
 import('/real-products.js?v='+encodeURIComponent(retailAssetVersion)).then(m=>m.mountCatalog(target,{department,material,type})).catch(()=>{target.innerHTML='<p class="empty">Product listings are temporarily unavailable. Please try again later.</p>';});
}

function renderMaterialDetail(){
 const slug=document.body.dataset.material,category=MATERIAL_DETAIL_PAGES[slug];if(slug==='flooring'&&new URLSearchParams(location.search).has('type')){renderFlooringSamples(new URLSearchParams(location.search).get('type'));return}
 if(!category){location.replace('/materials.html');return}
 document.title=category.title+" Materials | Nik's Remodeling";
 const photos={"flooring":["photo-1669476441555-3d8d8200e5fe","photo-1696451967084-c222dbc9853d","photo-1737098137073-45954f30e290","photo-1669476441555-3d8d8200e5fe","photo-1677928709896-696774cefc02","photo-1538619527368-10a650e3ba88","photo-1696451967084-c222dbc9853d"],"tile-stone":["photo-1538619527368-10a650e3ba88"],"drywall":["photo-1581578731548-c64695cc6952"],"lumber":["photo-1669476441555-3d8d8200e5fe"],"trim-molding":["photo-1737098137073-45954f30e290"],"paint-finishes":["photo-1645818000365-bb4ab9693173"],"insulation":["photo-1581578731548-c64695cc6952"],"roofing":["photo-1503387762-592deb58ef4e"],"siding-exterior":["photo-1503387762-592deb58ef4e"],"doors-windows":["photo-1600566753086-00f18fb6b3ea"],"concrete-masonry":["photo-1581578731548-c64695cc6952"]};
 const calcKind={'flooring':'flooring','tile-stone':'tile','drywall':'drywall','lumber':'lumber','paint-finishes':'paint','concrete-masonry':'concrete','trim-molding':'trim','insulation':'insulation','roofing':'roofing','siding-exterior':'siding-exterior','doors-windows':'doors-windows'}[slug];const materialChoices=({
  'paint-finishes':category.items,
  'tile-stone':[...category.items,'Wall Tile','Decorative Stone Slabs','Stacked Stone Veneer'],
  'siding-exterior':[...category.items,'Exterior-Grade Shiplap'],
  'trim-molding':[...category.items,'Interior Shiplap'],
  'lumber':[...category.items,'Shiplap Boards']
 }[slug]||category.items).filter(item=>item!=='Other material');
 const materialChoicePhotos={
  'paint-finishes':['/assets/approved-0af816f48fb0.jpg','/assets/approved-a11ab0fcd37f.jpg','/assets/approved-e9fee5a04016.jpg','/assets/murals-card.jpg','/assets/approved-9753e3ad86f9.jpg','/assets/accent-walls-card.jpg','/assets/approved-739d17fd2952.jpg','/assets/wallpaper-card.jpg','/assets/approved-4cc0340eb1c1.jpg','/assets/approved-8d4db6742d08.jpg','/assets/approved-17df84119d39.jpg','/assets/approved-de82473d9ce3.jpg'],
  'tile-stone':['/assets/approved-0ab244a922c8.jpg','/assets/tile-shower.jpg','/assets/project-stone-real.jpg','/assets/approved-739d17fd2952.jpg','/assets/showers-card.png','/assets/fireplace-card.jpg','/assets/approved-b5c632fcfbc0.jpg','/assets/approved-9bfcb89f7800.jpg','/assets/approved-4cc0340eb1c1.jpg','/assets/approved-de82473d9ce3.jpg'],
  'flooring':['/assets/flooring-card.jpg','/assets/approved-de82473d9ce3.jpg','/assets/approved-9bfcb89f7800.jpg','/assets/approved-807c60a6001a.jpg','/assets/approved-0ab244a922c8.jpg','/assets/approved-a908c20ce632.jpg','/assets/approved-b5c632fcfbc0.jpg'],
  'drywall':['/assets/catalog-8.jpg','/assets/approved-0af816f48fb0.jpg','/assets/approved-b5c632fcfbc0.jpg','/assets/approved-e9fee5a04016.jpg','/assets/approved-4cc0340eb1c1.jpg','/assets/approved-739d17fd2952.jpg'],
  'lumber':['/assets/arches-columns.jpg','/assets/approved-4de99f88049f.jpg','/assets/approved-94fe00a25a93.jpg','/assets/custom-projects-card.jpg','/assets/approved-e9fee5a04016.jpg','/assets/stairs-card.jpg','/assets/approved-a11ab0fcd37f.jpg'],
  'trim-molding':['/assets/approved-e9fee5a04016.jpg','/assets/arches-columns.jpg','/assets/entryways-card.jpg','/assets/approved-739d17fd2952.jpg','/assets/approved-4de99f88049f.jpg','/assets/stairs-card.jpg','/assets/approved-94fe00a25a93.jpg'],
  'insulation':['/assets/project-attic.jpg','/assets/project-basement.jpg','/assets/approved-b5c632fcfbc0.jpg','/assets/catalog-8.jpg','/assets/approved-17df84119d39.jpg','/assets/approved-4cc0340eb1c1.jpg'],
  'roofing':['/assets/approved-a11ab0fcd37f.jpg','/assets/entryways-card.jpg','/assets/idea-backyard-retreat.jpg','/assets/project-attic.jpg','/assets/approved-4de99f88049f.jpg','/assets/idea-outdoor-kitchen.jpg'],
  'siding-exterior':['/assets/entryways-card.jpg','/assets/approved-a11ab0fcd37f.jpg','/assets/approved-4de99f88049f.jpg','/assets/idea-backyard-retreat.jpg','/assets/arches-columns.jpg','/assets/idea-outdoor-kitchen.jpg','/assets/approved-e9fee5a04016.jpg'],
  'doors-windows':['/assets/entryways-card.jpg','/assets/approved-4de99f88049f.jpg','/assets/arches-columns.jpg','/assets/approved-e9fee5a04016.jpg','/assets/approved-739d17fd2952.jpg','/assets/approved-a11ab0fcd37f.jpg'],
  'concrete-masonry':['/assets/patio-concrete.webp','/assets/concrete-card.jpg','/assets/idea-backyard-retreat.jpg','/assets/approved-0ab244a922c8.jpg','/assets/project-stone-real.jpg','/assets/approved-b5c632fcfbc0.jpg']
 };
 const MATERIAL_ITEM_PICTURES={"paint-finishes":{"Interior Paint":"https://images.unsplash.com/photo-1599619585752-c3edb42a414c?auto=format&fit=crop&w=900&q=82","Exterior Paint":"/assets/entryways-card.jpg","Primer":"/assets/approved-0af816f48fb0.jpg","Wallpaper":"/assets/wallpaper-card.jpg","Limewash":"https://images.unsplash.com/photo-1674816926928-efeddf11e559?auto=format&fit=crop&w=900&q=82","Venetian Plaster":"https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=900&q=82","Textured Plaster":"https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=900&q=82","Metallic Finish":"/assets/approved-8d4db6742d08.jpg","Stains":"/assets/approved-a11ab0fcd37f.jpg"},"flooring":{"Baseboards":"/assets/approved-e9fee5a04016.jpg","Quarter Round":"/assets/approved-739d17fd2952.jpg","Hardwood":"https://images.unsplash.com/photo-1764726331220-b323be2b57b5?auto=format&fit=crop&w=900&q=82","Floor Tile":"/assets/tile-shower.jpg","Underlayment":"/assets/approved-b5c632fcfbc0.jpg"},"tile-stone":{"Stone Veneer":"https://images.unsplash.com/photo-1771607501057-6db4da07d98f?auto=format&fit=crop&w=900&q=82","Backsplash Tile":"/assets/kitchen.jpg","Wall Tile":"/assets/approved-4cc0340eb1c1.jpg","Decorative Stone Slabs":"/assets/fireplace-card.jpg","Stacked Stone Veneer":"https://images.unsplash.com/photo-1784528780206-6a0545dec6fd?auto=format&fit=crop&w=900&q=82"},"drywall":{"Drywall Panels":"https://images.unsplash.com/photo-1768321917995-2d992c50854b?auto=format&fit=crop&w=900&q=82","Moisture Resistant Board":"/assets/showers-card.png","Texture":"/assets/accent-walls-card.jpg","Repair Materials":"/assets/project-basement.jpg"},"roofing":{"Asphalt Shingles":"https://images.unsplash.com/photo-1655373617557-7138d45582d4?auto=format&fit=crop&w=900&q=82","Metal Roofing":"/assets/approved-a11ab0fcd37f.jpg","Roof Ventilation":"https://images.unsplash.com/photo-1577075473856-c12a2eb249b7?auto=format&fit=crop&w=900&q=82","Gutters":"/assets/entryways-card.jpg"},"insulation":{"Batt Insulation":"/assets/project-attic.jpg","Blown Insulation":"/assets/approved-17df84119d39.jpg","Sound Control":"/assets/project-basement.jpg"},"lumber":{"Framing Lumber":"/assets/arches-columns.jpg","Pressure Treated Lumber":"/assets/idea-backyard-retreat.jpg","Decking Boards":"https://images.unsplash.com/photo-1775204450568-1245d7334689?auto=format&fit=crop&w=900&q=82"},"siding-exterior":{"Exterior-Grade Shiplap":"https://images.unsplash.com/photo-1591411844637-3ea008cd96de?auto=format&fit=crop&w=900&q=82","Vinyl Siding":"https://images.unsplash.com/photo-1775695161075-f286033564df?auto=format&fit=crop&w=900&q=82"},"trim-molding":{"Interior Shiplap":"/assets/accent-walls-card.jpg"}};
 const cardImages=materialChoicePhotos[slug]||['/assets/approved-a908c20ce632.jpg','/assets/kitchen.jpg','/assets/entryways-card.jpg','/assets/approved-4de99f88049f.jpg','/assets/approved-b5c632fcfbc0.jpg','/assets/approved-739d17fd2952.jpg','/assets/approved-0af816f48fb0.jpg','/assets/approved-9bfcb89f7800.jpg'];
 const cards=materialChoices.map((item,i)=>{const itemKind=/tile/i.test(item)?'tile':slug==='paint-finishes'&&!['Interior Paint','Exterior Paint','Primer','Stains','Sealers','Specialty Coatings','Painting Prep'].includes(item)?'custom':calcKind;const name=category.title+' — '+item;const photo=(photos[slug][i]||photos[slug][0]);const img=MATERIAL_ITEM_PICTURES[slug]?.[item]||cardImages[i%cardImages.length];if(slug==='flooring'&&FLOORING_PRODUCT_TYPES.has(item))return '<article class="card material-option-card flooring-choice-card"><div class="pic"><img src="'+img+'" alt="Illustrative photo for '+item+'" loading="lazy"></div><div class="body"><h3>'+item+'</h3><a class="btn primary" href="/material-flooring.html?type='+encodeURIComponent(item)+'">Choose '+item+'</a></div></article>';return '<article class="card material-option-card" data-calc-kind="'+(itemKind||'')+'"><div class="pic"><img src="'+img+'" alt="Illustrative photo for '+item+'" loading="lazy"></div><div class="body"><h3>'+item+'</h3><p>Explore current '+item.toLowerCase()+' options for your project.</p><div class="card-actions"><a class="btn primary" href="/calculators.html?product='+encodeURIComponent(name)+(itemKind?'&material='+itemKind:'')+'">Plan Quantities</a><a class="add-project" href="/calculators.html?product='+encodeURIComponent(name)+(itemKind?'&material='+itemKind:'')+'">Plan Installation</a></div>'+servicePicker(name,['Installation','Removal','Prep'])+'</div></article>'}).join('');
 document.body.innerHTML=header()+'<main><section class="category-hero" style="--hero-image:url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85)"><div class="wrap"><div class="eyebrow">Materials</div><h1>'+category.title+'</h1><p>Find the right materials for your project. Product choices and pricing are confirmed from current suppliers.</p><a class="btn light" href="/materials.html">← All Materials</a></div></section><section class="section"><div class="wrap"><h2>Shop '+category.title+'</h2><p class="lead">Choose a type below. Specific products will appear here as supplier listings are approved.</p><div class="material-detail-grid">'+cards+'</div><h2>Available Products</h2><div class="products store-card-grid"><p class="empty">Checking available products…</p></div><div class="material-detail-help"><h3>Need a specific product?</h3><p>Tell us the material, size, color and quantity you need. We can check current options.</p><a class="btn primary" href="sms:4709912133">Text Your Material List →</a></div></div></section></main>'+footer();
 updateCartCount();bindServicePickers();loadRealCatalog('materials',slug);
}
function initNavMenus(){
 const cabinetMenu=document.querySelector('.nav-main[href="/cabinets.html"]')?.closest('.nav-menu')?.querySelector('.nav-dropdown');
 if(cabinetMenu&&!cabinetMenu.dataset.workOptions){cabinetMenu.dataset.workOptions='1';const heading=document.createElement('span');heading.className='nav-group-label';heading.textContent='Cabinet Work';cabinetMenu.append(heading);CABINET_WORK_OPTIONS.forEach(option=>{const link=document.createElement('a');link.textContent=option.label;link.href='/calculators.html?material=refinish&cabinetOptions='+option.key;cabinetMenu.append(link)});}
document.querySelectorAll('.nav-toggle').forEach(button=>button.addEventListener('click',()=>{const menu=button.closest('.nav-menu'),open=!menu.classList.contains('open');document.querySelectorAll('.nav-menu.open').forEach(other=>{other.classList.remove('open');other.querySelector('.nav-toggle').setAttribute('aria-expanded','false')});menu.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open))}));document.addEventListener('click',event=>{if(event.target.closest('.nav-menu'))return;document.querySelectorAll('.nav-menu.open').forEach(menu=>{menu.classList.remove('open');menu.querySelector('.nav-toggle').setAttribute('aria-expanded','false')})});document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.nav-menu.open').forEach(menu=>{menu.classList.remove('open');menu.querySelector('.nav-toggle').setAttribute('aria-expanded','false')})})}
document.addEventListener('DOMContentLoaded',()=>{const page=document.body.dataset.page;if(PAGES[page])renderCategory(page);else if(page==='calculators')renderCalculators();else if(page==='cart')renderCart();else if(page==='project')renderProject();else if(page==='material-detail')renderMaterialDetail();else updateCartCount();renderCartReminder();initNavMenus();
 if(['materials','material-detail','calculators','material-prices'].includes(page)){
  const script=document.createElement('script');
  script.src='/material-prices.js?v='+encodeURIComponent(retailAssetVersion);
  script.defer=true;
  document.body.append(script);
 }
});
// Keep category lists and menus in the same order without separating photos from cards.
function choicePosition(text){
 const label=String(text).trim();
 if(/^(select (one|an?\b)|choose (one|an?\b|material\b)|all\b)/i.test(label))return -1;
 if(/^(other\b|not sure\b|unsure\b|something else\b|none of (these|the above)\b)/i.test(label))return 1;
 return 0;
}
function alphabetizeSiteLists() {
 const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
 const label=el=>{const copy=(el.querySelector('h2,h3,h4,summary')||el.querySelector('span')||el).cloneNode(true);copy.querySelectorAll('small,input,button').forEach(x=>x.remove());return copy.textContent.trim()};
 const reorder=(parent,items,key=label,alphabetical=true)=>{
  const sorted=items.slice().sort((a,b)=>choicePosition(key(a))-choicePosition(key(b))||(alphabetical?collator.compare(key(a),key(b)):0));
  if(items.every((item,i)=>item===sorted[i]))return;
  const slots=items.map(item=>{const marker=document.createComment('sort');item.before(marker);return marker});
  sorted.forEach((item,i)=>slots[i].replaceWith(item));
 };
 document.querySelectorAll('.path-grid').forEach(parent=>reorder(parent,[...parent.querySelectorAll(':scope > .path-card')],card=>card.querySelector('.path-number').textContent.trim()));
 // Keep the primary navigation in its intended workflow order (not alphabetical).
 document.querySelectorAll('.nav-dropdown').forEach(menu=>{
  let group=[];const flush=()=>{reorder(menu,group);group=[]};
  [...menu.children].forEach(el=>{if(el.matches('a'))group.push(el);else flush()});flush();
 });
 document.querySelectorAll('.project-grid,.product-tile-grid,.shop-guide-grid,.category-tabs,.material-detail-grid,.products,.project-supply-grid,.labor-choices,.delivery-choices,.service-dropdown-options,.room-supply-list,.supply-grid,#recommended-tools ul').forEach(parent=>{
  if(parent.closest('.calc-workspace'))return;
  reorder(parent,[...parent.children].filter(el=>el.matches('a,article,label,button,li,.panel')));
 });
 document.querySelectorAll('#material-product-list,.paint-surfaces').forEach(parent=>{
  const items=[...parent.children].filter(el=>el.matches('.area-product,label'));
  reorder(parent,items,el=>el.querySelector('input[type="checkbox"]')?.value||label(el),false);
 });
 document.querySelectorAll('select').forEach(select=>{
  const sequential=!!select.closest('.calc-workspace')&&select.id!=='material-type';
  const value=select.value;
  reorder(select,[...select.children].filter(el=>el.tagName==='OPTION' && el.value!==''),el=>el.textContent.trim(),!sequential);
  select.value=value;
 });
}
document.addEventListener('DOMContentLoaded',()=>{
 alphabetizeSiteLists();
 let pending=false;
 const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;observer.disconnect();alphabetizeSiteLists();observer.observe(document.body,{childList:true,subtree:true});});});
 observer.observe(document.body,{childList:true,subtree:true});
});

function readAreaProducts(){
 if(!document.querySelector('[name="project-option"][value="Materials"]:checked'))return [];
 const rows=[...document.querySelectorAll('.area-product')].filter(row=>row.querySelector('[name="area-product"]').checked);
 if(!rows.length)throw Error('Select the materials needed for this area.');
 return rows.map(row=>{
  let name=row.querySelector('[name="area-product"]').value;
  if(name==='Other material'){name=document.getElementById('material-description').value.trim();if(!name)throw Error('Enter the other material name in Material details.');}
  const result={name,mode:row.dataset.measure};
  row.querySelectorAll('[data-product-setting]').forEach(input=>{
   const key=input.dataset.productSetting;
   if(key==='unit'){result.unit=input.value;return;}
   if(key==='coverage'&&result.mode==='area'&&input.value.trim()===''){result.coverage=null;return;}
   const value=Number(input.value);
   if(!input.value.trim()||!Number.isFinite(value)||(key==='waste'?value<0:value<=0)||(key==='coats'&&!Number.isInteger(value)))throw Error('Enter valid '+key+' for '+name+'.');
   result[key]=value;
  });
  if(result.mode==='manual'&&['Pieces','Bags','Boxes','Rolls','Sheets'].includes(result.unit)&&!Number.isSafeInteger(result.quantity))throw Error('Enter a whole number for '+name+'.');
  return result;
 });
}
function calculateAreaProducts(item,plans){
 return plans.map(plan=>{
  const area=item.measurements.area;
  if(plan.mode==='volume')return {name:plan.name,quantity:item.purchase.quantity,unit:'cubic yards',area,detail:item.detail};
  if(plan.mode==='studs')return {name:plan.name,quantity:item.measurements.studs,unit:'studs',detail:item.detail};
  if(plan.mode==='paint'){
   const surfaces=item.measurements.surfaces||[{area}];
   const quantity=surfaces.reduce((sum,surface)=>sum+Math.ceil(surface.area*plan.coats/plan.coverage),0);
   return {name:plan.name,quantity,unit:'gallons',area,coats:plan.coats,coverage:plan.coverage,detail:plan.name+': '+area.toFixed(1)+' sq. ft., '+plan.coats+' coat(s), '+plan.coverage+' sq. ft./gallon; rounded separately for each surface.'};
  }
  if(plan.mode==='area'){
   const needed=area*(1+plan.waste/100),quantity=plan.coverage?Math.ceil(needed/plan.coverage-1e-9):Math.ceil(needed-1e-9);
   return {name:plan.name,quantity,unit:plan.coverage?'packages':'sq. ft.',area,waste:plan.waste,coverage:plan.coverage,detail:plan.name+': '+area.toFixed(1)+' sq. ft. work area + '+plan.waste+'% waste'+(plan.coverage?', '+plan.coverage+' sq. ft./package':'')+'.'};
  }
  return {name:plan.name,quantity:plan.quantity,unit:plan.unit,detail:plan.name+': quantity entered.'};
 });
}

function cabinetRemovalRate(qty){return qty>=10?50:qty>=6?55:qty>=3?65:75;}
function cabinetRefinishingEstimate(){
 const count=id=>{const n=materialNumber('cabinet-'+id);if(id==='door-adjust-qty'){if(!Number.isFinite(n)||n<0||Math.round(n*4)!==n*4)throw Error('Enter adjustment hours in quarter-hour increments.');return n;}if(!Number.isSafeInteger(n))throw Error('Enter whole counts for cabinet parts.');return n;};
 const doors=count('doors'),drawers=count('drawers'),measurements={doors,drawers};
 const labor=[];
 const add=(service,quantity,unit)=>{const approved={'Adjust cabinet door':75,'Stain cabinet door interior':150,'Stain cabinet door exterior':150,'Stain cabinet box':150,'Paint or stain cabinet inside and out':225,'Install cabinet and paint outside':275,'Install cabinet and paint inside and out':325,'Install cabinet box':150,'Remove cabinet box and haul off':cabinetRemovalRate(quantity),'Paint cabinet door and matching box':150,'Paint cabinet interiors':225,'Install cabinet hardware':15,'Fill cabinet hardware hole and touch up paint if possible':15,'Install cabinet crown molding':4,'Install cabinet toe-kick':1.25,'Install cabinet filler strip':15,'Install cabinet end panel':75};const unitPrice=approved[service]??null;if(quantity)labor.push({service,scope:'Cabinet / Vanity Work',quantity,unit,...(unitPrice!==null?{price:unitPrice*quantity,unitPrice}: {})});};
 add('Refinish doors — frames included',doors,'doors');add('Refinish drawer fronts — frames included',drawers,'drawer fronts');
 CABINET_WORK_OPTIONS.filter(option=>option.fields.length).forEach(option=>{
  if(!document.getElementById('cabinet-'+option.key).checked)return;
  let total=0;option.fields.forEach(([id,label,service,unit])=>{const quantity=count(id);measurements[id]=quantity;total+=quantity;add(service,quantity,unit)});
  if(!total)throw Error('Enter the quantity for '+option.label.toLowerCase()+'.');
 });
 const products=[...document.querySelectorAll('[name="area-product"]:checked')].map(box=>{
  const name=box.value==='Other material'?document.getElementById('material-description').value.trim():box.value;
  if(!name)throw Error('Enter the other material name.');const quantity=measurements[name==='Hardware'?'hardware-count':name.toLowerCase()]||null;return {name,quantity,unit:quantity?'pieces':'',detail:'Quantity to confirm from cabinet sizes.'};
 });
 if(!labor.length&&!products.length)throw Error('Enter doors or drawer fronts, select cabinet work, or choose materials.');
 return {type:'custom',title:'Cabinet / Vanity Work',result:labor.length?labor.map(x=>x.quantity+' '+x.unit).join(' · '):'Cabinet materials requested',detail:'Labor per cabinet: install $150; paint or stain outside $150 or inside and out $225; install and paint outside $275 or inside and out $325. Doors and drawer fronts included. Removal and haul-off: 1–2 $75 each, 3–5 $65, 6–9 $55, 10+ $50. Hardware $15 per knob, pull or hinge; hole preparation $15 per door or drawer. Materials extra; $150 minimum trip charge.',measurements,labor,products,projectOptions:products.length?['Materials']:[],deliveryTypes:[]};
}


// Shared by shopping and the project calculator; choices appear only for selected items.
function itemOptionFields(name){
 const rules=[
 [/laminate/i,[['Installation','Floating'],['Water resistance','Standard','Water resistant'],['Padding','Attached pad','Separate underlayment']]],
 [/luxury vinyl|\blvp\b|vinyl plank/i,[['Installation','Floating','Glue down'],['Padding','Attached pad','Separate underlayment']]],
 [/linoleum|sheet vinyl/i,[['Material','Sheet vinyl','Linoleum'],['Installation','Glue down','Loose lay']]],
 [/carpet/i,[['Style','Carpet roll','Carpet tiles'],['Installation','Stretch in with pad','Glue down']]],
 [/shower.*(valve|faucet|head)|mixing valve/i,[['Valve type','Pressure balance','Thermostatic','Help identify existing valve'],['Work needed','New installation','Replace existing valve / trim'],['Finish','Chrome','Brushed nickel','Matte black','Bronze']]],
 [/exhaust fan/i,[['Fan type','Fan only','Fan with light','Fan with heater'],['Venting','Existing outdoor duct','New duct needed','Not sure'],['Room size','Small bathroom','Large bathroom','Other room']]],
 [/washer|washing machine/i,[['Style','Top load','Front load','Stackable'],['Connections','Existing connections','New connections needed']]],
 [/range hood/i,[['Venting','Ducted outdoors','Recirculating','Not sure'],['Mounting','Under cabinet','Wall mount','Island']]],
 [/stone veneer|stacked stone|thin brick|faux stone/i,[['Format','Individual pieces','Panels','Sheets'],['Location','Interior wall','Fireplace surround','Exterior wall'],['Surface condition','Ready for installation','Prep / repairs needed','Not sure']]],
 [/shiplap|tongue.*groove|reclaimed wood|wood slat|fluted wood|board.*batten|beadboard|wainscoting|geometric wood/i,[['Material','Solid wood','MDF','PVC / composite'],['Finish','Painted','Stained','Unfinished'],['Layout','Horizontal','Vertical','Patterned']]],
 [/acoustic/i,[['Style','Fabric panels','Wood slat panels','Acoustic foam'],['Mounting','Walls','Ceiling','Both']]],
 [/vent duct|vent cap/i,[['Duct size','4 inch','6 inch','Other size'],['Work needed','New installation','Replace existing']]],
 
 [/tile|mosaic|stone|slab/i,[['Material','Ceramic','Porcelain','Natural stone','Manufactured stone'],['Format','Individual tiles','Mosaic sheets','Large format','Slab / panel'],['Location','Floor','Wall','Backsplash','Shower / wet area','Exterior']]],
 [/hardwood/i,[['Construction','Solid hardwood','Engineered hardwood'],['Installation','Nail / staple','Glue down','Floating']]],
 [/vinyl|\blvp\b|linoleum|laminate|carpet|flooring/i,[['Flooring type','Luxury vinyl plank (LVP)','Laminate','Hardwood','Tile','Sheet vinyl / linoleum','Carpet'],['Installation','Floating','Glue down','Nail / staple']]],
 [/vanity light/i,[['Fixture style','Light bar','Wall sconce','Multi-light fixture'],['Finish','Chrome','Brushed nickel','Matte black','Bronze','Other']]],
 [/wall sconce/i,[['Mounting','Existing wall box','New location'],['Finish','Chrome','Brushed nickel','Matte black','Bronze','Other']]],
 [/pendant light/i,[['Mounting','Existing ceiling box','New location'],['Drop length','Short','Medium','Long','Help me choose']]],
 [/recessed light/i,[['Opening','Existing recessed fixture','New cutout'],['Trim size','4 inch','6 inch','Other / not sure']]],
 [/track light/i,[['Mounting','Existing ceiling box','New location'],['Track length','2 feet','4 feet','6 feet','Other / not sure']]],
 [/ceiling light/i,[['Mounting','Existing ceiling box','New location'],['Fixture style','Flush mount','Semi-flush mount','Chandelier','Help me choose']]],
 [/vanity/i,[['Size','Single sink','Double sink'],['Mounting','Freestanding','Wall mounted'],['Top','With top and sink','Cabinet only']]],
 [/faucet|mixing valve/i,[['Mounting','Single hole','Centerset','Widespread','Wall mounted'],['Finish','Chrome','Brushed nickel','Matte black','Bronze']]],
 [/sink/i,[['Sink type','Single bowl','Double bowl','Vessel'],['Mounting','Drop in','Undermount','Wall mounted']]],
 [/bathtub|tub replace|tub surround/i,[['Tub style','Alcove','Freestanding','Drop in'],['Material','Acrylic / fiberglass','Steel','Cast iron']]],
 [/shower (base|glass|surround)/i,[['Style','Prefabricated','Custom sized'],['Size','Standard opening','Custom opening']]],
 [/cabinet/i,[['Construction','Ready to assemble','Assembled stock','Custom'],['Finish','Painted','Stained','Unfinished']]],
 [/countertop/i,[['Surface','Laminate','Butcher block','Quartz','Granite','Solid surface']]],
 [/range|stove|cooktop|dryer/i,[['Power','Electric','Gas'],['Fit','Freestanding','Built in / slide in']]],
 [/refrigerator/i,[['Style','Top freezer','Bottom freezer','Side by side','French door'],['Depth','Standard depth','Counter depth'],['Water connection','Needed','Already connected','No water / ice dispenser']]],
 [/dishwasher/i,[['Width','18 inch','24 inch'],['Power connection','Plug in','Hardwired']]],
 [/microwave/i,[['Placement','Countertop','Over range','Built in']]],
 [/\b(?:doors?|doorways?)\b/i,[['Door type','Interior','Exterior','Sliding','French / double'],['Package','Slab only','Prehung'],['Material','Wood','Steel','Fiberglass','Composite']]],
 [/window/i,[['Style','Single hung','Double hung','Sliding','Casement','Fixed'],['Frame','Vinyl','Wood','Aluminum','Fiberglass']]],
 [/paint|stain|finish|sealer/i,[['Finish','Flat / matte','Eggshell','Satin','Semi gloss','Gloss'],['Color change','Same / similar color','New color','Multiple colors']]],
 [/wallpaper/i,[['Type','Peel and stick','Pasted','Unpasted'],['Pattern','Solid / texture','Repeating pattern','Mural']]],
 [/light|fan/i,[['Mounting','Existing fixture location','New location'],['Style','Flush mount','Pendant / hanging','Recessed','Wall mounted']]],
 [/\b(?:sofas?|sectionals?|chairs?|beds?|tables?|desks?|dressers?|furniture)\b/i,[['Size','Small','Standard','Large / oversized'],['Assembly','Assembly needed','Already assembled']]],
 [/drill|saw|sander|tool/i,[['Power','Cordless','Corded','Manual'],['Package','Tool only','Kit with accessories']]],
 [/trim|molding|baseboard|casing/i,[['Material','Wood','MDF','PVC'],['Finish','Painted','Stained','Unfinished']]],
 [/drywall/i,[['Panel type','Standard','Moisture resistant','Fire rated'],['Thickness','1/2 inch','5/8 inch']]],
 [/lumber|plywood/i,[['Use','Interior','Exterior / treated'],['Grade','Standard construction','Appearance / finish grade']]]
 ];
 if(/\b(?:garden|flower|planting|raised)\s+beds?\b/i.test(name))return [];
 if(/toilet tank parts|wax ring|toilet flange/i.test(name))return [];
 if(/repair|resurface|tank parts|supply line|seat|underlayment|backer|adhesive|grout|primer|membrane|removal|haul off/i.test(name))return [];
 return (rules.find(([pattern])=>pattern.test(name))?.[1]||[]).map(([label,...values])=>({label,values:[...values,'Help me choose']}));
}
function itemOptionSummary(options){return Object.entries(options||{}).map(([label,value])=>label+': '+value).join('; ');}

// Match customer-facing names and choices, never the internal generic "custom" material type.
function isCustomLabel(value){return /\bcustom\b/i.test(String(value||''));}
function customUrl(url){const p=new URL(url,location.origin).searchParams;return ['product','workLabel'].some(k=>isCustomLabel(p.get(k)))||isCustomLabel(PROJECT_CATALOG[p.get('project')]?.title);}
function customEstimate(item){return !!item&&(item.inPersonQuoteRequired||[item.name,item.title,item.workLabel,...Object.values(item.options||{}),...Object.values(item.itemOptions||{}).flatMap(x=>Object.values(x||{})),...(item.products||[]).flatMap(x=>[x.name,...Object.values(x.options||{})])].some(isCustomLabel)||(item.sourceQuery&&customUrl('/calculators.html'+item.sourceQuery)));}
function customSelection(){return customUrl(location.href)||[...document.querySelectorAll('select')].some(s=>!s.disabled&&!s.closest('[hidden]')&&(!s.closest('.area-product')||s.closest('.area-product').querySelector('input:checked'))&&isCustomLabel(s.selectedOptions[0]?.textContent))||[...document.querySelectorAll('input:checked')].some(i=>isCustomLabel(i.value));}
function customQuoteMarkup(name){return '<h2>In-person quote required</h2><p>'+escapeCartText(name||'Custom work')+' requires an in-person visit before pricing.</p><a class="btn primary" href="sms:'+SITE.text.replaceAll('-','')+'?body='+encodeURIComponent('I would like to arrange an in-person quote for '+(name||'custom work')+'.')+'">Request in-person quote</a> <a class="btn outline" href="tel:'+SITE.phone.replaceAll('-','')+'">Call to schedule</a>';}
function renderCustomQuotePage(name){document.body.innerHTML=header()+'<main class="wrap section">'+customQuoteMarkup(name)+'</main>'+footer();updateCartCount();}
function showCustomQuote(name){let box=document.getElementById('custom-quote-request');if(!box){box=document.createElement('section');box.id='custom-quote-request';box.className='wrap panel';document.querySelector('main').prepend(box);}box.innerHTML=customQuoteMarkup(name);box.scrollIntoView({behavior:'smooth'});}
document.addEventListener('click',event=>{const control=event.target.closest('button,a');if(!control)return;const url=control.dataset.calcUrl||control.getAttribute('href');const card=control.closest('.card,.project-work-card');const name=card?.querySelector('h2,h3,summary')?.textContent;if((url&&/calculators.html/.test(url)&&customUrl(url))||(isCustomLabel(name)&&/calculate|add|next|options/i.test(control.textContent))){event.preventDefault();event.stopImmediatePropagation();showCustomQuote(name);}},true);
document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.page==='calculators'&&customUrl(location.href))renderCustomQuotePage(new URLSearchParams(location.search).get('workLabel')||'Custom work');});

function requiresInPersonQuote(item){if(!item)return false;if(item.type==='Material estimate'&&!item.quoteRequired)return false;return !!(item.quoteRequired||item.pricingPending||item.price===null||item.price===undefined||item.price===''||!Number.isFinite(Number(item.price)));}

// Owner-approved October 24, 2026. Labor only; material pricing stays separate.
window.ROOM_LABOR_SERVICES={
 hang:{label:'Drywall installation',sheetRate:75,wallRate:0},
 finish:{label:'Drywall finishing',sheetRate:0,wallRate:2.25},
 prime:{label:'Prime walls — one coat',sheetRate:0,wallRate:0.75},
 paint1:{label:'Paint walls — one coat',sheetRate:0,wallRate:0.75},
 paint2:{label:'Paint walls — two coats',sheetRate:0,wallRate:1.5},
 'hang-finish':{label:'Install and finish drywall',sheetRate:75,wallRate:2},
 'finish-prime':{label:'Finish and prime drywall',sheetRate:0,wallRate:2.75},
 'hang-finish-prime':{label:'Install, finish and prime drywall',sheetRate:75,wallRate:2.5},
 'finish-prime-paint':{label:'Finish, prime and paint walls — two paint coats',sheetRate:0,wallRate:4},
 full:{label:'Install, finish, prime and paint walls — two paint coats',sheetRate:75,wallRate:3.75}
};
window.CEILING_LABOR_MULTIPLIER=1.2;
window.roomLaborQuote=function(area,key,ceilingArea=0){
 const service=window.ROOM_LABOR_SERVICES[key];
 if(!service||!Number.isFinite(area)||!Number.isFinite(ceilingArea)||area<0||ceilingArea<0||area+ceilingArea<=0)throw Error('Enter a valid area and choose the work.');
 const sheets=Math.ceil(area/32),ceilingSheets=Math.ceil(ceilingArea/32);
 const wallAmount=sheets*service.sheetRate+area*service.wallRate;
 const ceilingAmount=(ceilingSheets*service.sheetRate+ceilingArea*service.wallRate)*window.CEILING_LABOR_MULTIPLIER;
 const amount=Math.round((wallAmount+ceilingAmount)*100)/100;
 return {...service,key,area,sheets,ceilingArea,ceilingSheets,wallAmount,ceilingAmount:Math.round(ceilingAmount*100)/100,amount};
};
window.roomLaborSize=function(floor){return floor<=40?'Small':floor<=144?'Medium':floor<=250?'Large':'Larger project';};

// Quantity discounts share the total removal count across rooms on the same visit.
function doorRemovalRate(quantity){return quantity>=4?75:quantity>=3?85:quantity>=2?100:150;}
function repriceRemovalGroups(cart){
 const counts={};for(const item of cart)if(item.removalGroup)counts[item.removalGroup]=(counts[item.removalGroup]||0)+Number(item.removalCount||item.qty||1);
 return cart.map(item=>item.removalGroup==='doors'?{...item,price:doorRemovalRate(counts.doors)*(item.removalCount||1)}:item.removalGroup==='cabinets'?{...item,price:cabinetRemovalRate(counts.cabinets)*(item.removalCount||1)}:item);
}
