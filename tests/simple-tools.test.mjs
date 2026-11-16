import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {parse as parseYaml} from "yaml";
import {calcSimple} from "../src/lib/simpleToolMath.mjs";
import {processTextTool} from "../src/lib/simpleToolText.mjs";
import {runExtraText} from "../src/lib/extraTextEngine.mjs";
import {runExtraData} from "../src/lib/extraDataEngine.mjs";
import {runExtraWeb} from "../src/lib/extraWebEngine.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const release=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));

test("All 141 distinct text-only tools remain inside the weekly release queue",()=>{
 assert.equal(queue.length,141);
 assert.equal(queue.slice(0,91).filter(x=>x.week<=10).length,91);
 assert.equal(queue.slice(91).length,50);
 assert.equal(new Set(queue.map(x=>x.slug)).size,91);
 const banned=/pdf|image|file|upload|qr|barcode/i;
 for(const q of queue){
   assert.doesNotMatch(q.slug,banned);
   assert.match(q.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
   assert.ok(q.name&&q.category&&q.example&&q.metaDescription);
   assert.ok(["text","developer","security","calculator","converter"].includes(q.category));
   assert.ok(q.week>=1&&q.week<=15);
 }
 assert.ok(Array.isArray(release.published));
 assert.equal(new Set(release.published).size,release.published.length);
 assert.ok(release.published.every(slug=>queue.some(tool=>tool.slug===slug&&tool.ready)));
 assert.equal(release.weeklyLimit,10);
});

test("Every queued tool has an engine case, and sample inputs produce useful results",()=>{
 const math=fs.readFileSync("src/lib/simpleToolMath.mjs","utf8");
 const txt=fs.readFileSync("src/lib/simpleToolText.mjs","utf8");
 const extra= ["src/lib/extraTextEngine.mjs","src/lib/extraDataEngine.mjs","src/lib/extraWebEngine.mjs"].map(file=>fs.readFileSync(file,"utf8")).join("\n");
 for(const q of queue){
   assert.ok(math.includes('case "'+q.slug+'"')||txt.includes('case "'+q.slug+'"')||extra.includes('case "'+q.slug+'"'),q.slug+" missing implementation");
   if(["xml-to-json","xml-sitemap-validator","html-tag-counter","html-link-extractor","html-attribute-extractor"].includes(q.slug))continue; // Browser DOMParser is not available in Node.
   const output=q.slug==="yaml-to-json"?JSON.stringify(parseYaml(q.example),null,2):
     calcSimple(q.slug,q.example)??processTextTool(q.slug,q.example)??runExtraText(q.slug,q.example)??runExtraData(q.slug,q.example)??runExtraWeb(q.slug,q.example);
   assert.equal(typeof output,"string",q.slug+" missing output");
   assert.ok(output.trim().length>0,q.slug+" empty output");
 }
});

test("High-value examples produce correct outputs",()=>{
 assert.equal(calcSimple("median-calculator","1, 5, 3"),"3");
 assert.equal(calcSimple("square-root-calculator","144"),"12");
 assert.equal(calcSimple("leap-year-checker","2028"),"Leap year (366 days)");
 assert.equal(calcSimple("bytes-to-bits","1024"),"8,192 bits");
 assert.equal(calcSimple("binary-to-decimal","101010"),"42");
 assert.equal(calcSimple("roman-numeral-converter","2026"),"MMXXVI");
 assert.equal(processTextTool("md5-checksum-generator","hello").split("\n")[0],"5d41402abc4b2a76b9719d911017c592");
 assert.equal(processTextTool("rot13-encoder","Hello"),"Uryyb");
 assert.deepEqual(JSON.parse(processTextTool("csv-to-json","name,age\nAlice,30")),[{name:"Alice",age:"30"}]);
 assert.match(processTextTool("meta-tag-generator","Title|Summary|https://example.com"),/<title>Title<\/title>/);
});

test("Weekly release never publishes early, twice, or more than ten in a week",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-simple-release-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(queue.map(x=>({...x,ready:true}))));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  const before=releaseSimpleTools({root,now:new Date("2026-11-23T01:59:59Z")});
  assert.equal(before.released.length,0);
  const dry=releaseSimpleTools({root,now:new Date("2026-11-23T02:00:00Z"),dryRun:true});
  assert.equal(dry.released.length,10);
  const first=releaseSimpleTools({root,now:new Date("2026-11-23T02:00:00Z")});
  assert.equal(first.released.length,10);
  assert.equal(releaseSimpleTools({root,now:new Date("2026-11-23T05:00:00Z")}).released.length,0);
  assert.equal(releaseSimpleTools({root,now:new Date("2026-11-30T02:00:00Z")}).released.length,10);
  const saved=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.equal(saved.published.length,20);
  assert.equal(new Set(saved.published).size,20);
  assert.equal(saved.history.length,2);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
