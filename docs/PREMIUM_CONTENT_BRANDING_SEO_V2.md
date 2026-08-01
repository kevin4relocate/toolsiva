# Toolsiva Premium Content, Branding and SEO v2

## Content improvements

- Wider About hero so the heading and opening paragraph use available space.
- Fixed missing whitespace before email links.
- Expanded Privacy Policy, Terms of Use, Disclaimer and Accessibility content.
- Added category-aware educational content to every tool page.
- Made Related Tools a visually distinct continuation panel.

## SEO approach

The added tool content is designed to explain purpose, use cases, practical
tips and privacy behavior. It is not generated to hit an arbitrary word count.
Google recommends helpful, complete, people-first content and explicitly says
there is no preferred minimum word count.

Existing URLs such as `/tools/calculator/age-calculator` are already descriptive,
lowercase and category-based, so they are retained.

## Brand generation

Edit:

`brand/brand.config.mjs`

Then run:

`npm run brand:generate`

or:

`node scripts/generate-brand-assets.mjs`

Generated assets are written to:

`brand/generated/`

Output includes:

- app/site icon
- horizontal logo
- 1200×630 social banner
- 1080×1080 square graphic
- 2560×1440 YouTube banner
- 1584×396 LinkedIn banner

On macOS, the generator also uses `sips` to create PNG versions.
