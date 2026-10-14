(() => {
 function init(){
  const panel=document.getElementById('room-planner'),summary=document.getElementById('project-summary');
  if(!panel||!summary||panel.dataset.stepsReady)return;
  panel.dataset.stepsReady='1';
  const workspace=panel.closest('.calc-workspace'),side=summary.closest('.calc-side');
  workspace.classList.add('three-step-calculator');
  const style=document.createElement('style');style.textContent=`.three-step-calculator{display:block!important;max-width:820px;margin:auto}.calculator-progress{display:flex;gap:16px;margin:0 0 24px}.calculator-progress span{flex:1;border-bottom:3px solid var(--line);padding:12px 0;font-weight:600}.calculator-progress [aria-current=step]{border-color:var(--blue);color:var(--blue)}.wizard-hidden{display:none!important}.wizard-controls{display:flex;justify-content:space-between;gap:12px;margin-top:22px}.wizard-controls .wizard-next{margin-left:auto}.three-step-calculator .calc-side{position:static}.three-step-calculator .panel{box-shadow:none}.wizard-own{display:flex;align-items:center;gap:10px;margin:18px 0}.wizard-own input{width:20px;height:20px}.three-step-calculator #recommended-tools{display:none}body[data-page=calculators] .project-flow,body[data-page=calculators] .project-shopping-bar{display:none!important}body[data-page=calculators]{padding-bottom:20px}.three-step-calculator .project-summary-actions{display:flex;flex-wrap:wrap;gap:10px}@media(max-width:600px){.calculator-progress{gap:9px;font-size:12px}}`;document.head.append(style);
  const progress=document.createElement('div');progress.className='calculator-progress';progress.setAttribute('aria-label','Calculator progress');progress.innerHTML='<span>1 · Choose work</span><span>2 · Size & options</span><span>3 · Your estimate</span>';workspace.prepend(progress);
  const title=panel.querySelector('h2'),calculate=panel.querySelector('button[onclick="calcMaterial()"]');
  const first=new Set(['material-name','project-location','material-type'].map(id=>document.getElementById(id)?.closest('.field')).filter(Boolean));
  const own=document.createElement('label');own.className='wizard-own';own.innerHTML='<input type="checkbox" id="customer-provides-materials"> I already have the materials / fixture (installation supplies remain included for bathroom packages)';
  document.getElementById('work-services').before(own);
  const controls=document.createElement('div');controls.className='wizard-controls';controls.innerHTML='<button type="button" class="btn outline wizard-back">Back</button><button type="button" class="btn primary wizard-next">Next</button>';workspace.append(controls);
  const back=controls.firstElementChild,next=controls.lastElementChild;
  const review=document.createElement('a');review.href='/project-cart.html';review.target='_top';review.className='btn primary';review.textContent='Review Cart';review.hidden=true;controls.append(review);
  let current=1,saved=false;
  document.addEventListener('project-saved-to-cart',()=>{saved=true;next.hidden=true;back.hidden=false;back.textContent='Keep shopping';review.hidden=false;});
  const error=document.getElementById('mat-error');error.setAttribute('role','alert');
  function show(step){current=step;saved=false;review.hidden=true;back.textContent=step===3?'Edit Options':'Back';workspace.dataset.step=step;progress.querySelectorAll('span').forEach((el,i)=>{if(i+1===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});panel.classList.toggle('wizard-hidden',step===3);side.classList.toggle('wizard-hidden',step!==3);if(step===3)side.hidden=false;
   [...panel.children].forEach(el=>{if(el===title||el===error)return;el.classList.toggle('wizard-hidden',el===calculate||(step===1?!first.has(el):first.has(el)));});
   title.textContent=step===1?'What would you like done?':'Size & options';summary.querySelector('h2').textContent='Your estimate';back.hidden=step===1||step===3;next.hidden=false;next.textContent=step===3?'Add to Cart':step===2?'See Price':'Next';own.hidden=['misc','delivery','debris','prep'].includes(document.getElementById('material-type').value);
  }
  next.onclick=()=>{if(current===3){window.addProjectToCart();return;}if(current===1){for(const id of ['material-name','project-location','material-type']){const input=document.getElementById(id);if(!input.value){error.textContent=id==='material-name'?'Name the room or area.':id==='project-location'?'Choose interior or exterior.':'Choose the work you need.';error.hidden=false;input.focus();return;}}error.hidden=true;show(2);}else{window.calcMaterial();if(error.hidden&&materialEstimates.length){show(3);summary.scrollIntoView({behavior:'smooth',block:'start'});}else if(!error.hidden){error.scrollIntoView({behavior:'smooth',block:'center'});}}};
  back.onclick=()=>{if(saved){window.startMoreProjectWork();show(1);}else show(current===3?2:1);};
  document.addEventListener('estimate-rendered',()=>{if(current===3&&!materialEstimates.length)show(2);});
  summary.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(/Edit|Recalculate/.test(button.textContent))show(2);else if(/Add Work|Add Another/.test(button.textContent)){own.querySelector('input').checked=false;show(1);}});
  document.addEventListener('work-options-change',()=>{if(current!==3)show(current);});
  const editId=new URLSearchParams(location.search).get('editRoom');if(editId){const saved=materialEstimates.find(x=>x.roomId===editId);own.querySelector('input').checked=!!saved?.customerProvidesMaterials;}
  const context=new URLSearchParams(location.search);show(context.get('embedded')&&context.get('room')&&context.get('material')?2:1);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();

