import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {t5TextA,t5TextB} from "../src/lib/wave5Text.mjs";
import {m5Process,d5Process} from "../src/lib/wave5MarkdownData.mjs";
import {j5Tools,d5DateTools} from "../src/lib/wave5JsonDates.mjs";
import {n5Math,n5Business} from "../src/lib/wave5MathBusiness.mjs";
import {c5HtmlCss,s5Security} from "../src/lib/wave5Web.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave5ToolGuides.json" with {type:"json"};

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const newTools=queue.slice(291);
const engines=[t5TextA,t5TextB,m5Process,d5Process,j5Tools,d5DateTools,n5Math,n5Business,c5HtmlCss,s5Security];
const browserOnly=new Set(["html-data-attribute-extractor","html-external-link-extractor","html-target-blank-link-checker","html-button-type-checker","html-empty-anchor-detector"]);
const run=(slug,input)=>{for(const fn of engines){const r=fn(slug,input);if(r!==null)return r;}return null;};

test("All 100 appended tools are unique, documented, safe, executable from samples",()=>{
 assert.equal(queue.length,391);
 assert.equal(newTools.length,100);
 assert.equal(Object.keys(guides).length,100);
 assert.equal(queue[290].slug,"csv-formula-injection-detector");
 assert.equal(queue[291].slug,"line-starts-with-filter");
 assert.equal(queue.at(-1).slug,"spf-include-domain-extractor");
 assert.equal(new Set(queue.map(x=>x.slug)).size,391);
 const source=["wave5Text","wave5MarkdownData","wave5JsonDates","wave5MathBusiness","wave5Web"].map(x=>fs.readFileSync("src/lib/"+x+".mjs","utf8")).join("\n");
 for(const item of newTools){
  assert.ok(item.ready,item.slug);
  assert.ok(item.week>=30&&item.week<=40,item.slug+" scheduled week");
  assert.ok(item.metaDescription.length>=60&&item.metaDescription.length<=180,item.slug+" meta length");
  assert.equal(item.example,guides[item.slug]?.example,item.slug+" guide example");
  assert.ok(guides[item.slug]?.limitation.length>=20,item.slug+" limitation");
  assert.ok(source.includes('case "'+item.slug+'"'),item.slug+" missing implementation");
  if(browserOnly.has(item.slug))continue;
  const output=run(item.slug,item.example);
  assert.equal(typeof output,"string",item.slug+" output type");
  assert.ok(output.trim().length>0,item.slug+" output content");
 }
 const state=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
 assert.ok(Array.isArray(state.published)&&Array.isArray(state.history));
 assert.equal(new Set(state.published).size,state.published.length);
 assert.deepEqual(state.published,queue.slice(0,state.published.length).map(x=>x.slug));
 assert.ok(state.history.every(event=>Array.isArray(event.slugs)&&event.slugs.length>0&&event.slugs.length<=10));
 assert.equal(state.weeklyLimit,10);
});

test("Text and Markdown transformations return meaningful output",()=>{
 assert.equal(run("line-starts-with-filter","a\n---\nabc\nzab"),"abc");
 assert.equal(run("line-ends-with-filter","b\n---\nab\nac"),"ab");
 assert.equal(run("case-insensitive-line-deduplicator","Hello\nhello"),"Hello");
 assert.equal(run("trim-each-line"," a \n b "),"a\nb");
 assert.equal(run("prefix-every-line","x\n---\na\nb"),"xa\nxb");
 assert.equal(run("suffix-every-line","x\n---\na\nb"),"ax\nbx");
 assert.equal(run("join-lines-with-delimiter","|\n---\na\nb"),"a|b");
 assert.equal(run("insert-separator-between-lines","--\n---\na\nb"),"a\n--\nb");
 assert.equal(run("sort-lines-by-length","three\nx\ntwo"),"x\ntwo\nthree");
 assert.equal(run("toggle-letter-case","AbC"),"aBc");
 assert.equal(run("acronym-builder","Search Engine Optimization"),"SEO");
 assert.equal(run("words-to-camel-case","hello world"),"helloWorld");
 assert.equal(run("words-to-snake-case","Hello World"),"hello_world");
 assert.equal(run("words-to-kebab-case","Hello World"),"hello-world");
 assert.equal(run("paragraph-numbering-tool","One.\n\nTwo."),"1. One.\n\n2. Two.");
 const table="| Name | Age |\n| --- | --- |\n| Ada | 30 |";
 assert.match(run("markdown-table-column-counter",table),/Columns: 2/);
 assert.equal(run("markdown-table-to-csv",table),"Name,Age\nAda,30");
 assert.equal(run("markdown-blockquote-extractor","> hello\nother"),"hello");
 assert.equal(run("markdown-link-text-extractor","[Docs](https://example.com)"),"Docs");
 assert.equal(run("markdown-frontmatter-key-extractor","---\ntitle: Hi\n---\nBody"),"title");
 assert.match(run("markdown-horizontal-rule-counter","Line\n***"),/Horizontal rules: 1/);
 assert.equal(run("markdown-footnote-reference-extractor","[^a] and [^b] and [^a]"),"a\nb");
});

