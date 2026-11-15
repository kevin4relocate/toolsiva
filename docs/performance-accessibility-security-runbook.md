# Toolsiva Phase 6 — Performance, Accessibility & Security

Updated November 15, 2026. Changes are for the Astro static build deployed through Cloudflare Workers Static Assets.

## Performance changes
- Reduce repeated navigation markup: only eight featured/alphabetical tools per category appear in each desktop and mobile dropdown; all 123 tools stay accessible through category pages and the search palette.
- Cache fingerprinted Astro assets under `/_astro/*` for one year with `immutable`. HTML and stable filenames such as `analyticsConsent.js` retain Cloudflare's normal revalidation behavior.
- Avoid making performance claims based on build tests alone. Compare the same URL, device type, region and date window in Cloudflare Web Analytics and field data after deployment. The earlier 30-day Cloudflare sample showed an LCP P75 around 1.52s, but represented a limited browser sample and cannot prove this release is faster.

## Accessibility changes
- Add visible keyboard focus and respect reduced-motion preferences.
- Label the command palette and return keyboard focus to its opener on close; contain Tab navigation while modal is open.
- Add accessible field labels and polite result announcements for primary calculator, converter and expanded text/numeric workspaces.
- These automated checks are not an accessibility certification. Manual keyboard, screen reader and mobile testing remains necessary, particularly for custom QR canvases and complex editor workspaces.

## Security hardening
- Workers static asset `public/_headers` sets X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy and a limited Content-Security-Policy (base-uri, object-src, frame-ancestors, form-action).
- Do **not** add strict `script-src` without separately auditing Astro inline scripts, consent-gated GA4/GTM, Cloudflare Web Analytics and dynamic preview rendering; breaking analytics or tool scripts is worse than an untested policy.
- JSON data inside HTML script elements is serialized with `safeJsonForHtml` to prevent accidental `</script>` breakout.
- Security headers only apply to responses served by Cloudflare's static asset handler. Custom Worker-generated responses require their own headers.
- Security headers are not a substitute for dependency updates, penetration testing or Cloudflare WAF configuration.

## Verification
Run:
```bash
npm ci
npm run test:phase6
npm run check
npm run build
npm run hardening:verify
npm run tools:verify
npm run analytics:verify
npm run seo:audit
```
PR CI includes all Phase 1–6 tests plus these gates. After deployment, inspect live response headers, test the command palette by keyboard, and compare Core Web Vitals over a meaningful number of real browser samples.

Cloudflare Workers Static Assets header docs: https://developers.cloudflare.com/workers/static-assets/headers/
