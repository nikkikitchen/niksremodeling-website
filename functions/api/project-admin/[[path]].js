import {ownerRoute,privateJson} from '../../_lib/owner-auth.js';
import {body,invalid,safeError} from '../../_lib/transactions.js';
import {approvedQuote} from '../../_lib/project-quotes.js';
export const onRequest=ownerRoute(async({request,env,owner})=>{
 const db=env.BUSINESS_DB,route=new URL(request.url).pathname.replace(/^\/api\/project-admin\/?/,'');
 try{
  if(request.method==='GET'){
   if(route==='scheduling')return privateJson({requests:(await db.prepare('SELECT * FROM scheduling_requests ORDER BY created_at DESC LIMIT 200').all()).results});
   if(route==='orders')return privateJson({orders:(await db.prepare('SELECT id,kind,status,total_cents,project_quote_id,payment_mode,customer_json,quote_json,payment_id,square_order_id,receipt_url,paid_at,fulfillment_status FROM checkout_orders ORDER BY created_at DESC LIMIT 200').all()).results});
   if(route==='quotes')return privateJson({quotes:(await db.prepare('SELECT * FROM project_quotes ORDER BY approved_at DESC LIMIT 200').all()).results});
  }
  if(request.method==='POST'){
   const b=await body(request);
   if(route==='quotes'){
    const q=approvedQuote(b),id=crypto.randomUUID(),token=crypto.randomUUID()+crypto.randomUUID();
    await db.prepare('INSERT INTO project_quotes(id,token,customer_name,customer_email,project_name,scope,items_json,total_cents,deposit_cents,allow_full,approved_by,expires_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)')
     .bind(id,token,b.customerName.trim(),b.customerEmail.trim(),b.projectName.trim(),b.scope.trim(),JSON.stringify(b.items),q.totalCents,b.depositCents,b.allowFull===true?1:0,owner.email,new Date(b.expiresAt).toISOString()).run();
    return privateJson({id,url:new URL(request.url).origin+'/payment.html#quote='+token},201);
   }
   if(route==='revoke'){
    const result=await db.prepare('UPDATE project_quotes SET revoked=1 WHERE id=? AND active_checkout_id IS NULL').bind(String(b.id||'')).run();
    if(result.meta.changes!==1)invalid('Quote has a checkout or was not found. Contact the customer and cancel its Square link before changing it.',409);
    return privateJson({saved:true});
   }
   if(route==='scheduling'){
    if(!['accepted','declined'].includes(b.status)||typeof b.note!=='string'||b.note.length<3||b.note.length>2000)invalid('Choose a decision and include the customer confirmation details.');
    const result=await db.prepare("UPDATE scheduling_requests SET status=?,owner_note=?,reviewed_by=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=? AND status='requested'")
     .bind(b.status,b.note,owner.email,String(b.id||'')).run();
    if(result.meta.changes!==1)invalid('Request was already reviewed or was not found.',409);
    return privateJson({saved:true,message:'Decision saved. Contact the customer using the recorded contact details; no automated email was sent.'});
   }
  }
  return privateJson({error:'Operation not found.'},404);
 }catch(error){return safeError(error);}
});
