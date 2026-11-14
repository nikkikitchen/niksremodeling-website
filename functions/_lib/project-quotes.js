import {invalid} from './transactions.js';
export function approvedQuote(input){
 const text=(value,max)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
 if(!text(input.customerName,90)||!text(input.customerEmail,254)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail)||
  !text(input.projectName,200)||!text(input.scope,6000)||input.taxReviewed!==true||input.scopeApproved!==true)
  invalid('Confirm customer, scope and tax treatment before approving a quote.');
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>60)invalid('Provide the complete approved itemization.');
 let total=0;
 for(const item of input.items){
  if(!text(item.name,200)||!['labor','materials','supplies','fees','removal','discount','tax'].includes(item.category)||
   !Number.isSafeInteger(item.amountCents)||item.amountCents<0||item.amountCents>100000000)invalid('Check each itemized amount.');
  if(item.category==='materials'&&(!Number.isSafeInteger(item.costCents)||item.costCents<=0||item.amountCents!==Math.ceil(item.costCents*135/100)))
   invalid('Materials require a verified cost and exactly 35% markup.');
  total+=(item.category==='discount'?-1:1)*item.amountCents;
 }
 if(!Number.isSafeInteger(total)||total<=0||total>100000000||input.totalCents!==total||!Number.isSafeInteger(input.depositCents)||input.depositCents<=0||input.depositCents>total)
  invalid('Approved total, deposit and itemization must reconcile.');
 if(!Number.isFinite(Date.parse(input.expiresAt))||Date.parse(input.expiresAt)<=Date.now()||Date.parse(input.expiresAt)>Date.now()+90*86400000)
  invalid('Choose an expiry within 90 days.');
 return {totalCents:total};
}
