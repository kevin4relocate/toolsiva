import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function verifyHardening({
  distDir = path.resolve("dist"),
  sourceDir = path.resolve("src"),
} = {}) {
  const errors = [];
  const assert = (condition, message) => { if (!condition) errors.push(message); };
  const headersFile = path.join(distDir, "_headers");
  assert(fs.existsSync(headersFile), "Missing Workers static assets _headers.");
  const headers = fs.existsSync(headersFile) ? fs.readFileSync(headersFile, "utf8") : "";
  for (const directive of [
    "X-Content-Type-Options: nosniff",
    "X-Frame-Options: DENY",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Permissions-Policy:",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ]) {
    assert(headers.includes(directive), "Missing security response header/directive: " + directive);
  }
  assert(/\/_astro\/\*\s*\n\s*Cache-Control: public, max-age=31536000, immutable/.test(headers),
    "Hashed Astro assets must use immutable browser cache policy.");
  assert(!/\/\*\s*\n\s*Cache-Control:\s*public,\s*max-age=31536000/im.test(headers),
    "Do not apply immutable cache policy to non-versioned routes.");

  const style = fs.readFileSync(path.join(sourceDir, "styles/global.css"), "utf8");
  assert(style.includes("prefers-reduced-motion: reduce"), "Missing reduced motion support.");
  assert(style.includes(":focus-visible"), "Missing visible keyboard focus rules.");

  const header = fs.readFileSync(path.join(sourceDir, "components/layout/Header.astro"), "utf8");
  assert(header.includes("MAX_MENU_TOOLS"), "Header menu should have a bounded per-category link count.");

  const experience = fs.readFileSync(path.join(sourceDir, "components/tools/ToolExperience.astro"), "utf8");
  assert(experience.includes('id="toolsiva-command-title"'), "Palette needs an accessible title.");
  assert(experience.includes("previouslyFocused?.focus()"), "Palette must restore focus on close.");
  assert(experience.includes('event.key === "Tab"'), "Palette must trap Tab focus.");
  assert(experience.includes("safeJsonForHtml(toolIndex)"), "Embedded tool index JSON must be HTML-safe.");

  for (const name of ["CalculatorToolWorkspace", "ConverterToolWorkspace", "ExpansionToolWorkspace"]) {
    const file = fs.readFileSync(path.join(sourceDir, "components/tools", name + ".astro"), "utf8");
    assert(file.includes('aria-live="polite"'), name + " needs a live output.");
  }

  const htmlPaths = fs.existsSync(distDir)
    ? [path.join(distDir, "index.html"), path.join(distDir, "tools/text/word-counter/index.html")]
    : [];
  for (const htmlFile of htmlPaths) {
    assert(fs.existsSync(htmlFile), "Missing representative built page: " + htmlFile);
    if (!fs.existsSync(htmlFile)) continue;
    const html = fs.readFileSync(htmlFile, "utf8");
    assert(html.includes('id="toolsiva-command-title"'), "Missing modal title in built HTML: " + htmlFile);
    assert(html.includes('href="#main-content"'), "Missing keyboard skip link: " + htmlFile);
  }
  return { errors, checkedPages: htmlPaths.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verifyHardening();
  console.log("Phase 6 security/accessibility build checks: " + result.checkedPages + " representative pages.");
  if (result.errors.length) {
    console.error(result.errors.map((item) => "- " + item).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Static security headers and accessibility invariants verified.");
  }
}
