// G0.3 integrated dashboard browser regression. Never deploys production.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";
const cfg=JSON.parse(fs.readFileSync("tools/consolidation/sources.json","utf8"));
const html=fs.readFileSync("test/index.html","utf8");
assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/);
assert.ok(!/href=["']https:\/\/(?:www\.)?aydadil\.com\//i.test(html));
const cards=[...html.matchAll(/<a class="tile" data-category="([^"]+)" href="\.\.\/sites\/([^/]+)\/index\.html"/g)];
assert.equal(cards.length,cfg.sources.length,"22 source cards required");
const names=new Set(cards.map(x=>x[2]));
assert.equal(names.size,cfg.sources.length);
for(const src of cfg.sources){
  const name=src.repository.split("/").pop();
  assert.ok(names.has(name),"No preview tile for "+name);
  assert.ok(fs.existsSync(path.join("sites",name,"index.html")),"No source index for "+name);
  const r=await fetch("http://127.0.0.1:8765/sites/"+encodeURIComponent(name)+"/index.html");
  assert.equal(r.status,200,"Preview page "+name);
  assert.ok((await r.text()).includes("<"),"Blank page "+name);
}
const results=[];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
try {
  for(const device of [
    {name:"desktop",viewport:{width:1440,height:900}},
    {name:"mobile",viewport:{width:390,height:844},isMobile:true},
    {name:"small-mobile",viewport:{width:360,height:740},isMobile:true}
  ]){
    const ctx=await browser.newContext({viewport:device.viewport,isMobile:!!device.isMobile,hasTouch:!!device.isMobile});
    const page=await ctx.newPage(),errors=[];
    page.on("pageerror",err=>errors.push(err.message));
    await page.goto("http://127.0.0.1:8765/test/index.html",{waitUntil:"domcontentloaded",timeout:25000});
    assert.match(await page.title(),/AYDA.*Test Merkezi/);
    assert.equal(await page.locator(".tile").count(),22);
    assert.equal(await page.locator(".tile:visible").count(),22);
    assert.equal(await page.locator(".course").count(),3);
    const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth));
    assert.ok(overflow<=1,device.name+" horizontal overflow "+overflow);
    await page.locator('[data-filter="exams"]').click();
    const examCount=await page.locator(".tile:visible").count();
    assert.ok(examCount>=8,device.name+" exam filter");
    await page.locator('[data-filter="all"]').click();
    await page.locator("#search").fill("A2");
    const searchMatches=await page.locator(".tile:visible").count();
    assert.ok(searchMatches>=2&&searchMatches<22,device.name+" search filter");
    await page.locator("#search").fill("AYDA_QUERY_MISSING_012348");
    assert.equal(await page.locator(".tile:visible").count(),0);
    assert.equal(await page.locator("#empty").isVisible(),true);
    await page.locator("#search").fill("");
    assert.equal(await page.locator(".tile:visible").count(),22);
    assert.equal(errors.length,0,device.name+" JS errors "+errors.join("; "));
    fs.mkdirSync("test/qa/screenshots",{recursive:true});
    await page.screenshot({path:"test/qa/screenshots/g03-"+device.name+".png",fullPage:true,animations:"disabled"});
    results.push({device:device.name,viewport:device.viewport,examCount,searchMatches,horizontalOverflow:overflow,errors,passed:true});
    await ctx.close();
  }
} finally {await browser.close()}
const report={stage:"G0.3",expectedSites:cfg.sources.length,tests:results,passed:true};
fs.writeFileSync("test/qa/browser-results.json",JSON.stringify(report,null,2)+"\n");
console.log("PASS G0.3: 22 entrypoints, desktop+mobile+small mobile, filter, search, layout and zero JS errors");
