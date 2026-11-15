import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const BLOG = "src/content/blog";
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function localPublishDate(now = new Date()) {
  // Bangkok and Ho Chi Minh City use UTC+7 year-round. GitHub cron is UTC.
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parsePost(name, source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if (!match) throw new Error(name + ": malformed blog frontmatter.");
  const data = parseYaml(match[1], { uniqueKeys: true });
  if (!data || typeof data !== "object") throw new Error(name + ": invalid blog metadata.");
  return { name, data, source };
}

export function selectNextForPublication(posts, today) {
  if (!DATE_RE.test(today)) throw new Error("Publish date must be YYYY-MM-DD.");
  // Never publish more than one article per local calendar day.
  const alreadyPublishedToday = posts.some((p) => p.data.draft === false &&
    String(p.data.publishedDate).slice(0, 10) === today);
  if (alreadyPublishedToday) return null;
  const candidates = posts.filter((p) =>
    p.data.draft === true &&
    p.data.reviewApproved === true &&
    p.data.scheduledDate &&
    DATE_RE.test(String(p.data.scheduledDate)) &&
    String(p.data.scheduledDate) <= today
  );
  candidates.sort((a, b) =>
    String(a.data.scheduledDate).localeCompare(String(b.data.scheduledDate)) ||
    String(a.data.slug).localeCompare(String(b.data.slug))
  );
  return candidates[0] ?? null;
}

function replaceField(source, name, value) {
  const head = source.slice(0, source.indexOf("\n---", 4));
  const match = new RegExp("^" + name + ":.*$", "m");
  if (!match.test(head)) throw new Error("Required frontmatter field missing: " + name);
  return source.replace(match, name + ": " + value);
}

export function publishDuePost({ root = process.cwd(), today = localPublishDate() } = {}) {
  const dir = path.join(root, BLOG);
  if (!fs.existsSync(dir)) throw new Error("Blog directory missing: " + dir);
  const posts = fs.readdirSync(dir).filter((name) => /\.mdx?$/i.test(name))
    .map((name) => parsePost(name, fs.readFileSync(path.join(dir, name), "utf8")));
  const next = selectNextForPublication(posts, today);
  if (!next) return { published: false, today, reason: "No approved due drafts, or an article was already published today." };

  const { heroImage, heroImageAlt, heroImageCaption, reviewApproved } = next.data;
  if (reviewApproved !== true || !heroImage || !heroImageAlt || !heroImageCaption ||
    typeof heroImage !== "string" || !heroImage.startsWith("/blog/") ||
    typeof heroImageAlt !== "string" || heroImageAlt.length < 30 ||
    typeof heroImageCaption !== "string" || heroImageCaption.length < 30) {
    throw new Error(next.name + ": published articles require approved review and complete SEO image metadata.");
  }
  const publicPath = path.join(root, "public", heroImage.slice(1));
  if (!fs.existsSync(publicPath) || !fs.statSync(publicPath).isFile()) {
    throw new Error(next.name + ": image asset does not exist: " + heroImage);
  }

  let result = replaceField(next.source, "draft", "false");
  result = replaceField(result, "publishedDate", today);
  result = replaceField(result, "updatedDate", today);
  const filename = path.join(dir, next.name);
  fs.writeFileSync(filename, result);
  return { published: true, today, slug: next.data.slug, image: heroImage, file: filename };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const outcome = publishDuePost({ today: process.env.PUBLISH_DATE || localPublishDate() });
    console.log(outcome.published
      ? "Promoted one approved blog draft: " + outcome.slug + " on " + outcome.today
      : "No blog publication: " + outcome.reason);
  } catch (error) {
    console.error("Scheduled blog publication blocked:", error);
    process.exitCode = 1;
  }
}
