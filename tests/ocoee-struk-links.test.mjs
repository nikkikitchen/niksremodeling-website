import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const html=readFileSync('index.html','utf8');

test('verified contractor resource links appear in homepage footer',()=>{
  const dom=new JSDOM(html);
  try{
    const footer=dom.window.document.querySelector('footer');
    assert.ok(footer,'Homepage footer must exist');
    const links=[...footer.querySelectorAll('.resource-links a')];
    assert.equal(links.length,2);
    assert.equal(links[0].href,'https://apps.apple.com/us/app/struk-jobsite-documentation/id6802196405');
    assert.match(links[0].textContent,/STRUK.*iPhone.*iPad/);
    assert.equal(links[1].href,'https://ocoeestudios.com/');
    assert.match(links[1].textContent,/Ocoee Studios/);
    for(const link of links){
      assert.equal(link.target,'_blank');
      assert.match(link.rel,/noopener/);
      assert.match(link.rel,/noreferrer/);
    }
    assert.doesNotMatch(footer.textContent,/Google Play|Android app/i,'Do not claim an unverified Android listing');
  }finally{dom.window.close();}
});
