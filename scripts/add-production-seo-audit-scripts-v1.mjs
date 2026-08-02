import fs from "node:fs";

const packagePath = "package.json";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
packageJson.scripts ??= {};
packageJson.scripts["seo:audit"] = "node scripts/production-seo-audit.mjs";
packageJson.scripts["seo:audit:strict"] = "node scripts/production-seo-audit.mjs --strict";
packageJson.scripts["launch:check"] = "npm run check && npm run build && npm run seo:audit";
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
console.log("Added seo:audit, seo:audit:strict and launch:check scripts.");
