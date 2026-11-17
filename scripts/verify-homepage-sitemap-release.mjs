import fs from "node:fs";
import path from "node:path";
import { readToolRegistry } from "./lib/tool-registry.mjs";

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolRelease.json"),"utf8"));
const queue=JSON.parse(fs.readFileSync(path.join(root,"src/data/simpleToolQueue.json"),"utf8"));
const registry=readToolRegistry(root);
const expected=123+manifest.published.length;
if(registry.tools.length!==expected)throw Error("Registry mismatch: expected "+expected+" public tools, got "+registry.tools.length);
const home=fs.readFileSync(path.join(root,"dist/index.html"),"utf8");
const match=home.match(/data-public-tool-count=["'](\d+)["']/);
if(!match)throw Error("Homepage is missing its public tool counter marker");
if(Number(match[1])!==expected)throw Error("Homepage shows "+match[1]+" rather than "+expected+" public tools");
if(!home.includes("seconds with "+expected+"+ focused tools"))throw Error("Hero copy does not reflect public tool count");
const sitemapDir=path.join(root,"dist");
const sitemaps=fs.readdirSync(sitemapDir).filter(x=>/^sitemap.*\.xml$/i.test(x));
if(!sitemaps.includes("sitemap-index.xml"))throw Error("Astro sitemap index is missing");
const urls=sitemaps.flatMap(file=>{
 const xml=fs.readFileSync(path.join(sitemapDir,file),"utf8");
 return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll("&amp;","&"));
});
const toolPaths=urls.map(x=>{
 try {const p=new URL(x).pathname;return /^\/tools\/[^/]+\/[^/]+\/$/.test(p)?p:null;}catch{return null;}
}).filter(Boolean);
const publicPaths=new Set(registry.tools.map(t=>t.path+"/"));
if(toolPaths.length!==publicPaths.size||new Set(toolPaths).size!==toolPaths.length){
 throw Error("Sitemap public tool count is "+toolPaths.length+" but should be "+publicPaths.size);
}
for(const p of publicPaths)if(!toolPaths.includes(p))throw Error("Missing sitemap public tool page: "+p);
for(const p of toolPaths)if(!publicPaths.has(p))throw Error("Unreleased or unknown sitemap page: "+p);
const unpublished=queue.filter(t=>!manifest.published.includes(t.slug));
if(unpublished.some(t=>publicPaths.has("/tools/"+t.category+"/"+t.slug+"/")))throw Error("Unpublished tool leaked into public sitemap");
console.log("Homepage count and sitemap verified:",expected,"public tools; queue waiting:",unpublished.length);
