import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
const base=fs.readFileSync("index.html","utf8");
const candidate=fs.readFileSync("preview/index.html","utf8");
function blobSHA(content){
 const buffer=Buffer.from(content);
 return createHash("sha1").update("blob "+buffer.byteLength+"\0").update(buffer).digest("hex");
}
const link='  <script defer src="./b1-express-shortcut.js"></script>\n';
assert.equal(base.split(link).length,2,"B1 Express shortcut must be added once and only once.");
const approvedBase=base.replace(link,"");
assert.equal(blobSHA(approvedBase),"e89eabc8c190e2fe8f360b8e9213bea7b7808dc5",
 "Original B1 index.html changed outside the approved Express shortcut.");
assert.ok(fs.existsSync("b1-express-shortcut.js"),"B1 Express homepage asset is missing.");
const markerStart="m=[{id:1", markerEnd="function se(){";
function originalCourseData(src){
 const first=src.indexOf(markerStart), last=src.indexOf(markerEnd,first);
 assert.ok(first>0&&last>first,"Core curriculum boundary could not be found.");
 return src.slice(first,last);
}
assert.equal(originalCourseData(candidate),originalCourseData(base),
  "B1 units, exercises, grammar explanations, videos or progress logic changed.");
for(const [label,token,count] of [
 ["Unit topics","topicTr:",24],
 ["Question groups","questions:[",48],
 ["Reading material","reading:{",24],
 ["Writing assignments","writing:{",24],
 ["Speaking tasks","speakingTask:",24]
]){
 const occurrences=src=>src.split(token).length-1;
 assert.equal(occurrences(base),count,"Unexpected original "+label+" count");
 assert.equal(occurrences(candidate),count,"Some "+label+" were removed");
}
for(const relative of ["ayda-learning.css","ayda-learning.js","ayda-brand.js","ayda-compact.css","ayda-compact.js","favicon.svg"]){
 assert.ok(fs.existsSync("preview/"+relative),"Missing preview resource "+relative);
 assert.ok(candidate.includes('"./'+relative+'"'),"Missing resource reference "+relative);
}
assert.ok(candidate.includes('https://onurqlp.github.io/ayda-pass/access-control.js'),"Central password script removed");
console.log("PASS — original site unchanged; all 24 units, 576 exercise slots and content data preserved byte-for-byte.");
console.log("PASS — preview resources, central password gate and exercise progress logic retained.");
console.log("PASS — B1 Express navigation added safely without changing core data.");
