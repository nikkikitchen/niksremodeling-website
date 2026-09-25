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
function header(){return `<div class="topline"><div class="wrap"><div>Office: ${SITE.phone} &nbsp; • &nbsp; Text/Personal: ${SITE.text}</div><div>SUPPLY. PLAN. BUILD. TOGETHER.</div></div></div><div class="wrap brandbar"><a class="logo" href="/"><img class="brand-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK8AAADJCAYAAABVP2IyAAAFnUlEQVR4nO3dW04bWxRF0e2IRtERusMH3aEj9Mr5SEgcp8BVdV57rT2HdD+uFAlTNb04PH25Xq8BKPqx+gEAZxEvZBEvZBEvZBEvZBEvZBEvZBEvZBEvZBEvZBEvZBEvZD2tfgAuXl+e//x43tv7x2XlY6mC5e3gNtyt/8cYxNvoq1AJeLwLP4x+zpE4OUaMwfKecHRVWeExiPegsyEScH8cG3bqFR9HiH5Y3h16riYL3A/L+8DI2FjhNizvN0avJCvchuXdMDsqFvgclvfOijVkgc9heW9kiIgV3o/l/S1DuBF5HoeC8subNRYW+LHSy5s13Ijcjy2LsvEqxKHwGFcqd2xQDYJjxP9KLa9quBHaj32UMvE63HyH96GnEvE63XSn96WV9ZnX+UZzBjaO1zncW5Ujtjw2rAh3VURVnqRb7OJdGS4Bz2VzbMi2ttkejyOLeLOGsmoRq0Qsf2zIGu6Rf9dblWOE7PJmjvYeCzyGZLxK4d5SfdxZyR0blANYEZLzEUJqeZXDvcUxog+JeF2ivef6fs2S/tjgfIM5RrRJHa9zuKveXoRPwGmPDdX+8EeFJ2pv6eKtfhOrv/9HpDo2cOM4RhyRJl7C/YuA91l+bCDa71U7+x+xNF7C3YfrtG3ZsYEbsh/HiG1LlpcPhefwhP/X1Hi5+H3w5P9l2rGBcPuZ/X5lPUJMWV6WYozqgzB8eQl3nOqfyA1b3uqrMFvFkRiyvIQ7X8VzcPflrbgAmVS6/t3iZW1zqRBxl2MD4eZT4RjRvLwVnuHKnO9P0/I6XxgXzgt8ank5JmhyG5vDy0u4utxW+NDyuj1zq3K5j2l+Dege4Y7z9v5xmXl9Rz1ZUsZLuHOoX+dU8c5eBGgHvPwXMIGzUi0vcATxQhbxQhbxQhbxQhbxQhbxQtbTkX886tt8o79QPuJxq70mW6uM38w4FC/q2nrSrQ46xbFBdY2qe315vn7+t+Ltp4g3goDVrYg4TbzwMDPgVPGyvh5m3cdU8UYQsIsZ9zFdvBEE7GL0fUwZL3yMDDhtvKwvHkkbbwQBuyj1C5jAHunjZX3xlfTxRhCwgxH3kB/MMVHtp9wiRJY3QvsiZ6b8tzJk4o0g4JEUA5aKF2OpBSwXL+uLT3LxRhDwSErrKxkvECEcL+sL2XgjCLg66XjRn9IgyMerdLHRl3y8EQTci9p1tIgX7UaHO+JLcDY/mPP68nxV+hrlamoru8Um3ojaAWeOsdzrsAGP2MWbeYEqGvmR0C7eCALOIt0LZwN7zPjcwzZe1nedWZ80p4h31DtLwPPN/GpPingjtH6OFNtm30Orr/NuYX3HWzU8qeJ9e/+4EJuGDB8pU8UbQcCZZQj2VpozL/Jb+eIpW1LGm+0Zjn9liTjdseETx4dj7p/wM67d59tYNTYplxftZv4Zp/Kvw7aF40M754BTxxtBwD24XsP08aKPGQHzCpgbXJfDUdlXwPwOAbdzO//KxAvck4qX9W3ntL5S8UYQcA8u11AuXujgtYc3uCzHSg7XUDLeCI+LX0HJF87GeOoDIB2v+sWvghfO/gIBt1G+fvLxQsOI9bWIV3k9MlD9xoVFvBEEXJFNvGijuL5W8bK+bdSun1W8EXo3oKJe62sXbwQBt1C6dpbxIr8e62sbr9KCZKNy7WzjjdC5CVW1rq91vDhP4YlvH6/CTaisZX0v1yt/Dgya7JcXvogXsogXsogXsogXsogXsogXsogXsg69oAovcIJRznwnlOWFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLOKFLP5KJGSxvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJBFvJD1EyOK9EEV4QolAAAAAElFTkSuQmCC" alt="Nik's Remodeling NR logo"><span><strong>NIK'S REMODELING</strong><em>EVERYTHING UNDER THE ROOF</em></span></a><form class="search" onsubmit="event.preventDefault();alert('Search will show connected inventory as supplier feeds are added.');"><input placeholder="Search products, projects, or ideas…"><button>Search</button></form><div class="actions"><a class="cart-pill" href="/project-cart.html">Project Cart <span class="cart-count">0</span></a><a href="tel:${SITE.phone.replaceAll('-','')}">Account / Call</a></div></div><nav class="nav"><div class="wrap"><a href="/">Home</a><a href="/#projects">Shop by Project</a><a href="/materials.html">Materials</a><a href="/supplies.html">Supplies</a><a href="/tools.html">Tools</a><a href="/furniture.html">Furniture & Accessories</a><a href="/appliances.html">Appliances</a><a href="/cabinets.html">Cabinets</a><a href="/installation.html">Installation & Labor</a><a href="/calculators.html">Calculators</a></div></nav>`}
function footer(){return `<div class="assurance"><div class="wrap"><span>🚚 Delivery / Local Pickup Options</span><span>🛡️ Quality Products</span><span>🏠 Installation Available</span><span>💬 Real Support</span></div></div><footer class="footer"><div class="wrap"><div class="footgrid"><div><h3>Everything under the roof</h3><p>SUPPLY. PLAN. BUILD. TOGETHER.</p><p><strong>From the first idea to the final detail, Nik’s Remodeling brings your project together.</strong></p></div><div><h3>Shop</h3><a href="/materials.html">Materials</a><a href="/supplies.html">Supplies</a><a href="/tools.html">Tools</a><a href="/furniture.html">Furniture</a><a href="/appliances.html">Appliances</a><a href="/cabinets.html">Cabinets</a></div><div><h3>Project</h3><a href="/calculators.html">Calculators</a><a href="/installation.html">Installation & Labor</a><a href="/project-cart.html">Project Cart</a></div><div><h3>Contact</h3><a href="tel:${SITE.phone.replaceAll('-','')}">${SITE.phone}</a><a href="sms:${SITE.text.replaceAll('-','')}">${SITE.text}</a><a href="mailto:${SITE.email}">${SITE.email}</a></div></div><div class="fine">© 2026 Nik's Remodeling. All rights reserved. West Georgia & East Alabama.</div></div></footer>`}

