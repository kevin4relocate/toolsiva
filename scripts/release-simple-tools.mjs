import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

export function releaseSimpleTools({root=process.cwd(),now=new Date(),dryRun=false}={}){

 const file=path.join(root,"src/data/simpleToolRelease.json");
 const queue=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolQueue.json"),"utf8"));
 const state=JSON.parse(fs.readFileSync(file,"utf8"));
 const local=new Date(now.getTime()+7*3600000),date=local.toISOString().slice(0,10);
 if(date<state.startDate)return {released:[],reason:"before-first-slot",date};
 if(local.getUTCDay()!==1||local.getUTCHours()<9)return {released:[],reason:"outside-monday-09-slot",date};
 if(state.history.some(h=>h.date===date))return {released:[],reason:"week-already-released",date};
 const published=new Set(state.published);
 const next=queue.filter(t=>t.ready&&!published.has(t.slug)).slice(0,state.weeklyLimit||10);
 if(next.length===0)return {released:[],reason:"no-tested-tools-ready",date};
 const slugs=next.map(t=>t.slug);
 if(!dryRun){state.published.push(...slugs);state.history.push({date,slugs});fs.writeFileSync(file,JSON.stringify(state,null,2)+"\n");}
 return {released:slugs,reason:dryRun?"dry-run":"published",date,total:state.published.length+(dryRun?slugs.length:0)};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try {const result=releaseSimpleTools({dryRun:process.argv.includes("--dry-run")});console.log(JSON.stringify(result,null,2));}
 catch(error){console.error(error);process.exitCode=1;}
}
