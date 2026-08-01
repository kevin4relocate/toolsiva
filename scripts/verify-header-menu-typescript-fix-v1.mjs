import fs from "node:fs";

const header = fs.readFileSync("src/components/layout/Header.astro", "utf8");

const checks = [
  [
    "Menu selector returns HTMLDetailsElement",
    header.includes("querySelectorAll<HTMLDetailsElement>('header details[data-nav-menu]')"),
  ],
  [
    "closeMenus accepts HTMLDetailsElement or null",
    header.includes("except: HTMLDetailsElement | null = null"),
  ],
  [
    "Menu open state remains supported",
    header.includes("if (menu.open) closeMenus(menu)"),
  ],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);
console.log("Header menu TypeScript verification passed.");
