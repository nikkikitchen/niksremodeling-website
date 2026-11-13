export const STOCK_MAX_AGE=24*60*60*1000;
export function sellingCents(cost,bps){
 if(!Number.isSafeInteger(cost)||cost<=0||!Number.isSafeInteger(bps)||bps<0||bps>50000)return null;
 const total=Math.ceil(cost*(10000+bps)/10000);return Number.isSafeInteger(total)?total:null;
}
export function isAvailable(row,now=Date.now()){
 const age=now-Date.parse(row.stock_verified_at);
 return row.status==='active'&&Number.isSafeInteger(row.stock_quantity)&&row.stock_quantity>0&&
  Number.isFinite(age)&&age>=-30000&&age<=STOCK_MAX_AGE&&!!row.stock_evidence&&
  (!row.requires_us_stock||row.warehouse_country==='US')&&sellingCents(row.supplier_cost_cents,row.markup_bps)!==null;
}
export function publicProduct(row){
 // Deliberate allowlist: never spread a database row into a customer response.
 return {id:row.id,name:row.name,description:row.description,images:JSON.parse(row.images),contexts:JSON.parse(row.contexts),
  sellingPriceCents:sellingCents(row.supplier_cost_cents,row.markup_bps),unit:row.unit,
  installationPriceCents:row.installation_labor_cents,shippingRequired:!!row.shipping_required,
  availability:'available',stockVerifiedAt:row.stock_verified_at,checkoutEnabled:false};
}
function bad(message){const e=Error(message);e.name='ValidationError';throw e;}
export const identifier=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v);
export const validContext=v=>typeof v==='string'&&/^(shopping|project|work|labor|package):[a-z0-9][a-z0-9/-]{0,140}$/.test(v);
export function validateProduct(value){
 if(!value||typeof value!=='object'||Array.isArray(value))bad('Product details are required.');
 const text=(key,max,required=false)=>{const v=value[key]??'';if(typeof v!=='string'||v.length>max||(required&&!v.trim()))bad('Check '+key+'.');return v.trim();};
 const integer=(key,nullable=false)=>{const v=value[key];if(nullable&&(v===null||v===undefined))return null;if(!Number.isSafeInteger(v)||v<0||v>1000000000)bad('Check '+key+'.');return v;};
 const id=text('id',80,true);if(!identifier(id))bad('Use letters, numbers, hyphens or underscores for the product ID.');
 const images=value.images,contexts=value.contexts;
 if(!Array.isArray(images)||!images.length||images.length>12||new Set(images).size!==images.length||images.some(url=>{
  if(typeof url!=='string'||url.length>2000)return true;
  try{const u=new URL(url,'https://local.test');return u.protocol!=='https:'||!!u.username||!!u.password||(!url.startsWith('/assets/')&&!url.startsWith('https://'));}catch{return true;}
 }))bad('Add 1–12 distinct HTTPS or local asset images.');
 if(!Array.isArray(contexts)||!contexts.length||contexts.length>60||new Set(contexts).size!==contexts.length||contexts.some(x=>!validContext(x)))bad('Select valid product placements.');
 const status=text('status',20,true);if(!['draft','active','archived'].includes(status))bad('Invalid product status.');
 const supplier_cost_cents=integer('supplier_cost_cents',true),markup_bps=integer('markup_bps');
 if(supplier_cost_cents===0||markup_bps>50000)bad('Check cost and markup.');
 const stock_quantity=integer('stock_quantity'),stock_verified_at=value.stock_verified_at||null;
 if(stock_verified_at!==null&&(!Number.isFinite(Date.parse(stock_verified_at))||Date.parse(stock_verified_at)>Date.now()+30000))bad('Invalid stock verification date.');
 const stock_evidence=text('stock_evidence',1000);
 if(status==='active'&&(!supplier_cost_cents||!stock_verified_at||!stock_evidence))bad('Active products require a cost and documented stock verification.');
 for(const key of ['requires_us_stock','shipping_required'])if(typeof value[key]!=='boolean')bad('Check '+key+'.');
 const warehouse_country=text('warehouse_country',2,true).toUpperCase();if(!/^[A-Z]{2}$/.test(warehouse_country))bad('Use a two-letter warehouse country.');
 return {id,name:text('name',200,true),description:text('description',6000),images:JSON.stringify(images),contexts:JSON.stringify(contexts),
  supplier:text('supplier',120,true),supplier_product_id:text('supplier_product_id',100),supplier_sku:text('supplier_sku',100),supplier_cost_cents,markup_bps,
  stock_quantity,warehouse_country,requires_us_stock:Number(value.requires_us_stock),stock_verified_at,stock_evidence,shipping_required:Number(value.shipping_required),
  shipping_notes:text('shipping_notes',1000),unit:text('unit',40,true),installation_labor_cents:integer('installation_labor_cents',true),status};
}
export async function readBody(request){
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))bad('Send JSON product details.');
 if(Number(request.headers.get('Content-Length'))>65536)bad('Request is too large.');
 const raw=await request.text();if(new TextEncoder().encode(raw).length>65536)bad('Request is too large.');
 try{return JSON.parse(raw);}catch{bad('Invalid JSON.');}
}
export {bad as validationError};
