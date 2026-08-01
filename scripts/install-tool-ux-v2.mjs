import fs from "node:fs";
const path = "src/styles/global.css";
const marker = "/* Toolsiva UX Architecture v2 — semantic colors */";
let css = fs.readFileSync(path, "utf8");
const patch = fs.readFileSync("patches/semantic-colors.css", "utf8");
if (!css.includes(marker)) css = `${css.trim()}\n\n${patch.trim()}\n`;
fs.writeFileSync(path, css);
console.log("Semantic color system installed.");
