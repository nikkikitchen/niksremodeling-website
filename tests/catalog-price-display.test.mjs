import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {cardHtml,priceCards} from '../store-cards.js';

test('checked card prices survive supplier failures without claiming current stock',async()=>{
 const previous=globalThis.fetch;
 const dom=new JSDOM('<main></main>');
 const grid=dom.window.document.querySelector('main');
 grid.innerHTML=cardHtml({id:'saved-item',name:'Nightstand',category:'bedroom',priceCents:6713,priceCheckedAt:'2026-10-25'})+
   cardHtml({id:'unpriced-item',name:'Chair',category:'living-room'});
 globalThis.fetch=async()=>Response.json({error:'Supplier unavailable'},{status:503});
 try{
  await priceCards(grid);
  const cards=grid.querySelectorAll('article');
  assert.equal(cards[0].querySelector('.store-card-price').textContent,'Last checked: from $67.13');
  assert.match(cards[0].querySelector('.store-card-note').textContent,/2026-10-25.*Confirm current price and stock/);
  assert.equal(cards[0].dataset.verified,'false');
  assert.equal(cards[1].querySelector('.store-card-price').textContent,'Price confirmation needed');
  assert.equal(cards[1].dataset.verified,'false');
 }finally{globalThis.fetch=previous;dom.window.close();}
});

test('successful price checks update the price and remove the preview note',async()=>{
 const previous=globalThis.fetch;
 const dom=new JSDOM('<main></main>');
 const grid=dom.window.document.querySelector('main');
 grid.innerHTML=cardHtml({id:'priced-item',name:'Dresser',category:'bedroom'});
 globalThis.fetch=async()=>Response.json({inStockUS:true,warehouseCountry:'US',variants:[
  {priceCents:100,usStock:0},{priceCents:28498,usStock:230}
 ]});
 try{
  await priceCards(grid);
  assert.equal(grid.querySelector('.store-card-price').textContent,'$284.98');
  assert.equal(grid.querySelector('article').dataset.verified,'true');
  assert.equal(grid.querySelector('.store-card-note').textContent,'U.S. warehouse stock checked · Shipping & tax extra');
 }finally{globalThis.fetch=previous;dom.window.close();}
});
