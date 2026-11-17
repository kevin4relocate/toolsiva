import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {thirdText} from "../src/lib/wave3Text.mjs";
import {thirdCsvJson} from "../src/lib/wave3Data.mjs";
import {dateSlots3} from "../src/lib/wave3Dates.mjs";
import {math4} from "../src/lib/wave3Math.mjs";
import {web5} from "../src/lib/wave3Web.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave3ToolGuides.json" with {type:"json"};

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const added=queue.filter(x=>x.batch===3);
const run=(slug,value)=>thirdText(slug,value)??thirdCsvJson(slug,value)??dateSlots3(slug,value)??math4(slug,value)??web5(slug,value);

test("Exactly 50 new tools follow the prior 141 and all have working examples",()=>{
 assert.equal(queue.length,967);
 assert.equal(added.length,50);
 assert.equal(queue.filter(x=>x.batch===2).at(-1).slug,"ipv4-subnet-calculator");
 assert.equal(added[0].slug,"text-line-includes-filter");
 assert.equal(added.at(-1).slug,"dmarc-record-generator");
 assert.equal(new Set(queue.map(x=>x.slug)).size,967);
 assert.equal(Object.keys(guides).length,50);
 const sources=["wave3Text","wave3Data","wave3Dates","wave3Math","wave3Web"].map(x=>fs.readFileSync("src/lib/"+x+".mjs","utf8")).join("\n");
 for(const tool of added){
  assert.ok(tool.ready&&guides[tool.slug],tool.slug+" missing ready or guide");
  assert.ok(tool.metaDescription.length>=60&&tool.metaDescription.length<=180,tool.slug+" meta length");
  assert.equal(guides[tool.slug].example,tool.example);
  assert.ok(tool.week>=14&&tool.week<=19);
  assert.ok(sources.includes('case "'+tool.slug+'"'),tool.slug+" missing engine");
  assert.doesNotMatch(tool.slug,/pdf|image|upload|barcode|qr-reader/);
  if(tool.slug==="html-table-to-csv")continue; // DOMParser is available in the browser build.
  const output=run(tool.slug,tool.example);
  assert.equal(typeof output,"string",tool.slug+" result type");
  assert.ok(output.trim().length>0,tool.slug+" result empty");
 }
});

test("Line and Markdown tools perform distinct actual transformations",()=>{
 assert.equal(run("text-line-includes-filter","error\n---\ninfo\nERROR found\nwarning"),"ERROR found");
 assert.equal(run("text-line-excludes-filter","debug\n---\ndebug row\nnormal row"),"normal row");
 assert.equal(run("text-between-delimiters-extractor","[|]\n---\n[a] [b]"),"a\nb");
 assert.equal(run("duplicate-sentence-remover","One. Two! One."),"One. Two!");
 assert.match(run("sentence-alphabetical-sorter","Zebra. Apple."),/^Apple.\nZebra./);
 assert.match(run("markdown-link-extractor","[A](https://example.com)"),/https:\/\/example.com/);
 assert.match(run("markdown-heading-outline-generator","# Main\n## Sub"),/Main\n  Sub/);
 const fence=String.fromCharCode(96).repeat(3);
 assert.match(run("markdown-code-block-extractor",fence+"js\nconst a=1;\n"+fence),/const a=1/);
 assert.match(run("markdown-checklist-progress-calculator","- [x] A\n- [ ] B"),/Progress: 50.0%/);
 assert.match(run("markdown-special-character-escaper","*hello*"),/\\\*hello\\\*/);
});

test("CSV and JSON transforms handle nontrivial values and protect markup",()=>{
 assert.match(run("csv-to-tsv",'name,score\n"A, Jr.",12'),/name\tscore/);
 assert.match(run("csv-to-html-table","item\n<img src=x onerror=alert(1)>"),/&lt;img/);
 assert.equal(run("csv-header-renamer","name|full_name\n---\nname,age\nAda,33"),"full_name,age\nAda,33");
 assert.equal(run("csv-column-reorder","age,name\n---\nname,age\nAda,33"),"age,name\n33,Ada");
 assert.equal(run("csv-row-numberer","name,age\nAda,33"),"row_number,name,age\n1,Ada,33");
 assert.match(run("json-to-typescript-type",'{"ok":true,"age":33}'),/"ok": boolean/);
 assert.equal(run("json-pointer-lookup",'/user/name\n---\n{"user":{"name":"Ada"}}'),'"Ada"');
 assert.deepEqual(JSON.parse(run("json-deep-merge",'{"a":{"x":1}}\n---\n{"a":{"y":2}}')),{a:{x:1,y:2}});
 assert.deepEqual(new URLSearchParams(run("json-to-url-query-parameters",'{"tags":["a","b"]}')).getAll("tags"),["a","b"]);
 assert.throws(()=>run("json-pointer-lookup",'/missing\n---\n{"a":1}'),/not found/);
});

