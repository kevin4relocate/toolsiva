import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Cloudflare Workers Static Assets uses force-trailing-slash in wrangler.jsonc.
// Each indexable static route must agree in its canonical, sitemap, links and JSON-LD.
const ORIGIN = "https://toolsiva.com";

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}
function attr(tag, name) {
  const match = tag.match(new RegExp("(?:^|\\s)" + name + "\\s*=\\s*([\"'])(.*?)\\1", "i"));
  return match?.[2] ?? "";
}
function staticPageRoute(file, dist) {
  const relative = path.relative(dist, file).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404.html";
  if (relative.endsWith("/index.html")) return "/" + relative.slice(0, -"/index.html".length) + "/";
  return "/" + relative.replace(/\.html$/, "/");
}
function normalized(pathname) {
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "") + "/";
}

export function verifyCanonicalBuild(dist = path.resolve("dist"), configFile = path.resolve("wrangler.jsonc"), minimumPages = 100) {
  const errors = [];
  const add = (message) => errors.push(message);
  const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
  if (config.assets?.html_handling !== "force-trailing-slash") {
    add("Wrangler must enforce force-trailing-slash to match canonical URLs.");
  }
  if (config.assets?.not_found_handling !== "404-page") {
    add("Wrangler must return proper 404 statuses for unknown static routes.");
  }
  const htmlFiles = listFiles(dist).filter((file) => file.endsWith(".html"));
  if (htmlFiles.length < minimumPages) add("Expected a full Astro build, found only " + htmlFiles.length + " HTML pages.");
  const routes = new Map(htmlFiles.map((file) => [staticPageRoute(file, dist), file]));
  const canonicalList = new Set();

  for (const [route, file] of routes) {
    const html = fs.readFileSync(file, "utf8");
    const links = html.match(/<link\b[^>]*>/gi) ?? [];
    const canonicalTag = links.find((tag) => attr(tag, "rel").toLowerCase().split(/\s+/).includes("canonical"));
    const canonical = canonicalTag ? attr(canonicalTag, "href") : "";
    const expected = new URL(route, ORIGIN).href;
    if (canonical !== expected) add(route + ": canonical must be " + expected + ", got " + canonical);
    if (canonicalList.has(canonical)) add(route + ": duplicate canonical " + canonical);
    canonicalList.add(canonical);

    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
      if (attr(tag, "property") === "og:url" && attr(tag, "content") !== expected) {
        add(route + ": Open Graph URL differs from canonical.");
      }
    }
    // Script text often includes template strings resembling <a href>; remove it first.
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
    for (const tag of visible.match(/<a\b[^>]*>/gi) ?? []) {
      const href = attr(tag, "href");
      if (!href || href.startsWith("#") || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
      let link;
      try { link = new URL(href, new URL(route, ORIGIN)); } catch { continue; }
      if (link.origin !== ORIGIN) continue;
      const destination = normalized(link.pathname);
      if (routes.has(destination) && link.pathname !== destination) {
        add(route + ": link to noncanonical route " + href + " (expected " + destination + ")");
      }
    }

    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (attr(m[1], "type") !== "application/ld+json") continue;
      let json;
      try { json = JSON.parse(m[2]); }
      catch { add(route + ": invalid JSON-LD"); continue; }
      const visit = (item, key = "") => {
        if (Array.isArray(item)) { for (const value of item) visit(value, key); return; }
        if (!item || typeof item !== "object") {
          if (typeof item !== "string" || !["url", "item", "mainEntityOfPage"].includes(key)) return;
          let u;
          try { u = new URL(item); } catch { return; }
          if (u.origin !== ORIGIN || u.pathname === "/" || /\.(?:svg|png|html)$/i.test(u.pathname)) return;
          if (routes.has(normalized(u.pathname)) && u.pathname !== normalized(u.pathname)) {
            add(route + ": JSON-LD " + key + " uses noncanonical URL " + item);
          }
          return;
        }
        if (item["@type"] === "SearchAction" || Object.hasOwn(item, "potentialAction")) {
          add(route + ": obsolete SearchAction must not publish /tools?q={search_term_string}.");
        }
        for (const [k, v] of Object.entries(item)) visit(v, k);
      };
      visit(json);
    }
  }

  const sitemapFiles = listFiles(dist).filter((file) =>
    /^sitemap.*\.xml$/i.test(path.basename(file)) && path.basename(file) !== "sitemap-index.xml");
  if (!sitemapFiles.length) add("No generated sitemap pages.");
  const sitemapSet = new Set();
  for (const file of sitemapFiles) {
    const xml = fs.readFileSync(file, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      const url = new URL(m[1].replaceAll("&amp;", "&"));
      if (url.origin !== ORIGIN) { add("Sitemap has external URL: " + url); continue; }
      if (sitemapSet.has(url.href)) add("Duplicate sitemap URL: " + url.href);
      sitemapSet.add(url.href);
      if (!routes.has(url.pathname)) add("Sitemap page not generated: " + url.pathname);
    }
  }
  for (const route of routes.keys()) {
    if (route === "/404.html") continue;
    if (!sitemapSet.has(new URL(route, ORIGIN).href)) add("Missing canonical sitemap entry: " + route);
  }
  const index = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  if (index.includes("search_term_string")) {
    add("Homepage still emits the obsolete /tools?q={search_term_string} SearchAction.");
  }
  return { errors, htmlPages: htmlFiles.length, sitemapPages: sitemapSet.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = verifyCanonicalBuild();
    console.log("Canonical routing: " + result.htmlPages + " HTML pages, " +
      result.sitemapPages + " sitemap URLs, " + result.errors.length + " errors.");
    if (result.errors.length) {
      console.error(result.errors.slice(0, 100).map((issue) => "- " + issue).join("\n"));
      if (result.errors.length > 100) console.error("... " + (result.errors.length - 100) + " more.");
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Canonical routing verification failed:", error);
    process.exitCode = 1;
  }
}
