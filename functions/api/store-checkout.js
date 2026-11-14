import {body as readBody,createCheckout,requireTransactions,safeError} from '../_lib/transactions.js';
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
 try{body=await readBody(request);}catch{return fail('Invalid checkout request.',400);}
 const productId=String(body?.productId||'');
 const variantId=String(body?.variantId||'');
 const zip=String(body?.zip||'');
 const address=String(body?.address||'').trim();
 const city=String(body?.city||'').trim();
 const state=String(body?.state||'').trim().toUpperCase();
 const requestId=String(body?.requestId||'');
 const expectedTotal=Number(body?.expectedTotal);
 if(!/^\d{8,30}$/.test(productId)||!/^[-\w]{8,64}$/.test(variantId)||
    !/^\d{5}$/.test(zip)||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(requestId)||
    !Number.isSafeInteger(expectedTotal)||expectedTotal<=0||
    Number(body?.quantity)!==1)
  return fail('Check the product, quantity and delivery ZIP before checkout.',400);
 if(body.termsAccepted!==true||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email||'')))return fail('Agree to the terms and enter your email.',400);
 if(![...catalog,...retailCatalog].some(x=>String(x.id)===productId))return fail('This item is not enabled for checkout.',400);
 // A purchase is allowed only after fresh supplier inventory, shipping and exact
 // destination tax are confirmed. All other carts remain quote-only.
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
     !Number.isSafeInteger(q.deliveryCents)||q.deliveryCents<0)
   return fail('Delivery pricing needs confirmation.');
  requireTransactions(env);
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
  const result=await createCheckout({env,id:requestId,kind:'retail',quote:q,
   customer:{email:String(body.email).trim(),address,city,state,zip},origin,
   order:{line_items:lineItems,taxes:[{uid:taxUid,name:'Destination sales tax',percentage:String(q.taxRatePercent),scope:'LINE_ITEM'}]},
   options:{ask_for_shipping_address:false,merchant_support_email:'contact@niksremodeling.com'}
  });
  return Response.json({...result,zip},{headers:HEADERS});
 }catch(error){return safeError(error);}
}
