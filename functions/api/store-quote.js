import {cj,PRODUCT_ID,retailCents,square,usCjWarehouseUnits} from '../_lib/commerce.js';
import {catalog} from '../../store-catalog.js';
export async function onRequestGet({request,env}){
 const params=new URL(request.url).searchParams;
 const id=params.get('product')||PRODUCT_ID;
 if(!/^[\w-]{8,64}$/.test(id))return Response.json({error:'Invalid product.'},{status:400});
 if(["2003348098417340418","2003347794848272385"].includes(id))return Response.json({error:'Product excluded: no verified U.S. warehouse stock.'},{status:404,headers:{'Cache-Control':'no-store'}});
 const catalogItem=catalog.find(p=>p.id===id);
 const zip=params.get('zip');if(!/^\d{5}$/.test(zip||''))return Response.json({error:'Enter a five-digit delivery ZIP code.'},{status:400});
 try{
 const p=await cj(env,'/product/query?pid='+encodeURIComponent(id)+'&countryCode=US');
 const item=catalogItem||{id,name:p.productNameEn||p.productName||'Furniture item'};
 const v=(p.variants||[]).find(v=>v.vid===(params.get('variant')||item.variantId));if(!v)throw new Error('This option is unavailable');
 const inv=await cj(env,'/product/stock/queryByVid?vid='+encodeURIComponent(v.vid));
 const stock=usCjWarehouseUnits(inv);
 if(stock<1)throw new Error('No confirmed U.S. warehouse stock for this option');
 const rates=await cj(env,'/logistic/freightCalculate',{startCountryCode:'US',endCountryCode:'US',zip,products:[{vid:v.vid,quantity:1}]});
 const eligible=(rates||[]).filter(r=>Number.isFinite(Number(r.totalPostageFee??r.logisticPrice))&&Number(r.totalPostageFee??r.logisticPrice)>=0);
 if(!eligible.length)throw new Error('Delivery is unavailable for this ZIP code');
 const rate=eligible.sort((a,b)=>Number(a.totalPostageFee??a.logisticPrice)-Number(b.totalPostageFee??b.logisticPrice))[0];
 const shipping=Number(rate.totalPostageFee??(Number(rate.logisticPrice)+Number(rate.taxesFee||0)+Number(rate.clearanceOperationFee||0)));
 const total=retailCents(Number(v.variantSellPrice)+shipping);
 const catalog=await square(env,'/v2/catalog/list?types=TAX');
 const taxes=(catalog.objects||[]).filter(o=>!o.is_deleted&&o.tax_data?.enabled).map(o=>({id:o.id,name:o.tax_data.name,percentage:o.tax_data.percentage,scope:o.tax_data.applies_to_custom_amounts,inclusion:o.tax_data.inclusion_type}));
 const allowedZips=String(env.STORE_ALLOWED_ZIPS||'').split(',').map(s=>s.trim());
 const tax=taxes.find(t=>t.id===env.STORE_TAX_ID&&t.scope&&t.inclusion==='ADDITIVE'&&Number.isFinite(Number(t.percentage))&&Number(t.percentage)>0&&Number(t.percentage)<=100);
 const checkoutEnabled=item.id===PRODUCT_ID&&v.vid===item.variantId&&env.STORE_CHECKOUT_ENABLED==='true'&&allowedZips.includes(zip)&&!!tax;
 const taxCents=tax?Math.round(total*Number(tax.percentage)/100):null;
 return Response.json({productId:item.id,variantId:v.vid,name:item.name,variant:v.variantKey,sku:v.variantSku,zip,stock,productCents:retailCents(v.variantSellPrice),deliveryCents:total-retailCents(v.variantSellPrice),subtotalCents:total,shippingMethod:rate.logisticName,transitDays:rate.logisticAging,taxConfigured:!!tax,taxCents,totalCents:taxCents===null?null:total+taxCents,checkoutEnabled},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e.message.startsWith('Square ')?'Payment settings need attention.':e.message==='Supplier unavailable'?'Delivery quote temporarily unavailable.':e.message},{status:503,headers:{'Cache-Control':'no-store'}});}
}
