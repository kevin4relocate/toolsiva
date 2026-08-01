# Empty Categories TypeScript Fix v1

Fixes all strict TypeScript errors reported after adding QR, calculator and converter tools.

## Fixes

- Removes the accidental empty item from `src/data/tools.ts`.
- Safely parses hour and minute values in Time Duration Calculator.
- Narrows the converter fallback unit set before iteration and indexing.
- Restricts QR field input types to valid HTML input values.
- Narrows the default QR configuration before rendering.
