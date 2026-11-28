import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const installation=readFileSync(new URL('../installation.html',import.meta.url),'utf8');
const steps=readFileSync(new URL('../calculator-steps.js',import.meta.url),'utf8');
const options=readFileSync(new URL('../project-calculator-options.js',import.meta.url),'utf8');

test('bathroom installation shows supplied fixture estimate before customer-supplied alternative',()=>{
 const source=installation.slice(installation.indexOf('const priceText=p.quoteRequired?'),installation.indexOf('return {id:p.id,label:p.label'));
 assert.ok(source.includes("p.fixture>0?'Estimated with standard fixture:"));
 assert.ok(source.includes('If you supply fixture:'));
 assert.ok(source.indexOf('Estimated with standard fixture:')<source.indexOf('If you supply fixture:'));
});

test('customer-provided materials remains an opt-in, not the default',()=>{
 assert.match(steps,/id="customer-provides-materials"> I’ll supply my own materials/);
 assert.doesNotMatch(steps,/id="customer-provides-materials" checked/);
});

test('installation catalog does not misrepresent unpriced categories as complete fixed prices',()=>{
 assert.match(installation,/otherwise we confirm the complete price before the job/);
 assert.match(installation,/Other listed rates are labor only unless noted|Nik’s Remodeling supplies standard materials when they can be priced/);
});


test('installation triggers default supplied-materials selection with explicit own-materials opt-out',()=>{
 assert.match(options,/materials\.checked = params\.has\('material'\) \|\| params\.has\('product'\) \|\| !!installationInput\?\.checked/);
 assert.match(options,/if \(own\?\.checked\) materials\.checked = false/);
 assert.match(options,/else if \(installationInput\?\.checked\) materials\.checked = true/);
 assert.match(options,/installationInput\?\.addEventListener\('change',syncSupplyPreference\)/);
 assert.match(steps,/dispatchEvent\(new Event\('change',\{bubbles:true\}\)\)/);
});
