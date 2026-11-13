import test from 'node:test';
import assert from 'node:assert/strict';
import {authenticateOwner} from '../functions/_lib/owner-auth.js';
import {onRequest as ownerApi} from '../functions/api/owner/[[path]].js';
import {onRequest as ownerPage} from '../functions/owner/[[path]].js';
import {database} from './helpers/d1.mjs';
import {js} from '../functions/_lib/owner-ui.js';
import {Script} from 'node:vm';
const encode=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url');
async function identity(){
 const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='test-key';
 const team='test-'+crypto.randomUUID()+'.cloudflareaccess.com',env={OWNER_ACCESS_DOMAIN:team,OWNER_ACCESS_AUD:'test-audience',OWNER_EMAILS:'owner@example.test'};
 const token=async override=>{const now=Math.floor(Date.now()/1000),body={iss:'https://'+team,aud:['test-audience'],email:'owner@example.test',iat:now,exp:now+600,...override};
  const data=encode({alg:'RS256',kid:jwk.kid})+'.'+encode(body),signature=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(data));return data+'.'+Buffer.from(signature).toString('base64url');};
 return {env,token,jwk};
}
function request(path,token,body,origin='https://niksremodeling.com'){
 return new Request('https://niksremodeling.com'+path,{method:body?'POST':'GET',headers:{...(token?{'Cf-Access-Jwt-Assertion':token}:{}),...(body?{'Content-Type':'application/json',Origin:origin}:{})},body:body?JSON.stringify(body):undefined});
}
test('every private route rejects anonymous access and does not trust an email header',async()=>{
 for(const path of ['/api/owner/products','/api/owner/projects','/api/owner/dashboard/test','/owner','/owner/app.js','/owner/style.css']){
  const fn=path.startsWith('/api/')?ownerApi:ownerPage;
  const response=await fn({request:new Request('https://niksremodeling.com'+path,{headers:{'Cf-Access-Authenticated-User-Email':'owner@example.test'}}),env:{OWNER_EMAILS:'owner@example.test',BUSINESS_DB:{}}});
  assert.equal(response.status,401);assert.match(response.headers.get('Cache-Control'),/no-store/);
  assert.ok(!(await response.text()).includes('supplier_cost'));
 }
});
test('cryptographically verified owner identity, audience, issuer and expiry are required',async()=>{
 const i=await identity(),old=global.fetch;global.fetch=async()=>Response.json({keys:[i.jwk]});
 try{
  const valid=await i.token({});assert.equal((await authenticateOwner(request('/owner',valid),i.env)).email,'owner@example.test');
  for(const overrides of [{email:'customer@example.test'},{aud:['other']},{iss:'https://attacker.test'},{exp:1},{iat:9999999999},{nbf:9999999999}])assert.equal(await authenticateOwner(request('/owner',await i.token(overrides)),i.env),null);
  assert.equal(await authenticateOwner(request('/owner',valid.slice(0,-4)+'abcd'),i.env),null);
  assert.equal(await authenticateOwner(request('/owner',valid),{...i.env,OWNER_EMAILS:''}),null);
 }finally{global.fetch=old;}
});
test('owner dashboard serves private assets; cross-origin writes fail and versions prevent overwrite',async()=>{
 const i=await identity(),db=database(),old=global.fetch;global.fetch=async()=>Response.json({keys:[i.jwk]});
 try{
  const token=await i.token({}),env={...i.env,BUSINESS_DB:db};
  for(const path of ['/owner','/owner/app.js','/owner/style.css']){
   const response=await ownerPage({request:request(path,token),env});assert.equal(response.status,200);assert.match(response.headers.get('Cache-Control'),/no-store/);assert.match(response.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
  }
  let response=await ownerApi({request:request('/api/owner/categories',token,{context:'shopping:test',label:'Test'},'https://attacker.test'),env});assert.equal(response.status,403);
  response=await ownerApi({request:request('/api/owner/categories',token,{context:'shopping:test',label:'Test'}),env});assert.equal(response.status,200);
  const p={id:'test',name:'Private product',description:'',images:['https://example.test/test.jpg'],contexts:['shopping:test'],supplier:'Private supplier',supplier_cost_cents:10000,markup_bps:3500,stock_quantity:0,warehouse_country:'US',requires_us_stock:true,shipping_required:true,stock_evidence:'',unit:'each',status:'draft'};
  response=await ownerApi({request:request('/api/owner/products',token,p),env});assert.equal(response.status,200);
  let req=new Request(request('/api/owner/products',token,{...p,expectedVersion:1}),{method:'PUT'});
  response=await ownerApi({request:req,env});assert.equal(response.status,200);
  req=new Request(request('/api/owner/products',token,{...p,expectedVersion:1}),{method:'PUT'});
  response=await ownerApi({request:req,env});assert.equal(response.status,409);
  response=await ownerApi({request:request('/api/owner/products',token),env});assert.equal((await response.json()).products[0].supplier_cost_cents,10000,'Only authenticated owner sees cost');
 }finally{global.fetch=old;db.close();}
});
test('private dashboard application parses without injecting unsafe inline handlers',()=>{
 assert.doesNotThrow(()=>new Script(js));assert.ok(!js.includes('eval('));
});

test('private CJ refresh records exact SKU cost and physical US stock without ordering',async()=>{
 const i=await identity(),db=database(),old=global.fetch;let units=2;const calls=[];
 global.fetch=async url=>{
  calls.push(String(url));if(String(url).includes('/access/certs'))return Response.json({keys:[i.jwk]});
  if(String(url).includes('/product/query'))return Response.json({result:true,data:{variants:[{vid:'v1',variantSku:'EXACT-SKU',variantSellPrice:12.34}]}});
  if(String(url).includes('/getInventoryByPid'))return Response.json({result:true,data:{variantInventories:[{vid:'v1',inventory:[{countryCode:'US',cjInventory:units},{countryCode:'CN',cjInventory:999}]}]}});
  throw Error('No payment or order endpoint is allowed');
 };
 try{
  db.sqlite.prepare("INSERT INTO business_products(id,name,images,contexts,supplier,supplier_product_id,supplier_sku,supplier_cost_cents,status) VALUES(?,?,?,?,?,?,?,?,?)").run('sku-test','Fixture','["https://example.test/x.jpg"]','["shopping:test"]','CJ Dropshipping','product-1','EXACT-SKU',1000,'active');
  const token=await i.token({}),env={...i.env,BUSINESS_DB:db,CJ_ACCESS_TOKEN:'mock'};
  let response=await ownerApi({request:request('/api/owner/refresh-stock',token,{id:'sku-test'}),env});assert.equal(response.status,200);assert.equal((await response.json()).sellingPriceCents,1666);
  let row=db.sqlite.prepare('SELECT * FROM business_products WHERE id=?').get('sku-test');assert.equal(row.supplier_cost_cents,1234);assert.equal(row.stock_quantity,2);
  units=0;response=await ownerApi({request:request('/api/owner/refresh-stock',token,{id:'sku-test'}),env});assert.equal(response.status,200);row=db.sqlite.prepare('SELECT * FROM business_products WHERE id=?').get('sku-test');assert.equal(row.stock_quantity,0);
  assert.ok(calls.every(url=>!url.includes('/order')&&!url.includes('/payment')));
 }finally{db.close();global.fetch=old;}
});
