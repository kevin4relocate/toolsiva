import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {test} from "node:test";
import {runExtraText} from "../src/lib/extraTextEngine.mjs";
import {runExtraData} from "../src/lib/extraDataEngine.mjs";
import {runExtraWeb} from "../src/lib/extraWebEngine.mjs";
import {releaseSimpleTools} from "../scripts/release-simple-tools.mjs";
import guides from "../src/data/extraSimpleToolGuides.json" with {type:"json"};

const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const extra=queue.slice(91);
const run=(slug,value)=>runExtraText(slug,value)??runExtraData(slug,value)??runExtraWeb(slug,value);

test("50 extra tools are appended after the original 91 without changing their schedule",()=>{
 assert.equal(extra.length,50);
 assert.equal(queue.length,141);
 assert.equal(new Set(queue.map(x=>x.slug)).size,141);
 assert.equal(Object.keys(guides).length,50);
 for(const x of extra){
  assert.ok(x.ready);
  assert.ok(guides[x.slug],x.slug+" missing custom guide");
  assert.equal(guides[x.slug].example,x.example);
  assert.ok(guides[x.slug].limitation.length>35);
  assert.ok(x.metaDescription.length>=50 && x.metaDescription.length<=180);
  assert.ok(x.week>=10 && x.week<=15);
 }
 assert.equal(queue[90].slug,"simple-pomodoro-timer");
 assert.equal(extra[0].slug,"speaking-time-calculator");
 assert.equal(extra.at(-1).slug,"ipv4-subnet-calculator");
});

test("English linguistic utilities compute with explicit heuristics",()=>{
 assert.match(run("speaking-time-calculator","120\n---\n"+Array(120).fill("hello").join(" ")),/approximately 1m 00s/);
 assert.match(run("readability-score-checker","The cat is on the mat. The dog is on the rug."),/Flesch Reading Ease/);
 assert.match(run("syllable-counter","beautiful elephant"),/Estimated syllables/);
 assert.match(run("long-sentence-finder","5\n---\nShort one. This sentence contains a lot more than five words."),/1 sentences longer/);
 assert.match(run("repeated-word-detector","This is is a test TEST."),/2 adjacent repeated words/);
 assert.match(run("character-frequency-analyzer","banana"),/"a" : 3/);
 assert.match(run("word-length-distribution","one four"),/3 characters : 1/);
 assert.match(run("palindrome-checker","A man, a plan, a canal: Panama!"),/^Palindrome/);
 assert.match(run("n-gram-generator","2\n---\na b a b a"),/a b : 2/);
 assert.match(run("stop-word-remover","The cat and the dog"),/cat dog/);
});

test("Unicode and text processing handle graphemes and invisible characters",()=>{
 assert.match(run("invisible-unicode-detector","A\u200bB"),/U\+200B/);
 assert.match(run("zero-width-character-remover","A\u200bB"),/^AB/);
 assert.match(run("unicode-code-point-inspector","A😊"),/U\+1F60A/);
 assert.equal(run("diacritics-remover","Crème brûlée"),"Creme brulee");
 assert.equal(run("emoji-remover","Hello 👋 world 🌍!"),"Hello  world !");
 assert.equal(run("non-ascii-character-remover","Cafe é Tokyo 東京"),"Cafe  Tokyo ");
 assert.equal(run("text-truncator","3\n---\nA😊BCDEF"),"A😊…");
 assert.match(run("word-wrap-formatter","5\n---\nhello world friends"),/hello\nworld/);
 assert.equal(run("string-padder","5|right|.\n---\nhi"),"...hi");
 assert.match(run("line-length-checker","a\nabc\nzz"),/Longest: 3 characters \(line 2\)/);
});

test("Extraction utilities distinguish true matches from invalid literals",()=>{
 assert.match(run("phone-number-extractor","+1 (415) 555-0142"),/415/);
 assert.equal(run("ipv4-address-extractor","192.168.1.1 999.0.1.2"),"192.168.1.1");
 assert.match(run("ipv6-address-extractor","2001:db8::1 and ::1"),/2001:db8::1/);
 assert.equal(run("hashtag-extractor","#tools #tools #Dev_2026"),"#tools\n#Dev_2026");
 assert.equal(run("social-mention-extractor","@alice and info@company.com"),"@alice");
 assert.match(run("number-extractor","Price $1,250.50 and -3.2"),/1,250.50/);
 assert.match(run("date-pattern-extractor","2026-11-16 and 11\/20\/2026"),/2026-11-16/);
 assert.equal(run("quoted-text-extractor","She said \"hi\" and 'bye'."),"hi\nbye");
 assert.match(run("domain-name-extractor","https://example.com/page and user@toolsiva.com"),/example.com/);
 assert.equal(run("email-domain-counter","a@example.com b@example.com c@toolsiva.com"),"example.com : 2\ntoolsiva.com : 1");
});

