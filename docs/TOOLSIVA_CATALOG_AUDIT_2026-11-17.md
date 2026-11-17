# Toolsiva — Catalog & Scheduled-Release Production Audit

**Audit date:** 2026-11-17 · **Scope:** GitHub repository `kevin4relocate/toolsiva`, base catalog, queued catalogs, browser engines, CI, SEO routing, and scheduled publication.

## Catalog findings

| Metric | Before audit | After audit |
| --- | ---: | ---: |
| Existing public tools | 123 | 123 |
| Queued browser tools | 973 | 968 |
| Total planned unique tools | 1,096 | 1,091 |
| Previously retired overlaps | 18 | 23 |
| Exact active slug duplicates | 0 | 0 |
| Exact active queued-name duplicates | 0 | 0 |
| Published from scheduled queue, before first release | 0 | 0 |

Five verified redundant queued tools were retired **before publication**:

| Removed | Retained canonical implementation | Functional overlap |
| --- | --- | --- |
| `rectangle-diagonal-calculator` | `pythagorean-theorem-calculator` | The same right-triangle hypotenuse formula |
| `distance-between-points-3d` | `euclidean-vector-distance-calculator` | Existing generalized Euclidean vector distance supports 3D coordinates |
| `degrees-to-radians-calculator` | `angle-converter` | Existing angle converter handles degree-to-radian conversion |
| `radians-to-degrees-calculator` | `angle-converter` | Existing angle converter handles radian-to-degree conversion |
| `revenue-growth-from-two-periods` | `percentage-change-calculator` | Identical growth percentage for nonnegative original revenue |

The old YAML-to-JSON engine fallback that always threw an error was also removed; the working Astro-dispatched YAML converter remains.

The catalog-wide audit is now executable with `npm run catalog:audit`. It checks route/slug/name uniqueness, schedule ordering, retired aliases, individual queued engine cases, input-ready state, and published manifest history. Historical overlap screening has been expanded, but no automated semantic similarity check can prove that every specialized calculator is conceptually unique.

## Publication safety

- **Start date:** Monday, 2026-11-23.
- **Cron:** `0 2 * * 1` (02:00 UTC = 09:00 in Vietnam).
- **Capacity:** at most 10 queued tools per eligible Monday.
- **Manifest:** `src/data/simpleToolRelease.json` initially has `published: []` and `history: []`.
- **Content gating:** the Astro site builds only original tools and entries explicitly present in `simpleToolRelease.published`; queued-but-unreleased tools have no public pages.
- **Publication check:** workflow runs `npm run catalog:audit` before selecting a batch and after building the new pages. It commits only the manifest on passing validation.
- **Concurrent writers:** the daily curated blog and weekly tool publication share GitHub Actions concurrency group `toolsiva-main-publication`, so scheduled commits to main do not run simultaneously.

## Quality gates

The pull-request CI runs all prior-wave tests, the Wave 10/11 regressions, uniqueness checks, TypeScript/Astro checks, site build, routing and SEO audits, and full weekly-release simulation. The final workflow audits build output for all **1,091** potential tool pages without publishing them prematurely.

**Limitations:** Node regression tests exercise supplied examples, strict validations and major edge cases, but do not guarantee every browser interaction on every device; some DOM-dependent tools are excluded from Node smoke calls. This audit does not claim exhaustive equivalence testing of every possible input.

## Deployment interpretation

The repository contains `npm run deploy` (`wrangler deploy`) and a GitHub-triggered weekly manifest publication workflow, but **no verified direct Cloudflare deployment action or Cloudflare environment access from this audit**. Merging to `main` stages all new code and manifests; whether Cloudflare automatically deploys on each `main` push depends on the separately configured Cloudflare Git integration. Actual production deployment and its success must be verified in Cloudflare's build/deploy history.

**Do not manually run the tool release command or add every queued slug to the published manifest.** Publish only through the scheduled workflow, beginning 2026-11-23. A successful PR CI is a pre-merge quality gate, not proof of a Cloudflare production deployment.
