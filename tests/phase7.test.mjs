import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { auditAdsenseReadiness } from "../scripts/lib/adsense-readiness.mjs";

const registry = {
  tools: [{ slug: "demo", category: "text", path: "/tools/text/demo" }],
};
const routes = [
  "/", "/about", "/contact", "/privacy", "/terms", "/disclaimer",
  "/editorial-standards", "/tools", "/blog", "/tools/text/demo", "/404.html",
];

function makeFixture(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-adsense-"));
  const dest = path.join(root, "dist");
  fs.mkdirSync(dest);
  const write = (filename, content) => {
    const location = path.join(root, filename);
    fs.mkdirSync(path.dirname(location), { recursive: true });
    fs.writeFileSync(location, content);
  };
  const page = (route) => {
    const title = route === "/editorial-standards" ? "AI-assisted editorial policy" :
      route === "/privacy" ? "Google Analytics privacy policy" : "Toolsiva test page";
    const heading = "<h1>" + title + "</h1>";
    const words = (title + " ").repeat(100);
    const extras = route === "/contact" ? '<a href="mailto:contact@toolsiva.com">Contact us</a>' :
      route === "/tools/text/demo" ? "<h2>How to use this tool</h2><h2>Frequently asked questions</h2>" :
      "";
    const robots = route === "/404.html" && !options.indexable404 ?
      '<meta name="robots" content="noindex,nofollow">' : "";
    const advertising = route === "/tools/text/demo" && options.prematureAds
      ? '<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>'
      : "";
    return "<html><head>" + robots + advertising + "</head><body><main>" +
      heading + words + extras + "</main></body></html>";
  };
  for (const route of routes) {
    if (options.missingPrivacy && route === "/privacy") continue;
    const target = route === "/" ? "index.html" : route === "/404.html" ?
      "404.html" : route.slice(1) + "/index.html";
    write(path.join("dist", target), page(route));
  }
  for (const p of [
    "scripts/generate-daily-blog.mjs", ".github/workflows/daily-blog.yml",
    "src/components/common/AdSlot.astro",
  ]) write(p, fs.readFileSync(p, "utf8"));
  return { root, dest };
}

test("Blog generator produces unpublished AI-assisted drafts", () => {
  const generator = fs.readFileSync("scripts/generate-daily-blog.mjs", "utf8");
  const contentSchema = fs.readFileSync("src/content.config.ts", "utf8");
  assert.match(generator, /draft: true\\naiAssisted: true/);
  assert.match(contentSchema, /draft: z\.boolean\(\)\.default\(true\)/);
  assert.match(generator, /Editorial review is required before publishing/);
});

test("Workflow creates a PR and never pushes generated articles directly to main", () => {
  const workflow = fs.readFileSync(".github/workflows/daily-blog.yml", "utf8");
  assert.match(workflow, /pull-requests: write/);
  assert.match(workflow, /gh pr create --base main/);
  assert.doesNotMatch(workflow, /git push origin HEAD:main/);
  assert.match(workflow, /draft: true until editorial review/);
});

test("Preapproval AdSlot remains disabled even if a legacy env toggle is set", () => {
  const code = fs.readFileSync("src/components/common/AdSlot.astro", "utf8");
  assert.match(code, /const enabled = false;/);
  assert.doesNotMatch(code, /const enabled = import\.meta\.env\.PUBLIC_ADSENSE_ENABLED/);
});

test("Build audit derives tool count, warns on few guides and never promises approval", () => {
  const fixture = makeFixture();
  try {
    const report = auditAdsenseReadiness({ root: fixture.root, dist: fixture.dest, registry });
    assert.equal(report.summary.tools.generated, 1);
    assert.equal(report.summary.tools.expected, 1);
    assert.equal(report.summary.technicalGate, "PASS", JSON.stringify(report.issues));
    assert.equal(report.summary.overallAdSenseDecision, "NOT_DETERMINED");
    assert.equal(report.summary.manualPending, 10);
    assert.ok(report.issues.some((issue) => issue.code === "limited-published-guide-library" && issue.severity === "warning"));
  } finally { fs.rmSync(fixture.root, { recursive: true, force: true }); }
});

test("A missing public Privacy page fails the technical gate", () => {
  const fixture = makeFixture({ missingPrivacy: true });
  try {
    const report = auditAdsenseReadiness({ root: fixture.root, dist: fixture.dest, registry });
    assert.equal(report.summary.technicalGate, "FAIL");
    assert.ok(report.issues.some((issue) => issue.code === "missing-trust-or-navigation-page" && issue.route === "/privacy"));
  } finally { fs.rmSync(fixture.root, { recursive: true, force: true }); }
});

test("Premature AdSense code is blocked before consent and approval", () => {
  const fixture = makeFixture({ prematureAds: true });
  try {
    const report = auditAdsenseReadiness({ root: fixture.root, dist: fixture.dest, registry });
    assert.ok(report.issues.some((issue) => issue.code === "premature-ad-code"));
    assert.equal(report.summary.technicalGate, "FAIL");
  } finally { fs.rmSync(fixture.root, { recursive: true, force: true }); }
});

test("Indexable 404 error pages are blocked", () => {
  const fixture = makeFixture({ indexable404: true });
  try {
    const report = auditAdsenseReadiness({ root: fixture.root, dist: fixture.dest, registry });
    assert.ok(report.issues.some((issue) => issue.code === "indexable-error-page"));
  } finally { fs.rmSync(fixture.root, { recursive: true, force: true }); }
});

test("Editorial standards are linked globally and never invent a publisher ID", () => {
  const footer = fs.readFileSync("src/components/layout/Footer.astro", "utf8");
  const editorial = fs.readFileSync("src/pages/editorial-standards.astro", "utf8");
  assert.match(footer, /href="\/editorial-standards\/"/);
  assert.match(editorial, /AI-assisted drafts/);
  assert.match(editorial, /does not currently display third-party advertisements/);
  assert.doesNotMatch(editorial, /ca-pub-\d{16}/);
});

test("Published Markdown guide includes actual examples and limitations", () => {
  const article = fs.readFileSync("src/content/blog/how-to-preview-markdown-online.md", "utf8");
  assert.match(article, /draft: false/);
  assert.match(article, /updatedDate: 2026-11-15/);
  assert.match(article, /## 3\. Preview checklists and tables/);
  assert.match(article, /Save draft on this device/);
  assert.ok(article.length > 4500, "Published guide needs substantive practical examples");
});
