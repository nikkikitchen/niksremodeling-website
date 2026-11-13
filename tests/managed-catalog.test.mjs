import test from 'node:test';
import assert from 'node:assert/strict';
import {database} from './helpers/d1.mjs';
import {sellingCents,isAvailable,publicProduct,validateProduct} from '../functions/_lib/business-catalog.js';
import {projectDashboard} from '../functions/_lib/business-dashboard.js';
import {onRequestGet as catalog} from '../functions/api/catalog.js';
import {onRequestPost as select} from '../functions/api/catalog-selection.js';
import {readFileSync} from 'node:fs';
const product=()=>({id:'test-faucet',name:'Test faucet',description:'Verified fixture',images:['https://example.test/faucet.jpg'],contexts:['shopping:bathroom/faucets','project:bathrooms','work:faucet-service','labor:vanity-faucet','package:bathrooms/basic/faucet'],supplier:'PRIVATE SUPPLIER',supplier_product_id:'supplier-123',supplier_sku:'PRIVATE-SKU',supplier_cost_cents:10000,markup_bps:3500,stock_quantity:3,warehouse_country:'US',requires_us_stock:true,stock_verified_at:new Date().toISOString(),stock_evidence:'PRIVATE report',shipping_required:true,shipping_notes:'PRIVATE freight',unit:'each',installation_labor_cents:22500,status:'active'});
function insert(db,p=product()){const row=validateProduct(p);db.sqlite.prepare('INSERT INTO business_products('+Object.keys(row).join(',')+') VALUES('+Object.keys(row).map(()=>'?').join(',')+')').run(...Object.values(row));return row;}
const env=db=>({BUSINESS_DB:db,BUSINESS_CATALOG_ACTIVE:'true'});
const req=(path,body)=>new Request('https://niksremodeling.com'+path,body?{method:'POST',headers:{Origin:'https://niksremodeling.com','Content-Type':'application/json'},body:JSON.stringify(body)}:{});
test('one row supplies identical public prices to Shopping, Projects, work, labor and allowances',async()=>{
 const db=database();try{const row=insert(db);for(const context of JSON.parse(row.contexts)){
  const response=await catalog({request:req('/api/catalog?context='+encodeURIComponent(context)),env:env(db)});assert.equal(response.status,200);
  const data=await response.json();assert.equal(data.products.length,1);assert.equal(data.products[0].sellingPriceCents,13500);
  const output=JSON.stringify(data);for(const privateValue of ['PRIVATE','supplier_cost','markup_bps','stock_evidence','supplier_sku'])assert.ok(!output.includes(privateValue));
 }
 db.sqlite.prepare('UPDATE business_products SET supplier_cost_cents=12000 WHERE id=?').run(row.id);
 const data=await (await catalog({request:req('/api/catalog?context=project:bathrooms'),env:env(db)})).json();assert.equal(data.products[0].sellingPriceCents,16200,'DB edit changes all placements without rebuilding');
 }finally{db.close();}
});
test('stale, missing, non-US, zero stock and draft products are unavailable everywhere',async()=>{
 const db=database();try{insert(db);for(const [field,value] of [['stock_quantity',0],['stock_verified_at','2020-01-01T00:00:00Z'],['warehouse_country','CN'],['status','draft'],['supplier_cost_cents',null]]){
  db.sqlite.prepare('UPDATE business_products SET '+field+'=? WHERE id=?').run(value,'test-faucet');
  const data=await (await catalog({request:req('/api/catalog'),env:env(db)})).json();assert.equal(data.products.length,0);
  const response=await select({request:req('/api/catalog-selection',{productId:'test-faucet',quantity:1}),env:env(db)});assert.equal(response.status,409);
  db.sqlite.prepare('DELETE FROM business_products').run();insert(db);
 }}finally{db.close();}
});
test('selection rechecks quantity, price and server allowance; unknown freight/tax never means included',async()=>{
 const db=database();try{insert(db);let response=await select({request:req('/api/catalog-selection',{productId:'test-faucet',quantity:2,context:'package:bathrooms/basic/faucet',allowanceCents:999999999,sellingPriceCents:1}),env:env(db)});
 const data=await response.json();assert.equal(data.merchandiseCents,27000);assert.equal(data.allowanceCents,12500);assert.equal(data.minimumUpgradeCents,14500);assert.equal(data.deliveredAllowanceVerified,false);assert.equal(data.checkoutEnabled,false);assert.equal(data.taxVerified,false);
 response=await select({request:req('/api/catalog-selection',{productId:'test-faucet',quantity:4}),env:env(db)});assert.equal(response.status,409);
 response=await select({request:req('/api/catalog-selection',{productId:'test-faucet',quantity:1,context:'project:kitchen'}),env:env(db)});assert.equal(response.status,400);
 }finally{db.close();}
});
test('price validation does not double markup and rejects unsafe product fields',()=>{
 assert.equal(sellingCents(10001,3500),13502);assert.equal(sellingCents(null,3500),null);assert.equal(sellingCents(100,0),100);
 for(const override of [{images:['javascript:alert(1)']},{contexts:['project:bathrooms','project:bathrooms']},{supplier_cost_cents:0},{stock_verified_at:'2099-01-01'},{images:['https://user:password@example.test/x.jpg']}])assert.throws(()=>validateProduct({...product(),...override}));
 const row=validateProduct(product());assert.equal(isAvailable(row),true);assert.equal(publicProduct(row).checkoutEnabled,false);
});
test('dashboard keeps uncertain profit unknown and reconciles costs, quantities and actual expenses',()=>{
 const row={...validateProduct(product()),product_id:'test-faucet',quantity:2,purchased_quantity:1,shipping_cost_cents:null,tax_cost_cents:null,allowance_cents:25000};
 const project={selling_total_cents:50000,internal_hourly_cost_cents:null,labor_hours:2,fees_cost_cents:1000};
 let d=projectDashboard(project,[row],[{category:'materials',amount_cents:11000}]);assert.equal(d.estimatedProfitCents,null);assert.equal(d.actualExpensesCents,11000);assert.equal(d.purchasing[0].toPurchase,1);assert.equal(d.purchasing[0].supplierReserveCents,10000);
 d=projectDashboard({...project,internal_hourly_cost_cents:2500},[{...row,shipping_cost_cents:2000,tax_cost_cents:1000}],[]);assert.equal(d.estimatedCostCents,29000);assert.equal(d.estimatedProfitCents,21000);assert.ok(d.warnings.some(w=>w.includes('exceed the allowance')));
});
test('draft migration preserves one product ID and never invents supplier cost or fresh stock',()=>{
 const db=database();try{db.exec(readFileSync(new URL('../migrations/0002_catalog_drafts.sql',import.meta.url),'utf8'));const rows=db.sqlite.prepare('SELECT * FROM business_products').all();assert.ok(rows.length>100);assert.ok(rows.every(r=>r.status==='draft'&&r.supplier_cost_cents===null&&r.stock_verified_at===null));assert.equal(new Set(rows.map(p=>p.id)).size,rows.length);}finally{db.close();}
});

test('legacy supplier discovery and detail routes use the same database after activation',async()=>{
 const {managedLegacyProduct,managedLegacyCandidates}=await import('../functions/_lib/managed-legacy.js');
 const db=database();try{insert(db);
 const detail=await (await managedLegacyProduct(req('/api/store-product?product=test-faucet'),env(db))).json();assert.equal(detail.variants[0].priceCents,13500);assert.equal(detail.variants[0].sku,'');
 const list=await (await managedLegacyCandidates(req('/api/us-furniture?category=bathroom'),env(db))).json();assert.equal(list.products.length,1);assert.equal(list.products[0].priceCents,13500);
 db.sqlite.prepare('UPDATE business_products SET stock_quantity=0').run();
 assert.equal((await managedLegacyProduct(req('/api/store-product?product=test-faucet'),env(db))).status,404);
 }finally{db.close();}
});
