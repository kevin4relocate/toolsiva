import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {t4A,t4B} from "../src/lib/wave4Text.mjs";
import {h4Html,u4Tools} from "../src/lib/wave4HtmlUrl.mjs";
import {j4Tools,c4Tools} from "../src/lib/wave4JsonCsv.mjs";
import {n4Buss,n4Stats} from "../src/lib/wave4BusinessStats.mjs";
import {v4Http,v4Validate} from "../src/lib/wave4WebValidators.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/wave4ToolGuides.json" with {type:"json"};

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const added=queue.filter(x=>x.batch===4);
const run=(slug,s)=>t4A(slug,s)??t4B(slug,s)??h4Html(slug,s)??u4Tools(slug,s)??j4Tools(slug,s)??c4Tools(slug,s)??n4Buss(slug,s)??n4Stats(slug,s)??v4Http(slug,s)??v4Validate(slug,s);
const browserOnly=new Set(["html-heading-word-counter","html-paragraph-element-counter","html-link-rel-analyzer","html-meta-description-extractor","html-canonical-link-extractor","html-language-attribute-checker","html-title-tag-extractor","html-form-field-extractor","html-duplicate-id-detector","html-label-association-checker","html-aria-attribute-audit"]);

test("100 new tools follow the 191 original queue entries and provide unique valid text examples",()=>{
 assert.equal(queue.length,473);
 assert.equal(added.length,97);
 assert.equal(Object.keys(guides).length,97);
 assert.equal(queue.filter(x=>x.batch===3).at(-1).slug,"dmarc-record-generator");
 assert.equal(added[0].slug,"line-intersection-finder");
 assert.equal(added.at(-1).slug,"csv-formula-injection-detector");
 assert.equal(new Set(queue.map(x=>x.slug)).size,473);
 const engines=["wave4Text","wave4HtmlUrl","wave4JsonCsv","wave4BusinessStats","wave4WebValidators"].map(x=>fs.readFileSync("src/lib/"+x+".mjs","utf8")).join("\n");
 for(const entry of added){
  assert.ok(entry.ready,entry.slug+" not ready");
  assert.equal(guides[entry.slug].example,entry.example);
  assert.ok(guides[entry.slug].limitation.length>20);
  assert.ok(entry.metaDescription.length>65&&entry.metaDescription.length<=180,entry.slug+" meta");
  assert.ok(entry.week>=19&&entry.week<=29,entry.slug+" release week");
  assert.match(entry.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.doesNotMatch(entry.slug,/pdf|image|file-upload|barcode|qr-code/i);
  assert.ok(engines.includes('case "'+entry.slug+'"'),entry.slug+" lacks implementation");
  if(browserOnly.has(entry.slug))continue;
  const output=run(entry.slug,entry.example);
  assert.equal(typeof output,"string",entry.slug+" output type");
  assert.ok(output.trim().length>0,entry.slug+" empty output");
 }
});

test("Text collection and formatting utilities preserve meaningful data",()=>{
 assert.equal(run("line-intersection-finder","a\nb\nc\n---\nb\nd"),"b");
 assert.equal(run("line-difference-finder","a\nb\n---\nb\nc"),"a");
 assert.match(run("line-frequency-counter","a\na\nb"),/"a" : 2/);
 const shuffled=run("line-shuffler","a\nb\nc").split("\n").sort();
 assert.deepEqual(shuffled,["a","b","c"]);
 assert.match(run("line-chunker","2\n---\na\nb\nc"),/Chunk 2:\nc/);
 assert.equal(run("delimited-text-column-extractor","2|,\n---\na,b\nc,d"),"b\nd");
 assert.match(run("keyword-context-snippet-extractor","error|5\n---\nthis error appears"),/error/);
 assert.match(run("word-position-finder","hello\n---\nhello there hello"),/Positions: 1, 3/);
 assert.match(run("sentence-length-statistics","One. Two words."),/Sentences: 2/);
 assert.equal(run("surround-words-formatter","*|!\n---\nhi there"),"*hi! *there!");
 assert.equal(run("reverse-sentence-order-tool","One. Two!"),"Two! One.");
 assert.match(run("paragraph-alphabetical-sorter","Zebra.\n\nApple."),/^Apple.\n\nZebra./);
 assert.equal(run("duplicate-paragraph-remover","Hello.\n\nOther.\n\nhello."),"Hello.\n\nOther.");
 assert.match(run("sentence-numberer","One. Two."),/1. One.\n2. Two./);
 assert.equal(run("question-sentence-extractor","Why? Good."),"Why?");
 assert.equal(run("exclamation-sentence-extractor","Wow! Okay."),"Wow!");
 assert.equal(run("bracket-content-extractor","(one) [two] {three}"),"one\ntwo\nthree");
});

test("URL and cookie utilities handle encoding, repeated parameters, and safe origin rules",()=>{
 assert.match(run("url-path-segment-extractor","https://example.com/a/b"),/1. a\n2. b/);
 assert.equal(run("url-query-parameter-extractor","q\n---\nhttps://example.com/?q=hello&q=world"),"1. hello\n2. world");
 assert.equal(new URL(run("url-query-parameter-remover","x\n---\nhttps://example.com/?x=1&y=2")).searchParams.has("x"),false);
 assert.match(run("url-query-parameter-sorter","https://example.com/?z=9&a=1"),/\?a=1&z=9/);
 assert.equal(run("relative-url-resolver","https://example.com/a/b\n---\n../c"),"https://example.com/c");
 assert.match(run("url-origin-comparator","https://example.com:443/a\n---\nhttps://example.com/b"),/Same origin/);
 assert.match(run("url-percent-encoding-inspector","https://example.com/?q=hello%20world"),/%20 →/);
 assert.equal(run("url-trailing-slash-normalizer","remove\n---\nhttps://example.com/a/"),"https://example.com/a");
 assert.match(run("cookie-header-parser","a=1; b=2"),/b = 2/);
 assert.match(run("set-cookie-attribute-inspector","x=y; Secure; HttpOnly"),/Secure: true/);
 assert.throws(()=>run("relative-url-resolver","https://example.com\n---\njavascript:alert(1)"),/HTTP (?:and|or) HTTPS/);
});

test("JSON Lines, field grouping, sorting, slices and numeric summaries work",()=>{
 assert.deepEqual(JSON.parse(run("json-array-field-extractor",'name\n---\n[{"name":"A"},{"name":"B"}]')),["A","B"]);
 assert.match(run("json-array-group-counter",'type\n---\n[{"type":"A"},{"type":"A"},{"type":"B"}]'),/"A" : 2/);
 assert.match(run("json-array-numeric-summary",'n\n---\n[{"n":3},{"n":7}]'),/Mean: 5/);
 assert.match(run("json-lines-validator",'{"a":1}\n{"b":2}'),/Valid NDJSON: 2/);
 assert.deepEqual(JSON.parse(run("json-lines-to-json-array",'{"a":1}\n{"b":2}')),[{a:1},{b:2}]);
 assert.equal(run("json-array-to-json-lines",'[{"a":1},{"b":2}]'),'{"a":1}\n{"b":2}');
 assert.deepEqual(Object.keys(JSON.parse(run("json-object-key-sorter",'{"z":1,"a":2}'))),["a","z"]);
 assert.deepEqual(JSON.parse(run("json-string-value-trimmer",'{"a":" x ","b":[" y "]}')),{a:"x",b:["y"]});
 assert.deepEqual(JSON.parse(run("json-array-slice",'1|3\n---\n[0,1,2,3]')),[1,2]);
 assert.match(run("json-array-field-presence-checker",'x\n---\n[{"x":null},{"y":1}]'),/Field present: 1/);
});

test("CSV utilities handle escaped quotes, data cleaning and formula flags",()=>{
 assert.match(run("csv-header-validator","a,a\n1,2"),/Duplicate header/);
 assert.match(run("csv-empty-cell-reporter","a,b\n1,\n,2"),/Empty data cells: 2/);
 assert.match(run("csv-column-unique-values","x\n---\nx\nA\nB\nA"),/Unique: 2/);
 assert.match(run("csv-column-frequency-table","x\n---\nx\nA\nA\nB"),/"A" : 2/);
 assert.equal(run("csv-column-masker","email\n---\nname,email\nA,a@example.com"),"name,email\nA,*****");
 assert.equal(run("csv-missing-value-filler","NA\n---\na,b\n1,"),"a,b\n1,NA");
 assert.equal(run("csv-transpose","a,b\n1,2"),"a,1\nb,2");
 assert.equal(run("csv-column-selector","b,a\n---\na,b\n1,2"),"b,a\n2,1");
 assert.match(run("csv-to-markdown-table","a,b\n1,2"),/\| a \| b \|/);
 assert.equal(run("csv-numeric-column-normalizer","n|2\n---\nname,n\nA,1.5"),"name,n\nA,1.50");
 assert.match(run("csv-formula-injection-detector","a,b\nx,=SUM(1+1)"),/Potential formula cells: 1/);
});

test("Business formulas and descriptive stats return grounded numeric results",()=>{
 assert.match(run("average-order-value-calculator","5000,125"),/^40 revenue/);
 assert.match(run("revenue-per-visitor-calculator","12000,8000"),/^1.5 revenue/);
 assert.match(run("gross-profit-calculator","12000,7200"),/4,800/);
 assert.match(run("net-profit-calculator","12000,9000,1500"),/1,500/);
 assert.match(run("operating-margin-calculator","4000,20000"),/20%/);
 assert.match(run("inventory-turnover-calculator","25000,5000"),/5 inventory turns/);
 assert.match(run("days-sales-outstanding-calculator","15000,120000,365"),/45.625/);
 assert.match(run("email-open-rate-calculator","240,2000"),/12%/);
 assert.match(run("email-click-to-open-rate-calculator","60,240"),/25%/);
 assert.match(run("email-bounce-rate-calculator","30,2500"),/1.2%/);
 assert.equal(run("geometric-mean-calculator","2,8"),"4");
 assert.match(run("harmonic-mean-calculator","2,6"),/^3/);
 assert.match(run("data-range-calculator","-1,5,10"),/Range: 11/);
 assert.match(run("iqr-outlier-detector","1,2,2,3,3,4,100"),/Outliers \(1\): 100/);
 assert.match(run("pearson-correlation-calculator","1,2;2,4;3,6"),/Pearson r: 1/);
 assert.match(run("covariance-calculator","1,2;2,4;3,6"),/Population covariance/);
 assert.match(run("linear-regression-calculator","1,2;2,4;3,6"),/Slope: 2/);
 assert.match(run("mean-absolute-deviation-calculator","1,2,3"),/0.666/);
 assert.match(run("root-mean-square-calculator","3,4"),/RMS: 3.535/);
 assert.match(run("number-sign-distribution-calculator","-1,0,2"),/Positive: 1\nNegative: 1\nZero: 1/);
});

test("HTTP, SemVer and DNS header utilities produce meaningful results",()=>{
 assert.match(run("ipv4-network-membership-checker","192.168.1.8\n---\n192.168.1.0/24"),/Inside subnet/);
 assert.match(run("http-basic-auth-decoder","Basic dXNlcjpwYXNz"),/Username: user/);
 assert.match(run("accept-language-header-parser","en-US,en;q=0.8,fr;q=0.5"),/en-US \(q=1.000\)/);
 assert.match(run("http-date-formatter","2026-11-16T13:00:00Z"),/GMT/);
 assert.equal(run("http-content-type-builder","application/json|utf-8"),"Content-Type: application/json; charset=utf-8");
 assert.equal(run("http-retry-after-formatter","120"),"Retry-After: 120");
 assert.match(run("user-agent-family-detector","Mozilla/5.0 Chrome/122.0.0.0 Safari/537.36"),/Chromium/);
 assert.match(run("html-doctype-inspector","<!DOCTYPE html><html>"),/HTML5 doctype/);
 assert.match(run("html-comment-extractor","<!-- first --><!-- second -->"),/first/);
 assert.match(run("semantic-version-comparator","1.2.3\n---\n1.3.0"),/1.2.3 < 1.3.0/);
 assert.equal(run("semantic-version-bump-calculator","1.2.3|minor"),"1.3.0");
 assert.match(run("semver-range-satisfaction-checker","^1.2.0\n---\n1.8.3"),/Satisfies/);
 assert.match(run("git-commit-message-linter","feat(core): fix parser"),/Valid Conventional Commit/);
 assert.match(run("environment-variable-name-validator","MY_API_KEY"),/^Valid/);
 assert.match(run("dns-txt-record-parser","v=spf1 -all"),/Tokens: 2/);
 assert.match(run("spf-mechanism-inspector","v=spf1 include:_spf.example.com -all"),/include/);
 assert.match(run("cors-header-analyzer","Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true"),/Wildcard origin cannot/);
 assert.match(run("csp-directive-inspector","script-src 'self' 'unsafe-eval'"),/review unsafe-eval/);
 assert.throws(()=>run("semantic-version-comparator","01.2.3\n---\n1.2.3"),/valid SemVer/);
});

test("First 286 deduplicated tools simulate publication over 29 Mondays",()=>{
 const phase=queue.filter(x=>x.batch<=4),weeks=Math.ceil(phase.length/10);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-wave4-dedup-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(phase));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  for(let i=0;i<weeks;i++){
   const result=releaseSimpleTools({root,now:new Date(Date.UTC(2026,10,23+i*7,2))});
   assert.equal(result.released.length,Math.min(10,phase.length-i*10),"week "+(i+1));
  }
  const state=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(state.published,phase.map(x=>x.slug));
  assert.equal(state.history.length,weeks);
  assert.equal(state.published[phase.findIndex(x=>x.batch===4)],"line-intersection-finder");
  assert.equal(state.published.at(-1),"csv-formula-injection-detector");
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test("New engines never upload files, fetch remote endpoints or evaluate user input as code",()=>{
 for(const f of ["wave4Text","wave4HtmlUrl","wave4JsonCsv","wave4BusinessStats","wave4WebValidators"]){
   const source=fs.readFileSync("src/lib/"+f+".mjs","utf8");
   assert.doesNotMatch(source,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 }
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 assert.doesNotMatch(workspace,/type=["']file/);
 for(const fn of ["t4A","t4B","h4Html","u4Tools","j4Tools","c4Tools","n4Buss","n4Stats","v4Http","v4Validate"])assert.ok(workspace.includes(fn+"(mode,content)"));
});


test("Edge cases reject unsafe values and compare SemVer prerelease correctly",()=>{
 assert.match(run("semantic-version-comparator","1.2.3-beta.2\n---\n1.2.3"),/1.2.3-beta.2 < 1.2.3/);
 assert.match(run("semantic-version-comparator","1.2.3-beta.2\n---\n1.2.3-beta.11"),/beta.2 < 1.2.3-beta.11/);
 assert.match(run("semver-range-satisfaction-checker","^0.2.0\n---\n0.3.0"),/Does not satisfy/);
 assert.match(run("semver-range-satisfaction-checker","~1.2.0\n---\n1.2.9"),/Satisfies/);
 assert.throws(()=>run("json-array-group-counter","x\n---\n[{\"x\":{}}]"),/primitive/);
 assert.throws(()=>run("csv-column-selector","missing\n---\na,b\n1,2"),/Header not found/);
 assert.throws(()=>run("url-query-parameter-remover","x\n---\nfile:\/\/etc\/passwd"),/HTTP (?:and|or) HTTPS/);
 assert.throws(()=>run("http-retry-after-formatter","-1"),/between 0 and/);
 assert.throws(()=>run("geometric-mean-calculator","0,2"),/positive/);
});
