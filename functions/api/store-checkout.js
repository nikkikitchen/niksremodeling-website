import {square} from '../_lib/commerce.js';
import {catalog} from '../../store-catalog.js';
import {retailCatalog} from '../../retail-catalog.js';
import {onRequestGet as getQuote} from './store-quote.js';

const HEADERS={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const fail=(message,status=503)=>Response.json({error:message,checkoutEnabled:false},{status,headers:HEADERS});

// Hosted Square payment for one verified US-stock catalog product. All totals
// come from fresh server-side supplier and Square tax lookups, never the cart.
export async function onRequestPost({request,env}){
 const origin=new URL(request.url).origin;
 if(request.headers.get('Origin')!==origin)return fail('Start checkout from our website.',403);
 let body;
 try{body=await request.json();}catch{return fail('Invalid checkout request.',400);}
 const productId=String(body?.productId||'');
 const variantId=String(body?.variantId||'');
 const zip=String(body?.zip||'');
 const address=String(body?.address||'').trim();
 const city=String(body?.city||'').trim();
 const state=String(body?.state||'').trim().toUpperCase();
 const requestId=String(body?.requestId||'');
 const expectedTotal=Number(body?.expectedTotal);
 if(!/^\d{8,30}$/.test(productId)||!/^[-\w]{8,64}$/.test(variantId)||
    !/^\d{5}$/.test(zip)||!/^[a-zA-Z0-9-]{16,64}$/.test(requestId)||
    !Number.isSafeInteger(expectedTotal)||expectedTotal<=0||
    Number(body?.quantity)!==1)
  return fail('Check the product, quantity and delivery ZIP before checkout.',400);
 if(![...catalog,...retailCatalog].some(x=>String(x.id)===productId))return fail('This item is not enabled for checkout.',400);
 // HARD PURCHASE HOLD: never create a Square payment link until verified tax,
 // delivery pricing and end-to-end payment tests have been approved.
 // This deliberately cannot be bypassed by an environment flag or browser state.
 return fail('Online purchases are temporarily paused while we verify shipping and sales tax. No payment was taken.');
 // Retail shipping is decided by the verified supplier freight quote, not a labor-service ZIP whitelist.
 try{
  const requestUrl=new URL('/api/store-quote',origin);
  requestUrl.searchParams.set('zip',zip);
  requestUrl.searchParams.set('product',productId);
  requestUrl.searchParams.set('variant',variantId);
  requestUrl.searchParams.set('address',address);
  requestUrl.searchParams.set('city',city);
  requestUrl.searchParams.set('state',state);
  const quoteResponse=await getQuote({request:new Request(requestUrl),env});
  const q=await quoteResponse.json();
  if(!quoteResponse.ok||!q.checkoutEnabled||!Number.isSafeInteger(q.totalCents))
   return fail(q.error||'Price, stock, shipping or tax could not be confirmed.');
  if(String(q.variantId)!==variantId||Number(q.stock)<1)return fail('This product option is unavailable.');
  if(q.totalCents!==expectedTotal)return fail('Price or tax changed. Review the new total before paying.',409);
  if(!Number.isSafeInteger(q.subtotalCents)||q.subtotalCents<=0||
     !Number.isSafeInteger(q.deliveryCents)||q.deliveryCents<=0)
   return fail('Delivery pricing needs confirmation.');
  const {location}=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));
  if(location?.status!=='ACTIVE'||location.currency!=='USD'||
      !location.capabilities?.includes('CREDIT_CARD_PROCESSING'))
   return fail('Secure payments are not available for this merchant location.');
  const itemName=String(q.name||'Remodeling merchandise').slice(0,200);
  if(!/^(?:\d{1,2})(?:\.\d{1,4})?$/.test(String(q.taxRatePercent))||typeof q.shippingTaxable!=='boolean')
   return fail('Destination sales-tax calculation needs confirmation.');
  const taxUid='destination-sales-tax';
  const lineItems=q.shippingTaxable?[{
   name:itemName+' (delivered to '+zip+')',quantity:'1',base_price_money:{amount:q.subtotalCents,currency:'USD'},
   note:'CJ item '+productId+' / variant '+variantId+' / SKU '+String(q.sku||'unknown').slice(0,70)+'. Product plus quoted delivery included.',
   applied_taxes:[{tax_uid:taxUid}]
  }]:[{
   name:itemName,quantity:'1',base_price_money:{amount:q.productCents,currency:'USD'},
   note:'CJ item '+productId+' / variant '+variantId+' / SKU '+String(q.sku||'unknown').slice(0,70),
   applied_taxes:[{tax_uid:taxUid}]
  },{
   name:'Verified delivery to '+zip,quantity:'1',base_price_money:{amount:q.deliveryCents,currency:'USD'}
  }];
  const payment=await square(env,'/v2/online-checkout/payment-links',{
   idempotency_key:requestId,
   description:itemName+' — verified US-stock merchandise. Fulfillment after payment and address verification.',
   order:{
    location_id:env.SQUARE_LOCATION_ID,
    reference_id:requestId.slice(0,40),
    line_items:lineItems,
    taxes:[{uid:taxUid,name:'Destination sales tax',percentage:String(q.taxRatePercent),scope:'LINE_ITEM'}]
   },
   checkout_options:{
    ask_for_shipping_address:true,allow_tipping:false,
    merchant_support_email:'contact@niksremodeling.com',
    redirect_url:origin+'/project-cart.html?payment=returned'
   },
   payment_note:'Verify COMPLETED payment, buyer address ZIP '+zip+', verified CJ stock, and funds before manually ordering from supplier. Refund/contact buyer if address differs.'
  });
  // Never send a buyer to a payment link whose actual Square order total
  // differs from the freshly verified amount (rounding/tax settings included).
  const actualOrder=payment.related_resources?.orders?.find(order=>order.id===payment.payment_link?.order_id)
    || payment.related_resources?.orders?.[0];
  if(!Number.isSafeInteger(actualOrder?.total_money?.amount)||
     actualOrder.total_money.amount!==q.totalCents)
   return fail('Square tax or order total does not match the verified quote. Checkout was stopped.');
  const url=payment.payment_link?.url;
  if(!url||!/^https:\/\/(square\.link|checkout\.square\.site)\//.test(url))
   return fail('Square did not return a valid secure checkout link.');
  return Response.json({url,totalCents:q.totalCents,zip},{headers:HEADERS});
 }catch{return fail('Secure checkout could not be started. No order was placed.');}
}
