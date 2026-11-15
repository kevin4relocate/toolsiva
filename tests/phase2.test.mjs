import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseToolRegistry, readToolRegistry } from "../scripts/lib/tool-registry.mjs";
import { validateBlogContent, validateBlogDirectory } from "../scripts/validate-blog-links.mjs";
import { verifyBuiltRoutes, EXPECTED_TOOL_COUNT } from "../scripts/verify-tool-routes.mjs";

const registry = readToolRegistry();
const baseTypes = 'export const toolCategories = ["text", "developer"] as const;';
const baseCategories = 'export const categories = [{ slug: "text" }, { "slug": "developer" }];';
const firstCatalog = 'const toolCatalog: ToolDefinition[] = [{ slug: "one", category: "text", name: "One" }, { "slug": "two", "category": "developer", "name": "Two" }];';

test("AST registry recognizes all 123 catalog tools, including unquoted keys", () => {
  assert.equal(registry.tools.length, EXPECTED_TOOL_COUNT);
  assert.equal(registry.paths.size, EXPECTED_TOOL_COUNT);
  assert.equal(registry.paths.has("/tools/text/word-counter"), true);
  assert.equal(registry.paths.has("/tools/developer/markdown-live-preview"), true);
  assert.deepEqual(registry.counts, {
    text: 35,
    developer: 27,
    security: 11,
    qr: 10,
    calculator: 20,
    converter: 20,
  });
});

test("AST handles mixed property styles and rejects duplicate or invalid tools", () => {
  const good = parseToolRegistry({ toolsSource: firstCatalog, categoriesSource: baseCategories, typesSource: baseTypes });
  assert.deepEqual(good.tools.map((tool) => tool.slug), ["one", "two"]);
  const duplicate = firstCatalog.replace(' "slug": "two"', ' "slug": "one"');
  assert.throws(() => parseToolRegistry({ toolsSource: duplicate, categoriesSource: baseCategories, typesSource: baseTypes }), /duplicate tool slug/);
  const unknownCategory = firstCatalog.replace('"category": "developer"', '"category": "other"');
  assert.throws(() => parseToolRegistry({ toolsSource: unknownCategory, categoriesSource: baseCategories, typesSource: baseTypes }), /unknown category/);
  assert.throws(() => parseToolRegistry({ toolsSource: firstCatalog, categoriesSource: "export const categories = [];", typesSource: baseTypes }), /disagree/);
});

const head = [
  "---",
  'title: "How to use the Word Counter"',
  'primaryToolPath: "/tools/text/word-counter/"',
  "relatedTools:",
  '  - name: "JSON Formatter"',
  '    path: "/tools/developer/json-formatter/"',
  "---",
  "",
].join("\n");

test("Blog validator now accepts previously excluded unquoted-key tools", () => {
  const content = head + "Try [Word Counter](/tools/text/word-counter/) to count a draft.\n";
  assert.deepEqual(validateBlogContent("sample.md", content, registry.paths), []);
});

test("Blog validator checks markdown, frontmatter and HTML/MDX anchors", () => {
  const bad = head.replace("/tools/developer/json-formatter/", "/tools/developer/missing-tool/") +
    "Use [Bad Tool](/tools/text/not-a-tool/) and <a href=\"/tools/security/unknown/\">another</a>.\n";
  const issues = validateBlogContent("bad.md", bad, registry.paths);
  assert.equal(issues.filter((issue) => issue.includes("unknown tool")).length, 3);
  assert.ok(issues.some((issue) => issue.includes("relatedTools[0].path")));
  assert.ok(issues.some((issue) => issue.includes("markdown link")));
  assert.ok(issues.some((issue) => issue.includes("HTML/MDX link")));
});

test("Blog validator reports missing body link and malformed frontmatter", () => {
  assert.match(validateBlogContent("no-links.md", head + "No links here.", registry.paths).join(";"), /no tool link/);
  assert.match(validateBlogContent("bad.md", "---\nprimaryToolPath: [broken\n---\n", registry.paths).join(";"), /invalid YAML/);
  assert.match(validateBlogContent("bad.md", "no frontmatter", registry.paths).join(";"), /frontmatter/);
});

test("Existing blog posts pass validation against the entire registry", () => {
  const result = validateBlogDirectory();
  assert.ok(result.checkedPosts > 0);
  assert.equal(result.toolCount, 123);
  assert.deepEqual(result.errors, []);
});

test("Build verifier checks exact routes, workspaces, category pages and sitemap", () => {
  const fixtureRegistry = parseToolRegistry({
    toolsSource: firstCatalog,
    categoriesSource: baseCategories,
    typesSource: baseTypes,
  });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-phase2-"));
  const write = (file, text) => {
    const target = path.join(tmp, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  };
  try {
    write("tools/index.html", "<html><body><h1>Tools</h1></body></html>");
    write("tools/text/index.html", "<html><body><h1>Text</h1></body></html>");
    write("tools/developer/index.html", "<html><body><h1>Developer</h1></body></html>");
    for (const tool of fixtureRegistry.tools) {
      write(tool.path.slice(1) + "/index.html",
        '<html><head><link rel="canonical" href="https://toolsiva.com' + tool.path +
        '"></head><body><h1>' + tool.name + '</h1><section data-text-tool data-mode="' + tool.slug + '"></section></body></html>');
    }
    write("sitemap-index.xml", "<sitemapindex><sitemap><loc>https://toolsiva.com/sitemap-0.xml</loc></sitemap></sitemapindex>");
    write("sitemap-0.xml", "<urlset>" + fixtureRegistry.tools.map((tool) =>
      "<url><loc>https://toolsiva.com" + tool.path + "</loc></url>"
    ).join("") + "</urlset>");

    const success = verifyBuiltRoutes({ distDir: tmp, registry: fixtureRegistry, expectedCount: 2 });
    assert.deepEqual(success.errors, []);
    assert.equal(success.builtToolCount, 2);
    assert.equal(success.sitemapToolCount, 2);

    fs.unlinkSync(path.join(tmp, "tools/developer/two/index.html"));
    const missing = verifyBuiltRoutes({ distDir: tmp, registry: fixtureRegistry, expectedCount: 2 });
    assert.ok(missing.errors.some((issue) => issue.includes("Missing built tool page")));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
