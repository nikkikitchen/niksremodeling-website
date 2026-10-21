import {cj,PRODUCT_ID,retailCents,usVariantStock} from '../_lib/commerce.js';
import {catalog} from '../../store-catalog.js';

export async function onRequestGet({request,env}){
 const id=request?new URL(request.url).searchParams.get('product')||PRODUCT_ID:PRODUCT_ID;
 if(!/^[\w-]{8,64}$/.test(id||''))return Response.json({error:'Invalid product.'},{status:400});
 if(["2003348098417340418","2003347794848272385"].includes(id))return Response.json({error:'Product excluded: no verified U.S. warehouse stock.'},{status:404,headers:{'Cache-Control':'no-store'}});
 const item=catalog.find(p=>p.id===id);
 try{
  // countryCode=US restricts returned options, and a SECOND inventory lookup
  // confirms positive physical CJ US-warehouse stock, not factory stock.
  const p=await cj(env,'/product/query?pid='+encodeURIComponent(id)+'&countryCode=US');
  const inventory=await cj(env,'/product/stock/getInventoryByPid?pid='+encodeURIComponent(id));
  const stock=usVariantStock(inventory);
  const variants=(p.variants||[]).filter(v=>Number(v.variantSellPrice)>0&&stock.has(String(v.vid))).map(v=>({
   id:v.vid,sku:v.variantSku,name:v.variantKey||v.variantNameEn,
   image:v.variantImage,priceCents:retailCents(v.variantSellPrice),usStock:stock.get(String(v.vid))
  }));
  return Response.json({
   id,name:item?.name||p.productNameEn||p.productName||'Furniture item',
   image:p.bigImage||p.productImage||item?.image,images:p.productImageSet||[],description:p.description||'',
   variants,warehouseCountry:'US',originVerified:false,inStockUS:variants.length>0,
   checkoutEnabled:false
  },{headers:{'Cache-Control':'public, max-age=120'}});
 }catch{
  return Response.json({error:'U.S. warehouse price or inventory could not be verified.'},{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
