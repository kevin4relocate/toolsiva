# Phase 8 — Toolsiva Reviewed Blog Publishing Queue

Created November 15, 2026. This PR adds the **first 10 complete English blog guides** in the planned 30-guide series. It does not automatically approve or publish them.

## Contents

- Ten full articles (600–800 words each) focused on verified Toolsiva tool interfaces and worked examples: age, tips, ratios, proportions, BMI, running pace, profit margin, markup, word counting and list-to-text.
- One original 1200×630 SVG educational illustration per new article, plus an illustration for the previously published Markdown guide. SVGs are stored as text under `public/blog/` so assets can be versioned alongside the Markdown.
- Every queued article has an accurate `heroImageAlt`, `heroImageCaption`, explicit intrinsic dimensions, related-tool links and SEO metadata.
- The blog post template renders a captioned `<figure>`, structured `BlogPosting.image` with image size/caption, and social metadata with article-specific image/alt. The list view lazy-loads thumbnails; the article hero loads eagerly to avoid delaying its prominent visual.
- Published posts without image metadata fail `npm run blog:validate`.
- An approved daily scheduler selects at most **one due draft per calendar day**, checked in Asia/Bangkok (UTC+7).

## First ten scheduled dates

| Date (Asia/Bangkok) | Guide |
| --- | --- |
| 2026-11-16 | How to Calculate Age from a Date of Birth |
| 2026-11-17 | How to Calculate a Restaurant Tip and Split the Bill |
| 2026-11-18 | How to Simplify Ratios Step by Step |
| 2026-11-19 | How to Solve Proportions with Worked Examples |
| 2026-11-20 | How to Calculate BMI Using Kilograms and Centimeters |
| 2026-11-21 | How to Calculate Running Pace in Minutes per Kilometer |
| 2026-11-22 | Profit Margin vs. Markup: How to Calculate Both |
| 2026-11-23 | How to Calculate Markup and Set a Selling Price |
| 2026-11-24 | How to Count Words and Characters Online |
| 2026-11-25 | How to Convert a List into Comma-Separated Text |

**Critical:** The ten drafts are intentionally `draft: true` and `reviewApproved: false`. They are *not* immediately public just because their scheduled date has passed. Review the actual copy, math examples, source claims, linked tools, accuracy of image alt/caption and rights before approving. Do not assert "human reviewed" until a human has done the review.

## How to approve

1. Review each `src/content/blog/*.md` draft and its associated `public/blog/*.svg`. Verify the examples against the current tool.
2. In a normal GitHub PR, change **only reviewed articles** to `reviewApproved: true`. Keep `draft: true` so the scheduler can publish them on their date.
3. Merge the review PR after CI passes. The separate `publish-reviewed-blog.yml` workflow runs every day at **02:00 UTC (09:00 Vietnam/Thailand)**, or by manual `workflow_dispatch`, and publishes no more than one eligible article per local day.
4. If a day is missed, the next successful run publishes the oldest due approved article, one at a time (backlog/catch-up). If no approved draft is due, it does not modify GitHub.
5. The scheduler changes `draft` to false and sets `publishedDate` and `updatedDate` to the actual local publication date, runs the blog, Astro, SEO, canonical, security/privacy and AdSense build checks, and **only then** commits to `main`. GitHub's scheduled jobs may start later than the cron minute.
6. After a first scheduled post, confirm Cloudflare automatically deployed the scheduler commit and that the new blog URL resolves with a trailing slash and updated sitemap.

**Repository prerequisite:** `GITHUB_TOKEN` needs permission to push to `main`. If branch protection prohibits bot pushes, the final push will fail without publishing; use an approved merge workflow instead. The automated job does not bypass repository rules.

## Important safety rules

- Keep the old `daily-blog.yml` AI draft workflow separate. It continues to create **editorial review PRs**, not public posts.
- Do not use `reviewApproved: true` as a substitute for actual editorial review. Review is a human operation, not an AI-generated label.
- Keep all article links on canonical `/tools/.../` URLs; no SearchAction and no artificial ad placements.
- Current Age Calculator reports completed *years*, not years/months/days; content is written accordingly.
- BMI is a general adult screening index, not medical advice. Verify health references and jurisdiction-specific age rules where relevant.
- SVG covers are first-party educational infographics. Some social preview platforms may have weaker SVG support than PNG/JPEG. If social preview compatibility is important, generate raster versions and point social image metadata at those, while preserving descriptive alt/caption.
- Ten draft articles alone do not mean Google will index them or approve AdSense. Content quality, indexing and AdSense review are separate evaluations.

## Local and CI verification

```bash
npm ci
npm run blog:validate
npm run test:phase8
npm run check
npm run build
npm run tools:verify
npm run seo:audit
npm run seo:canonical
npm run adsense:audit
```

To test the queue without changing source, use the tests. **Do not run** `npm run blog:publish-queue` after marking posts approved unless you intend to modify the oldest due article; the script is designed to mutate Markdown and be followed by CI.

Next content batch: drafts 11–20, followed by 21–30, using the same image and editorial safeguards.
