import {body,sameOrigin,invalid,json,fingerprint,safeError} from '../_lib/transactions.js';
export async function onRequestPost({request,env}){
 try{
  sameOrigin(request);const b=await body(request);
  if(!env.BUSINESS_DB)invalid('Scheduling requests are temporarily unavailable. Please contact us.',503);
  const name=String(b.name||'').trim(),phone=String(b.phone||'').trim(),email=String(b.email||'').trim(),details=String(b.details||'').trim();
  if(!/^[a-f0-9-]{36}$/.test(b.requestId||'')||name.length<2||name.length>90||!/^[+\d ()-]{7,25}$/.test(phone)||
   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!/^\d{5}$/.test(b.zip||'')||!details||details.length>6000||
   !/^\d{4}-\d{2}-\d{2}$/.test(b.date||'')||!Number.isFinite(Date.parse(b.date))||new Date(b.date).toISOString().slice(0,10)!==b.date||
   b.date<new Date().toISOString().slice(0,10))invalid('Check contact information, project details and preferred date.');
  const hash=await fingerprint({name,phone,email,date:b.date,zip:b.zip,details});
  await env.BUSINESS_DB.prepare('INSERT OR IGNORE INTO scheduling_requests(id,request_key,fingerprint,customer_name,phone,email,preferred_date,zip,project_details) VALUES(?,?,?,?,?,?,?,?,?)')
   .bind(crypto.randomUUID(),b.requestId,hash,name,phone,email,b.date,b.zip,details).run();
  const saved=await env.BUSINESS_DB.prepare('SELECT id,fingerprint,status FROM scheduling_requests WHERE request_key=?').bind(b.requestId).first();
  if(saved.fingerprint!==hash)invalid('Request changed. Please start a new scheduling request.',409);
  return json({reference:saved.id,status:saved.status,message:'Your request was received for owner review. Your preferred date is not confirmed.'},201);
 }catch(error){return safeError(error);}
}
