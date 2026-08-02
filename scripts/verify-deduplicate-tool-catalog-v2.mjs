import fs from "node:fs";

const source = fs.readFileSync("src/data/tools.ts", "utf8");
const slugs = [...source.matchAll(/(?:["']?slug["']?)\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const categories = [...source.matchAll(/(?:["']?category["']?)\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const uniqueSlugs = new Set(slugs);

const counts = categories.reduce((result, category) => {
  result[category] = (result[category] ?? 0) + 1;
  return result;
}, {});

const expected = {
  text: 33,
  developer: 24,
  security: 11,
  qr: 10,
  calculator: 20,
  converter: 20,
};

let failed = false;
const check = (label, passed) => {
  console.log(`${passed ? "OK" : "FAILED"}: ${label}`);
  if (!passed) failed = true;
};

check("No duplicate tool slugs", uniqueSlugs.size === slugs.length);
for (const [category, expectedCount] of Object.entries(expected)) {
  check(`${expectedCount} ${category} tools remain`, counts[category] === expectedCount);
}
check("Exactly 118 unique tools", uniqueSlugs.size === 118);

console.log(
  "Category totals:",
  Object.keys(expected).map((category) => `${category}=${counts[category] ?? 0}`).join(", "),
);
console.log("Unique slug total:", uniqueSlugs.size);

if (failed) process.exit(1);
console.log("Tool catalog verification passed.");
