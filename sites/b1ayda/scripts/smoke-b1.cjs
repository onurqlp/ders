/* AYDA B1 | Headless Chrome smoke test
 * Tests only the user interface. Authentication must be tested separately
 * against the real AYDA credential service by an authorized tester.
 */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const puppeteer=require("puppeteer-core");
const ROOT=path.resolve(__dirname,"..");
const chrome=[
 process.env.CHROME_BIN,
 "/usr/bin/google-chrome",
 "/usr/bin/google-chrome-stable",
 "/usr/bin/chromium",
 "/usr/bin/chromium-browser"
].find(p=>p&&fs.existsSync(p));
if(!chrome)throw Error("No headless Chrome binary found");
const types={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,"http://localhost");
  const relative=decodeURIComponent(url.pathname);
  const file=path.resolve(ROOT,"."+relative);
  if(!(file===ROOT||file.startsWith(ROOT+path.sep)))throw Error("Forbidden path");
  const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,"index.html"):file;
  const data=fs.readFileSync(target);
  res.writeHead(200,{"content-type":types[path.extname(target)]||"application/octet-stream"});
  res.end(data);
 }catch(error){res.writeHead(404);res.end("Not found")}
});
const timeout=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 const port=server.address().port;
 const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const page=await browser.newPage();
 try{
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.setRequestInterception(true);
  page.on("request",request=>{
   const u=request.url();
   if(u.startsWith("https://onurqlp.github.io/ayda-pass/")){
    request.respond({status:200,contentType:"application/javascript",body:"/* External login service mocked for UI smoke testing only. */"});
   }else if(u.startsWith("http://127.0.0.1:"))request.continue();
   else request.abort();
  });
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:"+port+"/preview/",{waitUntil:"domcontentloaded"});
  await page.waitForSelector(".unitCard",{timeout:20000});
  const homeCount=await page.$$eval(".unitCard",els=>els.length);
  assert.equal(homeCount,24,"24 units should be visible in catalog.");
  assert.ok(await page.$eval("#aydaCompactDock",node=>node.hidden),"Guest must not see learning navigation.");
  // Only unlock the UI DOM for tests; not a real login nor a bypass in production.
  await page.evaluate(()=>{
   document.getElementById("aydaLoginBox").style.display="none";
   document.getElementById("aydaProtectedContent").style.display="block";
  });
  await page.$eval(".unitCard button",node=>node.click());
  await page.waitForSelector("#aydaCompactDock:not([hidden])",{timeout:12000});
  await page.waitForSelector("#aydaInlinePath");
  assert.equal(await page.$eval("#aydaInlinePath",element=>element.querySelectorAll("[data-ayda-inline-tab]").length),3,
    "In-page Learn, Video, Practice buttons must be present.");
  assert.ok(await page.$eval("#aydaInlinePath",e=>getComputedStyle(e).display!=="none"),
    "In-page navigation must be visible without using the fixed bottom bar.");
  assert.ok(await page.$eval(".detailPage .explanation",e=>getComputedStyle(e).display!=="none"),"Learn tab must show full grammar.");
  assert.ok(await page.$eval(".detailPage .videoLesson",e=>getComputedStyle(e).display==="none"),"Learn tab should not show video.");
  assert.ok(await page.$eval(".detailPage .ayda-extra",e=>!!e),"Additional B1 explanation not visible in DOM.");
  // The visible in-page "İlerle" button opens the video without the fixed dock.
  await page.$eval("#aydaInlineNext",b=>b.click());
  await page.waitForFunction(()=>document.body.dataset.aydaTab==="video");
  assert.ok(await page.$eval(".detailPage .videoLesson",e=>getComputedStyle(e).display!=="none"),"Video tab is hidden.");
  // In-video inline CTA leads directly to practice and preserves the video iframe.
  await page.$eval('[data-ayda-actions="video"] [data-ayda-inline-action="practice"]',b=>b.click());
  await page.waitForFunction(()=>document.body.dataset.aydaTab==="practice");
  assert.ok(await page.$eval(".detailPage .activityRunner",e=>getComputedStyle(e).display!=="none"),"Inline practice CTA must work.");
  await page.$eval('[data-ayda-inline-tab="learn"]',b=>b.click());
  await page.waitForFunction(()=>document.body.dataset.aydaTab==="learn");
  await page.$eval('[data-ayda-inline-tab="video"]',b=>b.click());
  assert.ok(await page.$eval(".detailPage .videoLesson",e=>getComputedStyle(e).display!=="none"),
    "In-page video button must work.");
  assert.equal(await page.$$eval(".videoFrame iframe",a=>a.length),1,"Embedded video missing.");
  await page.$eval('[data-ayda-tab-button="practice"]',b=>b.click());
  const groupSize=()=>page.$$eval(".runnerSteps button",a=>a.filter(e=>getComputedStyle(e).display!=="none").length);
  assert.equal(await groupSize(),6,"Only six question numbers should be visible in a set.");
  assert.equal(await page.$$eval(".runnerSteps button",a=>a.length),24,"Original 24 exercises must stay in the DOM.");
  await page.$eval('[data-ayda-set-button="2"]',b=>b.click());
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="7",{timeout:5000})
    .catch(async err=>{
      console.error("SET TWO DIAGNOSTIC",await page.evaluate(()=>({
        active:document.querySelector(".runnerSteps button.active")?.textContent,
        allButtons:document.querySelectorAll(".runnerSteps button").length,
        bodyState:{...document.body.dataset},
        dock:document.querySelector("#aydaCompactSetSummary")?.textContent,
        inline:document.querySelector("#aydaInlineWhere")?.textContent,
        visible:document.querySelector(".activityRunner")?.getBoundingClientRect().height,
        inner:document.querySelector(".runnerCard")?.textContent?.slice(0,160)
      })),errors);
      throw err;
    });
  assert.equal(await groupSize(),6,"Second set should also have 6 questions.");
  await page.$eval("#aydaInlineNext",b=>b.click());
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="8");
  await page.waitForFunction(()=>document.querySelector("#aydaInlineWhere")?.textContent.includes("Soru 2/6"),{timeout:7000});
  await page.$eval(".runnerSteps button:nth-child(7)",b=>b.click());
  await page.$eval('[data-ayda-set-button="3"]',b=>b.click());
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="13");
  await page.$eval('[data-ayda-set-button="skills"]',b=>b.click());
  assert.ok(await page.$eval(".readingSection",e=>getComputedStyle(e).display!=="none"),"Reading assignment missing.");
  assert.ok(await page.$eval(".productionGrid",e=>getComputedStyle(e).display!=="none"),"Writing/speaking assignment missing.");
  assert.ok(await page.$eval(".unitCheck",e=>getComputedStyle(e).display!=="none"),"Unit summary missing.");
  await page.$eval('[data-ayda-set-button="2"]',b=>b.click());
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="7");
  await page.$eval(".ayda-compact-back",b=>b.click());
  await page.waitForSelector(".unitCard");
  await page.$eval(".unitCard button",b=>b.click());
  await page.waitForSelector(".detailPage .runnerSteps button.active");
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="7");
  assert.equal(await groupSize(),6,"Returning student must see a 6-question set.");
  await page.$eval('[data-ayda-tab-button="practice"]',b=>b.click());
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+3);
  assert.equal(overflow,false,"Mobile layout has horizontal overflow.");
  await fs.promises.mkdir(path.join(ROOT,"screenshots"),{recursive:true});
  await page.screenshot({path:path.join(ROOT,"screenshots","ayda-b1-mobile.png"),fullPage:false});
  await page.$eval(".ayda-compact-back",b=>b.click());
  await page.waitForSelector(".unitCard");
  for(let i=1;i<=24;i++){
   await page.$eval(".unitCard:nth-child("+i+") button",b=>b.click());
   await page.waitForFunction(id=>{
    const label=document.querySelector(".detailPage .unitNumber")?.textContent||"";
    return Number(label.match(/\d+/)?.[0])===id;
   },{},i);
   // React paints the unit first; compact controls arrive on the next animation frame.
   await page.waitForSelector(".detailPage #aydaInlinePath",{timeout:8000});
   assert.equal(await page.$eval(".detailPage .runnerSteps",el=>el.querySelectorAll("button").length),24,
    "Unit "+i+" must retain its 24 exercises");
   assert.equal(await page.$eval(".detailPage",el=>el.querySelectorAll("#aydaInlinePath").length),1,
    "Unit "+i+" must have one compact inline navigation (no duplicates).");
   assert.ok(await page.$(".detailPage .explanation"),"Unit "+i+" has no explanation");
   assert.ok(await page.$(".detailPage .videoLesson"),"Unit "+i+" has no video");
   assert.ok(await page.$(".detailPage .readingSection"),"Unit "+i+" has no reading");
   assert.ok(await page.$(".detailPage .productionGrid"),"Unit "+i+" has no writing and speaking");
   await page.$eval(".detailPage .backButton",b=>b.click());
   await page.waitForSelector(".unitCard");
  }
  // Older students already have progress saved by the original platform.
  // A fresh compact session must resume from the first uncompleted exercise.
  await page.evaluate(()=>{
   const key="ayda-b1-progress";
   const progress=JSON.parse(localStorage.getItem(key)||'{"correct":[],"writing":[],"speaking":[],"lastUnit":24}');
   progress.correct=[...new Set([...(progress.correct||[]),...Array.from({length:6},(_,i)=>"u24a"+(i+1))])];
   localStorage.setItem(key,JSON.stringify(progress));
   localStorage.removeItem("ayda-b1-compact-v1:step-24");
  });
  // Reload exactly as a returning student would: React imports the stored progress on startup.
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForSelector(".unitCard");
  await page.evaluate(()=>{
   document.getElementById("aydaLoginBox").style.display="none";
   document.getElementById("aydaProtectedContent").style.display="block";
  });
  await page.$eval(".unitCard:nth-child(24) button",b=>b.click());
  await page.waitForFunction(()=>document.querySelector(".runnerSteps button.active")?.textContent?.trim()==="7",{timeout:12000});
  await page.$eval(".detailPage .backButton",b=>b.click());
  await page.waitForSelector(".unitCard");

  assert.deepEqual(errors,[],"Uncaught errors: "+errors.join("; "));
  console.log("PASS — 24 units × 24 exercises, inline video, grammar, reading, writing, speaking.");
  console.log("PASS — three tabs, four six-question sets, skills stage, local resume, mobile viewport.");
  console.log("PASS — in-page video, practice, continue and footer actions work on mobile.");
 }finally{
  await page.close();await browser.close();
 }
})().catch(err=>{console.error(err);process.exitCode=1}).finally(()=>server.close());
