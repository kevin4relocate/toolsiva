import fs from "node:fs";

const path = "src/components/tools/ExpansionToolWorkspace.astro";
const source = fs.readFileSync(path, "utf8");

const checks = [
  ["Number parser accepts undefined", source.includes('const n=(v:string|undefined)=>Number.parseFloat(v??"");')],
  ["GCD/LCM input has fallback", source.includes('const xs=(v.values??"").split(/[\s,]+/)')],
  ["Expansion workspace still exists", fs.existsSync(path)],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("100 tools TypeScript fix verification passed.");
