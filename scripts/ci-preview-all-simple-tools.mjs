import fs from "node:fs";
import { releaseSimpleTools, nextScheduledToolSlot } from "./release-simple-tools.mjs";

const queue = JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json", "utf8"));
const state = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
if (queue.length < 967) throw Error("Expected at least 967 queued tools.");
if (new Set(queue.map(tool => tool.slug)).size !== queue.length) throw Error("Duplicate tool slugs.");
if (state.weeklyLimit !== 20 || state.perSlotLimit !== 10) throw Error("Expected 20 tools/week, 10 per Mon/Thu slot.");

const remaining = queue.filter(tool => tool.ready && !state.published.includes(tool.slug)).length;
let count = 0;
let slots = 0;
const weeks = new Set();
while (count < remaining) {
 const latest = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
 const slot = nextScheduledToolSlot(latest);
 const expected = Math.min(latest.perSlotLimit, remaining - count);
 const released = releaseSimpleTools({ now: slot });
 if (released.released.length !== expected) {
   throw Error("Expected " + expected + " in slot " + (slots + 1) + " but got " + released.released.length + " (" + released.reason + ")");
 }
 count += released.released.length;
 slots += 1;
 const day = new Date(released.date + "T00:00:00Z");
 day.setUTCDate(day.getUTCDate() - ((day.getUTCDay()+6)%7));
 weeks.add(day.toISOString().slice(0,10));
}
const published = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
if (published.published.length !== queue.length || published.published.some((slug,i) => slug!==queue[i].slug)) {
 throw Error("Published tools were out of queue order or omitted.");
}
console.log("Full release simulation: " + count + " additional tools across " + slots + " slots in " + weeks.size + " weeks (Monday and Thursday), " + published.published.length + " queued tools published.");
