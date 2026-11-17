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
import {thirdText} from "../src/lib/wave3Text.mjs";
import {thirdCsvJson} from "../src/lib/wave3Data.mjs";
import {dateSlots3} from "../src/lib/wave3Dates.mjs";
import {math4} from "../src/lib/wave3Math.mjs";
import {web5} from "../src/lib/wave3Web.mjs";
import {t4A,t4B} from "../src/lib/wave4Text.mjs";
import {h4Html,u4Tools} from "../src/lib/wave4HtmlUrl.mjs";
import {j4Tools,c4Tools} from "../src/lib/wave4JsonCsv.mjs";
import {n4Buss,n4Stats} from "../src/lib/wave4BusinessStats.mjs";
import {v4Http,v4Validate} from "../src/lib/wave4WebValidators.mjs";
import {t5TextA,t5TextB} from "../src/lib/wave5Text.mjs";
import {m5Process,d5Process} from "../src/lib/wave5MarkdownData.mjs";
import {j5Tools,d5DateTools} from "../src/lib/wave5JsonDates.mjs";
import {n5Math,n5Business} from "../src/lib/wave5MathBusiness.mjs";
import {c5HtmlCss,s5Security} from "../src/lib/wave5Web.mjs";
import {w6Text} from "../src/lib/wave6Text.mjs";
import {w6Time} from "../src/lib/wave6Time.mjs";
import {w6Probability} from "../src/lib/wave6Probability.mjs";
import {w6Math} from "../src/lib/wave6Math.mjs";
import {w6Finance} from "../src/lib/wave6Finance.mjs";
import {w6Business} from "../src/lib/wave6Business.mjs";
import {w6CsvTools} from "../src/lib/wave6Csv.mjs";
import {w6ConfigTools} from "../src/lib/wave6Config.mjs";
import {w6WebTools} from "../src/lib/wave6Web.mjs";
import {w6Network} from "../src/lib/wave6Network.mjs";
import {w7Text} from "../src/lib/wave7Text.mjs";
import {w7Markdown} from "../src/lib/wave7Markdown.mjs";
import {w7CsvQuality} from "../src/lib/wave7CsvQuality.mjs";
import {w7CsvAnalytics} from "../src/lib/wave7CsvAnalytics.mjs";
import {w7JsonTools} from "../src/lib/wave7Json.mjs";
import {w7Stats} from "../src/lib/wave7Stats.mjs";
import {w7Math} from "../src/lib/wave7Math.mjs";
import {w7Business} from "../src/lib/wave7Business.mjs";
import {w7Schedule} from "../src/lib/wave7Schedule.mjs";
import {w7Web} from "../src/lib/wave7Web.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const release=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));

