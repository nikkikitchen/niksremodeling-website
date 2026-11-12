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
    'access-bath':work('Accessible Bath & Shower','custom',['Curbless Shower Installation','Roll-In Shower Conversion','Low-Threshold Shower Conversion','Tub-to-Shower Conversion','Slip-Resistant Shower Floor','Shower Seat or Fold-Down Bench','Handheld Shower Installation','Accessible Shower Controls','Accessible Bathroom Floor Drainage']),
    'access-grab-bars':work('Grab Bars & Support Rails','custom',['Shower Grab Bars','Toilet Grab Bars','Entry Grab Bars','Reinforced Grab Bar Mounting','Wall-Mounted Support Rails']),
    'access-indoor-rails':work('Indoor Handrails & Stair Access','custom',['Hallway Handrails','Stair Handrails','Continuous Handrails','Interior Stair Tread or Nosing Repair','Stair Access Assessment']),
    'access-doorways':work('Accessible Doorways & Hardware','custom',['Doorway Widening','Accessible Lever Handles','Easy-Open Door Hardware','Door Swing & Clearance Improvements','Pocket or Sliding Door Conversion','Accessible Door Operator Assessment']),
    'access-thresholds':work('Interior Thresholds & Transitions','custom',['Low-Profile Threshold','Wheelchair-Friendly Floor Transition','Raised Threshold Removal','Smooth Room-to-Room Access','Slip-Resistant Interior Flooring']),
    'access-controls':work('Easy-Reach Controls','custom',['Lower or Relocate Wall Switches','Accessible Door Controls','Motion-Activated Lighting Controls','Accessible Thermostat Placement','Easy-Reach Cabinet Hardware']),
    'access-ramps':work('Entry Ramps & Landings','custom',['Existing Ramp Repair','Replace Ramp Deck Boards','Rebuild Existing Ramp','New Straight Ramp','Turning or Switchback Ramp','Entry or Turning Landing','Ramp Handrails and Edge Protection','Ramp Surface and Traction']),
    'access-outdoor-rails':work('Outdoor Handrails & Steps','custom',['Entry Handrails','Porch Handrails','Outdoor Step Handrails','Outdoor Grab Bar','Step or Handrail Repairs']),
    'access-walkways':work('Accessible Walkways','custom',['Level or Repair Walkway','Slip-Resistant Walkway','Wheelchair Pathway Improvements','Pathway Width or Clearance Changes','Walkway-to-Entry Transition']),
    'access-entry':work('Exterior Door Access','custom',['Accessible Entry Threshold','New or Enlarged Entry Landing','Landing and Doorway Clearance','Low-Profile Weatherproof Threshold','Exterior Door Hardware Upgrade']),
    'access-other':work('Other Accessibility Improvements','custom',['Accessible Vanity or Sink Modification','Comfort-Height Toilet Installation','Bathroom Fixture Relocation Assessment','Accessible Storage and Shelving','Home Access Assessment','Other Accessibility Work — Describe Your Project']),
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
  // The Ceiling card is a work planner, not a paint shopping list. Keep a
  // complete ceiling checklist in one place so visitors don't have to guess
  // whether lighting, texture, repairs, or insulation lives elsewhere.
  const ceilingWorkGroups=[
    ['Paint & Texture',[
      'Paint ceiling','Prime ceiling','Skim coat / smooth ceiling',
      'Add ceiling texture (orange peel / knockdown)',
      'Match existing ceiling texture (patch)',
      'Remove popcorn ceiling texture','Repair water stains / damaged ceiling finish'
    ]],
    ['Drywall & Decorative Finishes',[
      'Repair / patch ceiling drywall','Install ceiling drywall',
      'Finish ceiling drywall (tape / mud / sand)',
      'Install beadboard / tongue-and-groove ceiling',
      'Install decorative ceiling panels / tiles',
      'Build tray / coffered ceiling','Install crown molding / ceiling trim'
    ]],
    ['Lighting & Fixtures',[
      'Install / replace ceiling light','Install recessed ceiling lights',
      'Install pendant / chandelier','Install / replace ceiling fan',
      'Install ceiling speakers','Install smoke / carbon monoxide detector'
    ]],
    ['Insulation, Ventilation & Access',[
      'Add / replace ceiling insulation','Install / replace ceiling exhaust fan',
      'Install / repair attic access hatch or ladder',
      'Install skylight / sun tunnel'
    ]]
  ];
  options.ceiling=work('Ceiling','custom',ceilingWorkGroups.flatMap(([,tasks])=>tasks));
  options.ceiling.groups=ceilingWorkGroups;
  // Walls and ceilings share the same grouped work UI; wall tasks stay surface-specific.
  const wallWorkGroups=[
    ['Paint & Texture',[
      'Interior Paint','Exterior Paint','Primer','Drywall Texture',
      'Limewash','Specialty Coatings','Venetian Plaster','Wallpaper'
    ]],
    ['Drywall & Decorative Finishes',[
      'Drywall Panels','Drywall Repair & Patching','Drywall Finishing (Tape, Mud & Sand)',
      'Accent Walls','Beadboard','Board & Batten','Brick Veneer','Custom Mirrors',
      'Decorative Wall Panels','Shiplap','Stone Veneer','Tile Walls',
      'Wall Panels','Wainscoting','Wood Slat Walls'
    ]],
    ['Lighting & Fixtures',[
      'Wall Sconce / Light Fixture','Wall-Mounted Speaker',
      'Wall-Mounted TV / Display','Wall Mirror Installation'
    ]],
    ['Insulation, Ventilation & Access',[
      'Wall Insulation','Wall Vent / Exhaust Opening',
      'Access Panel / Wall Hatch'
    ]]
  ];
  options.walls.materials=wallWorkGroups.flatMap(([,tasks])=>tasks);
  options.walls.groups=wallWorkGroups;
  // Shared material categories may list many products; work cards must only list the selected job's relevant finishes.
  // Installation-only consumables are included through automatic supply planning, not customer checkboxes.
  options.floor.materials=options.floor.materials.filter(name=>!/^(Underlayment|Backer Board|Grout & Setting Materials)$/i.test(name));
  // Match the ceiling and wall card layout for flooring, too.
  // Keep coating options separate from standard floor coverings.
  const floorWorkGroups=[
    ['Flooring Materials',options.floor.materials.filter(name=>!/paint|epoxy|coating/i.test(name))],
    ['Concrete Paint & Finishes',['Concrete Floor Paint','Epoxy Floor Coating','Concrete Floor Sealer','Concrete Stain']],
  ];
  options.floor.groups=floorWorkGroups;
  options.floor.materials=[...new Set(floorWorkGroups.flatMap(([,tasks])=>tasks))];
  // Attic flooring supports structural decking without a padded-underlayment choice.
  const atticFloorMaterials=['Plywood','OSB & Sheathing'];
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
  options.toilet=bathWork('Toilets',['toilet-install','smart-toilet-install','wall-mounted-toilet-install','toilet-tank-repair','toilet-wax-ring','toilet-flange','toilet-remove']);
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
    accessibility:{interior:['access-bath','access-grab-bars','access-indoor-rails','access-doorways','access-thresholds','access-controls','access-ramps','access-outdoor-rails','access-walkways','access-entry','access-other'],exterior:['access-bath','access-grab-bars','access-indoor-rails','access-doorways','access-thresholds','access-controls','access-ramps','access-outdoor-rails','access-walkways','access-entry','access-other']},
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
  // Every standard indoor room shares the same surface-work entry points.
  // Keep specialty and outdoor projects scoped to the relevant work only.
  const standardIndoorRooms=[
    'bedroom-guest-room','closets-storage','dining-room','entry-mudroom',
    'home-office','kitchen-pantry','laundry-utility','living-family-room',
    'music-creative-studio','custom-room-ideas'
  ];
  standardIndoorRooms.forEach(roomId=>{
    if(!scopes[roomId])return;
    const core=['ceiling','walls','floor'];
    const existing=scopes[roomId].filter(key=>!core.includes(key)&&key!=='other');
    scopes[roomId]=[...core,...existing,...(scopes[roomId].includes('other')?['other']:[])];
  });
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
  // Touchscreen visitors need a way to read package scope without hovering.
  // Native details keep the photo chooser compact and keyboard accessible.
  const mobilePackageDetailsCss = '.bath-mobile-details{display:none;margin:0;border:1px solid #c9d9e8;border-radius:10px;background:#f7fafc;color:#16202a}.bath-mobile-details summary{cursor:pointer;padding:13px 15px;color:#073c70;font-weight:800;line-height:1.35;list-style-position:inside;touch-action:manipulation}.bath-mobile-details[open] summary{border-bottom:1px solid #dfe5ea}.bath-mobile-detail-content{display:flex;flex-direction:column;gap:8px;padding:14px 16px;font-size:14px;line-height:1.45}.bath-mobile-detail-content strong{font-size:17px}.bath-mobile-detail-content .bath-includes-note{color:#073c70}.bath-mobile-detail-content .bath-hover-price{color:#073c70;border-color:#cbd7e2}.bath-touch-instructions{display:none}@media(hover:none),(pointer:coarse){.bath-touch-instructions{display:inline}.bath-desktop-instructions{display:none}.bath-mobile-details{display:block}.bath-photo-tile .bath-photo-hover{display:none!important}}';
  function addMobilePackageDetails(){
    const tiles=[...document.querySelectorAll('.bath-photo-tile')];
    const hasSelection=!!document.querySelector('.bath-photo-card.current');
    tiles.forEach((tile,index)=>{
      const overlay=tile.querySelector('.bath-photo-hover');
      if(!overlay)return;
      const card=tile.querySelector('.bath-photo-card');
      const isCustom=card?.querySelector('.bath-photo-label strong')?.textContent==='Create Your Own Project';
      if(isCustom)return;
      const details=document.createElement('details');
      details.className='bath-mobile-details';
      details.open=false;
      const summary=document.createElement('summary');
      summary.textContent='Package details';
      const content=document.createElement('div');
      content.className='bath-mobile-detail-content';
      content.innerHTML=overlay.innerHTML;
      if(isCustom){
        const note=content.querySelector('.bath-includes-note');
        if(note)note.textContent='Choose the work and materials you want. Labor and needed supplies are included in your custom estimate when applicable.';
      }
      details.append(summary,content);
      tile.insertBefore(details,tile.querySelector('.bath-price-below')||tile.querySelector('.bath-card-add')||null);
    });
  }
  // Bathroom and Kitchen share the same card renderer as every other Project.
  // Their original package scopes, approved prices, and photos are preserved.
  window.NIK_ROOM_PACKAGE_OVERRIDES={
    "bathrooms":[
      {"id":"basic","name":"Basic Refresh","intro":"A defined refresh using existing suitable surfaces and connections.","work":["Paint up to 96 sq. ft. of one sound bathroom wall, two coats","Replace one vanity faucet using existing sound connections; remove old faucet","Install one towel bar and one toilet-paper holder","Includes required paint, standard fixture allowances, consumables and finishing"],"photo":"https://images.pexels.com/photos/35505451/pexels-photo-35505451.jpeg?auto=compress&cs=tinysrgb&w=900"},
      {"id":"standard","name":"Standard Upgrade","intro":"An expanded upgrade with specified materials and fixtures.","work":["Paint up to 208 sq. ft. of bathroom walls, two coats","Paint up to 26 ft existing baseboards, one side of door and up to 16 ft casing","Replace one standard vanity light and one mirror on sound existing mountings","Includes fixture allowances, necessary supplies and removal of replaced items"],"photo":"https://images.pexels.com/photos/34574595/pexels-photo-34574595.jpeg?auto=compress&cs=tinysrgb&w=900"},
      {"id":"deluxe","name":"Deluxe Refresh","intro":"A larger defined refresh, with replacement work itemized.","work":["Two coats on up to 208 sq. ft. walls and one white coat on 40 sq. ft. ceiling","Paint existing baseboards (26 ft), casing (16 ft), crown (26 ft) and one door face","Replace existing vanity light, mirror and up to three standard bathroom accessories","Up to two hours ordinary accessible caulking; removal of replaced items included"],"photo":"/assets/bathroom-deluxe-black-white.jpg"},
      {"id":"custom","name":"Custom","intro":"Choose only the work and materials you need.","work":["Choose individual jobs and materials","Request a project quote"],"photo":"/assets/tile-shower.jpg"}
    ],
    "kitchen-pantry":[
      {"id":"basic","name":"Basic Refresh","intro":"A defined refresh using existing suitable surfaces and connections.","work":["Two coats on up to 320 sq. ft. accessible kitchen walls","Replace up to 10 cabinet knobs or pulls and one light at existing compatible connections","Recaulk accessible sink/counter edges and minor trim touch-ups (up to 1 hour each)","Includes standard material allowances, consumables, and removed fixture haul-off"],"photo":"https://images.pexels.com/photos/35505446/pexels-photo-35505446.jpeg?auto=compress&cs=tinysrgb&w=900"},
      {"id":"standard","name":"Standard Upgrade","intro":"An expanded upgrade with specified materials and fixtures.","work":["Everything in Kitchen Basic, including up to 320 sq. ft. wall painting","Prep, prime and paint exteriors of up to 8 standard cabinet boxes, 12 doors and 6 drawer fronts","Replace up to 15 cabinet pulls total; install up to 25 sq. ft. standard tile backsplash","Replace kitchen faucet on existing compatible connections; standard removal and supplies included"],"photo":"https://images.pexels.com/photos/35289464/pexels-photo-35289464.jpeg?auto=compress&cs=tinysrgb&w=900"},
      {"id":"deluxe","name":"Deluxe Remodel","intro":"A larger defined refresh, with replacement work itemized.","work":["Choose individual jobs and materials","Request a project quote"],"photo":"https://images.pexels.com/photos/36777912/pexels-photo-36777912.jpeg?auto=compress&cs=tinysrgb&w=900"},
      {"id":"custom","name":"Custom","intro":"Choose only the work and materials you need.","work":["Choose individual jobs and materials","Request a project quote"],"photo":"/assets/kitchen.jpg"}
    ],
    accessibility:[
      {id:'basic',name:'Basic Ramp Repair',intro:'Repair an existing ramp and install one grab bar.',work:[
        'Repair one existing ramp, up to four labor hours',
        'Replace up to four damaged ramp deck boards and secure loose fasteners',
        'Make minor repairs to an existing handrail',
        'Install one 18-inch grab bar with secure mounting',
        'Includes replacement boards, standard fasteners, mounting hardware and sealant'
      ]},
      {id:'standard',name:'Standard Ramp',intro:'Build one straight access ramp up to 12 feet.',work:[
        'Build one straight access ramp up to 12 feet long',
        'Include ramp decking, supports, handrails and edge protection',
        'Include standard fasteners, materials and cleanup',
        'Confirm the entry height and safe transitions on site'
      ]},
      {id:'premium',name:'Premium Turning Ramp',intro:'Build a ramp with a turn and a landing where the direction changes.',work:[
        'Build a ramp with one turn and the turning landing it requires',
        'Include ramp decking, supports, handrails and edge protection',
        'Complete safe entry and exit transitions',
        'Measure the available space and design the layout on site'
      ]},
      {id:'custom',name:'Custom — Choose Your Work',intro:'Choose individual accessibility improvements for a custom quote.',work:[
        'Choose ramp repairs, ramps, landings, handrails or grab bars',
        'Choose curbless showers, doorway or threshold improvements',
        'Select only the work you want; pricing is based on your selections'
      ]}
    ].map((p,i)=>{
      p.photo=[
        'https://commons.wikimedia.org/wiki/Special:FilePath/Changing_Places_Accessible_Toilet_for_Disabled_Inclusion.jpg?width=900',
        '/assets/accessibility-premium-wooden-ramp.webp',
        '/assets/idea-accessibility.jpg',
        '/assets/accessibility-curbless-shower.webp'
      ][i];
      const basicRepair={
        scenario:'Repair one existing ramp for up to four labor hours, replacing up to four damaged treated deck boards, securing loose fasteners and making minor handrail repairs. Install one 18-inch grab bar into verified sound structural backing. Site conditions and safe access are checked before quoting.',
        labor:[
          {name:'Existing ramp repairs, up to four labor hours',quantity:4,unitPrice:75},
          {name:'Install one grab bar into sound structural backing',quantity:1,unitPrice:250}
        ],
        materials:[
          {name:'One 18-inch grab bar; provisional marked-up reference',quantity:1,unitPrice:31.52},
          {name:'Treated 5/4x6x12 deck boards',quantity:4,unitPrice:22.28},
          {name:'Exterior-rated wood fasteners',quantity:1,unitPrice:48.60}
        ],
        consumables:[{name:'Silicone tub-and-tile sealant 10.1 oz',quantity:1,unitPrice:10.12}],
        laborDiscountPercent:7,projectFeePercent:10
      };
      if(p.id==='basic')Object.assign(p,window.NIK_CALCULATE_PACKAGE_BASELINE(basicRepair));
      // Ramp geometry and structural requirements must be established on site.
      if(p.id==='standard'||p.id==='premium'){
        p.startingAt=null;
        p.priceStatus='quote-required';
      }
      return p;
    })
  };
  window.renderProjectOptions=(id,project)=>{
    const projectParams=new URLSearchParams(location.search);
    // Package-first is the one customer journey. Deep links to a chosen
    // individual job still open the existing estimator without extra questions.
    const detailWork=['roomMode','bathMode','kitchenMode','accessibilityMode'].some(key=>projectParams.get(key)==='individual') ||
      projectParams.has('selectedWorks') || projectParams.has('work');
    if(!detailWork && window.renderProjectPackageOptions?.(id,project))return;
    if(id==='custom'&&!new URLSearchParams(location.search).has('customWork')){window.renderCustomProjects();return;}
    if(id==='themed-rooms'){window.renderThemedRooms();return;}
    if(id==='concrete'&&!new URLSearchParams(location.search).has('outdoorWork')){window.renderOutdoorProjects();return;}
    // Structural room additions require a site visit and never use a made-up flat price.
    if(id==='room-additions'){
      const requestedAddition=new URLSearchParams(location.search).get('additionType');
      const additionTypes=['Bedroom Addition','Family Room Addition','Garage Addition','Sunroom Addition'];
      const additionTitle=additionTypes.includes(requestedAddition)?requestedAddition:'Room Additions';
      // Room Additions also begins with project choices. Structural
      // scope and prices remain on-site estimates, not fabricated packages.
      if(!requestedAddition){
        const choiceCards=additionTypes.map(name=>
          '<a class="panel" style="display:block;padding:24px;text-decoration:none;color:inherit" href="/project.html?project=room-additions&additionType='+encodeURIComponent(name)+'"><h2>'+escapeCartText(name)+'</h2><p>Request a complete addition project estimate.</p></a>'
        ).join('');
        document.body.innerHTML=header()+'<main class="wrap section"><a class="project-back" href="/#projects">← All Projects</a>'+
          '<h1>Room Addition Projects</h1><p class="lead">Choose the addition you want to build. Labor, materials and supplies will be included in your site-specific estimate.</p>'+
          '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:24px 0">'+choiceCards+'</div></main>'+footer();
        updateCartCount();return;
      }
      document.body.innerHTML=header()+`<main><section class="project-detail-hero"><img src="${project.image}" alt="Home extension under construction" class="project-detail-photo"><div class="wrap"><a class="project-back" href="/project.html?project=room-additions">← All Room Additions</a><h1>${additionTitle}</h1><p>Add a bedroom, family room, sunroom or other living space.</p></div></section><section class="section"><div class="wrap"><p class="lead">Foundations, structural connections, framing, roofing, utilities, permits and finishes must be reviewed on site before pricing.</p><p class="calc-note"><strong>Selected project:</strong> ${additionTitle}</p>${customQuoteMarkup(additionTitle)}</div></section></main>`+footer();
      updateCartCount();return;
    }
    if(isCustomLabel(project.title)){
      renderCustomQuotePage(project.title);
      // This is the final Custom quote step, not a second project chooser.
      if(window.PROJECT_PACKAGE_CHOICES?.[id]){
        const back=document.createElement('a');
        back.className='project-back';
        back.href='/project.html?project='+encodeURIComponent(id);
        back.textContent='← All '+project.title+' Packages';
        document.querySelector('main')?.prepend(back);
      }
      return;
    }

    // Route obsolete pilot URLs to the same itemized package chooser.
    if(['bathrooms','bath-remodel'].includes(id) && projectParams.get('bathMode')==='legacy'){
      location.replace('/project.html?project=bathrooms');return;
    }
    if(['kitchen-pantry','kitchen-remodel'].includes(id) && projectParams.get('kitchenMode')==='legacy'){
      location.replace('/project.html?project=kitchen-pantry');return;
    }
    // Bathroom and Kitchen use one shared package card and measured-quote renderer.
    // The obsolete special package galleries were removed to prevent stale prices.

    // Accessibility starting prices are for a fully specified minimum scope.
    // 18-in Moen grab bar ($23.35) and Kwikset Balboa passage lever ($21.47)
    // sourced from Home Depot, 2026-11-06; apply owner's 35% material markup
    // once. Standard lever exchange: one approved $75 hourly labor allowance.
    // Structural changes, additional anchoring, thresholds, ramps and rail
    // reconstruction are excluded from the advertised starting scenario.
    const accessibilityBaselines={
      basic:{
        scenario:'Install two 18-inch peened stainless grab bars into confirmed solid structural backing, plus up to one hour of minor nonstructural maintenance on an existing accessible ramp. Allowance includes one replacement treated deck board and standard fasteners if needed; only work safely completed within one hour. No structural ramp repairs, rail rebuild, major board replacement, new ramp, or threshold alterations.',
        labor:[
          {name:'Install grab bars in sound existing backing',quantity:2,unitPrice:250},
          {name:'Minor nonstructural existing-ramp maintenance, up to one hour',quantity:1,unitPrice:75}
        ],
        materials:[
          {name:'Moen 18-inch stainless grab bars, reference price $23.35 + 35%',quantity:2,unitPrice:31.52},
          {name:'Pressure-Treated 5/4x6x12 Decking Board',quantity:1,unitPrice:22.28},
          {name:'Deck Screws (#8 x 2-1/2-in, 5-lb box)',quantity:1,unitPrice:48.60}
        ],
        consumables:[{name:'Silicone tub-and-tile sealant, 10.1 oz',quantity:1,unitPrice:10.12}],
        laborDiscountPercent:5,projectFeePercent:10
      },
      premium:{
        scenario:'Three 18-inch grab bars installed in confirmed structural backing, one hour of accessibility/ramp planning, plus one straight-run ramp up to 12 feet of sloped run, whose complete materials and installation costs must be calculated before advertising a starting price. Ramp handrails and safe top/bottom transitions are part of the ramp scope. Existing suitable, level entry and exit surfaces are required; no new landings or platforms are included. Building landings, turning sections, or raised platforms belongs in Custom. No unverified ramp price is promised.',
        labor:[
          {name:'Install grab bars in sound existing backing',quantity:3,unitPrice:250},
          {name:'Additional on-site access and handrail review, one hour',quantity:1,unitPrice:75}
        ],
        materials:[
          {name:'Moen 18-inch stainless grab bars, reference price $23.35 + 35%',quantity:3,unitPrice:31.52}
        ],
        consumables:[{name:'Silicone tub-and-tile sealant, 10.1 oz',quantity:1,unitPrice:10.12}],
        laborDiscountPercent:8,projectFeePercent:10
      }
    };
    // Accessibility package chooser: two meaningful bundles plus custom work.
    // Scope is a quote request, not a fixed price or promise of code-compliant
    // installation without an on-site assessment.
    if(id==='accessibility' && new URLSearchParams(location.search).get('accessibilityMode')==='legacy'){
      const packages=[
        {id:'basic',name:'Basic Safety',intro:'Two grab bars plus up to one hour of minor existing-ramp maintenance.',work:[
          'Install two 18-inch grab bars into verified sound structural backing',
          'Up to one hour of minor nonstructural repairs to an existing ramp, such as tightening fasteners or replacing one accessible deck board',
          'Includes standard fasteners and up to one 12-foot treated deck board where needed',
          'Structural repairs, new ramps, major railing work and threshold changes require a separate quote'
        ]},
        {id:'premium',name:'Premium Accessibility',intro:'Three grab bars and one straight access ramp up to 12 feet.',work:[
          'Install up to three 18-inch grab bars into verified sound structural backing',
          'Build one straight-run ramp, up to 12 feet of sloped run, where the entry rise and available space allow',
          'Include required handrails, edge protection, and ramp supports; existing safe level entry and exit surfaces are required',
          'For longer ramps, new landings, or additional features, see Custom.'
        ]},
        {id:'custom',name:'Custom',intro:'Multi-run ramps, turning landings and individual access projects.',work:[
          'Build new landings, multi-section ramps, turns, switchbacks, or raised platforms',
          'Select additional handrails, existing ramp repairs, doors or threshold improvements',
          'Request a site-specific estimate for structural design, labor, materials, and supplies'
        ]}
      ];
      for(const p of packages){
        const spec=accessibilityBaselines[p.id];
        if(spec)Object.assign(p,window.NIK_CALCULATE_PACKAGE_BASELINE(spec));
        // Owner-approved provisional Premium starting price (2026-11-06).
        // Includes three grab bars and a straight 4 ft × up-to-12 ft ramp,
        // basic 2x4/4x4 handrails, no newly constructed landings.
        // The ramp allowance uses 24 labor-hours at $75/hr; the package
        // applies an 8% labor discount. Full material takeoff and suitability
        // remain subject to site verification. Do not present as a fixed quote
        // or as a fully audited bill of materials.
        if(p.id==='premium'){
          p.componentEstimate=p.startingAt;
          p.startingAt=3915;
          p.depositEstimate=null;
          p.laborEstimate=null;
          p.overheadAllowance=null;
          p.priceBasis=null;
          p.intro='Three grab bars and a straight ramp up to 12 feet. Starting price is provisional; final quote follows site inspection.';
        }
      }
      const params=new URLSearchParams(location.search);
      const selected=packages.find(p=>p.id===params.get('accessibilityPackage'))||null;
      if(selected&&selected.id!=='custom'&&params.get('quote')==='1'){window.beginPackageQuote('accessibility','Accessibility',selected,'accessibility-project-package');return;}
      const original='/project.html?project=accessibility&accessibilityMode=individual';
      // Public-domain reference photographs (Wikimedia Commons); do not present as Nik's own completed work.
// Basic: Changing Places Accessible Toilet for Disabled Inclusion (CC0).
// Premium: original short-ramp illustration, example only (not a completed Nik's Remodeling job).
const photos=[
  'https://commons.wikimedia.org/wiki/Special:FilePath/Changing_Places_Accessible_Toilet_for_Disabled_Inclusion.jpg?width=900',
  '/assets/accessibility-premium-wooden-ramp.webp',
  '/assets/idea-accessibility.jpg'
];
      const nav=packages.map((p,index)=>{
        const href=p.id==='custom'?original:'/project.html?project=accessibility&accessibilityPackage='+p.id;
        const price=p.startingAt?'Starting at $'+p.startingAt.toLocaleString('en-US'):'Project quote required';
        const detailItems=p.work.map(item=>'<span>• '+item+'</span>').join('');
        return '<div class="bath-photo-tile">'+
          '<a class="bath-photo-card'+(selected?.id===p.id?' current':'')+'" href="'+href+'" aria-label="Explore '+p.name+'">'+
          '<img src="'+photos[index]+'" alt="'+p.name+' accessibility project" loading="'+(index===0?'eager':'lazy')+'">'+
          '<span class="bath-photo-label"><strong>'+p.name+'</strong><small>'+p.intro+'</small></span>'+
          '<span class="bath-photo-hover"><strong>Included work</strong><span class="bath-includes-note">Labor, materials and needed supplies included in defined scope; final suitability and cost confirmed by quote.</span>'+detailItems+'</span></a>'+
          (p.id==='custom'?'':'<div class="bath-price-below">'+price+'</div><button class="btn primary bath-card-add" type="button" data-accessibility-package="'+p.id+'">Calculate Quote</button>')+
          '</div>';
      }).join('');
      document.body.innerHTML=header()+
        '<main><section class="section bath-project-chooser"><div class="wrap">'+
        '<a class="project-back" href="'+(selected?'/project.html?project=accessibility':'/#projects')+'">'+(selected?'← All Accessibility Packages':'← All Projects')+'</a>'+
        '<h1>Accessibility Projects</h1>'+
        '<nav class="bath-photo-grid" aria-label="Choose an accessibility package">'+nav+'</nav>'+
        (selected&&selected.id!=='custom'?'<div class="bath-package-action"><p>Complete project estimate includes labor, materials and standard supplies for the agreed scope. Installation details, accessibility requirements and site conditions must be reviewed before final pricing.</p><a class="btn primary" href="sms:6782314377?body='+encodeURIComponent('I would like an estimate for the '+selected.name+' accessibility project package.')+'">Request Package Estimate</a></div>':'<p class="calc-note">Package scope, material selection and final price are confirmed after site review. No payment is collected online.</p>')+
        '</div></section></main>'+footer();
      addMobilePackageDetails();
      const style=document.createElement('style');
      style.textContent='.bath-project-chooser{padding:42px 0 76px}.bath-project-chooser h1{font:700 clamp(36px,5vw,60px)/1.1 Georgia,serif;margin:22px 0 10px}.bath-chooser-lead{font-size:18px;color:#526270;margin:0 0 28px}.bath-project-chooser .project-back{color:#0b5aa6}.bath-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.bath-photo-tile{min-width:0;display:flex;flex-direction:column;gap:8px}.bath-photo-card{height:360px;position:relative;display:block;overflow:hidden;border-radius:12px;box-shadow:0 12px 28px #10223224;background:#d8dee3;isolation:isolate}.bath-photo-card img{width:100%;height:100%;object-fit:cover}.bath-photo-card:after{content:"";position:absolute;inset:25% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.83));pointer-events:none}.bath-photo-label{position:absolute;z-index:1;bottom:0;left:0;right:0;color:white;padding:22px 18px}.bath-photo-label strong{display:block;font:700 28px Georgia,serif}.bath-photo-label small{display:block;font-size:14px;line-height:1.4;margin-top:8px}.bath-photo-card.current{outline:3px solid #0b5aa6;outline-offset:2px}.bath-photo-card:focus-visible{outline:4px solid #0b5aa6;outline-offset:3px}.bath-photo-hover{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;gap:9px;padding:20px;color:#fff;background:rgba(5,31,55,.95);opacity:0;transition:opacity .2s ease;overflow-y:auto;font-size:14px;line-height:1.35}.bath-photo-hover strong{font-size:18px}.bath-photo-card:hover .bath-photo-hover,.bath-photo-card:focus-visible .bath-photo-hover{opacity:1}.bath-includes-note{font-weight:700;color:#e1f1ff}.bath-price-below{text-align:center;font-size:16px;font-weight:800;color:#073c70}.bath-card-add{display:block;width:100%;min-height:42px}.bath-package-action{margin-top:24px;display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}.bath-package-action p{flex:1 1 320px;margin:0}@media(max-width:900px){.bath-photo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.bath-photo-grid{grid-template-columns:1fr}.bath-photo-card{height:330px}.bath-project-chooser{padding-top:28px}}';
      style.textContent+=mobilePackageDetailsCss;
      document.head.append(style);
      document.querySelectorAll('[data-accessibility-package]').forEach(button=>button.addEventListener('click',()=>{
        const choice=packages.find(p=>p.id===button.dataset.accessibilityPackage);
        if(!choice)return;
        window.beginPackageQuote('accessibility','Accessibility',choice,'accessibility-project-package');
      }));
      updateCartCount();return;
    }

    const room=id==='bath-remodel'||id==='bathrooms'?'Bathroom':id==='kitchen-remodel'?'Kitchen':id==='accents'?'Accent wall':project.title;
    document.body.innerHTML=header()+`<main><section class="project-detail-hero"><img src="${project.image}" alt="${escapeCartText(project.title)}" class="project-detail-photo"><div class="wrap"><a class="project-back" href="/#projects">← All Projects</a><h1>${escapeCartText(project.title)}</h1><p>Choose the work you want done. We'll ask for measurements only when that item needs them.</p></div></section><section class="section"><div class="wrap"><div class="panel project-measurement-start"><h2>Where is the work?</h2><div class="project-measurement-grid"><div class="field"><label for="scope-room">Room / area</label><select id="scope-room" required><option value="">Select one</option><option>Bathroom</option><option>Bedroom</option><option>Closet / Storage</option><option>Dining Room</option><option>Entry / Mudroom</option><option>Hallway</option><option>Home Office</option><option>Kitchen</option><option>Laundry / Utility</option><option>Living / Family Room</option><option>Outdoor Area</option><option>Other Room / Area</option></select></div><div class="field"><label for="scope-location">Location</label><select id="scope-location" required><option value="">Select one</option><option value="interior">Interior</option><option value="exterior">Exterior</option></select></div><div class="field"><label for="scope-length">Length (ft, optional)</label><input id="scope-length" type="number" min="0" step="1" value="0"></div><div class="field"><label for="scope-width">Width (ft, optional)</label><input id="scope-width" type="number" min="0" step="1" value="0"></div><div class="field"><label for="scope-height">Height (ft, optional)</label><input id="scope-height" type="number" min="0" step="1" value="0"></div></div></div><h2 class="project-section-title">Choose your work</h2><div class="shop-guide-grid" id="project-work-grid"></div><p class="calc-note">Choose your work, calculate your estimate, and review your cart.</p><a class="btn outline" href="/project-cart.html">Review Project Cart</a></div></section></main>`+footer();
    if(project.exterior||project.outdoorGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=concrete';back.textContent='← Outdoor Projects';}
    if(project.themedGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=themed-rooms';back.textContent='← Themed Rooms';}
    if(project.customGroup){const back=document.querySelector('.project-back');back.href='/project.html?project=custom';back.textContent='← More Ideas';}
    if(window.PROJECT_PACKAGE_CHOICES?.[id]){
      const back=document.querySelector('.project-back');
      if(back){back.href='/project.html?project='+encodeURIComponent(id);back.textContent='← All '+project.title+' Packages';}
    }
    if(id==='entry-mudroom'||id==='entryways'){
      const section=document.querySelector('.project-section-title');
      section?.insertAdjacentHTML('beforebegin','<p class="calc-note"><a class="btn outline" href="/other.html?category=Doorbells">Shop Doorbells</a> — wireless and video doorbells for the entryway.</p>');
    }
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
    // Concrete finish choices are available in every room; the calculator checks the substrate.
    if(id==='attic')options.floor.materials=[...new Set([...atticFloorMaterials,...options.floor.materials.filter(name=>!/padding|underlayment/i.test(name))])];
    if(id==='bathrooms'||id==='bath-remodel'){
      const shortcuts=document.createElement('nav');
      shortcuts.className='project-product-links';
      shortcuts.setAttribute('aria-label','Bathroom installation and labor');
      shortcuts.style.cssText='display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 18px';
      for(const [label,href] of [
        ['Bathroom Installation & Labor','/installation.html#labor-category-bathroom'],
        ['Heated Towel Rack Installation','/installation.html?service=heated-towel-rack#labor-category-electrical']
      ]){
        const link=document.createElement('a');link.className='btn outline';link.href=href;link.textContent=label;shortcuts.append(link);
      }
      grid.before(shortcuts);
    }
    // Use existing approved job photographs on every work choice, retaining
    // the accordion controls for material selection and calculator handoff.
    grid.classList.add('project-work-pictures');
    const pictureStyle=document.createElement('style');
    pictureStyle.textContent=`#project-work-grid.project-work-pictures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}#project-work-grid .project-work-card{margin:0;padding:0;overflow:hidden;border-radius:12px;box-shadow:0 5px 18px #20304022}#project-work-grid .project-work-card>summary{display:block;cursor:pointer;list-style:none;padding:0;background:#fff}#project-work-grid .project-work-card>summary::-webkit-details-marker{display:none}#project-work-grid .project-work-card>summary img{display:block;width:100%;height:170px;object-fit:cover}#project-work-grid .project-work-card>summary span{display:block;min-height:52px;padding:11px 14px;font-size:16px;font-weight:800;color:#193e5b}#project-work-grid .project-work-card[open]>summary span{background:#edf5fc}#project-work-grid .project-work-card>:not(summary){margin:10px 14px}#project-work-grid .project-work-card>label{display:block;padding:5px 0}#project-work-grid .project-work-card .service-dropdown{margin-bottom:8px}@media(max-width:900px){#project-work-grid.project-work-pictures{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){#project-work-grid.project-work-pictures{grid-template-columns:1fr}#project-work-grid .project-work-card>summary img{height:185px}}`;
    document.head.append(pictureStyle);
    const workPhotoChoices={
      ceiling:['https://images.pexels.com/photos/3615726/pexels-photo-3615726.jpeg?auto=compress&cs=tinysrgb&w=900'],
      walls:['/assets/accent-walls-card.jpg'],
      floor:['/assets/flooring-card.jpg'],
      doors:['https://images.pexels.com/photos/5178093/pexels-photo-5178093.jpeg?auto=compress&cs=tinysrgb&w=900'],
      trim:['https://images.pexels.com/photos/5178067/pexels-photo-5178067.jpeg?auto=compress&cs=tinysrgb&w=900'],
      trim:['/assets/approved-e9fee5a04016.jpg'],
      doors:['/assets/entryways-card.jpg'],
      lighting:['/assets/lighting-card.jpg'],
      'vanity-light':['/assets/pendant-lighting.jpg'],
      toilet:['/assets/approved-a908c20ce632.jpg'],
      tub:['/assets/tile-shower.jpg'],
      shower:['/assets/showers-card.png'],
      // A tiled shower with visible controls, never a laundry machine.
      'bath-shower-valve':['https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=900'],
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
    const specialtyProjectPhotos={"pet-room":["/assets/idea-pet-room.jpg","/assets/tile-shower.jpg","/assets/flooring-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/approved-0af816f48fb0.jpg","/assets/kids-room.jpg"],"outdoor-kitchen":["/assets/idea-outdoor-kitchen.jpg","/assets/kitchen.jpg","/assets/approved-9bfcb89f7800.jpg","/assets/approved-b9cdb9084877.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/entryways-card.jpg"],"mechanic-shop":["/assets/idea-mechanic-shop.jpg","/assets/idea-car-wash.jpg","/assets/flooring-card.jpg","/assets/approved-d2807423c8f0.jpg","/assets/lighting-card.jpg","/assets/approved-8a9d216224b8.jpg"],"car-wash":["/assets/idea-car-wash.jpg","/assets/patio-concrete.webp","/assets/approved-b9cdb9084877.jpg","/assets/idea-mechanic-shop.jpg","/assets/approved-4de99f88049f.jpg"],"recycling-scrap":["/assets/idea-recycling-scrap.jpg","/assets/concrete-card.jpg","/assets/idea-garden-greenhouse.jpg","/assets/approved-b5c632fcfbc0.jpg"],"vault-safe-room":["/assets/idea-vault-safe-room.jpg","/assets/entryways-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/lighting-card.jpg","/assets/approved-739d17fd2952.jpg"],"snack-beverage":["/assets/idea-snack-beverage.jpg","/assets/approved-b9cdb9084877.jpg","/assets/kitchen.jpg","/assets/approved-9bfcb89f7800.jpg","/assets/lighting-card.jpg","/assets/approved-a051ee7e1935.jpg","/assets/approved-807c60a6001a.jpg"],"pools":["/assets/idea-pools.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/stairs-card.jpg","/assets/idea-backyard-retreat.jpg","/assets/patio-concrete.webp"],"bus-stop":["/assets/idea-bus-stop.jpg","/assets/entryways-card.jpg","/assets/approved-4de99f88049f.jpg","/assets/lighting-card.jpg","/assets/approved-a11ab0fcd37f.jpg"],"mailboxes":["/assets/idea-mailboxes.jpg","/assets/entryways-card.jpg","/assets/approved-4de99f88049f.jpg","/assets/approved-b5c632fcfbc0.jpg"],"garden-greenhouse":["/assets/idea-garden-greenhouse.jpg","/assets/idea-backyard-retreat.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/patio-concrete.webp","/assets/approved-b5c632fcfbc0.jpg"],"fitness-wellness":["/assets/idea-fitness-wellness.jpg","/assets/flooring-card.jpg","/assets/approved-8a9d216224b8.jpg","/assets/office.jpg"],"games-hobbies":["/assets/idea-games-hobbies.jpg","/assets/office.jpg","/assets/approved-6075be404407.jpg","/assets/approved-17df84119d39.jpg"],"outdoor-sound":["/assets/idea-outdoor-sound.jpg","/assets/cinema.jpg","/assets/lighting-card.jpg","/assets/idea-backyard-retreat.jpg"],"backyard-retreat":["/assets/idea-backyard-retreat.jpg","/assets/approved-a11ab0fcd37f.jpg","/assets/entryways-card.jpg","/assets/lighting-card.jpg","/assets/patio-concrete.webp"]};
    const specificWorkPhotos={"pet-floor":"/assets/flooring-card.jpg","pet-wash":"/assets/tile-shower.jpg","pet-storage":"/assets/approved-8a9d216224b8.jpg","pet-walls":"/assets/approved-0af816f48fb0.jpg","outdoor-counters":"/assets/approved-9bfcb89f7800.jpg","outdoor-sink":"/assets/approved-b9cdb9084877.jpg","outdoor-storage":"/assets/approved-4de99f88049f.jpg","outdoor-kitchen-power":"/assets/lighting-card.jpg","shop-floor":"/assets/flooring-card.jpg","shop-storage":"/assets/approved-d2807423c8f0.jpg","shop-utilities":"/assets/lighting-card.jpg","wash-floor":"/assets/patio-concrete.webp","wash-water":"/assets/approved-b9cdb9084877.jpg","wash-storage":"/assets/idea-mechanic-shop.jpg","scrap-platform":"/assets/concrete-card.jpg","scrap-cover":"/assets/idea-recycling-scrap.jpg","vault-door":"/assets/entryways-card.jpg","vault-storage":"/assets/approved-8a9d216224b8.jpg","vault-services":"/assets/lighting-card.jpg","snack-counters":"/assets/kitchen.jpg","snack-storage":"/assets/approved-9bfcb89f7800.jpg","snack-sink":"/assets/approved-b9cdb9084877.jpg","snack-light":"/assets/pendant-lighting.jpg","pool-deck":"/assets/approved-a11ab0fcd37f.jpg","pool-access":"/assets/stairs-card.jpg","pool-storage":"/assets/idea-pools.jpg","waiting-access":"/assets/patio-concrete.webp","waiting-shelter":"/assets/idea-bus-stop.jpg","waiting-light":"/assets/lighting-card.jpg","mailbox-base":"/assets/idea-mailboxes.jpg","mailbox-parcels":"/assets/idea-mailboxes.jpg","garden-beds":"/assets/idea-garden-greenhouse.jpg","garden-shelter":"/assets/idea-backyard-retreat.jpg","garden-water":"/assets/approved-a11ab0fcd37f.jpg","fit-floor":"/assets/flooring-card.jpg","fit-mirror":"/assets/idea-fitness-wellness.jpg","hobby-work":"/assets/office.jpg","hobby-display":"/assets/approved-6075be404407.jpg","sound-install":"/assets/idea-outdoor-sound.jpg","sound-power":"/assets/lighting-card.jpg","retreat-surface":"/assets/patio-concrete.webp","retreat-privacy":"/assets/idea-backyard-retreat.jpg","retreat-light":"/assets/lighting-card.jpg"};
    // Match each picture to the actual task. Approved local photographs take priority;
    // use a task-specific licensed stock photo only when our own photos do not cover it.
    const bathroomWorkPhotos={
      ceiling:['https://images.pexels.com/photos/3615726/pexels-photo-3615726.jpeg?auto=compress&cs=tinysrgb&w=900'],
      walls:['/assets/wallpaper-card.jpg'],
      floor:['/assets/flooring-card.jpg'],
      doors:['https://images.pexels.com/photos/5178093/pexels-photo-5178093.jpeg?auto=compress&cs=tinysrgb&w=900'],
      trim:['https://images.pexels.com/photos/5178067/pexels-photo-5178067.jpeg?auto=compress&cs=tinysrgb&w=900'],
      tub:['https://images.unsplash.com/photo-1773177930136-afe2bac0090a?auto=format&fit=crop&w=900&q=82'],
      shower:['/assets/showers-card.png'],
      toilet:['/assets/approved-a908c20ce632.jpg'],
      vanity:['https://images.unsplash.com/photo-1770987685744-630d3c2494bd?auto=format&fit=crop&w=900&q=82'],
      'vanity-light':['https://images.unsplash.com/photo-1763485956232-45c74e1e8610?auto=format&fit=crop&w=900&q=82'],
      refinish:['https://images.pexels.com/photos/36777600/pexels-photo-36777600.jpeg?auto=compress&cs=tinysrgb&w=900'],
      mirror:['https://images.unsplash.com/photo-1685084844860-5d94e6c82939?auto=format&fit=crop&w=900&q=82'],
      lighting:['/assets/lighting-card.jpg'],
      ventilation:['https://images.unsplash.com/photo-1572081790780-1a7739896259?auto=format&fit=crop&w=900&q=82'],
      accents:['/assets/accent-walls-card.jpg'],
      prep:['/assets/approved-b5c632fcfbc0.jpg'],
      'bath-shower-valve':['https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=900'],
      'faucet-service':['https://images.pexels.com/photos/6920608/pexels-photo-6920608.jpeg?auto=compress&cs=tinysrgb&w=900'],
      other:['/assets/custom-projects-card.jpg']
    };
    // Broken external photographs must never leave blank tiles. Draw a matching,
    // labeled illustration instead of borrowing an unrelated room's photograph.
    const bathroomPhotoFallback=key=>{
      const title=String(options[key]?.title||key);
      const scene={
        doors:'<rect x="230" y="55" width="260" height="294" fill="#f8fafb" stroke="#567789" stroke-width="15"/><rect x="253" y="77" width="214" height="250" fill="#adc4d0"/><circle cx="438" cy="206" r="10" fill="#bb874a"/>',
        trim:'<rect x="112" y="70" width="495" height="268" fill="#fff" stroke="#657f90" stroke-width="18"/><path d="M145 305h425M145 280h425" stroke="#c1a07e" stroke-width="12"/>',
        'bath-shower-valve':'<rect x="0" y="0" width="720" height="365" fill="#c9dce3"/><path d="M0 75h720M0 155h720M0 235h720M0 315h720M120 0v365M240 0v365M360 0v365M480 0v365M600 0v365" stroke="#ecf4f7" stroke-width="5"/><circle cx="360" cy="183" r="93" fill="#edf2f4" stroke="#728997" stroke-width="14"/><circle cx="360" cy="183" r="39" fill="#8ca3b1"/><path d="M360 183l65 58" stroke="#415968" stroke-width="22" stroke-linecap="round"/>',
        'faucet-service':'<rect x="160" y="230" width="400" height="100" rx="44" fill="#f9fcfd" stroke="#7d9cac" stroke-width="12"/><path d="M350 225v-83q0-38 48-38h75v35h-62q-23 0-23 26v62" fill="none" stroke="#5c7887" stroke-width="20"/>',
        ventilation:'<circle cx="360" cy="181" r="130" fill="#fff" stroke="#607e90" stroke-width="12"/><circle cx="360" cy="181" r="42" fill="#607e90"/><path d="M360 139q-100-70-115 4 10 50 75 39M400 181q100-65 43-111-55-23-78 61M340 211q-10 135 58 108 43-25 6-82" fill="#9fbbc9"/>',
        mirror:'<rect x="230" y="44" width="260" height="290" rx="125" fill="#d9eff5" stroke="#a98762" stroke-width="17"/><path d="M250 165l120-105M260 230L455 65" stroke="#fff" stroke-width="13" opacity=".7"/>',
        toilet:'<rect x="240" y="54" width="245" height="142" rx="24" fill="#fff" stroke="#7290a0" stroke-width="12"/><ellipse cx="360" cy="232" rx="110" ry="64" fill="#f8fcfd" stroke="#7290a0" stroke-width="13"/><path d="M277 246q10 84 83 84h47q55 0 45-79" fill="#f8fcfd" stroke="#7290a0" stroke-width="11"/>',
        shower:'<path d="M280 110v-45h155v45M435 110q100 0 100 80" stroke="#587786" fill="none" stroke-width="22"/><path d="M390 190h190" stroke="#658a9c" stroke-width="22"/><path d="M420 220v80M470 220v80M520 220v80" stroke="#74aac0" stroke-width="10" stroke-dasharray="8 14"/>',
        tub:'<path d="M143 165h430v70q-12 95-92 95H232q-75 0-89-95z" fill="#f9fcfc" stroke="#6c8a9c" stroke-width="14"/><path d="M490 165v-64q0-27 30-27h45" fill="none" stroke="#7896a7" stroke-width="18"/>',
        vanity:'<rect x="165" y="145" width="390" height="200" rx="12" fill="#96adbc" stroke="#506d7d" stroke-width="12"/><rect x="185" y="165" width="170" height="162" fill="#d9e4ea"/><rect x="370" y="165" width="165" height="162" fill="#d9e4ea"/><ellipse cx="360" cy="130" rx="150" ry="36" fill="#fff" stroke="#7d99a8" stroke-width="9"/><path d="M353 130v-55h48" fill="none" stroke="#617e8e" stroke-width="13"/>',
        lighting:'<path d="M360 35v125" stroke="#617d8b" stroke-width="12"/><path d="M230 160h260l-45 100H275z" fill="#ffe8a8" stroke="#9d8959" stroke-width="12"/>',
        'vanity-light':'<path d="M250 130h230" stroke="#627d8d" stroke-width="18"/><circle cx="270" cy="190" r="48" fill="#fff1ba" stroke="#b7a06b" stroke-width="8"/><circle cx="450" cy="190" r="48" fill="#fff1ba" stroke="#b7a06b" stroke-width="8"/>',
        floor:'<path d="M0 285l720-130M0 230l720-130M150 365l100-365M410 365l100-365M600 365l100-365" stroke="#6f8b9c" stroke-width="9"/>',
        walls:'<rect x="160" y="68" width="400" height="290" fill="#c6d7dc" stroke="#7c99a6" stroke-width="15"/><path d="M170 210h380" stroke="#f0f7f9" stroke-width="10"/>',
        ceiling:'<path d="M110 190l250-120 250 120-250 120z" fill="#e9f3f5" stroke="#7e9fae" stroke-width="14"/>',
        refinish:'<path d="M200 250l205-115 30 45-205 115z" fill="#9ab4c3" stroke="#527487" stroke-width="12"/><path d="M430 160l110-58" stroke="#a88256" stroke-width="25"/>',
        accents:'<rect x="140" y="60" width="440" height="280" fill="#a4bac2" stroke="#577789" stroke-width="12"/><path d="M235 60v280M330 60v280M425 60v280" stroke="#f1ebe1" stroke-width="10"/>',
        prep:'<path d="M220 260l240-135" stroke="#a47d50" stroke-width="28"/><rect x="400" y="85" width="100" height="85" rx="10" fill="#7c9daa"/><path d="M120 310h480" stroke="#7694a1" stroke-width="14"/>',
        other:'<path d="M260 85h200v230H260z" fill="#cadce3" stroke="#5e7e8e" stroke-width="15"/><path d="M320 145h80M360 105v180" stroke="#fff" stroke-width="15"/>'
      }[key]||'<rect x="215" y="60" width="290" height="270" rx="20" fill="#d7e7ed" stroke="#668797" stroke-width="15"/>';
      const svg='<svg xmlns="http://www.w3.org/2000/svg" width="720" height="460" viewBox="0 0 720 460"><rect width="720" height="460" fill="#e4edf1"/>'+scene+'<rect y="365" width="720" height="95" fill="#f7fafb"/><text x="360" y="423" font-family="Arial,sans-serif" font-size="29" font-weight="700" text-anchor="middle" fill="#244b60">'+title.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text></svg>';
      return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
    };
        // More cards can share a subject, but must never display the very same picture.
    // Reserve the hero and any indoor/outdoor selector photos before drawing work cards.
    const usedWorkPhotos=new Set([project.image]);
    document.querySelectorAll('.project-location-photo img').forEach(img=>usedWorkPhotos.add(img.getAttribute('src')));
    const stockByWork={
      accents:['https://images.pexels.com/photos/6934226/pexels-photo-6934226.jpeg?auto=compress&cs=tinysrgb&w=900'],
      refinish:['https://images.pexels.com/photos/36777600/pexels-photo-36777600.jpeg?auto=compress&cs=tinysrgb&w=900'],
      ceiling:['https://images.unsplash.com/photo-1693907646286-8c6c030f36bf?auto=format&fit=crop&w=900&q=80'],
      vanity:['https://images.unsplash.com/photo-1770987685744-630d3c2494bd?auto=format&fit=crop&w=900&q=82'],
      'vanity-light':['https://images.unsplash.com/photo-1763485956232-45c74e1e8610?auto=format&fit=crop&w=900&q=82'],
      mirror:['https://images.unsplash.com/photo-1685084844860-5d94e6c82939?auto=format&fit=crop&w=900&q=82'],
      ventilation:['https://images.unsplash.com/photo-1572081790780-1a7739896259?auto=format&fit=crop&w=900&q=82'],
      tub:['https://images.unsplash.com/photo-1773177930136-afe2bac0090a?auto=format&fit=crop&w=900&q=82'],
      'faucet-service':['https://images.unsplash.com/photo-1761353854551-361b1c804849?auto=format&fit=crop&w=900&q=82']
    };
    const isBathroom=id==='bathrooms'||id==='bath-remodel';
    // The kids' room must show child-appropriate spaces, not generic adult furniture.
    // Use approved local photography first when it fits; otherwise use distinct kids-room interiors.
    const kidsWorkPhotos={
      ceiling:'https://images.pexels.com/photos/10854908/pexels-photo-10854908.jpeg?auto=compress&cs=tinysrgb&w=900',
      doors:'https://images.pexels.com/photos/7045947/pexels-photo-7045947.jpeg?auto=compress&cs=tinysrgb&w=900',
      floor:'https://images.pexels.com/photos/5008397/pexels-photo-5008397.jpeg?auto=compress&cs=tinysrgb&w=900',
      furniture:'https://images.pexels.com/photos/7045846/pexels-photo-7045846.jpeg?auto=compress&cs=tinysrgb&w=900',
      lighting:'https://images.pexels.com/photos/7166642/pexels-photo-7166642.jpeg?auto=compress&cs=tinysrgb&w=900',
      storage:'https://images.pexels.com/photos/7028062/pexels-photo-7028062.jpeg?auto=compress&cs=tinysrgb&w=900',
      trim:'https://images.pexels.com/photos/7045857/pexels-photo-7045857.jpeg?auto=compress&cs=tinysrgb&w=900',
      walls:'https://images.pexels.com/photos/3615726/pexels-photo-3615726.jpeg?auto=compress&cs=tinysrgb&w=900',
      other:'https://images.pexels.com/photos/6693324/pexels-photo-6693324.jpeg?auto=compress&cs=tinysrgb&w=900'
    };
    const workPhoto=key=>{
      const ownPhotos=id==='kids-room'?(kidsWorkPhotos[key]?[kidsWorkPhotos[key]]:[]):[
        ...(isBathroom?(bathroomWorkPhotos[key]||[]):[]),
        ...(!isBathroom&&specificWorkPhotos[key]?[specificWorkPhotos[key]]:[]),
        ...(!isBathroom?(workPhotoChoices[key]||[]):[]),
        ...(!isBathroom?(stockByWork[key]||[]):[])
      ];
      const chosen=ownPhotos.find(url=>!usedWorkPhotos.has(url))
        ||(id==='kids-room'||isBathroom?null:(
          (specialtyProjectPhotos[id]||[]).find(url=>!usedWorkPhotos.has(url))
          ||(PROJECT_CATALOG[id]?.image&&!usedWorkPhotos.has(PROJECT_CATALOG[id].image)?PROJECT_CATALOG[id].image:null)
        ));
      // Never repeat a photo, including the hero. If there is no suitable unique
      // photograph for a specialty task, use a labeled task-specific illustration.
      // This is preferable to a random kitchen, bathroom or repeated hero photo.
      const photo=chosen||('data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="460" viewBox="0 0 720 460">'+
        '<rect width="720" height="460" fill="#e7edf0"/>'+
        '<rect x="112" y="76" width="496" height="308" rx="12" fill="#f7f9fa" stroke="#b3c3cb" stroke-width="5"/>'+
        '<path d="M220 242h280M360 150v184" stroke="#aac0cb" stroke-width="9" stroke-linecap="round"/>'+
        '<text x="360" y="402" font-size="27" font-family="Arial,sans-serif" fill="#25495b" text-anchor="middle">'+
        String(options[key]?.title||key).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text></svg>'
      ));
      usedWorkPhotos.add(photo);
      return photo;
    };
    const draftKey='niks-project-options-'+id;
    let draft={};try{draft=JSON.parse(localStorage.getItem(draftKey)||'{}')}catch{}


    function filterLocationMaterials(){const location=document.getElementById('scope-location').value;const allowed=locationScopes[id]?.[location];if(allowed){grid.querySelectorAll('[data-work-key]').forEach(card=>{card.hidden=!allowed.includes(card.dataset.workKey);if(card.hidden){card.open=false;card.querySelectorAll('input[type="checkbox"]:checked').forEach(box=>{box.checked=false;});}});workTitle.textContent=id==='accessibility'?'Choose Accessibility Work':(location==='exterior'?'Choose Exterior Work':'Choose Interior Work');}grid.querySelectorAll('.room-supply-choice').forEach(label=>{const input=label.querySelector('input');if(!input)return;const mismatch=location==='interior'?/^Exterior (Paint|Stain|Primer|Finish)\b/i.test(input.value):location==='exterior'?/^Interior (Paint|Stain|Primer|Finish)\b/i.test(input.value):false;label.hidden=mismatch;if(mismatch)input.checked=false;});}
    const saveDraft=()=>{const selected={},preparation={};grid.querySelectorAll('[data-work-key]').forEach(card=>{selected[card.dataset.workKey]=[...card.querySelectorAll(':scope > label input:checked')].map(x=>x.value);preparation[card.dataset.workKey]=[...card.querySelectorAll('.finish-preparation input:checked')].map(x=>x.value)});try{localStorage.setItem(draftKey,JSON.stringify({preparation,locationChosen:!!document.getElementById('scope-location').value,room:document.getElementById('scope-room').value,selected,...Object.fromEntries(['scope-location','scope-length','scope-width','scope-height'].map(id=>[id,document.getElementById(id).value]))}))}catch{}};
    ['scope-room','scope-location','scope-length','scope-width','scope-height'].forEach(id=>document.getElementById(id).addEventListener('input',saveDraft));
    (scopes[id]||scopes.custom).forEach(key=>{
      const item=options[key],card=document.createElement('details');card.className='panel project-work-card';card.dataset.workKey=key;card.open=!!draft.selected?.[key]?.length;
      const heading=document.createElement('summary');
      const headingImage=document.createElement('img');headingImage.src=workPhoto(key);headingImage.alt=item.title;headingImage.loading='lazy';if(isBathroom){const fallback=bathroomPhotoFallback(key);headingImage.addEventListener('error',()=>{if(headingImage.src!==fallback)headingImage.src=fallback;},{once:true});}
      const headingLabel=document.createElement('span');headingLabel.textContent=id==='accents'&&key==='walls'?'Paint & Wall Repairs':item.title;
      heading.append(headingImage,headingLabel);card.append(heading);
      if((id==='bathrooms'||id==='bath-remodel')&&key==='toilet'){
        const styleKey=new URLSearchParams(location.search).get('toiletStyle');
        const names={round:'Standard Round',elongated:'Elongated & Comfort Height',smart:'Smart Toilets',specialty:'Wall-Hung & Specialty'};
        if(names[styleKey]){
          const note=document.createElement('p');note.className='calc-note';
          note.textContent='Preferred toilet style: '+names[styleKey]+'. Select the work below. Specific model, stock and product price must be confirmed.';
          card.append(note);
        }
      }
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
      if((id==='bathrooms'||id==='bath-remodel')&&['other','accents'].includes(key)){
        const link=document.createElement('a');
        link.className='btn outline project-products-link';
        link.href='/installation.html?service=heated-towel-rack#labor-category-electrical';
        link.textContent='Heated Towel Rack — Installation & Labor';
        card.append(link);
      }
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
      if(id==='accents'){const extras=document.createElement('fieldset');extras.className='finish-preparation';extras.innerHTML='<legend>Prep / Repairs</legend><label><input type="checkbox" value="Prep"> Prep</label><label><input type="checkbox" value="Repairs"> Repairs</label>';card.append(extras);extras.addEventListener('change',saveDraft);}
      const selected=()=>[...card.querySelectorAll(':scope > label input[type="checkbox"]:checked')].map(x=>x.value);
      if(key==='ceiling'){
        const note=document.createElement('p');note.className='calc-note';
        note.textContent='Choose any ceiling work you need. Pricing and supplies come later in the estimate.';
        card.append(note);
      }
      const workGroupFor=name=>item.groups?.find(([,tasks])=>tasks.includes(name))?.[0]||null;
      let lastWorkGroup='';
      item.materials.forEach(name=>{
        const group=workGroupFor(name);
        if(group&&group!==lastWorkGroup){
          lastWorkGroup=group;
          const subheading=document.createElement('h3');subheading.className='ceiling-work-heading';
          subheading.textContent=group;subheading.style.cssText='font-size:1rem;margin:18px 0 8px';
          card.append(subheading);
        }if(id==='accents'&&name==='Painting Prep')return;if(id==='accents'&&/primer|backer board/i.test(name)){const prepLabel=document.createElement('label');const prepInput=document.createElement('input');prepInput.type='checkbox';prepInput.value=name;prepLabel.append(prepInput,document.createTextNode(name==='Backer Board'?'Backer board, if needed':name));card.querySelector('.finish-preparation').append(prepLabel);return;}const label=document.createElement('label');label.className='room-supply-choice';const input=document.createElement('input');input.type='checkbox';input.value=name;input.checked=!!draft.selected?.[key]?.includes(name);input.addEventListener('change',saveDraft);label.append(input,document.createTextNode((id==='accents'||key==='walls')&&name==='Drywall Panels'?'Drywall':/^(Interior|Exterior) Paint$/.test(name)?'Paint':name));card.append(label)});
      card.querySelectorAll('.finish-preparation input[type="checkbox"]').forEach(box=>{box.checked=!!draft.preparation?.[key]?.includes(box.value);box.addEventListener('change',saveDraft);});
      if(['cabinets','refinish'].includes(key))card.insertAdjacentHTML('beforeend',cabinetOptionPicker(item.title));
      const status=document.createElement('p');status.className='calc-note';status.setAttribute('role','status');
      const plan=document.createElement('button');plan.type='button';plan.className='btn primary';plan.textContent=id==='accessibility'?'Plan Accessibility Work & Request Quote':(id==='bathrooms'||id==='bath-remodel')?'Estimate Work & Add to Cart':'Plan Work & Add to Cart';
      plan.onclick=()=>{const area=document.getElementById('scope-room').value.trim();if(!area){status.textContent='Name the room or area first.';return;}if(item.materials.length&&!selected().length){status.textContent=key==='ceiling'?'Choose one or more ceiling tasks.':'Choose one or more materials.';return;}const chosenTasks=selected();
        // Projects plan the entire job. A single ceiling-paint choice must
        // enter the measured paint calculator, not the generic one-item picker.
        const ceilingPaintOnly=key==='ceiling'&&chosenTasks.length===1&&chosenTasks[0]==='Paint ceiling';
        const floorPaintOnly=key==='floor'&&chosenTasks.length===1&&chosenTasks[0]==='Concrete Floor Paint';
        const projectMaterial=ceilingPaintOnly||floorPaintOnly?'paint':item.kind;
        const chosenMaterials=ceilingPaintOnly?[document.getElementById('scope-location').value==='exterior'?'Exterior Paint':'Interior Paint']:chosenTasks;
        const params=new URLSearchParams({project:id,work:key,workLabel:item.title,room:area,material:projectMaterial,materials:chosenMaterials.join('|'),projectMode:'complete',embedded:'1'});
        // Each click from Projects starts only the newly selected job.
        params.set('projectStart',Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
        if(key==='ceiling')params.set('projectTasks',chosenTasks.join('|'));if((id==='bathrooms'||id==='bath-remodel')&&key==='toilet'){const preferred=new URLSearchParams(location.search).get('toiletStyle');if(['round','elongated','smart','specialty'].includes(preferred))params.set('toiletStyle',preferred);}for(const key of ['location','length','width','height']){const value=document.getElementById('scope-'+key).value;if(value)params.set(key,value);}const extra=[...card.querySelectorAll('.finish-preparation input:checked')].map(x=>x.value);if(extra.length)params.set('preparation',extra.join('|'));openProjectMeasurements('/calculators.html?'+params.toString());};
      card.append(plan);
      plan.addEventListener('click',()=>{localStorage.setItem('nr-project-dimensions',JSON.stringify({location:document.getElementById('scope-location').value,length:document.getElementById('scope-length').value,width:document.getElementById('scope-width').value,height:document.getElementById('scope-height').value}));});
      status.textContent='Choose what you need. Sizes and options come next.';
      card.append(status);grid.append(card);
    });
    // The Projects dropdown already captures work selections. Never ask for the same jobs twice.
    if(fixedLocation){
      stepButtons[0].hidden=true;setStep(1);
      back.onclick=()=>{location.href=project.themedGroup?'/project.html?project=themed-rooms':(project.exterior||project.outdoorGroup)?'/project.html?project=concrete':'/#projects';};
    }
    const selectedWorks=new URLSearchParams(location.search).get('selectedWorks');
    if(selectedWorks){
      const cards=[...grid.querySelectorAll('.project-work-card')];
      const available=new Set(cards.map(card=>card.dataset.workKey));
      const chosen=new Set(selectedWorks.split(',').filter(key=>/^[a-z0-9-]{1,60}$/.test(key)&&available.has(key)));
      if(chosen.size){
        setStep(1);
        grid.classList.add('project-work-filtered');
        const titles=[];
        cards.forEach(card=>{
          const show=chosen.has(card.dataset.workKey)&&!card.hidden;
          card.hidden=!show;
          card.open=show;
          if(show)titles.push(card.querySelector('summary span')?.textContent?.trim()||card.dataset.workKey);
        });
        workTitle.textContent=titles.length===1?'Choose '+titles[0]+' options':'Choose options for your selected work';
        workNote.textContent='Pick the materials or services you need for each job below. No need to choose the same work again.';
      }
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
    if(grid.classList.contains('project-work-filtered')){
      const compact=document.createElement('style');
      compact.textContent='#project-work-grid.project-work-filtered{grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))}#project-work-grid.project-work-filtered .project-work-card>summary img{height:76px;object-fit:cover}';
      document.head.append(compact);
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
    let entries=guide?.items||[...new Set((item.products||[]).flatMap(p=>materialSupplyList(p.name)))].map(name=>[name,'Confirm compatibility and package coverage.']);
    // Do not automatically order a second cushion when attached padding is
    // present OR unknown. If the flooring lacks pad, only the product's own
    // instructions can determine if an extra underlayment is appropriate.
    if(group==='floating'){
      if(item.answers?.padding!=='no')
        entries=entries.filter(([name])=>!['Compatible underlayment','Underlayment seam tape'].includes(name));
      // Plastic sheeting over wood can trap moisture. A concrete moisture
      // barrier is separate from the LVP's attached cushion and is conditional
      // on the flooring manufacturer's concrete installation requirements.
      if(item.answers?.base==='wood')
        entries=entries.filter(([name])=>name!=='Moisture or vapor barrier');
    }
    const primary=item.products?.find(p=>Number.isFinite(p.waste)&&Number.isFinite(p.area));
    const measured=primary?{...item,measurements:{...item.measurements,coverage:Number((primary.area*(1+primary.waste/100)).toFixed(8))}}:item;
    return entries.map(([name,note])=>{const estimate=group?supplyStartingQuantity(group,name,[measured]):null;return {name,note,quantity:estimate?.quantity??null,unit:estimate?.unit||'quantity / packaging to confirm',selected:false};});
  };
})();
