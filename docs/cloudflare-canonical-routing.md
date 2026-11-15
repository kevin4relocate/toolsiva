# Toolsiva — Cloudflare canonical URL alignment

Updated: 2026-11-15.

## Decision

Keep slash-terminated HTML routes as the canonical version, because Cloudflare's current static asset routing serves Astro's directory/index.html builds under /path/ and historical Search Console performance reports list slash-terminated indexed URLs. The 110+ old non-slash redirect records are consistent with this behavior but do not themselves prove HTTP status codes for individual live requests.

The implementation sets:
- Astro: trailingSlash always, preserving directory build output.
- Wrangler Workers Static Assets: assets.html_handling force-trailing-slash, assets.not_found_handling 404-page.
- HTML: canonical link, OG URL, tool/category/blog schemas and internal links use /path/.
- Website schema: obsolete SearchAction for /tools?q={search_term_string} removed. The Google sitelinks search box was retired in November 2024.
- All tool links generated from getToolPath now use slash-terminated paths.
- The live tool search palette remains client-side; it is not advertised as a server-side query endpoint.

No broad permanent redirects have been added manually: Cloudflare's built-in force-trailing-slash behavior controls redirects from /path to /path/ without introducing conflicting redirect rules.

## Validation

Run npm ci, npm run check, npm run build, npm run test:canonical-routing, npm run tools:verify, npm run seo:audit, and npm run seo:canonical. GitHub Actions now runs canonical tests and an exact build verifier before merge.

The verifier checks every built HTML canonical tag and Open Graph URL, sitemap URLs, internal links pointing to HTML pages, JSON-LD URLs, absent SearchAction, static 404 handling and the Wrangler routing policy.

## Production check after automatic deployment

1. Open Cloudflare Workers & Pages > toolsiva > Deployments. Verify the new main commit is active for the custom domain.
2. Test redirects with these example curl commands:

   curl -sSI https://toolsiva.com/tools/text/word-counter
   curl -sSI https://toolsiva.com/tools/text/word-counter/
   curl -sSI https://toolsiva.com/blog
   curl -sSI https://toolsiva.com/blog/
   curl -sSI https://toolsiva.com/no-such-toolsiva-page/

3. Expect a redirect (Cloudflare documents 307 for noncanonical static asset URLs) from /tools/text/word-counter to /tools/text/word-counter/, and HTTP 200 on the slash-terminated destination. The random missing URL must return HTTP 404, not 200.
4. Open page source and inspect <link rel="canonical"> and og:url; both should reference the slash-terminated destination.
5. Verify https://toolsiva.com/sitemap-index.xml successfully loads a sitemap listing slash-terminated document routes. Retain the same sitemap URL in Search Console.
6. URL Inspection: compare the user-declared and Google-selected canonical. Continue monitoring 29 Discovered–currently not indexed URLs; indexed slash URLs may already exist. Search Console is delayed; do not expect the report to reset immediately.

Known limitation: CI proves the repository and generated static files match the configured policy; it cannot guarantee the live Cloudflare custom domain isn't overridden by a separate edge redirect/routing rule. Test the live URL after automatic deploy.

References:
- https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/
- https://developers.google.com/search/blog/2024/10/sitelinks-search-box
