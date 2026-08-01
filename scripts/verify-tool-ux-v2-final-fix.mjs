import fs from "node:fs";

const source = fs.readFileSync(
  "src/components/tools/TextToolWorkspace.astro",
  "utf8",
);

const checks = [
  [
    "Changed diff display type supported",
    source.includes(
      'let type: "unchanged" | "removed" | "added" | "changed"',
    ),
  ],
  [
    "Diagonal assignment uses a narrowed row",
    source.includes("const currentRow = dp[i];") &&
      source.includes("if (currentRow) currentRow[j] = diagonal + 1;"),
  ],
  [
    "Max assignment uses a narrowed row",
    source.includes(
      "if (currentRow) currentRow[j] = Math.max(below, right);",
    ),
  ],
  [
    "Unsafe direct assignment removed",
    !source.includes("if (dp[i]) dp[i][j]"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Final UX v2 TypeScript verification passed.");
