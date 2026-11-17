import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { w9Bio } from "../src/lib/wave9Bio.mjs";
import { w9Chem } from "../src/lib/wave9Chem.mjs";
import { w9Enc } from "../src/lib/wave9Enc.mjs";
import { w9Poly } from "../src/lib/wave9Poly.mjs";
import { w9Finance } from "../src/lib/wave9Finance.mjs";
import { w9Ops } from "../src/lib/wave9Ops.mjs";
import { w9Json } from "../src/lib/wave9Json.mjs";
import { w9Csv } from "../src/lib/wave9Csv.mjs";
import { w9Dev } from "../src/lib/wave9Dev.mjs";
import { w9Dates } from "../src/lib/wave9Dates.mjs";
import { releaseSimpleTools } from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave9ToolGuides.json" with {type:"json"};
const engines=[w9Bio,w9Chem,w9Enc,w9Poly,w9Finance,w9Ops,w9Json,w9Csv,w9Dev,w9Dates];
const run=(slug,input)=>{for(const handler of engines){const value=handler(slug,input);if(value!==null)return value;}throw Error("Missing engine "+slug);};
const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8")),wave=queue.filter(x=>x.batch===9);
test("100 new unique Wave 9 modes have real handlers, examples, SEO and privacy constraints",()=>{
 assert.equal(queue.length,973);
 assert.equal(wave.length,100);
 assert.equal(Object.keys(guides).length,100);
 assert.equal(queue[673].slug,"dna-reverse-complement-tool");
 assert.equal(wave.at(-1).slug,"annual-working-hours-estimator");
 assert.equal(new Set(queue.map(t=>t.slug)).size,973);
 const publicSlugs=[...fs.readFileSync("src/data/tools.ts","utf8").matchAll(/(?:slug|"slug")\s*:\s*"([^"]+)"/g)].map(x=>x[1]);
 assert.equal(publicSlugs.length,123);
 assert.equal(new Set([...queue.map(t=>t.slug),...publicSlugs]).size,1096);
 for(const retired of JSON.parse(fs.readFileSync("src/data/toolFunctionalAudit.json","utf8")).retired)assert.ok(!queue.some(x=>x.slug===retired.slug),"Retired duplicate reintroduced");
 const source=["Bio","Chem","Enc","Poly","Finance","Ops","Json","Csv","Dev","Dates"].map(n=>fs.readFileSync("src/lib/wave9"+n+".mjs","utf8")).join("\n");
 for(const tool of wave){
  assert.ok(tool.ready&&tool.week>=68&&tool.week<=88,tool.slug+" schedule");
  assert.ok(tool.metaDescription.length>60&&tool.metaDescription.length<=180,tool.slug+" metadata");
  assert.equal(tool.example,guides[tool.slug]?.example,tool.slug+" example mismatch");
  assert.ok(guides[tool.slug]?.limitation?.length>70,tool.slug+" missing limitation");
  assert.ok(source.includes('case "'+tool.slug+'"'),tool.slug+" no code implementation");
  assert.doesNotMatch(tool.slug,/(?:^|-)(?:pdf|file|upload|image|barcode|qr)(?:-|$)/i);
  const result=run(tool.slug,tool.example);
  assert.equal(typeof result,"string",tool.slug+" did not return text");
  assert.ok(result.trim().length>0,tool.slug+" did not return useful output");
 }
});
test("DNA FASTA protein and chemistry formulas have actual biological and chemical results",()=>{
 assert.match(run("dna-reverse-complement-tool","ATGC"),/GCAT/);
 assert.match(run("dna-gc-content-calculator","GGCCAA"),/66.666/);
 assert.match(run("dna-rna-transcription-converter","ATGCTT"),/AUGCUU/);
 assert.match(run("rna-codon-translator","AUGGCCUUUUAA"),/MAF\*/);
 assert.match(run("fasta-sequence-validator",">a\nACGT\n>b\nGG"),/records: 2/);
 assert.match(run("dna-motif-position-finder","ATATAT\n---\nATAT"),/1, 3/);
 assert.match(run("dna-oligo-melting-temperature-calculator","ATGCCGTA"),/24 °C/);
 assert.match(run("protein-amino-acid-composition","AACC"),/A: 2 \(50%/);
 assert.match(run("protein-molecular-weight-estimator","ACD"),/Da/);
 assert.match(run("dna-open-reading-frame-finder","ATGAAATAG"),/ORFs: 1/);
 assert.match(run("empirical-chemical-formula-calculator","C:40.0,H:6.7,O:53.3"),/CH2O/);
 assert.match(run("molecular-formula-mass-multiplier","CH2O|180.16"),/C6H12O6/);
 assert.match(run("limiting-reactant-mole-calculator","2|3|1|1"),/reactant 1/);
 assert.match(run("reaction-theoretical-yield-calculator","0.5|1|2|18.015"),/18.015 g/);
 assert.match(run("reaction-percent-yield-calculator","8|10"),/80%/);
 assert.match(run("solution-molality-calculator","0.5|2"),/0.25 mol\/kg/);
 assert.match(run("solution-mass-percent-calculator","15|85"),/15%/);
 assert.match(run("hydroxide-ion-poh-calculator","0.001"),/pOH: 3/);
 assert.match(run("henderson-hasselbalch-ph-calculator","4.76|0.2|0.1"),/Buffer pH:/);
 assert.match(run("osmotic-pressure-calculator","0.1|298.15|1"),/Pa/);
 assert.throws(()=>run("dna-rna-transcription-converter","ATJ"),/IUPAC/);
});
test("Encoders round-trip UTF-8 and calculate known checksums",()=>{
 for(const slug of ["base32-text-encoder-decoder","base58-text-encoder-decoder","ascii85-text-encoder-decoder","utf8-hex-encoder-decoder"]){
  const encoded=run(slug,"encode|Hello 🌎");
  assert.equal(run(slug,"decode|"+encoded),"Hello 🌎",slug+" UTF8 roundtrip");
 }
 assert.match(run("crc32-text-checksum","123456789"),/cbf43926/);
 assert.match(run("adler32-text-checksum","Wikipedia"),/11e60398/);
 assert.match(run("fnv1a-32-bit-hash","hello"),/4f9f2cab/);
 assert.match(run("djb2-string-hash","hello"),/djb2/i);
 assert.match(run("unicode-confusable-character-detector","раypal"),/homoglyphs/);
 assert.match(run("text-encoding-byte-size-comparator","🌎"),/UTF-8 bytes: 4/);
 assert.throws(()=>run("base32-text-encoder-decoder","decode|QQ$$"),/Base32/);
});
test("Polynomial and matrix solvers calculate actual algebraic properties",()=>{
 assert.match(run("polynomial-horner-evaluator","1,-3,2|5"),/12/);
 assert.match(run("polynomial-synthetic-division","1,-3,2|2"),/Remainder: 0/);
 assert.match(run("polynomial-derivative-coefficients","3,2,-1,5"),/9, 4, -1/);
 assert.match(run("polynomial-integral-coefficients","3,2,-1|4"),/1, 1, -1, 4/);
 assert.match(run("quadratic-vertex-calculator","1|-4|3"),/\(2, -1\)/);
 assert.match(run("cubic-real-roots-calculator","1|-6|11|-6"),/1, 2, 3/);
 assert.equal(run("matrix-trace-calculator","1,2;3,4"),"Matrix trace: 5");
 assert.match(run("matrix-transpose-calculator","1,2,3;4,5,6"),/1,4\n2,5\n3,6/);
 assert.match(run("matrix-frobenius-norm-calculator","3,4"),/5/);
 assert.match(run("two-by-two-matrix-eigenvalues","2,1;1,2"),/3/);
});
test("Irregular finance and process operations distinguish realistic formulas",()=>{
 assert.match(run("irregular-cash-flow-xnpv-calculator","0\n---\n2026-01-01|-100\n2027-01-01|120"),/20/);
 assert.match(run("irregular-cash-flow-xirr-calculator","2026-01-01|-100\n2027-01-01|110"),/10%/);
 assert.match(run("variable-deposit-savings-forecast","100|0\n---\n10,20"),/130/);
 assert.match(run("loan-amortization-table-generator","120|0|12"),/monthly payment: 10/i);
 assert.match(run("balloon-loan-payment-calculator","120|0|12|20"),/8.333333/);
 assert.match(run("bond-yield-to-maturity-calculator","950|1000|0.05|5|2"),/YTM/);
 assert.match(run("bond-convexity-calculator","1000|0.05|0.06|5|2"),/convexity/i);
 assert.match(run("bond-modified-duration-calculator","1000|0.05|0.06|5|2"),/duration/i);
 assert.match(run("loan-fee-adjusted-apr-calculator","10000|500|0.1|24"),/effective annual rate/);
 assert.match(run("double-declining-depreciation-schedule","10000|1000|5"),/year,depreciation,book_value/);
 assert.match(run("mm1-queue-waiting-time-calculator","5|8"),/62.5%/);
 assert.match(run("littles-law-work-in-progress-calculator","5|2"),/10 units/);
 assert.match(run("six-sigma-dpmo-calculator","10|1000|4"),/2500/);
 assert.match(run("process-capability-cp-calculator","90|110|4"),/0.833333/);
 assert.match(run("process-capability-cpk-calculator","90|110|100|4"),/0.833333/);
 assert.match(run("overall-equipment-effectiveness-calculator","1|1|1"),/100%/);
 assert.match(run("takt-time-calculator","480|240"),/2 minutes/);
 assert.match(run("first-pass-throughput-yield-calculator","95|100"),/95%/);
 assert.match(run("rolled-throughput-yield-calculator","0.5,0.5"),/25%/);
 assert.match(run("simple-exponential-smoothing-forecaster","0.5|10,20"),/15/);
});
test("JSON and CSV modes perform typed integrity and time-series tasks",()=>{
 assert.match(run("json-composite-identifier-validator",'id,name\n---\n[{"id":1,"name":"A"},{"id":1,"name":"B"}]'),/unique/);
 assert.match(run("json-rolling-sum-column-builder",'v|2\n---\n[{"v":2},{"v":4}]'),/"v_rolling_sum_2": 6/);
 assert.match(run("json-two-field-crosstab-builder",'a|b\n---\n[{"a":"x","b":"y"}]'),/"counts"/);
 assert.match(run("json-monthly-date-bucket-summary",'date|amount\n---\n[{"date":"2026-01-01","amount":2},{"date":"2026-01-02","amount":3}]'),/"sum": 5/);
 assert.match(run("json-numeric-field-clamp",'x|0|10\n---\n[{"x":-1}]'),/"x": 0/);
 assert.match(run("json-value-type-coercion-auditor",'[{"a":"1"},{"a":1}]'),/numeric string/);
 assert.match(run("json-property-case-collision-scanner",'{"Name":"A","name":"B"}'),/Name vs name/);
 assert.match(run("json-array-field-sparsity-matrix",'[{"a":1},{"b":2}]'),/record,a,b/);
 assert.match(run("json-schema-constraint-coverage-reporter",'{"type":"object","properties":{"a":{"type":"integer","minimum":0},"b":{"type":"string"}}}'),/Properties with validation constraints: 1\/2/);
 assert.match(run("json-pointer-batch-setter",'/a|2\n---\n{"a":1}'),/"a": 2/);
 assert.match(run("csv-iso-week-sales-aggregator","date|amount\n---\ndate,amount\n2026-11-16,20\n2026-11-17,10"),/2026-W47,30/);
 assert.match(run("csv-rolling-standard-deviation","x|2\n---\nx\n1\n3"),/1/);
 assert.match(run("csv-maximum-drawdown-reporter","price\n---\nprice\n100\n120\n90"),/25%/);
 assert.match(run("csv-exponential-moving-average","x|0.5\n---\nx\n10\n20"),/15/);
 assert.match(run("csv-linear-trend-slope","x\n---\nx\n2\n4\n6"),/slope per row: 2/);
 assert.match(run("csv-index-rebasing-tool","x|100\n---\nx\n40\n44"),/44,110/);
 assert.match(run("csv-conditional-distinct-counter","g|flag|yes|user\n---\ng,flag,user\nA,yes,u1\nA,yes,u1"),/A,1/);
 assert.match(run("csv-numeric-zero-crossing-detector","value\n-2\n1\n-1\n3"),/zero crossings: 3/);
 assert.match(run("csv-numeric-quantile-summary","x\n---\nx\n1\n2\n3"),/median: 2/);
 assert.match(run("csv-consecutive-value-run-detector","x\n---\nx\nA\nA\nB"),/2 rows/);
});
test("Graph/code inspections and date tools return non-overlapping specialist reports",()=>{
 assert.match(run("javascript-import-dependency-grapher","a.js|b.js\nb.js|c.js"),/Dependency edges: 2/);
 assert.match(run("javascript-circular-module-detector","a.js|b.js\nb.js|a.js"),/cycles/);
 assert.match(run("graphql-query-depth-calculator","query X { user { posts { id } } }"),/depth: 3/);
 assert.match(run("graphql-operation-name-extractor","query GetUsers { users { id } }"),/GetUsers/);
 assert.match(run("graphql-variable-usage-auditor","query Q($id: ID!, $unused: Int) { user(id:$id) { name } }"),/unused/);
 assert.match(run("sql-create-table-column-inspector","CREATE TABLE t (id INT, name TEXT);"),/Columns: 2/);
 assert.match(run("sql-insert-tuple-counter","INSERT INTO t(a) VALUES (1),(2);"),/tuples: 2/);
 assert.match(run("sql-duplicate-index-inspector","CREATE INDEX a ON t(x);\nCREATE INDEX b ON t(x);"),/Duplicate/);
 assert.match(run("css-media-breakpoint-inventory","@media (min-width: 768px) {}"),/768px/);
 assert.match(run("css-variable-fallback-inspector","color: var(--brand, red);"),/fallback red/);
 assert.match(run("iso-duration-breakdown-parser","P2DT3H4M5S"),/Days: 2/);
 assert.match(run("iso-duration-composer","0|2|3|4|5"),/P2DT3H4M5S/);
 assert.match(run("gregorian-easter-date-calculator","2027"),/2027-03-28/);
 assert.match(run("retail-445-fiscal-calendar-generator","2026-02-01|2"),/Period 2/);
 assert.match(run("holiday-aware-business-date-adder","2026-11-16|5\n---\n2026-11-18"),/2026-11-24/);
 assert.match(run("timezone-offset-at-date-calculator","Asia/Ho_Chi_Minh|2026-11-17T12:00"),/UTC\+07:00/);
 assert.match(run("custom-weekday-schedule-counter","2026-11-16|2026-11-20|MO,WE,FR"),/weekdays: 3/);
 assert.match(run("recurring-meeting-conflict-finder","2026-11-16|7|09:00|10:00\n---\n2026-11-16|7|09:30|11:00"),/conflict/);
 assert.match(run("shift-roster-coverage-matrix","09:00|12:00\n---\nA|09:00|10:00"),/interval,staff_at_start/);
 assert.match(run("annual-working-hours-estimator","2027|40|15"),/hours:/);
});
test("Full schedule preserves queue order and caps publication at 10 for 98 weeks",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave9-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(queue));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  assert.equal(Math.ceil(queue.length/10),98);
  for(let i=0;i<98;i++){
   const r=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+7*i,2))});
   assert.equal(r.released.length,Math.min(10,queue.length-10*i),"week "+(i+1));
  }
  const state=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(state.published,queue.map(x=>x.slug));
  assert.equal(state.history.length,98);
  assert.equal(state.history.at(-1).slugs.length,3);
  assert.equal(state.published[673],"dna-reverse-complement-tool");
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test("Engines use no uploads, network or code evaluation and are wired into the UI",()=>{
 const modules=["Bio","Chem","Enc","Poly","Finance","Ops","Json","Csv","Dev","Dates"];
 for(const m of modules){
  const source=fs.readFileSync("src/lib/wave9"+m+".mjs","utf8");
  assert.doesNotMatch(source,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 }
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 for(const f of ["w9Bio","w9Chem","w9Enc","w9Poly","w9Finance","w9Ops","w9Json","w9Csv","w9Dev","w9Dates"])assert.ok(workspace.includes(f+"(mode,content)"));
 const published=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
 assert.equal(published.startDate,"2026-11-23");
 assert.equal(published.weeklyLimit,10);
 assert.deepEqual(published.published,queue.slice(0,published.published.length).map(x=>x.slug));
 assert.match(fs.readFileSync(".github/workflows/publish-curated-guides.yml","utf8"),/blog:release/);
});
