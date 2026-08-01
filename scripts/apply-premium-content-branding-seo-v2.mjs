import fs from "node:fs";

const pagePath = "src/pages/tools/[category]/[slug].astro";
let page = fs.readFileSync(pagePath, "utf8");

if (!page.includes('ToolSeoContent from "@/components/tools/ToolSeoContent.astro"')) {
  page = page.replace(
    'import { getToolInstructions } from "@/data/toolInstructions";',
    'import { getToolInstructions } from "@/data/toolInstructions";\nimport ToolSeoContent from "@/components/tools/ToolSeoContent.astro";',
  );
}

if (!page.includes("<ToolSeoContent tool={tool} />")) {
  const relatedMarker = "    {\n      relatedTools.length > 0 && (";
  if (!page.includes(relatedMarker)) {
    throw new Error("Could not locate the related tools section.");
  }
  page = page.replace(relatedMarker, '    <ToolSeoContent tool={tool} />\n\n' + relatedMarker);
}

page = page.replaceAll(
  '<section class="mt-16">\n          <h2 class="text-xl font-bold text-white">Related tools</h2>\n          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">',
  '<section class="mt-12 rounded-3xl border border-brand-400/20 bg-brand-500/[0.05] p-5 sm:p-7">\n          <div class="flex flex-wrap items-end justify-between gap-3">\n            <div>\n              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">Continue working</p>\n              <h2 class="mt-2 text-xl font-bold text-white">Related tools</h2>\n            </div>\n            <a class="text-sm font-semibold text-brand-300 hover:text-brand-200" href={`/tools/${tool.category}`}>View all {category?.name} →</a>\n          </div>\n          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">',
);

page = page.replaceAll(
  'class="rounded-xl border border-white/10 p-4 transition hover:border-brand-400/40"',
  'class="group rounded-2xl border border-white/10 bg-zinc-950/50 p-4 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-zinc-950/80"',
);

page = page.replaceAll(
  '<strong>{related.name}</strong>',
  '<strong class="text-white group-hover:text-brand-200">{related.name}</strong>',
);

fs.writeFileSync(pagePath, page);

const cssPath = "src/styles/global.css";
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes("/* Premium content readability v2 */")) {
  css += `

/* Premium content readability v2 */
.prose-premium section + section {
  padding-top: 0.25rem;
}

.prose-premium p + p {
  margin-top: 0.9rem;
}
`;
  fs.writeFileSync(cssPath, css);
}

console.log("Premium content, related tools and SEO v2 applied.");
