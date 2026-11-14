import {body,sameOrigin,invalid,json,safeError} from '../_lib/transactions.js';
import {ensureTransactionRecords} from '../_lib/transaction-schema.js';
// Deployment bootstrap for fixed, additive application tables. This route never
// accepts SQL or business data, changes authentication, or calls a payment API.
export async function onRequestPost({request,env}){
 try{
  sameOrigin(request);const input=await body(request);
  if(!input||input.initializeRecords!==true||Object.keys(input).length!==1)invalid('Invalid record initialization request.');
  await ensureTransactionRecords(env);return json({recordsInitialized:true});
 }catch(error){return safeError(error);}
}
