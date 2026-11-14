export const transactionHtml=`<section id="transactions"><h2>Payments and scheduling</h2><p>Review saved scheduling requests and payment records. No supplier orders are placed automatically.</p><button type="button" id="load-transactions">Refresh requests & payments</button><div id="transaction-list"></div><h3>Approve a project quote</h3><p>Approve only after scope, supplier costs and applicable taxes have been checked. This creates a private customer payment link. Quote amounts cannot be edited after approval.</p><form id="approve-quote"><div class="fields"><label>Customer name<input name="customerName" required maxlength="90"></label><label>Customer email<input name="customerEmail" type="email" required></label><label>Project name<input name="projectName" required maxlength="200"></label><label>Measurements and approved scope<textarea name="scope" required maxlength="6000"></textarea></label><label>Labor before discount · $<input name="labor" type="number" min="0" step="0.01" required></label><label>Verified material purchase cost · $<input name="materialsCost" type="number" min="0" step="0.01" required></label><label>Supplies selling amount · $<input name="supplies" type="number" min="0" step="0.01" required></label><label>Project fees · $<input name="fees" type="number" min="0" step="0.01" required></label><label>Removal and haul-off · $<input name="removal" type="number" min="0" step="0.01" required></label><label>Approved sales tax · $<input name="tax" type="number" min="0" step="0.01" required></label><label>Approved deposit · $<input name="deposit" type="number" min="0.01" step="0.01" required></label><label>Quote valid until<input name="expires" type="date" required></label><label class="check"><input name="discount" type="checkbox" checked>Apply existing 7% labor package discount</label><label class="check"><input name="allowFull" type="checkbox">Offer full-project payment</label><label class="check"><input name="scopeApproved" type="checkbox" required>I verified scope and all costs, including any required supplies and removal.</label><label class="check"><input name="taxReviewed" type="checkbox" required>I verified applicable tax treatment and the tax amount.</label></div><p id="quote-preview" role="status"></p><button type="submit">Approve quote & create customer link</button></form><p id="quote-result" role="status"></p></section>`;
export const transactionJs=String.raw`
(()=>{
 const list=document.getElementById('transaction-list'),form=document.getElementById('approve-quote'),result=document.getElementById('quote-result');
 const money=n=>(n/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
 async function api(path,body){const r=await fetch('/api/project-admin/'+path,{cache:'no-store',...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});const b=await r.json();if(!r.ok)throw Error(b.error||'Operation failed.');return b;}
 document.getElementById('load-transactions').onclick=async()=>{
  list.textContent='Loading…';
  try{
   const [s,o,q]=await Promise.all([api('scheduling'),api('orders'),api('quotes')]);list.replaceChildren();
   for(const r of s.requests){
    const box=document.createElement('article'),text=document.createElement('p');
    text.textContent=r.customer_name+' · '+r.phone+' · '+r.email+' · preferred '+r.preferred_date+' · '+r.zip+' · '+r.status+' — '+r.project_details+(r.owner_note?' — Review note: '+r.owner_note:'');box.append(text);
    if(r.status==='requested')for(const decision of ['accepted','declined']){
     const b=document.createElement('button');b.type='button';b.textContent=decision==='accepted'?'Accept request':'Decline request';
     b.onclick=async()=>{const note=prompt('Enter the date and details you will communicate to the customer. Saving does not send email.');if(!note)return;b.disabled=true;try{const saved=await api('scheduling',{id:r.id,status:decision,note});alert(saved.message);document.getElementById('load-transactions').click();}catch(e){alert(e.message);b.disabled=false;}};box.append(b);
    }
    list.append(box);
   }
   if(!s.requests.length)list.append(document.createTextNode('No scheduling requests.'));
   for(const order of o.orders){
    const customer=JSON.parse(order.customer_json),quote=JSON.parse(order.quote_json),p=document.createElement('p');
    p.textContent=order.kind+' · '+order.id+' · '+order.status+' · '+money(order.total_cents)+' · '+customer.email+(customer.address?' · Deliver to '+[customer.address,customer.city,customer.state,customer.zip].join(', '):'')+' · '+(quote.name||'Project quote '+order.project_quote_id)+(quote.productId?' · CJ product '+quote.productId+' / variant '+quote.variantId+' / SKU '+quote.sku+' / '+quote.shippingMethod:'')+' · Square payment '+(order.payment_id||'unconfirmed')+' · fulfillment hold';list.append(p);
    if(order.receipt_url){const a=document.createElement('a');a.href=order.receipt_url;a.textContent='View Square receipt';a.rel='noopener noreferrer';list.append(a);}
   }
   for(const quote of q.quotes){const p=document.createElement('p');p.textContent=quote.project_name+' · '+quote.customer_email+' · approved '+money(quote.total_cents)+' · deposit '+money(quote.deposit_cents)+' · '+(quote.revoked?'revoked':'valid until '+quote.expires_at)+' ';if(!quote.revoked){const a=document.createElement('a');a.href='/payment.html#quote='+encodeURIComponent(quote.token);a.textContent='Private customer quote link';p.append(a);}list.append(p);}
  }catch(e){list.textContent=e.message;}
 };
 function values(){
  const cents=n=>Math.round(Number(form.elements.namedItem(n).value)*100);
  const items=[{name:'Labor',category:'labor',amountCents:cents('labor')}];const cost=cents('materialsCost');
  if(cost>0)items.push({name:'Materials (35% markup)',category:'materials',costCents:cost,amountCents:Math.ceil(cost*135/100)});
  for(const category of ['supplies','fees','removal','tax'])items.push({name:category,category,amountCents:cents(category)});
  if(form.elements.discount.checked)items.push({name:'7% labor package discount',category:'discount',amountCents:Math.round(cents('labor')*0.07)});
  const totalCents=items.reduce((n,i)=>n+(i.category==='discount'?-1:1)*i.amountCents,0);return {items,totalCents};
 }
 form.oninput=()=>{const q=values();document.getElementById('quote-preview').textContent='Approved total: '+money(q.totalCents)+' · Balance after deposit: '+money(q.totalCents-Math.round(Number(form.elements.deposit.value)*100));};
 let busy=false;
 form.onsubmit=async e=>{
  e.preventDefault();if(busy||!form.reportValidity())return;
  const q=values();if(!confirm('Approve the itemized quote for '+money(q.totalCents)+'?'))return;
  busy=true;form.querySelector('button').disabled=true;
  try{const data={...q};for(const key of ['customerName','customerEmail','projectName','scope'])data[key]=form.elements.namedItem(key).value;
   Object.assign(data,{depositCents:Math.round(Number(form.elements.deposit.value)*100),allowFull:form.elements.allowFull.checked,scopeApproved:form.elements.scopeApproved.checked,taxReviewed:form.elements.taxReviewed.checked,expiresAt:form.elements.expires.value+'T23:59:59Z'});
   const saved=await api('quotes',data);result.textContent='Approved. Copy and send this private link to the customer: ';const a=document.createElement('a');a.href=saved.url;a.textContent=saved.url;result.append(a);form.reset();
  }catch(e){result.textContent=e.message;}finally{busy=false;form.querySelector('button').disabled=false;}
 };
})();`;
