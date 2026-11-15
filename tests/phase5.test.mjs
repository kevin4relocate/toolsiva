import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import ts from "typescript";
import { readToolRegistry } from "../scripts/lib/tool-registry.mjs";
import { auditBuiltSite, normalizeSeoPath } from "../scripts/lib/seo-audit.mjs";
import usageNotes from "../src/data/toolUsageNotes.json" with { type: "json" };

const registry = readToolRegistry();

function prioritySlugs() {
  const file = "src/data/toolSeoContent.ts";
  const ast = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  for (const stmt of ast.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== "priorityToolContent") continue;
      if (!decl.initializer || !ts.isObjectLiteralExpression(decl.initializer)) throw new Error("Cannot inspect priority content.");
      return decl.initializer.properties.map((entry) => entry.name.text);
    }
  }
  throw new Error("Priority content registry missing.");
}

test("All 123 catalog tools have distinct priority guidance or task-specific usage notes", () => {
  const priority = prioritySlugs();
  const notes = Object.keys(usageNotes);
  const expected = new Set(registry.tools.map((tool) => tool.slug));
  assert.equal(registry.tools.length, 123);
  assert.equal(priority.length, 20);
  assert.equal(notes.length, 103);
  assert.equal(new Set([...priority, ...notes]).size, 123);
  assert.ok(priority.every((slug) => expected.has(slug) && !notes.includes(slug)));
  assert.ok(notes.every((slug) => expected.has(slug)));
  for (const [slug, note] of Object.entries(usageNotes)) {
    for (const name of ["how", "tryThis", "watch"]) {
      assert.ok(typeof note[name] === "string" && note[name].length >= 55,
        slug + ": missing or insufficient " + name);
    }
  }
});

test("SEO template no longer repeats filler paragraphs", () => {
  const source = fs.readFileSync("src/data/toolSeoContent.ts", "utf8");
  assert.match(source, /toolUsageNotes/);
  assert.match(source, /note\.tryThis/);
  assert.doesNotMatch(source, /Use this tool for a quick result without installing/);
  assert.doesNotMatch(source, /Keep a copy of important original data/);
});

test("SEO paths normalize trailing slashes, fragments and external hosts", () => {
  assert.equal(normalizeSeoPath("https://toolsiva.com/tools/text/word-counter/"), "/tools/text/word-counter");
  assert.equal(normalizeSeoPath("/tools/text/word-counter?utm_source=x"), "/tools/text/word-counter");
  assert.equal(normalizeSeoPath("/blog/guide/index.html"), "/blog/guide");
  assert.equal(normalizeSeoPath("https://toolsiva.com.evil.example/tools/text/word-counter"), null);
  assert.equal(normalizeSeoPath("mailto:hello@example.com"), null);
  assert.equal(normalizeSeoPath("#section"), null);
});

function seed(root, config = {}) {
  const write = (filename, body) => {
    const file = path.join(root, filename);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  };
  const page = (route, settings = {}) => {
    const desc = "Practical guidance for browser-based text processing, validation, common calculations and useful online tools.";
    const schema = (settings.types || []).map((type) =>
      '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@type": type }) + "</script>"
    ).join("");
    return '<!doctype html><html lang="en"><head><title>Toolsiva example page</title>' +
      '<meta name="description" content="' + desc + '">' +
      '<meta name="robots" content="' + (settings.noindex ? "noindex" : "index,follow") + '">' +
      '<meta property="og:title" content="Toolsiva example">' +
      '<meta property="og:description" content="' + desc + '">' +
      '<meta property="og:image" content="https://toolsiva.com/social/og.png">' +
      '<meta name="twitter:card" content="summary_large_image">' +
      '<link rel="canonical" href="https://toolsiva.com' + (settings.canonical || route) + '">' +
      schema + '</head><body><h1>Toolsiva example</h1>' + (settings.links || "") + '</body></html>';
  };
  write("index.html", page("/", { links: '<a href="/tools">Tools</a>' }));
  write("tools/index.html", page("/tools", { links: '<a href="/tools/text/">Text</a>' }));
  write("tools/text/index.html", page("/tools/text", { links: '<a href="/tools/text/demo/">Demo</a>' }));
  write("tools/text/demo/index.html", page("/tools/text/demo", {
    types: ["WebApplication", "BreadcrumbList"],
    links: config.badLink ? '<a href="/not-found">Broken</a>' : '<a href="/tools/text">Category</a>',
    canonical: config.badCanonical ? "/tools/text/other" : "/tools/text/demo",
  }));
  write("404.html", page("/404.html", { noindex: true, canonical: "/" }));
  write("robots.txt", "User-agent: *\nAllow: /\nSitemap: https://toolsiva.com/sitemap-index.xml\n");
  write("sitemap-index.xml", '<sitemapindex><sitemap><loc>https://toolsiva.com/sitemap-0.xml</loc></sitemap></sitemapindex>');
  const urls = ["/", "/tools", "/tools/text", "/tools/text/demo"];
  if (config.duplicateSitemap) urls.push("/tools/text/demo");
  write("sitemap-0.xml", "<urlset>" + urls.map((route) => '<url><loc>https://toolsiva.com' + route + '</loc></url>').join("") + "</urlset>");
}

const fixtureRegistry = {
  tools: [{ slug: "demo", category: "text", path: "/tools/text/demo" }],
  paths: new Set(["/tools/text/demo"]),
  categories: ["text"], counts: { text: 1 },
};

test("SEO audit derives counts from registry and built output, not hardcoded 118/133", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-seo-"));
  try {
    seed(root);
    const report = auditBuiltSite({ projectRoot: root, distDir: root, registry: fixtureRegistry, guidance: { count: 1 } });
    assert.equal(report.summary.htmlPages, 5);
    assert.equal(report.summary.toolPages, 1);
    assert.equal(report.summary.expectedToolPages, 1);
    assert.equal(report.summary.sitemapUrls, 4);
    assert.equal(report.summary.inboundLinkedTools, 1);
    assert.equal(report.summary.specializedGuides, 1);
    assert.equal(report.summary.errors, 0, JSON.stringify(report.issues));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("SEO audit catches broken links, wrong canonical and repeated sitemap entries", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-seo-bad-"));
  try {
    seed(root, { badLink: true, badCanonical: true, duplicateSitemap: true });
    const report = auditBuiltSite({ projectRoot: root, distDir: root, registry: fixtureRegistry });
    const codes = new Set(report.issues.filter((item) => item.severity === "error").map((item) => item.code));
    assert.ok(codes.has("broken-internal-link"));
    assert.ok(codes.has("incorrect-canonical"));
    assert.ok(codes.has("duplicate-sitemap-entry"));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("Blog metadata and contextual tool-to-blog links are aligned", () => {
  const index = fs.readFileSync("src/pages/blog/index.astro", "utf8");
  const post = fs.readFileSync("src/pages/blog/[slug].astro", "utf8");
  const tool = fs.readFileSync("src/pages/tools/[category]/[slug].astro", "utf8");
  assert.ok(index.includes('canonicalPath="/blog"'));
  assert.ok(!index.includes('canonicalPath="/blog/"'));
  assert.ok(post.includes("canonicalPath="));
  assert.ok(!post.includes('slug}/"}'));
  assert.match(tool, /getCollection\("blog"\)/);
  assert.match(tool, /!post\.data\.draft/);
  assert.match(tool, /Practical guides using this tool/);
});
