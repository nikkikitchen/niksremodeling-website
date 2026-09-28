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
    const toolsChoice = makeBox('Tools (if needed)', 'project-option', 'Tools');
    const debrisChoice = makeBox('Debris Removal', 'project-option', 'Debris Removal');
    debrisChoice.querySelector('input').checked = removalSelected;
    const deliveryChoice = makeBox('Delivery', 'project-option', 'Delivery');
    const selectAll = makeBox('Select All', 'project-select-all', 'all');
    choicesPanel.replaceChildren(legend, materialsChoice, toolsChoice, debrisChoice, deliveryChoice, installation, prep, selectAll);
    const materials = materialsChoice.querySelector('input');
    const delivery = deliveryChoice.querySelector('input');
    const params = new URLSearchParams(location.search);
    materials.checked = params.has('material') || params.has('product');
    const deliveryDetails = document.createElement('fieldset');
    deliveryDetails.className = 'delivery-choices project-options';
    const deliveryLegend = document.createElement('legend');
    deliveryLegend.textContent = 'What kind of delivery do you need?';
    deliveryDetails.append(deliveryLegend,
      makeBox('Store Pickup & Delivery', 'delivery-type', 'Store Pickup & Delivery', 'We pick up materials, supplies, or tools from a local store and bring them to your jobsite.'),
      makeBox('Furniture & Appliance Delivery', 'delivery-type', 'Furniture & Appliance Delivery', 'Furniture or appliances brought to your home. Setup and installation are quoted separately.'));
    const note = document.createElement('p');
    note.className = 'calc-note project-options-note';
    note.textContent = 'Choose what you need. Materials / Supplies opens measurements and a suggested supply list. Debris Removal means hauling away project waste.';
    const firstField = panel.querySelector('.field');
    panel.insertBefore(choicesPanel, firstField);
    choicesPanel.insertAdjacentElement('afterend', deliveryDetails);
    deliveryDetails.insertAdjacentElement('afterend', note);
    const selectAllBox = selectAll.querySelector('input');
    const allChoices = () => [...choicesPanel.querySelectorAll('input[type="checkbox"]'), ...deliveryDetails.querySelectorAll('input')].filter(box => box !== selectAllBox);
    const update = () => {
      panel.classList.toggle('no-materials', !materials.checked);
      panel.querySelector('button[onclick="calcMaterial()"]').textContent = materials.checked ? 'Add Calculation' : 'Save Project Needs';
      deliveryDetails.hidden = !delivery.checked;
      if (!delivery.checked) deliveryDetails.querySelectorAll('input').forEach(box => { box.checked = false; });
      const boxes = allChoices();
      selectAllBox.checked = boxes.every(box => box.checked);
      selectAllBox.indeterminate = !selectAllBox.checked && boxes.some(box => box.checked);
    };
    selectAllBox.addEventListener('change', () => allChoices().forEach(box => { box.checked = selectAllBox.checked; }));
    choicesPanel.addEventListener('change', update);
    deliveryDetails.addEventListener('change', update);
    update();
    initPlanner(panel, update);
  };
  function initPlanner(panel, updateChoices) {
    const workspace = panel.closest('.calc-workspace');
    workspace.classList.add('guided-planner');
    panel.id = 'room-planner';
    panel.querySelector('h2').textContent = 'Plan a Room / Area';
    const side = workspace.querySelector('.calc-side');
    side.querySelectorAll(':scope > .panel').forEach((el, index) => { if (index > 0) el.remove(); });
    const summary = side.querySelector('.panel');
    summary.id = 'project-summary';
    summary.querySelector('h2').textContent = 'Materials / Supplies';
    summary.querySelectorAll(':scope > p').forEach(el => el.remove());
    document.querySelector('label[for="material-name"]').textContent = 'Which room or area?';
    document.querySelector('label[for="material-type"]').textContent = 'What are you working on?';
    const questionBox = document.createElement('section');
    questionBox.className = 'room-questions';
    document.getElementById('material-type').closest('.field').insertAdjacentElement('afterend', questionBox);
    const measurementIds = ['floor-length','floor-width','paint-length','paint-height','wood-length','wood-height','dry-length','dry-height','concrete-length','concrete-width','concrete-depth'];
    measurementIds.forEach(id => { document.getElementById(id).value = ''; });
    const types = document.getElementById('material-type');
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
        ['surface','What are you painting?',[['walls','Walls'],['ceiling','Ceiling'],unsure]],
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
    const key = () => types.value === 'flooring' ? (floorKind.value === 'tile' ? 'tile' : floorKind.value === 'floating' ? 'floating' : 'flooring') : types.value;
    const create = (tag, text, className) => { const el=document.createElement(tag); if(text)el.textContent=text; if(className)el.className=className; return el; };
    function renderQuestions(saved = {}) {
      questionBox.replaceChildren();
      floorField.hidden = types.value !== 'flooring';
      const group = questions[key()] || [];
      if(!group.length) { questionBox.append(create('p','Tell us the measured quantity below. We’ll help confirm the supplies for this item.','calc-note')); return; }
      questionBox.append(create('h3','A few quick questions'));
      const grid = create('div', '', 'calc-fields');
      group.forEach(([id,label,options]) => {
        const field=create('div','','field'), title=create('label',label), select=create('select');
        select.id='question-'+id; select.dataset.question=id; title.htmlFor=select.id;
        const placeholder=create('option','Choose one'); placeholder.value=''; select.append(placeholder);
        options.forEach(([value,text])=>{const option=create('option',text);option.value=value;select.append(option)});
        select.value=saved[id]||'';field.append(title,select);grid.append(field);
      });
      questionBox.append(grid,create('p','Not sure? That’s okay — we’ll flag it for review.','calc-note'));
      adjustLabels();
    }
    function adjustLabels() {
      const surface = document.getElementById('question-surface')?.value;
      if(types.value==='paint') {
        document.querySelector('label[for="paint-length"]').textContent=surface==='ceiling'?'Ceiling length (ft)':'Total length of the walls (ft)';
        document.querySelector('label[for="paint-height"]').textContent=surface==='ceiling'?'Ceiling width (ft)':'Wall height (ft)';
      }
      if(types.value==='drywall') {
        document.querySelector('label[for="dry-length"]').textContent=surface==='ceiling'?'Ceiling length (ft)':'Total length of the walls (ft)';
        document.querySelector('label[for="dry-height"]').textContent=surface==='ceiling'?'Ceiling width (ft)':'Wall height (ft)';
      }
    }
    types.addEventListener('change',()=>renderQuestions());
    floorKind.addEventListener('change',()=>renderQuestions());
    questionBox.addEventListener('change',adjustLabels);
    renderQuestions();
    let editingId = null;
    const roomStatus=create('p','','room-edit-status'); panel.querySelector('h2').after(roomStatus);
    const snapshot = () => [...panel.querySelectorAll('input,select')].map(el=>({id:el.id,name:el.name,value:el.value,checked:el.checked,type:el.type}));
    function restore(data) {
      data.forEach(saved=>{
        const el=saved.id?document.getElementById(saved.id):[...panel.querySelectorAll('input')].find(input=>input.name===saved.name&&input.value===saved.value);
        if(!el)return;if(el.type==='checkbox')el.checked=!!saved.checked;else el.value=saved.value;
      });
    }
    function suggestedSupplies(item, answers) {
      const group=estimateSupplyGroup(item), guide=SUPPLY_GUIDE[group];
      if(!guide)return [];
      let items=guide.items.map(([name,note])=>({name,note,selected:true}));
      if(group==='tile') {
        // Wet-area planning follows the need for a compatible waterproofing system;
        // exact assemblies and quantities still require manufacturer instructions.
        if(answers.wet==='dry' && answers.surface!=='shower')items=items.filter(x=>!x.name.includes('Waterproofing'));
        if(answers.surface==='shower')items.push({name:'Shower base, drain and compatible waterproofing accessories',note:'Confirm the complete shower system and layout before ordering.',selected:true});
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
      const error=document.getElementById('mat-error');
      const answers={};
      if(panel.querySelector('[name="project-option"][value="Materials"]').checked) {
        for(const input of questionBox.querySelectorAll('select')) {
          if(!input.value){error.hidden=false;error.textContent='Answer the quick questions, or choose “Not sure.”';input.focus();return;}
          answers[input.dataset.question]=input.value;
        }
      }
      const form=snapshot(), last=materialEstimates[materialEstimates.length-1], sourceQuery=location.search;
      originalCalc();
      const item=materialEstimates[materialEstimates.length-1];
      if(!item||item===last)return;
      const oldIndex=editingId?materialEstimates.findIndex(x=>x.roomId===editingId):-1;
      item.roomId=editingId||'room-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
      item.roomName=document.getElementById('material-name').value.trim()||'Room / Area '+(oldIndex>=0?oldIndex+1:materialEstimates.length);
      item.answers=answers;item.form=form;item.sourceQuery=sourceQuery;
      item.suggestedSupplies=item.type==='plan'?[]:suggestedSupplies(item,answers);
      if(oldIndex>=0&&oldIndex<materialEstimates.length-1){materialEstimates.pop();materialEstimates[oldIndex]=item;}
      editingId=null;roomStatus.textContent='Room saved. Add another area below or review your project.';
      saveMaterialEstimates();window.renderMaterialEstimates();
      summary.scrollIntoView({behavior:'smooth',block:'start'});
    };
    function editRoom(item) {
      editingId=item.roomId||(item.roomId='room-'+Date.now());
      history.replaceState(null,'',location.pathname+(item.sourceQuery||''));
      if(item.form) {
        restore(item.form);showMaterialFields();renderQuestions(item.answers);restore(item.form);
      }else{
        types.value=item.type==='plan'?'flooring':item.type||'flooring';
        if(item.floorKind)floorKind.value=item.floorKind;
        panel.querySelector('[name="project-option"][value="Materials"]').checked=item.type!=='plan';
        document.getElementById('material-name').value=item.roomName||item.title.split(' — ')[1]||'';
        measurementIds.forEach(id=>{document.getElementById(id).value=''});
        showMaterialFields();renderQuestions();
      }
      document.getElementById('exact-product-fields').hidden=!new URLSearchParams(location.search).has('product');
      updateChoices();adjustLabels();
      panel.querySelector('button[onclick="calcMaterial()"]').textContent='Save Changes';
      roomStatus.textContent='Editing '+(item.roomName||item.title)+'. Your saved room stays unchanged until you save.';
      panel.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function newRoom() {
      editingId=null;history.replaceState(null,'',location.pathname);
      panel.querySelectorAll('input[type="checkbox"]').forEach(el=>{el.checked=false;el.indeterminate=false});
      document.getElementById('material-name').value='';
      measurementIds.forEach(id=>{document.getElementById(id).value=''});
      ['exact-brand','exact-model','exact-color','exact-identifier','floor-box'].forEach(id=>{document.getElementById(id).value=''});
      document.getElementById('exact-product-fields').hidden=true;
      document.getElementById('mat-error').hidden=true;
      roomStatus.textContent='New room / area';renderQuestions();updateChoices();
      panel.scrollIntoView({behavior:'smooth',block:'start'});document.getElementById('material-name').focus({preventScroll:true});
    }
    function addProjectToCart() {
      const cart=getCart().filter(x=>x.source!=='project-calculator');
      materialEstimates.forEach(item=>{
        const room=item.roomName||item.title;
        const add=(name,type)=>cart.push({name:room+': '+name,type,qty:1,source:'project-calculator',roomId:item.roomId});
        if(item.type!=='plan')add(item.result+' — '+item.title,'Material estimate');
        (item.suggestedSupplies||[]).filter(x=>x.selected).forEach(x=>add(x.name+' — quantity to confirm','Supply request'));
        (Array.isArray(item.labor)?item.labor:item.labor?[item.labor]:[]).forEach(x=>add(x.service+' — '+x.quantity+' '+x.unit,'Labor'));
        if(item.projectOptions?.includes('Tools'))add('Tools needed for this project','Tools request');
        if(item.projectOptions?.includes('Debris Removal'))add('Debris Removal','Service');
        if(item.projectOptions?.includes('Delivery'))(item.deliveryTypes?.length?item.deliveryTypes:['Delivery']).forEach(x=>add(x,'Service'));
      });
      saveCart(cart);document.getElementById('project-cart-status').textContent='Project added. Review your cart when you’re ready.';
    }
    window.renderMaterialEstimates=function() {
      originalRender();side.hidden=materialEstimates.length===0;
      if(!materialEstimates.length)return;
      [...document.querySelectorAll('#material-results > .material-result')].forEach((row,index)=>{
        const item=materialEstimates[index], info=row.firstElementChild;
        if(item.roomName)info.querySelector('strong').textContent=item.roomName+' — '+(item.type==='plan'?'Project needs':item.title.split(' — ')[0]);
        const edit=create('button',item.form?'Edit Room / Area':'Edit / Recalculate','btn outline');edit.type='button';edit.onclick=()=>editRoom(item);info.append(edit);
        if(item.suggestedSupplies){
          info.querySelectorAll('a[href*="supplies.html"],button').forEach(el=>{if(el!==edit)el.remove()});
          const checklist=create('div','','room-supply-list');
          if(item.suggestedSupplies.length){checklist.append(create('h3','Suggested supplies'),create('p','Uncheck anything you already have. Product coverage and compatibility determine final quantities.','calc-note'));
            item.suggestedSupplies.forEach(supply=>{
              const label=create('label','','room-supply-choice'),box=create('input'),copy=create('span',supply.name),small=create('small',supply.note);
              box.type='checkbox';box.checked=supply.selected;box.addEventListener('change',()=>{supply.selected=box.checked;saveMaterialEstimates()});copy.append(small);label.append(box,copy);checklist.append(label);
            });
          }
          const unknown=Object.values(item.answers||{}).includes('unsure');
          if(unknown)checklist.append(create('p','Some details need a quick review because you chose “Not sure.”','calc-note'));
          info.append(checklist);
        }
      });
      summary.querySelector('.project-summary-actions')?.remove();
      const actions=create('div','','project-summary-actions'),another=create('button','Add Another Room / Area','btn outline'),cartButton=create('button','Add Project to Cart','btn primary'),review=create('a','Review Project Cart →','btn outline'),status=create('p','','calc-note');
      another.type=cartButton.type='button';another.onclick=newRoom;cartButton.onclick=addProjectToCart;review.href='/project-cart.html';status.id='project-cart-status';status.setAttribute('role','status');
      actions.append(another,cartButton,review,status,create('p','Planning list for a quote. Adding it again updates these rooms in your cart.','calc-note'));summary.append(actions);
    };
    window.renderMaterialEstimates();
  }

  init();
  if (!document.querySelector('.labor-choices')) {
    const observer = new MutationObserver(() => {
      if (document.querySelector('.labor-choices')) { observer.disconnect(); init(); }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }
})();