test("All 573 distinct queued browser tools remain inside the weekly release queue",()=>{
 assert.equal(queue.length,573);
 assert.equal(queue.filter(x=>x.batch===1).length,89);
 assert.equal(queue.filter(x=>x.batch===2).length,50);
 assert.equal(queue.filter(x=>x.batch===3).length,50);
 assert.equal(queue.filter(x=>x.batch===4).length,97);
 assert.equal(queue.filter(x=>x.batch===5).length,87);
 assert.equal(queue.filter(x=>x.batch===6).length,100);
 assert.equal(queue.filter(x=>x.batch===7).length,100);
 assert.equal(new Set(queue.map(x=>x.slug)).size,573);
 const banned=/(?:^|-)(?:pdf|image|file|upload|barcode|qr)(?:-|$)/i;
 for(const q of queue){
   assert.doesNotMatch(q.slug,banned);
   assert.match(q.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
   assert.ok(q.name&&q.category&&q.example&&q.metaDescription);
   assert.ok(["text","developer","security","calculator","converter"].includes(q.category));
   assert.ok(q.week>=1&&q.week<=58);
 }
 assert.ok(Array.isArray(release.published));
 assert.equal(new Set(release.published).size,release.published.length);
 assert.ok(release.published.every(slug=>queue.some(tool=>tool.slug===slug&&tool.ready)));
 assert.equal(release.weeklyLimit,10);
});

test("Every queued tool has an engine case, and sample inputs produce useful results",()=>{
 const math=fs.readFileSync("src/lib/simpleToolMath.mjs","utf8");
 const txt=fs.readFileSync("src/lib/simpleToolText.mjs","utf8");
 const extra= ["src/lib/extraTextEngine.mjs","src/lib/extraDataEngine.mjs","src/lib/extraWebEngine.mjs","src/lib/wave3Text.mjs","src/lib/wave3Data.mjs","src/lib/wave3Dates.mjs","src/lib/wave3Math.mjs","src/lib/wave3Web.mjs","src/lib/wave4Text.mjs","src/lib/wave4HtmlUrl.mjs","src/lib/wave4JsonCsv.mjs","src/lib/wave4BusinessStats.mjs","src/lib/wave4WebValidators.mjs","src/lib/wave5Text.mjs","src/lib/wave5MarkdownData.mjs","src/lib/wave5JsonDates.mjs","src/lib/wave5MathBusiness.mjs","src/lib/wave5Web.mjs","src/lib/wave6Text.mjs","src/lib/wave6Time.mjs","src/lib/wave6Probability.mjs","src/lib/wave6Math.mjs","src/lib/wave6Finance.mjs","src/lib/wave6Business.mjs","src/lib/wave6Csv.mjs","src/lib/wave6Config.mjs","src/lib/wave6Web.mjs","src/lib/wave6Network.mjs","src/lib/wave7Text.mjs","src/lib/wave7Markdown.mjs","src/lib/wave7CsvQuality.mjs","src/lib/wave7CsvAnalytics.mjs","src/lib/wave7Json.mjs","src/lib/wave7Stats.mjs","src/lib/wave7Math.mjs","src/lib/wave7Business.mjs","src/lib/wave7Schedule.mjs","src/lib/wave7Web.mjs"].map(file=>fs.readFileSync(file,"utf8")).join("\n");
 for(const q of queue){
   assert.ok(math.includes('case "'+q.slug+'"')||txt.includes('case "'+q.slug+'"')||extra.includes('case "'+q.slug+'"'),q.slug+" missing implementation");
   if(["xml-to-json","xml-sitemap-validator","html-tag-counter","html-link-extractor","html-attribute-extractor","html-table-to-csv","html-heading-word-counter","html-paragraph-element-counter","html-link-rel-analyzer","html-meta-description-extractor","html-canonical-link-extractor","html-language-attribute-checker","html-title-tag-extractor","html-form-field-extractor","html-duplicate-id-detector","html-label-association-checker","html-aria-attribute-audit","html-data-attribute-extractor","html-external-link-extractor","html-target-blank-link-checker","html-button-type-checker","html-empty-anchor-detector","social-meta-tag-auditor","html-table-accessibility-checker","html-landmark-accessibility-auditor"].includes(q.slug))continue; // Browser DOMParser is not available in Node.
   const output=q.slug==="yaml-to-json"?JSON.stringify(parseYaml(q.example),null,2):
     calcSimple(q.slug,q.example)??processTextTool(q.slug,q.example)??runExtraText(q.slug,q.example)??runExtraData(q.slug,q.example)??runExtraWeb(q.slug,q.example)??thirdText(q.slug,q.example)??thirdCsvJson(q.slug,q.example)??dateSlots3(q.slug,q.example)??math4(q.slug,q.example)??web5(q.slug,q.example)??t4A(q.slug,q.example)??t4B(q.slug,q.example)??h4Html(q.slug,q.example)??u4Tools(q.slug,q.example)??j4Tools(q.slug,q.example)??c4Tools(q.slug,q.example)??n4Buss(q.slug,q.example)??n4Stats(q.slug,q.example)??v4Http(q.slug,q.example)??v4Validate(q.slug,q.example)??t5TextA(q.slug,q.example)??t5TextB(q.slug,q.example)??m5Process(q.slug,q.example)??d5Process(q.slug,q.example)??j5Tools(q.slug,q.example)??d5DateTools(q.slug,q.example)??n5Math(q.slug,q.example)??n5Business(q.slug,q.example)??c5HtmlCss(q.slug,q.example)??s5Security(q.slug,q.example)??w6Text(q.slug,q.example)??w6Time(q.slug,q.example)??w6Probability(q.slug,q.example)??w6Math(q.slug,q.example)??w6Finance(q.slug,q.example)??w6Business(q.slug,q.example)??w6CsvTools(q.slug,q.example)??w6ConfigTools(q.slug,q.example)??w6WebTools(q.slug,q.example)??w6Network(q.slug,q.example)??w7Text(q.slug,q.example)??w7Markdown(q.slug,q.example)??w7CsvQuality(q.slug,q.example)??w7CsvAnalytics(q.slug,q.example)??w7JsonTools(q.slug,q.example)??w7Stats(q.slug,q.example)??w7Math(q.slug,q.example)??w7Business(q.slug,q.example)??w7Schedule(q.slug,q.example)??w7Web(q.slug,q.example);
   assert.equal(typeof output,"string",q.slug+" missing output");
   assert.ok(output.trim().length>0,q.slug+" empty output");
 }
});

test("High-value examples produce correct outputs",()=>{
 assert.equal(calcSimple("median-calculator","1, 5, 3"),"3");
 assert.equal(calcSimple("square-root-calculator","144"),"12");
 assert.equal(calcSimple("leap-year-checker","2028"),"Leap year (366 days)");
 assert.equal(calcSimple("bytes-to-bits","1024"),"8,192 bits");
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
