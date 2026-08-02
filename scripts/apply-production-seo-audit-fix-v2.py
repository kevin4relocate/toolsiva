from pathlib import Path

path = Path("scripts/production-seo-audit.mjs")
source = path.read_text(encoding="utf-8")

old_robots = '''  if (!/Sitemap:\\s*https?:\\/\\//i.test(robots)) addIssue("error", "robots-missing-sitemap", "robots.txt", "No absolute Sitemap directive.");
  if (/Disallow:\\s*\\/\\s*$/im) addIssue("error", "robots-blocks-site", "robots.txt", "robots.txt blocks the entire site.");'''

new_robots = '''  const robotLines = robots
    .split(/\\r?\\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
  const hasAbsoluteSitemap = robotLines.some((line) => /^Sitemap:\\s*https?:\\/\\//i.test(line));
  const blocksEntireSite = robotLines.some((line) => /^Disallow:\\s*\\/$/i.test(line));

  if (!hasAbsoluteSitemap) {
    addIssue("error", "robots-missing-sitemap", "robots.txt", "No absolute Sitemap directive.");
  }
  if (blocksEntireSite) {
    addIssue("error", "robots-blocks-site", "robots.txt", "robots.txt blocks the entire site.");
  }'''

if old_robots not in source:
    raise SystemExit("Could not find robots audit block.")
source = source.replace(old_robots, new_robots, 1)

old_sitemap = '''const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = fs.readFileSync(file, "utf8");
  for (const match of xml.matchAll(/<loc>([\\s\\S]*?)<\\/loc>/gi)) {
    const loc = decodeEntities(match[1]);
    if (loc.startsWith(siteUrl)) sitemapUrls.add(loc.slice(siteUrl.length) || "/");
  }
}

const indexableRecords = records.filter((record) => record.route !== "/404.html" && !record.noindex);
for (const record of indexableRecords) {
  let route = record.route;
  if (route !== "/" && !route.endsWith("/")) route += "/";
  if (!sitemapUrls.has(route)) addIssue("error", "missing-from-sitemap", record.route, "Indexable page is absent from sitemap.");
}'''

new_sitemap = '''const normalizeUrlPath = (value) => {
  let pathname = value;

  try {
    if (/^https?:\\/\\//i.test(value)) {
      const parsed = new URL(value);
      const expected = new URL(siteUrl);
      if (parsed.origin !== expected.origin) return null;
      pathname = parsed.pathname;
    }
  } catch {
    return null;
  }

  pathname = pathname.split("#")[0].split("?")[0] || "/";
  pathname = pathname.replace(/\\/index\\.html$/i, "/");

  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.replace(/\\/+$/, "");
  }

  return pathname || "/";
};

const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = fs.readFileSync(file, "utf8");
  for (const match of xml.matchAll(/<loc>([\\s\\S]*?)<\\/loc>/gi)) {
    const loc = decodeEntities(match[1]);
    const normalized = normalizeUrlPath(loc);

    if (normalized && !/\\/sitemap[^/]*\\.xml$/i.test(normalized)) {
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
}'''

if old_sitemap not in source:
    raise SystemExit("Could not find sitemap audit block.")
source = source.replace(old_sitemap, new_sitemap, 1)

path.write_text(source, encoding="utf-8")
print("Fixed robots parsing and sitemap URL normalization.")
