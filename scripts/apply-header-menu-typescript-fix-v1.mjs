import fs from "node:fs";

const headerPath = "src/components/layout/Header.astro";
let header = fs.readFileSync(headerPath, "utf8");

const oldSelector = `const menus = Array.from(
      document.querySelectorAll('header details[data-nav-menu]'),
    );`;
const newSelector = `const menus = Array.from(
      document.querySelectorAll<HTMLDetailsElement>('header details[data-nav-menu]'),
    );`;

if (header.includes(oldSelector)) {
  header = header.replace(oldSelector, newSelector);
  console.log("UPDATED: navigation menu collection type");
} else if (header.includes(newSelector)) {
  console.log("SKIP: navigation menu collection type already fixed");
} else {
  throw new Error("Could not locate navigation menu selector block.");
}

const oldClose = `const closeMenus = (except = null) => {`;
const newClose = `const closeMenus = (except: HTMLDetailsElement | null = null) => {`;

if (header.includes(oldClose)) {
  header = header.replace(oldClose, newClose);
  console.log("UPDATED: closeMenus parameter type");
} else if (header.includes(newClose)) {
  console.log("SKIP: closeMenus parameter type already fixed");
} else {
  throw new Error("Could not locate closeMenus declaration.");
}

fs.writeFileSync(headerPath, header);
console.log("Header menu TypeScript fix applied.");
