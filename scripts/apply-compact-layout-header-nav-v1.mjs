import fs from "node:fs";

const pagePath = "src/pages/tools/[category]/[slug].astro";
const textPath = "src/components/tools/TextToolWorkspace.astro";
const developerPath = "src/components/tools/DeveloperToolWorkspace.astro";
const securityPath = "src/components/tools/SecurityToolWorkspace.astro";
const headerPath = "src/components/layout/Header.astro";

const replaceAny = (source, patterns, replacement, label) => {
  if (source.includes(replacement)) {
    console.log(`SKIP: ${label} already applied.`);
    return source;
  }

  for (const pattern of patterns) {
    if (source.includes(pattern)) {
      console.log(`UPDATED: ${label}`);
      return source.replace(pattern, replacement);
    }
  }

  throw new Error(`Could not locate source for: ${label}`);
};

let page = fs.readFileSync(pagePath, "utf8");
let text = fs.readFileSync(textPath, "utf8");
let developer = fs.readFileSync(developerPath, "utf8");
let security = fs.readFileSync(securityPath, "utf8");

page = replaceAny(
  page,
  [
    '<article class="mx-auto w-full max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">',
    '<article class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">',
  ],
  '<article class="mx-auto w-full max-w-[84rem] px-4 py-5 sm:px-5 lg:px-6 lg:py-6">',
  'tool page outer width',
);

page = replaceAny(
  page,
  [
    '<nav class="mb-4 text-sm text-zinc-500" aria-label="Breadcrumb">',
    '<nav class="mb-7 text-sm text-zinc-500" aria-label="Breadcrumb">',
  ],
  '<nav class="mb-3 text-xs text-zinc-500 sm:text-sm" aria-label="Breadcrumb">',
  'breadcrumb spacing',
);

page = replaceAny(
  page,
  ['<header class="mb-5">', '<header class="mb-9">'],
  '<header class="mb-4">',
  'header spacing',
);

page = replaceAny(
  page,
  [
    '<p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">',
    '<p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-300">',
  ],
  '<p class="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">',
  'eyebrow size',
);

page = replaceAny(
  page,
  [
    '<h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">{tool.name}</h1>',
    '<h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">{tool.name}</h1>',
  ],
  '<h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[2.35rem]">{tool.name}</h1>',
  'tool title size',
);

page = replaceAny(
  page,
  [
    '<p class="mt-3 max-w-4xl text-base leading-7 text-zinc-400 sm:text-lg">{tool.shortDescription}</p>',
    '<p class="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">{tool.shortDescription}</p>',
  ],
  '<p class="mt-2.5 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">{tool.shortDescription}</p>',
  'tool description',
);

page = replaceAny(
  page,
  ['<section class="mt-16">'],
  '<section class="mt-10">',
  'section spacing',
);

page = replaceAny(
  page,
  ['<h2 class="text-2xl font-bold text-white">How to use this tool</h2>'],
  '<h2 class="text-xl font-bold text-white">How to use this tool</h2>',
  'how-to heading size',
);

page = replaceAny(
  page,
  ['<ol class="mt-5 grid gap-4 text-zinc-300 sm:grid-cols-3">'],
  '<ol class="mt-3 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">',
  'how-to list spacing',
);

page = page.replaceAll('rounded-2xl border border-white/10 p-5', 'rounded-xl border border-white/10 p-4');
page = page.replaceAll('mt-2 block text-sm text-zinc-400', 'mt-1.5 block text-xs leading-5 text-zinc-400');
page = page.replaceAll('<h2 class="text-2xl font-bold text-white">Frequently asked questions</h2>', '<h2 class="text-xl font-bold text-white">Frequently asked questions</h2>');
page = page.replaceAll('<div class="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 px-6">', '<div class="mt-3 divide-y divide-white/10 rounded-xl border border-white/10 px-4">');
page = page.replaceAll('<details class="group py-5">', '<details class="group py-4">');
page = page.replaceAll('<p class="mt-3 max-w-3xl leading-7 text-zinc-400">', '<p class="mt-2.5 max-w-3xl text-sm leading-6 text-zinc-400">');
page = page.replaceAll('<h2 class="text-2xl font-bold text-white">Related tools</h2>', '<h2 class="text-xl font-bold text-white">Related tools</h2>');
page = page.replaceAll('<div class="mt-5 grid gap-4 sm:grid-cols-2">', '<div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">');
page = page.replaceAll('class="rounded-2xl border border-white/10 p-5 hover:border-brand-400/40"', 'class="rounded-xl border border-white/10 p-4 hover:border-brand-400/40"');

const compactTextHeights = [
  ["min-h-[clamp(18rem,48vh,34rem)]", "min-h-[clamp(14rem,36vh,24rem)]"],
  ["min-h-[clamp(17rem,46vh,32rem)]", "min-h-[clamp(13rem,34vh,22rem)]"],
  ["min-h-[clamp(16rem,42vh,30rem)]", "min-h-[clamp(12rem,32vh,20rem)]"],
  ["min-h-80", "min-h-[clamp(14rem,36vh,24rem)]"],
  ["min-h-72", "min-h-[clamp(13rem,34vh,22rem)]"],
  ["min-h-64", "min-h-[clamp(12rem,32vh,20rem)]"],
];
for (const [before, after] of compactTextHeights) text = text.replaceAll(before, after);
text = text.replaceAll('p-4 sm:p-5', 'p-3 sm:p-4');
text = text.replaceAll('p-4 sm:p-6', 'p-3 sm:p-4');
text = text.replaceAll('mb-3 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');
text = text.replaceAll('mb-4 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');
text = text.replaceAll('mt-4 grid grid-cols-2 gap-3', 'mt-3 grid grid-cols-2 gap-2.5');
text = text.replaceAll('mt-5 grid grid-cols-2 gap-3', 'mt-3 grid grid-cols-2 gap-2.5');
text = text.replaceAll('mt-4 overflow-hidden', 'mt-3 overflow-hidden');
text = text.replaceAll('mt-5 overflow-hidden', 'mt-3 overflow-hidden');

