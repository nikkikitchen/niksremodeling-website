import {cj,PRODUCT_ID,retailCents,square} from '../_lib/commerce.js';
export async function onRequestGet({request,env}){
 const zip=new URL(request.url).searchParams.get('zip');if(!/^\d{5}$/.test(zip||''))return Response.json({error:'Enter a five-digit delivery ZIP code.'},{status:400});
 try{
 const p=await cj(env,'/product/query?pid='+PRODUCT_ID+'&countryCode=US');
 const v=(p.variants||[]).find(v=>v.vid==='1963146233666904066');if(!v)throw new Error('This option is unavailable');
 const inv=await cj(env,'/product/variant/queryByVid?vid='+v.vid+'&features=enable_inventory');
 const stock=(inv.inventories||[]).filter(i=>i.countryCode==='US').reduce((n,i)=>n+Number(i.totalInventory||0),0);if(stock<1)throw new Error('This item is currently unavailable');
 const rates=await cj(env,'/logistic/freightCalculate',{startCountryCode:'US',endCountryCode:'US',zip,products:[{vid:v.vid,quantity:1}]});
 const eligible=(rates||[]).filter(r=>Number.isFinite(Number(r.totalPostageFee??r.logisticPrice))&&Number(r.totalPostageFee??r.logisticPrice)>=0);
 if(!eligible.length)throw new Error('Delivery is unavailable for this ZIP code');
 const rate=eligible.sort((a,b)=>Number(a.totalPostageFee??a.logisticPrice)-Number(b.totalPostageFee??b.logisticPrice))[0];
 const shipping=Number(rate.totalPostageFee??(Number(rate.logisticPrice)+Number(rate.taxesFee||0)+Number(rate.clearanceOperationFee||0)));
 const total=retailCents(Number(v.variantSellPrice)+shipping);
 const catalog=await square(env,'/v2/catalog/list?types=TAX');
 const taxes=(catalog.objects||[]).filter(o=>!o.is_deleted&&o.tax_data?.enabled).map(o=>({id:o.id,name:o.tax_data.name,percentage:o.tax_data.percentage,scope:o.tax_data.applies_to_custom_amounts,inclusion:o.tax_data.inclusion_type}));
 const allowedZips=String(env.STORE_ALLOWED_ZIPS||'').split(',').map(s=>s.trim());
 const tax=taxes.find(t=>t.id===env.STORE_TAX_ID&&t.scope&&t.inclusion==='ADDITIVE'&&Number(t.percentage)>0);
 const checkoutEnabled=allowedZips.includes(zip)&&!!tax;
 const taxCents=tax?Math.round(total*Number(tax.percentage)/100):null;
 return Response.json({name:p.productNameEn,variant:v.variantKey,sku:v.variantSku,zip,stock,productCents:retailCents(v.variantSellPrice),deliveryCents:total-retailCents(v.variantSellPrice),subtotalCents:total,shippingMethod:rate.logisticName,transitDays:rate.logisticAging,taxConfigured:!!tax,taxCents,totalCents:taxCents===null?null:total+taxCents,checkoutEnabled},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e.message.startsWith('Square ')?'Payment settings need attention.':e.message==='Supplier unavailable'?'Delivery quote temporarily unavailable.':e.message},{status:503,headers:{'Cache-Control':'no-store'}});}
}
