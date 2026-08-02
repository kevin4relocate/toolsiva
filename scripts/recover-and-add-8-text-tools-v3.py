from pathlib import Path
import subprocess, json, re

BASE_COMMIT = "bd18760"
restore_paths = [
    "src/data/tools.ts",
    "src/components/tools/ExpansionToolWorkspace.astro",
    "src/pages/tools/[category]/[slug].astro",
    "scripts/verify-deduplicate-tool-catalog-v2.mjs",
]

for path in restore_paths:
    content = subprocess.check_output(["git", "show", f"{BASE_COMMIT}:{path}"])
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_bytes(content)
    print(f"Restored {path} from {BASE_COMMIT}")

tools = [
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

tools_path = Path("src/data/tools.ts")
source = tools_path.read_text(encoding="utf-8")
existing = set(re.findall(r'(?:slug|["\']slug["\'])\s*:\s*["\']([^"\']+)["\']', source))
missing = [tool for tool in tools if tool["slug"] not in existing]

end = source.rfind("];")
if end < 0:
    raise SystemExit("Could not find tools array end.")
head = source[:end].rstrip()
separator = "" if head.endswith(",") else ","
block = ",\n  ".join(json.dumps(tool, ensure_ascii=False, indent=2).replace("\n", "\n  ") for tool in missing)
source = f"{head}{separator}\n  {block}\n];{source[end+2:]}"
tools_path.write_text(source, encoding="utf-8")
print(f"Added {len(missing)} new tools.")

route_path = Path("src/pages/tools/[category]/[slug].astro")
route = route_path.read_text(encoding="utf-8")

import_line = 'import NewTextToolsWorkspace from "@/components/tools/NewTextToolsWorkspace.astro";'
marker = 'import ExpansionToolWorkspace from "@/components/tools/ExpansionToolWorkspace.astro";'
if import_line not in route:
    if marker not in route:
        raise SystemExit("Expansion workspace import marker not found.")
    route = route.replace(marker, marker + "\n" + import_line, 1)

new_slugs = [tool["slug"] for tool in tools]
set_line = "const newTextToolSlugs = new Set(" + json.dumps(new_slugs, ensure_ascii=False) + ");"
if "const newTextToolSlugs" not in route:
    anchor = "const expansionToolSlugs = new Set("
    idx = route.find(anchor)
    if idx < 0:
        raise SystemExit("expansionToolSlugs not found after restore.")
    line_end = route.find("\n", idx)
    route = route[:line_end+1] + set_line + "\n" + route[line_end+1:]

render_line = '    {newTextToolSlugs.has(tool.slug) && <NewTextToolsWorkspace mode={tool.slug} />}'
if "<NewTextToolsWorkspace" not in route:
    anchor = '    {expansionToolSlugs.has(tool.slug) && <ExpansionToolWorkspace mode={tool.slug} />}'
    if anchor not in route:
        raise SystemExit("Expansion workspace render marker not found.")
    route = route.replace(anchor, render_line + "\n" + anchor, 1)

route_path.write_text(route, encoding="utf-8")
print("Connected new text tools route.")

verifier_path = Path("scripts/verify-deduplicate-tool-catalog-v2.mjs")
verifier = verifier_path.read_text(encoding="utf-8")
verifier = verifier.replace('["20 text tools remain", categoryCounts.text === 20]', '["28 text tools remain", categoryCounts.text === 28]')
verifier = verifier.replace('["Exactly 100 unique tools", slugCounts.size === 100]', '["Exactly 108 unique tools", slugCounts.size === 108]')
verifier_path.write_text(verifier, encoding="utf-8")
print("Updated catalog verifier.")
