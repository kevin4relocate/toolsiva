import fs from "node:fs";
const pagePath="src/pages/tools/[category]/[slug].astro";
let page=fs.readFileSync(pagePath,"utf8");
if(!page.includes('getToolInstructions')){
  page=page.replace('import { getToolPath } from "@/types/tool";','import { getToolPath } from "@/types/tool";\nimport { getToolInstructions } from "@/data/toolInstructions";');
  page=page.replace('const relatedTools = getRelatedTools(tool);','const relatedTools = getRelatedTools(tool);\nconst instructions = getToolInstructions(tool);');
  page=page.replace(/<ol class="mt-3 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">[\s\S]*?<\/ol>/,`<ol class="mt-3 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">\n        {instructions.map((item, index) => (\n          <li class="rounded-xl border border-white/10 p-4">\n            <strong class="block text-white">{index + 1}. {item.title}</strong>\n            <span class="mt-1.5 block text-xs leading-5 text-zinc-400">{item.description}</span>\n          </li>\n        ))}\n      </ol>`);
  fs.writeFileSync(pagePath,page);
}
console.log("Smart layout patterns installed.");