const compactDevHeights = [
  ["min-h-[clamp(18rem,50vh,35rem)]", "min-h-[clamp(14rem,38vh,24rem)]"],
  ["min-h-80", "min-h-[clamp(14rem,38vh,24rem)]"],
];
for (const [before, after] of compactDevHeights) developer = developer.replaceAll(before, after);
developer = developer.replaceAll('p-4 sm:p-5', 'p-3 sm:p-4');
developer = developer.replaceAll('p-4 sm:p-6', 'p-3 sm:p-4');
developer = developer.replaceAll('mb-3 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');
developer = developer.replaceAll('mb-4 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');

const compactSecurityHeights = [
  ["min-h-[clamp(14rem,38vh,26rem)]", "min-h-[clamp(11rem,30vh,18rem)]"],
  ["min-h-[clamp(13rem,36vh,24rem)]", "min-h-[clamp(10rem,28vh,17rem)]"],
  ["min-h-[clamp(10rem,28vh,18rem)]", "min-h-[clamp(9rem,24vh,15rem)]"],
  ["min-h-48", "min-h-[clamp(11rem,30vh,18rem)]"],
  ["min-h-40", "min-h-[clamp(10rem,28vh,17rem)]"],
  ["min-h-28", "min-h-[clamp(9rem,24vh,15rem)]"],
];
for (const [before, after] of compactSecurityHeights) security = security.replaceAll(before, after);
security = security.replaceAll('p-4 sm:p-5', 'p-3 sm:p-4');
security = security.replaceAll('p-4 sm:p-6', 'p-3 sm:p-4');
security = security.replaceAll('mb-3 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');
security = security.replaceAll('mb-4 flex flex-wrap items-center justify-between gap-3', 'mb-2.5 flex flex-wrap items-center justify-between gap-2.5');

const headerContent = `---
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";
import { getToolPath } from "@/types/tool";

const visibleCategories = categories.slice(0, 6);
const categoryEntries = visibleCategories.map((category) => ({
  ...category,
  tools: tools
    .filter((tool) => tool.category === category.slug)
    .sort((a, b) => a.name.localeCompare(b.name)),
}));
---

<header class="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/88 backdrop-blur-xl">
  <div class="mx-auto flex h-14 max-w-[84rem] items-center justify-between px-4 sm:px-5 lg:px-6">
    <a href="/" class="focus-ring flex items-center gap-2 rounded-lg" aria-label="Toolsiva home">
      <span class="grid size-8 place-items-center rounded-xl bg-brand-600 font-black text-white">T</span>
      <span class="text-base font-bold tracking-tight text-white sm:text-lg">Toolsiva</span>
    </a>

    <nav aria-label="Primary navigation" class="hidden items-center gap-1 lg:flex">
      <a class="focus-ring rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white" href="/tools">
        All Tools
      </a>
      {categoryEntries.map((category) => (
        <details class="group relative">
          <summary class="focus-ring flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden">
            {category.name}
            <svg class="size-4 text-zinc-500 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd"></path>
            </svg>
          </summary>
          <div class="absolute left-0 top-full mt-2 hidden w-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl group-open:block">
            <p class="px-2 text-xs leading-5 text-zinc-500">{category.description}</p>
            <div class="mt-3 grid max-h-[22rem] gap-1 overflow-auto pr-1">
              {category.tools.map((tool) => (
                <a href={getToolPath(tool)} class="rounded-xl px-3 py-2 transition hover:bg-white/5">
                  <span class="block text-sm font-medium text-zinc-100">{tool.name}</span>
                  <span class="mt-0.5 block text-xs leading-5 text-zinc-500">{tool.shortDescription}</span>
                </a>
              ))}
            </div>
            <a href={\`/tools/\${category.slug}\`} class="mt-3 block rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-brand-400/40 hover:bg-white/5 hover:text-white">
              View all {category.name}
            </a>
          </div>
        </details>
      ))}
    </nav>

    <div class="flex items-center gap-2">
      <a
        href="/tools"
        class="focus-ring hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium transition hover:bg-white/10 sm:inline-flex"
      >
        Browse tools
      </a>

      <details class="relative lg:hidden">
        <summary class="focus-ring flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
          Menu
        </summary>
        <div class="absolute right-0 top-full mt-2 w-[20rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <a href="/tools" class="mb-2 block rounded-xl px-3 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/5">All Tools</a>
          <div class="grid gap-2">
            {categoryEntries.map((category) => (
              <details class="rounded-xl border border-white/10 bg-white/[0.02] p-1">
                <summary class="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                  {category.name}
                </summary>
                <div class="mt-1 grid gap-1 px-2 pb-2">
                  {category.tools.map((tool) => (
                    <a href={getToolPath(tool)} class="rounded-lg px-2 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
                      {tool.name}
                    </a>
                  ))}
                  <a href={\`/tools/\${category.slug}\`} class="rounded-lg px-2 py-2 text-sm font-medium text-brand-300 transition hover:bg-white/5 hover:text-white">
                    View all {category.name}
                  </a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </details>
    </div>
  </div>
</header>
`;

fs.writeFileSync(pagePath, page);
fs.writeFileSync(textPath, text);
fs.writeFileSync(developerPath, developer);
fs.writeFileSync(securityPath, security);
fs.writeFileSync(headerPath, headerContent);

console.log('Compact layout and header dropdown navigation applied.');
