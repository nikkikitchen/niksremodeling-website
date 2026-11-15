import {test,expect} from '@playwright/test';
const product={name:'Verified fixture',type:'Product',source:'supplier-retail',qty:1,price:100,productId:'1963146233541074945',variantId:'1963146233666904066'};
test.beforeEach(async({page})=>{
 await page.route('**/api/**',route=>route.fulfill({status:503,json:{error:'Verification unavailable',checkoutEnabled:false}}));
 await page.route(/https:\/\//,route=>route.abort());
});
test('homepage to shopping cart verifies final total and sends stable checkout identity',async({page})=>{
 let request,quotes=0;
 await page.goto('/');const menu=page.locator('button[aria-controls$="shopping-menu"]:visible').first();const id=await menu.getAttribute('aria-controls');await menu.click();await page.locator('#'+id).getByRole('button',{name:/^Appliances/}).click();await page.locator('#'+id+' a[href*="category=Refrigerators"]').first().click();
 await expect(page).toHaveURL(/appliances.html/);
 await page.evaluate(item=>localStorage.setItem('nr-cart',JSON.stringify([item])),product);
 await page.goto('/project-cart.html');
 await page.locator('#cart-shipping-zip').fill('30117');await page.locator('#square-ship-address').fill('123 Main St');await page.locator('#square-ship-city').fill('Carrollton');await page.locator('#square-ship-state').fill('GA');
 await page.locator('#cart-receipt-email').fill('buyer@example.test');await page.locator('#cart-terms-agree').check();
 await page.route('**/api/store-quote?**',route=>{quotes++;return route.fulfill({json:{checkoutEnabled:true,productCents:10000,deliveryCents:1537,taxCents:808,totalCents:12345,variantId:product.variantId,stock:10}});});
 await page.route('**/api/store-checkout',route=>{request=route.request().postDataJSON();return route.fulfill({status:503,json:{error:'Processor unavailable'}});});
 page.on('dialog',d=>d.accept());
 await page.locator('#cart-pay-button').click();await expect(page.locator('#cart-pay-status')).toContainText('Processor unavailable');
 await expect(page.locator('#cart-verified-breakdown')).toContainText('merchandise $100.00 + delivery $15.37 + destination sales tax $8.08 = $123.45');
 const first=request.requestId;expect(request.expectedTotal).toBe(12345);expect(request.email).toBe('buyer@example.test');expect(request.termsAccepted).toBe(true);
 await page.reload();await page.locator('#cart-shipping-zip').fill('30117');await page.locator('#square-ship-address').fill('123 Main St');await page.locator('#square-ship-city').fill('Carrollton');await page.locator('#square-ship-state').fill('GA');await page.locator('#cart-receipt-email').fill('buyer@example.test');await page.locator('#cart-terms-agree').check();
 await page.locator('#cart-pay-button').click();await expect(page.locator('#cart-pay-status')).toContainText('Processor unavailable');expect(request.requestId).toBe(first);expect(quotes).toBe(2);
});
test('multi-item, multiple quantity and mixed carts remain explicitly quote-only',async({page})=>{
 for(const items of [[product,product],[{...product,qty:2}],[product,{name:'Labor',type:'Labor',price:150,qty:1}]]){
  await page.goto('/');await page.evaluate(items=>localStorage.setItem('nr-cart',JSON.stringify(items)),items);await page.goto('/project-cart.html');await expect(page.locator('#cart-pay-button')).toBeHidden();await expect(page.getByRole('button',{name:'Continue to checkout',exact:true})).toHaveCount(1);await expect(page.locator('#project-checkout-button')).toBeEnabled();
 }
});
test('measured Accent Standard requests scheduling and displays received reference without booking confirmation',async({page})=>{
 await page.goto('/');const menu=page.locator('button[aria-controls$="projects-menu"]:visible').first();const id=await menu.getAttribute('aria-controls');await menu.click();await page.locator('#'+id+' a[href="/project.html?project=accents"]').first().click();
 const standard=page.locator('.pkg-choice').nth(1);
 await expect(standard.locator('img')).toHaveAttribute('src','/assets/accent-standard-approved.jpg');
 await expect(standard).toContainText('Starting at $835');
 await standard.locator('.pkg-add').click();await expect(page.locator('#pkg-measure-form')).toBeVisible();
 await page.locator('#pkg-length-ft').fill('12');await page.locator('#pkg-height-ft').fill('8');
 await page.locator('#pkg-measure-form button[type=submit]').click();await expect(page.locator('#pkg-measure-result')).toBeVisible();
 await page.locator('#pkg-confirm-add').click();await expect(page).toHaveURL(/project-cart.html/);
 const cart=await page.evaluate(()=>JSON.parse(localStorage.getItem('nr-cart')));
 expect(cart).toHaveLength(1);expect(cart[0]).toMatchObject({projectId:'accents',packageId:'deluxe',startingAt:835,depositEstimate:242.39,laborEstimate:511.5,overheadAllowance:81.11,price:null,quoteRequired:true,measurements:{length:12,height:8,wallArea:96}});
 await expect(page.locator('img[src="/assets/accent-standard-approved.jpg"]').first()).toBeVisible();
 await expect(page.locator('#cart-combined-project-total')).toContainText('$835.00');
 await expect(page.locator('input[name=zip]:visible')).toHaveCount(1);
 await expect(page.getByText('Payment after final approval:',{exact:false})).toHaveCount(0);
 await expect(page.getByText('Some items require a quote.',{exact:true})).toHaveCount(0);
 await expect(page.locator('.cart-combined-project-row:visible')).toHaveCount(1);
 await expect(page.locator('.nr-cart-package-price:visible')).toHaveCount(0);
 await expect(page.locator('#cart-shipping-amount')).toHaveText('Included');
 const form=page.locator('#nr-scheduling-form');
 await expect(page.locator('#cart-pay-button')).toBeHidden();await expect(page.locator('.nr-cart-approval-next a')).toHaveText('Request start date');
 await expect(page.locator('#project-checkout-button')).toBeVisible();await expect(page.locator('#project-checkout-button')).toBeEnabled();
 await expect(page.locator('#cart-scheduling')).toBeHidden();
 await page.locator('.nr-cart-approval-next a').click();
 await expect(page.locator('#cart-scheduling')).toBeVisible();
 for(const field of await form.locator('input:visible').all())expect((await field.boundingBox()).height).toBeGreaterThanOrEqual(44);
 await form.locator('[name=name]').fill('Customer');await form.locator('[name=phone]').fill('555-555-5555');await form.locator('[name=email]').fill('customer@example.test');await form.locator('[name=notes]').fill('Please review the existing wall damage.');await form.locator('[name=date]').fill('2099-01-01');await page.locator('#cart-shipping-zip').fill('30117');
 let attempt=0,requestId;
 await page.route('**/api/scheduling',route=>{const b=route.request().postDataJSON();expect(b.details).toContain('12 × 8');expect(b.details).toContain('existing wall damage');expect(b.details).toContain('selected work:');if(!attempt++){requestId=b.requestId;return route.fulfill({status:503,json:{error:'Request service unavailable'}});}expect(b.requestId).toBe(requestId);return route.fulfill({status:201,json:{reference:'request-test',status:'requested',message:'Your request was received for owner review. Your preferred date is not confirmed.'}});});
 await form.locator('button').click();await expect(page.locator('#nr-scheduling-status')).toContainText('was not saved');await expect(page.locator('#nr-scheduling-status a')).toHaveAttribute('href',/^mailto:/);expect(new URL(await page.locator('#nr-scheduling-status a').getAttribute('href')).searchParams.get('body')).toContain('existing wall damage');await expect(form.locator('button')).toBeEnabled();
 await form.locator('button').click();await expect(page.locator('#nr-scheduling-status')).toContainText('request-test');await expect(page.locator('#nr-scheduling-status')).toContainText('not confirmed');await expect(form.locator('button')).toBeDisabled();
});
for(const mode of ['deposit','full'])test('approved '+mode+' shows itemization and sends approved amount',async({page})=>{
 const token='a'.repeat(72);let checkout;
 await page.route('**/api/project-quote?**',route=>route.fulfill({json:{projectName:'Approved bathroom',scope:'Measured scope',items:[{name:'Labor',category:'labor',amountCents:10000},{name:'Materials',category:'materials',amountCents:13500}],totalCents:23500,depositCents:13500,allowFull:true,expiresAt:'2099-01-01T00:00:00Z'}}));
 await page.route('**/api/project-checkout',route=>{checkout=route.request().postDataJSON();return route.fulfill({status:503,json:{error:'Sandbox not configured'}});});
 await page.goto('/payment.html#quote='+token);await expect(page.locator('#payment-details')).toContainText('$235.00');await page.locator('select[name=mode]').selectOption(mode);await page.locator('[name=terms]').check();await page.getByRole('button',{name:'Pay securely with Square'}).click();await expect(page.locator('#payment-status')).toContainText('Sandbox not configured');expect(checkout.expectedTotal).toBe(mode==='full'?23500:13500);expect(checkout.token).toBe(token);
});
test('payment return cannot claim success until server confirms completed payment',async({page})=>{
 let paid=false;await page.route('**/api/payment-status?**',route=>route.fulfill({json:{status:paid?'paid':'pending',totalCents:13500,balanceCents:paid?10000:23500,receiptUrl:null,sandbox:true}}));
 await page.goto('/payment.html#order=00000000-0000-4000-8000-000000000000');await expect(page.locator('#payment-status')).toContainText('has not been confirmed');paid=true;await page.getByRole('button',{name:'Check payment again'}).click();await expect(page.locator('#payment-status')).toContainText('Payment confirmed');await expect(page.locator('#payment-details')).toContainText('Remaining project balance: $100.00');
});

for(const project of ['bathrooms','kitchen-pantry'])test(project+' Standard carries measurements and requires approved quote',async({page})=>{
 await page.goto('/project.html?project='+project);await page.locator('.pkg-choice').nth(1).locator('.pkg-add').click();
 await page.locator('#pkg-length-ft').fill('10');await page.locator('#pkg-width-ft').fill('10');await page.locator('#pkg-height-ft').fill('8');
 await page.locator('#pkg-measure-form button[type=submit]').click();await page.locator('#pkg-confirm-add').click();await expect(page).toHaveURL(/project-cart.html/);
 await expect(page.locator('#cart-pay-button')).toBeDisabled();const cart=await page.evaluate(()=>JSON.parse(localStorage.getItem('nr-cart')));expect(cart[0].measurements.floorArea).toBe(100);expect(cart[0].depositEstimate).toBeGreaterThan(0);
});

test('labor-only installation remains quote-required and never enters merchandise checkout',async({page})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('nr-cart',JSON.stringify([{name:'Faucet installation',type:'Labor',source:'labor-catalog',qty:1,price:225}])));await page.goto('/project-cart.html');await expect(page.locator('#cart-terms-agree')).toBeHidden();await expect(page.locator('#cart-pay-button')).toBeHidden();await expect(page.locator('.nr-cart-approval-next')).toContainText('Request start date');
});

