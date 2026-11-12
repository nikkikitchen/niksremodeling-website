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
 console.log(JSON.stringify({
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
