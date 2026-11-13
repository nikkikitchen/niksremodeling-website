import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export function database(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../../migrations/0001_business_catalog.sql',import.meta.url),'utf8'));
 const adapt=(sql,args=[])=>({bind:(...values)=>adapt(sql,values),async first(){return sqlite.prepare(sql).get(...args)||null;},async all(){return {results:sqlite.prepare(sql).all(...args)};},async run(){const r=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}});
 return {prepare:sql=>adapt(sql),exec:sql=>sqlite.exec(sql),close:()=>sqlite.close(),sqlite};
}
