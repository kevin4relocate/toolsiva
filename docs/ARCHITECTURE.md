# Toolsiva Architecture v1

## Core

Astro renders pages statically. React is loaded only for interactive tool islands.

## Hosting

The `dist/` folder is deployed through Cloudflare Workers Static Assets.

## Data

No database is used in the foundation. Tool definitions are typed source data.

## Tool page lifecycle

1. Tool registry defines metadata.
2. Astro generates static routes.
3. Astro renders SEO content, FAQ and related links.
4. React hydrates only the interactive workspace.
5. Processing stays in the browser.

## Future boundaries

- PostgreSQL: accounts, subscriptions, API usage.
- R2: temporary uploads and generated files.
- Worker APIs: lightweight dynamic operations.
- External processing service: CPU-heavy work only.
