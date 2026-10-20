// G0.3: old-style AYDA level-first portal. No production deployment.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";

const cfg=JSON.parse(fs.readFileSync("tools/consolidation/sources.json","utf8"));
const html=fs.readFileSync("test/index.html","utf8");
assert.match(html,/name="robots" content="noindex,nofollow,noarchive"/);
assert.match(html,/Hangi seviyedesin\?/);
assert.match(html,/Almancada yeni bir/);
assert.doesNotMatch(html,/access-control\.js|aydaCheckPassword|id="aydaPasswordInput"/,"Never ask for AYDA password on third-party preview");
assert.match(html,/extraGrid/);
for(const src of cfg.sources){
 const name=src.repository.split("/").pop();
 assert.ok(fs.existsSync(path.join("sites",name,"index.html")),"Missing original index: "+name);
 const r=await fetch("http://127.0.0.1:8765/sites/"+encodeURIComponent(name)+"/index.html");
 assert.equal(r.status,200,"HTTP failure: "+name);
 assert.ok((await r.text()).includes("<"),"Blank source page "+name);
}
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const results=[];
try{
 for(const device of [
  {name:"desktop",viewport:{width:1440,height:900}},
  {name:"mobile",viewport:{width:390,height:844},isMobile:true},
  {name:"small-mobile",viewport:{width:360,height:740},isMobile:true}
 ]){
  const ctx=await browser.newContext({viewport:device.viewport,isMobile:!!device.isMobile,hasTouch:!!device.isMobile});
  const page=await ctx.newPage(),errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  await page.goto("http://127.0.0.1:8765/test/index.html",{waitUntil:"domcontentloaded",timeout:25000});
  assert.match(await page.title(),/AYDA.*Öğrenci Portalı.*Test/);
  assert.equal(await page.locator(".level").count(),5,device.name+" level count");
  assert.equal(await page.locator("#choose").isVisible(),true);
  assert.equal(await page.locator("#dashboard").isVisible(),false);
  assert.equal(await page.locator("#aydaPasswordInput").count(),0);
  assert.equal(await page.locator("#extraGrid a").count(),15);
  const overflowInitial=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
  assert.ok(overflowInitial<=1,device.name+" initial horizontal overflow: "+overflowInitial);
  fs.mkdirSync("test/qa/screenshots",{recursive:true});
  await page.screenshot({path:"test/qa/screenshots/g03-"+device.name+"-levels.png",fullPage:true,animations:"disabled"});
  await page.locator('button[data-level="A1"]').click();
  assert.equal(await page.locator("#dashboard").isVisible(),true);
  assert.equal(await page.locator("#choose").isVisible(),false);
  assert.ok((await page.locator("#featuredLink").getAttribute("href")).includes("sites/A1ayda/index.html"));
  assert.equal(await page.locator("#tiles .tile").count(),8);
  assert.equal(await page.locator("#tiles .tile:visible").count(),8);
  const overflowDash=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
  assert.ok(overflowDash<=1,device.name+" dashboard horizontal overflow "+overflowDash);
  await page.locator('[data-filter="course"]').click();
  assert.equal(await page.locator("#tiles .tile:visible").count(),3,device.name+" course filter");
  await page.locator('[data-filter="resource"]').click();
  assert.equal(await page.locator("#tiles .tile:visible").count(),5,device.name+" resource filter");
  await page.locator('[data-filter="all"]').click();
  await page.locator("#resourceSearch").fill("A2");
  assert.ok(await page.locator("#tiles .tile:visible").count()>=1,device.name+" search positive");
  await page.locator("#resourceSearch").fill("UNLIKELY_AYDA_TERM_4301");
  assert.equal(await page.locator("#tiles .tile:visible").count(),0,device.name+" search empty");
  assert.equal(await page.locator("#portalEmpty").isVisible(),true);
  await page.locator("#resourceSearch").fill("");
  assert.equal(await page.locator("#tiles .tile:visible").count(),8);
  await page.locator("#allplatforms > summary").click();
  assert.equal(await page.locator("#extraGrid a:visible").count(),15);
  const extraRoutes=await page.locator("#extraGrid a").evaluateAll(a=>a.map(x=>new URL(x.href).pathname));
  assert.equal(new Set(extraRoutes).size,15,"Duplicated secondary links");
  assert.equal(errors.length,0,device.name+" runtime errors "+errors.join("; "));
  await page.screenshot({path:"test/qa/screenshots/g03-"+device.name+"-dashboard.png",fullPage:true,animations:"disabled"});
  await page.locator("#change").click();
  assert.equal(await page.locator("#choose").isVisible(),true,device.name+" back to levels");
  await page.locator('button[data-level="B2"]').click();
  assert.ok((await page.locator("#featuredLink").getAttribute("href")).includes("sites/sinavhazirlik/index.html"),"B2 exam fallback");
  await ctx.close();
  results.push({device:device.name,initialOverflow:overflowInitial,dashboardOverflow:overflowDash,levels:5,primaryTiles:8,additionalResources:15,errors,passed:true});
 }
}finally{await browser.close()}
const report={stage:"G0.3",design:"classic AYDA portal",sources:cfg.sources.length,tests:results,passed:true};
fs.writeFileSync("test/qa/browser-results.json",JSON.stringify(report,null,2)+"\n");
console.log("PASS G0.3: Old AYDA layout, 22 sources, 5 levels, eight main links, 15 secondary links, 3 viewports");
