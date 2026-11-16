import fs from "node:fs";
import {releaseSimpleTools} from "./release-simple-tools.mjs";
const release=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
const queue=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const monday=release.history.length
 ? new Date(release.history.at(-1).date+"T02:00:00Z")
 : new Date(release.startDate+"T02:00:00Z");
if(release.history.length)monday.setUTCDate(monday.getUTCDate()+7);
const remaining=queue.filter(x=>x.ready&&!release.published.includes(x.slug)).length;
const result=releaseSimpleTools({now:monday});
const expected=Math.min(release.weeklyLimit,remaining);
if(result.released.length!==expected)throw new Error("Expected "+expected+" preview releases but got "+result.released.length+" ("+result.reason+")");
console.log("Preview published "+result.released.length+" tools on "+result.date+". Existing live release manifest will be restored by CI.");
