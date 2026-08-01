# Tool UX Architecture v2 — Final TypeScript Fix

Fixes the final four Astro TypeScript errors:

- Narrows the current dynamic-programming matrix row before assigning a cell.
- Extends the visual diff display type to include `changed`.
- Makes the patch idempotent, so running it again does not fail.
- Preserves the existing LCS algorithm and UX v2 behavior.
