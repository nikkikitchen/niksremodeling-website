(()=>{
 const params=new URLSearchParams(location.hash.slice(1)),token=params.get('quote'),order=params.get('order');
 const status=document.getElementById('payment-status'),details=document.getElementById('payment-details');
 const money=n=>(n/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function read(url,options){const r=await fetch(url,{cache:'no-store',...options});const b=await r.json();if(!r.ok)throw Error(b.error||'Request unavailable.');return b;}
 async function check(id){
  status.textContent='Verifying payment with Square…';
  try{
   const b=await read('/api/payment-status?order='+encodeURIComponent(id));
   status.textContent=(b.sandbox?'Sandbox test — ':'')+(b.status==='paid'?'Payment confirmed.':b.status==='review'?'Payment requires owner review. Contact us before retrying.':'Payment has not been confirmed. A return from checkout does not confirm payment.');
   details.innerHTML='<p>Amount: '+money(b.totalCents)+'</p>'+(b.balanceCents!==null?'<p>Remaining project balance: '+money(b.balanceCents)+'</p>':'')+'<p>Reference: '+escape(id)+'</p>'+(b.status==='paid'?'<p>Thank you. We will review the order or project details before fulfillment or scheduling.</p>':'')+'<button type="button" class="btn outline" id="refresh-payment">Check payment again</button>';
   if(b.checkoutUrl){const a=document.createElement('a');a.textContent='Continue Square checkout';a.href=b.checkoutUrl;a.rel='noopener noreferrer';a.className='btn primary';details.append(a);}
   if(b.receiptUrl){const a=document.createElement('a');a.textContent='View Square receipt';a.href=b.receiptUrl;a.rel='noopener noreferrer';a.className='btn primary';details.append(a);}
   document.getElementById('refresh-payment').onclick=()=>check(id);
  }catch(e){status.textContent=e.message;details.innerHTML='<button class="btn outline" id="retry">Check again</button>';document.getElementById('retry').onclick=()=>check(id);}
 }
 async function quote(){
  try{
   const q=await read('/api/project-quote?token='+encodeURIComponent(token));
   if(q.checkout){await check(q.checkout.orderId);return;}
   status.textContent='Approved quote. Review the scope and amounts before payment.';
   details.innerHTML='<h2>'+escape(q.projectName)+'</h2><p style="white-space:pre-wrap">'+escape(q.scope)+'</p><table style="width:100%"><thead><tr><th>Item</th><th>Amount</th></tr></thead><tbody>'+q.items.map(i=>'<tr><td>'+escape(i.name)+'</td><td>'+money((i.category==='discount'?-1:1)*i.amountCents)+'</td></tr>').join('')+'</tbody></table><p><strong>Approved total: '+money(q.totalCents)+'</strong></p><p>Deposit: '+money(q.depositCents)+' · Balance after deposit: '+money(q.totalCents-q.depositCents)+'</p><p>Valid until '+escape(new Date(q.expiresAt).toLocaleDateString())+'. A payment does not confirm a job date.</p><form id="approved-payment"><label>Payment option <select name="mode"><option value="deposit">Deposit — '+money(q.depositCents)+'</option>'+(q.allowFull?'<option value="full">Full project — '+money(q.totalCents)+'</option>':'')+'</select></label><p><label><input type="checkbox" name="terms" required> I approve this scope and quote and agree to the <a href="/terms.html">terms</a>.</label></p><button class="btn primary" type="submit">Pay securely with Square</button></form>';
   const form=document.getElementById('approved-payment');let busy=false;
   form.onsubmit=async e=>{
    e.preventDefault();if(busy||!form.reportValidity())return;busy=true;form.querySelector('button').disabled=true;
    status.textContent='Starting secure checkout…';
    try{const mode=form.elements.mode.value;const b=await read('/api/project-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,mode,termsAccepted:true,expectedTotal:mode==='full'?q.totalCents:q.depositCents})});location.assign(b.url);}
    catch(error){status.textContent=error.message;busy=false;form.querySelector('button').disabled=false;}
   };
  }catch(error){status.textContent=error.message;}
 }
 if(order)check(order);else if(token)quote();else status.textContent='Open the private quote or order link provided by Nik’s Remodeling.';
})();
