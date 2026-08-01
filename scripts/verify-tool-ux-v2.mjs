import fs from "node:fs";
const text=fs.readFileSync("src/components/tools/TextToolWorkspace.astro","utf8");
const dev=fs.readFileSync("src/components/tools/DeveloperToolWorkspace.astro","utf8");
const sec=fs.readFileSync("src/components/tools/SecurityToolWorkspace.astro","utf8");
const css=fs.readFileSync("src/styles/global.css","utf8");
const checks=[
 ["Case converter single field",text.includes("data-case-action")&&!text.includes('mode === "case-converter" && (\n      <div class="grid')],
 ["Dual pane converters",text.includes("lg:grid-cols-2")&&dev.includes("dualPane")],
 ["Visual diff",text.includes("data-diff-view")&&text.includes("diff-added")&&text.includes("lcs(")],
 ["Validator semantic card",dev.includes("data-validation-card")&&dev.includes("semantic-success")&&dev.includes("semantic-error")],
 ["Validator line and column",dev.includes("positionToLineColumn")&&dev.includes("Line ${lc.line}, column ${lc.column}")],
 ["Go to error",dev.includes("data-go-error")&&dev.includes("setSelectionRange")],
 ["Semantic colors",css.includes("Toolsiva UX Architecture v2")&&css.includes("--semantic-success")],
 ["No generic Process buttons",!text.includes(">Process<")&&!dev.includes(">Process<")&&!sec.includes(">Process<")],
 ["Timer types fixed",dev.includes("ReturnType<typeof setTimeout>")&&sec.includes("ReturnType<typeof setTimeout>")],
];let failed=false;for(const [name,pass] of checks){console.log(`${pass?"OK":"FAILED"}: ${name}`);if(!pass)failed=true;}if(failed)process.exit(1);console.log("Tool UX Architecture v2 verification passed.");
