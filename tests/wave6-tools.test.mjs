import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { w6Text } from "../src/lib/wave6Text.mjs";
import { w6Time } from "../src/lib/wave6Time.mjs";
import { w6Probability } from "../src/lib/wave6Probability.mjs";
import { w6Math } from "../src/lib/wave6Math.mjs";
import { w6Finance } from "../src/lib/wave6Finance.mjs";
import { w6Business } from "../src/lib/wave6Business.mjs";
import { w6CsvTools } from "../src/lib/wave6Csv.mjs";
import { w6ConfigTools } from "../src/lib/wave6Config.mjs";
import { w6WebTools } from "../src/lib/wave6Web.mjs";
import { w6Network } from "../src/lib/wave6Network.mjs";
import { releaseSimpleTools } from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave6ToolGuides.json" with {type:"json"};

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const tools=queue.filter(x=>x.batch===6);
const engines=[w6Text,w6Time,w6Probability,w6Math,w6Finance,w6Business,w6CsvTools,w6ConfigTools,w6WebTools,w6Network];
const run=(slug,input)=>{for(const fn of engines){const output=fn(slug,input);if(output!==null)return output;}return null;};
const browserOnly=new Set(["social-meta-tag-auditor","html-table-accessibility-checker"]);

test("All 100 wave-six tools have unique slugs, real implementations, detailed examples and no forbidden categories",()=>{
 assert.equal(queue.length,773);
 assert.equal(tools.length,100);
 assert.equal(Object.keys(guides).length,100);
 assert.equal(new Set(queue.map(x=>x.slug)).size,773);
 assert.equal(queue[373].slug,"text-template-variable-filler");
 assert.equal(queue.filter(x=>x.batch===6).at(-1).slug,"dns-srv-record-generator");
 const priorSlugs=fs.readFileSync("src/data/tools.ts","utf8").match(/(?:slug|"slug")\s*:\s*"([^"]+)"/g)||[];
 assert.equal(priorSlugs.length,123);
 const audit=JSON.parse(fs.readFileSync("src/data/toolFunctionalAudit.json","utf8"));
 for(const entry of audit.retired)assert.ok(!queue.some(x=>x.slug===entry.slug),"Retired duplicate reintroduced");
 const source=["Text","Time","Probability","Math","Finance","Business","Csv","Config","Web","Network"].map(n=>fs.readFileSync("src/lib/wave6"+n+".mjs","utf8")).join("\n");
 for(const item of tools){
  assert.ok(item.ready,item.slug+" not ready");
  assert.ok(item.week>=38&&item.week<=48,item.slug+" week");
  assert.ok(item.metaDescription.length>=65&&item.metaDescription.length<=180,item.slug+" SEO meta");
  assert.equal(guides[item.slug]?.example,item.example,item.slug+" guide mismatch");
  assert.ok(guides[item.slug]?.limitation.length>20,item.slug+" missing limitation");
  assert.doesNotMatch(item.slug,/(?:^|-)pdf(?:-|$)|(?:^|-)image(?:-|$)|(?:^|-)upload(?:-|$)|(?:^|-)file(?:-|$)/);
  assert.ok(source.includes('case "'+item.slug+'"'),item.slug+" no case implementation");
  if(browserOnly.has(item.slug))continue;
  const result=run(item.slug,item.example);
  assert.equal(typeof result,"string",item.slug+" must output string");
  assert.ok(result.trim().length>0,item.slug+" empty sample output");
 }
});

test("Text algorithms distinguish data and enforce practical input limits",()=>{
 assert.equal(run("text-template-variable-filler",'{"name":"Ada"}\n---\nHello {{name}}!'),"Hello Ada!");
 assert.equal(run("anagram-checker","listen\n---\nsilent"),"Anagrams: yes");
 assert.match(run("pangram-checker","The quick brown fox jumps over the lazy dog"),/Pangram: Yes/);
 assert.match(run("text-similarity-metrics-calculator","kitten\n---\nsitting"),/Levenshtein distance: 3/);
 assert.match(run("english-filler-phrase-finder","Basically I actually agree."),/basically: 1/);
 assert.equal(run("bracket-balance-validator","([{}])"),"Balanced brackets.");
 assert.match(run("bracket-balance-validator","([)]"),/Mismatch/);
 assert.equal(run("smart-quote-normalizer","“Hi” ‘Ada’"),'"Hi" \'Ada\'');
 assert.match(run("nato-phonetic-alphabet-translator","SOS"),/Sierra Oscar Sierra/);
 assert.equal(run("a1z26-cipher-translator","8-5-12-12-15"),"HELLO");
 assert.equal(run("british-american-spelling-converter","US\n---\nThe colour is grey."),"The color is gray.");
 assert.throws(()=>run("text-similarity-metrics-calculator","x".repeat(3001)+"\n---\nsmall"),/3000/);
});

