import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) throw new Error("Missing GEMINI_API_KEY.");

const source = fs.readFileSync(path.join(ROOT, "src/data/tools.ts"), "utf8");

const extractStringField = (block, field) => {
  const match = block.match(new RegExp(`(?:^|\\n)\\s*(?:["']?${field}["']?)\\s*:\\s*(["'])(.*?)\\1`, "s"));
  return match?.[2] ?? "";
};

const extractStringArrayField = (block, field) => {
  const match = block.match(new RegExp(`(?:^|\\n)\\s*(?:["']?${field}["']?)\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/(["'])(.*?)\1/g)].map((item) => item[2]);
};

const catalogStart = source.search(/const\s+toolCatalog\s*:[^=]+=/);
if (catalogStart < 0) throw new Error("Could not find toolCatalog declaration in src/data/tools.ts.");

const arrayStart = source.indexOf("[", source.indexOf("=", catalogStart));
if (arrayStart < 0) throw new Error("Could not find toolCatalog array start.");

const toolBlocks = [];
let depth = 0;
let objectStart = -1;
let quote = "";
let escaped = false;

for (let i = arrayStart + 1; i < source.length; i += 1) {
  const char = source[i];

  if (quote) {
    if (escaped) {
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === quote) {
      quote = "";
    }
    continue;
  }

  if (char === '"' || char === "'" || char === "`") {
    quote = char;
    continue;
  }

  if (char === "{") {
    if (depth === 0) objectStart = i;
    depth += 1;
    continue;
  }

  if (char === "}") {
    depth -= 1;
    if (depth === 0 && objectStart >= 0) {
      toolBlocks.push(source.slice(objectStart, i + 1));
      objectStart = -1;
    }
    continue;
  }

  if (char === "]" && depth === 0) break;
}

const tools = toolBlocks
  .map((block) => ({
    slug: extractStringField(block, "slug"),
    category: extractStringField(block, "category"),
    name: extractStringField(block, "name"),
    shortDescription: extractStringField(block, "shortDescription"),
    keywords: extractStringArrayField(block, "keywords"),
    relatedTools: extractStringArrayField(block, "relatedTools"),
  }))
  .filter((tool) => tool.slug && tool.category && tool.name && tool.shortDescription);

if (!tools.length) throw new Error("No tools could be parsed from src/data/tools.ts.");

const existing = fs.readdirSync(BLOG_DIR).filter((n) => n.endsWith(".md"));
const primaryTool = tools.find((tool) => !existing.some((name) => name.includes(tool.slug))) || tools[0];
const related = (primaryTool.relatedTools || [])
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter(Boolean)
  .slice(0, 3);
const toolPath = (tool) => `/tools/${tool.category}/${tool.slug}/`;
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
const prompt = `Write one high-quality English tutorial for Toolsiva.com.\nTool: ${primaryTool.name}\nDescription: ${primaryTool.shortDescription}\nExact path: ${toolPath(primaryTool)}\nReturn JSON with title, description, excerpt, introduction (array), sections (array with heading, paragraphs, bullets), faq (array with question, answer). Requirements: 900-1300 words, at least 5 sections, practical examples, common mistakes, no URLs, no Markdown links, no invented statistics/laws/prices/current events, do not mention AI or SEO.`;
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.65, maxOutputTokens: 8192 },
  }),
});
if (!response.ok) throw new Error(`Gemini API failed: ${response.status}`);
const payload = await response.json();
const raw = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
const article = JSON.parse(raw);
const title = String(article.title).trim();
const slug = slugify(title);
const today = new Date().toISOString().slice(0, 10);
const lines = [];
for (const paragraph of article.introduction || []) lines.push(String(paragraph), "");
lines.push(`Use the free [${primaryTool.name}](${toolPath(primaryTool)}) while following this guide.`, "");
for (const section of article.sections || []) {
  lines.push(`## ${section.heading}`, "");
  for (const paragraph of section.paragraphs || []) lines.push(String(paragraph), "");
  for (const bullet of section.bullets || []) lines.push(`- ${bullet}`);
  lines.push("");
}
if (related.length) {
  lines.push("## Related Toolsiva tools", "");
  for (const tool of related) lines.push(`- [${tool.name}](${toolPath(tool)})`);
  lines.push("");
}
lines.push("## Frequently asked questions", "");
for (const item of article.faq || []) lines.push(`### ${item.question}`, "", String(item.answer), "");
const relatedYaml = related
  .flatMap((tool) => [`  - name: ${JSON.stringify(tool.name)}`, `    path: ${JSON.stringify(toolPath(tool))}`])
  .join("\n");
const frontmatter = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(String(article.description).slice(0, 180))}\nslug: ${JSON.stringify(slug)}\npublishedDate: ${today}\nupdatedDate: ${today}\nauthor: "Toolsiva Editorial"\nprimaryTool: ${JSON.stringify(primaryTool.name)}\nprimaryToolPath: ${JSON.stringify(toolPath(primaryTool))}\nrelatedTools:\n${relatedYaml}\nkeywords:\n${(primaryTool.keywords || []).slice(0, 8).map((keyword) => `  - ${JSON.stringify(keyword)}`).join("\n")}\nexcerpt: ${JSON.stringify(String(article.excerpt))}\ndraft: false\naiAssisted: true\n---\n\n`;
const destination = path.join(BLOG_DIR, `${slug}.md`);
if (fs.existsSync(destination)) throw new Error(`Post already exists: ${slug}`);
fs.writeFileSync(destination, frontmatter + lines.join("\n").trim() + "\n", "utf8");
console.log(`Created ${path.relative(ROOT, destination)}`);
