import fs from "node:fs";

const source = fs.readFileSync("src/data/tools.ts", "utf8");
const slugPattern =
  /(?:(?:^|[,{]\s*)slug|(?:^|[,{]\s*)["']slug["'])\s*:\s*["']([^"']+)["']/g;
const categoryPattern =
  /(?:(?:^|[,{]\s*)category|(?:^|[,{]\s*)["']category["'])\s*:\s*["'](text|developer|security|qr|calculator|converter)["']/g;

const slugs = [...source.matchAll(slugPattern)].map((match) => match[1]);
const categories = [...source.matchAll(categoryPattern)].map((match) => match[1]);

if (slugs.length !== categories.length) {
  console.error(
    `FAILED: slug count ${slugs.length} does not match category count ${categories.length}.`,
  );
  process.exit(1);
}

const routeSet = new Set();
const duplicateRoutes = [];

for (let index = 0; index < slugs.length; index += 1) {
  const route = `/tools/${categories[index]}/${slugs[index]}`;

  if (routeSet.has(route)) {
    duplicateRoutes.push(route);
  }

  routeSet.add(route);
}

if (duplicateRoutes.length > 0) {
  console.error(`FAILED: duplicate routes: ${duplicateRoutes.join(", ")}`);
  process.exit(1);
}

console.log(`OK: ${routeSet.size} unique tool routes.`);
console.log("Static route uniqueness verification passed.");
