import fs from "node:fs";

const text = fs.readFileSync(
  "src/components/tools/TextToolWorkspace.astro",
  "utf8",
);
const developer = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);
const legacyVerify = fs.readFileSync(
  "scripts/verify-smart-tool-ux.mjs",
  "utf8",
);

const checks = [
  [
    "LCS uses strict-safe matrix access",
    text.includes("const dp: number[][]") &&
      text.includes("dp[i + 1]?.[j + 1] ?? 0") &&
      text.includes("dp[i]?.[j + 1] ?? 0"),
  ],
  [
    "LCS type is constrained",
    text.includes('type: "unchanged" | "removed" | "added"'),
  ],
  [
    "Unused isGenerator removed",
    !developer.includes('isGenerator=root.dataset.generator'),
  ],
  [
    "Legacy UX test upgraded for v2",
    legacyVerify.includes("Case Converter uses direct actions") &&
      legacyVerify.includes("Text Compare uses visual diff"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("UX v2 complete fix verification passed.");
