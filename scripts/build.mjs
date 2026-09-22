import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const files = ['index.html', 'materials.html', 'supplies.html', 'tools.html',
  'furniture.html', 'appliances.html', 'cabinets.html', 'installation.html',
  'calculators.html', 'project-cart.html', 'styles.css', 'favorite.css', 'app.js',
  'assets/nr-logo.png', 'assets/favorite-stone-arches-hero.jpg', '_headers', '.nojekyll'];
mkdirSync(new URL('assets/', output), { recursive: true });
const hashes = {};
for (const file of files) {
  const source = new URL(`../${file}`, import.meta.url);
  copyFileSync(source, new URL(file, output));
  hashes[file] = createHash('sha256').update(readFileSync(source)).digest('hex');
}
const commit = process.env.CF_PAGES_COMMIT_SHA ||
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
writeFileSync(new URL('release.json', output), JSON.stringify({
  commit, homepageSource: 'cf89fa0', brandingSource: '9ad1084', files: hashes
}, null, 2) + '\n');
console.log(`Built ${files.length} public files and release.json in dist/ (${commit}).`);
