import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
const dist=new URL('../dist/',import.meta.url);
const release=JSON.parse(readFileSync(new URL('release.json',dist),'utf8'));
let references=0;
for(const [file,hash] of Object.entries(release.files)){
 const path=new URL(file,dist), content=readFileSync(path,'utf8');
 if(createHash('sha256').update(content).digest('hex')!==hash)throw Error('Release hash mismatch: '+file);
 if(file.endsWith('.js'))execFileSync(process.execPath,['--check',path.pathname]);
 if(file.endsWith('.html')){
  const dom=new JSDOM(content);
  for(const element of dom.window.document.querySelectorAll('[src],link[href],a[href]')){
   const value=element.getAttribute('src')||element.getAttribute('href');
   if(!value||!value.startsWith('/')||value.startsWith('//'))continue;
   const url=new URL(value,'https://local.test');
   if(url.pathname==='/'||url.pathname.startsWith('/api/'))continue;
   if(!existsSync(new URL('.'+url.pathname,dist)))throw Error('Missing published reference: '+file+' → '+value);
   if(/\.(js|css)$/.test(url.pathname)&&url.searchParams.get('v')!==release.commit.slice(0,12))throw Error('Stale asset version: '+file+' → '+value);
   references++;
  }
  dom.window.close();
 }
 for(const match of content.matchAll(/(?:from\s*|import\s*\()(['"])(\.\.?\/[^'"?]+\.(?:js|mjs))(?:\?[^'"]*)?\1/g)){
  if(!existsSync(new URL(match[2],path)))throw Error('Unpublished module: '+file+' → '+match[2]);
 }
}
for(const required of ['app.js','styles.css','project-options.js','room-projects.js','index.html','project-calculator-options.js']){
 if(!release.files[required])throw Error('Missing release file: '+required);
}
console.log(`Published artifact verified: ${Object.keys(release.files).length} file hashes, ${references} references, all JavaScript syntax and HTML asset versions.`);
