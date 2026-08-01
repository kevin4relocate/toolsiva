# Smart Tool UX TypeScript Fix

Fixes Astro/TypeScript diagnostics caused by timer variables being inferred as
numbers while Node type definitions return `NodeJS.Timeout`.

Timer variables now use:

```ts
ReturnType<typeof setTimeout> | undefined
```

The unused `validator` variable was also removed.
