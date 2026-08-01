import fs from "node:fs";

const headerPath = "src/components/layout/Header.astro";
const cssPath = "src/styles/global.css";

let header = fs.readFileSync(headerPath, "utf8");
let css = fs.readFileSync(cssPath, "utf8");

// Mark every interactive navigation details element.
header = header.replaceAll(
  '<details class="group relative">',
  '<details class="group relative" data-nav-menu>',
);
header = header.replaceAll(
  '<details class="relative lg:hidden">',
  '<details class="relative lg:hidden" data-nav-menu>',
);
header = header.replaceAll(
  '<details class="rounded-xl border border-white/10 bg-white/[0.02] p-1">',
  '<details class="rounded-xl border border-white/10 bg-white/[0.02] p-1" data-mobile-category>',
);

const menuScript = `
<script>
  const setupHeaderMenus = () => {
    const menus = Array.from(
      document.querySelectorAll('header details[data-nav-menu]'),
    );

    const closeMenus = (except = null) => {
      for (const menu of menus) {
        if (menu !== except) menu.removeAttribute('open');
      }
    };

    for (const menu of menus) {
      menu.addEventListener('toggle', () => {
        if (menu.open) closeMenus(menu);
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => closeMenus());
      });
    }

    document.addEventListener('pointerdown', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menus.some((menu) => menu.contains(target))) closeMenus();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenus();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHeaderMenus, { once: true });
  } else {
    setupHeaderMenus();
  }
</script>
`;

if (!header.includes("const setupHeaderMenus")) {
  header = `${header.trimEnd()}\n\n${menuScript.trim()}\n`;
}

const cursorCss = `
/* Interactive controls */
button:not(:disabled),
[role="button"]:not([aria-disabled="true"]),
summary,
select,
label[for] {
  cursor: pointer;
}

button:disabled,
[aria-disabled="true"] {
  cursor: not-allowed;
}
`;

if (!css.includes("/* Interactive controls */")) {
  css = `${css.trimEnd()}\n\n${cursorCss.trim()}\n`;
}

fs.writeFileSync(headerPath, header);
fs.writeFileSync(cssPath, css);

console.log("Header menu and button cursor UX fixes applied.");