test('projects, retail, labor and mixed carts share the same basic summary',async({page})=>{
 const project={name:'Accent Walls — Standard',type:'Service',source:'room-project-package',projectId:'accents',packageId:'deluxe',qty:1,price:null,startingAt:835,depositEstimate:242.39,laborEstimate:511.5,overheadAllowance:81.11,quoteRequired:true};
 for(const items of [[project],[product],[{name:'Installation',type:'Labor',price:225,qty:1}],[project,product]]){
  await page.goto('/');await page.evaluate(items=>localStorage.setItem('nr-cart',JSON.stringify(items)),items);await page.goto('/project-cart.html');
  const labels=await page.locator('.nr-cart-price-chart > .cart-item:visible > span').allTextContents();
  expect(labels.slice(0,5).map(x=>x.trim())).toEqual(['Products & materials','Services','Delivery / shipping','Estimated sales tax','Total estimate']);
  await expect(page.locator('#cart-combined-project-total')).toBeVisible();
  await expect(page.locator('input[name=zip]:visible')).toHaveCount(1);
  if(items.some(item=>['Labor','Service'].includes(item.type))){
   await expect(page.locator('#cart-scheduling')).toBeHidden();
   await page.getByRole('link',{name:'Request start date',exact:true}).click();
   await expect(page.locator('#cart-scheduling')).toBeVisible();
  }
  await expect(page.getByText('Some items require a quote.',{exact:true})).toHaveCount(0);
  await expect(page.getByText('Payment after final approval:',{exact:false})).toHaveCount(0);
 }
});

