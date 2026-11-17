import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const RELEASE_WEEKDAYS = [1, 4]; // Monday and Thursday in Vietnam (UTC+7).

function parseDate(value) {
 const instant = new Date(value + "T00:00:00Z");
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(instant.getTime()) || instant.toISOString().slice(0,10)!==value) {
   throw Error("Invalid release date: "+value);
 }
 return instant;
}
export function nextScheduledToolSlot(state) {
 const base = state.history.length
   ? new Date(parseDate(state.history.at(-1).date).getTime() + DAY_MS)
   : parseDate(state.startDate);
 for (let i = 0; i < 8; i++) {
   if (RELEASE_WEEKDAYS.includes(base.getUTCDay())) {
     return new Date(base.getTime() + 2 * 60 * 60 * 1000); // 09:00 ICT.
   }
   base.setUTCDate(base.getUTCDate() + 1);
 }
 throw Error("Cannot locate the next Monday or Thursday slot.");
}
export function releaseSimpleTools({ root = process.cwd(), now = new Date(), dryRun = false } = {}) {
 const file = path.join(root, "src/data/simpleToolRelease.json");
 const queue = JSON.parse(fs.readFileSync(path.join(root, "src/data/simpleToolQueue.json"), "utf8"));
 const state = JSON.parse(fs.readFileSync(file, "utf8"));
 const weeklyLimit = state.weeklyLimit;
 const perSlotLimit = state.perSlotLimit;
 if (weeklyLimit !== 20 || perSlotLimit !== 10) throw Error("The release policy must be 20 tools/week (10 per Mon/Thu slot).");
 if (!Array.isArray(state.history) || !Array.isArray(state.published)) throw Error("Invalid release manifest.");
 const local = new Date(now.getTime() + VIETNAM_OFFSET_MS);
 const date = local.toISOString().slice(0, 10);
 if (date < state.startDate) return { released: [], reason: "before-first-slot", date };
 if (!RELEASE_WEEKDAYS.includes(local.getUTCDay()) || local.getUTCHours() < 9) {
   return { released: [], reason: "outside-monday-thursday-09-slot", date };
 }
 if (state.history.some(h => h.date === date)) return { released: [], reason: "slot-already-released", date };
 const weekStart = parseDate(date).getTime() - (local.getUTCDay() + 6) % 7 * DAY_MS;
 const weekEnd = weekStart + 7 * DAY_MS;
 const releasedThisWeek = state.history
   .filter(h => { const t = parseDate(h.date).getTime(); return t >= weekStart && t < weekEnd; })
   .reduce((sum, h) => sum + h.slugs.length, 0);
 const allowance = Math.min(perSlotLimit, Math.max(0, weeklyLimit - releasedThisWeek));
 if (allowance === 0) return { released: [], reason: "weekly-limit-reached", date };
 const published = new Set(state.published);
 const next = queue.filter(t => t.ready && !published.has(t.slug)).slice(0, allowance);
 if (!next.length) return { released: [], reason: "no-tested-tools-ready", date };
 const slugs = next.map(t => t.slug);
 if (!dryRun) {
   state.published.push(...slugs);
   state.history.push({ date, slugs });
   fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");
 }
 return { released: slugs, reason: dryRun ? "dry-run" : "published", date, total: state.published.length + (dryRun ? slugs.length : 0) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 try {
   const result = releaseSimpleTools({ dryRun: process.argv.includes("--dry-run") });
   console.log(JSON.stringify(result, null, 2));
 } catch (error) { console.error(error); process.exitCode = 1; }
}
