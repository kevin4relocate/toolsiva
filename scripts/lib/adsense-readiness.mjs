import fs from "node:fs";
import path from "node:path";
import { readToolRegistry } from "./tool-registry.mjs";

const REQUIRED_PAGES = [
  "/", "/about", "/contact", "/privacy", "/terms", "/disclaimer",
  "/editorial-standards", "/tools", "/blog",
];

const MANUAL_CHECKS = [
  {
    code: "publisher-eligibility",
    detail: "Confirm publisher age/identity, account ownership and that the application uses the real toolsiva.com domain.",
  },
  {
    code: "production-availability",
    detail: "Open the live site with and without JavaScript; check 200/404 responses, redirects, robots.txt, sitemap, navigation, HTTPS and responsive layout.",
  },
  {
    code: "contact-deliverability",
    detail: "Send a real message to the published contact address and verify delivery and a monitored inbox.",
  },
  {
    code: "content-originality",
    detail: "Manually review all indexable templates and a representative set from each tool category for originality, usefulness and accurate examples. One page or a high tool count does not prove content value.",
  },
  {
    code: "editorial-review",
    detail: "Review AI-assisted drafts and published articles for factual accuracy, tool behavior, source quality, originality and editorial value; do not auto-publish unreviewed drafts.",
  },
  {
    code: "search-console",
    detail: "Review real Google Search Console indexing, security issues and selected canonicals. Inclusion in a sitemap is not proof of indexing.",
  },
  {
    code: "traffic-quality",
    detail: "Compare Cloudflare edge requests with real browser sessions and Search Console clicks; investigate bots and invalid traffic before estimating ad revenue.",
  },
  {
    code: "adsense-account",
    detail: "Create/connect the actual AdSense account, use Google's site verification steps, and wait for the account/site decision. Never invent a pub-ID or promise approval.",
  },
  {
    code: "ads-privacy-cmp",
    detail: "Before enabling ads, update Privacy Policy and implement/test the applicable Google-certified IAB TCF CMP for EEA, UK and Switzerland. Existing analytics-only consent does not authorize ads.",
  },
  {
    code: "ads-txt-and-placement",
    detail: "After the real publisher ID is assigned, publish the exact authorized sellers record and verify /ads.txt. Inspect real ad placements, especially tool controls, mobile and low-content pages, before turning on ads.",
  },
];

function gather(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(root, entry.name);
    return entry.isDirectory() ? gather(location) : [location];
  });
}

function pathFromHtml(file, dist) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404.html";
  return "/" + relative.replace(/\/index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "");
}

function cleanText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot);/gi, " ")
    .replace(/\s+/g, " ").trim();
}

function hasLiveAds(html) {
  return /<script\b[^>]*src=["'][^"']*(?:pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle|googleads\.g\.doubleclick\.net)[^"']*/i.test(html)
    || /<ins\b[^>]*\badsbygoogle\b/i.test(html);
}

