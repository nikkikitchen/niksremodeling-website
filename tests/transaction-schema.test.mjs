import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {database} from './helpers/transaction-db.mjs';
import {ensureTransactionRecords,transactionRecordsReady,transactionSchemaSQL} from '../functions/_lib/transaction-schema.js';
import {onRequestPost as initialize} from '../functions/api/initialize-records.js';
import {onRequestPost as schedule} from '../functions/api/scheduling.js';
const request=(b,origin='https://example.test')=>new Request('https://example.test/api/initialize-records',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(b)});
test('automatic schema matches the versioned migration and only creates additive tables/indexes',()=>{
 assert.equal(transactionSchemaSQL,readFileSync(new URL('../migrations/0003_transactions.sql',import.meta.url),'utf8'));
 const statements=transactionSchemaSQL.replace(/^\s*--.*$/gm,'').split(';').map(s=>s.trim()).filter(Boolean);
 assert.equal(statements.length,5);assert.ok(statements.every(sql=>/^CREATE (?:TABLE|INDEX) IF NOT EXISTS\b/.test(sql)));
});
test('concurrent initialization creates records without changing an existing catalog',async()=>{
 const db=database({initialize:false}),env={BUSINESS_DB:db};db.sqlite.exec("CREATE TABLE existing_catalog(id TEXT PRIMARY KEY,name TEXT); INSERT INTO existing_catalog VALUES('keep','Existing product');");
 assert.equal(await transactionRecordsReady(env),false);let batches=0;const original=db.batch.bind(db);db.batch=async statements=>{batches++;return original(statements);};
 await Promise.all(Array.from({length:5},()=>ensureTransactionRecords(env)));
 assert.equal(batches,1);assert.equal(await transactionRecordsReady(env),true);assert.equal(db.sqlite.prepare('SELECT name FROM existing_catalog').get().name,'Existing product');
 await ensureTransactionRecords(env);assert.equal(batches,1);
});
test('initialization rejects cross-origin requests and caller-supplied SQL',async()=>{
 const env={BUSINESS_DB:database({initialize:false})};
 assert.equal((await initialize({env,request:request({initializeRecords:true},'https://other.test')})).status,403);
 assert.equal((await initialize({env,request:request({initializeRecords:true,sql:'DROP TABLE existing_catalog'})})).status,400);
 assert.equal(await transactionRecordsReady(env),false);
 const result=await initialize({env,request:request({initializeRecords:true})});assert.equal(result.status,200);assert.deepEqual(await result.json(),{recordsInitialized:true});
 assert.equal((await initialize({env,request:request({initializeRecords:true})})).status,200);
});
test('a real customer request initializes its own storage and is recorded exactly once',async()=>{
 const env={BUSINESS_DB:database({initialize:false})},b={requestId:crypto.randomUUID(),name:'Customer',phone:'555-555-5555',email:'test@example.test',date:'2099-01-01',zip:'30117',details:'Measured Accent Standard request'};
 const make=()=>new Request('https://example.test/api/scheduling',{method:'POST',headers:{Origin:'https://example.test','Content-Type':'application/json'},body:JSON.stringify(b)});
 const first=await schedule({env,request:make()});assert.equal(first.status,201);const one=await first.json();
 const two=await (await schedule({env,request:make()})).json();assert.equal(one.reference,two.reference);assert.equal(one.status,'requested');
 assert.equal(env.BUSINESS_DB.sqlite.prepare('SELECT count(*) AS n FROM scheduling_requests').get().n,1);
});
