import fs from "node:fs";
import path from "node:path";
import { readToolRegistry } from "./tool-registry.mjs";

const strip = (value = "") => value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ").trim();

const decode = (value = "") => value.replace(/&quot;/gi, '"')
  .replace(/&#(?:39|x27);/gi, "'").replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").trim();

function filesIn(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(name) : [name];
  });
}

export function normalizeSeoPath(value, siteUrl = "https://toolsiva.com", basePath = "/") {
  if (!value || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(value)) return null;
  try {
    const base = new URL(basePath, siteUrl);
    const url = new URL(decode(value), base);
    if (url.origin !== new URL(siteUrl).origin) return null;
    let route = url.pathname.replace(/\/index\.html$/i, "").replace(/\/+$/, "");
    if (!route) route = "/";
    return route;
  } catch { return null; }
}

function routeForFile(file, dist) {
  const relative = path.relative(dist, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404.html";
  return normalizeSeoPath("/" + relative.replace(/\/index\.html$/, "").replace(/\.html$/, ""));
}

function attr(tag, name) {
  const value = tag.match(new RegExp("(?:^|\\s)" + name + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
  return decode(value?.[2] ?? "");
}

function meta(html, key, attribute = "name") {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, attribute).toLowerCase() === key.toLowerCase()) return attr(tag, "content");
  }
  return "";
}

function canonicalLink(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")) return attr(tag, "href");
  }
  return "";
}

function anchors(html) {
  return (html.match(/<a\b[^>]*>/gi) ?? []).map((tag) => attr(tag, "href")).filter(Boolean);
}

function jsonLd(html) {
  const data = [];
  const errors = [];
  for (const tag of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/application\/ld\+json/i.test(attr(tag[1], "type"))) continue;
    try {
      const value = JSON.parse(tag[2]);
      data.push(...(Array.isArray(value) ? value : [value]));
    } catch (error) { errors.push(String(error)); }
  }
  return { data, errors };
}

