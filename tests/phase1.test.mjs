import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { decodeEscapedJsonString } from "../src/lib/jsonString.ts";
import { compareTextLines, TEXT_COMPARE_LIMITS } from "../public/textCompareWorker.js";

const highValueSource = readFileSync(new URL("../public/highValueTools.js", import.meta.url), "utf8");
const highValueProbe = '  globalThis.__phase1 = { markdown, update };';
const highValueBoot = highValueSource.replace(
  '  document.querySelectorAll("[data-high-value-tool]").forEach(setup);',
  highValueProbe,
);
assert.notEqual(highValueBoot, highValueSource, "High-value test entrypoint missing");
const sandbox = {
  document: {
    querySelectorAll: () => [],
    createElement: () => ({ className: "", textContent: "" }),
  },
  crypto: webcrypto,
  URL,
  TextEncoder,
  TextDecoder,
};
vm.runInNewContext(highValueBoot, sandbox, { filename: "public/highValueTools.js" });
const highValue = sandbox.__phase1;

function highValueRoot(controls) {
  const nodes = new Map(
    Object.entries({
      "[data-input]": { value: "" },
      "[data-output]": { value: "" },
      "[data-copy]": { disabled: true, dataset: {} },
      ...controls,
    }),
  );
  return {
    querySelector: (selector) => nodes.get(selector) ?? null,
    get: (selector) => nodes.get(selector),
  };
}

test("Markdown table has real line breaks, escaped pipes and flattened cell breaks", () => {
  const output = highValue.markdown({
    data: [["First", "Second"], ["A|B", "two\nlines"]],
    alignments: ["left", "right"],
  });
  assert.equal(output, "| First | Second |\n| --- | ---: |\n| A\\|B | two lines |");
});

test("High-value number sorter and word frequencies use real newlines and tabs", () => {
  const sorter = highValueRoot({
    "[data-input]": { value: "3\n1\n2" },
    "[data-direction]": { value: "asc" },
  });
  highValue.update(sorter, "number-sorter", {});
  assert.equal(sorter.get("[data-output]").value, "1\n2\n3");

  const frequencies = highValueRoot({
    "[data-input]": { value: "Apple banana apple" },
    "[data-ignore-case]": { checked: true },
    "[data-sort-mode]": { value: "count" },
  });
  highValue.update(frequencies, "word-frequency-counter", {});
  assert.equal(frequencies.get("[data-output]").value, "apple\t2\nbanana\t1");

  const cases = highValueRoot({ "[data-input]": { value: "hello world" } });
  highValue.update(cases, "programming-case-converter", {});
  assert.equal(cases.get("[data-output]").value.split("\n").length, 6);
});

test("Regex tester copy list uses newline separators", () => {
  const list = {
    textContent: "",
    children: [],
    replaceChildren() { this.children = []; },
    appendChild(node) { this.children.push(node); },
  };
  const root = highValueRoot({
    "[data-input]": { value: "hi hi" },
    "[data-regex]": { value: "hi" },
    "[data-flags]": { value: "" },
    "[data-match-list]": list,
  });
  highValue.update(root, "regex-tester", {});
  assert.equal(root.get("[data-copy]").dataset.result, "1. hi at index 0\n2. hi at index 3");
});

test("Random choice output joins with real newlines", () => {
  assert.match(highValueSource, /picks\.join\("\\n"\)/);
  assert.doesNotMatch(highValueSource, /picks\.join\("\\\\n"\)/);
});

test("JSON Unescape supports both quoted and unquoted escaped bodies", () => {
  assert.equal(decodeEscapedJsonString("Hello\\nWorld"), "Hello\nWorld");
  assert.equal(decodeEscapedJsonString('"Hello\\nWorld"'), "Hello\nWorld");
  assert.equal(decodeEscapedJsonString("first\\tsecond"), "first\tsecond");
  assert.equal(decodeEscapedJsonString("caf\\u00e9"), "café");
  assert.equal(decodeEscapedJsonString("Say \"hi\""), 'Say "hi"');
  assert.equal(decodeEscapedJsonString('say \\"hello\\"'), 'say "hello"');
  assert.equal(decodeEscapedJsonString("C:\\\\folder"), "C:\\folder");
  assert.equal(decodeEscapedJsonString("already\nmultiline"), "already\nmultiline");
});
test("JSON Unescape rejects malformed escapes", () => {
  assert.throws(() => decodeEscapedJsonString("bad\\x"), SyntaxError);
  assert.throws(() => decodeEscapedJsonString("trailing\\"), SyntaxError);
  assert.throws(() => decodeEscapedJsonString('"unterminated'), SyntaxError);
});

test("Diff preserves unchanged/added/removed/changed rows and line indexes", () => {
  const compared = compareTextLines("alpha\nbeta\ngamma", "alpha\nBETA\ngamma\nend");
  assert.equal(compared.error, undefined);
  assert.deepEqual(compared.stats, { unchanged: 2, added: 1, removed: 0, changed: 1 });
  assert.deepEqual(compared.rows.map((row) => row.kind), ["unchanged", "changed", "unchanged", "added"]);
  assert.equal(compared.rows[1].leftIndex, 1);
  assert.equal(compared.rows[1].rightIndex, 1);
});

test("Diff honors ignore-case/ignore-whitespace options", () => {
  const compared = compareTextLines("  Hello   World  ", "hello world", {
    ignoreCase: true,
    ignoreWhitespace: true,
  });
  assert.deepEqual(compared.stats, { unchanged: 1, added: 0, removed: 0, changed: 0 });
});

test("Diff safely refuses 10,000-line and high-complexity inputs", () => {
  const huge = Array.from({ length: 10000 }, (_, i) => String(i)).join("\n");
  assert.match(compareTextLines(huge, huge).error, /2,000 lines/);
  const medium = Array.from({ length: 1500 }, (_, i) => String(i)).join("\n");
  assert.match(compareTextLines(medium, medium).error, /too complex/);
  assert.equal(TEXT_COMPARE_LIMITS.maxMatrixCells, 2000000);
});

test("Diff handles an empty side without spurious unchanged rows", () => {
  const added = compareTextLines("", "one\ntwo");
  assert.deepEqual(added.stats, { unchanged: 0, added: 2, removed: 0, changed: 0 });
});