export function auditAdsenseReadiness({
  root = process.cwd(),
  dist = path.join(root, "dist"),
  registry = null,
} = {}) {
  const issues = [];
  const add = (severity, code, route, detail) => issues.push({ severity, code, route, detail });
  const result = {
    generatedAt: new Date().toISOString(),
    inspection: "Built static HTML + repository configuration only; no external AdSense account access.",
    summary: {},
    issues,
    manualChecks: MANUAL_CHECKS.map((item) => ({ ...item, status: "not_verified" })),
  };

  if (!fs.existsSync(dist)) {
    add("error", "missing-build", "dist/", "Run npm run build before auditing AdSense readiness.");
    result.summary = { errors: 1, warnings: 0, manualPending: MANUAL_CHECKS.length };
    return result;
  }
  const toolRegistry = registry ?? readToolRegistry(root);
  const pages = new Map(gather(dist).filter((file) => file.endsWith(".html"))
    .map((file) => [pathFromHtml(file, dist), fs.readFileSync(file, "utf8")]));
  const read = (route) => pages.get(route) ?? "";

  for (const route of REQUIRED_PAGES) {
    if (!pages.has(route)) add("error", "missing-trust-or-navigation-page", route, "Required public page missing from build.");
    else if (!/<h1\b/i.test(read(route))) {
      add("error", "missing-visible-heading", route, "Expected a semantic H1 on the public page.");
    }
  }

  for (const [route, html] of pages) {
    if (hasLiveAds(html)) {
      add("error", "premature-ad-code", route, "AdSense/display ad code is active before publisher account and CMP verification.");
    }
    if (/data-ad-placement=["'][^"']+/i.test(html)) {
      add("error", "unconfigured-ad-placeholder", route, "An empty advertisement region is rendered by the preapproval build.");
    }
    if (route === "/404.html" && !/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)) {
      add("error", "indexable-error-page", route, "The 404 page must be marked noindex.");
    }
  }

  for (const route of ["/about", "/contact", "/privacy", "/terms", "/editorial-standards"]) {
    const page = read(route);
    if (!page) continue;
    if (cleanText(page).split(/\s+/).length < 80) {
      add("warning", "limited-trust-page-content", route, "Review whether this page provides meaningful detail.");
    }
  }

  if (read("/contact") && !/mailto:[^"' <>]+@[^"' <>]+/i.test(read("/contact"))) {
    add("error", "contact-address-missing", "/contact", "Contact page must offer a visible email contact method.");
  }

  if (read("/privacy") && !/google analytics/i.test(cleanText(read("/privacy")))) {
    add("error", "privacy-analytics-disclosure-missing", "/privacy", "Policy does not mention current Google Analytics processing.");
  }

  if (read("/editorial-standards") && !/ai-assisted/i.test(cleanText(read("/editorial-standards")))) {
    add("error", "editorial-transparency-missing", "/editorial-standards", "Editorial policy must disclose AI-assisted drafting.");
  }

  const actualToolRoutes = toolRegistry.tools.filter((tool) => pages.has(tool.path));
  if (actualToolRoutes.length !== toolRegistry.tools.length) {
    add("error", "tool-page-coverage", "/tools", actualToolRoutes.length + "/" + toolRegistry.tools.length + " tool routes are generated.");
  }

  for (const tool of actualToolRoutes) {
    const html = read(tool.path);
    if (!/How to use this tool/i.test(html) || !/Frequently asked questions/i.test(html)) {
      add("error", "tool-explanation-missing", tool.path, "Tool page is missing instructions or FAQs.");
    }
  }

  const blogRoutes = [...pages.keys()].filter((route) => route.startsWith("/blog/"));
  if (blogRoutes.length < 3) {
    add("warning", "limited-published-guide-library", "/blog",
      "Only " + blogRoutes.length + " publicly built guides. No official minimum exists; editorial review of content depth and coverage is recommended.");
  }
  for (const route of blogRoutes) {
    const html = read(route);
    const content = html.match(/<div class="blog-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
    if (content && cleanText(content).split(/\s+/).length < 250) {
      add("warning", "short-published-guide", route, "Review whether this guide answers its reader's question with sufficiently useful detail; word count is not an AdSense criterion.");
    }
  }

  const workflowPath = path.join(root, ".github/workflows/daily-blog.yml");
  const generatorPath = path.join(root, "scripts/generate-daily-blog.mjs");
  if (!fs.existsSync(workflowPath) || !fs.existsSync(generatorPath)) {
    add("error", "missing-editorial-workflow", ".github/workflows", "Cannot verify blog drafting workflow.");
  } else {
    const workflow = fs.readFileSync(workflowPath, "utf8");
    const generator = fs.readFileSync(generatorPath, "utf8");
    if (!generator.includes("draft: true") || !workflow.includes("gh pr create") ||
      /git push origin HEAD:main/.test(workflow)) {
      add("error", "unreviewed-autopublishing", ".github/workflows/daily-blog.yml",
        "AI-assisted content must enter an unpublished editorial review flow.");
    }
  }

  const adSlotPath = path.join(root, "src/components/common/AdSlot.astro");
  if (fs.existsSync(adSlotPath)) {
    const slot = fs.readFileSync(adSlotPath, "utf8");
    if (!/const enabled = false;/.test(slot)) {
      add("error", "premature-adslot-toggle", "src/components/common/AdSlot.astro",
        "Pre-approval site must fail closed if ad configuration is missing.");
    }
  }

  const errors = issues.filter((item) => item.severity === "error").length;
  const warnings = issues.filter((item) => item.severity === "warning").length;
  result.summary = {
    htmlPages: pages.size,
    tools: { generated: actualToolRoutes.length, expected: toolRegistry.tools.length },
    publishedGuides: blogRoutes.length,
    technicalGate: errors === 0 ? "PASS" : "FAIL",
    overallAdSenseDecision: "NOT_DETERMINED",
    errors, warnings,
    manualPending: MANUAL_CHECKS.length,
  };
  return result;
}
