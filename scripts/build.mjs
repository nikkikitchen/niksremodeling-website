import { mkdirSync, readFileSync, writeFileSync, copyFileSync, cpSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const files = ['material-price-reference.json', 'material-price-reference.html', 'material-prices.js', 'inventory-status.json', 'real-products.js', 'retail-catalog.js', 'bathroom-catalog.js', 'store-cards.js', 'store-catalog.js', 'store.js', 'store.css', 'bathroom-shop.js', 'index.html', 'product-search.html', 'product-search.js', 'shopping.html', 'other.html', 'shop-installed.html', 'shop-installed.js', 'room-projects.js', 'shopping-flow.js', 'calculator-steps.js', 'project.html', 'materials.html', 'supplies.html', 'tools.html', 'products.html',
  'furniture.html', 'bathroom.html', 'appliances.html', 'cabinets.html', 'installation.html', 'terms.html', 'labor-price-review.html', 'labor-price-chart.html', 'room-labor.html',
  'calculators.html', 'project-cart.html', 'material-flooring.html', 'material-tile-stone.html', 'material-drywall.html', 'material-lumber.html', 'material-trim-molding.html', 'material-paint-finishes.html', 'material-insulation.html', 'material-roofing.html', 'material-siding-exterior.html', 'material-doors-windows.html', 'material-concrete-masonry.html', 'styles.css', 'app.js', 'project-calculator-options.js', 'calculator-simple-flow.js', 'project-options.js',
  '_headers', '.nojekyll'];
// Only the business phone may be published. Reject the retired personal contact
// in visible text, tel/sms links, or script-generated contact buttons.
for(const file of files.filter(name=>/\\.(?:html|js|json)$/.test(name))){
 const contents=readFileSync(new URL('../'+file,import.meta.url),'utf8');
 if(/470[\\s().-]*991[\\s().-]*2133/.test(contents))
  throw Error('Retired personal phone number still appears in '+file);
}
// Block releases that would reintroduce missing photographs, dead local links,
// unrelated accessibility choices, or broken browser scripts. A failed build
// keeps the previous working Cloudflare Pages deployment serving customers.
const integrityPages = ['material-prices.js','app.js','real-products.js','store-cards.js','retail-catalog.js','room-projects.js','project-options.js','project-calculator-options.js','calculator-steps.js','shopping-flow.js','shop-installed.js','shop-installed.html','bathroom-shop.js','store.js','product-search.js','index.html','shopping.html','installation.html'];
// Keep JavaScript module dependencies in the published build; otherwise a missing
// module can silently stop stock-marker initialization on every shopping page.
for(const required of ['bathroom-catalog.js','retail-catalog.js','store-catalog.js']){
 if(!files.includes(required))throw Error('Missing published Shopping catalog module: '+required);
}
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
    (shoppingSource.match(/class="photo-category-tile"/g)||[]).length !== 8 ||
    shoppingSource.includes('/project.html?project=custom'))
  throw Error('Shopping must have eight product-only picture cards, with no custom project category.');
// Ensure accent-wall packages remain reachable from room projects on every screen.
const roomSource=readFileSync(new URL('../room-projects.js',import.meta.url),'utf8');
if(!roomSource.includes('Explore Accent Wall Projects') ||
   !roomSource.includes('/project.html?project=accents') ||
   !['One painted accent wall.','Two-tone painted wall with chair rail.','Stone, tile or wood statement wall.'].every(label=>roomSource.includes(label)) ||
   !roomSource.includes('Consultation if requested or required'))
  throw Error('Accent Wall project packages or room navigation are missing.');