function fallbackProducts(page){
 const names={installation:['Kitchen Installation','Bathroom Installation','Flooring Installation','Interior Painting','Trim & Finish Work','Custom Project Labor','Cabinet Installation','Appliance Installation','Tile Installation','Exterior Work','Deck / Outdoor Work','Project Coordination']}[page]||[];
 return names.map((name,i)=>({name,sku:`NR-${page.slice(0,3).toUpperCase()}-${String(i+1).padStart(2,'0')}`,category:PAGES[page]?.title||page,details:['Scope Review','Project Coordination','Scheduling Available']}));
}
function renderCategory(page){
 const p=PAGES[page],products=PRODUCTS[page]||fallbackProducts(page),imgs=PRODUCT_IMAGES[page]||PRODUCT_IMAGES.installation;
 document.title=`${p.title} | Nik's Remodeling`;
 document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('${p.hero}')"><div class="wrap"><div class="eyebrow">${p.title}</div><h1>${p.heroTitle}</h1><h2>${p.tag}</h2><p>${p.desc}</p><div class="hero-points"><span>✓ Product Photos</span><span>✓ Product Details</span><span>✓ Delivery Options</span><span>✓ Add to Project</span></div></div></section><div class="wrap category-tabs">${p.tabs.map(x=>`<button>${x}</button>`).join('')}</div><section class="section alt"><div class="wrap catalog"><aside class="filters"><h3>Filter Products</h3><label><input type="checkbox"> In Stock / Available</label><label><input type="checkbox"> Delivery Available</label><label><input type="checkbox"> Installation Option</label><label><input type="checkbox"> Custom / Special Order</label><p class="filter-note">Prices are intentionally not displayed so final customer pricing can be set from current supplier cost, freight, and markup.</p></aside><div><div class="catalog-head"><div><h2>${p.title}</h2><p class="lead">Browse products, photos, specifications and availability. Pricing is intentionally omitted.</p></div><select><option>Featured</option><option>Name A–Z</option></select></div><div class="products">${products.map((x,i)=>`<article class="card"><div class="pic"><img src="${imgs[i%imgs.length]}" alt="${x.name}" loading="lazy"></div><div class="body">${x.badge?`<div class="stock">${x.badge}</div>`:''}<h3>${x.name}</h3><div class="stock neutral">SKU: ${x.sku}</div><div class="stock neutral">${x.category}</div><div class="product-details">${x.details.map(d=>`<div>✓ ${d}</div>`).join('')}</div><div class="card-actions"><button class="add-project" onclick="addItem('${x.name.replaceAll("'","\\'")}','Project')">Add to Project</button><button class="add-cart" onclick="addItem('${x.name.replaceAll("'","\\'")}','Cart')">Add to Cart</button></div></div></article>`).join('')}</div></div></div></section></main>`+footer();updateCartCount()
}
function renderCalculators(){document.title='Project Calculators | Nik\'s Remodeling';document.body.innerHTML=header()+`<main><section class="category-hero" style="--hero-image:url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=85')"><div class="wrap"><div class="eyebrow">Plan Your Project</div><h1>Project Calculators</h1><p>Calculate quantities first. Product and labor prices are confirmed from current supplier costs and actual project scope before you commit.</p></div></section><section class="section"><div class="wrap calc-grid"><div class="panel"><h2>Flooring / Tile Quantity</h2><div class="field"><label>Room length (ft)</label><input id="len" type="number" min="0" step="0.1" value="12"></div><div class="field"><label>Room width (ft)</label><input id="wid" type="number" min="0" step="0.1" value="10"></div><div class="field"><label>Waste allowance</label><select id="waste"><option value="1.1">10%</option><option value="1.15" selected>15%</option><option value="1.2">20%</option></select></div><button class="btn primary" onclick="calcMaterial()">Calculate Material</button><div class="result" id="matres">Enter dimensions and calculate.</div></div><div class="panel"><h2>Installation / Labor</h2><p>Labor depends on site conditions, removal, prep, layout, access and finish details. To protect you and Nik’s Remodeling from an inaccurate online number, final labor is priced only after the scope is verified.</p><div class="btns"><a class="btn primary" href="tel:${SITE.phone.replaceAll('-','')}">Call for Scope Review</a><a class="btn outline" href="sms:${SITE.text.replaceAll('-','')}">Text Project Details</a></div><div class="result">No unverified labor rate is published here.</div></div></div></section></main>`+footer();updateCartCount()}
function calcMaterial(){const l=+document.getElementById('len').value||0,w=+document.getElementById('wid').value||0,f=+document.getElementById('waste').value||1;if(l<=0||w<=0){document.getElementById('matres').textContent='Enter valid room dimensions.';return}const base=l*w,total=base*f;document.getElementById('matres').textContent=`Base area: ${Math.ceil(base)} sq. ft. Plan for approximately ${Math.ceil(total)} sq. ft. including waste.`}
function renderCart(){const c=getCart();document.title='Project Cart | Nik\'s Remodeling';document.body.innerHTML=header()+`<main><section class="section"><div class="wrap"><h2>Your Project Cart</h2><p class="lead">Save products and project items here. Pricing, supplier availability, freight and any installation are confirmed before the order is accepted.</p><div class="panel"><div class="cart-list">${c.length?c.map((x,i)=>`<div class="cart-item"><div><strong>${x.name}</strong><div>${x.type||'Project'} item · Qty ${x.qty||1}</div></div><div class="cart-current">Current price to be confirmed</div><button class="btn outline" onclick="removeCart(${i})">Remove</button></div>`).join(''):'<div class="empty">Your project cart is empty. Browse products and add items when you are ready.</div>'}</div>${c.length?`<div class="result">Nothing is charged from this page. Review current product pricing and availability with Nik’s Remodeling before purchase.</div><div class="btns"><a class="btn primary" href="tel:${SITE.phone.replaceAll('-','')}">Call to Review Project</a><a class="btn outline" href="sms:${SITE.text.replaceAll('-','')}">Text Project Cart</a><a class="btn outline" href="/">Continue Shopping</a></div>`:''}</div></div></section></main>`+footer();updateCartCount()}
function removeCart(i){const c=getCart();c.splice(i,1);saveCart(c);renderCart()}
document.addEventListener('DOMContentLoaded',()=>{const page=document.body.dataset.page;if(PAGES[page])renderCategory(page);else if(page==='calculators')renderCalculators();else if(page==='cart')renderCart();else updateCartCount()});