import fs from "node:fs";

const about = fs.readFileSync("src/pages/about.astro", "utf8");
const privacy = fs.readFileSync("src/pages/privacy.astro", "utf8");
const terms = fs.readFileSync("src/pages/terms.astro", "utf8");
const accessibility = fs.readFileSync("src/pages/accessibility.astro", "utf8");
const page = fs.readFileSync("src/pages/tools/[category]/[slug].astro", "utf8");
const seoContent = fs.readFileSync("src/data/toolSeoContent.ts", "utf8");

const checks = [
  ["About intro uses wider layout", about.includes("max-w-5xl")],
  ["Privacy email spacing fixed", privacy.includes('to{" "}')],
  ["Terms email spacing fixed", terms.includes('to{" "}')],
  ["Accessibility email spacing fixed", accessibility.includes('to{" "}')],
  ["Privacy has expanded sections", privacy.includes("14. Policy updates")],
  ["Terms has expanded sections", terms.includes("16. Contact")],
  ["Tool SEO component connected", page.includes("<ToolSeoContent tool={tool} />")],
  ["Related tools is highlighted", page.includes("Continue working")],
  ["Category-specific content exists", seoContent.includes("categoryContext")],
  ["Brand generator exists", fs.existsSync("scripts/generate-brand-assets.mjs")],
  ["Brand config exists", fs.existsSync("brand/brand.config.mjs")],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}
if (failed) process.exit(1);
console.log("Premium content + branding + SEO v2 verification passed.");