// Fail the build if provisional, itemized package pricing loses its scope,
// labor discount, fee policy, or required supply breakdown.
const packageSpecs=(marker,after)=>{
  const i=roomSource.indexOf(marker),j=roomSource.indexOf(after,i+marker.length);
  if(i<0||j<0)throw Error('Cannot locate canonical package specs: '+marker);
  return JSON.parse(roomSource.slice(i+marker.length,j));
};
const itemizedPackageGroups=[
  packageSpecs('window.NIK_PROVISIONAL_PACKAGE_PRICES=',';\\nfor(const [id,tiers]'.replace('\\n','\n')),
  packageSpecs('window.NIK_RECALCULATED_PACKAGE_SPECS=',';\\nwindow.NIK_CALCULATE_PACKAGE_BASELINE'.replace('\\n','\n'))
];
let checkedPackageScopes=0;
for(const groups of itemizedPackageGroups){
  for(const [category,tiers] of Object.entries(groups))for(const [tier,spec] of Object.entries(tiers)){
    if(!Array.isArray(spec.work)||!spec.work.length||
       !['labor','materials','consumables'].every(key=>Array.isArray(spec[key])&&spec[key].length)||
       spec.laborDiscountPercent!==7||spec.projectFeePercent!==10)
      throw Error('Incomplete or inconsistent package price: '+category+'/'+tier);
    for(const line of [...spec.labor,...spec.materials,...spec.consumables]){
      if(!Number.isSafeInteger(line.quantity)||line.quantity<=0||!Number.isFinite(line.unitPrice)||line.unitPrice<=0)
        throw Error('Invalid priced line '+category+'/'+tier+': '+line.name);
    }
    checkedPackageScopes++;
  }
}
const realProductCards=readFileSync(new URL('../real-products.js',import.meta.url),'utf8');
const storeCardsSource=readFileSync(new URL('../store-cards.js',import.meta.url),'utf8');
if(!realProductCards.includes("current?'':'hidden'")||
   !realProductCards.includes('target.innerHTML=offers.length?')||
   !storeCardsSource.includes('card.hidden=true;card.dataset.verified'))
  throw Error('Unverified supplier cards must remain nonclickable.');
