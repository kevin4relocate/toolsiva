# Tool Catalog Deduplication v1

Removes duplicate tool definitions from `src/data/tools.ts` by slug.

## Safety behavior

- Keeps the first occurrence of each tool slug.
- Removes later duplicate entries.
- Removes accidental empty array entries.
- Preserves all unique existing tools.
- Verifies that the new category totals remain:
  - 10 QR tools
  - 12 calculator tools
  - 20 converter tools

The header and static routes both read from the same tool catalog, so removing
duplicates here fixes duplicate dropdown items and prevents duplicate route data.
