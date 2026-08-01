import fs from "node:fs";

const toolsPath = "src/data/tools.ts";
const calculatorPath = "src/components/tools/CalculatorToolWorkspace.astro";
const converterPath = "src/components/tools/ConverterToolWorkspace.astro";
const qrPath = "src/components/tools/QrToolWorkspace.astro";

function replaceRequired(source, before, after, label) {
  if (source.includes(after)) {
    console.log(`SKIP: ${label} already fixed.`);
    return source;
  }

  if (!source.includes(before)) {
    throw new Error(`Could not locate source for: ${label}`);
  }

  console.log(`FIXED: ${label}`);
  return source.replace(before, after);
}

// 1. Remove accidental empty array entries from tools.ts.
let tools = fs.readFileSync(toolsPath, "utf8");
const beforeTools = tools;

tools = tools
  .replace(/,\s*,\s*(?=\{)/g, ",\n")
  .replace(/\[\s*,\s*(?=\{)/g, "[\n");

if (tools !== beforeTools) {
  fs.writeFileSync(toolsPath, tools);
  console.log("FIXED: empty tool array entry.");
} else {
  console.log("SKIP: no empty tool array entry found.");
}

// 2. Make time parsing strict-safe.
let calculator = fs.readFileSync(calculatorPath, "utf8");

calculator = replaceRequired(
  calculator,
  'const[h,m]=s.split(":").map(Number);return h*60+m',
  'const [h = 0, m = 0] = s.split(":").map(Number); return h * 60 + m',
  "calculator time parsing",
);

fs.writeFileSync(calculatorPath, calculator);

// 3. Narrow converter fallback units before Object.entries and indexing.
let converter = fs.readFileSync(converterPath, "utf8");

converter = replaceRequired(
  converter,
  'const mode=root.dataset.mode??"",units=sets[mode]??sets["length-converter"],input=',
  'const mode = root.dataset.mode ?? ""; const fallbackUnits = sets["length-converter"]; if (!fallbackUnits) return; const units = sets[mode] ?? fallbackUnits; const input=',
  "converter unit fallback",
);

fs.writeFileSync(converterPath, converter);

// 4. Make QR field type compatible with Astro input types and narrow config.
let qr = fs.readFileSync(qrPath, "utf8");

qr = replaceRequired(
  qr,
  'const configs: Record<string, { title: string; fields: Array<{name:string;label:string;type?:string;placeholder?:string;options?:string[]}> }> = {',
  'type QrInputType = "text" | "url" | "password" | "email" | "tel" | "number" | "datetime-local";\nconst configs: Record<string, { title: string; fields: Array<{name:string;label:string;type?:QrInputType;placeholder?:string;options?:string[]}> }> = {',
  "QR input type",
);

qr = replaceRequired(
  qr,
  'const config = configs[mode] ?? configs["qr-text-generator"];',
  'const fallbackConfig = configs["qr-text-generator"];\nif (!fallbackConfig) throw new Error("Missing default QR configuration.");\nconst config = configs[mode] ?? fallbackConfig;',
  "QR config fallback",
);

fs.writeFileSync(qrPath, qr);

console.log("Empty categories TypeScript fixes applied.");
