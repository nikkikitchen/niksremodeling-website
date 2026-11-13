import {isAvailable,sellingCents} from './business-catalog.js';
export function projectDashboard(project,lines,expenses){
 const warnings=[],purchasing=[];
 if(!lines.length)warnings.push('Material quantities are missing.');
 const expected={materials:0,supplies:0,labor:0,shipping:0,tax:0,fees:project.fees_cost_cents,other:0};
 if(project.internal_hourly_cost_cents===null)warnings.push('Actual hourly labor cost is missing; the customer billing rate is not an internal expense.');
 else expected.labor=Math.round(project.labor_hours*project.internal_hourly_cost_cents);
 for(const line of lines){
  const cost=line.supplier_cost_cents,selling=sellingCents(cost,line.markup_bps);
  if(cost===null)warnings.push(line.name+': supplier cost is missing.');
  else expected.materials+=Math.ceil(cost*line.quantity);
  for(const type of ['shipping','tax']){
   const amount=line[type+'_cost_cents'];if(amount===null)warnings.push(line.name+': '+type+' cost is unverified.');
   else expected[type]+=amount;
  }
  if(!isAvailable(line)||line.stock_quantity<line.quantity)warnings.push(line.name+': required quantity is not supported by current verified stock.');
  if(line.allowance_cents!==null){
   if(line.shipping_cost_cents===null||line.tax_cost_cents===null)warnings.push(line.name+': delivered allowance cannot be confirmed.');
   else if(selling!==null&&selling*line.quantity+line.shipping_cost_cents+line.tax_cost_cents>line.allowance_cents)
    warnings.push(line.name+': selected materials and delivered costs exceed the allowance; confirm the customer upgrade price.');
  }
  purchasing.push({productId:line.product_id,name:line.name,supplier:line.supplier,sku:line.supplier_sku,unit:line.unit,
   required:line.quantity,purchased:line.purchased_quantity,toPurchase:Math.max(0,line.quantity-line.purchased_quantity),
   supplierReserveCents:cost===null?null:Math.ceil(Math.max(0,line.quantity-line.purchased_quantity)*cost),shippingPending:line.shipping_cost_cents===null,taxPending:line.tax_cost_cents===null});
 }
 const actual={materials:0,supplies:0,labor:0,shipping:0,tax:0,fees:0,other:0};
 for(const expense of expenses)actual[expense.category]+=expense.amount_cents;
 for(const category of Object.keys(actual))if(actual[category]>expected[category])warnings.push('Recorded '+category+' expenses exceed their estimate.');
 const estimatedCostCents=Object.keys(expected).reduce((sum,key)=>sum+Math.max(expected[key],actual[key]),0);
 const missing=warnings.some(w=>/missing|unverified|cannot be confirmed/.test(w));
 const estimatedProfitCents=missing?null:project.selling_total_cents-estimatedCostCents;
 if(estimatedProfitCents!==null&&estimatedProfitCents<0)warnings.push('Estimated selling total is below estimated job cost.');
 return {project,estimatedCosts:expected,actualExpenses:actual,actualExpensesCents:Object.values(actual).reduce((a,b)=>a+b,0),
  estimatedCostCents,estimatedProfitCents,profitComplete:!missing,warnings,purchasing,expenses};
}
