import fs from "node:fs";

const files = [
  "src/components/tools/DeveloperToolWorkspace.astro",
  "src/components/tools/SecurityToolWorkspace.astro",
];

for (const file of files) {
  let source = fs.readFileSync(file, "utf8");

  source = source.replace(
    "let timer=0,debounce=0;",
    "let timer: ReturnType<typeof setTimeout> | undefined; let debounce: ReturnType<typeof setTimeout> | undefined;",
  );

  source = source.replace(
    'clearTimeout(timer);timer=setTimeout(',
    'if (timer) clearTimeout(timer); timer=setTimeout(',
  );

  source = source.replace(
    'clearTimeout(debounce);debounce=setTimeout(',
    'if (debounce) clearTimeout(debounce); debounce=setTimeout(',
  );

  source = source.replace(
    ',validator=root.dataset.validator==="true",generator=root.dataset.generator==="true"',
    ',generator=root.dataset.generator==="true"',
  );

  fs.writeFileSync(file, source);
}

console.log("Smart UX timeout types fixed.");
