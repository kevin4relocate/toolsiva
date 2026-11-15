import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { verifyHardening } from "../scripts/verify-hardening.mjs";
import { safeJsonForHtml } from "../src/lib/safeJsonForHtml.ts";

test("Safe HTML JSON serialization prevents script breakout and roundtrips", () => {
  const source = { name: '</script><script>alert("xss")</script>', entity: "&", sep: "\u2028" };
  const serialized = safeJsonForHtml(source);
  assert.doesNotMatch(serialized, /<\/script/i);
  assert.ok(serialized.includes("\\u003c"));
  assert.deepEqual(JSON.parse(serialized), source);
});

test("Cloudflare security header policy blocks framing and prevents MIME sniffing", () => {
  const headers = fs.readFileSync("public/_headers", "utf8");
  assert.match(headers, /^\/\*\s*$/m);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /\/_astro\/\*\s*\n\s*Cache-Control: public, max-age=31536000, immutable/);
  assert.doesNotMatch(headers, /\/\*\s*\n\s*Cache-Control: public, max-age=31536000, immutable/);
});

test("Header navigation keeps menu limited while all tools remain accessible from categories", () => {
  const header = fs.readFileSync("src/components/layout/Header.astro", "utf8");
  assert.match(header, /const MAX_MENU_TOOLS = 8/);
  assert.match(header, /\.slice\(0, MAX_MENU_TOOLS\)/);
  assert.match(header, /View all \{category\.name\}/);
});

test("Command palette has an accessible label and keyboard focus lifecycle", () => {
  const code = fs.readFileSync("src/components/tools/ToolExperience.astro", "utf8");
  assert.match(code, /id="toolsiva-command-title"/);
  assert.match(code, /aria-modal="true"/);
  assert.match(code, /previouslyFocused\?\.focus\(\)/);
  assert.match(code, /event\.key === "Tab"/);
  assert.match(code, /safeJsonForHtml\(toolIndex\)/);
});

test("Input workspaces have labelled fields and accessible result announcements", () => {
  for (const workspace of ["CalculatorToolWorkspace", "ConverterToolWorkspace", "ExpansionToolWorkspace"]) {
    const source = fs.readFileSync("src/components/tools/" + workspace + ".astro", "utf8");
    assert.match(source, /aria-live="polite"/);
  }
  const converter = fs.readFileSync("src/components/tools/ConverterToolWorkspace.astro", "utf8");
  assert.match(converter, /aria-label="Source unit"/);
  assert.match(converter, /aria-label="Destination unit"/);
  const expansion = fs.readFileSync("src/components/tools/ExpansionToolWorkspace.astro", "utf8");
  assert.match(expansion, /aria-label="Text input"/);
  assert.match(expansion, /aria-label="Processed text result"/);
});

test("Reduced motion preference overrides animated and smooth-scroll effects", () => {
  const css = fs.readFileSync("src/styles/global.css", "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /scroll-behavior: auto !important/);
  assert.match(css, /:focus-visible/);
});

test("Build verifier rejects missing headers and other hardening artifacts", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "toolsiva-phase6-"));
  try {
    const result = verifyHardening({ distDir: dir });
    assert.ok(result.errors.some((error) => error.includes("_headers")));
    assert.ok(result.errors.some((error) => error.includes("representative built page")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
