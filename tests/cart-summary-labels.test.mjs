import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Review Cart tells customers which package amounts are deposits, deferred labor, and included fees',()=>{
 assert.ok(app.includes('Materials &amp; supplies (proposed deposit)'));
 assert.ok(app.includes('Labor (pay later, weekly draws)'));
 assert.ok(app.includes('Fees (included in package total)'));
 assert.ok(app.includes('Balance after proposed deposit (weekly draws)'));
 assert.ok(app.includes('Combined Project Total'));
 assert.doesNotMatch(app,/Overhead (?:and|&) Contingenc(?:y|ies)/i);
});