export function auditBuiltSite({
  projectRoot = process.cwd(),
  distDir = path.join(projectRoot, "dist"),
  siteUrl = "https://toolsiva.com",
  registry = readToolRegistry(projectRoot),
  guidance = null,
} = {}) {
  const issues = [];
  const pages = [];
  const issue = (severity, code, file, message) => issues.push({ severity, code, file, message });
  if (!fs.existsSync(distDir)) {
    issue("error", "missing-build", "dist/", "Run npm run build before the SEO audit.");
    return { issues, pages, summary: { errors: 1, warnings: 0, htmlPages: 0, toolPages: 0 } };
  }
  const htmlFiles = filesIn(distDir).filter((file) => file.endsWith(".html"));
  const pageMap = new Map();
  const titleGroups = new Map(), descriptionGroups = new Map(), canonicalGroups = new Map();
  const track = (group, value, route) => {
    if (!value) return;
    group.set(value, [...(group.get(value) ?? []), route]);
  };
  const absolute = (route) => new URL(route, siteUrl).toString();

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const route = routeForFile(file, distDir);
    if (!route) { issue("error", "invalid-build-path", file, "Cannot determine route."); continue; }
    if (pageMap.has(route)) issue("error", "duplicate-build-route", route, "Multiple HTML files generate the same normalized route.");
    const title = decode(strip(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""));
    const description = meta(html, "description");
    const robots = meta(html, "robots");
    const canonical = canonicalLink(html);
    const ogTitle = meta(html, "og:title", "property");
    const ogDescription = meta(html, "og:description", "property");
    const ogImage = meta(html, "og:image", "property");
    const twitterCard = meta(html, "twitter:card");
    const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] ?? "";
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const structured = jsonLd(html);
    const noindex = /\bnoindex\b/i.test(robots);
    const visibleText = strip(html);
    const wordCount = visibleText.split(/\s+/).filter(Boolean).length;

    if (!title) issue("error", "missing-title", route, "Missing document title.");
    if (title.length > 65) issue("warning", "long-title", route, "Title length " + title.length + ".");
    if (!description) issue("error", "missing-description", route, "Missing meta description.");
    if (description && description.length < 70) issue("warning", "short-description", route, "Description length " + description.length + ".");
    if (description.length > 170) issue("warning", "long-description", route, "Description length " + description.length + ".");
    if (!canonical) issue("error", "missing-canonical", route, "Missing canonical link.");
    if (canonical) {
      try {
        const parsed = new URL(canonical);
        if (parsed.origin !== new URL(siteUrl).origin || parsed.search || parsed.hash ||
          normalizeSeoPath(canonical, siteUrl) !== route) {
          issue("error", "incorrect-canonical", route, canonical);
        } else if (route !== "/" && route !== "/404.html" && parsed.pathname.endsWith("/")) {
          issue("warning", "noncanonical-trailing-slash", route, canonical);
        }
      } catch { issue("error", "invalid-canonical", route, canonical); }
    }
    if (h1Count !== 1) issue("error", "h1-count", route, "Expected one H1, found " + h1Count + ".");
    if (!lang) issue("warning", "missing-lang", route, "Missing html lang.");
    if (!ogTitle) issue("warning", "missing-og-title", route, "Missing og:title.");
    if (!ogDescription) issue("warning", "missing-og-description", route, "Missing og:description.");
    if (!ogImage) issue("warning", "missing-og-image", route, "Missing og:image.");
    if (!twitterCard) issue("warning", "missing-twitter-card", route, "Missing twitter:card.");
    if (route === "/404.html" && !noindex) issue("error", "indexable-404", route, "404 must have noindex.");
    if (route !== "/404.html" && noindex) issue("error", "unexpected-noindex", route, "Page is noindex.");
    for (const error of structured.errors) issue("error", "invalid-jsonld", route, error);
    if (registry.paths.has(route)) {
      const types = new Set(structured.data.flatMap((value) => Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]]));
      if (!types.has("WebApplication")) issue("error", "missing-webapplication-schema", route, "Tool must include WebApplication JSON-LD.");
      if (!types.has("BreadcrumbList")) issue("error", "missing-breadcrumb-schema", route, "Tool must include BreadcrumbList JSON-LD.");
    }

    const record = {
      route, title, description, canonical, lang, h1Count, wordCount, noindex,
      jsonLdCount: structured.data.length,
      ogTitle, ogDescription, ogImage, twitterCard, hrefs: anchors(html),
    };
    pages.push(record); pageMap.set(route, record);
    track(titleGroups, title, route);
    track(descriptionGroups, description, route);
    track(canonicalGroups, canonical, route);
  }

  for (const [name, group] of [["duplicate-title", titleGroups], ["duplicate-description", descriptionGroups], ["duplicate-canonical", canonicalGroups]]) {
    for (const [value, routes] of group) {
      if (routes.length > 1) issue(name === "duplicate-canonical" ? "error" : "warning", name, routes.join(", "), value.slice(0, 140));
    }
  }

  const inbound = new Map([...pageMap.keys()].map((route) => [route, new Set()]));
  for (const record of pages) {
    for (const href of record.hrefs) {
      const target = normalizeSeoPath(href, siteUrl, record.route);
      if (!target) continue;
      // Non-HTML static assets are not page routes.
      if (/\.(?:png|jpe?g|gif|svg|webp|ico|css|js|pdf|txt|xml|json|woff2?|zip|csv|md)$/i.test(target)) continue;
      if (!pageMap.has(target)) issue("error", "broken-internal-link", record.route, href + " -> " + target);
      else if (target !== record.route) inbound.get(target).add(record.route);
    }
  }
  for (const tool of registry.tools) {
    const route = tool.path;
    if (!pageMap.has(route)) issue("error", "missing-tool-route", route, "Catalog entry lacks a built HTML page.");
    else if ((inbound.get(route)?.size ?? 0) === 0) issue("warning", "orphan-tool-page", route, "No internal HTML page links to this tool.");
  }

  const robotsFile = path.join(distDir, "robots.txt");
  if (!fs.existsSync(robotsFile)) issue("error", "missing-robots", "robots.txt", "Missing robots.txt.");
  else {
    const robots = fs.readFileSync(robotsFile, "utf8");
    if (!/^Sitemap:\s*https?:\/\/\S+/mi.test(robots)) issue("error", "robots-missing-sitemap", "robots.txt", "Missing sitemap URL.");
    if (/^Disallow:\s*\/\s*$/mi.test(robots)) issue("error", "robots-blocks-site", "robots.txt", "Entire site disallowed.");
  }

  const sitemapFiles = filesIn(distDir).filter((file) => /^sitemap.*\.xml$/i.test(path.basename(file)));
  if (!sitemapFiles.some((file) => path.basename(file) === "sitemap-index.xml")) {
    issue("error", "missing-sitemap-index", "dist/", "Missing sitemap-index.xml.");
  }
  const sitemapUrls = new Map();
  for (const file of sitemapFiles) {
    const xml = fs.readFileSync(file, "utf8");
    if (/sitemap-index\.xml$/i.test(file)) continue;
    for (const item of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      const loc = decode(item[1]);
      const route = normalizeSeoPath(loc, siteUrl);
      if (!route) { issue("error", "external-sitemap-url", path.basename(file), loc); continue; }
      sitemapUrls.set(route, (sitemapUrls.get(route) ?? 0) + 1);
      if (route !== "/" && new URL(loc).pathname.endsWith("/")) {
        issue("warning", "sitemap-trailing-slash", path.basename(file), loc);
      }
    }
  }
  for (const record of pages) {
    if (record.route === "/404.html" || record.noindex) continue;
    if (!sitemapUrls.has(record.route)) issue("error", "missing-from-sitemap", record.route, "Indexable page is missing from sitemap.");
  }
  for (const [route, count] of sitemapUrls) {
    if (count > 1) issue("error", "duplicate-sitemap-entry", route, "Found " + count + " entries.");
    if (!pageMap.has(route)) issue("error", "orphan-sitemap-entry", route, "Sitemap URL has no built page.");
    if (route === "/404.html") issue("error", "nonindexable-sitemap-entry", route, "404 must not appear in sitemap.");
  }

  const toolPageCount = registry.tools.filter((tool) => pageMap.has(tool.path)).length;
  if (toolPageCount !== registry.tools.length) {
    issue("error", "unexpected-tool-count", "dist/", "Built " + toolPageCount + " of " + registry.tools.length + " catalog tools.");
  }

  const guidanceCount = guidance?.count ?? null;
  const errors = issues.filter((item) => item.severity === "error");
  const warnings = issues.filter((item) => item.severity === "warning");
  return {
    generatedAt: new Date().toISOString(), siteUrl,
    summary: {
      htmlPages: htmlFiles.length, expectedToolPages: registry.tools.length,
      toolPages: toolPageCount, categories: registry.categories.length,
      sitemapFiles: sitemapFiles.length, sitemapUrls: sitemapUrls.size,
      specializedGuides: guidanceCount,
      inboundLinkedTools: registry.tools.filter((tool) => (inbound.get(tool.path)?.size ?? 0) > 0).length,
      errors: errors.length, warnings: warnings.length,
    },
    categoryCounts: registry.counts,
    issues,
    pages: pages.map(({ hrefs, ...page }) => ({ ...page, inboundLinks: inbound.get(page.route)?.size ?? 0 })),
  };
}
