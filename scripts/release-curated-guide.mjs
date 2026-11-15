import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZONE = "Asia/Ho_Chi_Minh";
export const dailySchedule = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/data/curatedGuideSchedule.json"), "utf8"),
);

export function vietnamDate(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  const date = get("year") + "-" + get("month") + "-" + get("day");
  const hhmm = Number(get("hour")) * 60 + Number(get("minute"));
  return { date, hhmm };
}

function readPost(root, entry) {
  const filename = path.join(root, "src/content/blog", entry.slug + ".md");
  if (!fs.existsSync(filename)) throw new Error("Missing scheduled article: " + entry.slug);
  const source = fs.readFileSync(filename, "utf8");
  const front = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if (!front) throw new Error(entry.slug + ": invalid frontmatter.");
  const data = parseYaml(front[1], { uniqueKeys: true });
  if (data.slug !== entry.slug || data.primaryToolPath !== entry.primaryToolPath ||
      data.curatedSeries !== true || data.featuredImage !== entry.image ||
      data.imageAlt !== entry.imageAlt || data.imageCaption !== entry.imageCaption) {
    throw new Error(entry.slug + ": scheduled source or original image metadata changed unexpectedly.");
  }
  if (typeof data.draft !== "boolean") throw new Error(entry.slug + ": explicit draft flag required.");
  return { source, filename, data };
}

export function releaseCuratedGuide({
  root = ROOT,
  now = new Date(),
  dryRun = false,
  entries = dailySchedule,
} = {}) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error("Invalid release clock.");
  const { date, hhmm } = vietnamDate(now);
  const unique = new Set();
  if (entries.length !== 30) throw new Error("Expected exactly 30 editorially prepared slots.");
  for (const entry of entries) {
    if (unique.has(entry.slug)) throw new Error("Duplicated scheduled slug: " + entry.slug);
    unique.add(entry.slug);
  }
  // Prevent accidental publication in manual dispatches before the 09:00 Vietnam slot.
  if (hhmm < 9 * 60) return { released: false, reason: "before-09:00-VN", date };
  let alreadyReleasedToday = false;
  let next = null;
  for (const entry of entries) {
    const post = readPost(root, entry);
    if (!post.data.draft && post.data.publishedDate instanceof Date &&
        post.data.publishedDate.toISOString().slice(0, 10) === date) alreadyReleasedToday = true;
    if (!post.data.draft && typeof post.data.publishedDate === "string" &&
        post.data.publishedDate.slice(0, 10) === date) alreadyReleasedToday = true;
    if (!next && post.data.draft && entry.date <= date) next = { entry, post };
  }
  if (alreadyReleasedToday) return { released: false, reason: "already-published-today", date };
  if (!next) return { released: false, reason: "no-eligible-draft", date };
  const { entry, post } = next;
  const asset = path.join(root, "public", entry.image.replace(/^\/+/, ""));
  if (!fs.existsSync(asset)) throw new Error(entry.slug + ": illustration missing; run npm run blog:images first.");
  const changed = post.source.replace(/^draft:\s*true\s*$/m, "draft: false")
    .replace(/^publishedDate:\s*\d{4}-\d{2}-\d{2}\s*$/m, "publishedDate: " + date)
    .replace(/^updatedDate:\s*\d{4}-\d{2}-\d{2}\s*$/m, "updatedDate: " + date);
  if (changed === post.source || !changed.includes("draft: false")) throw new Error("Unable to publish " + entry.slug);
  if (!dryRun) fs.writeFileSync(post.filename, changed);
  return { released: true, slug: entry.slug, slot: entry.slot, date, dryRun };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Workflow executes with the actual current clock. --dry-run only previews eligibility.
  const result = releaseCuratedGuide({ dryRun: process.argv.includes("--dry-run") });
  console.log(JSON.stringify(result));
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT,
      "released=" + result.released + "\n" +
      "slug=" + (result.slug || "") + "\n" +
      "release_date=" + result.date + "\n");
  }
}
