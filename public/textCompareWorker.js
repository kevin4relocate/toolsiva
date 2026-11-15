// Pure diff engine shared by a module Web Worker and Node regression tests.
// Bounded work prevents pasted documents from exhausting browser memory.
export const TEXT_COMPARE_LIMITS = Object.freeze({
  maxCharactersPerSide: 200000,
  maxLinesPerSide: 2000,
  maxMatrixCells: 2000000,
});

function normalize(line, ignoreCase, ignoreWhitespace) {
  let result = line;
  if (ignoreWhitespace) result = result.replace(/\s+/g, " ").trim();
  if (ignoreCase) result = result.toLowerCase();
  return result;
}

/**
 * @returns {{rows: Array<{kind: string, leftIndex: number|null, rightIndex: number|null}>,
 *   stats: {unchanged: number, added: number, removed: number, changed: number}} | {error: string}}
 */
export function compareTextLines(leftText, rightText, options = {}) {
  if (typeof leftText !== "string" || typeof rightText !== "string") {
    return { error: "Both inputs must be text." };
  }
  const { maxCharactersPerSide, maxLinesPerSide, maxMatrixCells } = TEXT_COMPARE_LIMITS;
  if (leftText.length > maxCharactersPerSide || rightText.length > maxCharactersPerSide) {
    return { error: "Each side must contain 200,000 characters or fewer. Compare a smaller section." };
  }

  const left = leftText ? leftText.split(/\r?\n/) : [];
  const right = rightText ? rightText.split(/\r?\n/) : [];
  const m = left.length;
  const n = right.length;

  if (m > maxLinesPerSide || n > maxLinesPerSide) {
    return { error: "Each side must have 2,000 lines or fewer. Split large files into sections." };
  }
  if ((m + 1) * (n + 1) > maxMatrixCells) {
    return { error: "This comparison is too complex for a browser. Compare smaller sections." };
  }

  const ignoreCase = options.ignoreCase === true;
  const ignoreWhitespace = options.ignoreWhitespace === true;
  const a = left.map((line) => normalize(line, ignoreCase, ignoreWhitespace));
  const b = right.map((line) => normalize(line, ignoreCase, ignoreWhitespace));

  const width = n + 1;
  const dp = new Uint32Array((m + 1) * width);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const index = i * width + j;
      dp[index] = a[i] === b[j]
        ? dp[(i + 1) * width + j + 1] + 1
        : Math.max(dp[(i + 1) * width + j], dp[index + 1]);
    }
  }

  const raw = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      raw.push({ kind: "unchanged", leftIndex: i++, rightIndex: j++ });
    } else if (dp[(i + 1) * width + j] >= dp[i * width + j + 1]) {
      raw.push({ kind: "removed", leftIndex: i++, rightIndex: null });
    } else {
      raw.push({ kind: "added", leftIndex: null, rightIndex: j++ });
    }
  }
  while (i < m) raw.push({ kind: "removed", leftIndex: i++, rightIndex: null });
  while (j < n) raw.push({ kind: "added", leftIndex: null, rightIndex: j++ });

  const rows = [];
  const stats = { unchanged: 0, added: 0, removed: 0, changed: 0 };
  for (let index = 0; index < raw.length; index++) {
    const item = raw[index];
    const next = raw[index + 1];
    if (item.kind === "removed" && next?.kind === "added") {
      rows.push({ kind: "changed", leftIndex: item.leftIndex, rightIndex: next.rightIndex });
      stats.changed++;
      index++;
    } else {
      rows.push(item);
      stats[item.kind]++;
    }
  }
  return { rows, stats };
}

if (typeof self !== "undefined" && typeof self.addEventListener === "function") {
  self.addEventListener("message", (event) => {
    const { id, left, right, ignoreCase, ignoreWhitespace } = event.data || {};
    try {
      self.postMessage({
        id,
        ...compareTextLines(left, right, { ignoreCase, ignoreWhitespace }),
      });
    } catch {
      self.postMessage({ id, error: "Unable to compare this input. Try a smaller section." });
    }
  });
}
