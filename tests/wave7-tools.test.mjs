import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { w7Text } from "../src/lib/wave7Text.mjs";
import { w7Markdown } from "../src/lib/wave7Markdown.mjs";
import { w7CsvQuality } from "../src/lib/wave7CsvQuality.mjs";
import { w7CsvAnalytics } from "../src/lib/wave7CsvAnalytics.mjs";
import { w7JsonTools } from "../src/lib/wave7Json.mjs";
import { w7Stats } from "../src/lib/wave7Stats.mjs";
import { w7Math } from "../src/lib/wave7Math.mjs";
import { w7Business } from "../src/lib/wave7Business.mjs";
import { w7Schedule } from "../src/lib/wave7Schedule.mjs";
import { w7Web } from "../src/lib/wave7Web.mjs";
import { releaseSimpleTools } from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave7ToolGuides.json" with {type:"json"};
const engines=[w7Text,w7Markdown,w7CsvQuality,w7CsvAnalytics,w7JsonTools,w7Stats,w7Math,w7Business,w7Schedule,w7Web];
const run=(slug,input)=>{for(const fn of engines){const v=fn(slug,input);if(v!==null)return v;}throw Error("No engine for "+slug);};
const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8")),latest=queue.filter(x=>x.batch===7);
const browserOnly=new Set(["html-landmark-accessibility-auditor"]);
test("100 unique tools are queued, have complete metadata and produce real output from samples",()=>{
 assert.equal(queue.length,968);
 assert.equal(latest.length,100);
 assert.equal(Object.keys(guides).length,100);
 assert.equal(new Set(queue.map(x=>x.slug)).size,968);
 assert.equal(queue[473].slug,"common-prefix-finder");
 assert.equal(queue.filter(x=>x.batch===7).at(-1).slug,"network-port-range-merger");
 const publicCount=[...fs.readFileSync("src/data/tools.ts","utf8").matchAll(/(?:slug|"slug")\s*:\s*"([^"]+)"/g)].length;
 assert.equal(publicCount,123);
 const sources=["Text","Markdown","CsvQuality","CsvAnalytics","Json","Stats","Math","Business","Schedule","Web"].map(x=>fs.readFileSync("src/lib/wave7"+x+".mjs","utf8")).join("\n");
 const all=new Set(queue.map(x=>x.slug));
 for(const t of JSON.parse(fs.readFileSync("src/data/toolFunctionalAudit.json","utf8")).retired)assert.ok(!all.has(t.slug),"Retired duplicate "+t.slug);
 for(const t of latest){
  assert.equal(t.example,guides[t.slug]?.example,t.slug+" guide example mismatch");
  assert.ok(t.ready&&t.week>=48&&t.week<=58,t.slug+" scheduling error");
  assert.ok(t.metaDescription.length>60&&t.metaDescription.length<=180,t.slug+" SEO description");
  assert.ok(guides[t.slug]?.limitation.length>=40,t.slug+" missing limits");
  assert.ok(sources.includes('case "'+t.slug+'"'),"Unimplemented case "+t.slug);
  assert.doesNotMatch(t.slug,/(?:^|-)(?:pdf|image|upload|file|barcode)(?:-|$)/i);
  if(browserOnly.has(t.slug))continue;
  const output=run(t.slug,t.example);
  assert.equal(typeof output,"string",t.slug+" output not a string");
  assert.ok(output.trim(),t.slug+" blank sample output");
 }
});
test("Text, Markdown and Unicode algorithms return correct results",()=>{
 assert.match(run("common-prefix-finder","international\n---\ninterstellar"),/inter/);
 assert.match(run("common-suffix-finder","generation\n---\noperation"),/ation/);
 assert.match(run("longest-common-subsequence-finder","ABCBDAB\n---\nBDCABA"),/\(4\)/);
 assert.match(run("longest-common-substring-finder","pineapple\n---\nsnapple"),/apple/);
 assert.match(run("jaccard-word-set-similarity","cat dog bird\n---\ndog bird fish"),/0.5/);
 assert.match(run("dice-character-bigram-similarity","abc\n---\nabc"),/similarity: 1/);
 assert.match(run("text-shannon-entropy-calculator","aaaa"),/0 bits/);
 assert.match(run("unicode-normalization-comparator","e\u0301\n---\né"),/NFC: equal/);
 assert.match(run("unicode-grapheme-cluster-inspector","👩‍💻"),/clusters: 1/);
 assert.match(run("mixed-script-text-detector","hello раypal"),/Cyrillic/);
 assert.match(run("soundex-name-comparator","Robert\n---\nRupert"),/match: yes/);
 assert.match(run("markdown-broken-anchor-finder","# Existing\n[broken](#not-here)"),/#not-here/);
 assert.match(run("markdown-duplicate-heading-slug-detector","# Intro\n## Intro"),/2 headings/);
 assert.match(run("text-case-consistency-reporter","Hello hello"),/Hello/);
 assert.match(run("acronym-definition-extractor","Search Engine Optimization (SEO)"),/SEO/);
});
test("CSV integrity, statistical transformations and JSON Merge Patch have distinct behavior",()=>{
 assert.match(run("csv-foreign-key-validator","id\n---\nid\nA\nB\n---\nid\nA"),/B/);
 assert.match(run("csv-column-regex-validator","email|^[^@]+@[^@]+$\n---\nemail\nbad"),/Row 2/);
 assert.match(run("csv-date-column-validator","date\n---\ndate\n2026-02-30"),/Invalid dates/);
 assert.match(run("csv-numeric-range-validator","score|0|100\n---\nscore\n120"),/Out of range/);
 assert.match(run("csv-cross-column-comparison-validator","a|<=|b\n---\na,b\n3,2"),/false/);
 assert.match(run("csv-header-case-collision-detector","Name,name\nA,B"),/Name vs name/);
 assert.equal(run("csv-null-token-normalizer","N/A|NULL\n---\na,b\nN/A,NULL"),"a,b\n,");
 assert.match(run("csv-rolling-average-column","v|2\n---\nv\n2\n4"),/3/);
 assert.match(run("csv-cumulative-sum-column","v\n---\nv\n2\n4"),/6/);
 assert.match(run("csv-correlation-matrix","a,b\n1,2\n2,4\n3,6"),/1/);
 assert.match(run("csv-numeric-z-score-reporter","v|1\n---\nv\n1\n1\n1\n10"),/CSV row 5/);
 assert.deepEqual(JSON.parse(run("json-merge-patch-generator",'{"a":1}\n---\n{"a":2}')),{a:2});
 assert.deepEqual(JSON.parse(run("json-merge-patch-applier",'{"a":1}\n---\n{"a":2}')),{a:2});
 assert.deepEqual(JSON.parse(run("json-path-redactor",'/a\n---\n{"a":"private"}')),{a:"[REDACTED]"});
 assert.match(run("json-unsafe-number-literal-detector",'{"x":9007199254740993}'),/9007199254740993/);
 assert.match(run("json-object-schema-drift-report",'{"a":1}\n---\n{"a":"1"}'),/Type changed/);
});
test("Probability, matrix math and business metrics use actual formulas",()=>{
 assert.match(run("geometric-distribution-probability-calculator","0.5|2"),/0.25/);
 assert.match(run("negative-binomial-probability-calculator","2|3|0.5"),/0.25/);
 assert.match(run("exponential-distribution-probability-calculator","1|0|1"),/0.632/);
 assert.match(run("weibull-survival-probability-calculator","2|10|0"),/1/);
 assert.match(run("spearman-rank-correlation-calculator","1,2,3\n---\n1,2,3"),/rho: 1/);
 assert.match(run("kendall-rank-correlation-calculator","1,2,3\n---\n1,2,3"),/tau-b: 1/);
 assert.match(run("cohen-d-effect-size-calculator","5|1|10|4|1|10"),/d: 1/);
 assert.match(run("weighted-median-calculator","1,1\n2,5\n10,1"),/median: 2/);
 assert.match(run("matrix-inverse-calculator","4,7;2,6"),/0.6/);
 assert.match(run("matrix-rank-calculator","1,2;2,4"),/rank: 1/);
 assert.match(run("linear-equation-system-solver","2,1|5\n1,-1|1"),/x1 = 2/);
 assert.match(run("euclidean-vector-distance-calculator","0,0\n---\n3,4"),/distance: 5/);
 assert.match(run("polygon-shoelace-area-calculator","0,0\n4,0\n4,3\n0,3"),/area: 12/);
 assert.match(run("point-in-polygon-tester","2,1\n---\n0,0\n4,0\n4,3\n0,3"),/inside/);
 assert.match(run("compound-annual-growth-rate-calculator","100|121|2"),/10%/);
 assert.match(run("net-promoter-score-calculator","30|50|20"),/score: 10/);
 assert.match(run("saas-rule-of-forty-calculator","0.25|0.18"),/43%/);
 assert.match(run("customer-acquisition-payback-calculator","400|50|0.8"),/10 months/);
 assert.match(run("forecast-mean-absolute-percentage-error","100,100\n---\n110,90"),/10%/);
});
test("Scheduling and networking preserve dates, financial units, and CIDR behavior",()=>{
 assert.match(run("project-critical-path-calculator","A|3|\nB|2|A\nC|4|A\nD|1|B,C"),/A → C → D/);
 assert.match(run("biweekly-pay-period-generator","2026-11-16|1"),/2026-11-29/);
 assert.match(run("nth-business-day-of-month-finder","2026-11|5"),/2026-11-06/);
 assert.match(run("overnight-shift-wage-calculator","22:00|06:00|18|1.5|00:00|06:00"),/198/);
 assert.match(run("meeting-attendee-cost-calculator","60\n---\n2|45\n1|80"),/170/);
 assert.match(run("date-range-gap-finder","2026-11-01|2026-11-10\n---\n2026-11-03|2026-11-06"),/2026-11-01 to 2026-11-02/);
 assert.match(run("cron-next-runs-calculator","0 9 * * 1\n---\n2026-11-16T00:00"),/2026-11-16T09:00 UTC/);
 assert.match(run("fiscal-quarter-boundary-finder","2026-11-17|4"),/2026-10-01/);
 assert.match(run("calendar-event-ics-text-builder","2026-12-01T09:00|2026-12-01T10:00|Hello|Hi"),/BEGIN:VEVENT/);
 assert.match(run("http-accept-header-quality-parser","text/html;q=0.8, application/json"),/^application\/json;q=1/);
 assert.match(run("http-cache-freshness-evaluator","max-age=3600|1200|100"),/fresh/);
 assert.match(run("http-conditional-etag-tester",'W/"abc"|W/"abc"|GET'),/304/);
 assert.match(run("http-range-request-parser","bytes=0-499|2000"),/500 bytes/);
 assert.match(run("css-variable-dependency-resolver","--a: red;\n--b: var(--a);"),/--b: red/);
 assert.match(run("ipv4-cidr-overlap-checker","192.168.1.0/24\n---\n192.168.1.128/25"),/overlap/);
 assert.match(run("ipv4-range-to-cidr-calculator","192.168.1.0|192.168.1.255"),/192.168.1.0\/24/);
 assert.equal(run("network-port-range-merger","80,443,1000-1005,1003-1010"),"80,443,1000-1010");
});
test("Release of 573 queued tools is strictly limited to 10 per Monday over 58 weeks",()=>{
 const phase=queue.filter(x=>x.batch<=7);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave7-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(phase));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  assert.equal(Math.ceil(phase.length/10),58);
  for(let i=0;i<58;i++){
   const out=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+i*7,2))});
   assert.equal(out.released.length,Math.min(10,phase.length-10*i),"week "+(i+1));
  }
  const state=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(state.published,phase.map(x=>x.slug));
  assert.equal(state.history.length,58);
  assert.equal(state.history.at(-1).slugs.length,3);
  assert.equal(state.published[473],"common-prefix-finder");
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test("All ten engines are offline and integrated without changing the SEO blog workflow",()=>{
 const modes=["Text","Markdown","CsvQuality","CsvAnalytics","Json","Stats","Math","Business","Schedule","Web"];
 for(const module of modes){
  const code=fs.readFileSync("src/lib/wave7"+module+".mjs","utf8");
  assert.doesNotMatch(code,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 }
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 for(const fn of ["w7Text","w7Markdown","w7CsvQuality","w7CsvAnalytics","w7JsonTools","w7Stats","w7Math","w7Business","w7Schedule","w7Web"])
  assert.ok(workspace.includes(fn+"(mode,content)"),fn+" dispatch is missing");
 const state=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
 assert.equal(state.startDate,"2026-11-23");
 assert.equal(state.weeklyLimit,10);
 assert.deepEqual(state.published,queue.slice(0,state.published.length).map(x=>x.slug));
 assert.match(fs.readFileSync(".github/workflows/publish-curated-guides.yml","utf8"),/blog:release/);
});