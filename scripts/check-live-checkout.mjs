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
 // A read-only quote for a published product at the public Carrollton City Hall
 // address. Never create a Square payment link or an order in monitoring.
 let checkoutQuote=null;
 if(new URL(base).host==='niksremodeling.com'){
  const params=new URLSearchParams({
   product:'1963146233541074945',
   variant:'1963146233666904066',
   zip:'30117',address:'315 Bradley Street',city:'Carrollton',state:'GA'
  });
  const result=await read(base+'/api/store-quote?'+params);
  try{
   const body=JSON.parse(result.text||'{}');
   checkoutQuote={
    http:result.status,
    checkoutPaused:body.checkoutPaused===true,
    failingStage:result.ok?null:(typeof body.stage==='string'?body.stage:null),
    ready:result.ok&&
     Number.isSafeInteger(body.totalCents)&&body.totalCents>0&&
     Number.isSafeInteger(body.deliveryCents)&&body.deliveryCents>0&&
     Number.isSafeInteger(body.taxCents)&&body.taxCents>=0&&Number(body.stock)>0,
    stockConfirmed:Number(body.stock)>0,
    shippingConfirmed:Number.isSafeInteger(body.deliveryCents)&&body.deliveryCents>0,
    taxConfirmed:Number.isSafeInteger(body.taxCents)&&body.taxCents>=0,
    totalConfirmed:Number.isSafeInteger(body.totalCents)&&body.totalCents>0,
    reason:result.ok?null:String(body.error||result.error||'Quote unavailable').slice(0,200)
   };
  }catch(error){
   checkoutQuote={http:result.status,ready:false,reason:String(error?.message||error).slice(0,160)};
  }
 }

 console.log(JSON.stringify({
  taxPreview:liveTax,
  checkoutQuote,
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