test("CSV TSV and JSON text conversions work for values and complex input",()=>{
 assert.deepEqual(JSON.parse(run("tsv-to-json","name\tage\nAda\t30")),[{name:"Ada",age:"30"}]);
 assert.equal(run("json-to-tsv",'[{"name":"Ada","age":30}]'),"name\tage\nAda\t30");
 assert.equal(run("pipe-separated-to-csv","a|b\n1|2"),"a,b\n1,2");
 assert.equal(run("csv-to-pipe-separated","a,b\n1,2"),"a|b\n1|2");
 assert.match(run("csv-row-count","a,b\n1,2\n3,4"),/Data rows: 2/);
 assert.match(run("csv-cell-count","a,b\n1,2"),/All cells: 4/);
 assert.equal(run("csv-positive-number-row-filter","score\n---\nname,score\nA,-1\nB,5"),"name,score\nB,5");
 assert.match(run("csv-column-sum","price\n---\nname,price\nA,2\nB,3"),/Sum: 5/);
 assert.match(run("csv-column-mean","price\n---\nname,price\nA,2\nB,4"),/Mean: 3/);
 assert.match(run("csv-column-minimum-maximum","price\n---\nname,price\nA,2\nB,9"),/Max: 9/);
 assert.deepEqual(JSON.parse(run("json-array-reverser","[1,2,3]")),[3,2,1]);
 assert.deepEqual(JSON.parse(run("json-array-rotator","2\n---\n[1,2,3,4,5]")),[4,5,1,2,3]);
 assert.deepEqual(JSON.parse(run("json-array-chunker","2\n---\n[1,2,3]")),[ [1,2],[3] ]);
 assert.match(run("json-array-value-index-finder",'Ada\n---\n["Bob","Ada","Ada"]'),/Indexes: 1, 2/);
 assert.equal(run("json-null-path-finder",'{"a":null}'),"/a");
 assert.deepEqual(JSON.parse(run("json-null-property-remover",'{"a":null,"b":[null],"c":1}')),{b:[null],c:1});
});

test("Date, math and business calculators handle real formulas",()=>{
 assert.equal(run("iso-week-date-formatter","2026-11-16"),"2026-W47-1");
 assert.equal(run("unix-day-number-calculator","1970-01-01"),"0");
 assert.equal(run("unix-day-number-to-date","0"),"1970-01-01");
 assert.deepEqual(run("date-offset-sequence-generator","2026-11-16|3|7").split("\n"),["2026-11-16","2026-11-23","2026-11-30"]);
 assert.equal(run("full-months-between-dates","2025-01-15|2026-04-15"),"Completed calendar months: 15");
 assert.match(run("calendar-quarter-date-range","2026-Q4"),/2026-12-31/);
 assert.equal(run("weekend-days-between-dates","2026-11-16|2026-11-22"),"Weekend days: 2");
 assert.equal(run("weekday-occurrence-counter","2026-11-01|2026-11-30|Monday"),"Weekday occurrences: 5");
 assert.equal(run("first-weekday-of-month","2026-11|Monday"),"2026-11-02");
 assert.equal(run("last-weekday-of-month","2026-11|Friday"),"2026-11-27");
 assert.equal(run("arithmetic-series-sum","2|3|10"),"Sum: 155");
 assert.equal(run("geometric-series-sum","2|3|5"),"Sum: 242");
 assert.equal(run("fibonacci-number-finder","30"),"F(30) = 832040");
 assert.match(run("fibonacci-sequence-generator","5"),/^0, 1, 1, 2, 3$/);
 assert.equal(run("triangle-area-from-base-height","10|6"),"Area: 30");
 assert.equal(run("rectangle-perimeter-calculator","8|3"),"Perimeter: 22");
 assert.equal(run("trapezoid-area-calculator","8|5|4"),"Area: 26");
 assert.equal(run("net-profit-margin-calculator","1500|12000"),"Net profit margin: 12.5%");
 assert.equal(run("contribution-margin-calculator","120|75"),"Unit contribution margin: 45");
 assert.equal(run("contribution-margin-ratio-calculator","120|75"),"Contribution margin ratio: 37.5%");
 assert.equal(run("investment-payback-period-calculator","10000|2500"),"Simple payback: 4 years");
 assert.equal(run("customer-retention-rate-calculator","900|1000|100"),"Retention: 80%");
 assert.equal(run("repeat-purchase-rate-calculator","300|1200"),"Repeat purchase rate: 25%");
 assert.equal(run("cart-abandonment-rate-calculator","700|1000"),"Cart abandonment: 30%");
 assert.equal(run("session-bounce-rate-calculator","240|1000"),"Bounce rate: 24%");
 assert.equal(run("monthly-recurring-revenue-calculator","100|20|35|15"),"MRR: 2525");
 assert.equal(run("annual-recurring-revenue-calculator","4500"),"ARR: 54000");
 assert.throws(()=>run("fibonacci-number-finder","2001"),/0 to 2000/);
});