test("Calendar tools preserve UTC dates and clearly defined overlap boundaries",()=>{
 assert.equal(run("day-of-week-finder","2026-11-16"),"Monday");
 assert.equal(run("days-in-month-calculator","2028-02"),"29 days");
 assert.equal(run("date-range-list-generator","2026-11-16, 2026-11-18").split("\n").length,3);
 assert.match(run("date-range-overlap-checker","2026-11-01, 2026-11-15\n---\n2026-11-15, 2026-11-20"),/Overlap: 2026-11-15/);
 assert.equal(run("next-weekday-calculator","2026-11-16, Friday"),"2026-11-20");
 assert.match(run("add-business-days-calculator","2026-11-16, 10"),/^2026-11-30/);
 assert.equal(run("quarter-of-year-finder","2026-11-16"),"Q4 2026");
 assert.equal(run("month-end-date-calculator","2028-02"),"2028-02-29");
 assert.deepEqual(run("time-slot-generator","09:00, 11:00, 30").split("\n"),["09:00","09:30","10:00","10:30"]);
 assert.equal(run("time-interval-overlap-checker","09:00, 10:00\n---\n10:00, 11:00"),"No overlap.");
});

test("Math uses exact integer arithmetic, validated denominators and stable formulas",()=>{
 assert.match(run("quartile-calculator","1,3,5,7,9,11,13"),/Q1: 3/);
 assert.match(run("percentile-calculator","90\n---\n1,2,3,4,5,6,7,8,9,10"),/^9.1/);
 assert.match(run("variance-calculator","2,4,4,4,5,5,7,9"),/Population variance: 4/);
 assert.equal(run("z-score-calculator","85,70,10"),"1.5");
 assert.equal(run("factorial-calculator","12"),"479001600");
 assert.equal(run("permutation-calculator","10,3"),"720");
 assert.equal(run("combination-calculator","10,3"),"120");
 assert.match(run("quadratic-equation-solver","1,-3,2"),/Two real roots/);
 assert.equal(run("pythagorean-theorem-calculator","3,4"),"Hypotenuse: 5");
 assert.throws(()=>run("factorial-calculator","501"),/0 to 500/);
});

test("Marketing and website results are meaningful and reject invalid options",()=>{
 assert.equal(run("click-through-rate-calculator","120,10000"),"1.2% CTR");
 assert.equal(run("cost-per-click-calculator","150,75"),"2 currency units per click");
 assert.equal(run("cost-per-mille-calculator","50,25000"),"2 currency units per 1,000 impressions");
 assert.equal(run("return-on-ad-spend-calculator","1200,300"),"4x ROAS");
 assert.equal(run("customer-acquisition-cost-calculator","2500,50"),"50 currency units per acquired customer");
 assert.match(run("customer-lifetime-value-calculator","40,12,24"),/11520/);
 assert.equal(run("churn-rate-calculator","150,3000"),"5% churn");
 assert.equal(run("landing-page-conversion-rate-calculator","35,1400"),"2.5% goal completions per visit");
 assert.match(run("http-header-analyzer","Content-Type: text/html\nCache-Control: max-age=500"),/max-age=500/);
 assert.match(run("dmarc-record-generator","reject,100,mailto:dmarc@example.com"),/v=DMARC1; p=reject; pct=100/);
 assert.throws(()=>run("dmarc-record-generator","reject,101,mailto:a@example.com"),/Percentage/);
});

test("First 189 distinct tools publish at ten per Monday for 19 weeks",()=>{
 const phase=queue.filter(x=>x.batch<=3),weeks=Math.ceil(phase.length/10);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave3-dedup-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(phase));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  for(let i=0;i<weeks;i++){
   const result=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+i*7,2))});
   assert.equal(result.released.length,Math.min(10,phase.length-i*10),"week "+(i+1));
  }
  const out=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(out.published,phase.map(x=>x.slug));
  assert.equal(out.history.length,weeks);
  assert.equal(out.published[phase.findIndex(x=>x.batch===3)],"text-line-includes-filter");
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test("New engines use no uploads, network calls, or arbitrary code execution",()=>{
 for(const p of ["wave3Text","wave3Data","wave3Dates","wave3Math","wave3Web"]){
  const src=fs.readFileSync("src/lib/"+p+".mjs","utf8");
  assert.doesNotMatch(src,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(src,/type="file"/);
 }
});
