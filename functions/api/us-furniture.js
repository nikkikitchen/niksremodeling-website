import {cj,retailCents} from '../_lib/commerce.js';

const keywords={
 'bedroom':'dresser',
 'living-room':'sofa',
 'dining-room':'dining table',
 'home-office':'office desk',
 'kids-room':'kids storage',
 'storage':'storage cabinet',
 'outdoor':'patio furniture',
 'bathroom':'bathroom cabinet',
 'decor':'wall decor',
 'lighting':'table lamp',
 'entryway':'entryway bench'
};
export async function onRequestGet({request,env}){
 const params=new URL(request.url).searchParams;
 const category=params.get('category')||'bedroom',search=params.get('search');
 const keyword=search==='shelving'?'bookcase':category==='kids-room'&&search==='seating'?'sofa':keywords[category];
 if(!keyword)return Response.json({error:'Unknown furniture category.'},{status:400});
 const page=Math.max(1,Math.min(100,parseInt(params.get('page')||'1',10)||1));
 try{
  const qs=new URLSearchParams({keyWord:keyword,countryCode:'US',verifiedWarehouse:'1',
   startWarehouseInventory:'1',page:String(page),size:'20',orderBy:'4',sort:'desc'});
  const data=await cj(env,'/product/listV2?'+qs);
  const list=(data.content||[]).flatMap(group=>group.productList||[]);
  const seenIds=new Set(),seenNames=new Set(),seenImages=new Set();
  const normalizeName=name=>String(name).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const blocked=new Set(["2003348098417340418","2003347794848272385"]);
  // The supplier tags kids' beanbag chairs as sofas, not kids' storage.
  // Fetch those candidates separately and verify each product's U.S. stock before display.
  const filteredList=category==='kids-room'&&search==='seating'
   ? list.filter(p=>/\b(kids?|children|child|toddler|playroom|nursery)\b/i.test(String(p.nameEn||'')))
   : list;
  const products=filteredList.filter(p=>p?.id&&!blocked.has(String(p.id))&&p.nameEn&&p.bigImage&&
     Number(p.totalVerifiedInventory)>0&&Number(p.warehouseInventoryNum)>0
    ).filter(p=>{
      const id=String(p.id),name=normalizeName(p.nameEn),image=String(p.bigImage);
      if(!name||seenIds.has(id)||seenNames.has(name)||seenImages.has(image))return false;
      seenIds.add(id);seenNames.add(name);seenImages.add(image);return true;
    })
   .map(p=>{
    const price=Number.parseFloat(String(p.sellPrice||''));
    return {...{
     id:String(p.id),name:String(p.nameEn).trim().slice(0,130),category,
     image:String(p.bigImage),priceCents:Number.isFinite(price)&&price>0?retailCents(price):null,
     warehouseCountry:'UNVERIFIED',originVerified:false,
     }, stockVerified:false};
   }).filter(p=>p.priceCents!==null&&/^https:\/\//.test(p.image));
  return Response.json({category,search:search==='shelving'?'shelving':search==='seating'&&category==='kids-room'?'seating':null,products,page,totalPages:data.totalPages||null,
   note:'Supplier candidates only. U.S. warehouse inventory and retail price must be independently verified before display.'},
   {headers:{'Cache-Control':'public,max-age=300'}});
 }catch{
  return Response.json({error:'U.S. warehouse catalog temporarily unavailable.'},
   {status:503,headers:{'Cache-Control':'no-store'}});
 }
}
