(() => {
  const work = (title, kind, materials) => ({title, kind, materials});
  const options = window.PROJECT_WORK_OPTIONS = {
    ceiling:work('Ceiling','paint',['Interior Paint','Primer','Drywall Panels']),
    walls:work('Walls','paint',['Interior Paint','Primer','Drywall Panels','Wall Panels','Porcelain Tile','Backer Board']),
    floor:work('Floor','flooring',['Luxury Vinyl Plank (LVP)','Floor Tile','Underlayment','Backer Board']),
    tub:work('Tub','custom',['Bathtub','Tub Faucet','Tub Drain']),
    shower:work('Shower','tile',['Porcelain Tile','Backer Board','Waterproofing Membrane','Shower Base','Shower Valve / Head','Shower Glass']),
    'tub-shower':work('Tub / Shower Combination','tile',['Bathtub','Tub / Shower Surround','Porcelain Tile','Backer Board','Waterproofing Membrane','Tub / Shower Valve']),
    toilet:work('Toilet','custom',['Toilet','Toilet Seat','Toilet Supply Line']),
    vanity:work('Vanity / Vanities','custom',['Single Vanity','Double Vanity','Vanity Top','Sink','Faucet','Hardware']),
    mirror:work('Mirror / Mirrors','custom',['Mirror','Medicine Cabinet']),
    lighting:work('Lighting','custom',['Vanity Light','Ceiling Light','Recessed Light','Dimmer / Switch']),
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
  // The catalog, project cards and calculator read the same material lists.
  const shared=window.WORK_MATERIAL_OPTIONS={};
  for(const [kind,slug] of Object.entries(WORK_MATERIAL_CATEGORIES))shared[kind]=[...MATERIAL_DETAIL_PAGES[slug].items];
  shared.refinish=CABINET_MATERIALS.slice();
  Object.values(options).forEach(option=>{
    if(shared[option.kind])shared[option.kind]=[...new Set([...shared[option.kind],...option.materials])];
  });
  ['flooring','tile'].forEach(kind=>{shared[kind]=[...new Set([...shared[kind],'Underlayment','Backer Board'])]});
  Object.values(options).forEach(option=>{if(shared[option.kind])option.materials=shared[option.kind].filter(name=>name!=='Other material')});
  const scopes={
    'bath-remodel':['ceiling','walls','floor','tub','shower','tub-shower','toilet','vanity','refinish','mirror','lighting','ventilation','accents','prep','other'],
    bathrooms:['ceiling','walls','floor','tub','shower','tub-shower','toilet','vanity','refinish','mirror','lighting','ventilation','accents','prep','other'],
    'kitchen-remodel':['ceiling','walls','floor','cabinets','refinish','countertops','backsplash','appliances','plumbing','lighting','trim','prep','other'],
    tile:['floor','walls','backsplash','shower','prep','other'],
    arches:['framing','trim','walls','prep','other'],stairs:['stairs','trim','refinish','prep','other'],
    murals:['ceiling','walls','refinish','trim','prep','other'],wallpaper:['wallpaper','walls','trim','prep','other'],
    fireplaces:['fireplace','walls','trim','prep','other'],concrete:['concrete','floor','prep','other'],
    flooring:['floor','trim','prep','other'],entryways:['doors','floor','stairs','trim','lighting','prep','other'],
    accents:['walls','wallpaper','trim','lighting','prep','other'],lighting:['lighting','ventilation','prep','other'],
    custom:['ceiling','walls','floor','framing','cabinets','refinish','trim','lighting','prep','other']
  };
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
    const room=id==='bath-remodel'||id==='bathrooms'?'Bathroom':id==='kitchen-remodel'?'Kitchen':'';
    document.body.innerHTML=header()+`<main><section class="project-detail-hero"><img src="${project.image}" alt="${escapeCartText(project.title)}" class="project-detail-photo"><div class="wrap"><a class="project-back" href="/#projects">← All Projects</a><h1>${escapeCartText(project.title)}</h1><p>One update or the whole room. Choose the parts you want to work on.</p></div></section><section class="section"><div class="wrap"><div class="panel project-measurement-start"><h2>1. Start with your area</h2><p class="lead">Enter the basic dimensions first. They carry into the material, supply and labor calculator.</p><div class="project-measurement-grid"><div class="field"><label for="scope-room">Room / area</label><input id="scope-room" value="${room}" placeholder="e.g. Main bathroom"></div><div class="field"><label for="scope-location">Interior or exterior?</label><select id="scope-location"><option value="interior">Interior</option><option value="exterior">Exterior</option></select></div><div class="field"><label for="scope-length">Length (ft)</label><input id="scope-length" type="number" min="0" step="0.01" placeholder="12"></div><div class="field"><label for="scope-width">Width (ft)</label><input id="scope-width" type="number" min="0" step="0.01" placeholder="10"></div><div class="field"><label for="scope-height">Height (ft, optional)</label><input id="scope-height" type="number" min="0" step="0.01" placeholder="8"></div></div><p class="calc-note">Length and width are used for floor, tile and concrete quantities. Height is used where applicable.</p></div><h2 class="project-section-title">2. Choose what you are working on</h2><div class="shop-guide-grid" id="project-work-grid"></div><p class="calc-note">Choose a material, then calculate quantities and optional supplies.</p><a class="btn outline" href="/project-cart.html">Review Project Cart</a></div></section></main>`+footer();
    const grid=document.getElementById('project-work-grid');
    const draftKey='niks-project-options-'+id;
    let draft={};try{draft=JSON.parse(localStorage.getItem(draftKey)||'{}')}catch{}
    if(draft.room)document.getElementById('scope-room').value=draft.room;
    for(const id of ['scope-location','scope-length','scope-width','scope-height'])if(draft[id])document.getElementById(id).value=draft[id];
    const saveDraft=()=>{const selected={};grid.querySelectorAll('[data-work-key]').forEach(card=>{selected[card.dataset.workKey]=[...card.querySelectorAll(':scope > label input:checked')].map(x=>x.value)});try{localStorage.setItem(draftKey,JSON.stringify({room:document.getElementById('scope-room').value,selected,...Object.fromEntries(['scope-location','scope-length','scope-width','scope-height'].map(id=>[id,document.getElementById(id).value]))}))}catch{}};
    ['scope-room','scope-location','scope-length','scope-width','scope-height'].forEach(id=>document.getElementById(id).addEventListener('input',saveDraft));
    (scopes[id]||scopes.custom).forEach(key=>{
      const item=options[key],card=document.createElement('details');card.className='panel project-work-card';card.dataset.workKey=key;card.open=!!draft.selected?.[key]?.length;
      const heading=document.createElement('summary');heading.textContent=item.title;card.append(heading);
      const selected=()=>[...card.querySelectorAll(':scope > label input[type="checkbox"]:checked')].map(x=>x.value);
      item.materials.forEach(name=>{const label=document.createElement('label');label.className='room-supply-choice';const input=document.createElement('input');input.type='checkbox';input.value=name;input.checked=!!draft.selected?.[key]?.includes(name);input.addEventListener('change',saveDraft);label.append(input,document.createTextNode(name));card.append(label)});
      if(['cabinets','vanity','refinish'].includes(key))card.insertAdjacentHTML('beforeend',cabinetOptionPicker(item.title));
      const status=document.createElement('p');status.className='calc-note';status.setAttribute('role','status');
      const plan=document.createElement('button');plan.type='button';plan.className='btn primary';plan.textContent='Calculate Materials & Supplies';
      plan.onclick=()=>{const area=document.getElementById('scope-room').value.trim();if(!area){status.textContent='Name the room or area first.';return;}if(item.materials.length&&!selected().length){status.textContent='Choose one or more materials.';return;}const params=new URLSearchParams({project:id,work:key,workLabel:item.title,room:area,material:item.kind,materials:selected().join('|'),embedded:'1'});let saved=[];try{saved=JSON.parse(localStorage.getItem('niks-material-estimates-v1')||'[]')}catch{}const previous=saved.find(x=>x.projectScopeKey===id+'|'+area.trim().toLowerCase()+'|'+key);if(previous)params.set('editRoom',previous.roomId);openProjectMeasurements('/calculators.html?'+params.toString());};
      card.append(plan);
      plan.addEventListener('click',()=>{localStorage.setItem('nr-project-dimensions',JSON.stringify({location:document.getElementById('scope-location').value,length:document.getElementById('scope-length').value,width:document.getElementById('scope-width').value,height:document.getElementById('scope-height').value}));});
      status.textContent='Enter measurements, package coverage and waste allowance. Choose supplies after calculating.';
      card.append(status);grid.append(card);
    });
    const style=document.createElement('style');style.textContent='.project-measurement-start{margin-bottom:26px}.project-measurement-grid{display:grid;grid-template-columns:2fr 1.3fr repeat(3,1fr);gap:12px}.project-measurement-grid input,.project-measurement-grid select{width:100%;box-sizing:border-box;padding:10px}.project-section-title{margin:26px 0 10px}.project-work-card summary{font-size:1.15rem;font-weight:700;cursor:pointer}.project-work-card[open] summary{margin-bottom:12px}.project-work-card .btn{margin:8px 6px 0 0}.project-work-card .room-supply-choice{align-items:center}.project-work-card input[type=checkbox]{width:18px;height:18px;flex:0 0 18px}@media(max-width:700px){.project-measurement-grid{grid-template-columns:1fr 1fr}.project-measurement-grid .field:first-child{grid-column:1/-1}}';document.head.append(style);updateCartCount();bindCabinetOptionPickers();
  };
  window.openProjectMeasurements=url=>{
    try{const dims=JSON.parse(localStorage.getItem('nr-project-dimensions')||'{}'),target=new URL(url,location.origin);for(const [key,value] of Object.entries(dims))if(value)target.searchParams.set(key,value);url=target.pathname+target.search; }catch{}
    let dialog=document.getElementById('project-measurements-dialog');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='project-measurements-dialog';dialog.className='material-calc-dialog';dialog.setAttribute('aria-label','Calculate materials and supplies');dialog.innerHTML='<div class="material-calc-dialog-head"><strong>Materials & Supplies</strong><button class="btn outline" type="button">Done · Back to Project</button></div><p role="status" class="calc-note" id="project-measurements-status">Save your measurements to update this project’s cart.</p><iframe title="Material and supply calculator"></iframe>';dialog.querySelector('button').onclick=()=>{dialog.close();updateCartCount()};document.body.append(dialog);}
    dialog.querySelector('iframe').src=url;dialog.showModal();
  };
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.data?.type!=='project-cart-saved')return;updateCartCount();const status=document.getElementById('project-measurements-status');if(status)status.textContent='Saved to your Project Cart. You can keep adding work to this room.';});
  // Reuse the calculator's supply rules and coverage assumptions for this saved work.
  window.projectSupplyChoices=item=>{
    const group=estimateSupplyGroup(item),guide=SUPPLY_GUIDE[group];
    const entries=guide?.items||[...new Set((item.products||[]).flatMap(p=>materialSupplyList(p.name)))].map(name=>[name,'Confirm compatibility and package coverage.']);
    const primary=item.products?.find(p=>Number.isFinite(p.waste)&&Number.isFinite(p.area));
    const measured=primary?{...item,measurements:{...item.measurements,coverage:Number((primary.area*(1+primary.waste/100)).toFixed(8))}}:item;
    return entries.map(([name,note])=>{const estimate=group?supplyStartingQuantity(group,name,[measured]):null;return {name,note,quantity:estimate?.quantity??null,unit:estimate?.unit||'quantity / packaging to confirm',selected:false};});
  };
})();
