import { mkdirSync, readFileSync, writeFileSync, copyFileSync, cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const files = ['index.html', 'project.html', 'materials.html', 'supplies.html', 'tools.html', 'products.html',
  'furniture.html', 'appliances.html', 'cabinets.html', 'installation.html',
  'calculators.html', 'project-cart.html', 'material-flooring.html', 'material-tile-stone.html', 'material-drywall.html', 'material-lumber.html', 'material-trim-molding.html', 'material-paint-finishes.html', 'material-insulation.html', 'material-roofing.html', 'material-siding-exterior.html', 'material-doors-windows.html', 'material-concrete-masonry.html', 'styles.css', 'app.js', 'project-calculator-options.js',
  '_headers', '.nojekyll'];
mkdirSync(output, { recursive: true });
cpSync(new URL('../assets/', import.meta.url), new URL('assets/', output), { recursive: true });
const commit = process.env.CF_PAGES_COMMIT_SHA ||
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const hashes = {};
for (const file of files) {
  const source = new URL('../' + file, import.meta.url);
  const target = new URL(file, output);
  copyFileSync(source, target);
  if (file.endsWith('.html')) {
    const html = readFileSync(target, 'utf8').replace(/\/(app\.js|styles\.css|project-calculator-options\.js)\?v=[^"']+/g, (_, asset) => '/' + asset + '?v=' + commit.slice(0, 12));
    writeFileSync(target, html);
  }
  hashes[file] = createHash('sha256').update(readFileSync(target)).digest('hex');
}
writeFileSync(new URL('release.json', output), JSON.stringify({
  commit, restoredSiteSource: '9ad1084', files: hashes
}, null, 2) + '\n');
console.log('Built complete restored site (' + commit + ').');
