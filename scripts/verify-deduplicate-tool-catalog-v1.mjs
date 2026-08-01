import fs from "node:fs";

const source = fs.readFileSync("src/data/tools.ts", "utf8");
const slugMatches = [...source.matchAll(/\bslug\s*:\s*["']([^"']+)["']/g)];
const counts = new Map();

for (const match of slugMatches) {
  const slug = match[1];
  counts.set(slug, (counts.get(slug) ?? 0) + 1);
}

const duplicates = [...counts.entries()]
  .filter(([, count]) => count > 1)
  .map(([slug, count]) => `${slug} (${count})`);

const categoryCounts = {
  text: 0,
  developer: 0,
  security: 0,
  qr: 0,
  calculator: 0,
  converter: 0,
};

for (const match of source.matchAll(
  /\bcategory\s*:\s*["'](text|developer|security|qr|calculator|converter)["']/g,
)) {
  categoryCounts[match[1]] += 1;
}

const checks = [
  ["No duplicate tool slugs", duplicates.length === 0],
  ["10 QR tools remain", categoryCounts.qr === 10],
  ["12 calculator tools remain", categoryCounts.calculator === 12],
  ["20 converter tools remain", categoryCounts.converter === 20],
  [
    "No empty array entries",
    !/,\s*,\s*(?=\{)/.test(source) &&
      !/\[\s*,\s*(?=\{)/.test(source),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (duplicates.length > 0) {
  console.log(`Duplicate slugs: ${duplicates.join(", ")}`);
}

console.log(
  `Category totals: text=${categoryCounts.text}, developer=${categoryCounts.developer}, security=${categoryCounts.security}, qr=${categoryCounts.qr}, calculator=${categoryCounts.calculator}, converter=${categoryCounts.converter}`,
);

if (failed) process.exit(1);

console.log("Tool catalog duplicate verification passed.");