test("CSS, HTTP, email, JWT and DNS tools return useful offline output",()=>{
 assert.match(run("css-class-name-extractor",".card{color:red}.wide{margin:2px}"),/card\nwide/);
 assert.match(run("css-selector-rule-counter","a,b{color:red}"),/Selectors: 2/);
 assert.match(run("css-declaration-counter","a{color:red;margin:0}"),/Declarations: 2/);
 assert.match(run("css-custom-property-extractor",":root{--color:red}"),/--color = red/);
 assert.match(run("css-unit-frequency-counter","a{width:10px;height:2rem}"),/px : 1/);
 assert.match(run("url-scheme-classifier","https://example.com"),/Scheme: https/);
 assert.match(run("jwt-expiration-date-inspector","eyJhbGciOiJub25lIn0.eyJleHAiOjE4MDAwMDAwMDB9."),/Expiration UTC/);
 assert.equal(run("bearer-authorization-header-cleaner","Bearer abc123"),"abc123");
 assert.match(run("http-header-alphabetical-sorter","Z-Test: 1\nAccept: text/html"),/^Accept/);
 assert.equal(run("http-duplicate-header-detector","X-A: 1\nx-a: 2"),"x-a : 2");
 assert.equal(run("http-header-name-normalizer","content-type: text/plain"),"Content-Type: text/plain");
 assert.match(run("email-address-syntax-validator","hello@example.com"),/^Valid/);
 assert.equal(run("email-address-list-normalizer","A@Example.com\na@example.com"),"A@example.com");
 assert.match(run("dns-mx-record-priority-sorter","20 mx2.example.com\n10 mx1.example.com"),/^10 mx1/);
 assert.equal(run("spf-include-domain-extractor","v=spf1 include:_spf.example.com -all"),"_spf.example.com");
});

test("Original order is preserved and 391 ready tools release over 40 weekly slots",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave5-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(queue));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  for(let i=0;i<40;i++){
   const res=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+i*7,2))});
   assert.equal(res.released.length,i===39?1:10,"week "+(i+1));
  }
  const out=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(out.published,queue.map(x=>x.slug));
  assert.equal(out.history.length,40);
  assert.equal(out.history[29].slugs[1],queue[291].slug);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test("Browser processing engines do not upload, call APIs or execute user code",()=>{
 for(const name of ["wave5Text","wave5MarkdownData","wave5JsonDates","wave5MathBusiness","wave5Web"]){
  const source=fs.readFileSync("src/lib/"+name+".mjs","utf8");
  assert.doesNotMatch(source,/FileReader|XMLHttpRequest|fetch\s*\(|eval\s*\(|new Function\s*\(/);
 }
 const page=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 for(const f of ["t5TextA","t5TextB","m5Process","d5Process","j5Tools","d5DateTools","n5Math","n5Business","c5HtmlCss","s5Security"]){
  assert.ok(page.includes(f+"(mode,content)"),f+" not mounted");
 }
});