console.log('Itemized package scope audit passed: '+checkedPackageScopes+' priced packages.');
// Keep the homepage pictures, desktop Projects menu, and phone Projects menu
// in the same order. An absent category must fail before Cloudflare publishes.
const mainMatch=roomSource.match(/const PROJECT_MAIN_ENTRIES=\[([\s\S]*?)\];/);
if(!mainMatch)throw Error('Main Projects menu source not found.');
const mainIds=[...mainMatch[1].matchAll(/\['([a-z0-9-]+)','[^']+'\]/g)].map(m=>m[1]);
const homeSource=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const tileSection=homeSource.split('<div class="tile-grid project-grid">')[1]?.split('</div>')[0]||'';
const tileIds=[...tileSection.matchAll(/href="\/project\.html\?project=([a-z0-9-]+)"/g)].map(m=>m[1]);
if(JSON.stringify(tileIds)!==JSON.stringify(mainIds))
  throw Error('Homepage Projects picture tiles do not match the Projects dropdown.');
for(const id of ['projects-menu','mobile-projects-menu']){
 const menu=homeSource.match(new RegExp('id="'+id+'" class="nav-dropdown">([\\s\\S]*?)<\\/div>'))?.[1]||'';
 const menuIds=[...menu.matchAll(/href="\/project\.html\?project=([a-z0-9-]+)"/g)].map(m=>m[1]);
 if(JSON.stringify(menuIds)!==JSON.stringify(mainIds))
   throw Error(id+' fallback navigation differs from the shared Projects list.');
}
const projectSource=readFileSync(new URL('../project-options.js',import.meta.url),'utf8');
// Guard the one-layout-for-all-projects customer experience.
if(!roomSource.includes("['accents','Accent Walls']") ||
   !roomSource.includes('pkg-mobile-details') ||
   !roomSource.includes('NIK_ROOM_PACKAGE_OVERRIDES') ||
   !projectSource.includes('window.NIK_ROOM_PACKAGE_OVERRIDES') ||
   projectSource.includes('Choose a package below.'))
  throw Error('Projects menu or unified package layout regressed.');
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
// Validate approved internal supply reference data without publishing it.
const supplyReference=JSON.parse(readFileSync(new URL('../data/approved-supply-prices.json',import.meta.url),'utf8'));
if(supplyReference.pricesIncludeMarkup!==true||supplyReference.items.length!==51||supplyReference.items.some(item=>!Number.isFinite(item.price)||item.price<=0))throw Error('Approved supply price reference invalid');
cpSync(new URL('../assets/', import.meta.url), new URL('assets/', output), { recursive: true });
const commit = process.env.CF_PAGES_COMMIT_SHA ||
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const hashes = {};
for (const file of files) {
  const source = new URL('../' + file, import.meta.url);
  const target = new URL(file, output);
  copyFileSync(source, target);
  if (file.endsWith('.html')) {
    const html = readFileSync(target, 'utf8').replace(/\/(store\.js|store\.css|bathroom-shop\.js|app\.js|styles\.css|project-calculator-options\.js|calculator-simple-flow\.js|project-options\.js|calculator-steps\.js|shopping-flow\.js|shop-installed\.js|real-products\.js|room-projects\.js)\?v=[^"']+/g, (_, asset) => '/' + asset + '?v=' + commit.slice(0, 12));
    writeFileSync(target, html);
  }
  hashes[file] = createHash('sha256').update(readFileSync(target)).digest('hex');
}

// Synchronize priced package line items with the same already-marked-up material
// and supply reference catalogs used by the planning pages. Never add 35% twice.
// Only exact named, unit-priced materials/consumables are synchronized; labor,
// unverified fixture allowances, and custom quoted items stay untouched.
const approvedMaterialPrices=JSON.parse(readFileSync(new URL('../material-price-reference.json',import.meta.url),'utf8')).items;
const approvedSupplyPrices=supplyReference.items;
const namedReferencePrices=new Map([...approvedMaterialPrices,...approvedSupplyPrices].map(item=>[item.name.toLowerCase(),item.price]));
let packageLinesUpdated=0;
for(const file of ['room-projects.js','project-options.js']){
  const target=new URL(file,output);
  const original=readFileSync(target,'utf8');
  const priceLine=/((?:"name"|name)\s*:\s*(['"])(.*?)\2\s*,\s*(?:"quantity"|quantity)\s*:\s*\d+(?:\.\d+)?\s*,\s*(?:"unitPrice"|unitPrice)\s*:\s*)(\d+(?:\.\d+)?)/g;
  const synchronized=original.replace(priceLine,(whole,prefix,quote,name,previous)=>{
    const approved=namedReferencePrices.get(name.toLowerCase());
    if(approved===undefined)return whole;
    if(Number(previous)!==approved)packageLinesUpdated++;
    return prefix+String(approved);
  });
  writeFileSync(target,synchronized);
  hashes[file]=createHash('sha256').update(synchronized).digest('hex');
}
console.log('Package price references synchronized; changed '+packageLinesUpdated+' unit prices.');

// Expose the source-of-truth paint gallon rate to the measured-project quoting
// logic without relying on a hard-coded $50/gallon estimate.
const paintReference=approvedMaterialPrices.find(x=>x.name==='1-Gallon Interior Flat Latex Paint');
if(!paintReference||!(paintReference.price>0))throw Error('Approved interior flat paint price is missing.');
{
 const target=new URL('room-projects.js',output);
 let content=readFileSync(target,'utf8');
 const originalRate='const paintMaterial=paintGallons*48.60;';
 if(!content.includes(originalRate))throw Error('Measured paint pricing marker missing.');
 content=content.replace(originalRate,'const paintMaterial=paintGallons*'+String(paintReference.price)+';');
 content=content.replace(/extraPaintGallons\*48\.60/g,'extraPaintGallons*'+String(paintReference.price));
 content=content.replace(/extraPrimerGallons\*47\.22/g,'extraPrimerGallons*'+String(approvedMaterialPrices.find(x=>x.name==='Interior Bonding Primer (1 Gallon)')?.price??47.22));
 content=content.replace("gallons × $50 = ","gallons × $"+String(paintReference.price.toFixed(2))+" = ");
 writeFileSync(target,content);
 hashes['room-projects.js']=createHash('sha256').update(content).digest('hex');
}

// Rebuild the browser price data from the approved JSON source on each
// production build. Uploading an updated reference never requires retyping
// the 52 prices in another file.
const reference=JSON.parse(readFileSync(new URL('../material-price-reference.json',import.meta.url),'utf8'));
if(!Array.isArray(reference.items)||!reference.items.length||reference.markupAlreadyIncluded!==true)
  throw Error('Approved material reference data missing or malformed.');
const refScript=new URL('material-prices.js',output);
const browserSource=readFileSync(refScript,'utf8');
const a='const reference=',b=';\n  const byId=';
const start=browserSource.indexOf(a),referenceEnd=browserSource.indexOf(b,start);
if(start<0||referenceEnd<0)throw Error('Material reference loader markers missing.');
writeFileSync(refScript,browserSource.slice(0,start+a.length)+JSON.stringify(reference)+browserSource.slice(referenceEnd));
hashes['material-prices.js']=createHash('sha256').update(readFileSync(refScript)).digest('hex');

writeFileSync(new URL('release.json', output), JSON.stringify({
  commit, restoredSiteSource: '9ad1084', files: hashes
}, null, 2) + '\n');
console.log('Built complete restored site (' + commit + ').');
