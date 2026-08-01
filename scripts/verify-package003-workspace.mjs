import fs from "node:fs";

const pagePath = "src/pages/tools/[category]/[slug].astro";
const workspacePath = "src/components/tools/DeveloperToolWorkspace.astro";

const page = fs.readFileSync(pagePath, "utf8");
const workspace = fs.readFileSync(workspacePath, "utf8");

const checks = [
  ['Developer workspace import', page.includes('import DeveloperToolWorkspace from "@/components/tools/DeveloperToolWorkspace.astro";')],
  ['Developer workspace render', page.includes('tool.category === "developer"') && page.includes('<DeveloperToolWorkspace mode={tool.slug} />')],
  ['Developer tool marker', workspace.includes("data-developer-tool")],
  ['Input field', workspace.includes("data-input")],
  ['Output field', workspace.includes("data-output")],
  ['Process button', workspace.includes("data-run")],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length > 0) {
  for (const [name] of failed) console.error(`FAILED: ${name}`);
  process.exit(1);
}

for (const [name] of checks) console.log(`OK: ${name}`);
console.log("Package 003 Developer workspace verification passed.");
