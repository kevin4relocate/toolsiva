import fs from "node:fs";
const expansion=fs.readFileSync("src/components/tools/ExpansionToolWorkspace.astro","utf8");
const fresh=fs.readFileSync("src/components/tools/NewTextToolsWorkspace.astro","utf8");
const ad=fs.readFileSync("src/components/common/AdSlot.astro","utf8");
const route=fs.readFileSync("src/pages/tools/[category]/[slug].astro","utf8");
const checks=[
["Expansion equal headers",expansion.includes("grid-rows-[2.75rem_auto_auto]")],
["Expansion equal textareas",(expansion.match(/h-\[clamp\(18rem,42vh,26rem\)\]/g)||[]).length>=2],
["New tools equal headers",fresh.includes("grid-rows-[2.75rem_auto_auto]")],
["New tools equal textareas",(fresh.match(/h-\[clamp\(18rem,42vh,26rem\)\]/g)||[]).length>=2],
["Side rail variant",ad.includes('"side-rail"')&&ad.includes("w-[160px]")],
["1700px three-column layout",route.includes("min-[1700px]:grid-cols-[160px_minmax(0,1240px)_160px]")],
["1240px center",route.includes("min-[1700px]:max-w-[77.5rem]")],
["Both side ads",route.includes('tool-side-left')&&route.includes('tool-side-right')],
["No duplicate text workspace",route.includes("!newTextToolSlugs.has(tool.slug) && !expansionToolSlugs.has(tool.slug)")],
];
let failed=false;
for(const [name,ok] of checks){console.log(`${ok?"OK":"FAILED"}: ${name}`);if(!ok)failed=true}
if(failed)process.exit(1);
console.log("Equal workspace + AdSense layout verification passed.");
