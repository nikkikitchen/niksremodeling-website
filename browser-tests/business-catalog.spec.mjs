import {test,expect} from '@playwright/test';
import {html,js,css} from '../functions/_lib/owner-ui.js';
const contexts=['shopping:bathroom/faucets','project:bathrooms','work:paint','labor:vanity-faucet','package:bathrooms/basic/faucet'];
const product={id:'live-db-fixture',name:'Database Faucet',description:'Updated in the database',images:['/assets/approved-a908c20ce632.jpg'],contexts,sellingPriceCents:13500,unit:'each',installationPriceCents:22500,shippingRequired:true,availability:'available',checkoutEnabled:false};
const categories=contexts.map(context=>({context,label:context==='shopping:bathroom/faucets'?'New Faucets':'Matching fixture',parent_context:null}));
test('new database product appears in categories, related projects and quotes with one price',async({page})=>{
 let requests=0;
 await page.route('**/api/catalog',route=>route.fulfill({json:{configured:true,products:[product],categories,checkoutEnabled:false}}));
 await page.route('**/api/catalog-selection',route=>{requests++;return route.fulfill({json:{product,quantity:1,merchandiseCents:13500,allowanceCents:12500,minimumUpgradeCents:1000,deliveredAllowanceVerified:false,checkoutEnabled:false}});});
 await page.goto('/project.html?project=bathrooms');
 await expect(page.locator('#central-related a')).toHaveCount(1);
 await expect(page.locator('#shopping-menu a[data-central-link]')).toHaveText('New Faucets');
 await page.goto('/catalog.html?context=package:bathrooms/basic/faucet&product=live-db-fixture');
 await expect(page.locator('main')).toContainText('$135.00');
 await expect(page.locator('main')).not.toContainText('supplier_cost');
 await page.locator('#central-selection button').click();
 await expect(page.locator('#central-selection-status')).toContainText('Minimum merchandise upgrade: $10.00');
 await expect(page.locator('#central-selection-status')).toContainText('shipping and tax confirmation');
 expect(requests).toBe(1);
 await page.goto('/project-cart.html');await expect(page.locator('#cart-pay-button')).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nr-cart'))[0].price)).toBeNull();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
test('a stock change blocks adding a previously visible product',async({page})=>{
 await page.route('**/api/catalog',route=>route.fulfill({json:{configured:true,products:[product],categories}}));
 await page.route('**/api/catalog-selection',route=>route.fulfill({status:409,json:{error:'Current stock is unavailable for this quantity.',checkoutEnabled:false}}));
 await page.goto('/catalog.html?product=live-db-fixture');await page.locator('#central-selection button').click();
 await expect(page.locator('#central-selection-status')).toContainText('stock is unavailable');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nr-cart')||'[]').length)).toBe(0);
});
test('owner form works on small screens and sends costs only to the private API',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));let saved;
 await page.route('**/owner',route=>route.fulfill({contentType:'text/html',body:html}));
 await page.route('**/owner/app.js',route=>route.fulfill({contentType:'text/javascript',body:js}));
 await page.route('**/owner/style.css',route=>route.fulfill({contentType:'text/css',body:css}));
 await page.route('**/api/owner/categories',route=>route.fulfill({json:{categories}}));
 await page.route('**/api/owner/projects',route=>route.fulfill({json:{projects:[]}}));
 await page.route('**/api/owner/products',route=>{
  if(route.request().method()==='POST'){saved=route.request().postDataJSON();return route.fulfill({json:{saved:true,id:'new-product',sellingPriceCents:13500}});}
  return route.fulfill({json:{products:[],owner:'owner@example.test'}});
 });
 await page.goto('/owner');const form=page.locator('#product-form');
 await form.locator('[name=id]').fill('new-product');await form.locator('[name=name]').fill('New product');
 await form.locator('[name=images]').fill('https://example.test/one.jpg\nhttps://example.test/two.jpg');
 await form.locator('[name=contexts]').selectOption(contexts);
 await form.locator('[name=supplier]').fill('PRIVATE supplier');await form.locator('[name=cost]').fill('100.00');
 await form.getByRole('button',{name:'Save product',exact:true}).click();await expect(page.locator('#status')).toContainText('Saved.');
 expect(saved.supplier_cost_cents).toBe(10000);expect(saved.images).toHaveLength(2);expect(saved.contexts).toEqual(contexts);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);expect(errors).toEqual([]);
});
