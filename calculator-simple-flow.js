(() => {
  const TOOL_GUIDE = {
    flooring: ['Tape measure', 'Utility knife', 'Straightedge or square', 'Spacers', 'Rubber mallet'],
    tile: ['Tape measure', 'Tile cutter or wet saw', 'Notched trowel', 'Level', 'Grout float', 'Sponges'],
    paint: ['Tape measure', 'Paint roller and frame', 'Brushes', 'Paint tray', 'Drop cloths', 'Painter’s tape'],
    drywall: ['Tape measure', 'Utility knife', 'Drywall square', 'Screw gun or drill', 'Taping knives', 'Sanding tools'],
    lumber: ['Tape measure', 'Square', 'Circular or miter saw', 'Drill or impact driver', 'Level'],
    concrete: ['Tape measure', 'Level', 'Mixing tools', 'Shovel', 'Concrete float or trowel']
  };

  function initSimpleFlow() {
    if (document.body.dataset.page !== 'calculators') return;
    const choices = document.querySelector('.labor-choices');
    if (!choices || choices.dataset.projectOptions !== '1') return setTimeout(initSimpleFlow, 50);

    const supplies = choices.querySelector('[name="project-option"][value="Materials"]');
    if (supplies) {
      const span = supplies.closest('label')?.querySelector('span');
      if (span) span.firstChild.textContent = 'Materials / Supplies';
    }

    const oldTools = choices.querySelector('[name="project-option"][value="Tools"]')?.closest('label');
    if (oldTools) oldTools.remove();

    const installation = choices.querySelector('[value="Installation"]');
    const panel = choices.closest('.panel');
    if (!installation || !panel || document.getElementById('recommended-tools')) return;

    const toolBox = document.createElement('section');
    toolBox.id = 'recommended-tools';
    toolBox.className = 'panel recommended-tools';
    toolBox.hidden = true;
    toolBox.innerHTML = '<h3>Recommended Tools</h3><p class="calc-note">Doing the work yourself? These are the basic tools recommended for this project.</p><ul></ul>';
    panel.append(toolBox);

    const type = document.getElementById('material-type');
    const floorKind = document.getElementById('floor-kind');
    const list = toolBox.querySelector('ul');

    function currentGuide() {
      if (type?.value === 'flooring' && floorKind?.value === 'tile') return TOOL_GUIDE.tile;
      return TOOL_GUIDE[type?.value] || [];
    }

    function updateTools() {
      const tools = currentGuide();
      const diy = !installation.checked;
      toolBox.hidden = !(diy && tools.length);
      list.replaceChildren(...tools.map(name => {
        const li = document.createElement('li');
        li.textContent = name;
        return li;
      }));
    }

    choices.addEventListener('change', updateTools);
    type?.addEventListener('change', updateTools);
    floorKind?.addEventListener('change', updateTools);
    updateTools();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSimpleFlow);
  else initSimpleFlow();
})();