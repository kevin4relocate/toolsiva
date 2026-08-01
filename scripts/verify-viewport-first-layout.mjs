import fs from "node:fs";

const page = fs.readFileSync(
  "src/pages/tools/[category]/[slug].astro",
  "utf8",
);
const text = fs.readFileSync(
  "src/components/tools/TextToolWorkspace.astro",
  "utf8",
);
const developer = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);
const security = fs.readFileSync(
  "src/components/tools/SecurityToolWorkspace.astro",
  "utf8",
);

const checks = [
  [
    "Tool page uses wide viewport layout",
    page.includes('max-w-[92rem]') &&
      page.includes("py-6") &&
      page.includes("lg:py-8"),
  ],
  [
    "Header is compact",
    page.includes('header class="mb-5"') &&
      page.includes("sm:text-4xl"),
  ],
  [
    "Text workspace uses viewport-aware height",
    text.includes("clamp(18rem,48vh,34rem)") ||
      text.includes("clamp(17rem,46vh,32rem)"),
  ],
  [
    "Developer workspace uses viewport-aware height",
    developer.includes("clamp(18rem,50vh,35rem)"),
  ],
  [
    "Security workspace uses viewport-aware height",
    security.includes("clamp(14rem,38vh,26rem)") ||
      security.includes("clamp(13rem,36vh,24rem)"),
  ],
  [
    "Workspaces use compact radius",
    text.includes("rounded-2xl") &&
      developer.includes("rounded-2xl") &&
      security.includes("rounded-2xl"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Viewport-first layout verification passed.");
