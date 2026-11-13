import {defineConfig, devices} from '@playwright/test';
export default defineConfig({
 testDir:'./browser-tests',timeout:30000,fullyParallel:false,workers:1,
 use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
 webServer:{command:'python3 -m http.server 4173 --directory dist',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
 projects:[
  {name:'desktop',use:{viewport:{width:1440,height:1000}}},
  {name:'tablet',use:{...devices['iPad (gen 7)'],browserName:'chromium',viewport:{width:768,height:1024}}},
  {name:'phone',use:{...devices['iPhone 13'],browserName:'chromium'}}
 ]
});
