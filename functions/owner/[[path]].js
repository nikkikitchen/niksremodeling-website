import {ownerRoute,privateHeaders} from '../_lib/owner-auth.js';
import {html,js,css} from '../_lib/owner-ui.js';
export const onRequest=ownerRoute(async({request})=>{
 if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:privateHeaders});
 const path=new URL(request.url).pathname;
 const resource=path==='/owner'||path==='/owner/'?[html,'text/html; charset=utf-8']:path==='/owner/app.js'?[js,'text/javascript; charset=utf-8']:path==='/owner/style.css'?[css,'text/css; charset=utf-8']:null;
 if(!resource)return new Response('Not found',{status:404,headers:privateHeaders});
 return new Response(resource[0],{headers:{...privateHeaders,'Content-Type':resource[1],
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' https:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",'X-Frame-Options':'DENY'}});
});
