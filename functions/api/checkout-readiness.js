import {square} from '../_lib/commerce.js';

// Read-only launch diagnostics: never return tokens, identifiers, location
// IDs, catalog IDs, exact secret names or raw processor errors.
export async function onRequestGet({request,env={}}) {
 const zip=new URL(request.url).searchParams.get('zip')||'';
 const hasZip=/^\d{5}$/.test(zip);
 const allowed=String(env.STORE_ALLOWED_ZIPS||'').split(',').map(s=>s.trim()).filter(Boolean);
 const paymentConfigured=!!(env.SQUARE_ACCESS_TOKEN||env.TOKEN)&&!!env.SQUARE_LOCATION_ID;
 const taxConfigured=!!env.STORE_TAX_ID;
 const freightConfigured=!!(env.CJ_API_KEY||env.CJ_ACCESS_TOKEN);
 const destinationConfigured=hasZip&&allowed.includes(zip);
 let paymentActive=false,taxActive=false;
 if(paymentConfigured){
  try{
   const data=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));
   paymentActive=data.location?.status==='ACTIVE'&&data.location.currency==='USD'&&
    !!data.location.capabilities?.includes('CREDIT_CARD_PROCESSING');
  }catch{}
 }
 if(paymentConfigured&&taxConfigured){
  try{
   const data=await square(env,'/v2/catalog/list?types=TAX');
   taxActive=!!data.objects?.some(x=>x.id===env.STORE_TAX_ID&&x.tax_data?.enabled&&
    x.tax_data.inclusion_type==='ADDITIVE'&&x.tax_data.applies_to_custom_amounts&&
    Number(x.tax_data.percentage)>0);
  }catch{}
 }
 const ready=paymentActive&&taxActive&&freightConfigured&&destinationConfigured;
 const checks={paymentProcessor:paymentActive?'ready':'needs setup',
  salesTax:taxActive?'ready':'needs setup',
  supplier:freightConfigured?'configured':'needs setup',
  destination:!hasZip?'enter ZIP':destinationConfigured?'authorized':'not enabled'};
 return Response.json({checkoutReadyForVerification:ready,checks,
  note:ready?'Configuration appears ready. A specific item still requires live stock, freight, tax and Square order-total checks before payment.':'Online purchases stay blocked until each check passes. No money has been taken.'},
  {headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
