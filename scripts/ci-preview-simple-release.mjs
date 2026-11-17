import fs from "node:fs";
import { releaseSimpleTools, nextScheduledToolSlot } from "./release-simple-tools.mjs";
const state = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
const queue = JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json", "utf8"));
const slot = nextScheduledToolSlot(state);
const remaining = queue.filter(x => x.ready && !state.published.includes(x.slug)).length;
const result = releaseSimpleTools({ now: slot });
const expected = Math.min(state.perSlotLimit, remaining);
if (result.released.length !== expected) {
 throw new Error("Expected " + expected + " tools in next " + slot.toISOString() + " preview but got " + result.released.length + " (" + result.reason + ")");
}
console.log("Preview published " + result.released.length + " tools on " + result.date + ". The original manifest is restored after CI.");
