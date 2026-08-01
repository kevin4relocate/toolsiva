import fs from "node:fs";

const toolsPath = "src/data/tools.ts";
const source = fs.readFileSync(toolsPath, "utf8");

const declarationIndex = source.indexOf("export const tools");
if (declarationIndex < 0) {
  throw new Error('Could not find "export const tools".');
}

const equalsIndex = source.indexOf("=", declarationIndex);
if (equalsIndex < 0) {
  throw new Error("Could not find the tools assignment.");
}

const arrayOpen = source.indexOf("[", equalsIndex);
if (arrayOpen < 0) {
  throw new Error("Could not find the tools array opening bracket.");
}

function findMatchingSquareBracket(text, startIndex) {
  let squareDepth = 0;
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

    if (character === "[") squareDepth += 1;

    if (character === "]") {
      squareDepth -= 1;
      if (squareDepth === 0) return index;
    }
  }

  return -1;
}

const arrayClose = findMatchingSquareBracket(source, arrayOpen);
if (arrayClose < 0) {
  throw new Error("Could not find the tools array closing bracket.");
}

const body = source.slice(arrayOpen + 1, arrayClose);

function splitTopLevelArrayItems(text) {
  const items = [];
  let itemStart = 0;
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
      items.push(text.slice(itemStart, index));
      itemStart = index + 1;
    }
  }

  items.push(text.slice(itemStart));
  return items;
}

function extractSlug(item) {
  return (
    item.match(/(?:^|[,{]\s*)slug\s*:\s*["']([^"']+)["']/s)?.[1] ??
    item.match(/(?:^|[,{]\s*)["']slug["']\s*:\s*["']([^"']+)["']/s)?.[1] ??
    null
  );
}

const originalItems = splitTopLevelArrayItems(body);
const uniqueItems = [];
const seen = new Set();
const removed = [];
let emptyRemoved = 0;

for (const rawItem of originalItems) {
  const item = rawItem.trim();

  if (!item) {
    emptyRemoved += 1;
    continue;
  }

  const slug = extractSlug(item);

  if (!slug) {
    uniqueItems.push(item);
    continue;
  }

  if (seen.has(slug)) {
    removed.push(slug);
    continue;
  }

  seen.add(slug);
  uniqueItems.push(item);
}

const rebuiltBody =
  uniqueItems.length > 0
    ? `\n  ${uniqueItems.join(",\n  ")}\n`
    : "\n";

const updatedSource =
  source.slice(0, arrayOpen + 1) +
  rebuiltBody +
  source.slice(arrayClose);

fs.writeFileSync(toolsPath, updatedSource);

console.log(`Original top-level entries: ${originalItems.filter((item) => item.trim()).length}`);
console.log(`Unique tool entries retained: ${uniqueItems.length}`);
console.log(`Duplicate entries removed: ${removed.length}`);
console.log(`Empty entries removed: ${emptyRemoved}`);

if (removed.length > 0) {
  console.log(`Removed duplicate slugs: ${[...new Set(removed)].join(", ")}`);
}

console.log("Tool catalog deduplication v2 complete.");
