import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../store-catalog.js';
import { usCjWarehouseUnits, usVariantStock } from '../functions/_lib/commerce.js';
import { onRequestGet as getProduct } from '../functions/api/store-product.js';
import { onRequestGet as getQuote } from '../functions/api/store-quote.js';

const blocked=['2003348098417340418','2003347794848272385'];
const urlFor=id=>new Request('https://niksremodeling.com/api/store-product?product='+id);

test('both unstocked kids bookcases are absent from the published catalog and blocked from APIs',async()=>{
 for(const id of blocked){
  assert.equal(catalog.some(p=>p.id===id),false);
  assert.equal((await getProduct({request:urlFor(id),env:{}})).status,404);
  const req=new Request('https://niksremodeling.com/api/store-quote?product='+id+'&zip=30117');
  assert.equal((await getQuote({request:req,env:{}})).status,404);
 }
});

test('U.S. stock never includes overseas or factory inventory',()=>{
 const rows=[
  {countryCode:'CN',cjInventoryNum:200,totalInventoryNum:200},
  {countryCode:'US',cjInventoryNum:0,factoryInventoryNum:500,totalInventoryNum:500},
 ];
 assert.equal(usCjWarehouseUnits(rows),0);
 assert.equal(usCjWarehouseUnits([...rows,{countryCode:'US',cjInventoryNum:5}]),5);
 const available=usVariantStock({variantInventories:[
  {vid:'us',inventory:[{countryCode:'US',cjInventoryNum:5}]},
  {vid:'overseas',inventory:rows},
 ]});
 assert.equal(available.get('us'),5);
 assert.equal(available.has('overseas'),false);
});

test('a variant gets a customer price only with confirmed U.S. warehouse units',async()=>{
 const previous=globalThis.fetch;
 let hasUS=false;
 globalThis.fetch=async url=>{
  const s=String(url);
  if(s.includes('/product/query?'))
   return Response.json({result:true,data:{productNameEn:'Test Dresser',variants:[
    {vid:'test-variant',variantSellPrice:45,variantSku:'SKU-TEST',variantKey:'Brown'}
   ]}});
  if(s.includes('/product/stock/getInventoryByPid?'))
   return Response.json({result:true,data:{variantInventories:[{vid:'test-variant',inventory:[
    {countryCode:hasUS?'US':'CN',cjInventoryNum:8}
   ]}]}});
  throw new Error('Unexpected supplier URL');
 };
 try{
  const env={CJ_ACCESS_TOKEN:'test-token'};
  const id='1986004684113051649';
  const no=await (await getProduct({request:urlFor(id),env})).json();
  assert.equal(no.inStockUS,false);
  assert.equal(no.variants.length,0);
  hasUS=true;
  const yes=await (await getProduct({request:urlFor(id),env})).json();
  assert.equal(yes.inStockUS,true);
  assert.equal(yes.variants[0].priceCents,6075);
  assert.equal(yes.variants[0].usStock,8);
  assert.equal(yes.checkoutEnabled,false);
 }finally{globalThis.fetch=previous;}
});
