/* AYDA B1 Express · Browser smoke: original 24x24 questions, mobile and desktop. */
const fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const assert=require("node:assert/strict");
const puppeteer=require("puppeteer-core");
const ROOT=path.resolve(__dirname,"..");
const browserBin=[
 process.env.CHROME_BIN,"/usr/bin/google-chrome","/usr/bin/google-chrome-stable",
 "/usr/bin/chromium","/usr/bin/chromium-browser"
].find(p=>p&&fs.existsSync(p));
if(!browserBin)throw Error("Headless Chrome executable missing");
const types={".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".html":"text/html; charset=utf-8",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const u=new URL(req.url,"http://localhost"),requested=decodeURIComponent(u.pathname);
  const p=path.resolve(ROOT,"."+requested);
  if(!(p===ROOT||p.startsWith(ROOT+path.sep)))throw Error("Forbidden");
  const file=fs.statSync(p).isDirectory()?path.join(p,"index.html"):p;
  const bytes=fs.readFileSync(file);
  res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream"});res.end(bytes);
 }catch{res.writeHead(404);res.end("Not found")}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 const browser=await puppeteer.launch({executablePath:browserBin,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 try{
  for(const view of [{width:1280,height:800},{width:390,height:844},{width:320,height:700}]){
   const page=await browser.newPage();
   const errs=[];
   page.on("pageerror",e=>errs.push(e.message));
   await page.setViewport({...view,deviceScaleFactor:1});
   await page.goto(base+"/express/",{waitUntil:"domcontentloaded"});
   await page.waitForSelector(".unit-card",{timeout:15000});
   assert.equal(await page.$$eval(".unit-card",nodes=>nodes.length),24,"Need 24 unit cards");
   assert.equal(await page.evaluate(()=>window.AYDA_B1_EXPRESS_DATA.units.reduce((n,u)=>n+u.exercises.length,0)),576,"Need original 576 exercises");
   assert.equal(await page.evaluate(()=>window.AYDA_B1_EXPRESS_DATA.videos.length),34,"Original B1 video records lost");
   await page.$eval(".unit-card",e=>e.click());
   await page.waitForSelector(".step",{timeout:10000});
   assert.equal(await page.$$eval(".step",els=>els.length),24,"Unit must show 24 question slots");
   await page.$eval("[data-hint]",e=>e.click());
   assert.ok(await page.$(".question .response"),"Hint panel missing");
   await page.$eval("[data-hint]",e=>e.click());
   await page.$eval(".choice",e=>e.click());
   await page.$eval("[data-check]",e=>e.click());
   await page.waitForSelector(".question .response");
   assert.ok(await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem("ayda_b1_express_progress_v1")||"{}")).length===1),"Independent progress save failed");
   await page.$eval('[data-step="5"]',e=>e.click());
   await page.waitForSelector("[data-token]");
   await page.$eval("[data-token]",e=>e.click());
   assert.equal(await page.$$eval("[data-undo]",els=>els.length),1,"Word-order interaction failed");
   await page.$eval("[data-clear]",e=>e.click());
   assert.equal(await page.$$eval("[data-undo]",els=>els.length),0,"Reset token interaction failed");
   const delta=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   assert.ok(delta<=3,view.width+"px viewport overflow: "+delta);
   assert.deepEqual(errs,[],"Express browser errors");
   console.log("PASS B1 Express",view.width+"x"+view.height,"24 units, 576 questions, choices, feedback, hints, order, persistence");
   await page.close();
  }
  const main=await browser.newPage();
  await main.setViewport({width:390,height:844,deviceScaleFactor:1});
  await main.setRequestInterception(true);
  main.on("request",r=>{
   if(r.url().startsWith("https://onurqlp.github.io/ayda-pass/"))r.respond({status:200,contentType:"application/javascript",body:"/* UI-only login mock. */"});
   else if(r.url().startsWith(base))r.continue();else r.abort();
  });
  const mainErrors=[];main.on("pageerror",e=>mainErrors.push(e.message));
  await main.goto(base+"/",{waitUntil:"domcontentloaded"});
  await main.waitForSelector("#aydaProtectedContent .hero",{timeout:15000});
  await main.evaluate(()=>{
   document.getElementById("aydaLoginBox").style.display="none";
   document.getElementById("aydaProtectedContent").style.display="block";
  });
  await main.waitForSelector("#ayda-b1-express-card",{timeout:10000});
  const href=await main.$eval("#ayda-b1-express-card",e=>e.getAttribute("href"));
  assert.equal(href,"./express/","A1-style direct workbook homepage card missing");
  const overflow=await main.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert.ok(overflow<=3,"B1 homepage mobile overflow "+overflow);
  assert.deepEqual(mainErrors,[],"B1 homepage browser errors");
  console.log("PASS B1 homepage Express link, unchanged protected React lesson flow");
  await main.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
