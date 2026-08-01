import fs from "node:fs";

const textPath = "src/components/tools/TextToolWorkspace.astro";
const developerPath = "src/components/tools/DeveloperToolWorkspace.astro";
const oldVerifyPath = "scripts/verify-smart-tool-ux.mjs";

let text = fs.readFileSync(textPath, "utf8");
let developer = fs.readFileSync(developerPath, "utf8");

const oldLcsPattern =
  /const lcs=\(a:string\[\],b:string\[\]\)=>\{const m=a\.length,n=b\.length,dp=Array\.from\(\{length:m\+1\},\(\)=>new Uint32Array\(n\+1\)\);.*?return out;\};/s;

const safeLcs = `const lcs = (a: string[], b: string[]) => {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from(
      { length: m + 1 },
      () => Array<number>(n + 1).fill(0),
    );

    for (let i = m - 1; i >= 0; i -= 1) {
      for (let j = n - 1; j >= 0; j -= 1) {
        const diagonal = dp[i + 1]?.[j + 1] ?? 0;
        const below = dp[i + 1]?.[j] ?? 0;
        const right = dp[i]?.[j + 1] ?? 0;

        if (a[i] === b[j]) {
          if (dp[i]) dp[i][j] = diagonal + 1;
        } else {
          if (dp[i]) dp[i][j] = Math.max(below, right);
        }
      }
    }

    const out: {
      left: string | null;
      right: string | null;
      type: "unchanged" | "removed" | "added";
    }[] = [];

    let i = 0;
    let j = 0;

    while (i < m && j < n) {
      if (a[i] === b[j]) {
        out.push({
          left: a[i] ?? "",
          right: b[j] ?? "",
          type: "unchanged",
        });
        i += 1;
        j += 1;
        continue;
      }

      const below = dp[i + 1]?.[j] ?? 0;
      const right = dp[i]?.[j + 1] ?? 0;

      if (below >= right) {
        out.push({
          left: a[i] ?? "",
          right: null,
          type: "removed",
        });
        i += 1;
      } else {
        out.push({
          left: null,
          right: b[j] ?? "",
          type: "added",
        });
        j += 1;
      }
    }

    while (i < m) {
      out.push({
        left: a[i] ?? "",
        right: null,
        type: "removed",
      });
      i += 1;
    }

    while (j < n) {
      out.push({
        left: null,
        right: b[j] ?? "",
        type: "added",
      });
      j += 1;
    }

    return out;
  };`;

if (!oldLcsPattern.test(text)) {
  throw new Error("Could not locate the UX v2 LCS implementation.");
}

text = text.replace(oldLcsPattern, safeLcs);

developer = developer.replace(
  ',isValidator=root.dataset.validator==="true",isGenerator=root.dataset.generator==="true";',
  ',isValidator=root.dataset.validator==="true";',
);

fs.writeFileSync(textPath, text);
fs.writeFileSync(developerPath, developer);

const updatedVerify = `import fs from "node:fs";

const text = fs.readFileSync(
  "src/components/tools/TextToolWorkspace.astro",
  "utf8",
);
const developer = fs.readFileSync(
  "src/components/tools/DeveloperToolWorkspace.astro",
  "utf8",
);
const security = fs.readFileSync(
  "src/components/tools/SecurityToolWorkspace.astro",
  "utf8",
);

const checks = [
  [
    "Text has no generic Process button",
    !text.includes("data-run") && !text.includes(">Process<"),
  ],
  [
    "Text tools update automatically",
    text.includes('addEventListener("input",transform)') ||
      text.includes('addEventListener("input", transform)'),
  ],
  [
    "Case Converter uses direct actions",
    text.includes("data-case-action") && text.includes("data-undo"),
  ],
  [
    "Text Compare uses visual diff",
    text.includes("data-diff-view") && text.includes("const lcs"),
  ],
  [
    "Developer tools have no generic Process button",
    !developer.includes("data-run"),
  ],
  [
    "Developer tools use automatic debounce",
    developer.includes("debounce=setTimeout(transform,180)") ||
      developer.includes("debounce = setTimeout(transform, 180)"),
  ],
  [
    "UUID has a named Generate action",
    developer.includes("Generate UUIDs") &&
      developer.includes("data-generate"),
  ],
  [
    "Validators use semantic status cards",
    developer.includes("data-validation-card") &&
      developer.includes("semantic-success") &&
      developer.includes("semantic-error"),
  ],
  [
    "Security generators have named actions",
    security.includes("Generate password") &&
      security.includes("Generate token"),
  ],
  [
    "Security tools have no generic Process button",
    !security.includes("data-run") && !security.includes(">Process<"),
  ],
  [
    "Security tools use automatic debounce",
    security.includes("setTimeout(update,180)") ||
      security.includes("setTimeout(update, 180)"),
  ],
];

let failed = false;

for (const [name, passed] of checks) {
  console.log(\`\${passed ? "OK" : "FAILED"}: \${name}\`);
  if (!passed) failed = true;
}

if (failed) process.exit(1);

console.log("Smart Tool UX verification passed for UX Architecture v2.");
`;

fs.writeFileSync(oldVerifyPath, updatedVerify);

console.log("Tool UX Architecture v2 complete fix applied.");
