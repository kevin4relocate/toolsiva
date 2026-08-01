# Tool Catalog Deduplication v2

The v1 script assumed a particular TypeScript declaration format. The actual
catalog contains both normal TypeScript object keys and JSON-style quoted keys.

Version 2:

- finds the tools array without depending on exact spacing or type syntax;
- understands both `slug: "..."` and `"slug": "..."`;
- keeps the first item for each slug;
- removes later duplicate items;
- verifies all six category totals;
- verifies exactly 82 unique tools;
- verifies that every generated tool route is unique.
