(() => {
  const init = () => {
    if (document.body.dataset.page !== 'calculators') return;
    const labor = document.querySelector('.labor-choices');
    if (!labor || labor.dataset.projectOptions === '1') return;
    labor.dataset.projectOptions = '1';
    labor.classList.add('project-options');

    const legend = labor.querySelector('legend');
    if (legend) legend.textContent = 'What do you need for this project?';

    const existing = [...labor.querySelectorAll('label')];
    const makeBox = (label, name = 'project-option', value = label) => {
      const el = document.createElement('label');
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.name = name;
      box.value = value;
      el.append(box, document.createTextNode(' ' + label));
      return el;
    };

    labor.prepend(makeBox('Tools'));
    labor.prepend(makeBox('Supplies'));
    labor.prepend(makeBox('Materials'));
    labor.append(makeBox('Delivery', 'labor-service', 'Delivery'));

    const selectAll = makeBox('Select All', 'project-select-all', 'all');
    const selectAllBox = selectAll.querySelector('input');
    labor.append(selectAll);

    const choices = () => [...labor.querySelectorAll('input[type="checkbox"]')].filter(box => box !== selectAllBox);
    selectAllBox.addEventListener('change', () => choices().forEach(box => { box.checked = selectAllBox.checked; }));
    labor.addEventListener('change', event => {
      if (event.target === selectAllBox) return;
      const boxes = choices();
      selectAllBox.checked = boxes.length > 0 && boxes.every(box => box.checked);
    });

    const note = document.createElement('p');
    note.className = 'calc-note project-options-note';
    note.textContent = 'Click all that apply. Enter your project measurements below and the Project Calculator will calculate the selected parts of your project.';
    labor.insertAdjacentElement('afterend', note);

    const form = labor.closest('form') || labor.parentElement;
    if (form) {
      const firstField = form.querySelector('.field');
      if (firstField && firstField !== labor) form.insertBefore(labor, firstField);
      if (labor.nextElementSibling !== note) labor.insertAdjacentElement('afterend', note);
    }

    document.querySelectorAll('h1,h2').forEach(h => {
      if (/material calculator|project calculators/i.test(h.textContent.trim())) h.textContent = 'Project Calculator';
    });
  };

  init();
  if (!document.querySelector('.labor-choices')) {
    const observer = new MutationObserver(() => {
      if (document.querySelector('.labor-choices')) { observer.disconnect(); init(); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();