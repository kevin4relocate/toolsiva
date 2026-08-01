import fs from "node:fs";

const requiredFiles = [
  "src/config/site.ts",
  "src/components/seo/SeoHead.astro",
  "src/layouts/BaseLayout.astro",
  "src/components/layout/Footer.astro",
  "src/pages/index.astro",
  "src/pages/about.astro",
  "src/pages/privacy.astro",
  "src/pages/terms.astro",
  "src/pages/404.astro",
  "src/styles/global.css",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Required project file is missing: ${file}`);
  }
}

const globalPath = "src/styles/global.css";
let globalCss = fs.readFileSync(globalPath, "utf8");
const premiumMarker = "/* Premium editorial content */";

if (!globalCss.includes(premiumMarker)) {
  const premiumCss = fs.readFileSync(
    "patches/production-premium-polish/global-append.css",
    "utf8",
  );
  globalCss = `${globalCss.trimEnd()}\n\n${premiumCss.trim()}\n`;
  fs.writeFileSync(globalPath, globalCss);
  console.log("UPDATED: premium global styles");
} else {
  console.log("SKIP: premium global styles already applied");
}

console.log("Production premium files installed.");
