import fs from "node:fs";

const developer = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);
const security = fs.readFileSync(
  "src/components/tools/SecurityToolWorkspace.astro",
  "utf8",
);

const checks = [
  [
    "Developer timer types",
    developer.includes("ReturnType<typeof setTimeout> | undefined"),
  ],
  [
    "Security timer types",
    security.includes("ReturnType<typeof setTimeout> | undefined"),
  ],
  [
    "Unused validator removed",
    !developer.includes('validator=root.dataset.validator'),
  ],
  [
    "Developer guarded clearTimeout",
    developer.includes("if (timer) clearTimeout(timer)") &&
      developer.includes("if (debounce) clearTimeout(debounce)"),
  ],
  [
    "Security guarded clearTimeout",
    security.includes("if (timer) clearTimeout(timer)") &&
      security.includes("if (debounce) clearTimeout(debounce)"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Smart UX timeout verification passed.");
