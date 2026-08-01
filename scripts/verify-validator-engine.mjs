import fs from "node:fs";

const workspace = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const checks = [
  ["YAML parser dependency", packageJson.dependencies?.yaml === "2.9.0"],
  ["Compatible TypeScript", packageJson.devDependencies?.typescript === "5.9.2"],
  ["YAML parser import", workspace.includes('import { parseAllDocuments } from "yaml";')],
  ["JSON native parser", workspace.includes("JSON.parse(value)")],
  ["XML DOM parser", workspace.includes('new DOMParser().parseFromString(value, "application/xml")')],
  ["No approximate YAML validator", !workspace.includes("validateYamlLite")],
];

const failed = checks.filter(([, passed]) => !passed);
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
}

if (failed.length > 0) process.exit(1);
console.log("Validator engine verification passed.");
