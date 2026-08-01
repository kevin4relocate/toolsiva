import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const footer = read("src/components/layout/Footer.astro");
const seo = read("src/components/seo/SeoHead.astro");
const privacy = read("src/pages/privacy.astro");
const terms = read("src/pages/terms.astro");
const layout = read("src/layouts/BaseLayout.astro");
const site = read("src/config/site.ts");
const home = read("src/pages/index.astro");
const robots = read("public/robots.txt");

const checks = [
  ["Footer year is automatic", footer.includes("new Date().getFullYear()")],
  ["Footer copyright is complete", footer.includes("All rights reserved")],
  ["Footer has company links", footer.includes('href="/contact"') && footer.includes('href="/accessibility"')],
  ["Footer has legal links", footer.includes('href="/disclaimer"') && footer.includes('href="/privacy"')],
  ["SEO has social image", seo.includes('property="og:image"') && seo.includes('name="twitter:image"')],
  ["SEO has default robots", seo.includes('name="robots"') && seo.includes("max-image-preview:large")],
  ["SEO has canonical", seo.includes('rel="canonical"')],
  ["Website structured data exists", layout.includes('"@type": "WebSite"')],
  ["Organization structured data exists", layout.includes('"@type": "Organization"')],
  ["Skip link exists", layout.includes("Skip to main content")],
  ["Privacy is not placeholder", !privacy.includes("foundation uses placeholder") && privacy.includes("Information processed inside your browser")],
  ["Terms are not placeholder", !terms.includes("placeholder") && terms.includes("Limitation of liability")],
  ["Contact email is configurable", site.includes("contactEmail")],
  ["Premium homepage categories exist", home.includes('id="categories"')],
  ["Robots points to sitemap", robots.includes("sitemap-index.xml")],
  ["Social image exists", fs.existsSync("public/social/toolsiva-default.png")],
  ["Contact page exists", fs.existsSync("src/pages/contact.astro")],
  ["Disclaimer page exists", fs.existsSync("src/pages/disclaimer.astro")],
  ["Accessibility page exists", fs.existsSync("src/pages/accessibility.astro")],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);
console.log("Production premium polish verification passed.");
