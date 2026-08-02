import fs from "node:fs";
const path="scripts/verify-deduplicate-tool-catalog-v2.mjs";
if(!fs.existsSync(path)){console.log("Legacy verifier not found; skipped.");process.exit(0)}
let s=fs.readFileSync(path,"utf8");
s=s.replace('["20 text tools remain", categoryCounts.text === 20]','["28 text tools remain", categoryCounts.text === 28]');
s=s.replace('["Exactly 100 unique tools", slugCounts.size === 100]','["Exactly 108 unique tools", slugCounts.size === 108]');
fs.writeFileSync(path,s);
console.log("Updated legacy verifier for 108 tools.");
