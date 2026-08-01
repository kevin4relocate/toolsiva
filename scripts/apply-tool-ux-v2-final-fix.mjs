import fs from "node:fs";

const file = "src/components/tools/TextToolWorkspace.astro";
let source = fs.readFileSync(file, "utf8");
let changed = false;

const replacements = [
  [
    'if (dp[i]) dp[i][j] = diagonal + 1;',
    'const currentRow = dp[i];\n          if (currentRow) currentRow[j] = diagonal + 1;',
  ],
  [
    'if (dp[i]) dp[i][j] = Math.max(below, right);',
    'const currentRow = dp[i];\n          if (currentRow) currentRow[j] = Math.max(below, right);',
  ],
  [
    'let type=row?.type??"unchanged",l=row?.left??null,r=row?.right??null;',
    'let type: "unchanged" | "removed" | "added" | "changed" = row?.type ?? "unchanged",l=row?.left??null,r=row?.right??null;',
  ],
];

for (const [before, after] of replacements) {
  if (source.includes(before)) {
    source = source.replace(before, after);
    changed = true;
  }
}

if (
  !source.includes(
    'let type: "unchanged" | "removed" | "added" | "changed"',
  )
) {
  throw new Error("Could not confirm the visual diff display type fix.");
}

if (
  !source.includes("if (currentRow) currentRow[j] = diagonal + 1;") ||
  !source.includes(
    "if (currentRow) currentRow[j] = Math.max(below, right);",
  )
) {
  throw new Error("Could not confirm the strict-safe matrix assignment fix.");
}

if (changed) {
  fs.writeFileSync(file, source);
  console.log("Final UX v2 TypeScript fixes applied.");
} else {
  console.log("Final UX v2 TypeScript fixes were already applied.");
}
