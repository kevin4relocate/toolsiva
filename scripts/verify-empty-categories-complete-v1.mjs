import fs from "node:fs";
const tools=fs.readFileSync("src/data/tools.ts","utf8");
const page=fs.readFileSync("src/pages/tools/[category]/[slug].astro","utf8");
const checks=[
["10 QR tools",(tools.match(/category[\"]?: \"qr\"/g)||[]).length>=10],
["12 calculator tools",(tools.match(/category[\"]?: \"calculator\"/g)||[]).length>=12],
["20 converter tools",(tools.match(/category[\"]?: \"converter\"/g)||[]).length>=20],
["QR workspace connected",page.includes("QrToolWorkspace")],
["Calculator workspace connected",page.includes("CalculatorToolWorkspace")],
["Converter workspace connected",page.includes("ConverterToolWorkspace")],
["QR component exists",fs.existsSync("src/components/tools/QrToolWorkspace.astro")],
["Calculator component exists",fs.existsSync("src/components/tools/CalculatorToolWorkspace.astro")],
["Converter component exists",fs.existsSync("src/components/tools/ConverterToolWorkspace.astro")],
];let failed=false;for(const [n,p] of checks){console.log(`${p?"OK":"FAILED"}: ${n}`);if(!p)failed=true;}if(failed)process.exit(1);console.log("Empty categories completion verification passed.");