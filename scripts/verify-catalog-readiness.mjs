import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const queue = JSON.parse(read("src/data/simpleToolQueue.json"));
const state = JSON.parse(read("src/data/simpleToolRelease.json"));
const retired = JSON.parse(read("src/data/toolFunctionalAudit.json")).retired;
const original = [...read("src/data/tools.ts").matchAll(/(?:slug|"slug")\s*:\s*"([^"]+)"/g)].map(m => m[1]);
const active = [...original, ...queue.map(t => t.slug)];
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const duplicates = (values) => [...values.reduce((acc, x) => acc.set(x, (acc.get(x) ?? 0) + 1), new Map())].filter(([, n]) => n > 1);

check(original.length === 123, "The original public catalog should contain exactly 123 tools.");
check(queue.length >= 967, "Expected at least 967 scheduled tools after the 2026-11-17 dedup audit.");
check(duplicates(active).length === 0, "Duplicate tool slugs found.");
check(duplicates(active.map(x => x.replace(/[^a-z0-9]/gi, "").toLowerCase())).length === 0, "Normalized tool slugs are duplicated.");
check(duplicates(queue.map(t => t.name.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))).length === 0, "Duplicated scheduled tool names.");
check(new Set(queue.map(t => `/tools/${t.category}/${t.slug}/`)).size === queue.length, "Scheduled routes are duplicated.");
check(state.startDate === "2026-11-23", "Unexpected first eligible tool publication date.");
check(state.weeklyLimit === 10, "Release limit must be exactly 10.");
check(Array.isArray(state.published) && Array.isArray(state.history), "Invalid release manifest arrays.");
check(state.published.length === new Set(state.published).size, "Previously published tool is repeated.");
check(state.published.every((slug, i) => slug === queue[i]?.slug), "Published tools must form the beginning of the audited queue.");
check(queue.every((t, i) => t.ready === true && t.week === Math.floor(i / 10) + 1), "A queued tool is unready or in the wrong scheduled week.");
check(new Set(retired.map(x => x.slug)).size === retired.length, "Retired audit contains duplicate entries.");
check(retired.every(x => !active.includes(x.slug)), "Retired functional duplicates were reintroduced.");
check(retired.every(x => active.includes(x.keptAs)), "A retired tool lost its canonical replacement.");
check(queue.every(t => t.category !== "qr" && !/(?:^|-)(?:pdf|file|upload|image|barcode|qr)(?:-|$)/.test(t.slug)), "Scheduled catalog includes a forbidden file/upload/PDF/image/QR mode.");
const srcFiles = fs.readdirSync(path.join(root, "src/lib")).filter(x => x.endsWith(".mjs"));
const handlers = srcFiles.map(x => read("src/lib/" + x)).join("\n");
const caseCount = new Map();
for (const m of handlers.matchAll(/\bcase\s+["']([^"']+)["']\s*:/g)) caseCount.set(m[1], (caseCount.get(m[1]) ?? 0) + 1);
for (const tool of queue) {
 const count = caseCount.get(tool.slug) ?? 0;
 if (tool.slug === "yaml-to-json") {
   check(count === 0 && read("src/components/tools/SimpleToolWorkspace.astro").includes('mode==="yaml-to-json"'), "YAML special dispatcher is missing.");
 } else check(count === 1, `Expected one engine switch case for ${tool.slug}, found ${count}.`);
}
for (const entry of retired) check(!caseCount.has(entry.slug), "Retired engine still has a switch branch: " + entry.slug);
const equivalences = [
 ["angle-converter", "degrees-to-radians-calculator"],
 ["angle-converter", "radians-to-degrees-calculator"],
 ["pythagorean-theorem-calculator", "rectangle-diagonal-calculator"],
 ["euclidean-vector-distance-calculator", "distance-between-points-3d"],
 ["percentage-change-calculator", "revenue-growth-from-two-periods"],
 ["vector-angle-calculator", "vector3-angle-between"],
];
for (const [canonical, alias] of equivalences) check(active.includes(canonical) && !active.includes(alias), "Known redundant capability is still queued: " + alias);
const weekdays = state.history.map(h => {
 const d = new Date(h.date + "T02:00:00Z");
 return Number.isFinite(d.getTime()) && d.getUTCDay() === 1 && Array.isArray(h.slugs) && h.slugs.length <= 10;
});
check(weekdays.every(Boolean), "Release history contains invalid publication dates or excessive batches.");
check(state.history.flatMap(h => h.slugs).join("|") === state.published.join("|"), "Release history disagrees with published order.");
const result = {
 status: errors.length === 0 ? "PASS" : "FAIL",
 publicTools: original.length,
 scheduledTools: queue.length,
 totalPlanned: active.length,
 currentlyPublishedFromQueue: state.published.length,
 remainingUnpublished: queue.length - state.published.length,
 lastScheduledWeek: queue.at(-1)?.week ?? 0,
 retiredOverlapTools: retired.length,
 duplicateSlugs: duplicates(active).length,
 duplicateNames: duplicates(queue.map(t => t.name.trim().toLowerCase())).length,
 unmatchedScheduledEngineCases: errors.filter(x => x.includes("engine switch case")).length,
 errors,
};
fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/catalog-readiness.json"), JSON.stringify(result, null, 2) + "\n");
console.log("Catalog quality gate:", JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
