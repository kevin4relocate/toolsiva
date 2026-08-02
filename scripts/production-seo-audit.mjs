import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const expectedPages = Number.parseInt(process.env.EXPECTED_PAGES ?? "123", 10);
const expectedToolPages = Number.parseInt(process.env.EXPECTED_TOOL_PAGES ?? "108", 10);
const siteUrl = (process.env.SITE_URL ?? "https://toolsiva.com").replace(/\/+$/, "");

const failOnWarnings = process.argv.includes("--strict");
const jsonOutput = process.argv.includes("--json");

const issues = [];
const records = [];

const addIssue = (severity, code, file, message) => {
  issues.push({ severity, code, file, message });
};

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
};

const decodeEntities = (value = "") =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const getAttr = (tag, attr) => {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? decodeEntities(match[1]) : "";
};

const extractMetaContent = (html, selector) => {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (selector.name && getAttr(tag, "name").toLowerCase() === selector.name.toLowerCase()) {
      return getAttr(tag, "content");
    }
    if (selector.property && getAttr(tag, "property").toLowerCase() === selector.property.toLowerCase()) {
      return getAttr(tag, "content");
    }
  }
  return "";
};

const extractLinkHref = (html, relValue) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const rel = getAttr(tag, "rel").toLowerCase().split(/\s+/);
    if (rel.includes(relValue.toLowerCase())) return getAttr(tag, "href");
  }
  return "";
};

const stripTags = (value = "") =>
  decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

const routeFromHtmlFile = (file) => {
  const rel = path.relative(distDir, file).replaceAll(path.sep, "/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404.html";
  return "/" + rel.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
};

const htmlFiles = fs.existsSync(distDir)
  ? walk(distDir).filter((file) => file.endsWith(".html"))
  : [];

if (!fs.existsSync(distDir)) {
  console.error("dist/ does not exist. Run npm run build first.");
  process.exit(1);
}

const titleMap = new Map();
const descriptionMap = new Map();
const canonicalMap = new Map();
const allRoutes = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const route = routeFromHtmlFile(file);
  allRoutes.add(route);

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = stripTags(titleMatch?.[1] ?? "");
  const description = extractMetaContent(html, { name: "description" });
  const robots = extractMetaContent(html, { name: "robots" });
  const canonical = extractLinkHref(html, "canonical");
  const ogTitle = extractMetaContent(html, { property: "og:title" });
  const ogDescription = extractMetaContent(html, { property: "og:description" });
  const ogImage = extractMetaContent(html, { property: "og:image" });
  const twitterCard = extractMetaContent(html, { name: "twitter:card" });
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const langMatch = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i);
  const lang = langMatch?.[1] ?? "";
  const jsonLdCount = (html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi) ?? []).length;
  const visibleText = stripTags(html);
  const wordCount = visibleText ? visibleText.split(/\s+/).filter(Boolean).length : 0;
  const noindex = /\bnoindex\b/i.test(robots);

  const hrefs = [];
  for (const tag of html.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi) ?? []) {
    const href = getAttr(tag, "href");
    if (href) hrefs.push(href);
  }

  records.push({
    file: path.relative(projectRoot, file),
    route, title, description, canonical, h1Count, lang, wordCount,
    jsonLdCount, noindex, ogTitle, ogDescription, ogImage, twitterCard, hrefs,
  });

  if (!title) addIssue("error", "missing-title", route, "Missing <title>.");
  if (title.length > 65) addIssue("warning", "long-title", route, `Title is ${title.length} characters.`);
  if (!description) addIssue("error", "missing-description", route, "Missing meta description.");
  if (description && description.length < 70) addIssue("warning", "short-description", route, `Meta description is ${description.length} characters.`);
  if (description && description.length > 170) addIssue("warning", "long-description", route, `Meta description is ${description.length} characters.`);
  if (!canonical) addIssue("error", "missing-canonical", route, "Missing canonical URL.");
  if (canonical && !canonical.startsWith(siteUrl)) addIssue("warning", "unexpected-canonical-host", route, canonical);
  if (h1Count !== 1) addIssue("error", "h1-count", route, `Expected exactly 1 H1, found ${h1Count}.`);
  if (!lang) addIssue("warning", "missing-lang", route, "Missing html lang attribute.");
  if (!ogTitle) addIssue("warning", "missing-og-title", route, "Missing og:title.");
  if (!ogDescription) addIssue("warning", "missing-og-description", route, "Missing og:description.");
  if (!ogImage) addIssue("warning", "missing-og-image", route, "Missing og:image.");
  if (!twitterCard) addIssue("warning", "missing-twitter-card", route, "Missing twitter:card.");
  if (route.startsWith("/tools/") && !route.endsWith("/tools/") && wordCount < 180) {
    addIssue("warning", "thin-tool-page", route, `Tool page has about ${wordCount} visible words.`);
  }
  if (route !== "/404.html" && noindex) addIssue("error", "unexpected-noindex", route, "Page contains noindex.");

  if (title) {
    const list = titleMap.get(title) ?? [];
    list.push(route);
    titleMap.set(title, list);
  }
  if (description) {
    const list = descriptionMap.get(description) ?? [];
    list.push(route);
    descriptionMap.set(description, list);
  }
  if (canonical) {
    const list = canonicalMap.get(canonical) ?? [];
    list.push(route);
    canonicalMap.set(canonical, list);
  }
}

