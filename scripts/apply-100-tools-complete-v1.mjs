import fs from "node:fs";

const records = [
  {
    "slug": "line-counter",
    "category": "text",
    "name": "Line Counter",
    "shortDescription": "Count total, non-empty and empty lines in text.",
    "metaDescription": "Count total, non-empty and empty lines in text. Free online tool with private browser-based processing.",
    "keywords": [
      "line counter",
      "line counter",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Line Counter free?",
        "answer": "Yes. Line Counter is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "sentence-counter",
    "category": "text",
    "name": "Sentence Counter",
    "shortDescription": "Count sentences and estimate average sentence length.",
    "metaDescription": "Count sentences and estimate average sentence length. Free online tool with private browser-based processing.",
    "keywords": [
      "sentence counter",
      "sentence counter",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Sentence Counter free?",
        "answer": "Yes. Sentence Counter is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "paragraph-counter",
    "category": "text",
    "name": "Paragraph Counter",
    "shortDescription": "Count paragraphs and words per paragraph.",
    "metaDescription": "Count paragraphs and words per paragraph. Free online tool with private browser-based processing.",
    "keywords": [
      "paragraph counter",
      "paragraph counter",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Paragraph Counter free?",
        "answer": "Yes. Paragraph Counter is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "text-to-list",
    "category": "text",
    "name": "Text to List Converter",
    "shortDescription": "Convert separated text into a clean line-by-line list.",
    "metaDescription": "Convert separated text into a clean line-by-line list. Free online tool with private browser-based processing.",
    "keywords": [
      "text to list converter",
      "text to list",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Text to List Converter free?",
        "answer": "Yes. Text to List Converter is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "list-to-text",
    "category": "text",
    "name": "List to Text Converter",
    "shortDescription": "Join list items with commas, spaces or custom separators.",
    "metaDescription": "Join list items with commas, spaces or custom separators. Free online tool with private browser-based processing.",
    "keywords": [
      "list to text converter",
      "list to text",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is List to Text Converter free?",
        "answer": "Yes. List to Text Converter is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "remove-empty-lines",
    "category": "text",
    "name": "Remove Empty Lines",
    "shortDescription": "Delete blank lines while preserving text order.",
    "metaDescription": "Delete blank lines while preserving text order. Free online tool with private browser-based processing.",
    "keywords": [
      "remove empty lines",
      "remove empty lines",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Remove Empty Lines free?",
        "answer": "Yes. Remove Empty Lines is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "add-line-numbers",
    "category": "text",
    "name": "Add Line Numbers",
    "shortDescription": "Add configurable numbers to every line of text.",
    "metaDescription": "Add configurable numbers to every line of text. Free online tool with private browser-based processing.",
    "keywords": [
      "add line numbers",
      "add line numbers",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Add Line Numbers free?",
        "answer": "Yes. Add Line Numbers is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "strip-html-tags",
    "category": "text",
    "name": "Strip HTML Tags",
    "shortDescription": "Remove HTML tags and keep readable text content.",
    "metaDescription": "Remove HTML tags and keep readable text content. Free online tool with private browser-based processing.",
    "keywords": [
      "strip html tags",
      "strip html tags",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Strip HTML Tags free?",
        "answer": "Yes. Strip HTML Tags is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "text-repeater",
    "category": "text",
    "name": "Text Repeater",
    "shortDescription": "Repeat text a chosen number of times with a separator.",
    "metaDescription": "Repeat text a chosen number of times with a separator. Free online tool with private browser-based processing.",
    "keywords": [
      "text repeater",
      "text repeater",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Text Repeater free?",
        "answer": "Yes. Text Repeater is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "whitespace-visualizer",
    "category": "text",
    "name": "Whitespace Visualizer",
    "shortDescription": "Reveal spaces, tabs and line breaks in text.",
    "metaDescription": "Reveal spaces, tabs and line breaks in text. Free online tool with private browser-based processing.",
    "keywords": [
      "whitespace visualizer",
      "whitespace visualizer",
      "free online tool"
    ],
    "relatedTools": [
      "word-counter",
      "remove-extra-spaces",
      "text-compare"
    ],
    "faq": [
      {
        "question": "Is Whitespace Visualizer free?",
        "answer": "Yes. Whitespace Visualizer is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "ratio-calculator",
    "category": "calculator",
    "name": "Ratio Calculator",
    "shortDescription": "Simplify ratios and calculate equivalent values.",
    "metaDescription": "Simplify ratios and calculate equivalent values. Free online tool with private browser-based processing.",
    "keywords": [
      "ratio calculator",
      "ratio calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Ratio Calculator free?",
        "answer": "Yes. Ratio Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "proportion-calculator",
    "category": "calculator",
    "name": "Proportion Calculator",
    "shortDescription": "Solve a missing value in an equivalent proportion.",
    "metaDescription": "Solve a missing value in an equivalent proportion. Free online tool with private browser-based processing.",
    "keywords": [
      "proportion calculator",
      "proportion calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Proportion Calculator free?",
        "answer": "Yes. Proportion Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "fraction-calculator",
    "category": "calculator",
    "name": "Fraction Calculator",
    "shortDescription": "Add, subtract, multiply or divide two fractions.",
    "metaDescription": "Add, subtract, multiply or divide two fractions. Free online tool with private browser-based processing.",
    "keywords": [
      "fraction calculator",
      "fraction calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Fraction Calculator free?",
        "answer": "Yes. Fraction Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "gcd-lcm-calculator",
    "category": "calculator",
    "name": "GCD and LCM Calculator",
    "shortDescription": "Find the greatest common divisor and least common multiple.",
    "metaDescription": "Find the greatest common divisor and least common multiple. Free online tool with private browser-based processing.",
    "keywords": [
      "gcd and lcm calculator",
      "gcd lcm calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is GCD and LCM Calculator free?",
        "answer": "Yes. GCD and LCM Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "pace-calculator",
    "category": "calculator",
    "name": "Pace Calculator",
    "shortDescription": "Calculate pace and speed from distance and time.",
    "metaDescription": "Calculate pace and speed from distance and time. Free online tool with private browser-based processing.",
    "keywords": [
      "pace calculator",
      "pace calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Pace Calculator free?",
        "answer": "Yes. Pace Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "unit-price-calculator",
    "category": "calculator",
    "name": "Unit Price Calculator",
    "shortDescription": "Compare product prices by quantity or weight.",
    "metaDescription": "Compare product prices by quantity or weight. Free online tool with private browser-based processing.",
    "keywords": [
      "unit price calculator",
      "unit price calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Unit Price Calculator free?",
        "answer": "Yes. Unit Price Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "profit-margin-calculator",
    "category": "calculator",
    "name": "Profit Margin Calculator",
    "shortDescription": "Calculate profit, margin and selling price.",
    "metaDescription": "Calculate profit, margin and selling price. Free online tool with private browser-based processing.",
    "keywords": [
      "profit margin calculator",
      "profit margin calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Profit Margin Calculator free?",
        "answer": "Yes. Profit Margin Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  },
  {
    "slug": "markup-calculator",
    "category": "calculator",
    "name": "Markup Calculator",
    "shortDescription": "Calculate markup percentage and selling price from cost.",
    "metaDescription": "Calculate markup percentage and selling price from cost. Free online tool with private browser-based processing.",
    "keywords": [
      "markup calculator",
      "markup calculator",
      "free online tool"
    ],
    "relatedTools": [
      "percentage-calculator",
      "average-calculator",
      "discount-calculator"
    ],
    "faq": [
      {
        "question": "Is Markup Calculator free?",
        "answer": "Yes. Markup Calculator is free and does not require an account."
      },
      {
        "question": "Is my input uploaded?",
        "answer": "No. Processing happens locally in your browser."
      },
      {
        "question": "Does it work on mobile?",
        "answer": "Yes. It works in modern mobile and desktop browsers."
      }
    ]
  }
];
const toolsPath = "src/data/tools.ts";
let source = fs.readFileSync(toolsPath, "utf8");
const existing = new Set([...source.matchAll(/(?:slug|["']slug["'])\s*:\s*["']([^"']+)["']/g)].map(m => m[1]));
const missing = records.filter(tool => !existing.has(tool.slug));

if (missing.length) {
  const end = source.lastIndexOf("];");
  if (end < 0) throw new Error("Could not locate tools array end.");
  const head = source.slice(0, end).trimEnd();
  source = `${head}${head.endsWith(",") ? "" : ","}\n  ${missing.map(tool => JSON.stringify(tool, null, 2).replace(/\n/g, "\n  ")).join(",\n  ")}\n];${source.slice(end + 2)}`;
  fs.writeFileSync(toolsPath, source);
}
console.log(`Added ${missing.length} new tools.`);

const routePath = "src/pages/tools/[category]/[slug].astro";
let route = fs.readFileSync(routePath, "utf8");
const importLine = 'import ExpansionToolWorkspace from "@/components/tools/ExpansionToolWorkspace.astro";';
if (!route.includes(importLine)) {
  const marker = 'import ConverterToolWorkspace from "@/components/tools/ConverterToolWorkspace.astro";';
  if (!route.includes(marker)) throw new Error("Workspace import marker not found.");
  route = route.replace(marker, `${marker}\n${importLine}`);
}
const slugs = records.map(tool => tool.slug);
const setLine = `const expansionToolSlugs = new Set(${JSON.stringify(slugs)});`;
if (!route.includes("const expansionToolSlugs")) {
  const marker = "const instructions = getToolInstructions(tool);";
  if (!route.includes(marker)) throw new Error("Route constant marker not found.");
  route = route.replace(marker, `${marker}\n${setLine}`);
}
if (!route.includes("<ExpansionToolWorkspace mode={tool.slug} />")) {
  const textRender = '    {tool.category === "text" && <TextToolWorkspace mode={tool.slug} />}';
  if (!route.includes(textRender)) throw new Error("Text render marker not found.");
  route = route.replace(textRender,
    '    {expansionToolSlugs.has(tool.slug) && <ExpansionToolWorkspace mode={tool.slug} />}\n' +
    '    {!expansionToolSlugs.has(tool.slug) && tool.category === "text" && <TextToolWorkspace mode={tool.slug} />}'
  );
  route = route.replace(
    '    {tool.category === "calculator" && <CalculatorToolWorkspace mode={tool.slug} />}',
    '    {!expansionToolSlugs.has(tool.slug) && tool.category === "calculator" && <CalculatorToolWorkspace mode={tool.slug} />}'
  );
}
fs.writeFileSync(routePath, route);
console.log("Connected expansion workspace.");
