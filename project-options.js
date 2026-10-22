(() => {
  const work = (title, kind, materials) => ({title, kind, materials});
  const options = window.PROJECT_WORK_OPTIONS = {
    'accent-stone':work('Stacked Stone & Brick','custom',['Stacked Stone','Natural Stone Veneer','Manufactured Stone Veneer','Thin Brick','Faux Stone Panels']),
    'accent-wood':work('Wood Walls','custom',['Shiplap','Wood Veneer','Tongue & Groove','Reclaimed Wood','Wood Slat Panels','Fluted Wood Panels','Board & Batten','Beadboard','Wainscoting','Geometric Wood Panels']),
    'accent-tile':work('Decorative Tile & Slabs','custom',['Ceramic Wall Tile','Porcelain Wall Tile','Mosaic Wall Tile','Large Format Wall Tile','Porcelain Slabs','Stone Slabs']),
    'accent-texture':work('Decorative Finishes','custom',['Venetian Plaster','Limewash','Textured Plaster','Concrete Look Finish','Metallic Finish','Decorative 3D Wall Panels']),
    'accent-design':work('Custom Wall Designs','custom',['Waterfall Effect','Custom Wall Design']),
    ceiling:work('Ceiling','paint',['Interior Paint','Primer','Drywall Panels']),
    walls:work('Walls','paint',['Interior Paint','Primer','Drywall Panels','Wall Panels','Porcelain Tile','Backer Board']),
    floor:work('Floor','flooring',['Luxury Vinyl Plank (LVP)','Floor Tile','Underlayment','Backer Board']),
    tub:work('Tub','custom',['Bathtub','Tub Faucet','Tub Drain']),
    shower:work('Shower','tile',['Porcelain Tile','Backer Board','Waterproofing Membrane','Shower Base','Shower Valve / Head','Shower Glass']),
    'tub-shower':work('Tub / Shower Combination','tile',['Bathtub','Tub / Shower Surround','Porcelain Tile','Backer Board','Waterproofing Membrane','Tub / Shower Valve']),
    toilet:work('Toilet','custom',['Toilet','Toilet Seat','Toilet Supply Line']),
    vanity:work('Vanity / Vanities','custom',['Single Vanity','Double Vanity','Vanity Top','Sink','Faucet','Hardware']),
    mirror:work('Mirror / Mirrors','custom',['Mirror','Medicine Cabinet']),
    lighting:work('Lighting','custom',['Ceiling Light','Pendant Light','Recessed Light','Track Light','Wall Sconce','Dimmer / Switch']),
    accents:work('Accents & Accessories','custom',['Towel Bars','Shelves','Grab Bars','Trim','Decorative Wall Panels']),
    refinish:work('Cabinet / Vanity Refinishing','refinish',CABINET_MATERIALS.filter(name=>name!=='Other material')),
    prep:work('Prep / Repairs','prep',[]),
    ventilation:work('Ventilation','custom',['Exhaust Fan','Vent Duct','Exterior Vent Cap']),
    cabinets:work('Cabinets','custom',['Base Cabinets','Wall Cabinets','Pantry Cabinets','Hardware']),
    countertops:work('Countertops','custom',['Countertop Surface','Backsplash','Sink']),
    backsplash:work('Backsplash','tile',['Porcelain Tile','Mosaic Tile','Backer Board']),
    appliances:work('Appliances','custom',['Refrigerator','Range','Dishwasher','Microwave','Range Hood']),
    plumbing:work('Sink & Faucet','custom',['Sink','Faucet','Disposal']),
    trim:work('Trim & Carpentry','trim',['Baseboards','Crown Molding','Door & Window Casing','Decorative Trim']),
    doors:work('Doors & Windows','custom',['Interior Door','Exterior Door','Window','Threshold']),
    framing:work('Framing','lumber',['Framing Lumber','Plywood','Pressure Treated Lumber']),
    concrete:work('Concrete','concrete',['Concrete Mix','Gravel Base','Form Boards','Reinforcement']),
    wallpaper:work('Wallpaper','custom',['Wallpaper','Wallcovering Primer','Wallpaper Adhesive']),
    stairs:work('Stairs & Railings','custom',['Stair Treads','Risers','Handrail','Balusters','Newel Posts']),
    fireplace:work('Fireplace Surround & Mantel','custom',['Stone Veneer','Hearth Surface','Mantel','Suitable Backer Material']),
    other:work('Other Work','custom',['Other material'])
  };
  Object.assign(options,window.ROOM_WORK_OPTIONS||{});
  // Interior and exterior lead to different work lists, not duplicate steps.
  Object.assign(options,{
    'fireplace-outdoor':work('Outdoor Fireplaces & Fire Pits','custom',['Outdoor Fireplace Surround','Fire Pit Surround','Outdoor Hearth','Fire-Rated Stone / Masonry','Outdoor Mantel / Shelf']),
    'access-interior':work('Indoor Accessibility','custom',['Shower Grab Bars','Bathroom Grab Bars','Indoor Handrails','Accessible Door Hardware','Interior Threshold Transition','Doorway Widening Assessment']),
    'access-exterior':work('Exterior Accessibility','custom',['Entry Ramp Planning','Exterior Handrails','Accessible Walkway Planning','Entry Landing Assessment','Exterior Threshold Transition']),
    // Accessibility is organized by actual access improvements, not unrelated
    // general trade catalogs like Flooring, Lighting or Doors & Windows.
    'access-bath':work('Accessible Bath & Shower','custom',['Shower Grab Bars','Low-Threshold Shower Assessment','Walk-In Shower Accessibility','Shower Seat','Handheld Shower Access','Tub-to-Shower Conversion Assessment']),
    'access-grab-bars':work('Grab Bars & Support Rails','custom',['Shower Grab Bars','Toilet Grab Bars','Reinforced Grab Bar Mounting','Support Rails']),
    'access-indoor-rails':work('Indoor Handrails & Stair Access','custom',['Hallway Handrails','Stair Handrails','Continuous Handrails','Stair Access Assessment']),
    'access-doorways':work('Accessible Doorways & Hardware','custom',['Doorway Widening Assessment','Accessible Lever Handles','Door Swing & Clearance Improvements','Pocket / Sliding Door Assessment']),
    'access-thresholds':work('Interior Thresholds & Transitions','custom',['Low-Profile Threshold','Wheelchair-Friendly Floor Transition','Raised Threshold Removal','Smooth Room-to-Room Access']),
    'access-controls':work('Easy-Reach Controls','custom',['Easy-Reach Switch Assessment','Accessible Door Controls','Motion-Activated Lighting Controls','Accessible Thermostat Placement']),
    'access-ramps':work('Entry Ramps & Landings','custom',['Entry Ramp Assessment','Wheelchair Ramp Planning','Ramp Handrails','Ramp Landing','Ramp Surface & Traction']),
    'access-outdoor-rails':work('Outdoor Handrails & Steps','custom',['Entry Handrails','Porch Handrails','Outdoor Step Handrails','Safer Entry-Step Assessment']),
    'access-walkways':work('Accessible Walkways','custom',['Accessible Walkway Planning','Even Walking Surface','Slip-Resistant Walkway','Pathway Clearance']),
    'access-entry':work('Exterior Door Access','custom',['Accessible Entry Threshold','Landing & Doorway Clearance','Low-Profile Weatherproof Threshold','Accessible Entry Assessment']),
    'access-other':work('Other Accessibility Improvements','custom',['Home Access Assessment','Safer Mobility Improvement','Other Accessible Feature']),
    'outdoor-accent':work('Outdoor Accent Walls','custom',['Exterior-Grade Shiplap','Exterior Stone Veneer','Weather-Resistant Wall Cladding','Exterior Decorative Panels','Exterior-Grade Wood Accents']),
    'outdoor-floor':work('Outdoor Flooring','custom',['Porch Flooring','Deck Surface Boards','Exterior Floor Tile','Exterior-Grade Floor Finish']),
    'outdoor-tile':work('Outdoor Tile & Stone','custom',['Exterior Porcelain Tile','Slip-Resistant Outdoor Tile','Stone Pavers','Exterior Stone Veneer']),
    'outdoor-stairs':work('Outdoor Stairs & Railings','custom',['Exterior Stair Treads','Outdoor Handrails','Deck Stairs','Exterior Balusters','Stair Landing Assessment']),
    'outdoor-lighting':work('Outdoor Lighting','custom',['Exterior Wall Lights','Security Lighting','Landscape Lighting','Path Lights','Weather-Rated Ceiling Fans']),
    'outdoor-arches':work('Exterior Arches & Columns','custom',['Outdoor Arch Trim','Exterior Columns','Weather-Resistant Decorative Millwork']),
    'outdoor-murals':work('Exterior Murals & Finishes','custom',['Exterior Mural','Outdoor Decorative Finish','Weather-Resistant Coating']),
    'theater-interior':work('Indoor Theater Setup','custom',['Indoor Media Setup','Acoustic Wall Panels','Movie Seating Layout','Indoor Projector Mount']),
    'theater-exterior':work('Outdoor & Mobile Theater','custom',['Outdoor Projector Screen','Weather-Rated Speakers','Portable Theater Setup','Outdoor TV Mount']),
    'other-interior':work('Other Indoor Work','custom',['Indoor Repair','Interior Upgrade','Indoor Installation','Other material']),
    'other-exterior':work('Other Outdoor Work','custom',['Outdoor Repair','Exterior Upgrade','Outdoor Installation','Other material'])
  });
  // Feature-specific projects show only the work that belongs to them.
  // All selections remain quote requests until item and site conditions are verified.
  Object.assign(options,{
    'pet-floor':work("Pet-Friendly Floors",'custom',["Water-Resistant Pet Flooring","Slip-Resistant Floor Finish","Easy-Clean Floor Upgrade","Floor Transition for Pet Door"]),
    'pet-wash':work("Pet Washing Connections",'custom',["Pet Wash Water Supply","Pet Wash Drain","Pet-Friendly Wash Fixture","Splash Protection"]),
    'pet-storage':work("Pet Storage & Feeding",'custom',["Feeding Cabinet","Food Storage","Leash & Toy Storage","Built-In Pet Bed"]),
    'pet-walls':work("Pet-Safe Surfaces",'custom',["Washable Wall Finish","Scratch-Resistant Wall Protection","Pet-Safe Trim"]),
    'outdoor-counters':work("Outdoor Kitchen Counters",'custom',["Weather-Resistant Countertop","Outdoor Prep Counter","Outdoor Serving Counter"]),
    'outdoor-sink':work("Outdoor Kitchen Plumbing",'custom',["Outdoor Sink Connection Assessment","Water Supply Planning","Drainage Planning"]),
    'outdoor-storage':work("Outdoor Kitchen Storage",'custom',["Weather-Resistant Base Cabinets","Grill Storage","Outdoor Shelving"]),
    'outdoor-kitchen-power':work("Outdoor Kitchen Lighting & Power",'custom',["Weather-Rated Task Lighting","Outdoor Outlet Planning","Grill Station Electrical Planning"]),
    'shop-floor':work("Workshop Floors",'custom',["Durable Shop Floor","Anti-Slip Surface","Floor Coating"]),
    'shop-storage':work("Workshop Storage",'custom',["Tool Wall","Tool Cabinets","Parts Storage","Workbench Storage"]),
    'shop-utilities':work("Workshop Power & Ventilation",'custom',["Shop Lighting","Tool Outlet Planning","Workshop Ventilation"]),
    'wash-floor':work("Wash Area Surface & Drainage",'custom',["Wash Bay Surface","Slip-Resistant Wash Floor","Drainage Assessment"]),
    'wash-water':work("Water & Hose Connections",'custom',["Hose Bib","Hose Reel Connection","Pressure Washer Supply","Water Management Assessment"]),
    'wash-storage':work("Wash & Detailing Storage",'custom',["Detailing Supply Shelves","Wash Equipment Cabinet","Vacuum Station Storage"]),
    'scrap-platform':work("Sorting Pad & Ground Surface",'custom',["Stable Recycling Pad","Bin Station Base","Scrap Area Surface"]),
    'scrap-cover':work("Covered Scrap Storage",'custom',["Covered Sorting Shelter","Scrap Racks","Weather Protection"]),
    'vault-door':work("Secure Door Planning",'custom',["Security Door Assessment","Reinforced Doorframe Assessment","Secure Access Hardware"]),
    'vault-storage':work("Safe & Secure Storage",'custom',["Safe Placement Planning","Secure Cabinets","Concealed Storage"]),
    'vault-services':work("Secure Room Utilities",'custom',["Ventilation Assessment","Safe Room Lighting","Access Control Planning"]),
    'snack-counters':work("Snack Counter & Serving Area",'custom',["Snack Counter","Beverage Prep Surface","Bread Box Counter"]),
    'snack-storage':work("Snack & Coffee Storage",'custom',["Mug Cabinet","Coffee Supply Storage","Snack Cabinet"]),
    'snack-sink':work("Beverage Station Connections",'custom',["Coffee Station Water Connection","Small Sink Assessment","Drainage Assessment"]),
    'snack-light':work("Coffee Bar Lighting",'custom',["Under-Cabinet Lighting","Beverage Counter Lighting"]),
    'pool-deck':work("Pool Deck & Surround",'custom',["Pool Deck Planning","Deck Around Existing Pool","Poolside Walkway","Pool Equipment Platform"]),
    'pool-access':work("Pool Steps, Railings & Safety",'custom',["Pool Entry Steps Assessment","Deck Handrails","Slip-Resistant Pool Access","Safety Gate Planning"]),
    'pool-storage':work("Pool Equipment & Storage",'custom',["Pool Equipment Cover","Weather-Resistant Storage","Poolside Utility Area"]),
    'waiting-access':work("Bus Stop Access & Path",'custom',["Walkway to Pickup Area","Safe Waiting Surface","Accessible Waiting Approach"]),
    'waiting-shelter':work("Waiting Shelter & Seating",'custom',["Covered Shelter","Bench Installation","Weather Screen","Shade & Rain Protection"]),
    'waiting-light':work("Waiting Area Lighting",'custom',["Weather-Rated Shelter Light","Safe Path Lighting","Lighting Placement Assessment"]),
    'mailbox-base':work("Mailbox Posts & Bases",'custom',["Post-Mounted Mailbox","Mailbox Post Replacement","Masonry Mailbox Base","Stable Mailbox Footing"]),
    'mailbox-parcels':work("Parcel Delivery Options",'custom',["Locking Parcel Box","Package Drop Station","Multiple-Mailbox Unit","Address Sign"]),
    'garden-beds':work("Garden Beds & Paths",'custom',["Raised Garden Bed","Garden Path","Potting Area"]),
    'garden-shelter':work("Greenhouse & Tool Storage",'custom',["Greenhouse Kit","Garden Tool Shed","Covered Potting Bench"]),
    'garden-water':work("Garden Water Planning",'custom',["Garden Hose Station","Irrigation Access Assessment","Rainwater Collection Planning"]),
    'fit-floor':work("Exercise Room Floors",'custom',["Rubber Gym Flooring","Exercise Mat Area","Low-Impact Floor Surface"]),
    'fit-mirror':work("Fitness Mirrors & Storage",'custom',["Wall Gym Mirrors","Equipment Rack","Towel & Accessory Storage"]),
    'hobby-work':work("Craft & Hobby Workstations",'custom',["Craft Table","Sewing Station","Model Workbench"]),
    'hobby-display':work("Hobby Storage & Display",'custom',["Display Shelves","Game Storage","Organizing Cabinets"]),
    'sound-install':work("Outdoor Audio Installation",'custom',["Weather-Rated Speaker Mounting","Concealed Cable Path Assessment","Outdoor Audio Control Location"]),
    'sound-power':work("Outdoor Entertainment Power",'custom',["Weather-Rated Outlet Assessment","Outdoor Lighting Planning","Outdoor TV / Projector Power Planning"]),
    'retreat-surface':work("Backyard Seating & Paths",'custom',["Outdoor Seating Area","Patio Connection","Walkway","Outdoor Surface"]),
    'retreat-privacy':work("Outdoor Privacy & Shade",'custom',["Privacy Screen","Shade Structure","Pergola Details"]),
    'retreat-light':work("Backyard Lighting",'custom',["Weather-Rated Accent Lighting","Path Lighting","Pergola Lighting"])
  });
  // Keep the same feature from appearing under several cards on a page.
  Object.entries({"pool-options":["Above-ground Pool — Without Deck","Above-ground Pool — With Deck","Pool-company Project Coordination"],"secure-room":["Vault Room Planning","Safe Room Assessment","Safe Installation Planning"],"outdoor-cooking":["Built-in Outdoor Kitchen","Mobile / Rolling Outdoor Kitchen","Grill Station","Pizza Oven Station"],"workshop":["Workbench","Air Hose Storage","Vehicle Lift Planning"],"car-wash":["Wash Bay","Pressure Washer Station","Detailing Bench","Vacuum Station"],"snack-station":["Bread Box","Coffee / Barista Station","Espresso Machine Station","Popcorn Station"],"recycling":["Recycling Bin Station","Scrap Metal Racks","Reusable Material Storage"]}).forEach(([key,names])=>{if(options[key])options[key].materials=names;});
  // Outside work is not the same as indoor carpentry, doors or lighting.
  Object.assign(options,{
    'exterior-doors':work("Exterior Doors & Windows",'custom',["Exterior Door Installation","Exterior Door Weatherstripping","Window Trim Repair","Exterior Threshold","Exterior Doorframe Repair"]),
    'exterior-trim':work("Exterior Trim & Siding Details",'custom',["Fascia & Soffit Work","Exterior Trim Board","Weather-Resistant Decorative Trim","Siding Transition"]),
    'exterior-framing':work("Exterior Framing & Supports",'custom',["Weather-Resistant Framing","Porch Support Assessment","Exterior Blocking & Bracing","Outdoor Wood Repairs"]),
    'deck-frame':work("Deck Framing & Structure",'custom',["Deck Joists & Framing","Deck Posts","Deck Substructure Assessment","Ledger & Attachment Assessment"]),
    'deck-stairs':work("Deck Steps & Landings",'custom',["Deck Stair Treads","Deck Risers","Outdoor Landing","Stair Grip & Surface"]),
    'deck-rails':work("Deck Railings & Posts",'custom',["Deck Handrail","Deck Railing Balusters","Newel & Corner Posts","Guardrail Assessment"])
  });
  // The catalog, project cards and calculator read the same material lists.
  const shared=window.WORK_MATERIAL_OPTIONS={};
  for(const [kind,slug] of Object.entries(WORK_MATERIAL_CATEGORIES))shared[kind]=[...MATERIAL_DETAIL_PAGES[slug].items];
  shared.refinish=CABINET_MATERIALS.slice();
  Object.values(options).forEach(option=>{
    if(shared[option.kind])shared[option.kind]=[...new Set([...shared[option.kind],...option.materials])];
  });
  // Wall projects include tile and boards; those are not paint products.
  shared.paint=[...MATERIAL_DETAIL_PAGES['paint-finishes'].items];
  ['flooring','tile'].forEach(kind=>{shared[kind]=[...new Set([...shared[kind],'Underlayment','Backer Board'])]});
  Object.values(options).forEach(option=>{if(shared[option.kind])option.materials=shared[option.kind].filter(name=>name!=='Other material')});
  // Finish selections stay separate from structural and preparation products.
  ['ceiling','walls'].forEach(key=>options[key].materials=['Interior Paint','Exterior Paint','Wallpaper','Wall Panels','Specialty Coatings']);
  // Shared material categories may list many products; work cards must only list the selected job's relevant finishes.
  // Installation-only consumables are included through automatic supply planning, not customer checkboxes.
  options.floor.materials=options.floor.materials.filter(name=>!/^(Underlayment|Backer Board|Grout & Setting Materials)$/i.test(name));
  options.shower.materials=['Ceramic Tile','Porcelain Tile','Natural Stone','Mosaic Tile','Shower Base','Shower Valve / Head','Shower Glass'];
  options.backsplash.materials=['Backsplash Tile','Ceramic Tile','Glass Tile','Mosaic Tile','Natural Stone','Porcelain Tile'];
  // Shopping categories overlap by use without changing project-specific work choices.
  const shopping=window.SHOP_MATERIAL_OPTIONS=Object.fromEntries(Object.entries(shared).map(([kind,names])=>[kind,[...names]]));
  const crossList=(names,kinds)=>kinds.forEach(kind=>shopping[kind]=[...new Set([...(shopping[kind]||[]),...names])]);
  crossList(['Ceramic Tile','Porcelain Tile','Natural Stone','Mosaic Tile'],['flooring','tile','paint']);
  crossList(['Backsplash Tile','Glass Tile','Stone Veneer',...options['accent-stone'].materials,...options['accent-tile'].materials],['tile','paint']);
  crossList(options['accent-wood'].materials,['lumber','trim','paint']);
  crossList(['Exterior-Grade Shiplap'],['siding-exterior','lumber','paint']);
  crossList(['Wall Panels','Decorative Wall Panels','Decorative 3D Wall Panels'],['lumber','paint']);
  crossList(['Limewash','Venetian Plaster','Textured Plaster','Concrete Look Finish','Metallic Finish','Wallpaper'],['paint']);
  // Construction materials remain available under relevant wall and tile projects, not the paint shop.
  shopping.paint=[...MATERIAL_DETAIL_PAGES['paint-finishes'].items];
  crossList(['Baseboards','Crown Molding','Decorative Trim'],['lumber','trim']);
  shared.bathroom=window.BATHROOM_PACKAGES.map(p=>p.label);
  const bathWork=(title,ids)=>work(title,'bathroom',window.BATHROOM_PACKAGES.filter(p=>ids.includes(p.id)).map(p=>p.label));
  options.toilet=bathWork('Toilets',['toilet-install','smart-toilet-install','toilet-tank-repair','toilet-wax-ring','toilet-flange','toilet-remove']);
  options['faucet-service']=bathWork('Vanity Faucet Replacement',['faucet-replace']);
  options.plumbing=work('Sink & Plumbing','custom',['Sink','Disposal']);
  options.vanity=bathWork('Vanity, Sink & Faucet',['vanity-install','vanity-remove','faucet-replace']);
  options['vanity-light']=bathWork('Vanity Light — Install / Replace',['vanity-light-install','vanity-light-replace']);
  options.tub=bathWork('Bathtub & Surround',['tub-resurface','tub-install','tub-remove','tub-replace','bath-drywall-repair']);
  options['bath-shower-valve']=bathWork('Shower Faucet / Mixing Valve',['shower-valve-install']);
  const scopes={
    'bath-remodel':['ceiling','walls','floor','tub','shower','tub-shower','toilet','vanity','vanity-light','refinish','mirror','lighting','ventilation','accents','prep','other'],
    bathrooms:['ceiling','walls','floor','tub','shower','tub-shower','toilet','vanity','vanity-light','refinish','mirror','lighting','ventilation','accents','prep','other'],
    'kitchen-remodel':['ceiling','walls','floor','cabinets','refinish','countertops','backsplash','appliances','plumbing','lighting','trim','prep','other'],
    tile:['floor','walls','backsplash','shower','prep','other'],
    arches:['framing','trim','walls','prep','other'],stairs:['stairs','trim','refinish','prep','other'],
    murals:['ceiling','walls','refinish','trim','prep','other'],wallpaper:['wallpaper','walls','trim','prep','other'],
    fireplaces:['fireplace','walls','trim','prep','other'],concrete:['concrete','floor','prep','other'],
    flooring:['floor','trim','prep','other'],entryways:['doors','floor','stairs','trim','lighting','prep','other'],
    accents:['accent-stone','accent-wood','accent-tile','accent-texture','accent-design','wallpaper','walls','trim','lighting','prep','other'],lighting:['lighting','ventilation','prep','other'],
    custom:['ceiling','walls','floor','framing','cabinets','refinish','trim','lighting','prep','other']
  };
  Object.assign(scopes,window.ROOM_PROJECT_SCOPES||{});scopes.bathrooms=scopes.bathrooms.filter(k=>k!=='tub-shower');scopes.bathrooms.push('bath-shower-valve');scopes.other=['other'];scopes.accents=scopes.accents.filter(key=>key!=='prep');
  // Limit specialty projects to meaningful tasks; never inherit an unrelated
  // trade-wide list from a generic room or remodeling category.
  Object.assign(scopes,{
  "pet-room": [
    "pet-care",
    "pet-floor",
    "pet-wash",
    "pet-storage",
    "pet-walls",
    "other"
  ],
  "outdoor-kitchen": [
    "outdoor-cooking",
    "outdoor-counters",
    "outdoor-sink",
    "outdoor-storage",
    "outdoor-kitchen-power",
    "other"
  ],
  "mechanic-shop": [
    "workshop",
    "car-wash",
    "shop-floor",
    "shop-storage",
    "shop-utilities",
    "other"
  ],
  "car-wash": [
    "car-wash",
    "wash-floor",
    "wash-water",
    "wash-storage",
    "other"
  ],
  "recycling-scrap": [
    "recycling",
    "scrap-platform",
    "scrap-cover",
    "other"
  ],
  "vault-safe-room": [
    "secure-room",
    "vault-door",
    "vault-storage",
    "vault-services",
    "other"
  ],
  "snack-beverage": [
    "snack-station",
    "beverage",
    "snack-counters",
    "snack-storage",
    "snack-sink",
    "snack-light",
    "other"
  ],
  "pools": [
    "pool-options",
    "pool-deck",
    "pool-access",
    "pool-storage",
    "other"
  ],
  "bus-stop": [
    "waiting-area",
    "waiting-access",
    "waiting-light",
    "other"
  ],
  "mailboxes": [
    "mailbox-options",
    "mailbox-base",
    "other"
  ],
  "garden-greenhouse": [
    "garden-beds",
    "garden-shelter",
    "garden-water",
    "other"
  ],
  "fitness-wellness": [
    "fitness",
    "fit-floor",
    "fit-mirror",
    "other"
  ],
  "games-hobbies": [
    "hobbies",
    "hobby-display",
    "other"
  ],
  "outdoor-sound": [
    "outdoor-media",
    "sound-install",
    "sound-power",
    "other"
  ],
  "backyard-retreat": [
    "retreat",
    "retreat-surface",
    "retreat-privacy",
    "retreat-light",
    "other"
  ]
});
  Object.assign(scopes,{
    'decks-railings':['deck-frame','decking','deck-stairs','deck-rails','other'],
    'exterior-improvements':['exterior','exterior-doors','exterior-trim','exterior-framing','outdoor-lighting','other']
  });
  const locationScopes={
    fireplaces:{interior:['fireplace','walls','trim','prep','other'],exterior:['fireplace-outdoor','outdoor-tile','prep','other']},
    accessibility:{interior:['access-bath','access-grab-bars','access-indoor-rails','access-doorways','access-thresholds','access-controls','access-other'],exterior:['access-ramps','access-outdoor-rails','access-walkways','access-entry','access-other']},
    accents:{interior:['accent-stone','accent-wood','accent-tile','accent-texture','accent-design','wallpaper','walls','trim','lighting','other'],exterior:['outdoor-accent','outdoor-tile','other']},
    tile:{interior:['floor','walls','backsplash','shower','prep','other'],exterior:['outdoor-tile','concrete','prep','other']},
    flooring:{interior:['floor','trim','prep','other'],exterior:['outdoor-floor','concrete','prep','other']},
    stairs:{interior:['stairs','trim','refinish','prep','other'],exterior:['outdoor-stairs','prep','other']},
    lighting:{interior:['lighting','ventilation','prep','other'],exterior:['outdoor-lighting','prep','other']},
    arches:{interior:['framing','trim','walls','prep','other'],exterior:['outdoor-arches','prep','other']},
    murals:{interior:['ceiling','walls','refinish','trim','prep','other'],exterior:['outdoor-murals','prep','other']},
    'home-theater':{interior:['theater-interior','walls','floor','acoustics','media-furniture','beverage','lighting','snack-station','other'],exterior:['theater-exterior','outdoor-media','outdoor-furniture','outdoor-lighting','other']},
    other:{interior:['other-interior','prep'],exterior:['other-exterior','prep']}
  };
  Object.entries(locationScopes).forEach(([project,places])=>{scopes[project]=[...new Set([...places.interior,...places.exterior])];});
  // Only bathrooms offer a vanity-faucet replacement. Adding that service to
  // every project containing plumbing incorrectly polluted pet and outdoor kitchens.
  if(!scopes.bathrooms.includes('faucet-service'))scopes.bathrooms.push('faucet-service');
  window.materialSupplyList=(name)=>{
    if(/knob|pull|hinge|hardware/i.test(name))return ['Correct-size mounting screws','Compatible mounting plates if required','Hole repair / filler supplies if required'];
    if(/backer|drywall|wall panels?/i.test(name))return ['Compatible board fasteners','Joint / seam tape','Compatible joint or seam compound','Surface protection'];
    if(/waterproof|membrane/i.test(name))return ['System-compatible seam tape and corners','Specified sealant','Drain / penetration accessories as required'];
    if(/underlayment/i.test(name))return ['Compatible seam tape','Moisture barrier if required by the flooring system'];
    if(/tile|stone|mosaic/i.test(name))return ['Compatible mortar / adhesive','Grout','Spacers','Edge trim and flexible sealant'];
    if(/paint|primer|stain|finish/i.test(name))return ['Surface cleaner / degreaser','Sandpaper','Masking tape','Surface protection','Compatible brushes / rollers'];
    if(/floor|vinyl|laminate|hardwood|carpet/i.test(name))return ['Installation supplies matched to selected flooring method','Expansion spacers if required','Transition strips','Compatible perimeter trim'];
    if(/toilet/i.test(name))return ['Compatible toilet seal','Mounting bolts','Supply connection parts as required'];
    if(/tub|shower|sink|faucet|drain|disposal/i.test(name))return ['Model-compatible plumbing connections','Compatible drain parts','Mounting hardware','Suitable sealant'];
    if(/light|switch|fan|duct|vent/i.test(name))return ['Model-compatible mounting hardware','Approved connection parts','Compatible controls / trim as required'];
    if(/vanity|cabinet|mirror|shel|grab|towel/i.test(name))return ['Suitable mounting hardware / anchors','Shims if required','Compatible sealant / filler'];
    if(/wallpaper/i.test(name))return ['Compatible wallcovering adhesive if required','Wall preparation supplies','Smoothing / trimming supplies'];
    if(/trim|lumber|tread|riser|rail|baluster|newel/i.test(name))return ['Compatible fasteners','Specified adhesive if required','Filler','Caulk / finish as required'];
    return ['Product-compatible fasteners / connections','Surface protection','Installation accessories to confirm with the selected product'];
  };
  window.renderProjectOptions=(id,project)=>{
    if(id==='custom'&&!new URLSearchParams(location.search).has('customWork')){window.renderCustomProjects();return;}
    if(id==='themed-rooms'){window.renderThemedRooms();return;}
    if(id==='concrete'&&!new URLSearchParams(location.search).has('outdoorWork')){window.renderOutdoorProjects();return;}
    if(isCustomLabel(project.title)){renderCustomQuotePage(project.title);return;}
    const room=id==='bath-remodel'||id==='bathrooms'?'Bathroom':id==='kitchen-remodel'?'Kitchen':id==='accents'?'Accent wall':project.title;
    document.body.innerHTML=header()+`<main><section class="project-detail-hero"><img src="${project.image}" alt="${escapeCartText(project.title)}" class="project-detail-photo"><div class="wrap"><a class="project-back" href="/#projects">← All Projects</a><h1>${escapeCartText(project.title)}</h1><p>Choose the work you want done. We'll ask for measurements only when that item needs them.</p></div></section><section class="section"><div class="wrap"><div class="panel project-measurement-start"><h2>Where is the work?</h2><div class="project-measurement-grid"><div class="field"><label for="scope-room">Room / area</label><select id="scope-room" required><option value="">Select one</option><option>Bathroom</option><option>Bedroom</option><option>Closet / Storage</option><option>Dining Room</option><option>Entry / Mudroom</option><option>Hallway</option><option>Home Office</option><option>Kitchen</option><option>Laundry / Utility</option><option>Living / Family Room</option><option>Outdoor Area</option><option>Other Room / Area</option></select></div><div class="field"><label for="scope-location">Location</label><select id="scope-location" required><option value="">Select one</option><option value="interior">Interior</option><option value="exterior">Exterior</option></select></div><div class="field"><label for="scope-length">Length (ft, optional)</label><input id="scope-length" type="number" min="0" step="1" value="0"></div><div class="field"><label for="scope-width">Width (ft, optional)</label><input id="scope-width" type="number" min="0" step="1" value="0"></div><div class="field"><label for="scope-height">Height (ft, optional)</label><input id="scope-height" type="number" min="0" step="1" value="0"></div></div></div><h2 class="project-section-title">Choose your work</h2><div class="shop-guide-grid" id="project-work-grid"></div><p class="calc-note">Choose your work, calculate your estimate, and review your cart.</p><a class="btn outline" href="/project-cart.html">Review Project Cart</a></div></section></main>`+footer();
    if(project.exterior||project.outdoorGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=concrete';back.textContent='← Outdoor Projects';}
    if(project.themedGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=themed-rooms';back.textContent='← Themed Rooms';}
    if(project.customGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=custom';back.textContent='← More Ideas';}
    // Kitchens holds cabinet planning plus a route to the actual cabinet catalog.
    if(id==='kitchen-pantry' || id==='kitchen-remodel'){
      const title=document.querySelector('.project-section-title');
      if(title){
        const shopCabinets=document.createElement('a');
        shopCabinets.href='/cabinets.html';
        shopCabinets.className='btn outline';
        shopCabinets.textContent='Shop Cabinets';
        shopCabinets.style.cssText='display:inline-flex;margin:0 0 18px';
        title.after(shopCabinets);
      }
    }
    const selectedRoom=document.getElementById('scope-room');
    const roomNames={'bathrooms':'Bathroom','bath-remodel':'Bathroom','bedroom-guest-room':'Bedroom','kids-room':"Kids' Room",'kitchen-pantry':'Kitchen','kitchen-remodel':'Kitchen','closets-storage':'Closet / Storage','dining-room':'Dining Room','entry-mudroom':'Entry / Mudroom','home-office':'Home Office','home-theater':'Home Theater','music-creative-studio':'Music / Creative Studio','entryways':'Entry / Mudroom','laundry-utility':'Laundry / Utility','living-family-room':'Living / Family Room'};
    const chosenRoom=roomNames[id]||(project.exterior?'Outdoor Area':project.title);
    if(chosenRoom){
      if(![...selectedRoom.options].some(option=>option.value===chosenRoom))selectedRoom.add(new Option(chosenRoom,chosenRoom));
      selectedRoom.value=chosenRoom;
      selectedRoom.closest('.field').style.display='none';
    }
    const fixedLocation=project.exterior||['attic','basement','garage','bathrooms','bath-remodel','bedroom-guest-room','kids-room','closets-storage','dining-room','entry-mudroom','home-office','kitchen-pantry','kitchen-remodel','laundry-utility','living-family-room','music-creative-studio','pet-room','mechanic-shop','vault-safe-room','snack-beverage','fitness-wellness','games-hobbies','wallpaper'].includes(id);
    const locationFromLink=new URLSearchParams(location.search).get('location');
    document.getElementById('scope-location').value=fixedLocation?(project.exterior?'exterior':'interior'):(['interior','exterior'].includes(locationFromLink)?locationFromLink:'');
    if(fixedLocation)document.getElementById('scope-location').closest('.field').hidden=true;
    const measurementPanel=document.querySelector('.project-measurement-start');
    // Ask for dimensions in the selected work calculator, not for the whole room.
    // Keep empty inputs for the existing handoff without sending unrelated sizes.
    ['length','width','height'].forEach(key=>{
      const input=document.getElementById('scope-'+key);
      input.value='';input.closest('.field').hidden=true;
    });
    const workTitle=document.querySelector('.project-section-title');
    const workGrid=document.getElementById('project-work-grid');
    const workNote=workGrid.nextElementSibling;
    const cartLink=workNote.nextElementSibling;
    cartLink.remove();
    workNote.textContent='Choose a section to continue.';
    const steps=document.createElement('nav');steps.setAttribute('aria-label','Project steps');
    steps.style.cssText='display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px';
    measurementPanel.before(steps);
    const next=document.createElement('button');next.type='button';next.className='btn primary';next.textContent='Next';measurementPanel.append(next);
    const back=document.createElement('button');back.type='button';back.className='btn outline';back.textContent='Back';workNote.after(back);
    const stepButtons=[];
    const setStep=step=>{if(step===1&&!document.getElementById('scope-location').value){document.getElementById('scope-location').reportValidity();return;}if(step===1)filterLocationMaterials();measurementPanel.hidden=step!==0;workTitle.hidden=workGrid.hidden=workNote.hidden=step!==1;back.hidden=false;stepButtons.forEach((button,index)=>{button.className='btn '+(index===step?'primary':'outline');if(index===step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});};
    ['Location','Choose Work','Review Cart'].forEach((label,index)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.className='btn outline';button.onclick=()=>{if(index===2){location.href='/project-cart.html';return;}setStep(index);};steps.append(button);stepButtons.push(button);});
    next.onclick=()=>{if(!document.getElementById('scope-room').value.trim()){document.getElementById('scope-room').focus();return;}setStep(1)};
    back.onclick=()=>{if(workGrid.hidden){if(history.length>1)history.back();else location.href='/#projects';}else setStep(0);};
    if(!fixedLocation){
      // Choosing indoor or outdoor work is the only required first step.
      // Make the options visual instead of making customers open an empty select.
      const choices=document.createElement('div');choices.className='project-location-photo-choices';
      for(const option of [
        {value:'interior',label:id==='accessibility'?'Indoor Accessibility':'Interior Work',photo:id==='accessibility'?'/assets/idea-accessibility.jpg':'/assets/approved-9bfcb89f7800.jpg'},
        {value:'exterior',label:id==='accessibility'?'Outdoor Accessibility':'Exterior Work',photo:id==='accessibility'?'/assets/entryways-card.jpg':'/assets/approved-a11ab0fcd37f.jpg'}
      ]){
        const button=document.createElement('button');button.type='button';button.className='project-location-photo';
        const image=document.createElement('img');image.src=option.photo;image.alt='';image.loading='lazy';
        const label=document.createElement('strong');label.textContent=option.label;
        button.append(image,label);
        button.onclick=()=>{
          const field=document.getElementById('scope-location');field.value=option.value;
          field.dispatchEvent(new Event('input',{bubbles:true}));
          setStep(1);
        };
        choices.append(button);
      }
      const selector=document.getElementById('scope-location').closest('.field');
      selector.hidden=true;
      next.hidden=true;
      measurementPanel.append(choices);
      const locationStyles=document.createElement('style');
      locationStyles.textContent='.project-location-photo-choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:14px 0}.project-location-photo{border:2px solid #d4dee6;border-radius:12px;padding:0;overflow:hidden;background:#fff;color:#204968;cursor:pointer;box-shadow:0 4px 15px #152a3c1c;text-align:left}.project-location-photo img{width:100%;height:205px;object-fit:cover;display:block}.project-location-photo strong{display:block;padding:14px 18px;font-size:18px}.project-location-photo:hover,.project-location-photo:focus-visible{border-color:#165a9c}@media(max-width:580px){.project-location-photo-choices{grid-template-columns:1fr}.project-location-photo img{height:160px}}';
      document.head.append(locationStyles);
    }
    setStep(0);
    const grid=document.getElementById('project-work-grid');
    // Use existing approved job photographs on every work choice, retaining
    // the accordion controls for material selection and calculator handoff.
    grid.classList.add('project-work-pictures');
    const pictureStyle=document.createElement('style');
    pictureStyle.textContent=`#project-work-grid.project-work-pictures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}#project-work-grid .project-work-card{margin:0;padding:0;overflow:hidden;border-radius:12px;box-shadow:0 5px 18px #20304022}#project-work-grid .project-work-card>summary{display:block;cursor:pointer;list-style:none;padding:0;background:#fff}#project-work-grid .project-work-card>summary::-webkit-details-marker{display:none}#project-work-grid .project-work-card>summary img{display:block;width:100%;height:170px;object-fit:cover}#project-work-grid .project-work-card>summary span{display:block;min-height:52px;padding:11px 14px;font-size:16px;font-weight:800;color:#193e5b}#project-work-grid .project-work-card[open]>summary span{background:#edf5fc}#project-work-grid .project-work-card>:not(summary){margin:10px 14px}#project-work-grid .project-work-card>label{display:block;padding:5px 0}#project-work-grid .project-work-card .service-dropdown{margin-bottom:8px}@media(max-width:900px){#project-work-grid.project-work-pictures{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){#project-work-grid.project-work-pictures{grid-template-columns:1fr}#project-work-grid .project-work-card>summary img{height:185px}}`;
    document.head.append(pictureStyle);
    const workPhotoChoices={
      ceiling:['/assets/approved-0af816f48fb0.jpg'],
      walls:['/assets/accent-walls-card.jpg'],
      floor:['/assets/flooring-card.jpg'],
      trim:['/assets/approved-e9fee5a04016.jpg'],
      doors:['/assets/entryways-card.jpg'],
      lighting:['/assets/lighting-card.jpg'],
      'vanity-light':['/assets/pendant-lighting.jpg'],
      toilet:['/assets/approved-a908c20ce632.jpg'],
      tub:['/assets/tile-shower.jpg'],
      shower:['/assets/showers-card.png'],
      'bath-shower-valve':['/assets/approved-b9cdb9084877.jpg'],
      vanity:['/assets/approved-9bfcb89f7800.jpg'],
      backsplash:['/assets/approved-0ab244a922c8.jpg'],
      cabinets:['/assets/kitchen.jpg'],
      refinish:['/assets/approved-739d17fd2952.jpg'],
      drywall:['/assets/catalog-8.jpg'],
      framing:['/assets/arches-columns.jpg'],
      fireplace:['/assets/fireplace-card.jpg'],
      'fireplace-outdoor':['/assets/idea-backyard-retreat.jpg'],
      stairs:['/assets/stairs-card.jpg'],
      plumbing:['/assets/approved-493d744bf5f7.jpg'],
      storage:['/assets/approved-8a9d216224b8.jpg'],
      furniture:['/assets/approved-4822ff53e23f.jpg'],
      ventilation:['/assets/catalog-9.jpg'],
      appliances:['/assets/approved-26657e8bc7bd.jpg'],
      prep:['/assets/approved-b5c632fcfbc0.jpg'],
      concrete:['/assets/patio-concrete.webp'],
      decking:['/assets/approved-4de99f88049f.jpg'],
      exterior:['/assets/approved-a11ab0fcd37f.jpg'],
      wallpaper:['/assets/wallpaper-card.jpg'],
      murals:['/assets/murals-card.jpg'],
      'outdoor-accent':['/assets/project-stone-real.jpg'],
      'outdoor-tile':['/assets/approved-de82473d9ce3.jpg'],
      'outdoor-lighting':['/assets/idea-outdoor-sound.jpg'],
      'access-interior':['/assets/idea-accessibility.jpg'],
      'access-exterior':['/assets/idea-bus-stop.jpg'],
      'access-bath':['/assets/showers-card.png'],
      'access-grab-bars':['/assets/idea-accessibility.jpg'],
      'access-indoor-rails':['/assets/stairs-card.jpg'],
      'access-doorways':['/assets/entryways-card.jpg'],
      'access-thresholds':['/assets/approved-4de99f88049f.jpg'],
      'access-controls':['/assets/lighting-card.jpg'],
      'access-ramps':['/assets/idea-accessibility.jpg'],
      'access-outdoor-rails':['/assets/approved-94fe00a25a93.jpg'],
      'access-walkways':['/assets/patio-concrete.webp'],
      'access-entry':['/assets/entryways-card.jpg'],
      'access-other':['/assets/custom-projects-card.jpg'],
      'exterior-doors':['/assets/entryways-card.jpg'],
      'exterior-trim':['/assets/approved-4de99f88049f.jpg'],
      'exterior-framing':['/assets/arches-columns.jpg'],
      'deck-frame':['/assets/approved-a11ab0fcd37f.jpg'],
      'deck-stairs':['/assets/stairs-card.jpg'],
      'deck-rails':['/assets/approved-94fe00a25a93.jpg']
    };
    const spareWorkPhotos=['/assets/approved-17df84119d39.jpg','/assets/approved-4cc0340eb1c1.jpg','/assets/approved-6075be404407.jpg','/assets/approved-807c60a6001a.jpg','/assets/approved-a051ee7e1935.jpg','/assets/approved-9753e3ad86f9.jpg','/assets/approved-94fe00a25a93.jpg','/assets/approved-8d4db6742d08.jpg','/assets/idea-mechanic-shop.jpg','/assets/idea-pet-room.jpg','/assets/idea-recycling-scrap.jpg','/assets/idea-mailboxes.jpg','/assets/idea-outdoor-kitchen.jpg','/assets/idea-garden-greenhouse.jpg','/assets/approved-7e5510c3dce7.jpg'];
    const specialtyProjectPhotos={"pet-room":["/assets/idea-pet-room.jpg","/assets/tile-shower.jpg","/assets/flooring-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/approved-0af816f48fb0.jpg","/assets/kids-room.jpg"],"outdoor-kitchen":["/assets/idea-outdoor-kitchen.jpg","/assets/kitchen.jpg","/assets/approved-9bfcb89f7800.jpg","/assets/approved-b9cdb9084877.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/entryways-card.jpg"],"mechanic-shop":["/assets/idea-mechanic-shop.jpg","/assets/idea-car-wash.jpg","/assets/flooring-card.jpg","/assets/approved-d2807423c8f0.jpg","/assets/lighting-card.jpg","/assets/approved-8a9d216224b8.jpg"],"car-wash":["/assets/idea-car-wash.jpg","/assets/patio-concrete.webp","/assets/approved-b9cdb9084877.jpg","/assets/idea-mechanic-shop.jpg","/assets/approved-4de99f88049f.jpg"],"recycling-scrap":["/assets/idea-recycling-scrap.jpg","/assets/concrete-card.jpg","/assets/idea-garden-greenhouse.jpg","/assets/approved-b5c632fcfbc0.jpg"],"vault-safe-room":["/assets/idea-vault-safe-room.jpg","/assets/entryways-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/lighting-card.jpg","/assets/approved-739d17fd2952.jpg"],"snack-beverage":["/assets/idea-snack-beverage.jpg","/assets/approved-b9cdb9084877.jpg","/assets/kitchen.jpg","/assets/approved-9bfcb89f7800.jpg","/assets/lighting-card.jpg","/assets/approved-a051ee7e1935.jpg","/assets/approved-807c60a6001a.jpg"],"pools":["/assets/idea-pools.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/stairs-card.jpg","/assets/idea-backyard-retreat.jpg","/assets/patio-concrete.webp"],"bus-stop":["/assets/idea-bus-stop.jpg","/assets/entryways-card.jpg","/assets/approved-4de99f88049f.jpg","/assets/lighting-card.jpg","/assets/approved-a11ab0fcd37f.jpg"],"mailboxes":["/assets/idea-mailboxes.jpg","/assets/entryways-card.jpg","/assets/approved-4de99f88049f.jpg","/assets/approved-b5c632fcfbc0.jpg"],"garden-greenhouse":["/assets/idea-garden-greenhouse.jpg","/assets/idea-backyard-retreat.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/patio-concrete.webp","/assets/approved-b5c632fcfbc0.jpg"],"fitness-wellness":["/assets/idea-fitness-wellness.jpg","/assets/flooring-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/office.jpg"],"games-hobbies":["/assets/idea-games-hobbies.jpg","/assets/office.jpg","/assets/approved-6075be404407.jpg","/assets/approved-17df84119d39.jpg"],"outdoor-sound":["/assets/idea-outdoor-sound.jpg","/assets/cinema.jpg","/assets/lighting-card.jpg","/assets/idea-backyard-retreat.jpg"],"backyard-retreat":["/assets/idea-backyard-retreat.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/entryways-card.jpg","/assets/lighting-card.jpg","/assets/patio-concrete.webp"]};
    const specificWorkPhotos={"pet-floor":"/assets/flooring-card.jpg","pet-wash":"/assets/tile-shower.jpg","pet-storage":"/assets/approved-8a9d216224b8.jpg","pet-walls":"/assets/approved-0af816f48fb0.jpg","outdoor-counters":"/assets/approved-9bfcb89f7800.jpg","outdoor-sink":"/assets/approved-b9cdb9084877.jpg","outdoor-storage":"/assets/approved-4de99f88049f.jpg","outdoor-kitchen-power":"/assets/lighting-card.jpg","shop-floor":"/assets/flooring-card.jpg","shop-storage":"/assets/approved-d2807423c8f0.jpg","shop-utilities":"/assets/lighting-card.jpg","wash-floor":"/assets/patio-concrete.webp","wash-water":"/assets/approved-b9cdb9084877.jpg","wash-storage":"/assets/idea-mechanic-shop.jpg","scrap-platform":"/assets/concrete-card.jpg","scrap-cover":"/assets/idea-recycling-scrap.jpg","vault-door":"/assets/entryways-card.jpg","vault-storage":"/assets/approved-8a9d216224b8.jpg","vault-services":"/assets/lighting-card.jpg","snack-counters":"/assets/kitchen.jpg","snack-storage":"/assets/approved-9bfcb89f7800.jpg","snack-sink":"/assets/approved-b9cdb9084877.jpg","snack-light":"/assets/pendant-lighting.jpg","pool-deck":"/assets/approved-a11ab0fcd37f.jpg","pool-access":"/assets/stairs-card.jpg","pool-storage":"/assets/idea-pools.jpg","waiting-access":"/assets/patio-concrete.webp","waiting-shelter":"/assets/idea-bus-stop.jpg","waiting-light":"/assets/lighting-card.jpg","mailbox-base":"/assets/idea-mailboxes.jpg","mailbox-parcels":"/assets/idea-mailboxes.jpg","garden-beds":"/assets/idea-garden-greenhouse.jpg","garden-shelter":"/assets/idea-backyard-retreat.jpg","garden-water":"/assets/approved-a11ab0fcd37f.jpg","fit-floor":"/assets/flooring-card.jpg","fit-mirror":"/assets/idea-fitness-wellness.jpg","hobby-work":"/assets/office.jpg","hobby-display":"/assets/approved-6075be404407.jpg","sound-install":"/assets/idea-outdoor-sound.jpg","sound-power":"/assets/lighting-card.jpg","retreat-surface":"/assets/patio-concrete.webp","retreat-privacy":"/assets/idea-backyard-retreat.jpg","retreat-light":"/assets/lighting-card.jpg"};
    const usedWorkPhotos=new Set();
    const workPhoto=key=>{
      // Match each card to its actual job before choosing unrelated project imagery.
      const choices=[...(specificWorkPhotos[key]?[specificWorkPhotos[key]]:[]),...(workPhotoChoices[key]||[]),...(specialtyProjectPhotos[id]||[]),...spareWorkPhotos];
      const chosen=choices.find(url=>!usedWorkPhotos.has(url))||choices[0];
      usedWorkPhotos.add(chosen);return chosen;
    };
    const draftKey='niks-project-options-'+id;
    let draft={};try{draft=JSON.parse(localStorage.getItem(draftKey)||'{}')}catch{}


    function filterLocationMaterials(){const location=document.getElementById('scope-location').value;const allowed=locationScopes[id]?.[location];if(allowed){grid.querySelectorAll('[data-work-key]').forEach(card=>{card.hidden=!allowed.includes(card.dataset.workKey);if(card.hidden){card.open=false;card.querySelectorAll('input[type="checkbox"]:checked').forEach(box=>{box.checked=false;});}});workTitle.textContent=location==='exterior'?'Choose Exterior Work':'Choose Interior Work';}grid.querySelectorAll('.room-supply-choice').forEach(label=>{const input=label.querySelector('input');if(!input)return;const mismatch=location==='interior'?/^Exterior (Paint|Stain|Primer|Finish)\b/i.test(input.value):location==='exterior'?/^Interior (Paint|Stain|Primer|Finish)\b/i.test(input.value):false;label.hidden=mismatch;if(mismatch)input.checked=false;});}
    const saveDraft=()=>{const selected={};grid.querySelectorAll('[data-work-key]').forEach(card=>{selected[card.dataset.workKey]=[...card.querySelectorAll(':scope > label input:checked')].map(x=>x.value)});try{localStorage.setItem(draftKey,JSON.stringify({locationChosen:!!document.getElementById('scope-location').value,room:document.getElementById('scope-room').value,selected,...Object.fromEntries(['scope-location','scope-length','scope-width','scope-height'].map(id=>[id,document.getElementById(id).value]))}))}catch{}};
    ['scope-room','scope-location','scope-length','scope-width','scope-height'].forEach(id=>document.getElementById(id).addEventListener('input',saveDraft));
    (scopes[id]||scopes.custom).forEach(key=>{
      const item=options[key],card=document.createElement('details');card.className='panel project-work-card';card.dataset.workKey=key;card.open=!!draft.selected?.[key]?.length;
      const heading=document.createElement('summary');
      const headingImage=document.createElement('img');headingImage.src=workPhoto(key);headingImage.alt='';headingImage.loading='lazy';
      const headingLabel=document.createElement('span');headingLabel.textContent=id==='accents'&&key==='walls'?'Paint & Wall Repairs':item.title;
      heading.append(headingImage,headingLabel);card.append(heading);
      // Route every Bathroom work section to the appropriate catalog. Verified
      // retail listings show real product variants and prices; material pages
      // are planning guides until specific supplier products are approved.
      const bathroomProductLinks = {
        ceiling: [
          ['Browse Paint & Finishes', '/material-paint-finishes.html', false],
          ['Browse Drywall Materials', '/material-drywall.html', false]
        ],
        walls: [
          ['Browse Wall Paint & Finishes', '/material-paint-finishes.html', false],
          ['Browse Wall Tile & Stone', '/material-tile-stone.html', false],
          ['Browse Drywall Materials', '/material-drywall.html', false]
        ],
        floor: [
          ['Browse Flooring Materials', '/material-flooring.html', false],
          ['Browse Floor Tile & Stone', '/material-tile-stone.html', false]
        ],
        tub: [
          ['Shop Bathtubs & See Prices', '/bathroom.html?type=bathtubs', true],
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true]
        ],
        shower: [
          ['Shop Shower Enclosures', '/bathroom.html?type=showers', true],
          ['Shop Shower Bases', '/bathroom.html?type=showerBases', true],
          ['Shop Shower Doors', '/bathroom.html?type=showerDoors', true],
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true],
          ['Browse Shower Tile & Stone', '/material-tile-stone.html', false]
        ],
        'tub-shower': [
          ['Shop Bathtubs', '/bathroom.html?type=bathtubs', true],
          ['Shop Shower Enclosures', '/bathroom.html?type=showers', true],
          ['Shop Shower Doors', '/bathroom.html?type=showerDoors', true]
        ],
        toilet: [
          ['Explore Toilet Styles', '/bathroom.html?type=toilets', true]
        ],
        vanity: [
          ['Shop Vanities & Sinks', '/bathroom.html?type=vanities', true],
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true]
        ],
        'faucet-service': [
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true]
        ],
        'vanity-light': [
          ['Shop Bathroom Lights', '/bathroom.html?type=lighting', true]
        ],
        mirror: [
          ['Shop Mirrors & Accessories', '/bathroom.html?type=accessories', true]
        ],
        lighting: [
          ['Shop Bathroom Lights', '/bathroom.html?type=lighting', true]
        ],
        ventilation: [
          ['Shop Bathroom Ventilation & Fans', '/bathroom.html?type=ventilation', true]
        ],
        accents: [
          ['Shop Mirrors & Accessories', '/bathroom.html?type=accessories', true],
          ['Browse Trim Materials', '/material-trim-molding.html', false]
        ],
        refinish: [
          ['Browse Refinishing Materials', '/material-paint-finishes.html', false]
        ],
        prep: [
          ['Browse Drywall & Repair Materials', '/material-drywall.html', false],
          ['Browse Paint & Prep Materials', '/material-paint-finishes.html', false]
        ],
        'bath-shower-valve': [
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true]
        ],
        plumbing: [
          ['Shop Bathroom Faucets', '/bathroom.html?type=faucets', true]
        ],
        other: [
          ['Browse Material Categories', '/materials.html', false],
          ['Browse Bathroom Fixtures', '/bathroom.html', true]
        ]
      };
      if(id==='bathrooms'||id==='bath-remodel'){
        const related=bathroomProductLinks[key]||[];
        if(related.length){
          const box=document.createElement('div');
          box.className='project-product-links';
          box.setAttribute('aria-label','Find products for '+item.title);
          const note=document.createElement('p');
          note.className='calc-note';
          note.textContent='Find the specific products for this work:';
          box.append(note);
          related.forEach(([label,href,verifiedCatalog])=>{
            const link=document.createElement('a');
            link.className='btn outline project-products-link';
            if(href.startsWith('/bathroom.html')){
              const destination=new URL(href,location.origin);
              destination.searchParams.set('fromProject','1');
              destination.searchParams.set('project',id);
              destination.searchParams.set('work',key);
              link.href=destination.pathname+destination.search;
            }else link.href=href;
            link.textContent=label;
            box.append(link);
          });
          const isMaterials=related.some(row=>!row[2]);
          if(isMaterials){
            const disclaimer=document.createElement('small');
            disclaimer.className='calc-note';
            disclaimer.style.display='block';
            disclaimer.textContent='Material pages help you choose types. Exact brands, stock and purchase prices must be confirmed before ordering.';
            box.append(disclaimer);
          }
          card.append(box);
        }
      }

      if(['furniture','office-furniture'].includes(key)){
        const roomCategory=id==='kids-room'?'kids-room':id==='bedroom-guest-room'?'bedroom':id==='home-office'?'home-office':null;
        if(roomCategory){
          const products=document.createElement('div');card.append(products);
          const load=()=>{if(!card.open||products.dataset.loaded)return;products.dataset.loaded='true';import('/store-cards.js').then(m=>m.renderRoomCards(products,roomCategory)).catch(()=>{products.innerHTML='<a href="/furniture.html?category='+roomCategory+'">Shop furniture →</a>';});};
          card.addEventListener('toggle',load);load();
        }
      }
      if(id==='accents'){const extras=document.createElement('fieldset');extras.className='finish-preparation';extras.innerHTML='<legend>Prep / Repairs</legend><label><input type="checkbox" value="Prep"> Prep</label><label><input type="checkbox" value="Repairs"> Repairs</label>';card.append(extras);}
      const selected=()=>[...card.querySelectorAll(':scope > label input[type="checkbox"]:checked')].map(x=>x.value);
      item.materials.forEach(name=>{if(id==='accents'&&name==='Painting Prep')return;if(id==='accents'&&/primer|backer board/i.test(name)){const prepLabel=document.createElement('label');const prepInput=document.createElement('input');prepInput.type='checkbox';prepInput.value=name;prepLabel.append(prepInput,document.createTextNode(name==='Backer Board'?'Backer board, if needed':name));card.querySelector('.finish-preparation').append(prepLabel);return;}const label=document.createElement('label');label.className='room-supply-choice';const input=document.createElement('input');input.type='checkbox';input.value=name;input.checked=!!draft.selected?.[key]?.includes(name);input.addEventListener('change',saveDraft);label.append(input,document.createTextNode(id==='accents'&&name==='Drywall Panels'?'Drywall':/^(Interior|Exterior) Paint$/.test(name)?'Paint — $50/gallon, supplies included':name));card.append(label)});
      if(['cabinets','refinish'].includes(key))card.insertAdjacentHTML('beforeend',cabinetOptionPicker(item.title));
      const status=document.createElement('p');status.className='calc-note';status.setAttribute('role','status');
      const plan=document.createElement('button');plan.type='button';plan.className='btn primary';plan.textContent=id==='accessibility'?'Plan Accessibility Work & Request Quote':(id==='bathrooms'||id==='bath-remodel')?'Estimate Work & Add to Cart':'Plan Work & Add to Cart';
      plan.onclick=()=>{const area=document.getElementById('scope-room').value.trim();if(!area){status.textContent='Name the room or area first.';return;}if(item.materials.length&&!selected().length){status.textContent='Choose one or more materials.';return;}const params=new URLSearchParams({project:id,work:key,workLabel:item.title,room:area,material:item.kind,materials:selected().join('|'),embedded:'1'});let saved=[];try{saved=JSON.parse(localStorage.getItem('niks-material-estimates-v1')||'[]')}catch{}const previous=saved.find(x=>x.projectScopeKey===id+'|'+area.trim().toLowerCase()+'|'+key);if(previous)params.set('editRoom',previous.roomId);for(const key of ['location','length','width','height']){const value=document.getElementById('scope-'+key).value;if(value)params.set(key,value);}const extra=[...card.querySelectorAll('.finish-preparation input:checked')].map(x=>x.value);if(extra.length)params.set('preparation',extra.join('|'));openProjectMeasurements('/calculators.html?'+params.toString());};
      card.append(plan);
      plan.addEventListener('click',()=>{localStorage.setItem('nr-project-dimensions',JSON.stringify({location:document.getElementById('scope-location').value,length:document.getElementById('scope-length').value,width:document.getElementById('scope-width').value,height:document.getElementById('scope-height').value}));});
      status.textContent='Choose what you need. Sizes and options come next.';
      card.append(status);grid.append(card);
    });
    if(fixedLocation){
      stepButtons[0].hidden=true;setStep(1);
      back.onclick=()=>{location.href=project.themedGroup?'/project.html?project=themed-rooms':(project.exterior||project.outdoorGroup)?'/project.html?project=concrete':'/#projects';};
    }
    const requestedWork=new URLSearchParams(location.search).get('work');
    if(requestedWork&&locationScopes[id]&&!document.getElementById('scope-location').value){const places=locationScopes[id];const matches=['interior','exterior'].filter(place=>places[place].includes(requestedWork));if(matches.length===1){document.getElementById('scope-location').value=matches[0];filterLocationMaterials();}}
    if(requestedWork&&/^[a-z0-9-]{1,60}$/.test(requestedWork)){
      const target=grid.querySelector('[data-work-key="'+requestedWork+'"]');
      if(target){
        setStep(1);
        target.open=true;
        const note=document.createElement('p');
        note.className='calc-note';
        note.textContent='Your products remain in the Project Cart. Select installation or more work below.';
        target.append(note);
        requestAnimationFrame(()=>target.scrollIntoView({block:'center'}));
      }
    }
    const style=document.createElement('style');style.textContent='.project-measurement-start{margin-bottom:26px}.project-measurement-grid{display:grid;grid-template-columns:2fr 1.3fr repeat(3,1fr);gap:12px}.project-measurement-grid input,.project-measurement-grid select{width:100%;box-sizing:border-box;padding:10px}.project-section-title{margin:26px 0 10px}.project-work-card summary{font-size:1.15rem;font-weight:700;cursor:pointer}.project-work-card[open] summary{margin-bottom:12px}.project-work-card .btn{margin:8px 6px 0 0}.project-work-card .room-supply-choice{align-items:center}.project-work-card input[type=checkbox]{width:18px;height:18px;flex:0 0 18px}@media(max-width:700px){.project-measurement-grid{grid-template-columns:1fr 1fr}.project-measurement-grid .field:first-child{grid-column:1/-1}}';document.head.append(style);updateCartCount();bindCabinetOptionPickers();
  };
  window.openProjectMeasurements=url=>{
    if(customUrl(url)){showCustomQuote();return;}
    try{const dims=JSON.parse(localStorage.getItem('nr-project-dimensions')||'{}'),target=new URL(url,location.origin);for(const [key,value] of Object.entries(dims))if(value&&!target.searchParams.has(key))target.searchParams.set(key,value);url=target.pathname+target.search; }catch{}
    let dialog=document.getElementById('project-measurements-dialog');
    if(!dialog){dialog=document.createElement('section');dialog.id='project-measurements-dialog';dialog.className='wrap panel';dialog.innerHTML='<div class="material-calc-dialog-head"><strong>Project Options & Estimate</strong><button class="btn outline" type="button">Keep Adding Work</button><a class="btn primary" href="/project-cart.html">Review Cart / Request Quote</a></div><p role="status" id="project-measurements-status">Calculate your work, then add it to the cart.</p><iframe title="Project options and estimate" style="width:100%;height:900px;border:0"></iframe>';dialog.querySelector('button').onclick=()=>{dialog.hidden=true;document.getElementById('project-work-grid').scrollIntoView({behavior:'smooth'});updateCartCount()};document.querySelector('main').append(dialog);}
    dialog.hidden=false;dialog.querySelector('iframe').src=url;dialog.scrollIntoView({behavior:'smooth',block:'start'});

  };
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.type==='project-calculator-back'){const dialog=document.getElementById('project-measurements-dialog');if(event.source!==dialog?.querySelector('iframe')?.contentWindow)return;dialog.hidden=true;document.getElementById('project-work-grid').scrollIntoView({behavior:'smooth'});return;}if(event.origin!==location.origin||event.data?.type!=='project-cart-saved')return;updateCartCount();const status=document.getElementById('project-measurements-status');if(status)status.textContent='Saved to your Project Cart. You can keep adding work to this room.';});
  // Reuse the calculator's supply rules and coverage assumptions for this saved work.
  window.projectSupplyChoices=item=>{
    const group=estimateSupplyGroup(item),guide=SUPPLY_GUIDE[group];
    const entries=guide?.items||[...new Set((item.products||[]).flatMap(p=>materialSupplyList(p.name)))].map(name=>[name,'Confirm compatibility and package coverage.']);
    const primary=item.products?.find(p=>Number.isFinite(p.waste)&&Number.isFinite(p.area));
    const measured=primary?{...item,measurements:{...item.measurements,coverage:Number((primary.area*(1+primary.waste/100)).toFixed(8))}}:item;
    return entries.map(([name,note])=>{const estimate=group?supplyStartingQuantity(group,name,[measured]):null;return {name,note,quantity:estimate?.quantity??null,unit:estimate?.unit||'quantity / packaging to confirm',selected:false};});
  };
})();

