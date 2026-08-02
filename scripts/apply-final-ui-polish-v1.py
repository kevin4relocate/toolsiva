from pathlib import Path

def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"Could not find marker: {label}")
    return text.replace(old, new, 1)

header_path = Path("src/components/layout/Header.astro")
header = header_path.read_text(encoding="utf-8")
header = replace_once(
    header,
    'class="absolute right-0 top-full mt-2 w-[20rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl"',
    'class="absolute right-0 top-full mt-2 max-h-[calc(100vh-5rem)] w-[20rem] max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl"',
    "mobile menu container",
)
header_path.write_text(header, encoding="utf-8")

route_path = Path("src/pages/tools/[category]/[slug].astro")
route = route_path.read_text(encoding="utf-8")
route = replace_once(
    route,
    'min-[1700px]:max-w-[1616px] min-[1700px]:grid-cols-[160px_minmax(0,1240px)_160px] min-[1700px]:gap-7',
    'min-[1700px]:max-w-[1608px] min-[1700px]:grid-cols-[160px_minmax(0,1240px)_160px] min-[1700px]:gap-6',
    "1700px AdSense layout",
)
route_path.write_text(route, encoding="utf-8")

workspace_path = Path("src/components/tools/NewTextToolsWorkspace.astro")
workspace = workspace_path.read_text(encoding="utf-8")
workspace = replace_once(
    workspace,
    'data-copy class="cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"',
    'data-copy class="focus-ring cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-brand-400/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"',
    "new text copy button",
)
replacements = [
    ('class=\\"ml-2 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"', 'class=\\"focus-ring ml-2 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"'),
    ('class=\\"ml-2 w-28 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"', 'class=\\"focus-ring ml-2 w-28 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"'),
    ('class=\\"ml-2 w-20 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"', 'class=\\"focus-ring ml-2 w-20 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5\\"'),
    ('class=\\"mr-1.5\\"', 'class=\\"focus-ring mr-1.5 size-4 accent-violet-600\\"'),
]
for old, new in replacements:
    workspace = workspace.replace(old, new)
workspace_path.write_text(workspace, encoding="utf-8")

print("Applied final UI polish.")
