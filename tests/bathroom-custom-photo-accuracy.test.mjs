import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
const begin=source.indexOf('const bathroomWorkPhotos=');
const end=source.indexOf('const usedWorkPhotos=',begin);
assert.ok(begin>=0&&end>begin);
const photos=source.slice(begin,end);

test('Bathroom custom tiles use relevant photos for doors and shower controls',()=>{
  assert.match(photos,/doors:\['https:\/\/images\.pexels\.com\/photos\/5178093\//);
  assert.match(photos,/'bath-shower-valve':\['https:\/\/images\.pexels\.com\/photos\/11208973\//);
  assert.doesNotMatch(photos,/'bath-shower-valve':\['\/assets\/approved-b9cdb9084877\.jpg'/);
});
test('Bathroom image selection does not fall back to unrelated room photos',()=>{
  assert.ok(source.includes("...(!isBathroom?(workPhotoChoices[key]||[]):[])"));
  assert.ok(source.includes("...(isBathroom?(bathroomWorkPhotos[key]||[]):[])"));
  assert.ok(source.includes("id==='kids-room'||isBathroom?null"));
});

test('missing bathroom images fall back to accurately labeled illustrations',()=>{
  assert.ok(source.includes('const bathroomPhotoFallback=key=>'));
  assert.ok(source.includes("headingImage.addEventListener('error'"));
  assert.ok(source.includes('bathroomPhotoFallback(key)'));
  assert.match(photos,/const svg='<svg xmlns=/);
});
