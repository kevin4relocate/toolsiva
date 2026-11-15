# Toolsiva — SEO audit and content quality runbook

Updated: 2026-11-15. Scope: the built Astro website in this repository.

## Sources of truth

- Catalog: src/data/tools.ts — currently 123 tools across 6 categories.
- Priority hand-written examples: src/data/toolSeoContent.ts — 20 priority tools.
- Specialized task-based notes: src/data/toolUsageNotes.json — 103 additional tools.
- Tool FAQ content: src/data/toolFaqs.ts.
- URL convention: astro.config.mjs has trailingSlash set to never. Canonical URLs should not have a trailing slash, except the home page.
- Blog-to-tool links: src/content/blog, verified by npm run blog:validate.

The generated guidance is a useful baseline but not proof that every example was reproduced end to end or tested in third-party QR scanning applications.

## How to reproduce the SEO audit

1. npm ci
2. npm run test:phase1 && npm run test:validators && npm run test:phase2 && npm run test:phase3 && npm run test:phase4 && npm run test:phase5
3. npm run blog:validate
4. npm run check && npm run build
5. npm run tools:verify && npm run analytics:verify && npm run seo:audit

The SEO script writes reports/production-seo-audit.json and reports/production-seo-issues.csv. GitHub Actions uploads both as a workflow artifact. npm run seo:audit:strict also fails on warnings; normal CI fails only on confirmed errors because recommended title/description length is not a ranking rule.

## What the auditor checks

- Dynamic counts derived from the current catalog and build rather than old fixed 118/133 values.
- Canonical URL origin, normalized path, duplicate canonicals and tracking parameters.
- Titles, descriptions, H1 count, lang, Open Graph and Twitter card.
- Structured data JSON validity, WebApplication and BreadcrumbList on tool pages.
- Broken internal links, orphan tool pages, sitemap coverage and duplicate sitemap entries.
- robots.txt presence, absolute sitemap location and accidental sitewide disallow.
- Per-category tool counts and content guide coverage.

These checks run on the build, not the live Cloudflare deployment. A generated sitemap cannot prove that Google indexed its pages.

## Editorial quality

1. Test real input and output in the actual tool before describing examples as verified.
2. Explain the task, input restrictions, a specific example, and a meaningful limitation. Avoid repeated filler paragraphs.
3. Review calculations and security promises closely; clarify the assumptions rather than making absolute claims.
4. Link to relevant companion tools and existing guides only, not unrelated pages with the same keyword.
5. For AI-assisted blog drafts, require factual review and verify the linked tool's output. Do not mass-publish near-identical articles.
6. Never change the published/updated date solely to create a false impression of freshness.
7. Prefer real examples and original practical guidance over a minimum word count.

References:
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/blog/2023/08/howto-faq-changes

Google generally limits FAQ rich results to authoritative government and health domains; adding FAQPage schema does not guarantee extra search-result display.

## Manual checks after deployment

- Check https://toolsiva.com/robots.txt and https://toolsiva.com/sitemap-index.xml on production.
- Inspect representative pages from all six categories, including response status, canonical, title, description, schema and links.
- Check both versions of several URLs with and without trailing slashes. Static hosting and Cloudflare redirects may differ from Astro development rules.
- Use Google Search Console indexing and URL inspection to confirm which canonical Google selected, which pages are indexed and whether errors exist.
- Compare 3-month clicks/impressions by landing page and query before selecting content to expand.
- Run a manual mobile/browser accessibility check. Build QA cannot replace real-user testing.
