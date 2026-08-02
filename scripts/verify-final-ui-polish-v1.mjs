import fs from "node:fs";
const header = fs.readFileSync("src/components/layout/Header.astro", "utf8");
const route = fs.readFileSync("src/pages/tools/[category]/[slug].astro", "utf8");
const workspace = fs.readFileSync("src/components/tools/NewTextToolsWorkspace.astro", "utf8");
const checks = [
  ["Mobile menu max-height", header.includes("max-h-[calc(100vh-5rem)]")],
  ["Mobile menu vertical scroll", header.includes("overflow-y-auto") && header.includes("overscroll-contain")],
  ["AdSense shell 1608px", route.includes("min-[1700px]:max-w-[1608px]")],
  ["AdSense gaps 24px", route.includes("min-[1700px]:gap-6")],
  ["Center remains 1240px", route.includes("grid-cols-[160px_minmax(0,1240px)_160px]")],
  ["Copy button focus-ring", workspace.includes('data-copy class="focus-ring')],
  ["Dynamic controls focus-ring", (workspace.match(/focus-ring ml-2/g) ?? []).length >= 5],
  ["Checkbox focus-ring", workspace.includes("focus-ring mr-1.5 size-4 accent-violet-600")],
];
let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? "OK" : "FAILED"}: ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
console.log("Final UI polish verification passed.");
