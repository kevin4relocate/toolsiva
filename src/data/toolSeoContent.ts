import type { ToolDefinition } from "@/types/tool";
import toolUsageNotes from "@/data/toolUsageNotes.json";
import simpleToolQueue from "@/data/simpleToolQueue.json";
import extraToolGuides from "@/data/extraSimpleToolGuides.json";
import wave3ToolGuides from "@/data/wave3ToolGuides.json";
import wave4ToolGuides from "@/data/wave4ToolGuides.json";
import wave5ToolGuides from "@/data/wave5ToolGuides.json";

export interface ToolExample { input: string; output: string; }
export interface ToolContentSection { heading: string; paragraphs: string[]; }
export interface PriorityToolContent {
  overview: string[];
  example: ToolExample;
  useCases: string[];
  tips: string[];
}

const priorityToolContent: Record<string, PriorityToolContent> = {
  "word-counter": {
    "overview": [
      "Word Counter helps you count words, characters, sentences and paragraphs while you edit.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Toolsiva provides fast private tools.",
      "output": "Words: 5\nCharacters: 37\nSentences: 1\nParagraphs: 1"
    },
    "useCases": [
      "Check article limits",
      "Measure assignments",
      "Review product copy",
      "Compare drafts"
    ],
    "tips": [
      "Hyphenated words may be counted differently by other editors.",
      "Use the no-spaces count for strict character limits."
    ]
  },
  "character-counter": {
    "overview": [
      "Character Counter helps you measure text length with and without spaces in real time.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Hello Toolsiva!",
      "output": "With spaces: 15\nWithout spaces: 14"
    },
    "useCases": [
      "Check social post limits",
      "Prepare SEO metadata",
      "Validate form fields",
      "Measure SMS drafts"
    ],
    "tips": [
      "Line breaks and punctuation count as characters.",
      "Confirm the destination platform's exact rules."
    ]
  },
  "case-converter": {
    "overview": [
      "Case Converter helps you convert text to uppercase, lowercase, title case, sentence case and more.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "welcome TO toolsiva",
      "output": "Title Case: Welcome To Toolsiva\nSentence case: Welcome to toolsiva"
    },
    "useCases": [
      "Normalize copied text",
      "Prepare headings",
      "Fix caps lock",
      "Standardize names"
    ],
    "tips": [
      "Review proper nouns after automatic conversion.",
      "Keep an original copy of long text."
    ]
  },
  "json-formatter": {
    "overview": [
      "JSON Formatter helps you format compact JSON with indentation and line breaks for easier inspection.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "{\"name\":\"Toolsiva\",\"tools\":123}",
      "output": "{\n  \"name\": \"Toolsiva\",\n  \"tools\": 123\n}"
    },
    "useCases": [
      "Read API responses",
      "Review configuration",
      "Inspect test fixtures",
      "Prepare documentation"
    ],
    "tips": [
      "Formatting does not fix invalid JSON.",
      "Avoid pasting secrets into untrusted environments."
    ]
  },
  "json-validator": {
    "overview": [
      "JSON Validator helps you check JSON syntax and identify errors that prevent parsing.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "{\"name\":\"Toolsiva\",}",
      "output": "Invalid JSON: trailing comma"
    },
    "useCases": [
      "Debug API payloads",
      "Check configuration",
      "Validate test data",
      "Review imports"
    ],
    "tips": [
      "JSON strings require double quotes.",
      "Valid syntax does not guarantee correct business data."
    ]
  },
  "base64-encode": {
    "overview": [
      "Base64 Encoder helps you convert text into Base64 for transport, testing and integration work.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Toolsiva",
      "output": "VG9vbHNpdmE="
    },
    "useCases": [
      "Prepare test payloads",
      "Encode transport values",
      "Create samples",
      "Compare systems"
    ],
    "tips": [
      "Base64 is encoding, not encryption.",
      "UTF-8 is the usual text encoding."
    ]
  },
  "base64-decode": {
    "overview": [
      "Base64 Decoder helps you convert Base64 text back into readable content when the value represents text.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "VG9vbHNpdmE=",
      "output": "Toolsiva"
    },
    "useCases": [
      "Inspect API values",
      "Decode fixtures",
      "Check auth samples",
      "Verify encoded data"
    ],
    "tips": [
      "Treat decoded content as untrusted.",
      "Some Base64 values represent binary data."
    ]
  },
  "uuid-generator": {
    "overview": [
      "UUID Generator helps you generate unique identifiers for development, databases and test data.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Generate 2 UUIDs",
      "output": "550e8400-e29b-41d4-a716-446655440000\n6ba7b810-9dad-41d1-80b4-00c04fd430c8"
    },
    "useCases": [
      "Create test records",
      "Generate correlation IDs",
      "Prepare fixtures",
      "Assign references"
    ],
    "tips": [
      "A UUID is not a secret.",
      "Use the version required by the target system."
    ]
  },
  "password-generator": {
    "overview": [
      "Password Generator helps you create randomized passwords using selected length and character options.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Length: 20\nAll character groups",
      "output": "vQ7!m2#L9@pR4$kT8&zN"
    },
    "useCases": [
      "Create account passwords",
      "Generate temporary credentials",
      "Prepare test users",
      "Replace reused passwords"
    ],
    "tips": [
      "Store passwords in a reputable password manager.",
      "Enable multi-factor authentication."
    ]
  },
  "qr-url-generator": {
    "overview": [
      "QR URL Generator helps you turn a web address into a scannable QR code for print or screen.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "https://toolsiva.com",
      "output": "QR code opening https://toolsiva.com"
    },
    "useCases": [
      "Share landing pages",
      "Add links to posters",
      "Open links on mobile",
      "Connect packaging to web content"
    ],
    "tips": [
      "Use a stable HTTPS URL.",
      "Test the final QR code on multiple devices."
    ]
  },
  "percentage-calculator": {
    "overview": [
      "Percentage Calculator helps you calculate percentages, portions and percentage relationships.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "15% of 240",
      "output": "36"
    },
    "useCases": [
      "Calculate discounts",
      "Measure completion",
      "Compare portions",
      "Check reports"
    ],
    "tips": [
      "Confirm which value is the base.",
      "Keep enough precision for later calculations."
    ]
  },
  "discount-calculator": {
    "overview": [
      "Discount Calculator helps you estimate savings and final price from an original price and discount rate.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Original: 200\nDiscount: 25%",
      "output": "Savings: 50\nFinal price: 150"
    },
    "useCases": [
      "Compare promotions",
      "Estimate sale prices",
      "Check coupon value",
      "Plan pricing"
    ],
    "tips": [
      "Taxes and fees may be separate.",
      "Apply multiple discounts sequentially."
    ]
  },
  "age-calculator": {
    "overview": [
      "Age Calculator reports completed years from a date of birth to the current browser date; it does not separately report elapsed months or days.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Birth: 2000-01-01; today: 2026-01-01",
      "output": "26 years"
    },
    "useCases": [
      "Check age on a date",
      "Calculate elapsed time",
      "Prepare records",
      "Compare dates"
    ],
    "tips": [
      "Enter dates in the correct format.",
      "Confirm official eligibility with the responsible authority."
    ]
  },
  "bmi-calculator": {
    "overview": [
      "BMI Calculator helps you estimate body mass index from height and weight as a general screening value.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "70 kg\n175 cm",
      "output": "BMI: 22.9"
    },
    "useCases": [
      "Estimate BMI",
      "Track changes",
      "Prepare for a health discussion",
      "Compare measurements"
    ],
    "tips": [
      "BMI is not a diagnosis.",
      "Discuss health concerns with a qualified professional."
    ]
  },
  "loan-calculator": {
    "overview": [
      "Loan Calculator helps you estimate periodic payments and total interest from loan amount, rate and term.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Loan: 10,000\nRate: 6%\nTerm: 3 years",
      "output": "Monthly payment: about 304.22\nTotal interest: about 951.92"
    },
    "useCases": [
      "Compare loan terms",
      "Estimate affordability",
      "Explore rate changes",
      "Plan repayment"
    ],
    "tips": [
      "Actual lender terms may include fees.",
      "This estimate is not financial advice."
    ]
  },
  "length-converter": {
    "overview": [
      "Length Converter helps you convert between common metric, imperial and US customary length units.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "1 meter",
      "output": "100 centimeters\n3.28084 feet\n39.3701 inches"
    },
    "useCases": [
      "Convert dimensions",
      "Compare systems",
      "Prepare shipping info",
      "Check estimates"
    ],
    "tips": [
      "Confirm required precision.",
      "Technical work may need authoritative standards."
    ]
  },
  "weight-converter": {
    "overview": [
      "Weight Converter helps you convert between kilograms, grams, pounds, ounces and other common units.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "10 kilograms",
      "output": "22.0462 pounds\n352.74 ounces\n10,000 grams"
    },
    "useCases": [
      "Compare shipping weights",
      "Convert specifications",
      "Adapt recipes",
      "Check fitness values"
    ],
    "tips": [
      "Use the destination unit.",
      "Avoid excessive rounding."
    ]
  },
  "temperature-converter": {
    "overview": [
      "Temperature Converter helps you convert values between Celsius, Fahrenheit and Kelvin.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "25 °C",
      "output": "77 °F\n298.15 K"
    },
    "useCases": [
      "Compare weather reports",
      "Convert oven settings",
      "Review lab values",
      "Check equipment"
    ],
    "tips": [
      "Kelvin does not use a degree symbol.",
      "Confirm whether rounding is acceptable."
    ]
  },
  "add-bullets-to-text": {
    "overview": [
      "Add Bullets to Text helps you add a selected bullet or custom prefix before every non-empty line.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "Apple\nBanana\nOrange",
      "output": "- Apple\n- Banana\n- Orange"
    },
    "useCases": [
      "Format task lists",
      "Prepare email content",
      "Create Markdown lists",
      "Standardize copied data"
    ],
    "tips": [
      "Choose a supported bullet character.",
      "Use custom prefixes for special formats."
    ]
  },
  "remove-duplicate-lines": {
    "overview": [
      "Remove Duplicate Lines helps you keep the first occurrence of each line and remove repeats while preserving order.",
      "It works directly in the browser and is designed for quick, focused tasks without requiring an account."
    ],
    "example": {
      "input": "apple\nbanana\napple\norange\nbanana",
      "output": "apple\nbanana\norange"
    },
    "useCases": [
      "Clean mailing lists",
      "Remove repeated IDs",
      "Prepare unique test data",
      "Deduplicate reports"
    ],
    "tips": [
      "Decide whether case should make lines different.",
      "Keep the source until the result is reviewed."
    ]
  }
};

export function getToolGuideCoverage() {
  return {
    prioritySlugs: Object.keys(priorityToolContent),
    usageSlugs: Object.keys(toolUsageNotes),
  };
}

export function getPriorityToolContent(slug: string): PriorityToolContent | undefined {
  return priorityToolContent[slug];
}

export function getToolContentSections(tool: ToolDefinition): ToolContentSection[] {
  const custom = priorityToolContent[tool.slug];
  if (custom) return [
    { heading: `What is ${tool.name}?`, paragraphs: custom.overview },
    { heading: `When to use ${tool.name}`, paragraphs: [
      `Common uses include ${custom.useCases.slice(0,2).join(" and ").toLowerCase()}.`,
      `It can also help with ${custom.useCases.slice(2).join(" and ").toLowerCase()}.`
    ] },
    { heading: "Practical tips", paragraphs: custom.tips },
    { heading: "Privacy and processing", paragraphs: [
      "This tool processes its working input in your browser and does not intentionally upload it to a Toolsiva application server.",
      "Avoid entering confidential material when your browser, device, extensions or clipboard environment is not trusted."
    ] }
  ];

  // Every current tool has either an independently prepared example or
  // task-specific usage guidance. Avoid repeating generic "SEO" paragraphs.
  const note = toolUsageNotes[tool.slug as keyof typeof toolUsageNotes];
  if (note) {
    return [
      { heading: `How ${tool.name} works`, paragraphs: [
        note.how,
      ] },
      { heading: "Try this", paragraphs: [note.tryThis] },
      { heading: "Before using the result", paragraphs: [note.watch] },
    ];
  }

  const wave5 = wave5ToolGuides[tool.slug as keyof typeof wave5ToolGuides];
  if (wave5) return [
    { heading: `What is ${tool.name}?`, paragraphs: [
      wave5.explanation,
      `Try this input: ${wave5.example.replaceAll("\\n", " | ").slice(0, 180)}.`
    ] },
    { heading: `How to use ${tool.name}`, paragraphs: wave5.workflows },
    { heading: "Results and limitations", paragraphs: [
      wave5.limitation,
      "This tool processes pasted text or values inside your browser, without local file access or paid APIs."
    ] },
  ];

  const wave4 = wave4ToolGuides[tool.slug as keyof typeof wave4ToolGuides];
  if (wave4) return [
    { heading: `What does ${tool.name} do?`, paragraphs: [
      wave4.explanation,
      `Example: ${wave4.example.replaceAll("\\n", " | ").slice(0, 210)}.`,
    ] },
    { heading: `How to use ${tool.name}`, paragraphs: wave4.workflows },
    { heading: "Accuracy and appropriate use", paragraphs: [
      wave4.limitation,
      "Toolsiva processes pasted text and values in your browser; no files, images, paid APIs or external conversion services are required.",
    ] },
  ];

  const wave3 = wave3ToolGuides[tool.slug as keyof typeof wave3ToolGuides];
  if (wave3) return [
    { heading: `What is ${tool.name}?`, paragraphs: [
      wave3.explanation,
      `Sample input: ${wave3.example.replaceAll("\\n", " | ").slice(0, 200)}.`,
    ] },
    { heading: `How to use ${tool.name}`, paragraphs: wave3.workflows },
    { heading: "Accuracy and limitations", paragraphs: [
      wave3.limitation,
      "Results are produced from your browser input. No local files are opened and no external processing API is contacted.",
    ] },
  ];

  const extra = extraToolGuides[tool.slug as keyof typeof extraToolGuides];
  if (extra) return [
    { heading: `What is ${tool.name}?`, paragraphs: [
      extra.explanation,
      `Try this sample input: ${extra.example.replaceAll("\\n", " | ").slice(0, 200)}.`,
    ] },
    { heading: `How to use ${tool.name}`, paragraphs: extra.workflows },
    { heading: "Limitations and accuracy", paragraphs: [
      extra.limitation,
      "Inputs are processed inside your browser. The tool neither opens local files nor sends the submitted text to an external conversion or AI service.",
    ] },
  ];

  const scheduled = simpleToolQueue.find((item) => item.slug === tool.slug);
  if (scheduled) return [
    { heading: `What does ${tool.name} do?`, paragraphs: [
      `${tool.name} works with typed or pasted input directly in your browser. It does not require uploading a document or connecting an account.`,
      `For a quick starting point, enter: ${scheduled.example.replaceAll("\\n", " | ").slice(0, 180)}.`,
    ] },
    { heading: "How to get a useful result", paragraphs: [
      "Use the Load example button to inspect the expected input format, then replace the example with your own values or text.",
      "The result updates while you type. Copy the result as text when it matches your intended output.",
    ] },
    { heading: "Important limitations", paragraphs: [
      `Check the input format and review the returned ${tool.name.toLowerCase()} result before relying on it for financial, technical, or publishing decisions.`,
      "This is a focused browser utility. It does not upload files, retrieve live external information, or validate against private systems.",
    ] },
  ];

  // Future catalog additions remain usable until their guide is authored.
  // CI warns about absent coverage so the content is not left generic.
  return [
    { heading: `About ${tool.name}`, paragraphs: [tool.shortDescription] },
  ];
}
