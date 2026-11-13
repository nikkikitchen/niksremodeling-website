import {isAvailable,publicProduct,identifier,validContext,readBody} from '../_lib/business-catalog.js';
export async function onRequestPost({request,env={}}){
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
 const fail=(error,status=400)=>Response.json({error,checkoutEnabled:false},{status,headers});
 if(request.headers.get('Origin')!==new URL(request.url).origin)return fail('Start from the website.',403);
 if(!env.BUSINESS_DB||env.BUSINESS_CATALOG_ACTIVE!=='true')return fail('Catalog is not connected.',503);
 try{
  const body=await readBody(request),qty=body.quantity,context=body.context||null;
  if(!identifier(body.productId)||!Number.isSafeInteger(qty)||qty<1||qty>10000||(context&&!validContext(context)))return fail('Check the selected product and quantity.');
  const row=await env.BUSINESS_DB.prepare('SELECT * FROM business_products WHERE id=?').bind(body.productId).first();
  if(!row||!isAvailable(row)||row.stock_quantity<qty)return fail('Current stock is unavailable for this quantity.',409);
  if(context&&!JSON.parse(row.contexts).includes(context))return fail('This product is not assigned to that work.');
  const product=publicProduct(row),allowance=context?.startsWith('package:')?await env.BUSINESS_DB.prepare('SELECT allowance_cents FROM package_allowances WHERE context=?').bind(context).first():null;
  return Response.json({product,quantity:qty,merchandiseCents:product.sellingPriceCents*qty,
   allowanceCents:allowance?.allowance_cents??null,minimumUpgradeCents:allowance?Math.max(0,product.sellingPriceCents*qty-allowance.allowance_cents):null,
   deliveredAllowanceVerified:false,quoteRequired:true,shippingVerified:!product.shippingRequired,taxVerified:false,checkoutEnabled:false},{headers});
 }catch{return fail('The product selection could not be verified.',503);}
}
