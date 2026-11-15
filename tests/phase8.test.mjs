import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseYaml } from "yaml";
import { dailySchedule, releaseCuratedGuide } from "../scripts/release-curated-guide.mjs";
import { writeGuideImages, imageSvg } from "../scripts/generate-guide-images.mjs";
import { readToolRegistry } from "../scripts/lib/tool-registry.mjs";

const root = process.cwd();
const blogDir = path.join(root, "src/content/blog");
const article = (entry, dest = blogDir) => {
  const file = path.join(dest, entry.slug + ".md");
  const content = fs.readFileSync(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(content);
  assert.ok(match, entry.slug + ": missing frontmatter");
  return { data: parseYaml(match[1]), body: content.slice(match[0].length), file };
};

test("Curated calendar contains 30 unique, consecutive Vietnam release dates", () => {
  assert.equal(dailySchedule.length, 30);
  assert.equal(dailySchedule[0].date, "2026-11-16");
  assert.equal(dailySchedule.at(-1).date, "2026-12-15");
  assert.equal(new Set(dailySchedule.map((item) => item.slug)).size, 30);
  const dates = dailySchedule.map((entry) => entry.date);
  assert.equal(new Set(dates).size, 30);
  for (let i = 0; i < dailySchedule.length; i++) {
    assert.equal(dailySchedule[i].slot, i + 1);
    const wanted = new Date(Date.UTC(2026, 10, 16 + i)).toISOString().slice(0, 10);
    assert.equal(dailySchedule[i].date, wanted);
  }
});

test("All 30 prepared guides are distinct practical drafts with SEO figures", () => {
  const registry = readToolRegistry();
  const originals = new Set(registry.tools.map((tool) => tool.path));
  const titles = new Set(), contents = new Set();
  for (const entry of dailySchedule) {
    assert.ok(originals.has(entry.primaryToolPath.replace(/\/+$/, "")), entry.slug + ": unknown tool");
    const { data, body } = article(entry);
    assert.equal(data.slug, entry.slug);
    assert.equal(typeof data.draft, "boolean", entry.slug + ": draft must be explicit");
    // Scheduled articles change draft to false one at a time after the queue starts.
    if (!data.draft) {
      const published = data.publishedDate instanceof Date
        ? data.publishedDate.toISOString().slice(0, 10) : String(data.publishedDate).slice(0, 10);
      assert.ok(published >= entry.date, entry.slug + ": article was published before its scheduled slot");
    }
    assert.equal(data.aiAssisted, true);
    assert.equal(data.curatedSeries, true);
    assert.equal(data.primaryToolPath, entry.primaryToolPath);
    assert.equal(data.featuredImage, entry.image);
    assert.equal(data.imageAlt, entry.imageAlt);
    assert.equal(data.imageCaption, entry.imageCaption);
    assert.ok(data.imageAlt.length >= 40 && data.imageAlt.length <= 220, entry.slug + ": alt length");
    assert.ok(data.imageCaption.length >= 45 && data.imageCaption.length <= 260, entry.slug + ": caption length");
    assert.ok(data.description.length >= 50 && data.description.length <= 180, entry.slug + ": description length");
    assert.ok(body.trim().split(/\s+/).length >= 280, entry.slug + ": needs useful article depth");
    assert.ok((body.match(/^## /gm) || []).length >= 3, entry.slug + ": missing sections");
    assert.ok(body.includes("](" + entry.primaryToolPath + ")"), entry.slug + ": missing primary tool link");
    titles.add(data.title); contents.add(body.trim());
  }
  assert.equal(titles.size, 30);
  assert.equal(contents.size, 30);
});

test("Generate 31 original SVG assets with accessible labels, stable dimensions and no scripts", () => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-guide-images-"));
  try {
    assert.equal(writeGuideImages(destination), 31);
    const files = fs.readdirSync(destination);
    assert.equal(files.length, 31);
    for (const entry of dailySchedule) {
      const image = fs.readFileSync(path.join(destination, entry.slug + ".svg"), "utf8");
      assert.ok(image.includes('width="1200" height="630"'), entry.slug);
      assert.ok(image.includes("<title id="), entry.slug);
      assert.ok(image.includes("<desc id="), entry.slug);
      assert.ok(image.includes(entry.diagram.steps[0].replaceAll("&", "&amp;")), entry.slug);
      assert.doesNotMatch(image, /<script\b/i);
    }
    assert.ok(files.includes("markdown-live-preview-guide.svg"));
  } finally { fs.rmSync(destination, { recursive: true, force: true }); }
});

test("SVG illustration escapes reserved markup and remains deterministic", () => {
  const mock = { ...dailySchedule[0], imageAlt: "A <script> & example", diagram: { heading: "Test & verify", steps: ["<first>", "middle & last", "done"] } };
  const svg = imageSvg(mock);
  assert.ok(svg.includes("&lt;script&gt; &amp; example"));
  assert.ok(svg.includes("&lt;first&gt;"));
  assert.doesNotMatch(svg, /<script\b/);
  assert.equal(imageSvg(mock), svg);
});

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-guide-release-"));
  const target = path.join(dir, "src/content/blog");
  fs.mkdirSync(target, { recursive: true });
  for (const entry of dailySchedule) {
    // Reset already-published posts to drafts in the isolated fixture; otherwise
    // simulated release tests would break after the first actual scheduled release.
    const source = fs.readFileSync(path.join(blogDir, entry.slug + ".md"), "utf8");
    const reset = source.replace(/^draft:\s*(?:true|false)\s*$/m, "draft: true")
      .replace(/^publishedDate:\s*\d{4}-\d{2}-\d{2}\s*$/m, "publishedDate: " + entry.date)
      .replace(/^updatedDate:\s*\d{4}-\d{2}-\d{2}\s*$/m, "updatedDate: " + entry.date);
    fs.writeFileSync(path.join(target, entry.slug + ".md"), reset);
  }
  writeGuideImages(path.join(dir, "public/blog/illustrations"));
  return dir;
}

test("Automatic publisher releases one scheduled article per Vietnam day; reruns are idempotent", () => {
  const dir = fixture();
  try {
    let result = releaseCuratedGuide({ root: dir, now: new Date("2026-11-16T01:59:00Z") });
    assert.equal(result.released, false);
    assert.equal(result.reason, "before-09:00-VN");

    result = releaseCuratedGuide({ root: dir, now: new Date("2026-11-16T02:00:00Z") });
    assert.equal(result.released, true);
    assert.equal(result.slug, dailySchedule[0].slug);
    assert.equal(article(dailySchedule[0], path.join(dir, "src/content/blog")).data.draft, false);
    assert.equal(article(dailySchedule[1], path.join(dir, "src/content/blog")).data.draft, true);

    result = releaseCuratedGuide({ root: dir, now: new Date("2026-11-16T08:00:00Z") });
    assert.equal(result.released, false);
    assert.equal(result.reason, "already-published-today");

    result = releaseCuratedGuide({ root: dir, now: new Date("2026-11-17T02:00:00Z") });
    assert.equal(result.released, true);
    assert.equal(result.slug, dailySchedule[1].slug);
    assert.equal(article(dailySchedule[2], path.join(dir, "src/content/blog")).data.draft, true);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("Publisher does not release multiple missed slots at once and dry run does not modify files", () => {
  const dir = fixture();
  try {
    const before = fs.readFileSync(path.join(dir, "src/content/blog", dailySchedule[0].slug + ".md"), "utf8");
    const dry = releaseCuratedGuide({ root: dir, now: new Date("2026-12-01T02:00:00Z"), dryRun: true });
    assert.equal(dry.released, true);
    const after = fs.readFileSync(path.join(dir, "src/content/blog", dailySchedule[0].slug + ".md"), "utf8");
    assert.equal(before, after);
    const actual = releaseCuratedGuide({ root: dir, now: new Date("2026-12-01T02:00:00Z") });
    assert.equal(actual.slug, dailySchedule[0].slug);
    assert.equal(actual.date, "2026-12-01");
    assert.equal(article(dailySchedule[0], path.join(dir, "src/content/blog")).data.publishedDate, "2026-12-01");
    assert.equal(article(dailySchedule[1], path.join(dir, "src/content/blog")).data.draft, true);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test("GitHub Actions schedules 09:00 Vietnam, preserves review-only AI generation", () => {
  const workflow = fs.readFileSync(".github/workflows/publish-curated-guides.yml", "utf8");
  const review = fs.readFileSync(".github/workflows/daily-blog.yml", "utf8");
  assert.ok(workflow.includes('cron: "0 2 * * *"'));
  assert.ok(workflow.includes("npm run blog:release"));
  assert.ok(workflow.includes("npm run build"));
  assert.ok(workflow.includes("git push origin HEAD:main"));
  assert.ok(!workflow.includes("GEMINI_API_KEY"));
  assert.ok(review.includes("gh pr create --base main"));
  assert.ok(!review.includes("git push origin HEAD:main"));
});

test("BlogPost template renders SEO image alt, visible caption and article schema image", () => {
  const page = fs.readFileSync("src/pages/blog/[slug].astro", "utf8");
  assert.ok(page.includes("post.data.featuredImage"));
  assert.ok(page.includes("post.data.imageAlt"));
  assert.ok(page.includes("post.data.imageCaption"));
  assert.ok(page.includes("figcaption"));
  assert.ok(page.includes('width="1200"'));
  assert.ok(page.includes('height="630"'));
  assert.ok(page.includes("image: hero"));
});


test("Curated guides 11–20 preserve SEO images and contain concrete tool examples", () => {
  const examples = [
    ["bmi-calculator-units", /BMI = 70|70 ÷ 1\.70/, /Underweight/],
    ["percentage-change-increase-decrease", /93\.75/, /percentage points/],
    ["loan-monthly-payment-explained", /\$599\.55/, /APR/],
    ["date-difference-without-dst-errors", /2024-02-28/, /Inclusive/],
    ["compound-interest-frequency", /\$1,104\.94/, /Effective annual rate/],
    ["fraction-calculator-common-denominator", /23\/20/, /Division by zero/],
    ["gcd-lcm-when-to-use", /180/, /Prime factorization/],
    ["running-pace-per-km", /5:30/, /9:39/],
    ["compare-unit-prices", /\$0\.008/, /per 100 g/],
    ["json-to-csv-clean-columns", /"name","score","city"/, /Spreadsheet safety/],
  ];
  for (const [offset, [slug, calculation, caution]] of examples.entries()) {
    const scheduled = dailySchedule[10 + offset];
    assert.equal(scheduled.slug, slug, slug + ": article identity or release order changed");
    const { data, body } = article(scheduled);
    assert.equal(data.draft, true, slug + ": scheduled draft must remain unpublished");
    assert.equal(data.featuredImage, scheduled.image, slug + ": illustration reference changed");
    assert.equal(data.imageAlt, scheduled.imageAlt, slug + ": descriptive image alt changed");
    assert.equal(data.imageCaption, scheduled.imageCaption, slug + ": visible caption changed");
    assert.equal(data.primaryToolPath, scheduled.primaryToolPath, slug + ": primary canonical tool link changed");
    assert.ok(body.trim().split(/\s+/).length >= 700, slug + ": content too shallow");
    assert.ok((body.match(/^## /gm) || []).length >= 7, slug + ": missing structured explanations");
    assert.match(body, calculation, slug + ": worked example missing");
    assert.match(body, caution, slug + ": domain-specific caution missing");
    assert.ok(body.includes("](" + scheduled.primaryToolPath + ")"), slug + ": tool link missing");
    assert.ok(/\| ---|\x60{3}(?:json|csv|text)/.test(body), slug + ": expected a table or code example");
  }
});
