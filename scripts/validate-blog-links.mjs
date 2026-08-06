import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT,"src/content/blog");
const source = fs.readFileSync(path.join(ROOT,"src/data/tools.ts"),"utf8");
const valid = new Set([...source.matchAll(/"slug":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"/g)].map((m)=>`/tools/${m[2]}/${m[1]}/`));
const errors=[];
for(const name of fs.readdirSync(BLOG_DIR).filter((n)=>/\.(md|mdx)$/i.test(n))){const content=fs.readFileSync(path.join(BLOG_DIR,name),"utf8");const links=[...content.matchAll(/\]\((\/tools\/[^)]+\/)\)/g)].map((m)=>m[1]);if(!links.length)errors.push(`${name}: no internal tool link`);for(const link of links)if(!valid.has(link))errors.push(`${name}: invalid tool link ${link}`)}
if(errors.length){console.error(errors.map((e)=>`- ${e}`).join("\n"));process.exitCode=1}else console.log("All blog links passed.");
