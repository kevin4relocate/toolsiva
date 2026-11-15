import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseYaml } from "yaml";
import { localPublishDate, selectNextForPublication, publishDuePost } from "../scripts/publish-approved-blog.mjs";
import { validateBlogContent } from "../scripts/validate-blog-links.mjs";
import { readToolRegistry } from "../scripts/lib/tool-registry.mjs";

const firstBatch = [
  "how-to-calculate-age-from-date-of-birth",
  "restaurant-tip-calculator-bill-splitting-guide",
  "how-to-simplify-ratios-step-by-step",
  "solve-proportions-with-examples",
  "how-to-calculate-bmi-in-metric-units",
  "running-pace-calculator-minutes-per-kilometer",
  "profit-margin-vs-markup-calculation-guide",
  "markup-calculator-set-selling-price",
  "how-to-count-words-and-characters-online",
  "convert-list-to-comma-separated-text",
];
const parsePost = (source) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  assert.ok(m, "Expected YAML frontmatter");
  return parseYaml(m[1]);
};

test("All ten fully written guides have independent slugs, schedule and review-only state", () => {
  const slugs = new Set();
  const registry = readToolRegistry();
  firstBatch.forEach((slug, index) => {
    const filename = "src/content/blog/" + slug + ".md";
    const source = fs.readFileSync(filename, "utf8");
    const data = parsePost(source);
    slugs.add(data.slug);
    assert.equal(data.slug, slug);
    assert.equal(data.draft, true, slug);
    assert.equal(data.reviewApproved, false, slug);
    assert.equal(data.aiAssisted, true, slug);
    assert.equal(data.scheduledDate, new Date(Date.UTC(2026, 10, 16 + index)).toISOString().slice(0, 10), slug);
    assert.equal(data.publishedDate, data.scheduledDate, slug);
    assert.ok(data.description.length >= 50 && data.description.length <= 180, slug);
    assert.ok(data.excerpt.length >= 50, slug);
    assert.ok(data.heroImageAlt.length >= 30 && data.heroImageCaption.length >= 30, slug);
    assert.equal(data.heroImageWidth, 1200);
    assert.equal(data.heroImageHeight, 630);
    assert.ok(source.includes("## "), slug + ": missing explanatory sections");
    assert.ok(source.includes(data.primaryToolPath), slug + ": missing tool link");
    assert.ok(source.includes("`") || source.includes("| ---"), slug + ": expected a worked example or formula");
    assert.ok(source.split(/\s+/).length > 450, slug + ": incomplete guide draft");
    const errors = validateBlogContent(slug + ".md", source, registry.paths, { publicRoot: path.resolve("public") });
    assert.deepEqual(errors, [], slug + ": " + errors.join("; "));
  });
  assert.equal(slugs.size, 10);
});

test("All ten infographics plus the existing Markdown cover are real accessible SVG assets", () => {
  const slugs = [...firstBatch, "how-to-preview-markdown-online"];
  for (const slug of slugs) {
    const data = parsePost(fs.readFileSync("src/content/blog/" + slug + ".md", "utf8"));
    assert.match(data.heroImage, /^\/blog\/[a-z0-9-]+\.svg$/);
    const asset = fs.readFileSync("public" + data.heroImage, "utf8");
    assert.match(asset, /<svg\b/);
    assert.match(asset, /viewBox="0 0 1200 630"/);
    assert.match(asset, /<title\b[^>]*>.+<\/title>/);
    assert.match(asset, /<desc\b[^>]*>.+<\/desc>/);
    assert.doesNotMatch(asset, /<script\b|<foreignObject\b/);
  }
});

function fixture(entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-queue-"));
  fs.mkdirSync(path.join(root, "src/content/blog"), { recursive: true });
  fs.mkdirSync(path.join(root, "public/blog"), { recursive: true });
  const create = (slug, { approved = false, date = "2026-11-16", published = false, hasImage = true } = {}) => {
    const image = "/blog/" + slug + ".svg";
    if (hasImage) fs.writeFileSync(path.join(root, "public", image.slice(1)), "<svg></svg>");
    const source = [
      "---", "title: Sample " + slug,
      "slug: " + slug,
      "draft: " + (!published),
      "reviewApproved: " + approved,
      "scheduledDate: " + date,
      "publishedDate: " + date, "updatedDate: " + date,
      "heroImage: " + image,
      "heroImageAlt: An educational sample showing the required visual representation",
      "heroImageCaption: Example workflow graphic used to explain the tool to readers",
      "---", "", "## Example", "Real text.",
    ].join("\n") + "\n";
    fs.writeFileSync(path.join(root, "src/content/blog", slug + ".md"), source);
  };
  entries.forEach((entry) => create(entry.slug, entry));
  return { root, read(slug) { return fs.readFileSync(path.join(root,"src/content/blog",slug+".md"),"utf8"); } };
}

