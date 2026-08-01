import fs from "node:fs";

const packagePath = "package.json";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
packageJson.scripts ??= {};

if (!packageJson.scripts["brand:generate"]) {
  packageJson.scripts["brand:generate"] = "node scripts/generate-brand-assets.mjs";
}

fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log("Added brand:generate npm script.");
