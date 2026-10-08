window.FLOORING_LABOR_RATES={Laminate:[300,500,700],LVP:[350,575,800],'Glue-down':[400,650,900],Hardwood:[500,900,1300],Tile:[650,1000,1500]};
window.LABOR_CATALOG = (()=>{
 const task=(id,label,price=null,note='',status='pending',unit='each')=>({id,label,price,note,status,unit});
 const group=(id,label,actions)=>({id,label,actions});
 const standard=(id,label,repairs=[])=>group(id,label,{Install:[task(id+'-install','Install '+label.toLowerCase(),'','Ready opening and compatible connections.')],Replace:[task(id+'-replace','Remove existing and install new '+label.toLowerCase())],Repair:repairs.map((label,i)=>task(id+'-repair-'+i,label)),Remove:[task(id+'-remove','Remove '+label.toLowerCase()+' only')]});
 const bathroom=[
 group('toilet','Toilets',{Install:[task('toilet-install','Install standard toilet',null,'Ready flange and water connection.','draft'),task('smart-toilet-install','Install smart toilet',null,'Ready water and electrical connections; new wiring separate.','draft')],Replace:[task('toilet-replace','Replace standard toilet',480,'Remove old toilet and install new; sound flange and existing connections.','draft'),task('smart-toilet-replace','Replace with smart toilet',600,'Confirm model, connections and removal scope.','draft')],Repair:['Diagnose leak / running toilet','Replace fill valve','Replace flush valve','Replace flapper','Replace handle / chain','Replace tank-to-bowl gasket / bolts','Replace wax ring / seal and reset toilet','Repair toilet flange','Replace toilet flange','Replace supply line','Replace shutoff valve','Replace complete tank guts','Secure loose toilet','Replace toilet seat / bidet seat','Clear toilet clog'].map((name,i)=>task('toilet-repair-'+i,name)),Remove:[task('toilet-remove','Remove toilet only',null,'Disposal / hauling separate.')]}),
 standard('faucet','Faucets',['Diagnose faucet leak','Replace cartridge / stem','Replace washers / seals','Replace aerator','Repair handle','Replace supply line','Replace shutoff valve']),
 standard('sink','Sinks',['Repair drain leak','Replace drain / pop-up stopper','Replace P-trap','Reseal sink','Secure loose sink']),
 standard('vanity','Vanities',['Repair door / drawer','Replace hardware','Secure / level cabinet','Reseal vanity top','Repair cabinet damage']),
 standard('tub','Bathtubs',['Replace tub drain / overflow','Repair faucet / diverter','Replace valve cartridge','Remove and replace caulk','Repair surface chip']),
 standard('shower','Showers',['Repair valve / cartridge','Replace showerhead / hose','Replace shower arm','Repair drain leak','Recaulk shower','Repair shower pan / waterproofing']),
 standard('glass','Shower doors',['Adjust door alignment','Replace hinges','Replace rollers','Replace seals / sweep','Reseal frame']),
 standard('fan','Vent fans',['Diagnose failed / noisy fan','Replace motor','Replace grille','Repair duct connection']),
 standard('accessory','Mirrors & accessories',['Secure mirror','Repair towel bar mounting','Repair grab bar mounting','Repair shelf mounting']),
 group('bath-tile','Tile & grout',{Install:[task('bath-tile-install','Install floor / wall tile',null,'Measured scope; shower waterproofing separate.','pending','sq. ft.')],Replace:[task('bath-tile-replace','Replace damaged tile',null,'Match existing tile and assess substrate.')],Repair:[task('bath-grout-clean','Clean grout',null,'Measure area.','pending','sq. ft.'),task('bath-grout-repair','Repair grout'),task('bath-grout-replace','Remove and replace grout'),task('bath-grout-seal','Seal grout'),task('bath-caulk','Remove and replace caulk')],Remove:[task('bath-tile-remove','Remove tile',null,'Measured area; hauling separate.','pending','sq. ft.')]}),
 group('bath-surfaces','Walls & ceilings',{Install:[task('bath-drywall','Hang and finish drywall',null,'','pending','sq. ft.'),task('bath-wall-texture','Texture walls',null,'','pending','sq. ft.'),task('bath-ceiling-texture','Texture ceiling',null,'','pending','sq. ft.'),task('bath-wall-paint','Paint walls',null,'','pending','sq. ft.'),task('bath-ceiling-paint','Paint ceiling',null,'','pending','sq. ft.')],Replace:[task('bath-drywall-replace','Replace damaged drywall')],Repair:[task('bath-patch','Patch holes / cracks'),task('bath-texture-match','Match existing texture'),task('bath-stain','Treat stains and repaint')],Remove:[task('bath-texture-remove','Remove ceiling texture'),task('bath-wallpaper-remove','Remove wallpaper')]})
 ];
 // Draft bath prices reflect the reviewed 60% proposal, not newly approved rates.
 for(const [id,price] of [['faucet',410],['vanity',1020],['tub',4800],['fan',570]]){const g=bathroom.find(x=>x.id===id);g.actions.Replace[0].price=price;g.actions.Replace[0].status='draft';}
 bathroom.find(x=>x.id==='glass').actions.Replace=[task('glass-framed','Replace framed shower door',660,'','draft'),task('glass-frameless','Replace frameless shower door',1140,'','draft')];
 const appliances=[['cooktop','Cooktop',445,'Install','Existing connections.'],['dishwasher','Dishwasher',600,'Replace','Existing connections.'],['disposal','Garbage disposal',300,'Replace','Existing connections.'],['microwave','Microwave',480,'Replace','Existing opening and connections.'],['range','Range / stove',360,'Install','Existing connections.'],['hood','Range hood',300,'Replace','Existing duct and electrical connection.'],['fridge','Refrigerator',240,'Install','Standard placement.'],['oven','Wall oven',360,'Replace','Existing opening and connections.'],['laundry','Washer + dryer',360,'Install','Existing hookups; price per set.']].map(([id,name,price,mode,note])=>{const g=standard('appliance-'+id,name,['Diagnose installation / connection issue']);g.actions[mode][0]=task('appliance-'+id+'-'+mode.toLowerCase(),mode+' '+name.toLowerCase(),price,note,'approved',id==='laundry'?'sets':'each');return g});
 return [
 {id:'bathroom',label:'Bathroom',intro:'Choose a fixture, then the work you need.',groups:bathroom},
 {id:'appliances',label:'Appliances',intro:'Appliance installation and connection work. Appliances and materials are extra.',groups:appliances},
 {id:'cabinets',label:'Cabinets & vanities',intro:'Cabinets, refinishing and hardware.',groups:[standard('cabinet','Cabinets',['Repair door / drawer','Repair hardware','Fill / repair hardware or hinge screw holes','Repair cabinet frame']),group('refinishing','Cabinet refinishing',{Refinish:['Paint doors, drawers and frames','Stain doors, drawers and frames','Finish cabinet interiors','Prep / strip existing finish'].map((s,i)=>task('refinish-'+i,s))}),standard('hardware','Hardware',['Adjust hinges','Repair screw holes'])]},
 {id:'carpentry',label:'Carpentry & trim',intro:'Trim, framing and custom woodwork.',groups:[standard('trim','Trim & molding',['Repair damaged trim','Fill joints / nail holes']),standard('framing','Framing',['Repair framing']),standard('stairs','Stairs & railings',['Repair treads / risers','Secure handrail']),standard('custom','Custom carpentry',['Repair built-ins / shelving'])]},
 {id:'doors',label:'Doors & windows',intro:'Doors, windows and their hardware.',groups:[standard('door','Doors',['Adjust door','Repair latch / lock','Replace hinges','Replace weatherstripping']),standard('window','Windows',['Repair trim / seals','Repair screen'])]},
 {id:'drywall',label:'Drywall & texture',intro:'Walls, ceilings, patching and texture.',groups:[standard('drywall','Drywall',['Patch holes','Repair cracks','Repair water-damaged drywall']),group('texture','Texture',{Apply:[task('texture-wall','Texture walls'),task('texture-ceiling','Texture ceilings')],Repair:[task('texture-match','Match / patch texture')],Remove:[task('texture-remove','Remove texture')]})]},
 {id:'flooring',label:'Flooring & tile',intro:'Use the existing room-size calculator for your flooring installation price.',groups:[group('flooring-calc','Flooring installation',{Calculate:[task('flooring-existing','Laminate, LVP, hardwood & tile',null,'Existing flooring prices are preserved. Enter dimensions in Project Calculator.','calculator')]}),standard('floor-repair','Flooring repairs',['Replace damaged plank / tile','Repair transition strip','Repair subfloor','Level subfloor']),standard('grout','Grout & caulk',['Clean grout','Repair / replace grout','Seal grout','Replace caulk'])]},
 {id:'paint',label:'Painting & wallpaper',intro:'Surface preparation and finishing.',groups:[group('painting','Painting',{Paint:[task('paint-wall','Paint walls'),task('paint-ceiling','Paint ceilings'),task('paint-trim','Paint trim / doors')],Prep:[task('paint-patch','Patch / sand surfaces'),task('paint-prime','Prime / stain-block surfaces')]}),standard('wallpaper','Wallpaper',['Repair seam / loose wallpaper'])]},
 {id:'exterior',label:'Exterior & outdoor',intro:'Exterior repairs, finishing and outdoor projects.',groups:[standard('siding','Siding',['Repair damaged siding']),standard('deck','Decks & steps',['Replace damaged deck boards','Repair railing','Repair steps']),standard('concrete','Concrete',['Repair cracks']),standard('insulation','Insulation',['Replace damaged insulation'])]},
 {id:'other',label:'Other labor & delivery',intro:'Hourly help, assembly and project support.',groups:[group('misc','Miscellaneous labor',{Labor:[task('misc-hour','Miscellaneous labor',75,'$150 minimum per visit, shared with other services.','approved','hours')]}),standard('assembly','Furniture assembly',['Repair / tighten furniture']),group('delivery','Delivery & debris',{Delivery:[task('store-pickup','Store pickup & delivery'),task('furniture-delivery','Furniture / appliance delivery')],Remove:[task('haul-debris','Haul away project debris')]})]}
 ];
})();
// Display the established calculator rates with the matching installation scopes.
const flooring=window.LABOR_CATALOG.find(c=>c.id==='flooring');
flooring.groups[0].actions={Install:Object.entries(window.FLOORING_LABOR_RATES).map(([name,rates])=>({
 id:'flooring-'+name.toLowerCase(),label:'Install '+name,unit:'room',status:'calculator',
 priceText:'Up to 40 sq. ft.: $'+rates[0].toLocaleString()+'\n41–144 sq. ft.: $'+rates[1].toLocaleString()+'\n145–250 sq. ft.: $'+rates[2].toLocaleString(),
 note:'Per room. Includes perimeter trim'+(name==='Tile'?' and grout':'')+'. Removal and preparation separate.'+(name==='LVP'?' Larger projects use the existing $4,250 / 1,200 sq. ft. reference.':''),
 calculatorUrl:'/calculators.html?material=flooring&labor=1&floorKind='+({Laminate:'floating',LVP:'floating','Glue-down':'glue',Hardwood:'nail',Tile:'tile'}[name])+'&laborMaterial='+encodeURIComponent(name)
}))};
// The bathroom proposal follows the original fixture scopes; removal is not assumed included.
const bath=window.LABOR_CATALOG.find(c=>c.id==='bathroom');
const toilets=bath.groups.find(g=>g.id==='toilet');
toilets.actions.Install[0].price=480;
toilets.actions.Install[1].price=600;
for(const t of toilets.actions.Replace){t.price=null;t.status='pending';}
for(const [id,label,note] of [
 ['faucet','Install bathroom sink faucet','Existing compatible connections; fixture extra.'],
 ['vanity','Install premade vanity','Plumbing changes, separate faucet, removal and wall/floor repairs are extra.'],
 ['fan','Install vent fan with new outside vent','Fixture and materials extra; new electrical work and surface repairs separate.']
]){
 const g=bath.groups.find(g=>g.id===id),proposal=g.actions.Replace[0];
 Object.assign(g.actions.Install[0],{label,note,price:proposal.price,status:'draft'});
 proposal.price=null;proposal.status='pending';
}
const glass=bath.groups.find(g=>g.id==='glass');
glass.actions.Install=glass.actions.Replace.map(t=>({...t,id:t.id+'-install',label:t.label.replace('Replace','Install'),note:'Glass-door installation only; removal, tile and waterproofing separate.'}));
glass.actions.Replace=[{id:'glass-replace',label:'Replace shower door',price:null,note:'Removal and replacement scope to confirm.',status:'pending',unit:'each'}];
