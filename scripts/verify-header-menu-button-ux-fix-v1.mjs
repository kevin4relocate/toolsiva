import fs from "node:fs";

const header = fs.readFileSync("src/components/layout/Header.astro", "utf8");
const css = fs.readFileSync("src/styles/global.css", "utf8");

const checks = [
  ["Desktop menus are marked", header.includes('data-nav-menu')],
  ["Opening one menu closes others", header.includes('closeMenus(menu)')],
  ["Outside click closes menus", header.includes("document.addEventListener('pointerdown'")],
  ["Escape closes menus", header.includes("event.key === 'Escape'")],
  ["Menu link click closes menus", header.includes("link.addEventListener('click'")],
  ["Enabled buttons use pointer cursor", css.includes('button:not(:disabled)') && css.includes('cursor: pointer')],
  ["Disabled controls use not-allowed", css.includes('cursor: not-allowed')],
];

let failed = false;
for (const [name, passed] of checks) {
  console.log(`${passed ? 'OK' : 'FAILED'}: ${name}`);
  if (!passed) failed = true;
}
if (failed) process.exit(1);
console.log('Header menu + button cursor UX verification passed.');
