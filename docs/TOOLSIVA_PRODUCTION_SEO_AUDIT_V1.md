# Toolsiva Production SEO Audit v1

## What it checks

After `npm run build`, the audit checks all generated HTML pages in `dist/`:

- expected total page count: 123;
- expected tool page count: 108;
- title presence and length;
- meta description presence and length;
- duplicate titles and descriptions;
- canonical presence, host and uniqueness;
- exactly one H1 per page;
- `html lang`;
- Open Graph title, description and image;
- Twitter card;
- unexpected `noindex`;
- approximate visible word count on tool pages;
- broken internal links;
- robots.txt presence and sitemap directive;
- sitemap presence;
- every indexable page included in the sitemap.

## Commands

```bash
npm run seo:audit
npm run seo:audit:strict
npm run launch:check
```

Normal mode fails on errors but allows warnings.

Strict mode fails on errors and warnings.

## Reports

The script writes:

- `reports/production-seo-audit.json`
- `reports/production-seo-issues.csv`

## Environment overrides

```bash
EXPECTED_PAGES=123 EXPECTED_TOOL_PAGES=108 SITE_URL=https://toolsiva.com npm run seo:audit
```
