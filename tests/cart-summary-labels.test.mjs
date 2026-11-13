import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Review Cart tells customers which package amounts are deposits, deferred labor, and included fees',()=>{
 assert.ok(app.includes('Materials &amp; supplies'));
 assert.ok(app.includes('Labor after 7% package discount (included)'));
 assert.ok(app.includes('Project fees'));
 assert.ok(app.includes('Project package estimate'));
 assert.ok(app.includes('Project total'));
 assert.doesNotMatch(app,/Overhead (?:and|&) Contingenc(?:y|ies)/i);
});
