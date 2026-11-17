import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { releaseSimpleTools } from "../../scripts/release-simple-tools.mjs";

export function toolReleaseSlotDate(index) {
 const d=new Date(Date.UTC(2026,10,23+7*Math.floor(index/2)+(index%2?3:0),2));
 return d;
}
export function simulateScheduledPhase(queue, maxBatch=Infinity) {
 const phase=queue.filter(t=>t.batch<=maxBatch);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"toolsiva-twice-weekly-"));
 try{
  fs.mkdirSync(path.join(root,"src/data"),{recursive:true});
  fs.writeFileSync(path.join(root,"src/data/simpleToolQueue.json"),JSON.stringify(phase));
  fs.writeFileSync(path.join(root,"src/data/simpleToolRelease.json"),
    JSON.stringify({startDate:"2026-11-23",weeklyLimit:20,perSlotLimit:10,published:[],history:[]}));
  const slots=Math.ceil(phase.length/10);
  for(let i=0;i<slots;i++){
   const r=releaseSimpleTools({root,now:toolReleaseSlotDate(i)});
   assert.equal(r.released.length,Math.min(10,phase.length-10*i),"slot "+(i+1));
   assert.equal(releaseSimpleTools({root,now:toolReleaseSlotDate(i)}).released.length,0,"duplicate slot must not republish");
  }
  const state=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
  assert.deepEqual(state.published,phase.map(t=>t.slug));
  assert.equal(state.history.length,slots);
  const weeks=new Map();
  for(const h of state.history){
   const d=new Date(h.date+"T00:00:00Z");
   assert.ok([1,4].includes(d.getUTCDay()),"only Monday/Thursday allowed");
   assert.ok(h.slugs.length>0&&h.slugs.length<=10,"slot maximum is 10");
   d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
   const key=d.toISOString().slice(0,10);
   weeks.set(key,(weeks.get(key)||0)+h.slugs.length);
  }
  assert.ok([...weeks.values()].every(n=>n<=20),"no week may exceed 20 published tools");
  assert.equal(weeks.size,Math.ceil(phase.length/20));
  return {state,phase,slots,weeks:weeks.size};
 }finally{fs.rmSync(root,{recursive:true,force:true});}
}
