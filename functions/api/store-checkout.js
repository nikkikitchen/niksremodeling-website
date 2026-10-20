import {square,PRODUCT_ID} from '../_lib/commerce.js';
import {onRequestGet as getQuote} from './store-quote.js';
export async function onRequestPost({request,env}){
 const origin=new URL(request.url).origin;
 if(request.headers.get('Origin')!==origin)return Response.json({error:'Please start checkout from our website.'},{status:403});
 try{
 const body=await request.json();
 if(!/^\d{5}$/.test(body.zip||'')||!Number.isSafeInteger(body.expectedTotal)||!/^[-\w]{16,80}$/.test(body.requestId||''))return Response.json({error:'Check your order details.'},{status:400});
 const response=await getQuote({request:new Request(origin+'/api/store-quote?zip='+body.zip),env});const q=await response.json();
 if(!response.ok)return Response.json(q,{status:503});
 if(!q.checkoutEnabled)return Response.json({error:'Online checkout is not available for this delivery area yet. Please call 678-231-4377.'},{status:503});
 if(q.totalCents!==body.expectedTotal)return Response.json({error:'The price changed. Please check delivery again before paying.'},{status:409});
 const {location}=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));
 if(location?.status!=='ACTIVE'||location.currency!=='USD'||!location.capabilities?.includes('CREDIT_CARD_PROCESSING'))throw Error('Payments unavailable');
 const result=await square(env,'/v2/online-checkout/payment-links',{
 idempotency_key:body.requestId,
 description:'Farmington Nightstand; manual fulfillment only after payment and funds availability are verified.',
 order:{location_id:env.SQUARE_LOCATION_ID,reference_id:body.requestId,line_items:[{name:'Farmington Nightstand — Brown, delivered to '+q.zip,quantity:'1',base_price_money:{amount:q.subtotalCents,currency:'USD'},note:'CJ SKU '+q.sku+'; product '+PRODUCT_ID+'; delivery included. Manual fulfillment only.'}],taxes:[{catalog_object_id:env.STORE_TAX_ID,scope:'ORDER'}]},
 checkout_options:{ask_for_shipping_address:true,allow_tipping:false,merchant_support_email:'contact@niksremodeling.com',redirect_url:origin+'/furniture.html?payment=returned'},
 payment_note:'Manual fulfillment: verify COMPLETED payment and cleared funds before placing CJ order. Quote is for ZIP '+q.zip+'. Confirm shipping address matches before fulfillment.'
 });
 const url=result.payment_link?.url;if(!url||!/^https:\/\/(square\.link|checkout\.square\.site)\//.test(url))throw Error('Payments unavailable');
 return Response.json({url},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Unable to start secure payment. No supplier order has been placed. Please call 678-231-4377.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