for (const [title, routes] of titleMap) {
  if (routes.length > 1) addIssue("warning", "duplicate-title", routes.join(", "), title);
}
for (const [description, routes] of descriptionMap) {
  if (routes.length > 1) addIssue("warning", "duplicate-description", routes.join(", "), description.slice(0, 120));
}
for (const [canonical, routes] of canonicalMap) {
  if (routes.length > 1) addIssue("error", "duplicate-canonical", routes.join(", "), canonical);
}

const normalizeInternalHref = (href) => {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return null;
  let value = href;
  if (/^https?:\/\//i.test(value)) {
    if (!value.startsWith(siteUrl)) return null;
    value = value.slice(siteUrl.length) || "/";
  }
  value = value.split("#")[0].split("?")[0] || "/";
  if (!value.startsWith("/")) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(value) && !value.endsWith(".html")) return null;
  if (value !== "/" && !value.endsWith("/") && !value.endsWith(".html")) value += "/";
  return value;
};

for (const record of records) {
  for (const href of record.hrefs) {
    const normalized = normalizeInternalHref(href);
    if (!normalized) continue;
    if (!allRoutes.has(normalized) && normalized !== "/404.html") {
      addIssue("error", "broken-internal-link", record.route, `${href} -> ${normalized}`);
    }
  }
}

const robotsPath = path.join(distDir, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  addIssue("error", "missing-robots", "dist/robots.txt", "robots.txt was not generated.");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  const robotLines = robots
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
  const hasAbsoluteSitemap = robotLines.some((line) => /^Sitemap:\s*https?:\/\//i.test(line));
  const blocksEntireSite = robotLines.some((line) => /^Disallow:\s*\/$/i.test(line));

  if (!hasAbsoluteSitemap) {
    addIssue("error", "robots-missing-sitemap", "robots.txt", "No absolute Sitemap directive.");
  }
  if (blocksEntireSite) {
    addIssue("error", "robots-blocks-site", "robots.txt", "robots.txt blocks the entire site.");
  }
}

const sitemapFiles = walk(distDir).filter((file) => /sitemap.*\.xml$/i.test(path.basename(file)));
if (!sitemapFiles.length) {
  addIssue("error", "missing-sitemap", "dist/", "No sitemap XML file found.");
}

const normalizeUrlPath = (value) => {
  let pathname = value;

  try {
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);
      const expected = new URL(siteUrl);
      if (parsed.origin !== expected.origin) return null;
      pathname = parsed.pathname;
    }
  } catch {
    return null;
  }

  pathname = pathname.split("#")[0].split("?")[0] || "/";
  pathname = pathname.replace(/\/index\.html$/i, "/");

  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "");
  }

  return pathname || "/";
};

const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = fs.readFileSync(file, "utf8");
  for (const match of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) {
    const loc = decodeEntities(match[1]);
    const normalized = normalizeUrlPath(loc);

    if (normalized && !/\/sitemap[^/]*\.xml$/i.test(normalized)) {
      sitemapUrls.add(normalized);
    }
  }
}

const indexableRecords = records.filter((record) => record.route !== "/404.html" && !record.noindex);
for (const record of indexableRecords) {
  const route = normalizeUrlPath(record.route);
  if (route && !sitemapUrls.has(route)) {
    addIssue("error", "missing-from-sitemap", record.route, "Indexable page is absent from sitemap.");
  }
}

const toolPageCount = records.filter((record) => /^\/tools\/[^/]+\/[^/]+\/$/.test(record.route)).length;
if (htmlFiles.length !== expectedPages) {
  addIssue("error", "unexpected-page-count", "dist/", `Expected ${expectedPages} HTML pages, found ${htmlFiles.length}.`);
}
if (toolPageCount !== expectedToolPages) {
  addIssue("error", "unexpected-tool-count", "dist/", `Expected ${expectedToolPages} tool pages, found ${toolPageCount}.`);
}

const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

const report = {
  generatedAt: new Date().toISOString(),
  siteUrl,
  summary: {
    htmlPages: htmlFiles.length,
    toolPages: toolPageCount,
    sitemapFiles: sitemapFiles.length,
    sitemapUrls: sitemapUrls.size,
    errors: errors.length,
    warnings: warnings.length,
  },
  issues,
  pages: records.map(({ hrefs, ...record }) => record),
};

fs.mkdirSync(path.join(projectRoot, "reports"), { recursive: true });
fs.writeFileSync(path.join(projectRoot, "reports", "production-seo-audit.json"), JSON.stringify(report, null, 2));

const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = [
  ["Severity", "Code", "Page/File", "Message"].map(csvEscape).join(","),
  ...issues.map((issue) => [issue.severity, issue.code, issue.file, issue.message].map(csvEscape).join(",")),
].join("\n");
fs.writeFileSync(path.join(projectRoot, "reports", "production-seo-issues.csv"), csv);

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("===== TOOLSIVA PRODUCTION SEO AUDIT =====");
  console.log(`HTML pages: ${htmlFiles.length}/${expectedPages}`);
  console.log(`Tool pages: ${toolPageCount}/${expectedToolPages}`);
  console.log(`Sitemap files: ${sitemapFiles.length}`);
  console.log(`Sitemap URLs: ${sitemapUrls.size}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  const printGroup = (label, list) => {
    if (!list.length) return;
    console.log(`\n${label}`);
    for (const item of list) console.log(`- [${item.code}] ${item.file}: ${item.message}`);
  };

  printGroup("ERRORS", errors);
  printGroup("WARNINGS", warnings);

  console.log("\nReports:");
  console.log("- reports/production-seo-audit.json");
  console.log("- reports/production-seo-issues.csv");
}

if (errors.length || (failOnWarnings && warnings.length)) process.exit(1);
console.log("\nProduction SEO audit passed.");
