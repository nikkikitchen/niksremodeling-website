const SITE={phone:'678-231-4377',text:'470-991-2133',email:'contact@niksremodeling.com'};
const PAGES={
 furniture:{title:'Furniture & Accessories',heroTitle:'Furniture & Accessories',tag:'Functional. Beautiful. Yours.',desc:'Find furniture, décor, appliances and finishing touches for every space — or explore custom-built and reclaimed pieces to make it truly yours.',hero:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85',tabs:['All Furniture','Custom & Reclaimed','Seating','Tables','Storage','Lighting','Décor','Appliances']},
 appliances:{title:'Appliances',heroTitle:'Performance for Real Life.',tag:'Reliable. Stylish. Built for Your Home.',desc:'Trusted brands, modern features and practical options for delivery, installation and project planning.',hero:'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1800&q=85',tabs:['Refrigerators','Ranges','Ovens','Cooktops','Microwaves','Dishwashers','Washers','Dryers','Range Hoods','Wine Coolers','Ice Makers']},
 cabinets:{title:'Cabinets',heroTitle:'Quality Cabinets for Every Space.',tag:'Beautiful. Durable. Designed for Your Home.',desc:'Style, storage and cabinet solutions for kitchens, baths and custom spaces, brought together around your project.',hero:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1800&q=85',tabs:['Kitchen Cabinets','Bathroom Vanities','Tall Cabinets','Wall Cabinets','Base Cabinets','Pantry Cabinets','Hardware','Countertops','Accessories']},
 tools:{title:'Tools',heroTitle:'The Right Tools for the Job.',tag:'DIY or professional-grade.',desc:'Everyday essentials and professional-grade equipment to keep remodeling projects moving.',hero:'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1800&q=85',tabs:['Power Tools','Hand Tools','Sawing','Drilling','Measuring','Safety']},
 materials:{title:'Materials',heroTitle:'Build It Right from the Start.',tag:'Plan quantities first. Buy with confidence.',desc:'Core remodeling materials organized by project so you can plan quantities, products and installation together.',hero:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=85',tabs:['Flooring','Tile & Stone','Drywall','Lumber','Trim','Exterior']},
 supplies:{title:'Supplies',heroTitle:'Everything That Keeps the Job Moving.',tag:'The right supplies for the work ahead.',desc:'Fasteners, adhesives, paint supplies, plumbing and electrical essentials, protection and jobsite consumables.',hero:'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1800&q=85',tabs:['Fasteners','Adhesives','Paint','Plumbing','Electrical','Protection']},
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

const PRODUCTS={
 furniture:[
  {name:'Ashford 84" Sofa',sku:'MC-ASH84',category:'Living Room',badge:'Best Seller',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Reclaimed Wood Dining Table',sku:'RF-RWDT72',category:'Dining Room',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Upholstered Platform Bed',sku:'MC-BED840',category:'Bedroom',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Rustic Farmhouse TV Console',sku:'RF-TV60',category:'Media & TV',details:['In Stock','Ships in 3–5 Days','Curbside Delivery Included']},
  {name:'Leather Accent Chair',sku:'MC-LC01',category:'Accent Seating',details:['In Stock','Ships in 3–5 Days','Curbside Delivery Included']},
  {name:'Modern Coffee Table',sku:'RF-CT48',category:'Living Room',details:['In Stock','Ships in 3–5 Days','Curbside Delivery Included']},
  {name:'Storage Sideboard',sku:'MC-SB60',category:'Storage',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Bookcase with Drawers',sku:'RF-BC72',category:'Storage',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Outdoor Adirondack Chair (Set of 2)',sku:'OD-AC2',category:'Outdoor',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Area Rug – 8’ x 10’',sku:'RG-810',category:'Rugs & Décor',details:['In Stock','Ships in 3–7 Days','Curbside Delivery Included']},
  {name:'Modern Floor Lamp',sku:'LT-FL01',category:'Lighting',details:['In Stock','Ships in 3–5 Days','Curbside Delivery Included']},
  {name:'Home Office Desk',sku:'MC-DSK01',category:'Home Office',details:['In Stock','Ships in 3–5 Days','Curbside Delivery Included']}
 ],
 appliances:[
  {name:'Whirlpool 36" French Door Refrigerator',sku:'WH-FD36',category:'Refrigerators',details:['In Stock','Local Inventory','Delivery Available']},
  {name:'Samsung 5.8 cu. ft. Electric Range',sku:'SA-ER58',category:'Ranges',details:['In Stock','Local Inventory','Installation Option']},
  {name:'LG Stainless Steel Dishwasher',sku:'LG-DWSS',category:'Dishwashers',details:['In Stock','Local Inventory','Installation Option']},
  {name:'GE Over-the-Range Microwave',sku:'GE-OTRMW',category:'Microwaves',details:['In Stock','Local Inventory','Installation Option']},
  {name:'Maytag Washer & Dryer Set',sku:'MA-WDSET',category:'Laundry',details:['In Stock','Local Inventory','Delivery Available']},
  {name:'KitchenAid Single Wall Oven',sku:'KA-SWO',category:'Ovens',details:['In Stock','Local Inventory','Installation Option']},
  {name:'Frigidaire 30" Gas Cooktop',sku:'FR-GC30',category:'Cooktops',details:['In Stock','Local Inventory','Installation Option']},
  {name:'ZLINE Wall Mount Range Hood',sku:'ZL-WMRH',category:'Range Hoods',details:['In Stock','Local Inventory','Installation Option']},
  {name:'Café 24" Wine Cooler',sku:'CA-WC24',category:'Wine Coolers',details:['In Stock','Local Inventory','Delivery Available']},
  {name:'GE Nugget Ice Maker',sku:'GE-NIM',category:'Ice Makers',details:['In Stock','Local Inventory','Delivery Available']},
  {name:'LG Side-by-Side Refrigerator',sku:'LG-SBS',category:'Refrigerators',details:['In Stock','Local Inventory','Delivery Available']},
  {name:'Samsung Double Wall Oven',sku:'SA-DWO',category:'Ovens',details:['In Stock','Local Inventory','Installation Option']}
 ],
 cabinets:[
  {name:'Shaker Kitchen Cabinet Set',sku:'CB-SHK-SET',category:'Kitchen Cabinets',details:['Multiple Sizes','Soft-Close Options','Project Planning Available']},
  {name:'Modern Gray Base Cabinet',sku:'CB-MG-BASE',category:'Base Cabinets',details:['Multiple Widths','Drawer Options','Installation Available']},
  {name:'Bathroom Vanity',sku:'CB-VAN-01',category:'Bathroom Vanities',details:['Multiple Finishes','Top Options','Installation Available']},
  {name:'Tall Pantry Cabinet',sku:'CB-PANTRY',category:'Pantry Cabinets',details:['Multiple Heights','Adjustable Shelves','Project Planning Available']},
  {name:'Wall Cabinet',sku:'CB-WALL',category:'Wall Cabinets',details:['Multiple Widths','Glass Door Options','Installation Available']},
  {name:'Base Cabinet',sku:'CB-BASE',category:'Base Cabinets',details:['Multiple Widths','Drawer Configurations','Installation Available']},
  {name:'Kitchen Island Cabinet',sku:'CB-ISLAND',category:'Kitchen Islands',details:['Storage Options','Panel Options','Project Planning Available']},
  {name:'Open Shelf Cabinet',sku:'CB-OPEN',category:'Accessories',details:['Open Display Storage','Multiple Finishes','Project Planning Available']},
  {name:'Glass Front Wall Cabinet',sku:'CB-GLASS',category:'Wall Cabinets',details:['Glass Door','Multiple Finishes','Installation Available']},
  {name:'Corner Base Cabinet',sku:'CB-CORNER',category:'Base Cabinets',details:['Corner Storage','Shelf Options','Installation Available']},
  {name:'Drawer Cabinet',sku:'CB-DRAWER',category:'Base Cabinets',details:['Deep Drawers','Soft-Close Options','Installation Available']},
  {name:'Cabinet Hardware Set',sku:'CB-HWSET',category:'Hardware',details:['Multiple Finishes','Pulls & Knobs','Project Matching Available']}
 ],
 tools:[
  {name:'Cordless Drill Kit',sku:'TL-DRILL',category:'Drilling',details:['Cordless','Battery Kit','Jobsite Ready']},
  {name:'7-1/4 in. Circular Saw',sku:'TL-CIRSAW',category:'Sawing',details:['Jobsite Saw','Blade Included','Professional Grade']},
  {name:'Laser Measure',sku:'TL-LASER',category:'Measuring',details:['Digital Measure','Compact','Project Ready']},
  {name:'Oscillating Multi-Tool',sku:'TL-OSC',category:'Power Tools',details:['Multi-Purpose','Accessory Ready','Jobsite Ready']},
  {name:'Impact Driver',sku:'TL-IMPACT',category:'Drilling',details:['Cordless','High Torque','Professional Grade']},
  {name:'Shop Vacuum',sku:'TL-VAC',category:'Cleanup',details:['Wet / Dry','Jobsite Use','Portable']},
  {name:'Miter Saw',sku:'TL-MITER',category:'Sawing',details:['Crosscut & Miter','Jobsite Ready','Professional Grade']},
  {name:'Level',sku:'TL-LEVEL',category:'Measuring',details:['Construction Grade','Easy Read','Multiple Lengths']},
  {name:'Tool Storage',sku:'TL-STORAGE',category:'Storage',details:['Portable Storage','Jobsite Organization','Multiple Sizes']},
  {name:'Safety Gear',sku:'TL-SAFETY',category:'Safety',details:['Eye / Ear Protection','Jobsite Essentials','Multiple Options']},
  {name:'Sander',sku:'TL-SANDER',category:'Power Tools',details:['Finish Prep','Dust Collection Option','Jobsite Ready']},
  {name:'Work Light',sku:'TL-LIGHT',category:'Jobsite',details:['LED','Portable','Indoor / Outdoor Use']}
 ],
 materials:[
  {name:'Luxury Vinyl Plank',sku:'MT-LVP',category:'Flooring',details:['Water-Resistant Options','Multiple Finishes','Installation Available']},
  {name:'Porcelain Tile',sku:'MT-PTILE',category:'Tile & Stone',details:['Floor / Wall Options','Multiple Sizes','Installation Available']},
  {name:'Drywall Sheet',sku:'MT-DRYWALL',category:'Drywall',details:['Common Sizes','Standard / Moisture Resistant','Project Quantity Planning']},
  {name:'Primed Crown Molding',sku:'MT-CROWN',category:'Trim',details:['Primed Finish','Multiple Profiles','Installation Available']},
  {name:'Pressure-Treated Lumber',sku:'MT-PTL',category:'Lumber',details:['Exterior Rated','Multiple Dimensions','Project Quantity Planning']},
  {name:'Stone Veneer',sku:'MT-STONE',category:'Tile & Stone',details:['Interior / Exterior Options','Multiple Styles','Installation Available']},
  {name:'Backer Board',sku:'MT-BACKER',category:'Tile & Stone',details:['Wet Area Applications','Multiple Thicknesses','Project Quantity Planning']},
  {name:'Underlayment',sku:'MT-UNDER',category:'Flooring',details:['Floor Prep','Multiple Types','Project Quantity Planning']},
  {name:'Trim Board',sku:'MT-TRIM',category:'Trim',details:['Interior / Exterior Options','Multiple Widths','Installation Available']},
  {name:'Decking',sku:'MT-DECK',category:'Exterior',details:['Wood / Composite Options','Multiple Colors','Installation Available']},
  {name:'Wall Panel',sku:'MT-WALL',category:'Interior',details:['Decorative Options','Multiple Profiles','Installation Available']},
  {name:'Countertop Surface',sku:'MT-COUNTER',category:'Surfaces',details:['Stone / Solid Surface Options','Multiple Finishes','Installation Available']}
 ],
 supplies:[
  {name:'Construction Adhesive',sku:'SP-ADH',category:'Adhesives',details:['Interior / Exterior','Multiple Formulas','Project Ready']},
  {name:'Deck Screws',sku:'SP-DSCR',category:'Fasteners',details:['Exterior Rated','Multiple Lengths','Bulk Options']},
  {name:'Painter Kit',sku:'SP-PAINT',category:'Paint',details:['Rollers / Brushes','Prep Essentials','Project Ready']},
  {name:'Plumbing Repair Kit',sku:'SP-PLUMB',category:'Plumbing',details:['Common Repair Parts','Jobsite Ready','Multiple Configurations']},
  {name:'Electrical Essentials',sku:'SP-ELEC',category:'Electrical',details:['Boxes / Connectors / Consumables','Project Ready','Multiple Options']},
  {name:'Floor Protection Roll',sku:'SP-FLOOR',category:'Protection',details:['Temporary Protection','Jobsite Use','Multiple Sizes']},
  {name:'Caulk & Sealant',sku:'SP-SEAL',category:'Adhesives',details:['Interior / Exterior','Paintable Options','Multiple Colors']},
  {name:'Grout Supplies',sku:'SP-GROUT',category:'Tile',details:['Grout / Spacers / Floats','Multiple Colors','Project Ready']},
  {name:'Fastener Kit',sku:'SP-FAST',category:'Fasteners',details:['Assorted Fasteners','Jobsite Ready','Multiple Sizes']},
  {name:'Drop Cloths',sku:'SP-DROP',category:'Protection',details:['Reusable Options','Multiple Sizes','Interior Protection']},
  {name:'Tape & Masking',sku:'SP-TAPE',category:'Paint',details:['Painter Tape','Masking Film','Project Ready']},
  {name:'Cleaning Supplies',sku:'SP-CLEAN',category:'Cleanup',details:['Jobsite Cleanup','Multiple Products','Project Ready']}
 ]
};

function getCart(){try{return JSON.parse(localStorage.getItem('nr-cart')||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem('nr-cart',JSON.stringify(c));updateCartCount()}
function updateCartCount(){const n=getCart().reduce((s,x)=>s+(x.qty||1),0);document.querySelectorAll('.cart-count').forEach(e=>e.textContent=n)}
function addItem(name,type='Project'){const c=getCart();const found=c.find(x=>x.name===name);if(found)found.qty=(found.qty||1)+1;else c.push({name,qty:1,type});saveCart(c);alert(`${name} added to your ${type.toLowerCase()}.`)}
function header(){return `<div class="topline"><div class="wrap"><div>Office: ${SITE.phone} &nbsp; • &nbsp; Text/Personal: ${SITE.text}</div><div>SUPPLY. PLAN. BUILD. TOGETHER.</div></div></div><div class="wrap brandbar"><a class="logo" href="/"><svg class="brand-logo" viewBox="0 0 175 201" role="img" aria-label="Nik's Remodeling NR logo"><path d="M11,160 11,180 161,180 161,160Z M92,82 92,150 113,150 113,123 114,122 117,122 118,123 119,123 123,127 123,128 124,129 124,130 126,132 126,133 127,134 127,135 128,136 128,137 129,138 129,139 130,140 130,141 132,143 132,144 133,145 133,146 134,147 134,148 135,149 135,150 160,150 159,149 159,148 158,147 158,146 157,145 157,144 156,143 156,142 155,141 155,140 153,138 153,137 152,136 152,135 151,134 151,133 150,132 150,131 149,130 149,129 146,126 146,125 144,123 143,123 142,122 141,122 140,121 139,121 138,120 139,119 141,119 142,118 144,118 145,117 146,117 152,111 152,110 153,109 153,108 154,107 154,95 153,94 153,92 152,91 152,90 147,85 146,85 145,84 143,84 142,83 138,83 137,82Z M113,96 114,95 127,95 128,96 129,96 132,99 132,100 133,101 133,104 132,105 132,106 129,109 126,109 125,110 114,110 113,109Z M11,82 11,150 32,150 32,116 33,115 35,117 35,118 37,120 37,121 39,123 39,124 41,126 41,127 43,129 43,130 45,132 45,133 47,135 47,136 49,138 49,139 51,141 51,142 54,145 54,146 56,148 56,149 57,150 77,150 77,82 57,82 57,117 56,118 55,117 55,116 53,114 53,113 51,111 51,110 49,108 49,107 47,105 47,104 45,102 45,101 43,99 43,98 41,96 41,95 39,93 39,92 37,90 37,89 34,86 34,85 32,83 32,82Z M82,14 79,17 78,17 75,20 74,20 70,24 69,24 65,28 64,28 61,31 60,31 56,35 55,35 51,39 50,39 47,42 46,42 42,46 41,46 37,50 36,50 33,53 32,53 28,57 27,57 23,61 22,61 19,64 18,64 14,68 13,68 11,70 11,73 34,73 35,72 36,72 39,69 40,69 44,65 45,65 48,62 49,62 53,58 54,58 57,55 58,55 61,52 62,52 66,48 67,48 70,45 71,45 75,41 76,41 79,38 80,38 82,36 84,38 85,38 89,42 90,42 93,45 94,45 98,49 99,49 102,52 103,52 107,56 108,56 112,60 113,60 116,63 117,63 121,67 122,67 125,70 126,70 129,73 153,73 153,71 150,68 149,68 145,64 144,64 139,59 138,59 133,54 132,54 128,50 127,50 122,45 121,45 116,40 115,40 111,36 110,36 105,31 104,31 99,26 98,26 94,22 93,22 88,17 87,17 84,14Z" fill="#7d5437" fill-rule="evenodd"/></svg><span><strong>NIK'S REMODELING</strong><em>EVERYTHING UNDER THE ROOF</em></span></a><form class="search" onsubmit="event.preventDefault();alert('Search will show connected inventory as supplier feeds are added.');"><input placeholder="Search products, projects, or ideas…"><button>Search</button></form><div class="actions"><a class="cart-pill" href="/project-cart.html">Project Cart <span class="cart-count">0</span></a><a href="tel:${SITE.phone.replaceAll('-','')}">Account / Call</a></div></div><nav class="nav"><div class="wrap"><a href="/">Home</a><a href="/#projects">Shop by Project</a><a href="/materials.html">Materials</a><a href="/supplies.html">Supplies</a><a href="/tools.html">Tools</a><a href="/furniture.html">Furniture & Accessories</a><a href="/appliances.html">Appliances</a><a href="/cabinets.html">Cabinets</a><a href="/installation.html">Installation & Labor</a><a href="/calculators.html">Calculators</a></div></nav>`}
function footer(){return `<div class="assurance"><div class="wrap"><span>🚚 Delivery / Local Pickup Options</span><span>🛡️ Quality Products</span><span>🏠 Installation Available</span><span>💬 Real Support</span></div></div><footer class="footer"><div class="wrap"><div class="footgrid"><div><h3>Everything under the roof</h3><p>SUPPLY. PLAN. BUILD. TOGETHER.</p><p><strong>From the first idea to the final detail, Nik’s Remodeling brings your project together.</strong></p></div><div><h3>Shop</h3><a href="/materials.html">Materials</a><a href="/supplies.html">Supplies</a><a href="/tools.html">Tools</a><a href="/furniture.html">Furniture</a><a href="/appliances.html">Appliances</a><a href="/cabinets.html">Cabinets</a></div><div><h3>Project</h3><a href="/calculators.html">Calculators</a><a href="/installation.html">Installation & Labor</a><a href="/project-cart.html">Project Cart</a></div><div><h3>Contact</h3><a href="tel:${SITE.phone.replaceAll('-','')}">${SITE.phone}</a><a href="sms:${SITE.text.replaceAll('-','')}">${SITE.text}</a><a href="mailto:${SITE.email}">${SITE.email}</a></div></div><div class="fine">© 2026 Nik's Remodeling. All rights reserved. West Georgia & East Alabama.</div></div></footer>`}

function fallbackProducts(page){
 const names={installation:['Kitchen Installation','Bathroom Installation','Flooring Installation','Interior Painting','Trim & Finish Work','Custom Project Labor','Cabinet Installation','Appliance Installation','Tile Installation','Exterior Work','Deck / Outdoor Work','Project Coordination']}[page]||[];
 return names.map((name,i)=>({name,sku:`NR-${page.slice(0,3).toUpperCase()}-${String(i+1).padStart(2,'0')}`,category:PAGES[page]?.title||page,details:['Scope Review','Project Coordination','Scheduling Available']}));
}
const PROJECT_FLOW={calculators:{number:1,label:'Materials',next:'furniture',nextLabel:'Furniture'},furniture:{number:2,label:'Furniture',previous:'calculators',next:'appliances',nextLabel:'Appliances'},appliances:{number:3,label:'Appliances',previous:'furniture',next:'supplies',nextLabel:'Supplies'},supplies:{number:4,label:'Supplies',previous:'appliances',next:'tools',nextLabel:'Tools'},tools:{number:5,label:'Tools',previous:'supplies',next:'installation',nextLabel:'Labor'},installation:{number:6,label:'Labor',previous:'tools',next:'cart',nextLabel:'Review & Checkout'},cart:{number:7,label:'Review & Checkout',previous:'installation'}};
function projectFlow(page){const step=PROJECT_FLOW[page];if(!step)return '';const urls={calculators:'/calculators.html',furniture:'/furniture.html',appliances:'/appliances.html',supplies:'/supplies.html#suggested-supplies',tools:'/tools.html',installation:'/installation.html',cart:'/project-cart.html'};return `<section class="project-flow"><div class="wrap project-flow-inner"><div><span class="eyebrow">STEP ${step.number} OF 7</span><h2>${step.label}</h2><p>Keep building your project. You can return to any step.</p></div><div class="project-flow-actions">${step.previous?`<a class="btn outline" href="${urls[step.previous]}">← Previous Step</a>`:''}${step.next?`<a class="btn primary" href="${urls[step.next]}">Next: ${step.nextLabel} →</a>`:''}</div></div></section>`}
function renderCategory(page){
 const p=PAGES[page],products=PRODUCTS[page]||fallbackProducts(page),imgs=PRODUCT_IMAGES[page]||PRODUCT_IMAGES.installation;
 document.title=`${p.title} | Nik's Remodeling`;
 document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('${p.hero}')"><div class="wrap"><div class="eyebrow">${p.title}</div><h1>${p.heroTitle}</h1><h2>${p.tag}</h2><p>${p.desc}</p><div class="hero-points"><span>✓ Product Photos</span><span>✓ Product Details</span><span>✓ Delivery Options</span><span>✓ Add to Project</span></div></div></section><div class="wrap category-tabs">${p.tabs.map(x=>`<button>${x}</button>`).join('')}</div>${projectFlow(page)}${page==='supplies'?'<section class="section" id="suggested-supplies"><div class="wrap" id="supply-recommendations"></div></section>':''}${page==='appliances'?'<div class="wrap appliance-supply-cta"><p>Add an appliance to your project to see possible connection supplies.</p><a class="btn outline" href="/supplies.html#suggested-supplies">Review Suggested Supplies →</a></div>':''}<section class="section alt"><div class="wrap catalog"><aside class="filters"><h3>Filter Products</h3><label><input type="checkbox"> In Stock / Available</label><label><input type="checkbox"> Delivery Available</label><label><input type="checkbox"> Installation Option</label><label><input type="checkbox"> Custom / Special Order</label><p class="filter-note">Prices are intentionally not displayed so final customer pricing can be set from current supplier cost, freight, and markup.</p></aside><div><div class="catalog-head"><div><h2>${p.title}</h2><p class="lead">Browse products, photos, specifications and availability. Pricing is intentionally omitted.</p></div><select><option>Featured</option><option>Name A–Z</option></select></div><div class="products">${products.map((x,i)=>`<article class="card"><div class="pic"><img src="${imgs[i%imgs.length]}" alt="${x.name}" loading="lazy"></div><div class="body">${x.badge?`<div class="stock">${x.badge}</div>`:''}<h3>${x.name}</h3><div class="stock neutral">SKU: ${x.sku}</div><div class="stock neutral">${x.category}</div><div class="product-details">${x.details.map(d=>`<div>✓ ${d}</div>`).join('')}</div><div class="card-actions"><button class="add-project" onclick="addItem('${x.name.replaceAll("'","\\'")}','Project')">Add to Project</button><button class="add-cart" onclick="addItem('${x.name.replaceAll("'","\\'")}','Cart')">Add to Cart</button></div></div></article>`).join('')}</div></div></div></section></main>`+projectFlow(page)+footer();updateCartCount();if(page==='supplies')renderSupplyPlan()
}
const MATERIAL_ESTIMATES_KEY='niks-material-estimates-v1';
let materialEstimates=[];
function materialField(id,label,opts={}){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="number" min="0" step="${opts.step||'0.1'}" ${opts.value!==undefined?`value="${opts.value}"`:''} ${opts.placeholder?`placeholder="${opts.placeholder}"`:''}></div>`}
function renderCalculators(){
 document.title='Project Calculators | Nik\'s Remodeling';
 document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85')"><div class="wrap"><div class="eyebrow">Plan Your Project</div><h1>Project Calculators</h1><p>Estimate quantities for several materials in one project. Confirm final quantities and product sizes before ordering.</p></div></section><section class="section"><div class="wrap calc-workspace"><div class="panel"><h2>Materials Calculator</h2><div class="field"><label for="material-name">Room or area (optional)</label><input id="material-name" type="text" maxlength="60" placeholder="Example: living room"></div><div class="field"><label for="material-type">Material</label><select id="material-type" onchange="showMaterialFields()"><option value="flooring">Flooring / Tile</option><option value="paint">Paint</option><option value="lumber">Wood / Framing Lumber</option><option value="drywall">Drywall</option><option value="concrete">Concrete</option></select></div>
 <div class="material-fields" data-material="flooring"><h3>Flooring / Tile</h3><div class="field"><label for="floor-kind">Flooring type</label><select id="floor-kind"><option value="tile">Tile</option><option value="floating">Click Flooring (laminate / vinyl)</option><option value="glue">Glue-Down Flooring</option><option value="nail">Nail-Down Wood</option></select></div><div class="calc-fields">${materialField('floor-length','Area length (ft)',{value:12})}${materialField('floor-width','Area width (ft)',{value:10})}<div class="field"><label for="floor-waste">Waste allowance</label><select id="floor-waste"><option value="0.05">5%</option><option value="0.10" selected>10%</option><option value="0.15">15%</option><option value="0.20">20%</option></select></div>${materialField('floor-box','Coverage per box (sq. ft., optional)',{placeholder:'From product label'})}</div></div>
 <div class="material-fields" data-material="paint" hidden><h3>Paint</h3><div class="calc-fields">${materialField('paint-length','Total wall length (ft)',{value:40})}${materialField('paint-height','Wall height (ft)',{value:8})}${materialField('paint-openings','Doors/windows to subtract (sq. ft.)',{value:0})}${materialField('paint-coats','Number of coats',{step:1,value:2})}${materialField('paint-coverage','Coverage per gallon per coat (sq. ft.)',{step:1,value:350})}</div></div>
 <div class="material-fields" data-material="lumber" hidden><h3>Wood / Wall Framing</h3><div class="calc-fields">${materialField('wood-length','Wall length (ft)',{value:12})}${materialField('wood-height','Wall height (ft)',{value:8})}<div class="field"><label for="wood-spacing">Stud spacing, on center</label><select id="wood-spacing"><option value="16">16 in.</option><option value="24">24 in.</option></select></div></div><p class="calc-note">Counts one stud at each end and three plate runs. Add lumber for openings, corners and blocking after reviewing the plan.</p></div>
 <div class="material-fields" data-material="drywall" hidden><h3>Drywall</h3><div class="calc-fields">${materialField('dry-length','Total wall length (ft)',{value:40})}${materialField('dry-height','Wall height (ft)',{value:8})}${materialField('dry-openings','Doors/windows to subtract (sq. ft.)',{value:0})}<div class="field"><label for="dry-sheet">Sheet size</label><select id="dry-sheet"><option value="32">4 × 8 ft.</option><option value="48">4 × 12 ft.</option></select></div><div class="field"><label for="dry-waste">Waste allowance</label><select id="dry-waste"><option value="0.10">10%</option><option value="0.15" selected>15%</option><option value="0.20">20%</option></select></div></div></div>
 <div class="material-fields" data-material="concrete" hidden><h3>Concrete Slab</h3><div class="calc-fields">${materialField('concrete-length','Length (ft)',{value:12})}${materialField('concrete-width','Width (ft)',{value:10})}${materialField('concrete-depth','Depth (in.)',{value:4})}<div class="field"><label for="concrete-waste">Extra allowance</label><select id="concrete-waste"><option value="0.05" selected>5%</option><option value="0.10">10%</option></select></div></div></div>
 <button class="btn primary" type="button" onclick="calcMaterial()">Add Calculation</button><p class="calc-error" id="mat-error" role="alert" hidden></p></div><div class="calc-side"><div class="panel"><div class="calc-results-head"><h2>Project Material List</h2><button class="btn outline" type="button" onclick="clearMaterialEstimates()" id="clear-materials" hidden>Clear All</button></div><div id="material-results" aria-live="polite"><p class="calc-note">Add a material to see the estimate here.</p></div><p><a class="btn primary" href="/furniture.html">Next: Furniture →</a></p><p><a href="/supplies.html#suggested-supplies">Review Suggested Supplies</a></p><p class="calc-note">Planning estimates only. Product coverage, cuts, openings and site conditions can change what you need. No prices are shown.</p></div><div class="panel"><h2>Installation / Labor</h2><p>Labor depends on site conditions, removal, prep, layout, access and finish details. Final labor is priced after the scope is reviewed.</p><div class="btns"><a class="btn primary" href="tel:${SITE.phone.replaceAll('-','')}">Call for Scope Review</a><a class="btn outline" href="sms:${SITE.text.replaceAll('-','')}">Text Project Details</a></div></div></div></div></section></main>`+projectFlow('calculators')+footer();
 try{const saved=JSON.parse(localStorage.getItem(MATERIAL_ESTIMATES_KEY)||'[]');materialEstimates=Array.isArray(saved)?saved.filter(x=>x&&typeof x.title==='string'&&typeof x.result==='string').slice(0,50):[]}catch{materialEstimates=[]}
 renderMaterialEstimates();updateCartCount();
}
function showMaterialFields(){const type=document.getElementById('material-type').value;document.querySelectorAll('.material-fields').forEach(el=>{el.hidden=el.dataset.material!==type});document.getElementById('mat-error').hidden=true}
function materialNumber(id){const input=document.getElementById(id),n=Number(input.value);if(input.value.trim()===''||!Number.isFinite(n)||n<0)throw Error('Enter valid, nonnegative numbers for the selected material.');return n}
function materialPositive(id){const n=materialNumber(id);if(n<=0)throw Error('Lengths, coverage, depth and counts must be greater than zero.');return n}
function calcMaterial(){
 const type=document.getElementById('material-type').value,error=document.getElementById('mat-error');error.hidden=true;
 const labels={flooring:'Flooring / Tile',paint:'Paint',lumber:'Wood / Framing Lumber',drywall:'Drywall',concrete:'Concrete'};
 try{
  let result='',detail='';
  if(type==='flooring'){
   const area=materialPositive('floor-length')*materialPositive('floor-width'),waste=materialNumber('floor-waste'),needed=area*(1+waste),box=document.getElementById('floor-box').value.trim();
   result=`${Math.ceil(needed)} sq. ft. to cover`;detail=`${area.toFixed(1)} sq. ft. area + ${Math.round(waste*100)}% waste`;
   if(box){const coverage=materialPositive('floor-box');result+=` · ${Math.ceil(needed/coverage)} boxes at ${coverage} sq. ft./box`}
  }else if(type==='paint'){
   const area=materialPositive('paint-length')*materialPositive('paint-height')-materialNumber('paint-openings'),coats=materialPositive('paint-coats'),coverage=materialPositive('paint-coverage');
   if(!Number.isInteger(coats)||area<=0)throw Error('Enter whole coats and a wall area larger than the openings.');
   result=`${Math.ceil(area*coats/coverage)} gallons estimated`;detail=`${area.toFixed(1)} sq. ft. net wall area × ${coats} coats at ${coverage} sq. ft./gallon`;
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
  if(!result)throw Error('Choose a material.');
  const areaName=document.getElementById('material-name').value.trim();materialEstimates.push({type,floorKind:type==='flooring'?document.getElementById('floor-kind').value:undefined,title:`${labels[type]}${areaName?` — ${areaName}`:''}`,result,detail});
  if(materialEstimates.length>50)materialEstimates.shift();saveMaterialEstimates();renderMaterialEstimates();
 }catch(e){error.textContent=e.message;error.hidden=false}
}
function saveMaterialEstimates(){try{localStorage.setItem(MATERIAL_ESTIMATES_KEY,JSON.stringify(materialEstimates))}catch{}}
function renderMaterialEstimates(){const list=document.getElementById('material-results');list.replaceChildren();document.getElementById('clear-materials').hidden=materialEstimates.length===0;if(!materialEstimates.length){const p=document.createElement('p');p.className='calc-note';p.textContent='Add a material to see the estimate here.';list.append(p);return}materialEstimates.forEach((item,index)=>{const row=document.createElement('article');row.className='material-result';const info=document.createElement('div'),title=document.createElement('strong'),amount=document.createElement('div'),detail=document.createElement('small'),remove=document.createElement('button');title.textContent=item.title;amount.textContent=item.result;detail.textContent=item.detail;remove.type='button';remove.className='remove-material';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${item.title}`);remove.onclick=()=>{materialEstimates.splice(index,1);saveMaterialEstimates();renderMaterialEstimates()};info.append(title,amount,detail);row.append(info,remove);list.append(row)})}
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
 const intro=document.createElement('p');intro.className='lead';intro.textContent=suggested.length?'Review supplies related to your materials and appliances below. Choose only what your project needs.':'Add a material calculation or appliance to see matching supplies here. You can also browse all offered supplies below.';root.append(intro);
 let checked={};try{const saved=JSON.parse(localStorage.getItem(SUPPLY_CHECKS_KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))checked=saved}catch{}
 const count=document.createElement('p');count.id='supply-selected-count';count.className='supply-selection-count';root.append(count);
 const featured=document.createElement('div');featured.className='supply-guide-grid';root.append(featured);
 const other=document.createElement('details');other.className='supply-all-offered';const summary=document.createElement('summary');summary.textContent='See All Offered Supplies';other.append(summary);
 const allGrid=document.createElement('div');allGrid.className='supply-guide-grid';other.append(allGrid);
 const boxes=()=>root.querySelectorAll('.supply-choice input[type="checkbox"]');
 const updateCount=()=>{const n=[...boxes()].filter(box=>box.checked).length;count.textContent=`${n} supply ${n===1?'item':'items'} selected`};
 const saveChecks=()=>{try{localStorage.setItem(SUPPLY_CHECKS_KEY,JSON.stringify(checked))}catch{}updateCount()};
 const selectWithin=area=>{area.querySelectorAll('.supply-choice input[type="checkbox"]').forEach(box=>{box.checked=true;checked[box.dataset.key]=true});saveChecks()};
 function addGroup(group,container){const guide=SUPPLY_GUIDE[group]||APPLIANCE_SUPPLY_GUIDE[group],card=document.createElement('section'),h=document.createElement('h3'),list=document.createElement('div');card.className='panel supply-guide-card';h.textContent=guide.label;list.className='supply-guide-list';card.append(h);if(suggested.includes(group)){const badge=document.createElement('span');badge.className='supply-match';badge.textContent='From your project';card.append(badge)}card.append(list);
  for(const [name,note] of guide.items){const key=group+':'+name,row=document.createElement('label'),box=document.createElement('input'),copy=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');row.className='supply-choice';box.type='checkbox';box.checked=!!checked[key];box.dataset.key=key;box.dataset.name=name;box.setAttribute('aria-label',`Need ${name} for ${guide.label}`);box.addEventListener('change',()=>{checked[key]=box.checked;saveChecks()});strong.textContent=name;small.textContent=note;copy.append(strong,small);row.append(box,copy);list.append(row)}
  const selectGroup=document.createElement('button');selectGroup.type='button';selectGroup.className='btn outline supply-select-group';selectGroup.textContent='Select All in This List';selectGroup.addEventListener('click',()=>selectWithin(list));card.append(selectGroup);container.append(card)}
 suggested.forEach(group=>addGroup(group,featured));
 allGroups.filter(group=>!suggested.includes(group)).forEach(group=>addGroup(group,allGrid));
 if(suggested.length){const selectSuggested=document.createElement('button');selectSuggested.type='button';selectSuggested.className='btn outline supply-select-visible';selectSuggested.textContent='Select All Suggested Supplies';selectSuggested.addEventListener('click',()=>selectWithin(featured));root.append(selectSuggested)}
 const selectAll=document.createElement('button');selectAll.type='button';selectAll.className='btn outline supply-select-visible';selectAll.textContent='Select All Offered Supplies';selectAll.addEventListener('click',()=>selectWithin(allGrid));other.append(selectAll);root.append(other);updateCount();
 const actions=document.createElement('div');actions.className='supply-actions';
 const clear=document.createElement('button');clear.type='button';clear.className='btn outline';clear.textContent='Clear Selection';clear.addEventListener('click',()=>{boxes().forEach(box=>{box.checked=false;checked[box.dataset.key]=false});saveChecks()});
 const add=document.createElement('button');add.type='button';add.className='btn primary';add.textContent='Add Selected to Project';const status=document.createElement('p');status.className='calc-note';status.setAttribute('role','status');add.addEventListener('click',()=>{const names=[...new Set([...boxes()].filter(box=>box.checked).map(box=>box.dataset.name))];if(!names.length){status.textContent='Select at least one supply first.';return}const cart=getCart();let added=0;for(const name of names){if(!cart.some(item=>item.name===name)){cart.push({name,qty:1,type:'Supplies'});added++}}saveCart(cart);status.textContent=added?`${added} supplies added to your Project Cart.`:'These supplies are already in your Project Cart.'});
 actions.append(clear,add);root.append(actions,status);const note=document.createElement('p');note.className='calc-note';note.textContent='Your selections stay on this device. Check product compatibility and final quantities before ordering. No prices are shown.';root.append(note)
}
function renderCart(){const c=getCart();document.title='Project Cart | Nik\'s Remodeling';document.body.innerHTML=header()+`<main><section class="section"><div class="wrap"><h2>Your Project Cart</h2><p class="lead">Save products and project items here. Pricing, supplier availability, freight and any installation are confirmed before the order is accepted.</p><div class="panel"><div class="cart-list">${c.length?c.map((x,i)=>`<div class="cart-item"><div><strong>${x.name}</strong><div>${x.type||'Project'} item · Qty ${x.qty||1}</div></div><div class="cart-current">Current price to be confirmed</div><button class="btn outline" onclick="removeCart(${i})">Remove</button></div>`).join(''):'<div class="empty">Your project cart is empty. Browse products and add items when you are ready.</div>'}</div>${c.length?`<div class="result">Nothing is charged from this page. Review current product pricing and availability with Nik’s Remodeling before purchase.</div><div class="btns"><a class="btn primary" href="tel:${SITE.phone.replaceAll('-','')}">Call to Review Project</a><a class="btn outline" href="sms:${SITE.text.replaceAll('-','')}">Text Project Cart</a><a class="btn outline" href="/">Continue Shopping</a></div>`:''}</div></div></section></main>`+projectFlow('cart')+footer();updateCartCount()}
function removeCart(i){const c=getCart();c.splice(i,1);saveCart(c);renderCart()}
document.addEventListener('DOMContentLoaded',()=>{const page=document.body.dataset.page;if(PAGES[page])renderCategory(page);else if(page==='calculators')renderCalculators();else if(page==='cart')renderCart();else updateCartCount()});