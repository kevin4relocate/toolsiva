import fs from "node:fs";

const page = fs.readFileSync("src/pages/tools/[category]/[slug].astro", "utf8");
const text = fs.readFileSync("src/components/tools/TextToolWorkspace.astro", "utf8");
const developer = fs.readFileSync("src/components/tools/DeveloperToolWorkspace.astro", "utf8");
const security = fs.readFileSync("src/components/tools/SecurityToolWorkspace.astro", "utf8");
const header = fs.readFileSync("src/components/layout/Header.astro", "utf8");

const checks = [
  ["Tool page uses compact width", page.includes('max-w-[84rem]')],
  ["Tool header is compact", page.includes('header class="mb-4"') && page.includes('text-2xl font-black')],
  ["Below-tool sections are compact", page.includes('section class="mt-10"') && page.includes('text-xl font-bold text-white')],
  ["Text workspace is more compact", text.includes('clamp(14rem,36vh,24rem)') && text.includes('p-3 sm:p-4')],
  ["Developer workspace is more compact", developer.includes('clamp(14rem,38vh,24rem)') && developer.includes('p-3 sm:p-4')],
  ["Security workspace is more compact", security.includes('clamp(11rem,30vh,18rem)') && security.includes('p-3 sm:p-4')],
  ["Header imports tools data", header.includes('import { tools } from "@/data/tools";')],
  ["Header builds category dropdowns", header.includes('categoryEntries.map((category) => (') && header.includes('View all {category.name}')],
  ["Header has mobile menu", header.includes('Menu') && header.includes('lg:hidden')],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? 'OK' : 'FAILED'}: ${name}`);
  if (!passed) failed = true;
}
if (failed) process.exit(1);
console.log('Compact layout + header navigation verification passed.');
