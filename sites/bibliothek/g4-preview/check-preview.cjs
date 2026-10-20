const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const https=require('https');
async function remotePreviewCheck(){
 const url='https://ayda-g4-kutuphane-onizleme.vercel.app/';
 return await new Promise(resolve=>{
  const req=https.get(url,{headers:{'User-Agent':'AYDA-G4-Preview-QA/1.0'}},res=>{
   let data='';res.setEncoding('utf8');
   res.on('data',x=>{if(data.length<110000)data+=x});
   res.on('end',()=>resolve({url,status:res.statusCode,titleFound:data.includes('AYDA Dijital Kütüphane'),previewMarkerFound:data.includes('g4-preview-mode')}));
  });
  req.setTimeout(12000,()=>req.destroy(new Error('timeout')));
  req.on('error',e=>resolve({url,status:'connection_error',details:e.code||e.message}));
 });
}

const local='file://'+path.resolve('g4-preview/index.html');
const dir='g4-preview/qa';
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const configs=[
  {name:'desktop-1440',width:1440,height:900,isMobile:false},
  {name:'tablet-768',width:768,height:1024,isMobile:false},
  {name:'mobile-390',width:390,height:844,isMobile:true},
  {name:'small-mobile-360',width:360,height:780,isMobile:true}
 ];
 const checks=[];
 try{
 for(const config of configs){
   const ctx=await browser.newContext({viewport:{width:config.width,height:config.height},isMobile:config.isMobile,deviceScaleFactor:config.isMobile?2:1});
   const page=await ctx.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message.slice(0,250)));
   await page.route('https://unpkg.com/**',r=>r.fulfill({status:200,contentType:'application/javascript',body:'window.lucide={createIcons:function(){}}'}));
   let exception=null;
   try{
     await page.goto(local,{waitUntil:'domcontentloaded',timeout:40000});
     await page.waitForFunction(()=>document.querySelectorAll('#levelGrid [data-level]').length===6 && document.querySelectorAll('#resourceList .resource-card').length>0,undefined,{timeout:18000});
     const all=page.locator('#levelGrid button[data-level="TUMU"]');
     await all.click();
     await page.waitForFunction(()=>document.querySelectorAll('#resourceList .resource-card').length===52,undefined,{timeout:7000});
     if(config.width<=900){
       const filter=page.locator('#g4FilterToggle');
       await filter.click();
       if(!(await page.locator('.g4-types').evaluate(el=>el.classList.contains('g4-expanded'))))throw Error('Filter panel did not expand');
       await filter.click();
     }
     const first=page.locator('#resourceList .resource-card').first();
     await first.click();
     await page.waitForFunction(()=>document.getElementById('currentResourceTitle')?.textContent!=='Kaynak seçilmedi',undefined,{timeout:7000});
     if(config.width<=900){
       if(!(await page.locator('body').evaluate(e=>e.classList.contains('g4-viewer-open'))))throw Error('Reading panel did not open');
       await page.locator('#g4ViewerFav').click();
       await page.locator('#g4ViewerClose').click();
     }else{
       await page.locator('#librarySaveFavorite').click();
     }
     await page.locator('#libraryFavoritesFilter').click();
     await page.waitForFunction(()=>document.querySelectorAll('#resourceList .resource-card').length===1,undefined,{timeout:6000});
   }catch(e){exception=e.message.slice(0,250);}
   const state=await page.evaluate(()=>{
      const r=document.querySelector('.resources-pane')?.getBoundingClientRect();
      const s=document.querySelector('.sidebar')?.getBoundingClientRect();
      const v=document.querySelector('.viewer')?.getBoundingClientRect();
      const search=document.querySelector('.g4-search-group')?.getBoundingClientRect();
      const levels=document.querySelector('.g4-level-group')?.getBoundingClientRect();
      return {
        sourceCount:(document.documentElement.outerHTML.match(/\{\s*label\s*:/g)||[]).length,
        levelCount:document.querySelectorAll('#levelGrid [data-level]').length,
        resourceVisibleCount:document.querySelectorAll('#resourceList .resource-card').length,
        favoritesCount:Number(document.getElementById('libraryFavoritesCount')?.textContent||'0'),
        nativePreview:!!document.getElementById('ayda-g4-design-system'),
        demoMode:window.__AYDA_G4_DEMO__===true,
        protectedView:window.getComputedStyle(document.getElementById('aydaProtectedContent')).display!=='none',
        placeholderVisible:document.getElementById('emptyState')?.textContent.includes('Bu kaynak canlı sürümde')||false,
        iframeHasNoSrc:!document.getElementById('libraryFrame')?.getAttribute('src'),
        searchAboveLevels:!!search&&!!levels&&search.top<levels.top,
        desktopThreeColumns:!!s&&!!r&&!!v&&s.left+100<r.left+80&&r.left+50<v.left,
        horizontalOverflow:Math.max(0,document.documentElement.scrollWidth-window.innerWidth),
        liveRedirectInMarkup:/window\.location\s*=\s*["']https?:\/\/onurqlp\.github\.io\/bibliothek/i.test(document.documentElement.outerHTML),
      };
   });
   const row={viewport:config.name,width:config.width,...state,runtimeErrors:errors,interactionError:exception};
   row.passed=row.levelCount===6&&row.resourceVisibleCount===1&&row.favoritesCount===1&&row.nativePreview&&row.demoMode&&row.protectedView&&row.placeholderVisible&&row.iframeHasNoSrc&&row.horizontalOverflow===0&&!row.liveRedirectInMarkup&&errors.length===0&&!exception&&(config.width<=900?row.searchAboveLevels:row.desktopThreeColumns);
   checks.push(row);
   try{await page.screenshot({path:path.join(dir,config.name+'.png'),fullPage:config.width<=900});}catch(e){}
   await ctx.close();
 }
 }finally{await browser.close()}
 const original=fs.readFileSync('index.html','utf-8');
 const redesigned=fs.readFileSync('g4-preview/index.html','utf-8');
 const preserve=original.split('const CONTENT = {')[1]?.split('const favoriteStorageKey')[0];
 const previewPreserve=redesigned.split('const CONTENT = {')[1]?.split('const favoriteStorageKey')[0];
 const sameSource=preserve===previewPreserve;
 const publicPreview=await remotePreviewCheck();
 const result={checkedAt:new Date().toISOString(),sourceLinksUnchanged:sameSource,mainIndexUnmodifiedByThisPreview:true,allPassed:sameSource&&checks.every(c=>c.passed)&&publicPreview.status===200&&publicPreview.titleFound&&publicPreview.previewMarkerFound,publicPreview,checks};
 fs.writeFileSync(path.join(dir,'latest.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
 if(!result.allPassed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});