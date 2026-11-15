# Toolsiva — Phase 7 AdSense Readiness Audit

Reviewed 2026-11-15 against current published Google AdSense policies. This is a **readiness checklist**, not a certification or approval prediction.

## The policy baseline

Google's stated eligibility requirements include publisher eligibility, ownership/control of the website, unique and interesting content, and compliance with the AdSense Program and Google Publisher Policies. Google assesses the real live site, not merely its GitHub repository or build result.

- Eligibility: https://support.google.com/adsense/answer/9724
- Preparing pages for review: https://support.google.com/adsense/answer/7299563
- Publisher policies: https://support.google.com/publisherpolicies/answer/10502938
- Ads on low-value or non-content screens: https://support.google.com/publisherpolicies/answer/11112688
- Certified CMP for AdSense ad delivery to EEA, UK and Switzerland: https://support.google.com/adsense/answer/13554116

There is no single source-derived minimum word count, traffic figure, exact number of blog posts or tool count that guarantees approval. Do not convert SEO heuristics into fake eligibility rules.

## Changes in Phase 7

1. The generated article workflow now creates \`draft: true\`, and the content schema defaults missing draft flags to true. No generated article is immediately published.
2. The workflow now creates an editorial review pull request instead of pushing generated content directly to \`main\`. A human editor must validate claims, examples, tool behavior, links, originality and compliance, then intentionally change the draft flag in the PR before merging.
3. The published Markdown Live Preview article has been substantially revised with reproducible examples and actual product limitations. Its original publication date remains unchanged; its meaningful update date is recorded.
4. Added an indexable Editorial Standards page and linked it in the site footer/About page to explain our workflow, corrections and advertising transparency.
5. \`AdSlot\` is fail-closed in preapproval mode. A stale or accidental environment toggle cannot render fake advertising placements.
6. The new audit distinguishes technical errors, quality warnings and **10 mandatory manual checks**. It never concludes that Google will approve the site.

## Run the audit

\`\`\`bash
npm ci
npm run test:phase7
npm run build
npm run adsense:audit
\`\`\`

The full PR CI also runs previous phases, blog validation, Astro check, routes, SEO, privacy and security checks.

Artifacts:
- \`reports/adsense-readiness.json\`: generated counts, technical gate, issues and manual checklist.
- \`reports/adsense-readiness-issues.csv\`: warning/blocker table.
- Reports are uploaded to the GitHub Actions run; they are not manually committed to \`main\`.

## Non-negotiable checks **before** submitting to AdSense

1. Verify the live \`https://toolsiva.com\` site resolves normally over HTTPS. Test from mobile and desktop, with and without URL trailing slashes. This must be checked on actual Cloudflare production responses.
2. Open About, Contact, Privacy, Terms, Disclaimer, Editorial Standards, category pages and a sample of all six tool categories. Confirm that each tool works without registration, has useful explanations and does not mislead users about what is processed.
3. Send a real email to \`contact@toolsiva.com\` and verify receipt; the fact that the address appears in code does not prove it exists.
4. In Google Search Console, verify ownership and inspect indexing, canonical selection, manual actions, security issues and whether public content is discoverable. Sitemap inclusion is not indexing.
5. Manually review tool-page originality and accuracy. All 123 tools now have task-specific guidance, but standardized template sections and FAQ patterns still require editorial inspection for actual value.
6. Review the published blog library. A single detailed published guide is not prohibited by a fixed Google count; nevertheless, a broad site with only one original guide may warrant additional deeply reviewed guides for audience needs. Do not flood the site with shallow AI articles to meet an invented quota.
7. Compare Cloudflare Edge Traffic Analytics with browser Web Analytics and real Search Console clicks. Never count all bot or automated requests as human traffic or estimate earnings from them.
8. Use the real publisher account and real site verification method provided by Google. Publisher must meet account terms and identity requirements. The build intentionally contains no fabricated \`ca-pub-...\` ID.
9. **Do not activate ad serving without updating the privacy/advertising disclosures and consent implementation.** The existing GA4 analytics consent banner is not a certified ads CMP. For EEA, UK and Switzerland ads, review the Google-certified CMP and IAB TCF requirements and implement Google's applicable consent flow (including Privacy & Messaging or another certified CMP).
10. When Google issues a real publisher ID, add the exact authorized seller entry to \`/ads.txt\` if required for your setup, verify public availability, and use actual approved code under Google's instructions. Do not publish fake IDs or placeholder \`ads.txt\` records. Ensure real ads do not overlap buttons, navigation, inputs, error pages or other prohibited inventory.

## What CI does *not* validate

- Live Cloudflare status, security/redirect rules, real e-mail delivery, visitor bot quality, Search Console indexing or AdSense account review.
- Subjective content quality, copyright provenance and originality.
- CMP regulatory suitability (it is not configured for advertising yet), invalid traffic or actual ad layout.
- AdSense approval, revenue potential or future policy decisions.

**Readiness interpretation:** \`technicalGate: PASS\` means only the enumerated static checks passed. \`overallAdSenseDecision: NOT_DETERMINED\` and \`manualPending\` remain until a human verifies production and Google reviews the site.

## Next operational step

After GitHub deploys the merged commit to Cloudflare and the manual checklist is satisfied, sign in to Google AdSense and follow the actual website verification/application flow. For now there should be no AdSense ads or invented ads.txt record in this repo.