test("Unreviewed drafts are never selected, even when scheduledDate has passed", () => {
  const p = [{ data: { slug: "draft", draft: true, reviewApproved: false, scheduledDate: "2026-11-16" } }];
  assert.equal(selectNextForPublication(p, "2026-11-19"), null);
});

test("Approved due drafts publish in schedule order, exactly one on each local date", () => {
  const f = fixture([
    { slug: "second", approved: true, date: "2026-11-17" },
    { slug: "first", approved: true, date: "2026-11-16" },
    { slug: "unreviewed", approved: false, date: "2026-11-15" },
  ]);
  try {
    let r = publishDuePost({ root: f.root, today: "2026-11-18" });
    assert.equal(r.slug, "first");
    assert.match(f.read("first"), /draft: false/);
    assert.match(f.read("first"), /publishedDate: 2026-11-18/);
    r = publishDuePost({ root: f.root, today: "2026-11-18" });
    assert.equal(r.published, false);
    r = publishDuePost({ root: f.root, today: "2026-11-19" });
    assert.equal(r.slug, "second");
    assert.match(f.read("unreviewed"), /draft: true/);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }
});

test("Future approved drafts are held; missing image asset blocks publication", () => {
  const f = fixture([{ slug: "future", approved: true, date: "2026-12-01" }]);
  try {
    const outcome = publishDuePost({ root: f.root, today: "2026-11-20" });
    assert.equal(outcome.published, false);
  } finally { fs.rmSync(f.root, { recursive: true, force: true }); }

  const bad = fixture([{ slug: "bad", approved: true, date: "2026-11-16", hasImage: false }]);
  try {
    assert.throws(() => publishDuePost({ root: bad.root, today: "2026-11-16" }), /image asset does not exist/);
    assert.match(bad.read("bad"), /draft: true/);
  } finally { fs.rmSync(bad.root, { recursive: true, force: true }); }
});

test("Bangkok/Ho Chi Minh local publication date uses UTC+7 boundary", () => {
  assert.equal(localPublishDate(new Date("2026-11-15T16:59:59Z")), "2026-11-15");
  assert.equal(localPublishDate(new Date("2026-11-15T17:00:00Z")), "2026-11-16");
});

test("Daily workflow runs at 09:00 GMT+7, validates and pushes only after success", () => {
  const wf = fs.readFileSync(".github/workflows/publish-reviewed-blog.yml", "utf8");
  assert.match(wf, /cron: "0 2 \* \* \*"/);
  assert.match(wf, /npm run blog:publish-queue/);
  assert.match(wf, /npm run blog:validate/);
  assert.match(wf, /npm run seo:canonical/);
  assert.match(wf, /npm run adsense:audit/);
  assert.match(wf, /git push origin HEAD:main/);
  assert.match(wf, /if: steps\.changed\.outputs\.publish == 'true'/);
  const aiWorkflow = fs.readFileSync(".github/workflows/daily-blog.yml", "utf8");
  assert.match(aiWorkflow, /gh pr create --base main/);
  assert.doesNotMatch(aiWorkflow, /git push origin HEAD:main/);
});

test("Blog template outputs image, accessible caption, BlogPosting image and social metadata", () => {
  const page = fs.readFileSync("src/pages/blog/[slug].astro", "utf8");
  const seo = fs.readFileSync("src/components/seo/SeoHead.astro", "utf8");
  assert.match(page, /<figure\b/);
  assert.match(page, /<figcaption\b/);
  assert.match(page, /post\.data\.heroImageAlt/);
  assert.match(page, /"@type":"ImageObject"/);
  assert.match(page, /type="article"/);
  assert.match(seo, /content=\{imageAlt\}/);
});
