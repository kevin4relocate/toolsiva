import fs from "node:fs";

const source = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);

const checks = [
  ["Top actions", (source.match(/data-actions/g) ?? []).length === 2],
  ["Two Process buttons", (source.match(/data-run/g) ?? []).length >= 2],
  ["Two Copy buttons", (source.match(/data-copy/g) ?? []).length >= 2],
  ["Two Clear buttons", (source.match(/data-clear/g) ?? []).length >= 2],
  ["Compact validator result", source.includes("data-validator-result")],
  ["Hidden validator output", source.includes('data-output class="hidden"')],
  ["Synchronized run buttons", source.includes("runButtons.forEach")],
  ["Synchronized copy buttons", source.includes("copyButtons.forEach")],
  ["Synchronized clear buttons", source.includes("clearButtons.forEach")],
  ["Full YAML parser", source.includes('parseAllDocuments') && !source.includes("validateYamlLite")],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Developer workspace UX verification passed.");
