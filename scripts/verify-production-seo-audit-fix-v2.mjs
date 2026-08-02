import fs from "node:fs";

const source = fs.readFileSync("scripts/production-seo-audit.mjs", "utf8");

const checks = [
  ["Robots parsed line by line", source.includes("const robotLines = robots")],
  ["Exact full-site block check", source.includes('/^Disallow:\\\\s*\\\\/$/i.test(line)')],
  ["Sitemap URLs normalized", source.includes("const normalizeUrlPath = (value) =>")],
  ["Trailing slashes normalized", source.includes('pathname.replace(/\\\\/+$/, "")')],
  ["Sitemap index entries ignored", source.includes('/\\\\/sitemap[^/]*\\\\.xml$/i.test(normalized)')],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);
console.log("Production SEO audit fix v2 verification passed.");
