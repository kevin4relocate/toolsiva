import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { verifyCanonicalBuild } from "../scripts/verify-canonical-routing.mjs";

function fixture({ badCanonical = false, badInternal = false, badSchema = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-canonical-"));
  const dist = path.join(root, "dist");
  const write = (name, body) => {
    const filename = path.join(root, name);
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, body);
  };
  const page = (route, link = "") => {
    const actual = badCanonical && route === "/tools/" ? "/tools" : route;
    const schema = badSchema && route === "/" ?
      { "@context": "https://schema.org", "@type": "WebSite", potentialAction: {
        "@type": "SearchAction", target: "https://toolsiva.com/tools?q={search_term_string}",
      }} :
      { "@context": "https://schema.org", "@type": "WebSite", url: "https://toolsiva.com" };
    return '<!doctype html><html><head><link rel="canonical" href="https://toolsiva.com' +
      actual + '"><meta property="og:url" content="https://toolsiva.com' + route +
      '"><script type="application/ld+json">' + JSON.stringify(schema) +
      '</script></head><body><h1>Toolsiva</h1>' + link + '</body></html>';
  };
  write("dist/index.html", page("/", '<a href="' + (badInternal ? "/tools" : "/tools/") + '">Tools</a>'));
  write("dist/tools/index.html", page("/tools/", '<a href="/">Home</a>'));
  write("dist/404.html", '<html><head><link rel="canonical" href="https://toolsiva.com/404.html">' +
    '<meta property="og:url" content="https://toolsiva.com/404.html"></head><body>Not found</body></html>');
  write("dist/sitemap-index.xml", '<sitemapindex><sitemap><loc>https://toolsiva.com/sitemap-0.xml</loc></sitemap></sitemapindex>');
  write("dist/sitemap-0.xml", '<urlset><url><loc>https://toolsiva.com/</loc></url><url><loc>https://toolsiva.com/tools/</loc></url></urlset>');
  write("wrangler.jsonc", JSON.stringify({
    name: "toolsiva", assets: { directory: "./dist", html_handling: "force-trailing-slash", not_found_handling: "404-page" },
  }));
  return { root, dist, config: path.join(root, "wrangler.jsonc") };
}

test("Cloudflare routing is explicitly configured to preserve indexed slash URLs", () => {
  const wrangler = JSON.parse(fs.readFileSync("wrangler.jsonc", "utf8"));
  const astro = fs.readFileSync("astro.config.mjs", "utf8");
  assert.equal(wrangler.assets.html_handling, "force-trailing-slash");
  assert.equal(wrangler.assets.not_found_handling, "404-page");
  assert.match(astro, /trailingSlash:\s*"always"/);
  const tool = fs.readFileSync("src/types/tool.ts", "utf8");
  assert.ok(tool.includes("tool.slug}/"));
});

test("Canonical verifier accepts matching slash URLs and sitemap while leaving 404 out", () => {
  const { root, dist, config } = fixture();
  try {
    const outcome = verifyCanonicalBuild(dist, config, 0);
    assert.deepEqual(outcome.errors, []);
    assert.equal(outcome.sitemapPages, 2);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("Verifier detects canonical mismatch, links causing needless redirects and fake search schema", () => {
  const { root, dist, config } = fixture({ badCanonical: true, badInternal: true, badSchema: true });
  try {
    const outcome = verifyCanonicalBuild(dist, config, 0);
    const issues = outcome.errors.join("\n");
    assert.match(issues, /canonical must be/);
    assert.match(issues, /link to noncanonical route/);
    assert.match(issues, /obsolete SearchAction/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("Remove unsupported SearchAction while retaining the WebSite and Organization data", () => {
  const layout = fs.readFileSync("src/layouts/BaseLayout.astro", "utf8");
  assert.doesNotMatch(layout, /search_term_string|SearchAction/);
  assert.match(layout, /"@type": "WebSite"/);
  assert.match(layout, /"@type": "Organization"/);
});

test("Blog and category schemas use canonical slashes in source", () => {
  const blog = fs.readFileSync("src/pages/blog/[slug].astro", "utf8");
  const category = fs.readFileSync("src/pages/tools/[category]/index.astro", "utf8");
  assert.ok(blog.includes("post.data.slug}/"));
  assert.ok(category.includes("category.slug}/"));
  const article = fs.readFileSync("src/content/blog/how-to-preview-markdown-online.md", "utf8");
  assert.match(article, /primaryToolPath: "\/tools\/developer\/markdown-live-preview\/"/);
});
