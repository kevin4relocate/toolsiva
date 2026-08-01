import fs from "node:fs";

const pagePath = "src/pages/tools/[category]/[slug].astro";
const textPath = "src/components/tools/TextToolWorkspace.astro";
const developerPath = "src/components/tools/DeveloperToolWorkspace.astro";
const securityPath = "src/components/tools/SecurityToolWorkspace.astro";

const replaceOnce = (
  source,
  before,
  after,
  label,
) => {
  if (source.includes(after)) {
    console.log(`SKIP: ${label} already applied.`);
    return source;
  }

  if (!source.includes(before)) {
    throw new Error(`Could not locate source for: ${label}`);
  }

  console.log(`UPDATED: ${label}`);
  return source.replace(before, after);
};

let page = fs.readFileSync(pagePath, "utf8");
let text = fs.readFileSync(textPath, "utf8");
let developer = fs.readFileSync(developerPath, "utf8");
let security = fs.readFileSync(securityPath, "utf8");

page = replaceOnce(
  page,
  '<article class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">',
  '<article class="mx-auto w-full max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">',
  "tool page width and vertical spacing",
);

page = replaceOnce(
  page,
  '<nav class="mb-7 text-sm text-zinc-500" aria-label="Breadcrumb">',
  '<nav class="mb-4 text-sm text-zinc-500" aria-label="Breadcrumb">',
  "breadcrumb spacing",
);

page = replaceOnce(
  page,
  '<header class="mb-9">',
  '<header class="mb-5">',
  "tool header spacing",
);

page = replaceOnce(
  page,
  '<h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">{tool.name}</h1>',
  '<h1 class="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">{tool.name}</h1>',
  "tool title size",
);

page = replaceOnce(
  page,
  '<p class="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">{tool.shortDescription}</p>',
  '<p class="mt-3 max-w-4xl text-base leading-7 text-zinc-400 sm:text-lg">{tool.shortDescription}</p>',
  "tool description spacing",
);

page = replaceOnce(
  page,
  '<p class="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-300">',
  '<p class="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">',
  "tool eyebrow spacing",
);

// Text workspace
text = text.replaceAll(
  "min-h-80",
  "min-h-[clamp(18rem,48vh,34rem)]",
);
text = text.replaceAll(
  "min-h-72",
  "min-h-[clamp(17rem,46vh,32rem)]",
);
text = text.replaceAll(
  "min-h-64",
  "min-h-[clamp(16rem,42vh,30rem)]",
);

text = replaceOnce(
  text,
  'class="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/20"',
  'class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20"',
  "text workspace radius",
);

text = replaceOnce(
  text,
  '<div class="p-4 sm:p-6">',
  '<div class="p-4 sm:p-5">',
  "text workspace padding",
);

text = text.replaceAll(
  "mb-4 flex flex-wrap items-center justify-between gap-3",
  "mb-3 flex flex-wrap items-center justify-between gap-3",
);
text = text.replaceAll(
  "mt-5 grid grid-cols-2 gap-3",
  "mt-4 grid grid-cols-2 gap-3",
);
text = text.replaceAll(
  "mt-5 overflow-hidden",
  "mt-4 overflow-hidden",
);

// Developer workspace
developer = developer.replaceAll(
  "min-h-80",
  "min-h-[clamp(18rem,50vh,35rem)]",
);

developer = replaceOnce(
  developer,
  'class="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/20"',
  'class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20"',
  "developer workspace radius",
);

developer = replaceOnce(
  developer,
  '<div class="p-4 sm:p-6">',
  '<div class="p-4 sm:p-5">',
  "developer workspace padding",
);

developer = developer.replaceAll(
  "mb-4 flex flex-wrap items-center justify-between gap-3",
  "mb-3 flex flex-wrap items-center justify-between gap-3",
);

// Security workspace
security = security.replaceAll(
  "min-h-48",
  "min-h-[clamp(14rem,38vh,26rem)]",
);
security = security.replaceAll(
  "min-h-40",
  "min-h-[clamp(13rem,36vh,24rem)]",
);
security = security.replaceAll(
  "min-h-28",
  "min-h-[clamp(10rem,28vh,18rem)]",
);

security = replaceOnce(
  security,
  'class="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/20"',
  'class="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20"',
  "security workspace radius",
);

security = replaceOnce(
  security,
  '<div class="p-4 sm:p-6">',
  '<div class="p-4 sm:p-5">',
  "security workspace padding",
);

security = security.replaceAll(
  "mb-4 flex flex-wrap items-center justify-between gap-3",
  "mb-3 flex flex-wrap items-center justify-between gap-3",
);

fs.writeFileSync(pagePath, page);
fs.writeFileSync(textPath, text);
fs.writeFileSync(developerPath, developer);
fs.writeFileSync(securityPath, security);

console.log("Viewport-first tool layout applied.");
