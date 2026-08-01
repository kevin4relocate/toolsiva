import fs from "node:fs";

const registry = fs.readFileSync("src/data/tools.ts", "utf8");
const page = fs.readFileSync("src/pages/tools/[category]/[slug].astro", "utf8");
const workspace = fs.readFileSync(
  "src/components/tools/SecurityToolWorkspace.astro",
  "utf8",
);
const config = fs.readFileSync("astro.config.mjs", "utf8");

const slugs = [
  "password-generator",
  "passphrase-generator",
  "random-string-generator",
  "secure-token-generator",
  "password-strength-checker",
  "sha256-hash-generator",
  "sha512-hash-generator",
  "hmac-generator",
  "basic-auth-generator",
  "hash-compare",
];

const checks = [
  ["All security registry entries", slugs.every((slug) => registry.includes(`slug: "${slug}"`))],
  ["Security workspace import", page.includes("SecurityToolWorkspace")],
  ["Security workspace render", page.includes('tool.category === "security"')],
  ["Crypto random API", workspace.includes("crypto.getRandomValues")],
  ["Web Crypto digest", workspace.includes("crypto.subtle.digest")],
  ["Web Crypto HMAC", workspace.includes("crypto.subtle.sign")],
  ["Two action bars", (workspace.match(/data-actions/g) ?? []).length === 2],
  ["Cloudflare root config", config.includes('site: "https://toolsiva.com"') && !config.includes("base:")],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);
console.log("Package 005 verification passed.");
