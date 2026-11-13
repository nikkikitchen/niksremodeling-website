// Import public product metadata as drafts. Never infer a supplier cost from a selling price.
import {catalog} from '../store-catalog.js';
import {retailCatalog} from '../retail-catalog.js';
import {bathroomCatalog} from '../bathroom-catalog.js';
import {readFileSync,writeFileSync} from 'node:fs';
const sql=s=>"'"+String(s).replaceAll("'","''")+"'";
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const placements=new Map(),products=new Map();
for(const [items,department] of [[catalog,'furniture'],[retailCatalog,null],[bathroomCatalog,'bathroom']])for(const p of items){
 const dept=department||p.department||'other',category=p.category||p.type||'all';
 const context='shopping:'+dept+'/'+slug(category);placements.set(context,dept+' · '+category);
 placements.set('shopping:'+dept,dept[0].toUpperCase()+dept.slice(1));
 const existing=products.get(p.id)||{id:p.id,name:p.name,images:[p.image],contexts:[]};existing.contexts.push(context);
 if(dept==='bathroom'){
  existing.contexts.push('project:bathrooms');
  const slot=/faucet/i.test(p.name)?'faucet':/vanity light|sconce/i.test(p.name)?'light':/mirror/i.test(p.name)?'mirror':/towel|holder|hardware/i.test(p.name)?'accessories':null;
  if(slot){
   const tiers=slot==='faucet'?['basic']:slot==='accessories'?['basic','deluxe']:['standard','deluxe'];
   for(const tier of tiers)existing.contexts.push('package:bathrooms/'+tier+'/'+slot);
   existing.contexts.push('work:'+({faucet:'faucet-service',light:'lighting',mirror:'bathroom-mirror',accessories:'bathroom-accessories'}[slot]));
   existing.contexts.push('labor:'+({faucet:'vanity-faucet',light:'vanity-light',mirror:'mirror',accessories:'bathroom-accessories'}[slot]));
  }
 }
 existing.contexts=[...new Set(existing.contexts)];products.set(p.id,existing);
}
for(const p of products.values())for(const context of p.contexts)if(!placements.has(context))placements.set(context,context.replaceAll(':',' · ').replaceAll('/',' · '));
for(const project of JSON.parse(readFileSync(new URL('../docs/package-audit-2026-11-13.json',import.meta.url),'utf8')))placements.set('project:'+project.id,project.title);
const statements=['-- Public metadata only. All imports are drafts with unknown cost and unverified stock.'];
for(const [context,label] of placements)statements.push('INSERT OR IGNORE INTO catalog_categories(context,label) VALUES('+sql(context)+','+sql(label)+');');
for(const p of products.values())statements.push('INSERT OR IGNORE INTO business_products(id,name,images,contexts,supplier,supplier_product_id,status) VALUES('+[p.id,p.name,JSON.stringify(p.images),JSON.stringify(p.contexts),'CJ Dropshipping',p.id,'draft'].map(sql).join(',')+');');
writeFileSync(new URL('../migrations/0002_catalog_drafts.sql',import.meta.url),statements.join('\n')+'\n');
console.log('Prepared '+products.size+' draft products and '+placements.size+' placements; no cost or availability fabricated.');
