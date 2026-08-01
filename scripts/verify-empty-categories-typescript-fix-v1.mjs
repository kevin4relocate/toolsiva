import fs from "node:fs";

const tools = fs.readFileSync("src/data/tools.ts", "utf8");
const calculator = fs.readFileSync(
  "src/components/tools/CalculatorToolWorkspace.astro",
  "utf8",
);
const converter = fs.readFileSync(
  "src/components/tools/ConverterToolWorkspace.astro",
  "utf8",
);
const qr = fs.readFileSync(
  "src/components/tools/QrToolWorkspace.astro",
  "utf8",
);

const checks = [
  [
    "No empty array entry in tools",
    !/,\s*,\s*(?=\{)/.test(tools) && !/\[\s*,\s*(?=\{)/.test(tools),
  ],
  [
    "Calculator time values are narrowed",
    calculator.includes("const [h = 0, m = 0]"),
  ],
  [
    "Converter fallback is narrowed",
    converter.includes('const fallbackUnits = sets["length-converter"]') &&
      converter.includes("if (!fallbackUnits) return") &&
      converter.includes("const units = sets[mode] ?? fallbackUnits"),
  ],
  [
    "QR input type is constrained",
    qr.includes("type QrInputType =") &&
      qr.includes("type?:QrInputType"),
  ],
  [
    "QR fallback config is narrowed",
    qr.includes("if (!fallbackConfig)") &&
      qr.includes("const config = configs[mode] ?? fallbackConfig"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(`${passed ? "OK" : "FAILED"}: ${name}`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Empty categories TypeScript verification passed.");
