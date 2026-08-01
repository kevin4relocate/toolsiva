import fs from "node:fs";

const registry = fs.readFileSync("src/data/tools.ts", "utf8");
const workspace = fs.readFileSync("src/components/tools/DeveloperToolWorkspace.astro", "utf8");

const slugs = [
  "url-encode",
  "url-decode",
  "html-encode",
  "html-decode",
  "xml-formatter",
  "xml-validator",
  "yaml-validator",
  "uuid-generator",
  "jwt-decoder",
  "unix-timestamp-converter",
];

const missingSlugs = slugs.filter((slug) => !registry.includes(`slug: "${slug}"`));
const missingModes = slugs.filter((slug) => !workspace.includes(`case "${slug}"`));

if (missingSlugs.length || missingModes.length) {
  if (missingSlugs.length) console.error(`Missing registry slugs: ${missingSlugs.join(", ")}`);
  if (missingModes.length) console.error(`Missing workspace modes: ${missingModes.join(", ")}`);
  process.exit(1);
}

console.log("Package 004 verification passed.");
