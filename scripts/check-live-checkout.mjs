// Read-only live release and checkout diagnostics for GitHub Actions.
// Does not create payment links or handle credentials, orders or customer data.
const urls=[
 'https://niksremodeling.com',
 'https://niks-remodeling.pages.dev'
];
const expected=(process.env.GITHUB_SHA||'').slice(0,12);
const timeout=12000;
async function read(url){
 try{
  const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(timeout),headers:{'Cache-Control':'no-cache'}});
  const text=await response.text();
  return {ok:response.ok,status:response.status,text,finalUrl:response.url};
 }catch(error){return {ok:false,status:0,error:String(error?.message||error)};}
}
for(const base of urls){
 const [release,page,script,readiness]=await Promise.all([
  read(base+'/release.json'),
  read(base+'/project-cart.html'),
  read(base+'/app.js'),
  read(base+'/api/checkout-readiness?zip=30117')
 ]);
 const releaseCommit=release.ok?(()=>{
  try{return String(JSON.parse(release.text).commit||'').slice(0,12)}catch{return null}
 })():null;
 const checkoutUi=script.ok&&script.text.includes('function cartSecureCheckoutPanel(items)')&&script.text.includes('Pay securely with Square');
 const pageLoadsApp=page.ok&&/src="\/app\.js\?v=[^"]+"/.test(page.text);
 let config=null;
 if(readiness.ok){
  try{
   const json=JSON.parse(readiness.text);
   config={checkoutReadyForVerification:json.checkoutReadyForVerification===true,checks:json.checks};
  }catch{}
 }

 async function taxPreview(){
  try{
   const response=await fetch(base+'/api/cart-tax',{
    method:'POST',headers:{'Content-Type':'application/json','Origin':base},
    body:JSON.stringify({zip:'30117',merchandiseCents:10000,shippingCents:0}),
    signal:AbortSignal.timeout(timeout)
   });
   const data=await response.json();
   return {http:response.status,providerRateVerified:response.ok&&data.mode==='zip-upper-estimate'&&typeof data.ratePercent==='number',reason:response.ok?null:String(data.error||'Tax preview unavailable').slice(0,140)};
  }catch(error){return {http:0,providerRateVerified:false,reason:String(error?.message||error).slice(0,140)};}
 }
 const liveTax=await taxPreview();
 console.log(JSON.stringify({
  taxPreview:liveTax,
  host:new URL(base).host,
  releaseHttp:release.status,
  publishedCommit:releaseCommit||'unavailable',
  matchesBuild:!!releaseCommit&&releaseCommit===expected,
  cartHttp:page.status,
  cartLoadsApp:pageLoadsApp,
  appHttp:script.status,
  checkoutButtonInLiveCode:checkoutUi,
  readinessHttp:readiness.status,
  readiness:config||'not available'
 }));
 if(!release.ok)console.log('Live release check unavailable for '+new URL(base).host+': '+(release.error||'HTTP '+release.status));
}
// This is a live diagnostic, not a build gate: deployments may lag GitHub.
