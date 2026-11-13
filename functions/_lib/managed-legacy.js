import {isAvailable,publicProduct} from './business-catalog.js';
export async function managedLegacyProduct(request,env){
 if(env.BUSINESS_CATALOG_ACTIVE!=='true')return null;
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 const unavailable=()=>Response.json({error:'This item is not currently available in the managed catalog.',checkoutEnabled:false},{status:404,headers});
 if(!env.BUSINESS_DB)return Response.json({error:'Catalog temporarily unavailable.',checkoutEnabled:false},{status:503,headers});
 try{
  const id=new URL(request.url).searchParams.get('product');if(!id)return unavailable();
  const row=await env.BUSINESS_DB.prepare('SELECT * FROM business_products WHERE id=?').bind(id).first();
  if(!row||!isAvailable(row))return unavailable();const p=publicProduct(row);
  return Response.json({id:p.id,name:p.name,image:p.images[0],images:p.images,description:p.description,warehouseCountry:row.warehouse_country,inStockUS:true,
   variants:[{id:p.id,name:p.name,sku:'',image:p.images[0],priceCents:p.sellingPriceCents,usStock:row.stock_quantity}],checkoutEnabled:false},{headers});
 }catch{return unavailable();}
}
export async function managedLegacyCandidates(request,env,department='furniture'){
 if(env.BUSINESS_CATALOG_ACTIVE!=='true')return null;
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 if(!env.BUSINESS_DB)return Response.json({products:[],error:'Catalog temporarily unavailable.',checkoutEnabled:false},{status:503,headers});
 try{
  const params=new URL(request.url).searchParams,category=params.get('category'),query=String(params.get('keyword')||'').toLowerCase();
  const context=category==='bathroom'?'shopping:bathroom':'shopping:'+department+(category?'/'+category:'');
  const {results}=await env.BUSINESS_DB.prepare("SELECT * FROM business_products WHERE status='active' ORDER BY name LIMIT 500").all();
  const products=results.filter(p=>isAvailable(p)&&(!query||p.name.toLowerCase().includes(query))&&(department==='all'||JSON.parse(p.contexts).some(c=>c===context||c.startsWith(context+'/')))).map(p=>{
   const item=publicProduct(p);return {id:item.id,name:item.name,image:item.images[0],category,priceCents:item.sellingPriceCents,warehouseCountry:p.warehouse_country,stockVerified:true,originVerified:true};
  });return Response.json({products,category,page:1,totalPages:1,checkoutEnabled:false},{headers});
 }catch{return Response.json({products:[],error:'Catalog temporarily unavailable.',checkoutEnabled:false},{status:503,headers});}
}
