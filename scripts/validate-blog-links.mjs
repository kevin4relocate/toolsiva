import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { parse as parseYaml } from "yaml";
import { readToolRegistry } from "./lib/tool-registry.mjs";

const ORIGIN = "https://toolsiva.com";

function toolPathFromLink(href) {
  if (typeof href !== "string") return null;
  const cleaned = href.trim().replace(/^<|>$/g, "");
  let url;
  try {
    url = new URL(cleaned, ORIGIN);
  } catch {
    return null;
  }
  // Do not mistake an unrelated external site's /tools/* link for Toolsiva.
  if (url.origin !== ORIGIN) return null;
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === "/tools" || pathname === "/tools/") return null;
  if (!pathname.startsWith("/tools/")) return null;
  return pathname.replace(/\/+$/, "");
}

export function validateBlogContent(name, content, validPaths, options = {}) {
  const issues = [];
  const match = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return [name + ": missing or malformed YAML frontmatter."];

  let data;
  try {
    data = parseYaml(match[1], { uniqueKeys: true });
  } catch (error) {
    return [name + ": invalid YAML frontmatter: " + error.message];
  }
  if (!data || typeof data !== "object") {
    return [name + ": YAML frontmatter must be an object."];
  }

  const checkLink = (href, context) => {
    if (typeof href !== "string" || !href.trim()) {
      issues.push(name + ": " + context + " must be a non-empty URL.");
      return false;
    }
    const target = toolPathFromLink(href);
    if (target === null) {
      issues.push(name + ": " + context + " must point to an internal Toolsiva tool: " + href);
      return false;
    }
    if (!validPaths.has(target)) {
      issues.push(name + ": " + context + " references an unknown tool: " + href);
      return false;
    }
    return true;
  };

  // No unreviewed scheduled draft may be published without an actual image.
  // Ordinary AI-generated unpublished drafts may omit images until editorial review.
  const requiresHero = data.draft === false || data.reviewApproved === true || Boolean(data.scheduledDate);
  if (requiresHero) {
    if (typeof data.heroImage !== "string" || !/^\/blog\/[a-z0-9-]+\.(?:svg|webp|png|jpg|jpeg)$/i.test(data.heroImage)) {
      issues.push(name + ": published or queued guide needs an internal SEO heroImage.");
    } else if (options.publicRoot) {
      const asset = path.join(options.publicRoot, data.heroImage.slice(1));
      if (!fs.existsSync(asset) || !fs.statSync(asset).isFile() || fs.statSync(asset).size < 100) {
        issues.push(name + ": missing or empty hero image file: " + data.heroImage);
      }
    }
    for (const key of ["heroImageAlt", "heroImageCaption"]) {
      if (typeof data[key] !== "string" || data[key].trim().length < 30) {
        issues.push(name + ": missing or insufficient " + key + " for SEO and accessibility.");
      }
    }
    if (![data.heroImageWidth, data.heroImageHeight].every((n) => Number.isInteger(n) && n > 0)) {
      issues.push(name + ": hero image needs positive pixel width and height.");
    }
  }

  checkLink(data.primaryToolPath, "primaryToolPath");
  if (data.relatedTools !== undefined && !Array.isArray(data.relatedTools)) {
    issues.push(name + ": relatedTools must be an array.");
  } else {
    for (const [index, related] of (data.relatedTools || []).entries()) {
      checkLink(related?.path, "relatedTools[" + index + "].path");
    }
  }

  let linksToTools = 0;
  const body = content.slice(match[0].length);
  try {
    marked.walkTokens(marked.lexer(body), (token) => {
      if (token.type !== "link" || typeof token.href !== "string") return;
      const target = toolPathFromLink(token.href);
      if (target === null) return;
      linksToTools++;
      if (!validPaths.has(target)) {
        issues.push(name + ": markdown link references an unknown tool: " + token.href);
      }
    });
  } catch (error) {
    issues.push(name + ": markdown links could not be parsed: " + error.message);
  }

  // Also validate HTML/MDX anchors written directly in Markdown content.
  for (const anchor of body.matchAll(/<(?:a|Link)\b[^>]*?\bhref=["']([^"']+)["'][^>]*>/g)) {
    const target = toolPathFromLink(anchor[1]);
    if (target === null) continue;
    linksToTools++;
    if (!validPaths.has(target)) {
      issues.push(name + ": HTML/MDX link references an unknown tool: " + anchor[1]);
    }
  }
  if (linksToTools === 0) issues.push(name + ": no tool link in article body.");
  return issues;
}

export function validateBlogDirectory(root = process.cwd(), dir = path.join(root, "src/content/blog")) {
  const registry = readToolRegistry(root);
  if (!fs.existsSync(dir)) return { errors: ["Missing blog directory: " + dir], checkedPosts: 0, toolCount: registry.tools.length };
  const files = fs.readdirSync(dir).filter((name) => /\.(md|mdx)$/i.test(name));
  const errors = files.flatMap((name) =>
    validateBlogContent(name, fs.readFileSync(path.join(dir, name), "utf8"), registry.paths, { publicRoot: path.join(root, "public") })
  );
  return { errors, checkedPosts: files.length, toolCount: registry.tools.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { errors, checkedPosts, toolCount } = validateBlogDirectory();
    if (errors.length) {
      console.error(errors.map((message) => "- " + message).join("\n"));
      process.exitCode = 1;
    } else {
      console.log("Blog links validated: " + checkedPosts + " articles against " + toolCount + " canonical tools.");
    }
  } catch (error) {
    console.error("Blog validator failed:", error);
    process.exitCode = 1;
  }
}
