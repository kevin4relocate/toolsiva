import fs from "node:fs";

const source = fs.readFileSync("src/data/tools.ts", "utf8");

const slugPattern =
  /(?:(?:^|[,{]\s*)slug|(?:^|[,{]\s*)["']slug["'])\s*:\s*["']([^"']+)["']/g;

const categoryPattern =
  /(?:(?:^|[,{]\s*)category|(?:^|[,{]\s*)["']category["'])\s*:\s*["'](text|developer|security|qr|calculator|converter)["']/g;

const slugCounts = new Map();

for (const match of source.matchAll(slugPattern)) {
  const slug = match[1];
  slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
}

const duplicates = [...slugCounts.entries()]
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

for (const match of source.matchAll(categoryPattern)) {
  categoryCounts[match[1]] += 1;
}

const checks = [
  ["No duplicate tool slugs", duplicates.length === 0],
  ["28 text tools remain", categoryCounts.text === 28],
  ["20 developer tools remain", categoryCounts.developer === 20],
  ["10 security tools remain", categoryCounts.security === 10],
  ["10 QR tools remain", categoryCounts.qr === 10],
  ["20 calculator tools remain", categoryCounts.calculator === 20],
  ["20 converter tools remain", categoryCounts.converter === 20],
  ["Exactly 108 unique tools", slugCounts.size === 108],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

console.log(
  `Category totals: text=${categoryCounts.text}, developer=${categoryCounts.developer}, security=${categoryCounts.security}, qr=${categoryCounts.qr}, calculator=${categoryCounts.calculator}, converter=${categoryCounts.converter}`,
);
console.log(`Unique slug total: ${slugCounts.size}`);

if (duplicates.length > 0) {
  console.log(`Duplicate slugs: ${duplicates.join(", ")}`);
}

if (failed) process.exit(1);

console.log("Tool catalog deduplication v2 verification passed.");
