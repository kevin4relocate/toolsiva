# Package 005 — Security Tools Core

Adds 10 browser-only tools:

1. Password Generator
2. Passphrase Generator
3. Random String Generator
4. Secure Token Generator
5. Password Strength Checker
6. SHA-256 Hash Generator
7. SHA-512 Hash Generator
8. HMAC Generator
9. Basic Auth Header Generator
10. Hash Compare

Security-sensitive random values use `crypto.getRandomValues`.
Hash and HMAC operations use the browser Web Crypto API.
No user input is uploaded or stored.

The package also restores Astro to root-domain deployment for Cloudflare Pages.
GitHub Pages workflow removal is handled by the installation command.
