import {cj,usVariantStock} from '../../_lib/commerce.js';
import {ownerRoute,privateJson} from '../../_lib/owner-auth.js';
import {readBody,validateProduct,identifier,validContext,validationError,sellingCents} from '../../_lib/business-catalog.js';
import {projectDashboard} from '../../_lib/business-dashboard.js';
const cents=(v,name,nullable=false)=>{if(nullable&&(v===null||v===undefined))return null;if(!Number.isSafeInteger(v)||v<0||v>1000000000)validationError('Check '+name+'.');return v;};
const text=(v,name,max=200)=>{if(typeof v!=='string'||!v.trim()||v.length>max)validationError('Check '+name+'.');return v.trim();};
export const onRequest=ownerRoute(async({request,env,owner})=>{
 const db=env.BUSINESS_DB,route=new URL(request.url).pathname.replace(/^\/api\/owner\/?/,''),method=request.method;
 if(method==='GET'){
  if(route==='products'){
   const {results}=await db.prepare('SELECT * FROM business_products ORDER BY name LIMIT 1000').all();
   return privateJson({products:results.map(p=>({...p,images:JSON.parse(p.images),contexts:JSON.parse(p.contexts),sellingPriceCents:sellingCents(p.supplier_cost_cents,p.markup_bps)})),owner:owner.email});
  }
  if(route==='categories'){const {results}=await db.prepare('SELECT * FROM catalog_categories ORDER BY label').all();return privateJson({categories:results});}
  if(route==='projects'){const {results}=await db.prepare('SELECT * FROM business_projects ORDER BY name').all();return privateJson({projects:results});}
  if(route.startsWith('dashboard/')){
   const id=route.slice(10);if(!identifier(id))return privateJson({error:'Invalid project.'},400);
   const project=await db.prepare('SELECT * FROM business_projects WHERE id=?').bind(id).first();if(!project)return privateJson({error:'Project not found.'},404);
   const {results:lines}=await db.prepare('SELECT p.*,m.id AS line_id,m.product_id,m.quantity,m.allowance_cents,m.shipping_cost_cents,m.tax_cost_cents,m.purchased_quantity FROM project_materials m JOIN business_products p ON p.id=m.product_id WHERE m.project_id=?').bind(id).all();
   const {results:expenses}=await db.prepare('SELECT * FROM project_expenses WHERE project_id=? ORDER BY paid_at DESC').bind(id).all();
   return privateJson(projectDashboard(project,lines,expenses));
  }
 }
 if(method==='POST'||method==='PUT'){
  const body=await readBody(request);
  if(route==='products'){
   const product=validateProduct(body),columns=Object.keys(product);
   const {results:categories}=await db.prepare('SELECT context FROM catalog_categories').all();
   const allowed=new Set(categories.map(c=>c.context));if(JSON.parse(product.contexts).some(c=>!allowed.has(c)))validationError('Select existing product placements first.');
   const existing=await db.prepare('SELECT version FROM business_products WHERE id=?').bind(product.id).first();
   if(method==='POST'){
    if(existing)return privateJson({error:'Product ID already exists.'},409);
    await db.prepare('INSERT INTO business_products ('+columns.join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').bind(...Object.values(product)).run();
   }else{
    if(!existing||!Number.isSafeInteger(body.expectedVersion)||existing.version!==body.expectedVersion)return privateJson({error:'Product changed. Reload before saving.'},409);
    const update=await db.prepare('UPDATE business_products SET '+columns.filter(k=>k!=='id').map(k=>k+'=?').join(',')+",version=version+1,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND version=?").bind(...columns.filter(k=>k!=='id').map(k=>product[k]),product.id,body.expectedVersion).run();
    if(update.meta.changes!==1)return privateJson({error:'Product changed. Reload before saving.'},409);
   }
   return privateJson({saved:true,id:product.id,sellingPriceCents:sellingCents(product.supplier_cost_cents,product.markup_bps),checkoutEnabled:false});
  }
  if(route==='refresh-stock'&&method==='POST'){
   if(!identifier(body.id))validationError('Select an existing product.');
   const p=await db.prepare('SELECT * FROM business_products WHERE id=?').bind(body.id).first();
   if(!p||p.supplier!=='CJ Dropshipping'||!p.supplier_product_id||!p.supplier_sku)validationError('Set the exact CJ product ID and variant SKU first.');
   const detail=await cj(env,'/product/query?pid='+encodeURIComponent(p.supplier_product_id)+'&countryCode=US');
   const inventory=await cj(env,'/product/stock/getInventoryByPid?pid='+encodeURIComponent(p.supplier_product_id));
   const variants=(detail.variants||[]).filter(v=>v.variantSku===p.supplier_sku);
   if(variants.length!==1)validationError('The supplier SKU is missing or ambiguous. No stock was verified.');
   const variant=variants[0],stock=usVariantStock(inventory),quantity=stock.get(String(variant.vid))||0;
   const cost=Math.round(Number(variant.variantSellPrice)*100);
   if(!Number.isSafeInteger(cost)||cost<=0||!Number.isSafeInteger(quantity)||quantity<0)validationError('Supplier cost or US inventory could not be verified.');
   const result=await db.prepare("UPDATE business_products SET supplier_cost_cents=?,stock_quantity=?,warehouse_country='US',stock_verified_at=?,stock_evidence=?,version=version+1 WHERE id=? AND version=?").bind(cost,quantity,new Date().toISOString(),'CJ API physical US inventory / SKU '+p.supplier_sku,p.id,p.version).run();
   if(result.meta.changes!==1)return privateJson({error:'Product changed. Reload before refreshing stock.'},409);
   return privateJson({saved:true,quantity,sellingPriceCents:sellingCents(cost,p.markup_bps)});
  }
  if(route==='categories'&&method==='POST'){
   if(!validContext(body.context))validationError('Invalid category placement.');
   const label=text(body.label,'category label',120),parent=body.parent_context||null;if(parent&&!validContext(parent))validationError('Invalid parent category.');
   const exists=await db.prepare('SELECT context FROM catalog_categories WHERE context=?').bind(body.context).first();if(exists)return privateJson({error:'Category already exists.'},409);
   if(parent&&!await db.prepare('SELECT context FROM catalog_categories WHERE context=?').bind(parent).first())validationError('Select an existing parent.');
   await db.prepare('INSERT INTO catalog_categories(context,label,parent_context) VALUES(?,?,?)').bind(body.context,label,parent).run();return privateJson({saved:true});
  }
  if(route==='projects'){
   const id=method==='PUT'?body.id:crypto.randomUUID(),name=text(body.name,'project name'),hours=body.labor_hours;
   if(!identifier(id))validationError('Select a valid project.');
   if(!Number.isFinite(hours)||hours<0||hours>100000)validationError('Check labor hours.');
   const values=[name,cents(body.selling_total_cents,'selling total'),hours,cents(body.internal_hourly_cost_cents,'internal hourly cost',true),cents(body.fees_cost_cents,'fees'),String(body.notes||'').slice(0,6000)];
   if(method==='PUT'){
    if(!Number.isSafeInteger(body.expectedVersion))validationError('Reload the project before saving.');
    const result=await db.prepare('UPDATE business_projects SET name=?,selling_total_cents=?,labor_hours=?,internal_hourly_cost_cents=?,fees_cost_cents=?,notes=?,version=version+1 WHERE id=? AND version=?').bind(...values,id,body.expectedVersion).run();
    if(result.meta.changes!==1)return privateJson({error:'Project changed. Reload before saving.'},409);
   }else await db.prepare('INSERT INTO business_projects(id,name,selling_total_cents,labor_hours,internal_hourly_cost_cents,fees_cost_cents,notes) VALUES(?,?,?,?,?,?,?)').bind(id,...values).run();
   return privateJson({saved:true,id});
  }
  if(route==='materials'&&method==='POST'){
   if(!identifier(body.project_id)||!identifier(body.product_id))validationError('Select a project and product.');
   const quantity=body.quantity,purchased=body.purchased_quantity;
   if(!Number.isFinite(quantity)||quantity<=0||quantity>1000000||!Number.isFinite(purchased)||purchased<0||purchased>quantity)validationError('Check required and purchased quantities.');
   const product=await db.prepare('SELECT id FROM business_products WHERE id=?').bind(body.product_id).first();
   const project=await db.prepare('SELECT id FROM business_projects WHERE id=?').bind(body.project_id).first();if(!product||!project)validationError('Project or product no longer exists.');
   await db.prepare('INSERT INTO project_materials(id,project_id,product_id,quantity,purchased_quantity,allowance_cents,shipping_cost_cents,tax_cost_cents) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(project_id,product_id) DO UPDATE SET quantity=excluded.quantity,purchased_quantity=excluded.purchased_quantity,allowance_cents=excluded.allowance_cents,shipping_cost_cents=excluded.shipping_cost_cents,tax_cost_cents=excluded.tax_cost_cents').bind(crypto.randomUUID(),body.project_id,body.product_id,quantity,purchased,cents(body.allowance_cents,'allowance',true),cents(body.shipping_cost_cents,'shipping cost',true),cents(body.tax_cost_cents,'tax cost',true)).run();return privateJson({saved:true});
  }
  if(route==='expenses'&&method==='POST'){
   if(!identifier(body.project_id)||!['materials','supplies','labor','shipping','tax','fees','other'].includes(body.category))validationError('Check expense category and project.');
   if(!await db.prepare('SELECT id FROM business_projects WHERE id=?').bind(body.project_id).first())validationError('Project not found.');
   const paidAt=body.paid_at;if(typeof paidAt!=='string'||!Number.isFinite(Date.parse(paidAt)))validationError('Check expense date.');
   await db.prepare('INSERT INTO project_expenses(id,project_id,category,description,amount_cents,paid_at,created_by) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(),body.project_id,body.category,text(body.description,'expense description',1000),cents(body.amount_cents,'expense amount'),paidAt,owner.email).run();return privateJson({saved:true});
  }
 }
 return privateJson({error:'Owner operation not found.'},404);
});
