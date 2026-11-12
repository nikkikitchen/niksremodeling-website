import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');

test('Review Cart tells customers which package amounts are deposits, deferred labor, and included fees',()=>{
 assert.ok(app.includes('Materials and supplies (included)'));
 assert.ok(app.includes('Labor after 7% package discount (included)'));
 assert.ok(app.includes('Project fees (included)'));
 assert.ok(app.includes('Total package estimate (not yet due)'));
 assert.ok(app.includes('Combined Project Total'));
 assert.doesNotMatch(app,/Overhead (?:and|&) Contingenc(?:y|ies)/i);
});