test("Time scheduling calculators detect appointment overlaps and fiscal periods",()=>{
 assert.match(run("monthly-nth-weekday-schedule-generator","2027-01|2|2|Monday"),/2027-01-11/);
 assert.match(run("fiscal-year-period-calculator","2026-11-16|4"),/Fiscal quarter: Q3/);
 assert.match(run("timezone-meeting-window-finder","2026-11-20|09:00|18:00\n---\nAsia/Ho_Chi_Minh\nEurope/London"),/Asia\/Ho_Chi_Minh/);
 assert.match(run("shift-rotation-planner","2026-11-16|7|4|2"),/2026-11-20 — Off/);
 assert.match(run("business-hours-between-dates-calculator","2026-11-16T09:00|2026-11-16T17:00|09:00|17:00"),/Working hours: 8/);
 assert.match(run("daylight-saving-transition-finder","America/New_York|2027"),/UTC:/);
 assert.match(run("icalendar-rrule-validator","FREQ=WEEKLY;BYDAY=MO,WE"),/Valid supported RRULE/);
 assert.match(run("multiple-appointment-conflict-detector","09:00,10:00\n09:30,11:00"),/overlap/);
 assert.match(run("calendar-free-slot-finder","09:00|10:30|30\n---\n09:30,10:00"),/09:00–09:30/);
 assert.match(run("ambiguous-date-format-checker","03/04/2026"),/Ambiguous/);
 assert.throws(()=>run("icalendar-rrule-validator","FREQ=INVALID"),/FREQ/);
});

test("Probability functions match standard mathematical identities",()=>{
 assert.match(run("binomial-probability-calculator","10|5|0.5"),/0.24609375/);
 assert.match(run("poisson-probability-calculator","0|0"),/1/);
 assert.match(run("hypergeometric-probability-calculator","20|7|5|2"),/P\(X=2\)/);
 assert.match(run("normal-distribution-probability-calculator","0|1|-1|1"),/0.6826/);
 assert.match(run("bayes-theorem-calculator","0.5|1|0"),/Posterior probability: 1/);
 assert.match(run("proportion-confidence-interval-calculator","80|100|0.95"),/Wilson 95%/);
 assert.match(run("proportion-sample-size-calculator","0.5|0.05|0.95"),/385/);
 assert.match(run("chi-square-goodness-of-fit-calculator","10,20,30\n---\n15,15,30"),/Degrees of freedom: 2/);
 assert.match(run("probability-odds-converter","0.25"),/0.333333/);
 assert.equal(run("random-sample-without-replacement","2\n---\na\nb\nc").split("\n").length,2);
 assert.throws(()=>run("bayes-theorem-calculator","0.5|0|0"),/zero/);
});

test("Math, modular arithmetic and geometry produce valid results",()=>{
 assert.match(run("logarithm-calculator","1000|10"),/= 3/);
 assert.match(run("modular-arithmetic-toolkit","pow|7|20|13"),/Result mod 13: 3/);
 assert.equal(run("matrix-multiplication-calculator","1,2;3,4\n---\n5,6;7,8"),"19,22\n43,50");
 assert.equal(run("matrix-determinant-calculator","1,2;3,4"),"Determinant: -2");
 assert.match(run("vector-angle-calculator","1,0\n---\n0,1"),/Angle: 90°/);
 assert.match(run("haversine-distance-calculator","0,0\n---\n0,0"),/0 km/);
 assert.match(run("triangle-angle-solver","3|4|5"),/90.000000°/);
 assert.match(run("integer-divisor-finder","28"),/1, 2, 4, 7, 14, 28/);
 assert.match(run("prime-range-generator","10|20"),/11, 13, 17, 19/);
 assert.equal(run("number-to-english-words-converter","12345"),"twelve thousand three hundred forty-five");
 assert.throws(()=>run("matrix-multiplication-calculator","1,2\n---\n1,2"),/dimensions/);
});

test("Financial tools provide correct rates, cash-flow tables and assumptions",()=>{
 assert.match(run("effective-annual-rate-calculator","0.12|12"),/12.682503%/);
 assert.match(run("debt-repayment-strategy-planner","1000|0.1|100\n500|0.2|50\n---\n100"),/Snowball:/);
 assert.match(run("mortgage-refinance-break-even-calculator","250000|0.065|0.0525|3000|300"),/break-even/);
 assert.equal(run("debt-to-income-ratio-calculator","1800|6000"),"Debt-to-income ratio: 30.00%");
 assert.match(run("fire-target-calculator","40000|0.04"),/1,000,000.00/);
 assert.match(run("savings-withdrawal-runway-simulator","1000|100|0"),/10/);
 assert.match(run("asset-depreciation-schedule-generator","12000|2000|5"),/Book Value/);
 assert.match(run("invoice-late-fee-calculator","1000|0.015|30"),/15.00/);
 assert.match(run("subscription-proration-calculator","30|10|30"),/10.00/);
 assert.match(run("rent-versus-buy-cost-comparator","300000|1200|10|0.03|0.01|0.05"),/Rent cash cost:/);
});

