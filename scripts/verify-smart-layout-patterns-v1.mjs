import fs from "node:fs";
const s=fs.readFileSync("src/components/tools/SecurityToolWorkspace.astro","utf8");const d=fs.readFileSync("src/components/tools/DeveloperToolWorkspace.astro","utf8");const p=fs.readFileSync("src/pages/tools/[category]/[slug].astro","utf8");
const checks=[
["Hash uses compact digest card",s.includes("SHA-256 digest")&&s.includes("data-result-card")],
["Basic Auth uses compact inputs",s.includes("Username")&&s.includes('type="password"')],
["HMAC uses message secret algorithm",s.includes("HMAC signature")&&s.includes("data-algorithm")],
["Password strength has meter",s.includes("data-strength-bar")],
["Hash compare has colored result",s.includes("semantic-success")&&s.includes("semantic-error")],
["Developer converters are dual pane",d.includes("isDual")&&d.includes("lg:grid-cols-2")],
["JWT has structured panels",d.includes("data-jwt-header")&&d.includes("data-jwt-payload")],
["Timestamp uses compact result",d.includes("Converted values")&&d.includes("data-result-card")],
["Validators retain error navigation",d.includes("data-go-error")&&d.includes("setSelectionRange")],
["How-to instructions are tool aware",p.includes("getToolInstructions")&&p.includes("instructions.map")],
];let bad=false;for(const [n,v] of checks){console.log(`${v?"OK":"FAILED"}: ${n}`);if(!v)bad=true;}if(bad)process.exit(1);console.log("Smart layout patterns verification passed.");
