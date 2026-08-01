import fs from "node:fs";

const text = fs.readFileSync(
  "src/components/tools/TextToolWorkspace.astro",
  "utf8",
);
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
    "Text has no generic Process button",
    !text.includes("data-run") && !text.includes(">Process<"),
  ],
  [
    "Text tools update automatically",
    text.includes('addEventListener("input",transform)') ||
      text.includes('addEventListener("input", transform)'),
  ],
  [
    "Case Converter uses direct actions",
    text.includes("data-case-action") && text.includes("data-undo"),
  ],
  [
    "Text Compare uses visual diff",
    text.includes("data-diff-view") && text.includes("const lcs"),
  ],
  [
    "Developer tools have no generic Process button",
    !developer.includes("data-run"),
  ],
  [
    "Developer tools use automatic debounce",
    developer.includes("debounce=setTimeout(transform,180)") ||
      developer.includes("debounce = setTimeout(transform, 180)"),
  ],
  [
    "UUID has a named Generate action",
    developer.includes("Generate UUIDs") &&
      developer.includes("data-generate"),
  ],
  [
    "Validators use semantic status cards",
    developer.includes("data-validation-card") &&
      developer.includes("semantic-success") &&
      developer.includes("semantic-error"),
  ],
  [
    "Security generators have named actions",
    security.includes("Generate password") &&
      security.includes("Generate token"),
  ],
  [
    "Security tools have no generic Process button",
    !security.includes("data-run") && !security.includes(">Process<"),
  ],
  [
    "Security tools use automatic debounce",
    security.includes("setTimeout(update,180)") ||
      security.includes("setTimeout(update, 180)"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Smart Tool UX verification passed for UX Architecture v2.");