test("Business metric tools aggregate deals and inventory correctly",()=>{
 assert.equal(run("inventory-reorder-point-calculator","40|7|100"),"Reorder point: 380 units");
 assert.match(run("saas-revenue-retention-calculator","10000|800|400|600"),/Net revenue retention: 94%/);
 assert.match(run("business-cash-burn-runway-calculator","150000|22000|10000"),/12.5 months/);
 assert.match(run("economic-order-quantity-calculator","12000|50|2"),/774.5967/);
 assert.match(run("abc-inventory-classifier","A,100,20\nB,50,5\nC,20,2"),/A \| A/);
 assert.equal(run("cash-conversion-cycle-calculator","45|30|20").split("\n")[0],"Cash conversion cycle: 55 days");
 assert.match(run("weighted-sales-pipeline-forecast-calculator","Deal A|20000|0.4\nDeal B|50000|0.2"),/18,000/);
 assert.match(run("sales-funnel-dropoff-analyzer","1000|500|250"),/50%/);
 assert.match(run("tiered-commission-calculator","150000\n---\n50000,0.04\n100000,0.07\nInfinity,0.1"),/10,500/);
 assert.match(run("price-elasticity-of-demand-calculator","10|100|12|85"),/Arc price elasticity:/);
});

test("CSV utilities preserve headers and report differences between keyed rows",()=>{
 assert.equal(run("csv-join-by-key","id\n---\nid,name\n1,Ada\n2,Bob\n---\nid,score\n1,90"),"id,name,score\n1,Ada,90\n2,Bob,");
 assert.match(run("csv-group-by-aggregator","region|sum|value\n---\nregion,value\nA,2\nA,3"),/A,5/);
 assert.match(run("csv-pivot-table-builder","region|product|price\n---\nregion,product,price\nA,X,2\nB,Y,3"),/A,2,0/);
 assert.match(run("csv-unpivot-table-converter","id\n---\nid,a,b\n1,2,3"),/1,b,3/);
 assert.match(run("csv-data-type-profiler","a,b\n1,true\n2,false"),/a: integer/);
 assert.match(run("csv-composite-key-validator","a,b\n---\na,b\n1,2\n1,2"),/Data rows 1 and 2/);
 assert.match(run("csv-keyed-row-diff","id\n---\nid,name\n1,A\n---\nid,name\n1,B"),/Changed: 1/);
 assert.equal(run("csv-conditional-column-builder","status|paid|==|yes|1|0\n---\nstatus\nyes\nno"),"status,paid\nyes,1\nno,0");
 assert.match(run("csv-formula-injection-sanitizer","a,b\nA,=SUM(1+1)"),/A,'=SUM/);
 assert.match(run("csv-numeric-histogram-generator","x|2\n---\nx\n1\n2\n3"),/\[1, 2\)/);
 assert.throws(()=>run("csv-join-by-key","id\n---\nid,name\n1,A\n---\nid,score\n1,1\n1,2"),/not unique/);
});

test("JSON schema, Patch and configuration parsers work without executing input",()=>{
 assert.match(run("json-schema-generator",'{"name":"Ada"}'),/\"required\"/);
 assert.match(run("json-schema-validator",'{"type":"object","required":["a"]}\n---\n{"a":1}'),/Valid against/);
 assert.match(run("json-schema-validator",'{"type":"object","required":["a"]}\n---\n{}'),/missing property/);
 assert.match(run("json-patch-generator",'{"a":1}\n---\n{"a":2}'),/\"replace\"/);
 assert.deepEqual(JSON.parse(run("json-patch-applier",'{"a":1}\n---\n[{"op":"replace","path":"/a","value":2}]')),{a:2});
 assert.deepEqual(JSON.parse(run("jsonpath-query-evaluator",'$.items[*].name\n---\n{"items":[{"name":"A"},{"name":"B"}]}')),["A","B"]);
 assert.match(run("json-duplicate-key-detector",'{"a":1,"a":2}'),/Duplicate key at \/a/);
 assert.deepEqual(JSON.parse(run("toml-to-json-converter",'title = "One"\n[server]\nport = 8080')),{title:"One",server:{port:8080}});
 assert.deepEqual(JSON.parse(run("ini-to-json-converter",'[server]\nhost = localhost')),{server:{host:"localhost"}});
 assert.match(run("dotenv-syntax-validator","PORT=8080\nDEBUG=true"),/Valid basic dotenv/);
 assert.match(run("json-to-sql-insert-generator",'users\n---\n[{"id":1,"name":"O\'Brien"}]'),/O''Brien/);
 assert.throws(()=>run("json-patch-applier",'{"a":1}\n---\n[{"op":"replace","path":"/__proto__","value":1}]'),/Unsafe/);
});

test("Web and security text checks detect common issues",()=>{
 assert.match(run("json-ld-structured-data-validator",'{"@context":"https://schema.org","@type":"Person","name":"Ada"}'),/Valid basic JSON-LD/);
 assert.match(run("hreflang-reciprocity-checker","https://a.test/en|en|https://a.test/fr"),/Missing reciprocal/);
 assert.match(run("redirect-loop-detector","/a|/b\n/b|/a"),/a/);
 assert.match(run("csp-url-allowlist-tester","default-src 'self'; img-src https://img.test\n---\nimg-src|https://img.test/a.png|https://app.test"),/Allowed/);
 assert.match(run("cors-preflight-response-tester","https://app.test|POST|X-Token\n---\nAccess-Control-Allow-Origin: https://app.test\nAccess-Control-Allow-Methods: POST\nAccess-Control-Allow-Headers: X-Token"),/accepted/);
 assert.match(run("dmarc-record-validator","v=DMARC1; p=reject; pct=100"),/Valid common DMARC/);
 assert.match(run("dkim-txt-record-inspector","v=DKIM1; k=rsa; p=MIIBIjANBgkq"),/Algorithm: rsa/);
 assert.match(run("robots-txt-rule-conflict-finder","User-agent: *\nAllow: /private\nDisallow: /private"),/Conflicting/);
});

test("IPv6 DNS checksum and identifier tools validate real formats",()=>{
 assert.match(run("ipv6-compression-expansion-converter","2001:0db8:0000:0000:0000:ff00:0042:8329"),/2001:db8::ff00:42:8329/);
 assert.match(run("ipv6-cidr-membership-checker","2001:db8::1\n---\n2001:db8::/32"),/Inside/);
 assert.match(run("mac-address-validator-normalizer","AA-BB-CC-DD-EE-FF"),/AA:BB:CC:DD:EE:FF/);
 assert.match(run("ip-address-type-classifier","192.168.1.1"),/Private/);
 assert.match(run("ip-address-type-classifier","fe80::1"),/Link local/);
 assert.match(run("ip-address-type-classifier","ff02::1"),/Multicast/);
 assert.match(run("ip-address-type-classifier","fc00::1"),/Unique local/);
 assert.equal(run("reverse-dns-pointer-generator","192.0.2.15"),"15.2.0.192.in-addr.arpa");
 assert.match(run("luhn-check-digit-toolkit","7992739871"),/Check digit to append: 3/);
 assert.match(run("isbn-10-and-13-validator","9780306406157"),/valid/);
 assert.match(run("iban-checksum-validator","GB82 WEST 1234 5698 7654 32"),/Valid IBAN/);
 assert.match(run("dns-caa-record-generator","example.com|issue|letsencrypt.org"),/IN CAA 0 issue/);
 assert.match(run("dns-srv-record-generator","_sip._tcp.example.com|10|5|5060|sip.example.com"),/IN SRV 10 5 5060/);
 assert.throws(()=>run("ipv6-cidr-membership-checker","2001:db8::1\n---\n2001:db8::/129"),/0–128/);
});

test("Publication preserves old order and simulates 473 tools in 48 Monday releases",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave6-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(queue));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  const phase=queue.filter(x=>x.batch<=6);
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(phase));
  const weeks=Math.ceil(phase.length/10);
  assert.equal(weeks,48);
  for(let i=0;i<weeks;i++){
   const r=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+i*7,2))});
   assert.equal(r.released.length,Math.min(10,phase.length-i*10));
  }
  const state=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(state.published,phase.map(x=>x.slug));
  assert.equal(state.history.length,48);
  assert.equal(state.history.at(-1).slugs.length,3);
  assert.equal(state.published[373],"text-template-variable-filler");
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test("All ten wave-six engines use no remote requests, file uploads or eval",()=>{
 for(const module of ["Text","Time","Probability","Math","Finance","Business","Csv","Config","Web","Network"]){
  const code=fs.readFileSync("src/lib/wave6"+module+".mjs","utf8");
  assert.doesNotMatch(code,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 }
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 for(const name of ["w6Text","w6Time","w6Probability","w6Math","w6Finance","w6Business","w6CsvTools","w6ConfigTools","w6WebTools","w6Network"])
  assert.ok(workspace.includes(name+"(mode,content)"),name+" not mounted");
});
