import fs from "node:fs";

const source = fs.readFileSync("src/data/tools.ts", "utf8");
const required = [
  "json-formatter",
  "json-validator",
  "json-minifier",
  "json-escape",
  "json-unescape",
  "json-to-csv",
  "json-to-xml",
  "json-to-yaml",
  "base64-encode",
  "base64-decode",
];

const missing = required.filter((slug) => !source.includes(`slug: "${slug}"`));

if (missing.length > 0) {
  console.error(`Missing developer tools: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Package 003 registry verification passed.");
