# Toolsiva 100 Tools TypeScript Fix v1

Fixes strict TypeScript errors in `ExpansionToolWorkspace.astro`.

Cause:
- calculator values come from `Record<string, string>`;
- property access such as `v.cost` is treated as `string | undefined`;
- the numeric parser previously accepted only `string`.

Fix:
- numeric parser accepts `string | undefined`;
- undefined values fall back to an empty string;
- GCD/LCM text input also receives an empty-string fallback.
