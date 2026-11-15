import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schedule = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/curatedGuideSchedule.json"), "utf8"));
const OUT = path.join(ROOT, "public/blog/illustrations");
const escape = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const palette = {
  calculator: ["#3e246f", "#b69bff", "#eee6ff"],
  text: ["#153b43", "#5de1cb", "#d9fff4"],
  developer: ["#173b66", "#76b8ff", "#e3f1ff"],
  security: ["#533144", "#ffc688", "#fff2dc"],
  qr: ["#303a66", "#b4a6ff", "#f0edff"],
  converter: ["#304e46", "#8ce3ad", "#eafff0"],
};
function wrap(value, max = 19) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!current) current = word;
    else if ((current + " " + word).length <= max) current += " " + word;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}
function textLines(value, x, y, max = 19, fontSize = 27) {
  return wrap(value, max).map((line, index) =>
    '<text x="' + x + '" y="' + (y + index * (fontSize + 9)) +
    '" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="' +
    fontSize + '" font-weight="700">' + escape(line) + '</text>').join("");
}
export function imageSvg(entry) {
  const [base, accent, light] = palette[entry.category] || palette.developer;
  const labels = entry.diagram.steps;
  if (!Array.isArray(labels) || labels.length !== 3) throw new Error(entry.slug + ": needs 3 visual steps.");
  const cards = labels.map((label, index) => {
    const x = 72 + index * 372, y = 258;
    return [
      '<g>',
      '<rect x="' + x + '" y="' + y + '" width="316" height="234" rx="20" fill="#ffffff" fill-opacity="0.095" stroke="#ffffff" stroke-opacity="0.32"/>',
      '<circle cx="' + (x + 44) + '" cy="' + (y + 44) + '" r="23" fill="' + accent + '"/>',
      '<text x="' + (x + 44) + '" y="' + (y + 52) + '" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="24" fill="' + base + '">' + (index + 1) + '</text>',
      textLines(label, x + 24, y + 112, 17, 27),
      index < 2 ? '<path d="M' + (x + 324) + ' ' + (y + 116) + ' l18 0 m-6 -7 l7 7 l-7 7" stroke="' + light + '" stroke-width="3" fill="none"/>' : '',
      '</g>'
    ].join("");
  }).join("");
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="image-title image-desc">',
    '<title id="image-title">' + escape(entry.title) + ' - Toolsiva illustration</title>',
    '<desc id="image-desc">' + escape(entry.imageAlt) + '</desc>',
    '<defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="' + base + '"/><stop offset="1" stop-color="#080e1c"/></linearGradient>',
    '<pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M 38 0 L 0 0 0 38" stroke="#ffffff" stroke-opacity="0.065" fill="none"/></pattern></defs>',
    '<rect width="1200" height="630" fill="url(#bg)"/>',
    '<rect width="1200" height="630" fill="url(#grid)"/>',
    '<circle cx="1130" cy="55" r="290" fill="' + accent + '" fill-opacity="0.09"/>',
    '<text x="72" y="69" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="4" fill="' + accent + '">TOOLSIVA  /  ' + escape(entry.category.toUpperCase()) + ' GUIDE</text>',
    '<text x="72" y="140" font-family="Arial, Helvetica, sans-serif" font-size="49" font-weight="800" fill="#ffffff">' + escape(entry.diagram.heading) + '</text>',
    '<text x="72" y="190" font-family="Arial, Helvetica, sans-serif" font-size="23" fill="' + light + '">A visual example of the workflow and its result</text>',
    cards,
    '<path d="M72 538H1128" stroke="#ffffff" stroke-opacity=".26"/>',
    '<text x="72" y="576" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="' + light + '">Practical steps  •  Check assumptions  •  Use the relevant Toolsiva tool</text>',
    '</svg>',
  ].join("\n");
}

export function writeGuideImages(destination = OUT) {
  fs.mkdirSync(destination, { recursive: true });
  const extra = {
    slug: "markdown-live-preview-guide", category: "developer",
    title: "How to Preview Markdown Online in Real Time",
    imageAlt: "Markdown editing workflow showing source, live rendered preview and document export",
    diagram: { heading: "Markdown editing", steps: ["Write Markdown", "Inspect live preview", "Export checked file"] },
  };
  for (const entry of [...schedule, extra]) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) throw new Error("Unsafe image filename.");
    const file = path.join(destination, entry.slug + ".svg");
    fs.writeFileSync(file, imageSvg(entry), "utf8");
  }
  return schedule.length + 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log("Generated " + writeGuideImages() + " original, text-accessible SVG illustrations for blog guides.");
}
