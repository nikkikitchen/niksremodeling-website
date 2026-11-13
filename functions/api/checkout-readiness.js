import {square} from '../_lib/commerce.js';

// Read-only launch diagnostics: never return tokens, identifiers, location
// IDs, catalog IDs, exact secret names or raw processor errors.
export async function onRequestGet({request,env={}}) {
 const zip=new URL(request.url).searchParams.get('zip')||'';
 const hasZip=/^\d{5}$/.test(zip);
 const paymentConfigured=!!(env.SQUARE_ACCESS_TOKEN||env.TOKEN)&&!!env.SQUARE_LOCATION_ID;
 const taxConfigured=!!env.ZIPTAX_API_KEY;
 const freightConfigured=!!(env.CJ_API_KEY||env.CJ_ACCESS_TOKEN);
 const destinationConfigured=hasZip;
 let paymentActive=false,taxActive=false;
 if(paymentConfigured){
  try{
   const data=await square(env,'/v2/locations/'+encodeURIComponent(env.SQUARE_LOCATION_ID));
   paymentActive=data.location?.status==='ACTIVE'&&data.location.currency==='USD'&&
    !!data.location.capabilities?.includes('CREDIT_CARD_PROCESSING');
  }catch{}
 }
 // Destination tax is calculated per verified address, then Square validates the exact order total.
 taxActive=taxConfigured;
 const ready=paymentActive&&taxActive&&freightConfigured&&destinationConfigured;
 const checks={paymentProcessor:paymentActive?'ready':'needs setup',
  salesTax:taxActive?'ready':'needs setup',
  supplier:freightConfigured?'configured':'needs setup',
  destination:!hasZip?'enter ZIP':'eligible for shipping quote'};
 return Response.json({checkoutReadyForVerification:false,checkoutPaused:true,configurationReadyForTesting:ready,
  checks:{...checks,onlinePurchases:'paused'},
  note:'Online purchases are temporarily paused. The shopping cart and shipping/tax previews are estimates only. No payment links can be created until we complete and approve end-to-end testing.'},
  {headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
