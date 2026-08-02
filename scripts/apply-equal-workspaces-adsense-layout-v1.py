from pathlib import Path

def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f"Could not find marker: {label}")
    return text.replace(old, new, 1)

path = Path("src/components/tools/ExpansionToolWorkspace.astro")
s = path.read_text()
s = replace_once(s,
'<div>\n        <label class="mb-2 block text-sm font-semibold text-zinc-200">Input</label>\n        <textarea data-input rows="12" class="min-h-72 w-full resize-y',
'<div class="grid min-w-0 grid-rows-[2.75rem_auto_auto]">\n        <div class="flex h-11 items-center"><label class="block text-sm font-semibold text-zinc-200">Input</label></div>\n        <textarea data-input rows="12" class="h-[clamp(18rem,42vh,26rem)] min-h-72 w-full resize-y',
"expansion input")
s = replace_once(s,
'<div>\n        <div class="mb-2 flex items-center justify-between gap-3">',
'<div class="grid min-w-0 grid-rows-[2.75rem_auto_auto]">\n        <div class="flex h-11 items-center justify-between gap-3">',
"expansion result")
s = replace_once(s,
'<textarea data-output rows="12" readonly class="min-h-72 w-full resize-y',
'<textarea data-output rows="12" readonly class="h-[clamp(18rem,42vh,26rem)] min-h-72 w-full resize-y',
"expansion output")
path.write_text(s)

path = Path("src/components/tools/NewTextToolsWorkspace.astro")
s = path.read_text()
s = replace_once(s,
'<div>\n      <label class="mb-2 block text-sm font-semibold text-zinc-200">Input</label>\n      <textarea data-input rows="12" class="min-h-72 w-full resize-y',
'<div class="grid min-w-0 grid-rows-[2.75rem_auto_auto]">\n      <div class="flex h-11 items-center"><label class="block text-sm font-semibold text-zinc-200">Input</label></div>\n      <textarea data-input rows="12" class="h-[clamp(18rem,42vh,26rem)] min-h-72 w-full resize-y',
"new input")
s = replace_once(s,
'<div>\n      <div class="mb-2 flex items-center justify-between gap-3">',
'<div class="grid min-w-0 grid-rows-[2.75rem_auto_auto]">\n      <div class="flex h-11 items-center justify-between gap-3">',
"new result")
s = replace_once(s,
'<textarea data-output rows="12" readonly class="min-h-72 w-full resize-y',
'<textarea data-output rows="12" readonly class="h-[clamp(18rem,42vh,26rem)] min-h-72 w-full resize-y',
"new output")
path.write_text(s)

path = Path("src/components/common/AdSlot.astro")
s = path.read_text()
s = replace_once(s, '  minHeight?: number;\n}', '  minHeight?: number;\n  variant?: "inline" | "side-rail";\n}', "ad props")
s = replace_once(s,
'const { placement, minHeight = 0 } = Astro.props;',
'const { placement, minHeight = 0, variant = "inline" } = Astro.props;\nconst slotClass = variant === "side-rail"\n  ? "sticky top-24 hidden h-[600px] w-[160px] items-center justify-center overflow-hidden rounded-xl min-[1700px]:flex"\n  : "my-8 flex items-center justify-center overflow-hidden rounded-xl";',
"ad vars")
s = replace_once(s, 'class="my-8 flex items-center justify-center overflow-hidden rounded-xl"', 'class={slotClass}', "ad class")
path.write_text(s)

path = Path("src/pages/tools/[category]/[slug].astro")
s = path.read_text()
s = replace_once(s,
'  <article class="mx-auto w-full max-w-[84rem] px-4 py-5 sm:px-5 lg:px-6 lg:py-6">',
'''  <div class="mx-auto grid w-full grid-cols-1 px-4 py-5 sm:px-5 lg:px-6 lg:py-6 min-[1700px]:max-w-[1616px] min-[1700px]:grid-cols-[160px_minmax(0,1240px)_160px] min-[1700px]:gap-7">
    <div class="hidden min-[1700px]:block"><AdSlot placement="tool-side-left" minHeight={600} variant="side-rail" /></div>
    <article class="min-w-0 w-full max-w-[84rem] justify-self-center min-[1700px]:max-w-[77.5rem]">''',
"route open")
s = replace_once(s,
'    {!expansionToolSlugs.has(tool.slug) && tool.category === "text" && <TextToolWorkspace mode={tool.slug} />}',
'    {!newTextToolSlugs.has(tool.slug) && !expansionToolSlugs.has(tool.slug) && tool.category === "text" && <TextToolWorkspace mode={tool.slug} />}',
"duplicate workspace")
s = replace_once(s,
'  </article>\n</BaseLayout>',
'''    </article>
    <div class="hidden min-[1700px]:block"><AdSlot placement="tool-side-right" minHeight={600} variant="side-rail" /></div>
  </div>
</BaseLayout>''',
"route close")
path.write_text(s)

print("Applied equal workspace heights and AdSense-ready side rails.")
