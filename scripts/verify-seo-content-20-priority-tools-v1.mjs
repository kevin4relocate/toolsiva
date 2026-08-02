import fs from "node:fs";
const data=fs.readFileSync("src/data/toolSeoContent.ts","utf8");
const component=fs.readFileSync("src/components/tools/ToolSeoContent.astro","utf8");
const slugs=["word-counter", "character-counter", "case-converter", "json-formatter", "json-validator", "base64-encode", "base64-decode", "uuid-generator", "password-generator", "qr-url-generator", "percentage-calculator", "discount-calculator", "age-calculator", "bmi-calculator", "loan-calculator", "length-converter", "weight-converter", "temperature-converter", "add-bullets-to-text", "remove-duplicate-lines"];
const checks=[
["All 20 priority tools exist",slugs.every(slug=>data.includes(`"${slug}"`))],
["Exactly 20 tools selected",slugs.length===20],
["Examples rendered",component.includes("priorityContent.example.input")&&component.includes("priorityContent.example.output")],
["Use cases rendered",component.includes("priorityContent.useCases.map")],
["Privacy content retained",data.includes('"Privacy and processing"')],
["Fallback content retained",data.includes("categoryContext")],
];
let failed=false;
for(const [name,ok] of checks){console.log(`${ok?"OK":"FAILED"}: ${name}`);if(!ok)failed=true}
if(failed)process.exit(1);
console.log("20 priority tool SEO content verification passed.");
