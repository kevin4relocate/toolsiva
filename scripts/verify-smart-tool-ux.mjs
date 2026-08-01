import fs from "node:fs";
const text=fs.readFileSync("src/components/tools/TextToolWorkspace.astro","utf8");
const dev=fs.readFileSync("src/components/tools/DeveloperToolWorkspace.astro","utf8");
const sec=fs.readFileSync("src/components/tools/SecurityToolWorkspace.astro","utf8");
const checks=[
 ["Text has no Process button",!text.includes("data-run")&&!text.includes(">Process<")],
 ["Text updates on input",text.includes('addEventListener("input", update)')],
 ["Developer auto tools have no Process button",!dev.includes("data-run")],
 ["UUID has Generate action",dev.includes("Generate UUIDs")&&dev.includes("data-generate")],
 ["Developer uses debounce",dev.includes("setTimeout(transform,180)")],
 ["Security generators have named actions",sec.includes("Generate password")&&sec.includes("Generate token")],
 ["Security auto tools have no generic Process",!sec.includes(">Process<")&&!sec.includes("data-run")],
 ["Security uses debounce",sec.includes("setTimeout(update,180)")],
];let bad=false;for(const [n,p] of checks){console.log(`${p?"OK":"FAILED"}: ${n}`);if(!p)bad=true;}if(bad)process.exit(1);console.log("Smart tool UX verification passed.");