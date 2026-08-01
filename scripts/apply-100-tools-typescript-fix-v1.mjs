import fs from "node:fs";

const path = "src/components/tools/ExpansionToolWorkspace.astro";
let source = fs.readFileSync(path, "utf8");

source = source.replace(
  'const n=(v:string)=>Number.parseFloat(v);',
  'const n=(v:string|undefined)=>Number.parseFloat(v??"");',
);

source = source.replace(
  'const xs=v.values.split(/[\s,]+/)',
  'const xs=(v.values??"").split(/[\s,]+/)',
);

fs.writeFileSync(path, source);
console.log("Fixed ExpansionToolWorkspace strict TypeScript input handling.");
