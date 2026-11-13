import {quoteDetailedFreight} from '../_lib/detailed-freight.mjs';
import {selectConfirmedFreight, UNCONFIRMED_SHIPPING_MESSAGE} from '../_lib/verified-freight.mjs';
import {cj,PRODUCT_ID,retailCents,square,usCjWarehouseUnits} from '../_lib/commerce.js';
import {catalog} from '../../store-catalog.js';
import {retailCatalog} from '../../retail-catalog.js';
import {destinationSalesTax} from '../_lib/destination-tax.js';
export async function onRequestGet({request,env}){
 const params=new URL(request.url).searchParams;
 const id=params.get('product')||PRODUCT_ID;
 if(!/^[\w-]{8,64}$/.test(id))return Response.json({error:'Invalid product.'},{status:400});
 if(["2003348098417340418","2003347794848272385"].includes(id))return Response.json({error:'Product excluded: no verified U.S. warehouse stock.'},{status:404,headers:{'Cache-Control':'no-store'}});
 const catalogItem=[...catalog,...retailCatalog].find(p=>String(p.id)===id);
 if(!catalogItem)return Response.json({error:'This product is not yet enabled for online checkout.'},{status:404,headers:{'Cache-Control':'no-store'}});
 const zip=params.get('zip');if(!/^\d{5}$/.test(zip||''))return Response.json({error:'Enter a five-digit delivery ZIP code.'},{status:400});
 try{
 const p=await cj(env,'/product/query?pid='+encodeURIComponent(id)+'&countryCode=US');
 const item=catalogItem||{id,name:p.productNameEn||p.productName||'Furniture item'};
 const v=(p.variants||[]).find(v=>v.vid===(params.get('variant')||item.variantId));if(!v)throw new Error('This option is unavailable');
 const inv=await cj(env,'/product/stock/queryByVid?vid='+encodeURIComponent(v.vid));
 const stock=usCjWarehouseUnits(inv);
 if(stock<1)throw new Error('No confirmed U.S. warehouse stock for this option');
 // A temporary failure in CJ's basic freight endpoint must not bypass the
 // independently verified detailed quote fallback. Neither path may invent freight.
 let confirmed=null;
 try {
  const rates=await cj(env,'/logistic/freightCalculate',{startCountryCode:'US',endCountryCode:'US',zip,products:[{vid:v.vid,quantity:1}]});
  confirmed=selectConfirmedFreight(rates);
 } catch {
  // Try CJ's detailed freight endpoint before reporting delivery unavailable.
 }
 if(!confirmed)confirmed=await quoteDetailedFreight(env,[{product:p,variant:v,quantity:1}],zip);
 if(!confirmed)throw new Error(UNCONFIRMED_SHIPPING_MESSAGE);
 const {rate,freight:shipping}=confirmed;
 const total=retailCents(Number(v.variantSellPrice)+shipping);
 const tax=await destinationSalesTax(env,{
  zip,address:params.get('address'),city:params.get('city'),state:params.get('state')
 });
 const locationId=String(env.SQUARE_LOCATION_ID||'');
 // Price/shipping/tax quotes may be tested, but they never authorize payment.
 const checkoutEnabled=false;
 const taxableCents=retailCents(v.variantSellPrice)+(tax.shippingTaxable?total-retailCents(v.variantSellPrice):0);
 const taxCents=Math.round(taxableCents*tax.rate);
 return Response.json({productId:item.id,variantId:v.vid,name:item.name,variant:v.variantKey,sku:v.variantSku,zip,stock,productCents:retailCents(v.variantSellPrice),deliveryCents:total-retailCents(v.variantSellPrice),subtotalCents:total,shippingMethod:rate.logisticName,transitDays:rate.logisticAging,taxConfigured:true,taxRatePercent:tax.ratePercent,shippingTaxable:tax.shippingTaxable,taxCents,totalCents:total+taxCents,checkoutEnabled,checkoutPaused:true},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e.message.startsWith('Square ')?'Payment settings need attention.':e.message==='Supplier unavailable'?'Delivery quote temporarily unavailable.':e.message},{status:503,headers:{'Cache-Control':'no-store'}});}
}
