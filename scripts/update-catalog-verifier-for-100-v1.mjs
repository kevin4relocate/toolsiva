import fs from "node:fs";
const path="scripts/verify-deduplicate-tool-catalog-v2.mjs";
if(!fs.existsSync(path)){console.log("Legacy verifier not found; skipped.");process.exit(0)}
let s=fs.readFileSync(path,"utf8");
s=s.replace('["10 text tools remain", categoryCounts.text === 10]','["20 text tools remain", categoryCounts.text === 20]');
s=s.replace('["12 calculator tools remain", categoryCounts.calculator === 12]','["20 calculator tools remain", categoryCounts.calculator === 20]');
s=s.replace('["Exactly 82 unique tools", slugCounts.size === 82]','["Exactly 100 unique tools", slugCounts.size === 100]');
fs.writeFileSync(path,s);
console.log("Updated legacy verifier for 100 tools.");