test('project checkout opens a review without charging an unapproved estimate',async({page})=>{
 const calls=[];page.on('request',r=>{if(r.url().includes('/api/project-checkout')||r.url().includes('/api/store-checkout'))calls.push(r.url());});
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('nr-cart',JSON.stringify([{name:'Accent Walls — Standard',type:'Service',source:'room-project-package',projectId:'accents',packageId:'deluxe',qty:1,price:null,startingAt:835,depositEstimate:242.39,laborEstimate:511.5,overheadAllowance:81.11,quoteRequired:true}])));
 await page.goto('/project-cart.html');await expect(page.locator('#cart-scheduling')).toBeHidden();await expect(page.locator('#cart-tax-amount')).toHaveText('$0.00');
 await page.locator('#project-checkout-button').click();await expect(page).toHaveURL(/payment.html#cart/);
 await expect(page.locator('h1')).toHaveText('Checkout');await expect(page.locator('#payment-details')).toContainText('$835.00');await expect(page.locator('#payment-details')).toContainText('$242.39');
 await expect(page.locator('#payment-status')).toHaveText('Final approval required before payment.');await expect(page.locator('#request-approval')).toHaveAttribute('href',/^mailto:contact@niksremodeling.com/);
 await expect(page.getByRole('button',{name:'Pay securely with Square'})).toHaveCount(0);expect(calls).toEqual([]);
 await page.getByRole('link',{name:'Back to cart'}).click();await expect(page.locator('#cart-scheduling')).toBeHidden();
});

