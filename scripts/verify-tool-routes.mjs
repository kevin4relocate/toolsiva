import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readToolRegistry } from "./lib/tool-registry.mjs";

export const EXPECTED_TOOL_COUNT = readToolRegistry().tools.length;
const SITE_ORIGIN = "https://toolsiva.com";

function getHtmlFile(distDir, route) {
  const relative = route.replace(/^\/+/, "");
  const candidates = [
    path.join(distDir, relative, "index.html"),
    path.join(distDir, relative + ".html"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function allFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? allFiles(full) : [full];
  });
}

function canonicalFromHtml(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1] ?? "";
    if (!rel.toLowerCase().split(/\s+/).includes("canonical")) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? "";
  }
  return "";
}

function normalizeRoute(value) {
  try {
    const url = new URL(value, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return null;
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

export function verifyBuiltRoutes({ distDir, registry, expectedCount = EXPECTED_TOOL_COUNT }) {
  const errors = [];
  const seen = new Set();

  if (registry.tools.length !== expectedCount) {
    errors.push("Expected " + expectedCount + " catalog tools, found " + registry.tools.length + ".");
  }
  if (registry.paths.size !== registry.tools.length) {
    errors.push("The tool registry contains duplicate category/slug routes.");
  }
  for (const category of registry.categories) {
    if (registry.counts[category] < 1) errors.push("Category has no tools: " + category);
    if (!getHtmlFile(distDir, "/tools/" + category)) {
      errors.push("Missing built category page: /tools/" + category);
    }
  }
  if (!getHtmlFile(distDir, "/tools")) errors.push("Missing built /tools index page.");

  for (const tool of registry.tools) {
    const htmlFile = getHtmlFile(distDir, tool.path);
    if (!htmlFile) {
      errors.push("Missing built tool page: " + tool.path);
      continue;
    }
    seen.add(tool.path);
    const html = fs.readFileSync(htmlFile, "utf8");
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      errors.push(tool.path + ": expected 1 H1, found " + h1Count);
    }
    const canonical = canonicalFromHtml(html);
    if (normalizeRoute(canonical) !== tool.path) {
      errors.push(tool.path + ": wrong or missing canonical: " + canonical);
    }
    if (!html.includes("data-markdown-live-preview") || tool.slug !== "markdown-live-preview") {
      const hasMode = html.includes('data-mode="' + tool.slug + '"') ||
        html.includes("data-mode='" + tool.slug + "'");
      const hasWorkspace = /\bdata-(?:text-tool|developer-tool|security-tool|qr-workspace|calculator|converter|expansion-tool|new-text-tool|high-value-tool|content-tools|simple-tool)\b/.test(html);
      if (!hasMode || !hasWorkspace) errors.push(tool.path + ": missing interactive workspace.");
    }
  }

  const extraPages = allFiles(path.join(distDir, "tools"))
    .filter((file) => file.endsWith(".html"))
    .map((file) => path.relative(distDir, file).replaceAll(path.sep, "/"))
    .map((relative) => relative.replace(/\/index\.html$/, "").replace(/\.html$/, ""))
    .filter((route) => /^tools\/[^/]+\/[^/]+$/.test(route))
    .map((route) => "/" + route)
    .filter((route) => !registry.paths.has(route));
  for (const extra of extraPages) errors.push("Orphan built tool page not in catalog: " + extra);

  const sitemapFiles = allFiles(distDir).filter((file) => /^sitemap.*\.xml$/i.test(path.basename(file)));
  if (!sitemapFiles.some((file) => path.basename(file) === "sitemap-index.xml")) {
    errors.push("Missing sitemap-index.xml.");
  }
  const indexed = new Map();
  for (const file of sitemapFiles) {
    const xml = fs.readFileSync(file, "utf8");
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      const route = normalizeRoute(match[1].replaceAll("&amp;", "&"));
      if (!route || !route.startsWith("/tools/")) continue;
      indexed.set(route, (indexed.get(route) || 0) + 1);
    }
  }
  for (const tool of registry.tools) {
    if (!indexed.has(tool.path)) errors.push("Missing from sitemap: " + tool.path);
    if ((indexed.get(tool.path) || 0) > 1) errors.push("Duplicate in sitemap: " + tool.path);
  }
  for (const route of indexed.keys()) {
    if (/^\/tools\/[^/]+\/[^/]+$/.test(route) && !registry.paths.has(route)) {
      errors.push("Unexpected sitemap tool route: " + route);
    }
  }

  return {
    errors,
    catalogCount: registry.tools.length,
    builtToolCount: seen.size,
    sitemapToolCount: registry.tools.filter((tool) => indexed.has(tool.path)).length,
    categoryCounts: registry.counts,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const registry = readToolRegistry();
    const result = verifyBuiltRoutes({ distDir: path.resolve("dist"), registry });
    console.log("Tools: " + result.builtToolCount + "/" + EXPECTED_TOOL_COUNT);
    console.log("Sitemap tool URLs: " + result.sitemapToolCount + "/" + EXPECTED_TOOL_COUNT);
    console.log("Category counts: " + JSON.stringify(result.categoryCounts));
    if (result.errors.length > 0) {
      console.error(result.errors.map((item) => "- " + item).join("\n"));
      process.exitCode = 1;
    } else {
      console.log("All tool pages, workspaces, canonical URLs and sitemap entries verified.");
    }
  } catch (error) {
    console.error("Tool route verification failed:", error);
    process.exitCode = 1;
  }
}
