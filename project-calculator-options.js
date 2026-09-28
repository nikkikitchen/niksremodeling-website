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
  };
  init();
  if (!document.querySelector('.labor-choices')) {
    const observer = new MutationObserver(() => {
      if (document.querySelector('.labor-choices')) { observer.disconnect(); init(); }
    });
    observer.observe(document.documentElement, {childList: true, subtree: true});
  }
})();
