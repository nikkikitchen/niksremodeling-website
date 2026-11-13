import {test,expect} from '@playwright/test';
const ids=['accents','accessibility','attic','basement','bathrooms','bedroom-guest-room','closets-storage','dining-room','garage','kitchen-pantry','laundry-utility','living-family-room','custom','concrete','room-additions','themed-rooms'];
test.beforeEach(async({page})=>{
 await page.route('**/api/**',route=>route.fulfill({status:503,json:{error:'Verification unavailable in offline browser test',checkoutEnabled:false}}));
 await page.route(/https:\/\//,route=>route.abort());
});
test('click menus toggle, switch, ignore hovering, and close outside or on Escape',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 const mobile=info.project.name!=='desktop';
 const prefix=mobile?'mobile-':'';
 const projects=page.locator(`[aria-controls="${prefix}projects-menu"]`);
 const shopping=page.locator(`[aria-controls="${prefix}shopping-menu"]`);
 await projects.click();await expect(projects).toHaveAttribute('aria-expanded','true');
 await expect(page.locator(`#${prefix}projects-menu a.project-category-link`)).toHaveCount(16);
 expect(await page.locator(`#${prefix}projects-menu a.project-category-link`).evaluateAll(links=>links.map(x=>new URL(x.href).searchParams.get('project')))).toEqual(ids);
 if(!mobile){await shopping.hover();await expect(projects).toHaveAttribute('aria-expanded','true');await expect(shopping).toHaveAttribute('aria-expanded','false');}
 await projects.click();await expect(projects).toHaveAttribute('aria-expanded','false');
 await projects.click();await shopping.click();await expect(projects).toHaveAttribute('aria-expanded','false');await expect(shopping).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape');await expect(shopping).toHaveAttribute('aria-expanded','false');
 await projects.click();await page.locator('.brandbar').click({position:{x:3,y:3}});await expect(projects).toHaveAttribute('aria-expanded','false');
 expect(errors).toEqual([]);
});
test('main project packages, nested hubs, mobile details and custom workflows remain reachable',async({page},info)=>{
 for(const id of ids){
  await page.goto('/project.html?project='+id);
  const cards=page.locator('.pkg-choice');
  if(id==='room-additions'){
   await expect(page.locator('a[href*="additionType="]')).toHaveCount(4);
   await page.locator('a[href*="additionType="]').first().click();
   await expect(page.locator('main')).toContainText('reviewed on site before pricing');
  }else if(['custom','concrete','themed-rooms'].includes(id)){
   const links=page.locator('#outdoor-project-grid a.tile');await expect(links.first()).toBeVisible();
   for(const href of await links.evaluateAll(links=>links.map(x=>x.getAttribute('href')))){
    expect(href).toMatch(/^\/project.html\?project=/);
   }
  }else{
   await expect(cards).toHaveCount(4);
   expect(await cards.locator('.pkg-image strong').allTextContents()).toEqual(id==='accessibility'?['Basic','Standard','Premium','Custom']:['Basic','Standard','Deluxe','Custom']);
   if(info.project.name!=='desktop'){
    await cards.first().locator('summary').click();await expect(cards.first().locator('details')).toHaveAttribute('open','');
   }
   await cards.first().locator('.pkg-add').click();await expect(page.locator('#pkg-measure-form')).toBeVisible();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' horizontal overflow').toBe(true);
 }
});
test('Terms never enables Pay; address is compact and unknown tax stays pending',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('nr-cart',JSON.stringify([{name:'Test fixture',type:'Product',source:'supplier-retail',qty:1,price:100,productId:'1963146233541074945',variantId:'1963146233666904066'}])));
 await page.goto('/project-cart.html');
 await expect(page.locator('.cart-checkout-summary')).toHaveCount(1);
 await expect(page.locator('#cart-pay-button')).toBeDisabled();
 await page.locator('#cart-terms-agree').check();await expect(page.locator('#cart-pay-button')).toBeDisabled();
 await expect(page.locator('#square-ship-address')).toBeVisible();
 await expect(page.locator('#cart-tax-amount')).toHaveText('Needs confirmation');
 await expect(page.locator('#cart-estimated-total')).toContainText('tax pending');
 await expect(page.locator('#square-pay')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect(errors).toEqual([]);
});
