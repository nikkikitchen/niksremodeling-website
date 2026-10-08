(() => {
  const init = () => {
    if (document.body.dataset.page !== 'calculators') return;
    const choicesPanel = document.querySelector('.labor-choices');
    if (!choicesPanel || choicesPanel.dataset.projectOptions === '1') return;
    choicesPanel.dataset.projectOptions = '1';
    choicesPanel.classList.add('project-options');
    const panel = choicesPanel.closest('.panel');
    const legend = choicesPanel.querySelector('legend');
    legend.textContent = 'What do you need for this project?';
    const installation = choicesPanel.querySelector('[value="Installation"]').closest('label');
    const prep = choicesPanel.querySelector('[value="Prep"]').closest('label');
    const removalSelected = choicesPanel.querySelector('[value="Removal"]').checked;
    const makeBox = (label, name, value, description = '') => {
      const el = document.createElement('label');
      const box = document.createElement('input');
      box.type = 'checkbox'; box.name = name; box.value = value;
      const text = document.createElement('span');
      text.textContent = label;
      if (description) {
        const small = document.createElement('small');
        small.textContent = description; text.append(small);
      }
      el.append(box, text); return el;
    };
    const materialsChoice = makeBox('Materials / Supplies', 'project-option', 'Materials');
    const toolsChoice = makeBox('Tools', 'project-option', 'Tools');
    const debrisChoice = makeBox('Debris Removal', 'project-option', 'Debris Removal');
    debrisChoice.querySelector('input').checked = false;
    const removal=makeBox('Removal','labor-service','Removal');removal.querySelector('input').checked=removalSelected;
    const deliveryChoice = makeBox('Delivery', 'project-option', 'Delivery');
    const misc = makeBox('Miscellaneous labor — $75/hr','labor-hourly','Miscellaneous labor');
    const miscBox = misc.querySelector('input');
    const miscDetails = document.createElement('div');
    miscDetails.className = 'field';
    const hoursLabel = document.createElement('label');
    hoursLabel.htmlFor = 'misc-hours';
    hoursLabel.textContent = 'Estimated misc. hours';
    const hoursInput = document.createElement('input');
    hoursInput.id = 'misc-hours'; hoursInput.type = 'number';
    hoursInput.min = '0'; hoursInput.step = 'any'; hoursInput.placeholder = 'Enter hours';
    const miscTotal = document.createElement('p');
    miscTotal.className = 'calc-note'; miscTotal.setAttribute('aria-live', 'polite');
    const updateMisc = () => {
      miscDetails.hidden = !miscBox.checked;
      hoursInput.disabled = !miscBox.checked;
      const hours = Number(hoursInput.value);
      miscTotal.textContent = 'Misc. labor subtotal: ' + ((miscBox.checked && Number.isFinite(hours) && hours > 0 ? hours * 75 : 0).toLocaleString('en-US', {style:'currency', currency:'USD'}));
    };
    hoursInput.addEventListener('input', updateMisc);
    const minimumNote = document.createElement('p');
    minimumNote.className = 'calc-note';
    minimumNote.textContent = '$150 minimum per service visit.';
    miscDetails.append(hoursLabel, hoursInput, miscTotal, minimumNote);
    choicesPanel.replaceChildren(legend, materialsChoice, installation, removal, misc, debrisChoice, deliveryChoice, toolsChoice);
    const materials = materialsChoice.querySelector('input');
    const delivery = deliveryChoice.querySelector('input');
    const params = new URLSearchParams(location.search);
    materials.checked = !params.has('labor') && (params.has('product') || params.has('materials'));
    const deliveryDetails = document.createElement('fieldset');
    deliveryDetails.className = 'delivery-choices project-options';
    const deliveryLegend = document.createElement('legend');
    deliveryLegend.textContent = 'What kind of delivery do you need?';
    deliveryDetails.append(deliveryLegend,
      makeBox('Store Pickup & Delivery', 'delivery-type', 'Store Pickup & Delivery', 'We pick up materials, supplies, or tools from a local store and bring them to your jobsite.'),
      makeBox('Furniture & Appliance Delivery', 'delivery-type', 'Furniture & Appliance Delivery', 'Furniture or appliances brought to your home. Setup and installation are quoted separately.'));
    const firstField = panel.querySelector('.field');
    panel.insertBefore(choicesPanel, firstField);
    choicesPanel.insertAdjacentElement('afterend', miscDetails);
    miscDetails.insertAdjacentElement('afterend', deliveryDetails);
    const allChoices = () => [...choicesPanel.querySelectorAll('input[type="checkbox"]'), ...deliveryDetails.querySelectorAll('input')];
    const update = () => {
      updateMisc();
      panel.classList.remove('no-materials');
      panel.querySelector('button[onclick="calcMaterial()"]').textContent = 'Calculate Quote';
      deliveryDetails.hidden = !delivery.checked;
      if (!delivery.checked) deliveryDetails.querySelectorAll('input').forEach(box => { box.checked = false; });
    };
    choicesPanel.addEventListener('change', update);
    deliveryDetails.addEventListener('change', update);
    update();
    initPlanner(panel, update);
  };
  function initPlanner(panel, updateChoices) {
    const productStyle=document.createElement('style');productStyle.textContent='.calc-workspace [hidden]{display:none!important}\n.area-product{border-bottom:1px solid var(--line);padding:4px 0 10px}\n.area-product .room-supply-choice{border-top:0;margin:0;align-items:center}\n.calc-workspace .area-product input[type="checkbox"]{width:18px;height:18px;flex:0 0 18px;margin:0;accent-color:var(--blue2)}\n.area-product-settings{padding-left:28px}\n#material-products{border:0;padding:0;margin:12px 0}\n#material-products legend{font-weight:700}\n';document.head.append(productStyle);
    const workspace = panel.closest('.calc-workspace');
    workspace.classList.add('guided-planner');
    panel.id = 'room-planner';
    panel.querySelector('h2').textContent = 'Plan a Room / Area';
    const side = workspace.querySelector('.calc-side');
    side.querySelectorAll(':scope > .panel').forEach((el, index) => { if (index > 0) el.remove(); });
    const summary = side.querySelector('.panel');
    summary.id = 'project-summary';
    summary.querySelector('h2').textContent = 'Project Items';
    summary.querySelectorAll(':scope > p').forEach(el => el.remove());
    document.querySelector('label[for="material-name"]').textContent = 'Which room or area?';
    document.querySelector('label[for="material-type"]').textContent = 'What are you working on?';
    const locationField=document.createElement('div');locationField.className='field';
    locationField.innerHTML='<label for="project-location">Interior or exterior?</label><select id="project-location"><option value="">Select one</option><option value="interior">Interior</option><option value="exterior">Exterior</option></select>';
    document.getElementById('material-name').closest('.field').after(locationField);
    const projectLocation=document.getElementById('project-location');
    const choices=panel.querySelector('.labor-choices');
    const calculateButton=panel.querySelector('button[onclick="calcMaterial()"]');
    for(const el of [choices,document.getElementById('misc-hours').parentElement,panel.querySelector('.delivery-choices')])calculateButton.before(el);
    choices.hidden=true;
    const workServices=document.createElement('div');workServices.className='field project-options';workServices.id='work-services';
    workServices.append(choices.querySelector('[value="Materials"]').closest('label'),choices.querySelector('[value="Installation"]').closest('label'),choices.querySelector('[value="Removal"]').closest('label'));
    document.getElementById('material-type').closest('.field').after(workServices);
    workServices.addEventListener('change',()=>{updateChoices();updateQuantityFields();document.dispatchEvent(new Event('work-options-change'));});
    const savedRooms=document.createElement('datalist');savedRooms.id='saved-room-names';
    [...new Set(materialEstimates.map(item=>item.roomName).filter(Boolean))].forEach(name=>{const option=document.createElement('option');option.value=name;savedRooms.append(option)});
    document.getElementById('material-name').setAttribute('list',savedRooms.id);panel.append(savedRooms);
    const materialDetails = document.createElement('div');
    materialDetails.className = 'field';
    materialDetails.innerHTML = '<select id="material-choice" hidden aria-hidden="true" tabindex="-1"></select><fieldset class="field" id="material-products"><legend>Materials — choose all you need</legend><p class="calc-note">One work area. Each selected product uses those measurements.</p><div id="material-product-list"></div></fieldset><label for="material-description">Material details (optional)</label><input id="material-description" placeholder="Size, color, or product name"><label for="quantity-method">How much do you need?</label><select id="quantity-method"><option value="measure">Calculate from measurements</option><option value="known">Enter quantity</option></select><div id="known-quantity-fields" hidden><label for="known-quantity">Quantity needed</label><input id="known-quantity" type="number" min="0" step="any" placeholder="Enter quantity"><label for="known-unit">Unit</label><select id="known-unit">'+['Bags','Boxes','Cubic yards','Gallons','Linear feet','Pieces','Rolls','Sheets','Square feet'].map(x=>'<option>'+x+'</option>').join('')+'</select></div>';
    document.getElementById('material-type').closest('.field').after(materialDetails);
    const materialChoice = document.getElementById('material-choice');
    const quantityMethod = document.getElementById('quantity-method');
    const materialCategories = WORK_MATERIAL_CATEGORIES;
    function syncMaterialChoice() {
      const selected=[...document.querySelectorAll('[name="area-product"]:checked')];
      materialChoice.value=selected[0]?.value||'';
      if(selected.length)panel.querySelector('[name="project-option"][value="Materials"]').checked=true;
      document.querySelectorAll('.area-product').forEach(row=>{row.querySelector('.area-product-settings').hidden=!row.querySelector('[name="area-product"]').checked});
    }
    function updateMaterialChoices() {
      const currentType=document.getElementById('material-type').value;
      if(!currentType||['prep','misc','debris','delivery'].includes(currentType)){document.getElementById('material-product-list').replaceChildren();materialChoice.replaceChildren();return;}
      const category = materialCategories[document.getElementById('material-type').value];
      let names = workMaterialNames(currentType);
      if(currentType==='refinish')names=CABINET_MATERIALS.slice();
      if(category==='paint-finishes')names=workMaterialNames('paint');
      else if(!names.includes('Other material'))names.push('Other material');
      if(category==='flooring'||category==='tile-stone')names=[...new Set([...names.filter(x=>x!=='Other material'),'Underlayment','Backer Board','Other material'])];
      materialChoice.replaceChildren(...names.map(name=>{const option=document.createElement('option');option.value=option.textContent=name;return option}));
      const empty=document.createElement('option');empty.value='';empty.textContent='Choose material';materialChoice.prepend(empty);materialChoice.value=category==='paint-finishes'?names[0]:'';
      const product=new URLSearchParams(location.search).get('product');
      if(product){const option=document.createElement('option');option.value=option.textContent=product;materialChoice.append(option);materialChoice.value=product;}
      const requested=(new URLSearchParams(location.search).get('materials')||'').split('|').filter(Boolean).map(name=>['Knobs','Pulls','Hinges','Cabinet Hardware'].includes(name)?'Hardware':name);
      const work=new URLSearchParams(location.search).get('work');
      const workChoices=window.PROJECT_WORK_OPTIONS?.[work]?.materials||[];
      names=[...new Set([...workChoices,...names,...requested])];
      if(product&&!names.includes(product))names.unshift(product);
      const list=document.getElementById('material-product-list');list.replaceChildren();
      names.forEach((name,index)=>{
        const row=document.createElement('div');row.className='area-product';
        const label=document.createElement('label');label.className='room-supply-choice';
        const box=document.createElement('input');box.type='checkbox';box.name='area-product';box.value=name;box.id='area-product-'+index;
        box.checked=requested.includes(name)||(product?name===product:false);
        label.append(box,document.createTextNode(name));row.append(label);
        const settings=document.createElement('div');settings.className='area-product-settings calc-fields';
        const field=(key,title,value,placeholder='')=>{const wrap=document.createElement('div');wrap.className='field';const text=document.createElement('label');const input=document.createElement('input');input.type='number';input.min=key==='waste'?'0':'0.01';input.step='any';input.id='product-'+index+'-'+key;input.dataset.productSetting=key;input.value=value;text.htmlFor=input.id;text.textContent=title;input.placeholder=placeholder;wrap.append(text,input);settings.append(wrap)};
        if(currentType==='concrete'&&/concrete mix/i.test(name)){row.dataset.measure='volume';const note=document.createElement('p');note.className='calc-note';note.textContent='Volume uses slab dimensions and the extra allowance below. Bag count requires the selected product’s yield.';settings.append(note);}
        else if(currentType==='refinish'){row.dataset.measure='cabinet';const note=document.createElement('p');note.className='calc-note';note.textContent='Material quantity confirmed from cabinet sizes and finish.';settings.append(note);}
        else if(/paint|primer|stain|sealer|clear finish|specialty coating/i.test(name)&&!/prep|compound/i.test(name)){
          row.dataset.measure='paint';field('coats','Coats',/primer/i.test(name)?'1':'2');field('coverage','Coverage (sq. ft. per gallon)',/primer/i.test(name)?'300':'350');
        }else if(/floor|vinyl|linoleum|hardwood|laminate|carpet|tile|stone|underlayment|backer|drywall|wall panel|waterproofing|membrane/i.test(name)&&!/grout|setting|fixture|compound/i.test(name)){
          row.dataset.measure='area';field('waste','Waste allowance (%)','10');field('coverage','Coverage per package (sq. ft., optional)','','From product label');
        }else{
          row.dataset.measure='manual';field('quantity','Quantity needed','','Enter quantity');
          const wrap=document.createElement('div');wrap.className='field';const label=document.createElement('label');label.textContent='Unit';const unit=document.createElement('select');unit.id='product-'+index+'-unit';unit.dataset.productSetting='unit';label.htmlFor=unit.id;
          ['Pieces','Bags','Boxes','Gallons','Linear feet','Rolls','Sheets','Square feet','Cubic yards'].forEach(name=>{const option=document.createElement('option');option.textContent=name;unit.append(option)});wrap.append(label,unit);settings.append(wrap);
        }
        settings.hidden=!box.checked;row.append(settings);list.append(row);
        box.addEventListener('change',()=>{syncMaterialChoice();if(box.checked&&(category==='flooring'||category==='tile-stone')&&!['Underlayment','Backer Board','Other material'].includes(name)){floorKind.value=/Tile|Stone/.test(name)?'tile':name==='Hardwood'?'nail':name==='Carpet'||name==='Linoleum'?'glue':'floating';floorKind.dispatchEvent(new Event('change'));}});
      });
      syncMaterialChoice();
    }
    function updateQuantityFields() {
      const type=document.getElementById('material-type').value;
      const service=['prep','misc','debris','delivery'].includes(type);
      const shared=['paint','refinish','flooring','tile','concrete','drywall','lumber'].includes(type);
      materialDetails.hidden=!type||service;
      workServices.hidden=!type||service||type==='refinish';
      document.getElementById('misc-hours').parentElement.hidden=!['prep','misc'].includes(type);
      document.getElementById('misc-hours').disabled=!['prep','misc'].includes(type);
      panel.querySelector('[name="labor-hourly"]').checked=['prep','misc'].includes(type);
      panel.querySelector('.delivery-choices').hidden=type!=='delivery';
      panel.querySelector('[name="project-option"][value="Delivery"]').checked=type==='delivery';
      panel.querySelector('[name="project-option"][value="Debris Removal"]').checked=type==='debris';
      if(service){panel.querySelector('[name="project-option"][value="Materials"]').checked=false;panel.querySelector('[name="labor-service"]').checked=false;}
      const installation=panel.querySelector('[name="labor-service"]:checked');
      quantityMethod.value=shared||installation?'measure':'known';
      quantityMethod.hidden=true;document.querySelector('label[for="quantity-method"]').hidden=true;
      if(!shared){document.getElementById('known-quantity').value='1';document.getElementById('known-unit').value='Pieces';}
      const known=quantityMethod.value==='known';
      document.getElementById('known-quantity-fields').hidden=true;
      questionBox.hidden=known||!type||service||type==='refinish';
      showMaterialFields();
      if(known||!type||service)document.querySelectorAll('.material-fields').forEach(el=>el.hidden=true);
      floorField.hidden=type!=='flooring';
      if(type==='refinish'){document.querySelectorAll('.material-fields').forEach(el=>el.hidden=el!==cabinetFields);}
      CABINET_WORK_OPTIONS.filter(x=>x.fields.length).forEach(option=>{document.getElementById('cabinet-'+option.key+'-details').hidden=!document.getElementById('cabinet-'+option.key).checked});
    }
    const questionBox = document.createElement('section');
    questionBox.className = 'room-questions';
    materialDetails.after(questionBox);
    const cabinetFields=document.createElement('section');cabinetFields.className='material-fields';cabinetFields.dataset.material='refinish';cabinetFields.hidden=true;
    cabinetFields.innerHTML=cabinetScopeForm();
    materialDetails.after(cabinetFields);
    cabinetFields.addEventListener('change',updateQuantityFields);
    const measurementIds = ['floor-length','floor-width','paint-length','paint-height','paint-ceiling-length','paint-ceiling-width','paint-trim-length','paint-trim-width','paint-other-area','wood-length','wood-height','dry-length','dry-height','concrete-length','concrete-width','concrete-depth'];
    measurementIds.forEach(id => { document.getElementById(id).value = ''; });
    const types = document.getElementById('material-type');
    const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Select one';types.prepend(placeholder);
    [['prep','Prep / Repairs'],['refinish','Cabinet / Vanity Refinishing'],['misc','Miscellaneous Labor'],['debris','Debris Removal'],['delivery','Delivery']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;types.append(option)});
    const initialParams=new URLSearchParams(location.search);
    if(!initialParams.has('material')&&!initialParams.has('product'))types.value='';
    else if(['prep','misc','delivery','debris','refinish','trim','insulation','roofing','siding-exterior','doors-windows'].includes(initialParams.get('material')))types.value=initialParams.get('material');
    (initialParams.get('cabinetOptions')||'').split('|').forEach(key=>{const box=document.getElementById('cabinet-'+key);if(box)box.checked=true;});
    if(initialParams.has('cabinetItem')){const note=document.createElement('p');note.className='calc-note';note.textContent='Cabinet work for: '+initialParams.get('cabinetItem');cabinetFields.prepend(note);}
    if(initialParams.has('room'))document.getElementById('material-name').value=initialParams.get('room');
    const hoursField=document.getElementById('misc-hours').parentElement;
    workServices.after(hoursField);
    document.querySelector('label[for="misc-hours"]').textContent='Estimated hours — $75/hr';
    const floorKind = document.getElementById('floor-kind');
    const floorField = floorKind.closest('.field');
    floorField.classList.add('floor-kind-field');
    questionBox.before(floorField);
    document.querySelector('label[for="floor-kind"]').textContent='Which kind of flooring?';
    const unsure = ['unsure','Not sure'];
    const questions = {
      tile: [
        ['surface','Where is the tile going?',[['floor','Floor'],['wall','Wall'],['shower','Shower'],unsure]],
        ['wet','Will this area get wet?',[['dry','Usually dry'],['splash','Occasional splashes'],['wet','Regularly wet'],unsure]],
        ['base','What is underneath?',[['concrete','Concrete'],['wood','Wood'],['existing','Existing tile or another surface'],unsure]]
      ],
      floating: [
        ['base','What is underneath?',[['concrete','Concrete'],['wood','Wood'],['existing','Existing flooring'],unsure]],
        ['padding','Does the flooring have padding attached?',[['yes','Yes'],['no','No'],unsure]],
        ['trim','Do you need new trim around the edges?',[['yes','Yes'],['no','Keep the existing trim'],unsure]]
      ],
      flooring: [
        ['base','What is underneath?',[['concrete','Concrete'],['wood','Wood'],['existing','Existing flooring'],unsure]],
        ['trim','Do you need new trim around the edges?',[['yes','Yes'],['no','Keep the existing trim'],unsure]]
      ],
      paint: [
        ['condition','What shape is the surface in?',[['good','Good — just a new color'],['new','New or bare surface'],['repair','Needs patching'],unsure]]
      ],
      drywall: [
        ['surface','Where is the drywall going?',[['walls','Walls'],['ceiling','Ceiling'],unsure]],
        ['condition','Is this new work or a repair?',[['new','New drywall'],['repair','Replacing damaged drywall'],unsure]]
      ],
      lumber: [
        ['location','Is the framing inside or outside?',[['inside','Inside'],['outside','Outside'],unsure]],
        ['openings','Are there doors or windows in this wall?',[['yes','Yes'],['no','No'],unsure]]
      ],
      concrete: [
        ['use','What are you planning?',[['patio','Patio'],['walk','Walkway'],['slab','Slab'],unsure]],
        ['base','Is the ground prepared?',[['ready','Yes'],['prep','Needs preparation'],unsure]]
      ]
    };
    const key = () => types.value === 'tile' ? 'tile' : types.value === 'flooring' ? (floorKind.value === 'tile' ? 'tile' : floorKind.value === 'floating' ? 'floating' : 'flooring') : types.value;
    const create = (tag, text, className) => { const el=document.createElement(tag); if(text)el.textContent=text; if(className)el.className=className; return el; };
    function renderQuestions(saved = {}) {
      questionBox.replaceChildren();
      floorField.hidden = types.value !== 'flooring';
      const group = questions[key()] || [];
      if(!group.length) { questionBox.append(create('p','Tell us the measured quantity below. We’ll help confirm the supplies for this item.','calc-note')); return; }
      questionBox.append(create('h3','Project details'));
      const grid = create('div', '', 'calc-fields');
      group.forEach(([id,label,options]) => {
        const field=create('div','','field'), title=create('label',label), select=create('select');
        select.id='question-'+id; select.dataset.question=id; title.htmlFor=select.id;
        const placeholder=create('option','Choose one'); placeholder.value=''; select.append(placeholder);
        options.forEach(([value,text])=>{const option=create('option',text);option.value=value;select.append(option)});
        select.value=saved[id]||'unsure';field.append(title,select);grid.append(field);
      });
      questionBox.append(grid,create('p','Adjust these if you know. Otherwise, we’ll confirm them with you.','calc-note'));
      adjustLabels();
    }
    function adjustLabels() {
      const wallLabel=document.getElementById('paint-surface-walls')?.parentElement;
      if(wallLabel)wallLabel.lastChild.textContent=projectLocation.value==='exterior'?' Walls / Siding':' Walls';
      const surface = document.getElementById('question-surface')?.value;
      if(types.value==='drywall') {
        document.querySelector('label[for="dry-length"]').textContent=surface==='ceiling'?'Ceiling length (ft)':'Total length of the walls (ft)';
        document.querySelector('label[for="dry-height"]').textContent=surface==='ceiling'?'Ceiling width (ft)':'Wall height (ft)';
      }
    }
    types.addEventListener('change',()=>{updateMaterialChoices();renderQuestions();updateQuantityFields();});
    quantityMethod.addEventListener('change',updateQuantityFields);
    choices.addEventListener('change',updateQuantityFields);
    projectLocation.addEventListener('change',()=>{
      const old=[...document.querySelectorAll('[name="area-product"]:checked')].map(x=>x.value);updateMaterialChoices();
      document.querySelectorAll('[name="area-product"]').forEach(box=>{box.checked=old.includes(box.value)||(/^(Interior|Exterior) Paint$/.test(box.value)&&old.some(x=>/^(Interior|Exterior) Paint$/.test(x)))});syncMaterialChoice();
      const wallLabel=document.getElementById('paint-surface-walls')?.parentElement;
      if(wallLabel)wallLabel.lastChild.textContent=projectLocation.value==='exterior'?' Walls / Siding':' Walls';
    });
    updateMaterialChoices();
    floorKind.addEventListener('change',()=>renderQuestions());
    materialChoice.addEventListener('change',()=>{
      if(types.value==='flooring'){
        const name=materialChoice.value;
        floorKind.value=name==='Floor Tile'?'tile':name==='Hardwood'?'nail':name==='Carpet'||name==='Linoleum'?'glue':'floating';
        floorKind.dispatchEvent(new Event('change'));
      }
    });
    questionBox.addEventListener('change',adjustLabels);
    renderQuestions();updateQuantityFields();
    const work=initialParams.get('work');
    if(['ceiling','walls','floor'].includes(work)&&types.value==='paint'){
      const box=document.getElementById('paint-surface-'+(work==='floor'?'other':work));if(box)box.checked=true;
      if(work==='floor')document.getElementById('paint-other-description').value='Floor';showPaintSurfaceFields();
    }
    document.getElementById('floor-waste').closest('.field').hidden=true;
    document.getElementById('floor-box').closest('.field').hidden=true;
    document.getElementById('paint-coats').closest('.calc-fields').hidden=true;
    let editingId = null;
    const roomStatus=create('p','','room-edit-status'); panel.querySelector('h2').after(roomStatus);
    const snapshot = () => [...panel.querySelectorAll('input,select')].map(el=>({id:el.id,name:el.name,value:el.value,checked:el.checked,type:el.type}));
    function restore(data) {
      if(!data.some(x=>x.id==='cabinet-hardware-count')){
        const old=data.filter(x=>['cabinet-knobs','cabinet-pulls','cabinet-hinges'].includes(x.id));
        if(old.length)document.getElementById('cabinet-hardware-count').value=old.reduce((sum,x)=>sum+(Number(x.value)||0),0);
      }
      const normalized=value=>['Knobs','Pulls','Hinges','Cabinet Hardware'].includes(value)?'Hardware':value;
      panel.querySelectorAll('[name="area-product"]').forEach(input=>input.checked=false);
      data.forEach(saved=>{
        let el;
        if(saved.name==='area-product'){
          el=[...panel.querySelectorAll('[name="area-product"]')].find(input=>input.value===normalized(saved.value));
          if(el&&saved.checked)el.checked=true;return;
        }
        const setting=saved.id?.match(/^product-(\d+)-(.+)$/);
        if(setting){
          const old=data.find(input=>input.id==='area-product-'+setting[1]);
          const box=[...panel.querySelectorAll('[name="area-product"]')].find(input=>input.value===normalized(old?.value));
          el=box?.closest('.area-product').querySelector('[data-product-setting="'+setting[2]+'"]');
        }else el=saved.id?document.getElementById(saved.id):[...panel.querySelectorAll('input')].find(input=>input.name===saved.name&&input.value===saved.value);
        if(!el)return;if(el.type==='checkbox')el.checked=!!saved.checked;else el.value=saved.value;
      });
    }
    function suggestedSupplies(item, answers) {
      const group=estimateSupplyGroup(item), guide=SUPPLY_GUIDE[group];
      if(!guide)return [];
      let items=guide.items.map(([name,note])=>({name,note,selected:false}));
      if(group==='tile') {
        // Wet-area planning follows the need for a compatible waterproofing system;
        // exact assemblies and quantities still require manufacturer instructions.
        if(answers.wet==='dry' && answers.surface!=='shower')items=items.filter(x=>!x.name.includes('Waterproofing'));
        if(answers.surface==='shower')items.push({name:'Shower base, drain and compatible waterproofing accessories',note:'Confirm the complete shower system and layout before ordering.',selected:false});
      }
      if(group==='floating'&&answers.padding==='yes')items=items.filter(x=>!['Compatible underlayment','Underlayment seam tape'].includes(x.name));
      if(answers.trim==='no')items=items.filter(x=>!/Baseboard|Perimeter trim/i.test(x.name));
      if(group==='paint'&&answers.condition==='good')items=items.filter(x=>!['Primer','Patching compound or spackle'].includes(x.name));
      if(group==='lumber'&&answers.location==='inside')items=items.filter(x=>!x.name.startsWith('Sheathing'));
      return items;
    }
    const originalCalc=window.calcMaterial;
    const originalRender=window.renderMaterialEstimates;
    window.calcMaterial=function() {
      const error=document.getElementById('mat-error');error.hidden=true;
      if(!projectLocation.value||!types.value){error.hidden=false;error.textContent='Select Interior or Exterior and the work to add.';return;}
      if(!document.getElementById('material-name').value.trim()){error.hidden=false;error.textContent='Name the room or area first.';return;}
      const answers={};
      if(panel.querySelector('[name="project-option"][value="Materials"]').checked && quantityMethod.value !== 'known') {
        for(const input of questionBox.querySelectorAll('select')) {
          if(!input.value){error.hidden=false;error.textContent='Answer the quick questions, or choose “Not sure.”';input.focus();return;}
          answers[input.dataset.question]=input.value;
        }
      }
      let productPlans=[];
      try{productPlans=types.value==='refinish'?[]:readAreaProducts();}catch(e){error.hidden=false;error.textContent=e.message;return;}
      const form=snapshot(), last=materialEstimates[materialEstimates.length-1], sourceQuery=location.search;
      if(types.value==='refinish'){
        try{materialEstimates.push(cabinetRefinishingEstimate());}catch(e){error.hidden=false;error.textContent=e.message;return;}
      }else if(['prep','misc','debris','delivery'].includes(types.value)){
        try{
          const hourly=['prep','misc'].includes(types.value),hours=hourly?materialPositive('misc-hours'):0;
          const label=types.selectedOptions[0].textContent;
          const deliveryTypes=types.value==='delivery'?selectedDeliveryTypes():[];
          materialEstimates.push({type:'plan',title:label,result:hourly?hours+' hours':label+' requested',detail:hourly?'$75 per hour.':'Scope and price to be confirmed.',measurements:{},labor:hourly?[{service:label,scope:label,quantity:hours,unit:'hours',hourlyRate:75,price:hours*75}]:[],projectOptions:selectedProjectOptions(),deliveryTypes});
        }catch(e){error.hidden=false;error.textContent=e.message;return;}
      }else originalCalc();
      const item=materialEstimates[materialEstimates.length-1];
      if(!item||item===last)return;
      const oldIndex=editingId?materialEstimates.findIndex(x=>x.roomId===editingId):-1;
      item.roomId=editingId||'room-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
      item.projectLocation=projectLocation.value;
      item.laborMaterial=new URLSearchParams(location.search).get('laborMaterial')||document.getElementById('material-choice').value;
      item.workLabel=new URLSearchParams(location.search).get('workLabel')||types.selectedOptions[0].textContent;
      if(productPlans.length){
        item.products=calculateAreaProducts(item,productPlans);
        const previous=oldIndex>=0?materialEstimates[oldIndex]:null;
        item.products.forEach(product=>{const old=previous?.products?.find(x=>x.name===product.name);if(old?.includeSupplies){product.includeSupplies=true;product.supplies=old.supplies;}});
        item.title=(projectLocation.value==='exterior'?'Exterior':'Interior')+' '+types.selectedOptions[0].textContent;
        item.result=item.products.map(x=>x.name+': '+x.quantity+' '+x.unit).join(' · ');
        item.detail=item.products.map(x=>x.detail).filter(Boolean).join(' · ');
      }
      if(types.value==='refinish'&&oldIndex>=0)item.products.forEach(product=>{const old=materialEstimates[oldIndex].products?.find(x=>x.name===product.name);if(old?.includeSupplies){product.includeSupplies=true;product.supplies=old.supplies;}});
      item.roomName=document.getElementById('material-name').value.trim()||'Room / Area '+(oldIndex>=0?oldIndex+1:materialEstimates.length);
      item.answers=answers;item.form=form;item.sourceQuery=sourceQuery;
      item.suggestedSupplies=item.products?[]:item.type==='plan'?[]:suggestedSupplies(item,answers);
      if(oldIndex>=0&&oldIndex<materialEstimates.length-1){materialEstimates.pop();materialEstimates[oldIndex]=item;}
      editingId=item.roomId;roomStatus.textContent='Saved to your project. Changes here update this work; use Add Work or Add Another Room for a separate item.';
      sessionStorage.setItem('nr-calculator-edit:'+sourceQuery,item.roomId);
      saveMaterialEstimates();window.renderMaterialEstimates();addProjectToCart();
      if(![...savedRooms.options].some(x=>x.value===item.roomName)){const option=document.createElement('option');option.value=item.roomName;savedRooms.append(option)}
      summary.scrollIntoView({behavior:'smooth',block:'start'});
    };
    function editRoom(item) {
      editingId=item.roomId||(item.roomId='room-'+Date.now());
      history.replaceState(null,'',location.pathname+(item.sourceQuery||''));
      if(item.form) {
        restore(item.form);updateMaterialChoices();showMaterialFields();renderQuestions(item.answers);restore(item.form);syncMaterialChoice();
      }else{
        types.value=item.type==='plan'?'flooring':item.type||'flooring';
        if(item.floorKind)floorKind.value=item.floorKind;
        panel.querySelector('[name="project-option"][value="Materials"]').checked=item.type!=='plan';
        document.getElementById('material-name').value=item.roomName||item.title.split(' — ')[1]||'';
        measurementIds.forEach(id=>{document.getElementById(id).value=''});
        showMaterialFields();renderQuestions();
      }
      document.getElementById('exact-product-fields').hidden=!new URLSearchParams(location.search).has('product');
      updateChoices();adjustLabels();updateQuantityFields();showPaintSurfaceFields();
      panel.querySelector('button[onclick="calcMaterial()"]').textContent='Save Changes';
      roomStatus.textContent='Editing '+(item.roomName||item.title)+'. Your saved room stays unchanged until you save.';
      panel.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function newRoom() {
      sessionStorage.removeItem('nr-calculator-edit:'+location.search);
      editingId=null;history.replaceState(null,'',location.pathname);
      panel.querySelectorAll('input[type="checkbox"]').forEach(el=>{el.checked=false;el.indeterminate=false});
      document.getElementById('material-name').value='';
      document.getElementById('misc-hours').value='';
      cabinetFields.querySelectorAll('input[type=number]').forEach(input=>input.value='0');
      measurementIds.forEach(id=>{document.getElementById(id).value=''});
      ['exact-brand','exact-model','exact-color','exact-identifier','floor-box'].forEach(id=>{document.getElementById(id).value=''});
      document.getElementById('exact-product-fields').hidden=true;
      document.getElementById('mat-error').hidden=true;
      types.value='';projectLocation.value='';
      roomStatus.textContent='New room / area';quantityMethod.value='measure';document.getElementById('known-quantity').value='';document.getElementById('material-description').value='';document.getElementById('paint-other-description').value='';updateMaterialChoices();renderQuestions();updateChoices();updateQuantityFields();showPaintSurfaceFields();
      panel.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('material-name').focus({preventScroll:true});
    }
    function addWork(item){
      const room=item.roomName,location=item.projectLocation,form=item.form||[];
      newRoom();document.getElementById('material-name').value=room;projectLocation.value=location;
      form.filter(x=>measurementIds.includes(x.id)).forEach(saved=>{if(saved.value)document.getElementById(saved.id).value=saved.value});
      const length=document.getElementById('floor-length').value,width=document.getElementById('floor-width').value;
      if(length&&width){document.getElementById('paint-ceiling-length').value=length;document.getElementById('paint-ceiling-width').value=width;}
      roomStatus.textContent='Add more work to '+room+'. Saved work stays in your project.';
      types.focus();document.dispatchEvent(new Event('work-options-change'));
    }
    function addProjectToCart() {
      const status=document.getElementById('project-cart-status');
      try {
        const cart=getCart().filter(x=>x.source!=='project-calculator');
        materialEstimates.filter(Boolean).forEach(item=>{
          const room=item.roomName||item.title||'Project area';
          const add=(name,type,extra={})=>cart.push({name:room+': '+name,type,qty:1,source:'project-calculator',roomId:item.roomId,room,measurements:item.measurements,workLabel:item.workLabel,sourceQuery:item.sourceQuery,exact:item.exact,purchase:item.purchase,product:item.product,...extra});
          if(item.type!=='plan' && item.projectOptions?.includes('Materials')){if(item.products)item.products.forEach(product=>add(product.name+' — '+(product.quantity==null?'quantity to confirm':product.quantity+' '+product.unit),'Material estimate',{materialQuantity:product.quantity,materialUnit:product.unit,workArea:product.area,workLabel:item.workLabel}));else add(item.result+' — '+item.title,'Material estimate');}
          (Array.isArray(item.labor)?item.labor:item.labor?[item.labor]:[]).forEach(x=>{
            const quote=typeof flooringLaborEstimate==='function'?flooringLaborEstimate(item,x.service):null;
            add(quote?x.service+' — '+quote.label+' — '+x.quantity+' '+x.unit:x.service+' — '+x.quantity+' '+x.unit,'Labor',x.hourlyRate===75?{price:75,qty:x.quantity,unit:'hours',taskId:'misc-hour',taskLabel:'Miscellaneous labor',fixture:'Miscellaneous labor'}:quote?{price:quote.amount,laborQuantity:x.quantity,laborUnit:x.unit}:x.price?{price:x.price,laborQuantity:x.quantity,laborUnit:x.unit}:{laborQuantity:x.quantity,laborUnit:x.unit});
          });
          if(item.suggestedSupplies?.some(x=>x.selected))add('Selected supplies','Supplies request',{supplyList:item.suggestedSupplies.filter(x=>x.selected).map(x=>x.name)});
          if(item.products)item.products.filter(x=>x.includeSupplies).forEach(product=>add(product.name+' — needed supplies','Supplies request',{supplyList:product.supplies,forMaterial:product.name,workLabel:item.workLabel}));
          if(item.projectOptions?.includes('Tools'))add('Tools needed for this project','Tools request');
          if(item.projectOptions?.includes('Debris Removal'))add('Debris Removal','Service');
          if(item.projectOptions?.includes('Delivery'))(item.deliveryTypes?.length?item.deliveryTypes:['Delivery']).forEach(x=>add(x,'Service'));
        });
        saveCart(cart);
        if(window.parent!==window)window.parent.postMessage({type:'project-cart-saved'},location.origin);
        if(status)status.textContent='Project added. Review your cart when you’re ready.';
      } catch(error) {
        if(status)status.textContent='Could not add the project yet. Please try again.';
        console.error(error);
      }
    }
    window.renderMaterialEstimates=function() {
      originalRender();side.hidden=materialEstimates.length===0;
      if(!materialEstimates.length)return;
      [...document.querySelectorAll('#material-results > .material-result')].forEach((row,index)=>{
        const item=materialEstimates[index], info=row.firstElementChild;
        // The complete saved work owns its cart rows; legacy individual add buttons duplicate charges.
        info.querySelectorAll('button').forEach(button=>button.remove());
        row.querySelector('.remove-material').onclick=()=>{materialEstimates.splice(index,1);saveMaterialEstimates();addProjectToCart();window.renderMaterialEstimates();};
        if(item.roomName)info.querySelector('strong').textContent=item.roomName+' — '+(item.type==='plan'?'Project needs':item.title.split(' — ')[0]);
        if(item.workLabel&&item.roomName)info.querySelector('strong').textContent=item.roomName+' — '+item.workLabel;
        if(item.products){
          const amount=info.children[1];amount.replaceChildren();
          item.products.forEach(product=>{const line=create('p');const name=create('strong',product.name+': ');line.append(name,document.createTextNode(product.quantity==null?'quantity to confirm':product.quantity+' '+product.unit));
            const supplyButton=create('button',product.includeSupplies?'Supplies Included':'Add Needed Supplies','btn outline');supplyButton.type='button';supplyButton.onclick=()=>{product.includeSupplies=!product.includeSupplies;product.supplies=window.materialSupplyList?.(product.name)||[];saveMaterialEstimates();window.renderMaterialEstimates();addProjectToCart()};line.append(document.createTextNode(' '),supplyButton);amount.append(line)});
        }
        const more=create('button','Add Work to This Room','btn outline');more.type='button';more.onclick=()=>addWork(item);info.append(more);
        const edit=create('button',item.form?'Edit Item':'Edit / Recalculate','btn outline');edit.type='button';edit.onclick=()=>editRoom(item);info.append(edit);
        if(item.suggestedSupplies?.length){
          info.querySelectorAll('a[href*="supplies.html"],button').forEach(el=>{if(el!==edit&&el!==more)el.remove()});
          const checklist=create('div','','room-supply-list');
          if(item.suggestedSupplies.length){checklist.append(create('h3','Suggested supplies'),create('p','Select only the supplies you need. Product coverage and compatibility determine final quantities.','calc-note'));
            item.suggestedSupplies.forEach(supply=>{
              const label=create('label','','room-supply-choice'),box=create('input'),copy=create('span',supply.name),small=create('small',supply.note);
              box.type='checkbox';box.checked=supply.selected;box.addEventListener('change',()=>{supply.selected=box.checked;saveMaterialEstimates();addProjectToCart()});copy.append(small);label.append(box,copy);checklist.append(label);
            });
          }
          const unknown=Object.values(item.answers||{}).includes('unsure');
          if(unknown)checklist.append(create('p','Some details need a quick review because you chose “Not sure.”','calc-note'));
          info.append(checklist);
        }
      });
      summary.querySelector('.service-estimate')?.remove();
      const serviceItems=materialEstimates.flatMap(item=>{
        const labor=(Array.isArray(item.labor)?item.labor:item.labor?[item.labor]:[]).map(x=>({type:'Labor',qty:1,price:flooringLaborEstimate(item,x.service)?.amount??x.price}));
        if(item.projectOptions?.includes('Debris Removal'))labor.push({type:'Service'});
        if(item.projectOptions?.includes('Delivery'))labor.push({type:'Service'});
        return labor;
      });
      summary.insertAdjacentHTML('beforeend',serviceEstimateMarkup(serviceItems));
      summary.querySelector('.project-summary-actions')?.remove();
      const actions=create('div','','project-summary-actions'),anotherItem=create('button','Add Work to This Room','btn primary'),another=create('button','Add Another Room / Area','btn outline'),cartButton=create('button','Add Project to Cart','btn primary'),review=create('a','Review Project Cart →','btn outline'),status=create('p','','calc-note');
      anotherItem.type=another.type=cartButton.type='button';anotherItem.onclick=()=>addWork(materialEstimates[materialEstimates.length-1]);another.onclick=newRoom;cartButton.onclick=addProjectToCart;review.href='/project-cart.html';status.id='project-cart-status';status.setAttribute('role','status');
      actions.append(anotherItem,another,cartButton,review,status,create('p','Planning list for a quote. Adding it again updates these items in your cart.','calc-note'));summary.append(actions);
    };
    window.renderMaterialEstimates();
    const requestedEdit=new URLSearchParams(location.search).get('editRoom')||sessionStorage.getItem('nr-calculator-edit:'+location.search);
    const savedEdit=materialEstimates.find(x=>x.roomId===requestedEdit);if(savedEdit)editRoom(savedEdit);
  }

  init();
  if (!document.querySelector('.labor-choices')) {
    const observer = new MutationObserver(() => {
      if (document.querySelector('.labor-choices')) { observer.disconnect(); init(); }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }
})();
