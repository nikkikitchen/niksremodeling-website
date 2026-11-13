import {isAvailable,publicProduct,validContext} from '../_lib/business-catalog.js';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export async function onRequestGet({request,env={}}){
 if(!env.BUSINESS_DB||env.BUSINESS_CATALOG_ACTIVE!=='true')return Response.json({configured:false,products:[],categories:[],checkoutEnabled:false},{status:503,headers});
 const params=new URL(request.url).searchParams,context=params.get('context'),id=params.get('product'),query=params.get('q')||'';
 if((context&&!validContext(context))||query.length>120)return Response.json({error:'Invalid catalog filter.'},{status:400,headers});
 try{
  let sql='SELECT * FROM business_products WHERE status=\'active\'',bind=[];
  if(context){sql+=' AND EXISTS (SELECT 1 FROM json_each(contexts) WHERE value=?)';bind.push(context);}
  if(id){sql+=' AND id=?';bind.push(id);}
  if(query){sql+=' AND (name LIKE ? ESCAPE \'\\\' OR description LIKE ? ESCAPE \'\\\')';const q='%'+query.replace(/[\\%_]/g,'\\$&')+'%';bind.push(q,q);}
  const {results}=await env.BUSINESS_DB.prepare(sql+' ORDER BY name LIMIT 500').bind(...bind).all();
  const products=results.filter(row=>isAvailable(row)).map(publicProduct);
  const {results:categories}=await env.BUSINESS_DB.prepare('SELECT context,label,parent_context FROM catalog_categories ORDER BY label').all();
  return Response.json({configured:true,products,categories,checkoutEnabled:false},{headers});
 }catch{return Response.json({configured:true,error:'Catalog temporarily unavailable.',products:[],categories:[],checkoutEnabled:false},{status:503,headers});}
}
