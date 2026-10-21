import {cj,PRODUCT_ID,retailCents,square} from '../_lib/commerce.js';
import {catalog} from '../../store-catalog.js';
export async function onRequestGet({request,env}){
 const id=request?new URL(request.url).searchParams.get('product')||PRODUCT_ID:PRODUCT_ID;
 const item=catalog.find(p=>p.id===id);if(!item)return Response.json({error:'Product not found.'},{status:404});
 try{
 const p=await cj(env,'/product/query?pid='+item.id+'&countryCode=US');
 const variants=(p.variants||[]).filter(v=>Number(v.variantSellPrice)>0).map(v=>({id:v.vid,sku:v.variantSku,name:v.variantKey||v.variantNameEn,image:v.variantImage,priceCents:retailCents(v.variantSellPrice)}));
 let paymentsReady=false,paymentIssue='';
 try{const {location}=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));paymentsReady=location?.status==='ACTIVE'&&location?.currency==='USD'&&location?.capabilities?.includes('CREDIT_CARD_PROCESSING');}catch(e){paymentIssue=e.message;}
 return Response.json({id:item.id,name:item.name,image:p.bigImage||p.productImage,images:p.productImageSet||[],description:p.description||'',variants,paymentsReady,paymentIssue,checkoutEnabled:false},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Product details temporarily unavailable.'},{status:503});}
}
