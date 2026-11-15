import fs from "node:fs";
import path from "node:path";
import { auditBuiltSite } from "./lib/seo-audit.mjs";

const root = process.cwd();
const guideFile = path.join(root, "src/data/toolUsageNotes.json");
let guidance = null;
if (fs.existsSync(guideFile)) {
  const notes = JSON.parse(fs.readFileSync(guideFile, "utf8"));
  guidance = { count: Object.keys(notes).length };
}

const report = auditBuiltSite({
  projectRoot: root,
  siteUrl: (process.env.SITE_URL ?? "https://toolsiva.com").replace(/\/+$/, ""),
  guidance,
});
const reportsDir = path.join(root, "reports");
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(path.join(reportsDir, "production-seo-audit.json"), JSON.stringify(report, null, 2) + "\n");
const csv = (value) => '"' + String(value ?? "").replaceAll('"', '""') + '"';
const issueCsv = [
  ["Severity", "Code", "Page/File", "Message"].map(csv).join(","),
  ...report.issues.map(({ severity, code, file, message }) => [severity, code, file, message].map(csv).join(",")),
].join("\n") + "\n";
fs.writeFileSync(path.join(reportsDir, "production-seo-issues.csv"), issueCsv);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("===== TOOLSIVA BUILD SEO AUDIT =====");
  console.log("HTML pages: " + report.summary.htmlPages);
  console.log("Tool pages: " + report.summary.toolPages + "/" + report.summary.expectedToolPages);
  console.log("Categories: " + report.summary.categories);
  console.log("Sitemap URLs: " + report.summary.sitemapUrls);
  console.log("Pages linking to tools: " + report.summary.inboundLinkedTools + "/" + report.summary.expectedToolPages);
  console.log("Specialized usage guides: " + (report.summary.specializedGuides ?? "not measured"));
  console.log("Errors: " + report.summary.errors + " | Warnings: " + report.summary.warnings);
  for (const item of report.issues) {
    console.log("[" + item.severity.toUpperCase() + " " + item.code + "] " + item.file + ": " + item.message);
  }
  console.log("Reports: reports/production-seo-audit.json and reports/production-seo-issues.csv");
}

if (report.summary.errors > 0 || (process.argv.includes("--strict") && report.summary.warnings > 0)) {
  process.exitCode = 1;
}
