import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const checks = [
  ["Audit script exists", fs.existsSync("scripts/production-seo-audit.mjs")],
  ["SEO audit npm script exists", packageJson.scripts?.["seo:audit"] === "node scripts/production-seo-audit.mjs"],
  ["Strict audit npm script exists", packageJson.scripts?.["seo:audit:strict"] === "node scripts/production-seo-audit.mjs --strict"],
  ["Launch check npm script exists", packageJson.scripts?.["launch:check"] === "npm run check && npm run build && npm run seo:audit"],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);
console.log("Production SEO audit package verification passed.");
