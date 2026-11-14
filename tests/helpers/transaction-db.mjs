import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
// Execute actual production schema and queries; no SQL-pattern mocks.
export function database({initialize=true}={}){
 const sqlite=new DatabaseSync(':memory:');
 if(initialize)sqlite.exec(readFileSync(new URL('../../migrations/0003_transactions.sql',import.meta.url),'utf8'));
 return {sqlite,async batch(statements){
 sqlite.exec('BEGIN');try{const results=[];for(const statement of statements)results.push(await statement.run());sqlite.exec('COMMIT');return results;}catch(error){sqlite.exec('ROLLBACK');throw error;}
 },prepare(sql){return {bind(...args){return {
  async run(){const result=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(result.changes)}};},
  async first(){return sqlite.prepare(sql).get(...args)||null;},
  async all(){return {results:sqlite.prepare(sql).all(...args)};}
 };},async all(){return {results:sqlite.prepare(sql).all()};}};}};
}
export function transactionEnv(){return {BUSINESS_DB:database(),SQUARE_ENVIRONMENT:'sandbox',SQUARE_ACCESS_TOKEN:'sandbox-test-token',SQUARE_LOCATION_ID:'location',SQUARE_WEBHOOK_SIGNATURE_KEY:'test-webhook-key',SQUARE_WEBHOOK_URL:'https://example.test/api/square-webhook'};}
