import fs from "node:fs";
import {releaseSimpleTools} from "./release-simple-tools.mjs";
const q=JSON.parse(fs.readFileSync("src/data/simpleToolQueue.json","utf8"));
const state=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
if(q.length!==141)throw new Error("Expected 141 queued tools.");
if(state.published.length)throw new Error("Run full-preview only against an unreleased development queue.");
let total=0;
for(let i=0;i<15;i++){
 const when=new Date(Date.UTC(2026,10,23+7*i,2));
 const result=releaseSimpleTools({now:when});
 if(result.released.length!==(i===14?1:10))throw new Error("Wrong release count at week "+(i+1)+": "+result.released.length);
 total+=result.released.length;
}
const all=JSON.parse(fs.readFileSync("src/data/simpleToolRelease.json","utf8"));
if(total!==141||all.published.some((slug,index)=>slug!==q[index].slug))throw new Error("Publication order changed.");
console.log("Full scheduled publication simulation: "+total+" tools across "+all.history.length+" Mondays.");
