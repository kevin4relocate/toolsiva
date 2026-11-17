# Toolsiva — Catalog & Scheduled-Release Production Audit

**Audit date:** 2026-11-17 · **Scope:** GitHub repository `kevin4relocate/toolsiva`, base catalog, queued catalogs, browser engines, CI, SEO routing, and scheduled publication.

## Catalog findings

| Metric | Before audit | After audit |
| --- | ---: | ---: |
| Existing public tools | 123 | 123 |
| Queued browser tools | 973 | 967 |
| Total planned unique tools | 1,096 | 1,090 |
| Previously retired overlaps | 18 | 24 |
| Exact active slug duplicates | 0 | 0 |
| Exact active queued-name duplicates | 0 | 0 |
| Published from scheduled queue, before first release | 0 | 0 |

Six verified redundant queued tools were retired **before publication**:

| Removed | Retained canonical implementation | Functional overlap |
| --- | --- | --- |
| `rectangle-diagonal-calculator` | `pythagorean-theorem-calculator` | The same right-triangle hypotenuse formula |
| `distance-between-points-3d` | `euclidean-vector-distance-calculator` | Existing generalized Euclidean vector distance supports 3D coordinates |
| `degrees-to-radians-calculator` | `angle-converter` | Existing angle converter handles degree-to-radian conversion |
| `radians-to-degrees-calculator` | `angle-converter` | Existing angle converter handles radian-to-degree conversion |
| `revenue-growth-from-two-periods` | `percentage-change-calculator` | Identical growth percentage for nonnegative original revenue |
| `vector3-angle-between` | `vector-angle-calculator` | General tool covers identical 3D angle calculation, and also accepts 2–100D vectors |

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

The pull-request CI runs all prior-wave tests, the Wave 10/11 regressions, uniqueness checks, TypeScript/Astro checks, site build, routing and SEO audits, and full weekly-release simulation. The final workflow audits build output for all **1,090** potential tool pages without publishing them prematurely.

**Limitations:** Node regression tests exercise supplied examples, strict validations and major edge cases, but do not guarantee every browser interaction on every device; some DOM-dependent tools are excluded from Node smoke calls. This audit does not claim exhaustive equivalence testing of every possible input.


## Semantic overlap follow-up — 17 November 2026

A name, slug, or URL comparison cannot prove functional uniqueness. The follow-up compared all scheduled names against base and queued tools, examined 50 high-overlap title pairs, compared numerical formulas in the Wave 10/11 implementation, and inspected the original handlers of the strongest candidates. The results included **one additional definite redundant tool** (`vector3-angle-between`), which was retired before the first scheduled release.

Some similar or mathematically related tools were retained for substantive reasons:

| Tools compared | Why both remain |
| --- | --- |
| `csv-column-extractor` vs `delimited-text-column-extractor` | The CSV version has quote-aware CSV parsing and header-name selection, while the latter accepts arbitrary delimiters using literal splitting |
| `timezone-offset-calculator` vs `timezone-offset-at-date-calculator` | The former converts timestamps between supplied fixed UTC offsets; the latter queries an IANA-zone offset at a particular UTC instant (including DST) |
| `business-days-calculator` vs `add-business-days-calculator` | Counts weekdays between dates vs adds a number of weekdays to a date |
| `contribution-margin-calculator` vs `contribution-margin-ratio-calculator` | Amount per unit vs ratio to sales price |
| `moles-from-mass-molar-mass` vs `mass-from-moles-molar-mass` | Inverse inputs and outputs, useful as separate conversion directions |
| `kinetic-energy-calculator` vs `rotational-kinetic-energy` | Different physical quantities (mass and linear speed vs moment of inertia and angular speed), despite the same algebraic shape |
| `capacitor-stored-energy` vs `inductor-stored-energy` | Different physical components with capacitance/voltage vs inductance/current; the algebra looks alike |
| `polygon-shoelace-area-calculator` vs `regular-polygon-area-calculator` | Arbitrary vertex-coordinate polygon vs regular polygon inferred from side count and side length |

These comparisons are not a mathematical proof that no other functional overlap exists. Exact formula matches are candidate signals: percentages, ratios, and physical laws often share algebra while operating on different concepts. The regression audit now explicitly prevents reintroduction of the confirmed redundant 3D vector-angle page.

## Deployment interpretation

The repository contains `npm run deploy` (`wrangler deploy`) and a GitHub-triggered weekly manifest publication workflow, but **no verified direct Cloudflare deployment action or Cloudflare environment access from this audit**. Merging to `main` stages all new code and manifests; whether Cloudflare automatically deploys on each `main` push depends on the separately configured Cloudflare Git integration. Actual production deployment and its success must be verified in Cloudflare's build/deploy history.

**Do not manually run the tool release command or add every queued slug to the published manifest.** Publish only through the scheduled workflow, beginning 2026-11-23. A successful PR CI is a pre-merge quality gate, not proof of a Cloudflare production deployment.