test("JSON pointer flat/unflat round trips nested objects and arrays",()=>{
 const json={user:{name:"Ada",age:32},tags:["a","b"],empty:[],weird:{"a/b":"ok"}};
 const flat=run("json-flatten",JSON.stringify(json));
 const unflat=run("json-unflatten",flat);
 assert.deepEqual(JSON.parse(unflat),json);
 assert.match(run("json-key-extractor",JSON.stringify(json)),/\/user\/name/);
 assert.throws(()=>run("json-unflatten",'{"bad":"x"}'),/Paths must begin with/);
 assert.throws(()=>run("json-key-renamer",'a|b\n---\n{"a":1,"b":2}'),/collision/);
});

test("JSON array operations sort, filter, deduplicate, rename and search values",()=>{
 assert.deepEqual(JSON.parse(run("json-array-sorter",'score|desc\n---\n[{"score":8},{"score":12}]')),[{score:12},{score:8}]);
 assert.deepEqual(JSON.parse(run("json-array-filter",'role=admin\n---\n[{"role":"admin"},{"role":"user"}]')),[{role:"admin"}]);
 assert.deepEqual(JSON.parse(run("json-array-deduplicator",'[{"a":1,"b":2},{"b":2,"a":1},{"a":3}]')),[{a:1,b:2},{a:3}]);
 assert.deepEqual(JSON.parse(run("json-key-renamer",'old|new\n---\n{"old":1,"nested":{"old":2}}')),{new:1,nested:{new:2}});
 assert.match(run("json-value-searcher",'Ada\n---\n{"person":{"name":"Ada"}}'),/\/person\/name/);
 assert.match(run("json-structure-summary",'{"name":"Ada","numbers":[1,2]}'),/Arrays: 1/);
 assert.match(run("csv-column-statistics",'age\n---\nname,age\nA,20\nB,30\nC,40'),/Mean: 30.000/);
 assert.match(run("csv-column-statistics",'name\n---\nname,notes\n"Ada","Hello, world"'),/Rows: 1/);
});

test("HTML, status, cache and network tools reject incorrect input and produce usable text",()=>{
 assert.match(run("css-specificity-calculator","#app .card:hover > p"),/1-2-1/);
 assert.match(run("http-status-code-lookup","404"),/Not Found/);
 assert.match(run("mime-type-lookup",".html"),/text\/html/);
 assert.match(run("meta-robots-generator","noindex,nofollow"),/name="robots"/);
 assert.throws(()=>run("meta-robots-generator","index,noindex"),/Conflicting/);
 assert.match(run("cache-control-header-generator","public, max-age=3600"),/^Cache-Control: public, max-age=3600/);
 assert.throws(()=>run("cache-control-header-generator","public, private"),/Cannot use/);
 const url=run("url-query-parameter-builder","https://example.com/search\n---\nq=hello world\npage=2");
 assert.equal(new URL(url).searchParams.get("q"),"hello world");
 assert.match(run("ipv4-subnet-calculator","192.168.1.10/24"),/Network: 192.168.1.0\/24/);
 assert.match(run("ipv4-subnet-calculator","192.168.1.10/24"),/Broadcast: 192.168.1.255/);
 assert.throws(()=>run("ipv4-subnet-calculator","999.0.1.1/24"),/Invalid/);
});

test("Only 10 tools release weekly, preserving old queue before any new tools",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-141-release-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(queue));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),JSON.stringify({startDate:"2026-11-23",weeklyLimit:10,published:[],history:[]}));
  for(let i=0;i<15;i++){
   const day=new Date(Date.UTC(2026,10,23+7*i,2));
   const result=releaseSimpleTools({root,now:day});
   assert.equal(result.released.length,i===14?1:10);
  }
  const saved=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(saved.published,queue.map(x=>x.slug));
  assert.equal(saved.history.length,15);
  assert.deepEqual(saved.history[9].slugs,queue.slice(90,100).map(x=>x.slug));
  assert.equal(saved.history[9].slugs[0],"simple-pomodoro-timer");
  assert.equal(saved.history[9].slugs[1],"speaking-time-calculator");
  assert.equal(releaseSimpleTools({root,now:new Date("2027-03-08T02:00:00Z")}).released.length,0);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test("New browser engines do not upload, fetch or execute supplied input",()=>{
 for(const p of ["src/lib/extraTextEngine.mjs","src/lib/extraDataEngine.mjs","src/lib/extraWebEngine.mjs"]){
  const s=fs.readFileSync(p,"utf8");
  assert.doesNotMatch(s,/fetch\s*\(|XMLHttpRequest|FileReader|eval\s*\(|new Function\s*\(/);
 }
 const workspace=fs.readFileSync("src/components/tools/SimpleToolWorkspace.astro","utf8");
 assert.doesNotMatch(workspace,/type="file"/);
 assert.ok(workspace.includes("runExtraText(mode,content)"));
 assert.ok(workspace.includes("runExtraData(mode,content)"));
 assert.ok(workspace.includes("runExtraWeb(mode,content)"));
});