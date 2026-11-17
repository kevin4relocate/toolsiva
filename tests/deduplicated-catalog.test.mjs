import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { calcSimple } from "../src/lib/simpleToolMath.mjs";
import { runExtraData } from "../src/lib/extraDataEngine.mjs";
import { runExtraText } from "../src/lib/extraTextEngine.mjs";
import { thirdText } from "../src/lib/wave3Text.mjs";
import { web5 } from "../src/lib/wave3Web.mjs";
import { v4Validate } from "../src/lib/wave4WebValidators.mjs";

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const audit=JSON.parse(fs.readFileSync("src/data/toolFunctionalAudit.json","utf8"));
const state=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
const source=fs.readFileSync("src/data/tools.ts","utf8");
const publicSlugs=[...source.matchAll(/(?:["']slug["']|slug)\s*:\s*["']([^"']+)["']/g)].map(x=>x[1]);
const active=new Set([...publicSlugs,...queue.map(x=>x.slug)]);

test("Audit removes exactly 18 functional duplicates without touching 123 public tools",()=>{
 assert.equal(publicSlugs.length,123);
 assert.equal(queue.length,973);
 assert.equal(active.size,1096);
 assert.equal(audit.baseline.public,123);
 assert.equal(audit.baseline.queued,391);
 assert.equal(audit.after.queued,373);
 assert.equal(audit.after.total,496);
 assert.equal(audit.retired.length,18);
 assert.equal(new Set(audit.retired.map(x=>x.slug)).size,18);
 for(const entry of audit.retired){
  assert.ok(!active.has(entry.slug),"Retired tool remained available: "+entry.slug);
  assert.ok(active.has(entry.keptAs),"Canonical tool not available: "+entry.keptAs);
  assert.ok(entry.originalPosition>=1&&entry.originalPosition<=391);
 }
 assert.deepEqual(Object.fromEntries([1,2,3,4,5,6,7,8,9].map(n=>[n,queue.filter(x=>x.batch===n).length])),{1:89,2:50,3:50,4:97,5:87,6:100,7:100,8:100,9:100});
 const names=[...[...source.matchAll(/(?:slug|"slug")\s*:\s*"([^"]+)"[\s\S]{0,200}?(?:name|"name")\s*:\s*"([^"]+)"/g)].map(x=>x[2]),...queue.map(x=>x.name)];
 assert.equal(new Set(names.map(x=>x.toLowerCase().replace(/[^a-z0-9]+/g,""))).size,names.length);
});

test("Retired implementations and queued SEO guides cannot accidentally reactivate",()=>{
 const code=["simpleToolMath","wave4Text","wave5Text","wave5MarkdownData","wave5Web"].map(name=>fs.readFileSync("src/lib/"+name+".mjs","utf8")).join("\n");
 const guides=[JSON.parse(fs.readFileSync("src/data/wave4ToolGuides.json","utf8")),JSON.parse(fs.readFileSync("src/data/wave5ToolGuides.json","utf8"))];
 for(const entry of audit.retired){
  assert.ok(!code.includes('case "'+entry.slug+'"'),"Dead switch case: "+entry.slug);
  for(const guide of guides)assert.ok(!Object.hasOwn(guide,entry.slug),"Retired SEO guide: "+entry.slug);
 }
 assert.equal(Object.keys(guides[0]).length,97);
 assert.equal(Object.keys(guides[1]).length,87);
});

test("Canonical tools actually cover removed calculations and extraction functions",()=>{
 assert.equal(calcSimple("number-base-converter","101010,2,10"),"42");
 assert.equal(calcSimple("number-base-converter","2a,16,10"),"42");
 const csv=runExtraData("csv-column-statistics","price\n---\nname,price\nA,2\nB,4");
 assert.match(csv,/Mean: 3\.000/);
 assert.match(csv,/Min: 2/);
 assert.match(csv,/Max: 4/);
 assert.match(runExtraText("n-gram-generator","2\n---\nred apple red apple"),/red apple : 2/);
 assert.match(thirdText("markdown-link-extractor","[Docs](https://example.com)"),/Docs → https:\/\/example.com/);
 assert.match(web5("http-header-analyzer","X-A: 1\nx-a: 2"),/Duplicate headers: x-a \(2\)/);
 assert.match(v4Validate("spf-mechanism-inspector","v=spf1 include:mail.example.com -all"),/include:mail\.example\.com/);
 const publicText=fs.readFileSync("src/components/tools/TextToolWorkspace.astro","utf8");
 const publicHighValue=fs.readFileSync("public/highValueTools.js","utf8");
 const publicLines=fs.readFileSync("src/components/tools/NewTextToolsWorkspace.astro","utf8");
 assert.match(publicText,/option\?\.value==="words"/,"Reverse Text supports word order");
 assert.match(publicText,/Sentence case/,"Case Converter has sentence option");
 assert.match(publicHighValue,/snake_case: /);
 assert.match(publicHighValue,/kebab-case: /);
 assert.match(publicHighValue,/camelCase: /);
 assert.match(publicHighValue,/data-separator-mode/,"Remove Line Breaks supports custom delimiters");
 assert.match(publicLines,/mode === "add-prefix-suffix-to-lines"/);
 const punctuation=runExtraText("character-frequency-analyzer","Hi!!!");
 assert.match(punctuation,/"!" : 3/);
});

test("Retained near-overlap tools have documented differences and remain available",()=>{
 assert.ok(audit.keptDistinct.length>=10);
 for(const example of audit.keptDistinct){
  assert.ok(active.has(example.left),example.left+" missing");
  assert.ok(active.has(example.right),example.right+" missing");
  assert.ok(example.reason.length>=25);
  assert.notEqual(example.left,example.right);
 }
});

test("Weekly release cadence and SEO blog schedule remain consistent",()=>{
 assert.equal(state.startDate,"2026-11-23");
 assert.equal(state.weeklyLimit,10);
 assert.ok(Array.isArray(state.published));
 assert.deepEqual(state.published,queue.slice(0,state.published.length).map(x=>x.slug));
 assert.equal(new Set(state.published).size,state.published.length);
 assert.equal(queue.at(-1).week,98);
 for(let i=0;i<queue.length;i++)assert.equal(queue[i].week,Math.floor(i/10)+1,"week ordering at "+i);
 const toolWorkflow=fs.readFileSync(".github/workflows/publish-simple-tools.yml","utf8");
 const blogWorkflow=fs.readFileSync(".github/workflows/publish-curated-guides.yml","utf8");
 assert.match(toolWorkflow,/tools:release|release-simple-tools/);
 assert.match(blogWorkflow,/blog:release|release-curated-guide/);
});
