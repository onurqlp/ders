import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";

/* B1 production HTML is the only curricular source.
   Extracts, never rewrites, the current original 24 units, all 576 tasks
   and their teacher-approved Turkish explanations and video links. */
const source=fs.readFileSync("index.html","utf8");
function between(begin,end,after=0){
 const a=source.indexOf(begin,after);
 if(a<0)throw Error("B1 source marker missing: "+begin.slice(0,55));
 const b=source.indexOf(end,a+begin.length);
 if(b<0)throw Error("B1 source end marker missing: "+end.slice(0,50));
 return {a,b,content:source.slice(a,b)};
}
const dataBlock=between(",d=(e,t,n,r,i)=>({id:e,type:`choice`",",y={1:");
const vocabBlock=between(",y={1:",",b=e((e=>",dataBlock.b);
const videoBlock=between("var w=(e,t,n,r,i=",",oe={correct:",vocabBlock.b);
const funcs=between("function S(e){","function re({unit:e",vocabBlock.b);
const run=(code)=>vm.runInNewContext(code,Object.create(null),{timeout:7000});
const units=run("const "+dataBlock.content.slice(1)+"; v;");
const dictionary=run("const "+vocabBlock.content.slice(1)+"; y;");
const videos=run(videoBlock.content+"; ae;");
const exercises=vm.runInNewContext("const y="+JSON.stringify(dictionary)+";"+funcs.content+"; __units.map(S);",
  {__units:units},{timeout:7000});
assert.equal(units.length,24,"B1 must have 24 units");
assert.equal(Object.keys(dictionary).length,24,"B1 vocabulary coverage must contain 24 units");
assert.equal(exercises.length,24);
assert.equal(exercises.reduce((s,a)=>s+a.length,0),576,"Expected 576 B1 exercise tasks");
assert.ok(videos.length>=24,"B1 video list unexpectedly small");
for(let i=0;i<24;i++){
 assert.equal(units[i].id,i+1,"B1 source unit ordering differs");
 assert.equal(exercises[i].length,24,"Missing B1 unit exercises");
 assert.ok(units[i].reading?.text&&units[i].logic&&units[i].writing&&units[i].speakingTask,"B1 unit detail missing");
 units[i].exercises=exercises[i];
}
const payload={version:"2026.10",sourceSha:createHash("sha256").update(source).digest("hex").slice(0,12),units,vocabulary:dictionary,videos};
const output="/* Generated from B1 production index.html; do not edit manually. */\nwindow.AYDA_B1_EXPRESS_DATA="+JSON.stringify(payload)+";\n";
fs.mkdirSync("express",{recursive:true});
fs.writeFileSync("express/course-data.js",output,"utf8");
console.log("PASS:",units.length,"units,",exercises.flat().length,"questions,",videos.length,"videos; B1 original preserved.");
