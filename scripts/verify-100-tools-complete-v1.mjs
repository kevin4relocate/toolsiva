import fs from "node:fs";
const source=fs.readFileSync("src/data/tools.ts","utf8");
const route=fs.readFileSync("src/pages/tools/[category]/[slug].astro","utf8");
const slugs=[...source.matchAll(/(?:slug|["']slug["'])\s*:\s*["']([^"']+)["']/g)].map(m=>m[1]);
const cats=[...source.matchAll(/(?:category|["']category["'])\s*:\s*["'](text|developer|security|qr|calculator|converter)["']/g)].map(m=>m[1]);
const unique=new Set(slugs);
const counts=Object.fromEntries(["text","developer","security","qr","calculator","converter"].map(c=>[c,cats.filter(x=>x===c).length]));
const checks=[
["Exactly 100 unique tools",unique.size===100],
["No duplicate slugs",unique.size===slugs.length],
["20 text tools",counts.text===20],
["20 calculator tools",counts.calculator===20],
["Expansion component exists",fs.existsSync("src/components/tools/ExpansionToolWorkspace.astro")],
["Expansion workspace connected",route.includes("<ExpansionToolWorkspace mode={tool.slug} />")],
];
let failed=false;
for(const [name,ok] of checks){console.log(`${ok?"OK":"FAILED"}: ${name}`);if(!ok)failed=true}
console.log(`Counts: text=${counts.text}, developer=${counts.developer}, security=${counts.security}, qr=${counts.qr}, calculator=${counts.calculator}, converter=${counts.converter}`);
if(failed)process.exit(1);
console.log("100 tools verification passed.");
