from pathlib import Path
import json, re

TOOLS = [
  {
    "slug": "add-bullets-to-text",
    "category": "text",
    "name": "Add Bullets to Text",
    "shortDescription": "Add a bullet or custom prefix to every non-empty line.",
    "metaDescription": "Add a bullet or custom prefix to every non-empty line. Free online tool with private browser-based processing.",
    "keywords": [
      "add bullets to text",
      "add bullets to text",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Add Bullets to Text free to use?",
        "answer": "Yes. Add Bullets to Text is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "add-blank-lines-between-text",
    "category": "text",
    "name": "Add Blank Lines Between Text",
    "shortDescription": "Insert a chosen number of blank lines between text lines.",
    "metaDescription": "Insert a chosen number of blank lines between text lines. Free online tool with private browser-based processing.",
    "keywords": [
      "add blank lines between text",
      "add blank lines between text",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Add Blank Lines Between Text free to use?",
        "answer": "Yes. Add Blank Lines Between Text is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "add-prefix-suffix-to-lines",
    "category": "text",
    "name": "Add Prefix and Suffix to Lines",
    "shortDescription": "Add custom text before and after every line.",
    "metaDescription": "Add custom text before and after every line. Free online tool with private browser-based processing.",
    "keywords": [
      "add prefix and suffix to lines",
      "add prefix suffix to lines",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Add Prefix and Suffix to Lines free to use?",
        "answer": "Yes. Add Prefix and Suffix to Lines is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "trim-each-line",
    "category": "text",
    "name": "Trim Each Line",
    "shortDescription": "Remove leading and trailing whitespace from every line.",
    "metaDescription": "Remove leading and trailing whitespace from every line. Free online tool with private browser-based processing.",
    "keywords": [
      "trim each line",
      "trim each line",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Trim Each Line free to use?",
        "answer": "Yes. Trim Each Line is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "quote-each-line",
    "category": "text",
    "name": "Quote Each Line",
    "shortDescription": "Wrap every line in quotes or custom characters.",
    "metaDescription": "Wrap every line in quotes or custom characters. Free online tool with private browser-based processing.",
    "keywords": [
      "quote each line",
      "quote each line",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Quote Each Line free to use?",
        "answer": "Yes. Quote Each Line is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "remove-line-numbers",
    "category": "text",
    "name": "Remove Line Numbers",
    "shortDescription": "Remove common numeric prefixes from the beginning of lines.",
    "metaDescription": "Remove common numeric prefixes from the beginning of lines. Free online tool with private browser-based processing.",
    "keywords": [
      "remove line numbers",
      "remove line numbers",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Remove Line Numbers free to use?",
        "answer": "Yes. Remove Line Numbers is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "extract-emails-from-text",
    "category": "text",
    "name": "Extract Emails from Text",
    "shortDescription": "Find email addresses and optionally remove duplicates.",
    "metaDescription": "Find email addresses and optionally remove duplicates. Free online tool with private browser-based processing.",
    "keywords": [
      "extract emails from text",
      "extract emails from text",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Extract Emails from Text free to use?",
        "answer": "Yes. Extract Emails from Text is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "extract-urls-from-text",
    "category": "text",
    "name": "Extract URLs from Text",
    "shortDescription": "Find web links in text and optionally remove duplicates.",
    "metaDescription": "Find web links in text and optionally remove duplicates. Free online tool with private browser-based processing.",
    "keywords": [
      "extract urls from text",
      "extract urls from text",
      "free online text tool"
    ],
    "relatedTools": [
      "add-line-numbers",
      "remove-empty-lines",
      "text-to-list"
    ],
    "faq": [
      {
        "question": "Is Extract URLs from Text free to use?",
        "answer": "Yes. Extract URLs from Text is free and requires no account."
      },
      {
        "question": "Is my text uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  }
]
SLUGS = [tool["slug"] for tool in TOOLS]

tools_path = Path("src/data/tools.ts")
source = tools_path.read_text(encoding="utf-8")
existing = set(re.findall(r'(?:slug|["\\\']slug["\\\'])\\s*:\\s*["\\\']([^"\\\']+)["\\\']', source))
missing = [tool for tool in TOOLS if tool["slug"] not in existing]

if missing:
    end = source.rfind("];")
    if end < 0:
        raise SystemExit("Could not find tools array end.")
    head = source[:end].rstrip()
    separator = "" if head.endswith(",") else ","
    block = ",\\n  ".join(json.dumps(tool, ensure_ascii=False, indent=2).replace("\\n", "\\n  ") for tool in missing)
    source = f"{head}{separator}\\n  {block}\\n];{source[end+2:]}"
    tools_path.write_text(source, encoding="utf-8")
print(f"Added {len(missing)} new text tools.")

component_path = Path("src/components/tools/ExpansionToolWorkspace.astro")
component = component_path.read_text(encoding="utf-8")

for slug in SLUGS:
    token = f'"{slug}"'
    if token not in component:
        marker = '"whitespace-visualizer",'
        if marker not in component:
            raise SystemExit("Text mode marker not found.")
        component = component.replace(marker, marker + token + ",", 1)

options_code = '      if(mode==="add-bullets-to-text")options!.innerHTML=\'<label class="text-xs text-zinc-400">Bullet <select data-opt="bullet" class="ml-2 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"><option>-</option><option>•</option><option>◦</option><option>▪</option><option>✓</option><option>→</option><option>*</option></select></label><label class="text-xs text-zinc-400">Custom <input data-opt="customBullet" placeholder="Optional" class="ml-2 w-28 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"></label>\';\n      if(mode==="add-blank-lines-between-text")options!.innerHTML=\'<label class="text-xs text-zinc-400">Blank lines <input data-opt="blankCount" type="number" min="0" max="20" value="1" class="ml-2 w-20 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"></label>\';\n      if(mode==="add-prefix-suffix-to-lines")options!.innerHTML=\'<label class="text-xs text-zinc-400">Prefix <input data-opt="prefix" class="ml-2 w-28 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"></label><label class="text-xs text-zinc-400">Suffix <input data-opt="suffix" class="ml-2 w-28 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"></label>\';\n      if(mode==="quote-each-line")options!.innerHTML=\'<label class="text-xs text-zinc-400">Quote <select data-opt="quoteStyle" class="ml-2 rounded-lg border border-white/10 bg-zinc-950 px-2 py-1.5"><option value="double">Double</option><option value="single">Single</option><option value="backtick">Backtick</option></select></label>\';\n      if(mode==="extract-emails-from-text"||mode==="extract-urls-from-text")options!.innerHTML=\'<label class="text-xs text-zinc-400"><input data-opt="uniqueOnly" type="checkbox" checked class="mr-1.5">Remove duplicates</label>\';\n'
if 'if(mode==="add-bullets-to-text")options!' not in component:
    anchor = '      if(mode==="text-repeater")options!.innerHTML='
    if anchor not in component:
        raise SystemExit("Options anchor not found.")
    component = component.replace(anchor, options_code + "\\n" + anchor, 1)

logic_code = '        if(mode==="add-bullets-to-text"){const bullet=opt("customBullet","")||opt("bullet","-");result=lines.map(line=>line.trim()?bullet+" "+line:line).join("\\n");m.push(["Lines formatted",String(lines.filter(line=>line.trim()).length)])}\n        if(mode==="add-blank-lines-between-text"){const count=Math.min(20,Math.max(0,Number.parseInt(opt("blankCount","1"),10)||0));result=lines.join("\\n".repeat(count+1));m.push(["Blank lines",String(count)])}\n        if(mode==="add-prefix-suffix-to-lines"){const prefix=opt("prefix",""),suffix=opt("suffix","");result=lines.map(line=>line.trim()?prefix+line+suffix:line).join("\\n")}\n        if(mode==="trim-each-line"){result=lines.map(line=>line.trim()).join("\\n");m.push(["Characters removed",String(Math.max(0,text.length-result.length))])}\n        if(mode==="quote-each-line"){const style=opt("quoteStyle","double");const quote=style==="single"?"\'":style==="backtick"?"`":"\\"";result=lines.map(line=>quote+line+quote).join("\\n")}\n        if(mode==="remove-line-numbers"){result=lines.map(line=>line.replace(/^\\s*(?:\\d+[.)\\]:-]|\\(\\d+\\))\\s*/,"")).join("\\n")}\n        if(mode==="extract-emails-from-text"){let items=text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi)??[];if(root.querySelector<HTMLInputElement>(\'[data-opt="uniqueOnly"]\')?.checked??true)items=[...new Set(items.map(item=>item.toLowerCase()))];result=items.join("\\n");m.push(["Emails found",String(items.length)])}\n        if(mode==="extract-urls-from-text"){let items=text.match(/(?:https?:\\/\\/|www\\.)[^\\s<>"\']+/gi)??[];items=items.map(item=>item.replace(/[),.;!?]+$/,""));if(root.querySelector<HTMLInputElement>(\'[data-opt="uniqueOnly"]\')?.checked??true)items=[...new Set(items)];result=items.join("\\n");m.push(["URLs found",String(items.length)])}\n'
if 'if(mode==="add-bullets-to-text"){' not in component:
    anchor = '        if(mode==="whitespace-visualizer"){'
    index = component.find(anchor)
    if index < 0:
        raise SystemExit("Logic anchor not found.")
    line_end = component.find("\\n", index)
    if line_end < 0:
        raise SystemExit("Could not locate whitespace visualizer line end.")
    component = component[:line_end+1] + logic_code + component[line_end+1:]

component_path.write_text(component, encoding="utf-8")
print("Updated ExpansionToolWorkspace.")

route_path = Path("src/pages/tools/[category]/[slug].astro")
route = route_path.read_text(encoding="utf-8")
match = re.search(r'const expansionToolSlugs = new Set\\((\\[[^;]+\\])\\);', route)
if not match:
    raise SystemExit("expansionToolSlugs not found.")
route_slugs = json.loads(match.group(1))
for slug in SLUGS:
    if slug not in route_slugs:
        route_slugs.append(slug)
replacement = "const expansionToolSlugs = new Set(" + json.dumps(route_slugs, ensure_ascii=False) + ");"
route = route[:match.start()] + replacement + route[match.end():]
route_path.write_text(route, encoding="utf-8")
print("Connected 8 new tool routes.")
