import fs from "node:fs";
import { releaseSimpleTools } from "./release-simple-tools.mjs";

const queue = JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json", "utf8"));
const state = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
if (queue.length < 291) throw new Error("Expected at least 291 queued tools.");
if (new Set(queue.map((tool) => tool.slug)).size !== queue.length) throw new Error("Duplicate scheduled tool slugs.");

const limit = state.weeklyLimit;
if (!Number.isInteger(limit) || limit !== 10) throw new Error("Release limit must remain ten tools per week.");
const totalRemaining = queue.filter((tool) => tool.ready && !state.published.includes(tool.slug)).length;
let date = new Date((state.history.length ? state.history.at(-1).date : state.startDate) + "T02:00:00Z");
if (state.history.length) date.setUTCDate(date.getUTCDate() + 7);
let published = 0;
let weeks = 0;

while (published < totalRemaining) {
  const expected = Math.min(limit, totalRemaining - published);
  const release = releaseSimpleTools({ now: date });
  if (release.released.length !== expected) {
    throw new Error("Expected " + expected + " tools in week " + (weeks + 1) + " but got " + release.released.length + " (" + release.reason + ")");
  }
  published += release.released.length;
  weeks++;
  date.setUTCDate(date.getUTCDate() + 7);
}

const result = JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json", "utf8"));
if (result.published.length !== queue.length || result.published.some((slug, index) => slug !== queue[index].slug)) {
  throw new Error("Scheduled tools were published out of order or omitted.");
}
console.log("Full release simulation: " + published + " additional tools, " + weeks + " future Mondays, " + result.published.length + " total queued tools.");
