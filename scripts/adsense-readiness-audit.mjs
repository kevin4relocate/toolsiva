import fs from "node:fs";
import path from "node:path";
import { auditAdsenseReadiness } from "./lib/adsense-readiness.mjs";

const report = auditAdsenseReadiness();
const dir = path.resolve("reports");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "adsense-readiness.json"), JSON.stringify(report, null, 2) + "\n");

const quote = (value) => '"' + String(value ?? "").replaceAll('"', '""') + '"';
const issues = [
  ["Severity", "Code", "Route", "Detail"].map(quote).join(","),
  ...report.issues.map((item) => [item.severity, item.code, item.route, item.detail].map(quote).join(",")),
].join("\n") + "\n";
fs.writeFileSync(path.join(dir, "adsense-readiness-issues.csv"), issues);

console.log("===== TOOLSIVA ADSENSE READINESS (STATIC AUDIT ONLY) =====");
console.log("Technical gate: " + report.summary.technicalGate);
console.log("Actual AdSense approval: " + report.summary.overallAdSenseDecision);
console.log("Built HTML pages: " + (report.summary.htmlPages ?? 0));
console.log("Tool pages: " + (report.summary.tools?.generated ?? 0) + "/" + (report.summary.tools?.expected ?? 0));
console.log("Published guides: " + (report.summary.publishedGuides ?? 0));
console.log("Technical errors: " + report.summary.errors + " | Quality warnings: " + report.summary.warnings);
console.log("Manual verification required: " + report.summary.manualPending + " items");
for (const issue of report.issues) console.log("[" + issue.severity.toUpperCase() + " " + issue.code + "] " + issue.route + ": " + issue.detail);
console.log("Reports: reports/adsense-readiness.json and reports/adsense-readiness-issues.csv");
if (report.summary.errors) process.exitCode = 1;