test('mixed cart separates merchandise services freight tax and final total without double counting',async({page})=>{
 const packageItem={name:'Accent Walls — Basic',type:'Service',source:'room-project-package',projectId:'accents',packageId:'basic',qty:1,price:null,startingAt:585,depositEstimate:227.39,laborEstimate:300,overheadAllowance:57.61,quoteRequired:true};
 await page.route('**/api/cart-shipping',r=>r.fulfill({json:{deliveryCents:75350,units:1}}));
 await page.route('**/api/cart-tax',r=>r.fulfill({json:{mode:'zip-upper-estimate',ratePercent:0}}));
 await page.goto('/');await page.evaluate(items=>localStorage.setItem('nr-cart',JSON.stringify(items)),[{...product,name:'Dual tap refrigerator',price:723.50},packageItem]);await page.goto('/project-cart.html');
 await page.locator('#cart-shipping-zip').fill('30117');
 await expect(page.locator('#cart-products-subtotal')).toHaveText('$723.50');await expect(page.locator('#cart-services-subtotal')).toHaveText('$585.00');
 await expect(page.locator('#cart-shipping-amount')).toHaveText('$753.50');await expect(page.locator('#cart-tax-amount')).toHaveText('$0.00');await expect(page.locator('#cart-combined-project-total')).toHaveText('$2,062.00');
 await expect(page.locator('#cart-due-now')).toBeVisible();await expect(page.locator('#cart-due-now')).toHaveText('$1,704.39');await expect(page.locator('.nr-cart-remaining-balance strong')).toHaveText('$357.61');
 const rows=await page.locator('.nr-cart-price-chart > .cart-item:visible > span').allTextContents();expect(rows.map(x=>x.trim())).toEqual(['Products & materials','Services','Delivery / shipping','Estimated sales tax','Total estimate','Deposit','Balance left owed']);
 await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nr-cart'));delete items[1].depositEstimate;localStorage.setItem('nr-cart',JSON.stringify(items));});await page.reload();await expect(page.locator('#cart-due-now')).toBeVisible();await expect(page.locator('#cart-due-now')).toHaveText('Pending');
});
