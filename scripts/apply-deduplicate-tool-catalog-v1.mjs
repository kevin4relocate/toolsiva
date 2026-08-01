import fs from "node:fs";

const toolsPath = "src/data/tools.ts";
const source = fs.readFileSync(toolsPath, "utf8");

const declarationPattern =
  /export\s+const\s+tools\s*:\s*ToolDefinition\[\]\s*=\s*\[/;
const declarationMatch = declarationPattern.exec(source);

if (!declarationMatch || declarationMatch.index === undefined) {
  throw new Error("Could not locate the Toolsiva tools array.");
}

const arrayOpen = source.indexOf("[", declarationMatch.index);
if (arrayOpen < 0) {
  throw new Error("Could not locate the tools array opening bracket.");
}

function findMatchingBracket(text, startIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const character = text[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === quote) {
        quote = "";
      }

      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "[") depth += 1;

    if (character === "]") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

const arrayClose = findMatchingBracket(source, arrayOpen);
if (arrayClose < 0) {
  throw new Error("Could not locate the tools array closing bracket.");
}

const arrayBody = source.slice(arrayOpen + 1, arrayClose);

function splitTopLevelItems(text) {
  const items = [];
  let start = 0;
  let curlyDepth = 0;
  let squareDepth = 0;
  let parenDepth = 0;
  let quote = "";
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === quote) {
        quote = "";
      }

      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "{") curlyDepth += 1;
    if (character === "}") curlyDepth -= 1;
    if (character === "[") squareDepth += 1;
    if (character === "]") squareDepth -= 1;
    if (character === "(") parenDepth += 1;
    if (character === ")") parenDepth -= 1;

    if (
      character === "," &&
      curlyDepth === 0 &&
      squareDepth === 0 &&
      parenDepth === 0
    ) {
      items.push(text.slice(start, index));
      start = index + 1;
    }
  }

  items.push(text.slice(start));
  return items;
}

const items = splitTopLevelItems(arrayBody);
const seenSlugs = new Set();
const uniqueItems = [];
const duplicateSlugs = [];
let emptyItems = 0;

for (const item of items) {
  const trimmed = item.trim();

  if (!trimmed) {
    emptyItems += 1;
    continue;
  }

  const slugMatch = trimmed.match(/\bslug\s*:\s*["']([^"']+)["']/);

  if (!slugMatch) {
    uniqueItems.push(trimmed);
    continue;
  }

  const slug = slugMatch[1];

  if (seenSlugs.has(slug)) {
    duplicateSlugs.push(slug);
    continue;
  }

  seenSlugs.add(slug);
  uniqueItems.push(trimmed);
}

const rebuiltBody =
  uniqueItems.length > 0
    ? `\n  ${uniqueItems.join(",\n  ")}\n`
    : "\n";

const updated =
  source.slice(0, arrayOpen + 1) +
  rebuiltBody +
  source.slice(arrayClose);

fs.writeFileSync(toolsPath, updated);

console.log(`Unique tools retained: ${seenSlugs.size}`);
console.log(`Duplicate tool entries removed: ${duplicateSlugs.length}`);
console.log(`Empty array entries removed: ${emptyItems}`);

if (duplicateSlugs.length > 0) {
  console.log(`Removed duplicate slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

console.log("Tool catalog deduplication complete.");
