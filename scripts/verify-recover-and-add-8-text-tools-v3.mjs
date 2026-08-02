import fs from "node:fs";
const tools=fs.readFileSync("src/data/tools.ts","utf8");
const route=fs.readFileSync("src/pages/tools/[category]/[slug].astro","utf8");
const expected=["add-bullets-to-text","add-blank-lines-between-text","add-prefix-suffix-to-lines","trim-each-line","quote-each-line","remove-line-numbers","extract-emails-from-text","extract-urls-from-text"];
const slugs=[...tools.matchAll(/(?:slug|["']slug["'])\s*:\s*["']([^"']+)["']/g)].map(m=>m[1]);
const cats=[...tools.matchAll(/(?:category|["']category["'])\s*:\s*["'](text|developer|security|qr|calculator|converter)["']/g)].map(m=>m[1]);
const unique=new Set(slugs);
const checks=[
["Exactly 108 unique tools",unique.size===108],
["No duplicate slugs",unique.size===slugs.length],
["28 text tools",cats.filter(c=>c==="text").length===28],
["All 8 tools exist",expected.every(s=>unique.has(s))],
["New workspace exists",fs.existsSync("src/components/tools/NewTextToolsWorkspace.astro")],
["All 8 routes connected",expected.every(s=>route.includes(`"${s}"`))],
["New workspace rendered",route.includes("<NewTextToolsWorkspace")],
];
let failed=false;
for(const [name,ok] of checks){console.log(`${ok?"OK":"FAILED"}: ${name}`);if(!ok)failed=true}
if(failed)process.exit(1);
console.log("Recovery and 8 text tools verification passed.");
