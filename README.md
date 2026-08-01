# Toolsiva Foundation

Foundation package for Toolsiva.

## Stack

- Astro 7
- React Islands
- TypeScript
- Tailwind CSS 4
- Cloudflare Workers Static Assets
- Wrangler

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
npm run deploy
```

## Local URLs

- Home: http://localhost:4321
- Tools: http://localhost:4321/tools
- Demo: http://localhost:4321/tools/text/word-counter

## Architecture rules

1. Static-first.
2. Tool processing runs in the browser whenever possible.
3. No user data is stored by default.
4. Each tool has one canonical URL.
5. Tool metadata lives in `src/data/tools.ts`.
6. Interactive tool components live in `src/components/tools`.
7. SEO, FAQ and related tools are rendered as static HTML.
8. Ad slots remain disabled until AdSense approval.
