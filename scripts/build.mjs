import { mkdirSync, readFileSync, writeFileSync, copyFileSync, cpSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const files = ['real-products.js', 'retail-catalog.js', 'store-cards.js', 'store-catalog.js', 'store.js', 'store.css', 'bathroom-shop.js', 'index.html', 'product-search.html', 'product-search.js', 'shopping.html', 'room-projects.js', 'shopping-flow.js', 'calculator-steps.js', 'project.html', 'materials.html', 'supplies.html', 'tools.html', 'products.html',
  'furniture.html', 'bathroom.html', 'appliances.html', 'cabinets.html', 'installation.html', 'terms.html', 'labor-price-review.html', 'labor-price-chart.html', 'room-labor.html',
  'calculators.html', 'project-cart.html', 'material-flooring.html', 'material-tile-stone.html', 'material-drywall.html', 'material-lumber.html', 'material-trim-molding.html', 'material-paint-finishes.html', 'material-insulation.html', 'material-roofing.html', 'material-siding-exterior.html', 'material-doors-windows.html', 'material-concrete-masonry.html', 'styles.css', 'app.js', 'project-calculator-options.js', 'calculator-simple-flow.js', 'project-options.js',
  '_headers', '.nojekyll'];
// Block releases that would reintroduce missing photographs, dead local links,
// unrelated accessibility choices, or broken browser scripts. A failed build
// keeps the previous working Cloudflare Pages deployment serving customers.
const integrityPages = ['app.js','real-products.js','retail-catalog.js','room-projects.js','project-options.js','project-calculator-options.js','calculator-steps.js','shopping-flow.js','bathroom-shop.js','store.js','product-search.js','index.html','shopping.html','installation.html'];
const browserScripts = integrityPages.filter(file=>file.endsWith('.js'));
const availablePages = new Set(files.filter(file=>file.endsWith('.html')));
let testedPhotos=0,testedLinks=0;
for (const file of integrityPages) {
  const content=readFileSync(new URL('../'+file,import.meta.url),'utf8');
  for (const match of content.matchAll(/\/assets\/[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp|gif)/g)) {
    const asset=match[0];
    if (!existsSync(new URL('..'+asset,import.meta.url))) throw Error('Missing photograph: '+file+' → '+asset);
    testedPhotos++;
  }
  for (const match of content.matchAll(/href=["'`]\/([a-z0-9-]+\.html)(?=[?'"\`])/g)) {
    if (!availablePages.has(match[1])) throw Error('Broken local link: '+file+' → /'+match[1]);
    testedLinks++;
  }
}
for (const file of browserScripts) execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'pipe'});
const shoppingSource=readFileSync(new URL('../shopping.html',import.meta.url),'utf8');
if (shoppingSource.includes('http-equiv="refresh"') ||
    (shoppingSource.match(/class="photo-category-tile"/g)||[]).length < 8)
  throw Error('Shopping picture cards or landing page are missing.');
const projectSource=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
const access=projectSource.match(/accessibility:\{interior:\[([^\]]+)\],exterior:\[([^\]]+)\]\}/);
if (!access || /'(?:doors|floor|lighting|concrete|stairs|framing)'/.test(access[1]+access[2]))
  throw Error('Accessibility has unrelated generic trade options.');
const key='Object.assign(scopes,{\n  "pet-room"';
const at=projectSource.indexOf(key);
const end=projectSource.indexOf('});',at);
if (at<0||end<0) throw Error('Specialty scope map missing.');
const specialty=JSON.parse(projectSource.slice(at+'Object.assign(scopes,'.length,end+1));
if (Object.keys(specialty).length<15) throw Error('Specialty projects have lost their scoped work options.');
for (const [name,work] of Object.entries(specialty)) {
  if (!Array.isArray(work)||!work.length||
      work.some(x=>['doors','floor','lighting','concrete','plumbing','stairs','framing','faucet-service'].includes(x)))
    throw Error('Unrelated generic work in '+name);
}
if (projectSource.includes("keys.includes('plumbing')&&!keys.includes('faucet-service')"))
  throw Error('Global vanity-faucet injection has returned.');
console.log('Site integrity passed: '+testedPhotos+' photo references, '+testedLinks+' local links, '+browserScripts.length+' JavaScript files, and 15 scoped specialty projects.');
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
    const html = readFileSync(target, 'utf8').replace(/\/(store\.js|store\.css|bathroom-shop\.js|app\.js|styles\.css|project-calculator-options\.js|calculator-simple-flow\.js|project-options\.js|calculator-steps\.js|shopping-flow\.js|room-projects\.js)\?v=[^"']+/g, (_, asset) => '/' + asset + '?v=' + commit.slice(0, 12));
    writeFileSync(target, html);
  }
  hashes[file] = createHash('sha256').update(readFileSync(target)).digest('hex');
}
writeFileSync(new URL('release.json', output), JSON.stringify({
  commit, restoredSiteSource: '9ad1084', files: hashes
}, null, 2) + '\n');
console.log('Built complete restored site (' + commit + ').');
