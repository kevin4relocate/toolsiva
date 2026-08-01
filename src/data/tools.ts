import type { ToolDefinition } from "@/types/tool";

const privacyFaq = {
  question: "Does Toolsiva store my text?",
  answer:
    "No. This tool processes your text inside your browser and does not upload it to a server.",
};

const mobileFaq = {
  question: "Does this tool work on mobile devices?",
  answer: "Yes. The workspace is responsive and works in modern mobile and desktop browsers.",
};

export const tools: ToolDefinition[] = [
  {
    slug: "word-counter",
    category: "text",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences and paragraphs instantly.",
    metaDescription:
      "Count words, characters, sentences and paragraphs online. Your text stays private and is processed entirely in your browser.",
    keywords: ["word counter", "character counter", "sentence counter", "paragraph counter"],
    featured: true,
    relatedTools: ["character-counter", "remove-extra-spaces", "text-compare"],
    faq: [
      privacyFaq,
      {
        question: "What does the counter include?",
        answer:
          "It reports words, characters with spaces, characters without spaces, sentences and non-empty paragraphs.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "character-counter",
    category: "text",
    name: "Character Counter",
    shortDescription: "Count characters with and without spaces in real time.",
    metaDescription:
      "Count characters online with or without spaces. The text is processed locally in your browser.",
    keywords: ["character counter", "letter counter", "count characters"],
    featured: true,
    relatedTools: ["word-counter", "remove-extra-spaces", "text-compare"],
    faq: [
      privacyFaq,
      {
        question: "Are spaces included in the character count?",
        answer:
          "The tool shows both totals: all characters and characters excluding whitespace.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "case-converter",
    category: "text",
    name: "Case Converter",
    shortDescription: "Convert text to uppercase, lowercase, title case and sentence case.",
    metaDescription:
      "Convert text to uppercase, lowercase, title case or sentence case online without uploading your content.",
    keywords: ["case converter", "uppercase converter", "lowercase converter", "title case"],
    featured: true,
    relatedTools: ["slug-generator", "remove-extra-spaces", "reverse-text"],
    faq: [
      privacyFaq,
      {
        question: "Which text cases are supported?",
        answer: "Uppercase, lowercase, title case and sentence case are included.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "remove-duplicate-lines",
    category: "text",
    name: "Remove Duplicate Lines",
    shortDescription: "Remove repeated lines while preserving the original order.",
    metaDescription:
      "Remove duplicate lines from text online while preserving the first occurrence and original order.",
    keywords: ["remove duplicate lines", "deduplicate text", "unique lines"],
    relatedTools: ["sort-lines", "remove-extra-spaces", "find-and-replace"],
    faq: [
      privacyFaq,
      {
        question: "Does the tool preserve line order?",
        answer: "Yes. The first occurrence is kept and later duplicates are removed.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "sort-lines",
    category: "text",
    name: "Sort Lines",
    shortDescription: "Sort lines alphabetically in ascending or descending order.",
    metaDescription:
      "Sort text lines alphabetically online in ascending or descending order directly in your browser.",
    keywords: ["sort lines", "alphabetize list", "sort text"],
    relatedTools: ["remove-duplicate-lines", "reverse-text", "remove-extra-spaces"],
    faq: [
      privacyFaq,
      {
        question: "Can I sort in descending order?",
        answer: "Yes. Choose ascending or descending before sorting.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "reverse-text",
    category: "text",
    name: "Reverse Text",
    shortDescription: "Reverse characters, words or line order instantly.",
    metaDescription:
      "Reverse text by characters, words or lines online. Processing happens locally in your browser.",
    keywords: ["reverse text", "reverse words", "reverse lines"],
    relatedTools: ["case-converter", "sort-lines", "text-compare"],
    faq: [
      privacyFaq,
      {
        question: "What can be reversed?",
        answer: "You can reverse individual characters, word order or line order.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "remove-extra-spaces",
    category: "text",
    name: "Remove Extra Spaces",
    shortDescription: "Clean repeated spaces, tabs and unnecessary blank lines.",
    metaDescription:
      "Remove extra spaces, tabs and blank lines from text online while keeping your content private.",
    keywords: ["remove extra spaces", "clean whitespace", "trim text"],
    relatedTools: ["word-counter", "case-converter", "find-and-replace"],
    faq: [
      privacyFaq,
      {
        question: "What whitespace is removed?",
        answer:
          "Repeated spaces and tabs are reduced, line edges are trimmed and excessive blank lines are removed.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "find-and-replace",
    category: "text",
    name: "Find and Replace",
    shortDescription: "Find text and replace every matching occurrence.",
    metaDescription:
      "Find and replace text online with optional case-sensitive matching. Your content stays in your browser.",
    keywords: ["find and replace", "replace text", "search replace"],
    relatedTools: ["text-compare", "remove-extra-spaces", "remove-duplicate-lines"],
    faq: [
      privacyFaq,
      {
        question: "Is case-sensitive replacement supported?",
        answer: "Yes. You can enable or disable case-sensitive matching.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "text-compare",
    category: "text",
    name: "Text Compare",
    shortDescription: "Compare two text blocks and identify changed lines.",
    metaDescription:
      "Compare two text blocks online and see matching, removed and added lines without uploading either version.",
    keywords: ["text compare", "compare text", "difference checker", "diff text"],
    relatedTools: ["find-and-replace", "word-counter", "remove-duplicate-lines"],
    faq: [
      privacyFaq,
      {
        question: "How are differences displayed?",
        answer:
          "The result summarizes matching lines and lists lines found only in the first or second text.",
      },
      mobileFaq,
    ],
  },
  {
    slug: "slug-generator",
    category: "text",
    name: "Slug Generator",
    shortDescription: "Turn titles and phrases into clean URL slugs.",
    metaDescription:
      "Generate clean, lowercase URL slugs from titles and phrases directly in your browser.",
    keywords: ["slug generator", "url slug", "seo slug generator"],
    featured: true,
    relatedTools: ["case-converter", "remove-extra-spaces", "find-and-replace"],
    faq: [
      privacyFaq,
      {
        question: "How is a slug created?",
        answer:
          "Text is normalized, converted to lowercase and separated with hyphens while unsupported punctuation is removed.",
      },
      mobileFaq,
    ],
  },

{
  slug: "json-formatter",
  category: "developer",
  name: "JSON Formatter",
  shortDescription: "Format and indent JSON for easier reading.",
  metaDescription:
    "Format and beautify JSON online. Your data stays private and is processed entirely in your browser.",
  keywords: ["json formatter", "json beautifier", "format json"],
  featured: true,
  relatedTools: ["json-validator", "json-minifier", "json-to-csv"],
  faq: [
    privacyFaq,
    {
      question: "What indentation does the formatter use?",
      answer: "The formatted result uses two spaces for each indentation level.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-validator",
  category: "developer",
  name: "JSON Validator",
  shortDescription: "Check whether JSON is valid and locate syntax errors.",
  metaDescription:
    "Validate JSON online and see clear syntax feedback without uploading your data.",
  keywords: ["json validator", "validate json", "json syntax checker"],
  featured: true,
  relatedTools: ["json-formatter", "json-minifier", "json-escape"],
  faq: [
    privacyFaq,
    {
      question: "Does the validator change my JSON?",
      answer: "No. It only checks whether the input can be parsed as valid JSON.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-minifier",
  category: "developer",
  name: "JSON Minifier",
  shortDescription: "Remove whitespace from JSON and create compact output.",
  metaDescription:
    "Minify JSON online by removing unnecessary whitespace while keeping the data unchanged.",
  keywords: ["json minifier", "compress json", "minify json"],
  relatedTools: ["json-formatter", "json-validator", "json-escape"],
  faq: [
    privacyFaq,
    {
      question: "Does minifying JSON change its data?",
      answer: "No. It removes formatting whitespace but preserves the parsed JSON values.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-escape",
  category: "developer",
  name: "JSON Escape",
  shortDescription: "Escape text so it can be safely included in a JSON string.",
  metaDescription: "Escape text for use inside JSON strings directly in your browser.",
  keywords: ["json escape", "escape json string", "json string encoder"],
  relatedTools: ["json-unescape", "json-validator", "base64-encode"],
  faq: [
    privacyFaq,
    {
      question: "What characters are escaped?",
      answer: "Quotes, backslashes, line breaks, tabs and other control characters are escaped.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-unescape",
  category: "developer",
  name: "JSON Unescape",
  shortDescription: "Convert escaped JSON string content back to readable text.",
  metaDescription: "Unescape JSON string content online without sending it to a server.",
  keywords: ["json unescape", "decode json string", "unescape text"],
  relatedTools: ["json-escape", "json-validator", "base64-decode"],
  faq: [
    privacyFaq,
    {
      question: "Should the input include surrounding quotes?",
      answer: "Both quoted JSON strings and raw escaped string content are supported.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-to-csv",
  category: "developer",
  name: "JSON to CSV",
  shortDescription: "Convert an array of JSON objects into CSV.",
  metaDescription:
    "Convert JSON arrays to CSV online. Processing happens locally in your browser.",
  keywords: ["json to csv", "convert json csv", "json array to csv"],
  relatedTools: ["json-formatter", "json-validator", "json-to-xml"],
  faq: [
    privacyFaq,
    {
      question: "What JSON structure is supported?",
      answer:
        "The input should be an array of objects. All discovered object keys become CSV columns.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-to-xml",
  category: "developer",
  name: "JSON to XML",
  shortDescription: "Convert JSON objects and arrays into readable XML.",
  metaDescription: "Convert JSON to XML online with local browser processing.",
  keywords: ["json to xml", "convert json xml", "json xml converter"],
  relatedTools: ["json-formatter", "json-to-csv", "json-to-yaml"],
  faq: [
    privacyFaq,
    {
      question: "How are arrays represented?",
      answer: "Array entries are emitted as repeated item elements.",
    },
    mobileFaq,
  ],
},
{
  slug: "json-to-yaml",
  category: "developer",
  name: "JSON to YAML",
  shortDescription: "Convert JSON data into readable YAML.",
  metaDescription: "Convert JSON to YAML online without uploading your data.",
  keywords: ["json to yaml", "convert json yaml", "json yaml converter"],
  relatedTools: ["json-formatter", "json-to-xml", "json-validator"],
  faq: [
    privacyFaq,
    {
      question: "Does this support nested data?",
      answer: "Yes. Nested objects and arrays are converted with indentation.",
    },
    mobileFaq,
  ],
},
{
  slug: "base64-encode",
  category: "developer",
  name: "Base64 Encode",
  shortDescription: "Encode Unicode text as Base64.",
  metaDescription:
    "Encode text to Base64 online with Unicode support and local browser processing.",
  keywords: ["base64 encode", "text to base64", "base64 encoder"],
  featured: true,
  relatedTools: ["base64-decode", "json-escape", "json-unescape"],
  faq: [
    privacyFaq,
    {
      question: "Does the encoder support Unicode?",
      answer: "Yes. UTF-8 text, including accented characters and emoji, is supported.",
    },
    mobileFaq,
  ],
},
{
  slug: "base64-decode",
  category: "developer",
  name: "Base64 Decode",
  shortDescription: "Decode Base64 into readable Unicode text.",
  metaDescription:
    "Decode Base64 to text online with Unicode support. Your input stays in your browser.",
  keywords: ["base64 decode", "base64 to text", "base64 decoder"],
  featured: true,
  relatedTools: ["base64-encode", "json-unescape", "json-validator"],
  faq: [
    privacyFaq,
    {
      question: "What happens if the Base64 is invalid?",
      answer:
        "The tool shows a clear error message and does not return a misleading result.",
    },
    mobileFaq,
  ],
},

{
  slug: "url-encode",
  category: "developer",
  name: "URL Encode",
  shortDescription: "Encode text for safe use in URLs and query strings.",
  metaDescription:
    "URL encode text online using standard percent encoding. Processing stays in your browser.",
  keywords: ["url encode", "percent encode", "encode uri component"],
  relatedTools: ["url-decode", "html-encode", "base64-encode"],
  faq: [
    privacyFaq,
    {
      question: "What encoding method is used?",
      answer: "The tool uses standard URI component percent encoding.",
    },
    mobileFaq,
  ],
},
{
  slug: "url-decode",
  category: "developer",
  name: "URL Decode",
  shortDescription: "Decode percent-encoded URL text into readable content.",
  metaDescription:
    "Decode URL-encoded text online without sending your data to a server.",
  keywords: ["url decode", "percent decode", "decode uri component"],
  relatedTools: ["url-encode", "html-decode", "base64-decode"],
  faq: [
    privacyFaq,
    {
      question: "What happens with malformed encoding?",
      answer: "The tool displays an error instead of returning an unreliable result.",
    },
    mobileFaq,
  ],
},
{
  slug: "html-encode",
  category: "developer",
  name: "HTML Encode",
  shortDescription: "Convert special characters into HTML entities.",
  metaDescription:
    "Encode text as HTML entities online with local browser processing.",
  keywords: ["html encode", "html entities", "escape html"],
  relatedTools: ["html-decode", "url-encode", "json-escape"],
  faq: [
    privacyFaq,
    {
      question: "Which characters are encoded?",
      answer: "Ampersands, angle brackets, quotes and apostrophes are encoded.",
    },
    mobileFaq,
  ],
},
{
  slug: "html-decode",
  category: "developer",
  name: "HTML Decode",
  shortDescription: "Convert HTML entities back into readable characters.",
  metaDescription:
    "Decode HTML entities online safely inside your browser.",
  keywords: ["html decode", "decode html entities", "unescape html"],
  relatedTools: ["html-encode", "url-decode", "json-unescape"],
  faq: [
    privacyFaq,
    {
      question: "Are named and numeric entities supported?",
      answer: "Yes. The browser decoder supports common named, decimal and hexadecimal entities.",
    },
    mobileFaq,
  ],
},
{
  slug: "xml-formatter",
  category: "developer",
  name: "XML Formatter",
  shortDescription: "Format XML with readable indentation.",
  metaDescription:
    "Format and beautify XML online. Your XML stays private in your browser.",
  keywords: ["xml formatter", "xml beautifier", "format xml"],
  featured: true,
  relatedTools: ["xml-validator", "json-to-xml", "html-encode"],
  faq: [
    privacyFaq,
    {
      question: "Does the formatter modify XML values?",
      answer: "No. It only adds readable indentation and line breaks.",
    },
    mobileFaq,
  ],
},
{
  slug: "xml-validator",
  category: "developer",
  name: "XML Validator",
  shortDescription: "Check whether XML is well-formed.",
  metaDescription:
    "Validate XML syntax online and receive clear browser-based feedback.",
  keywords: ["xml validator", "validate xml", "xml syntax checker"],
  relatedTools: ["xml-formatter", "json-validator", "json-to-xml"],
  faq: [
    privacyFaq,
    {
      question: "Does this validate against an XSD schema?",
      answer: "No. This version checks whether the XML is well-formed.",
    },
    mobileFaq,
  ],
},
{
  slug: "yaml-validator",
  category: "developer",
  name: "YAML Validator",
  shortDescription: "Validate YAML syntax using a full YAML parser.",
  metaDescription:
    "Validate YAML syntax online with a full parser and local browser processing.",
  keywords: ["yaml validator", "validate yaml", "yaml syntax checker"],
  relatedTools: ["json-to-yaml", "json-validator", "xml-validator"],
  faq: [
    privacyFaq,
    {
      question: "Is this a complete YAML specification parser?",
      answer:
        "No. It checks common YAML mappings, lists, indentation and malformed lines without adding a large parser dependency.",
    },
    mobileFaq,
  ],
},
{
  slug: "uuid-generator",
  category: "developer",
  name: "UUID Generator",
  shortDescription: "Generate secure random UUID version 4 values.",
  metaDescription:
    "Generate UUID v4 values online using the browser cryptography API.",
  keywords: ["uuid generator", "uuid v4", "guid generator"],
  featured: true,
  relatedTools: ["base64-encode", "json-formatter", "unix-timestamp-converter"],
  faq: [
    privacyFaq,
    {
      question: "Which UUID version is generated?",
      answer: "The tool generates random UUID version 4 values.",
    },
    mobileFaq,
  ],
},
{
  slug: "jwt-decoder",
  category: "developer",
  name: "JWT Decoder",
  shortDescription: "Decode JWT headers and payloads without verifying signatures.",
  metaDescription:
    "Decode JWT header and payload data locally in your browser. No token is uploaded.",
  keywords: ["jwt decoder", "decode jwt", "jwt payload"],
  relatedTools: ["base64-decode", "json-formatter", "unix-timestamp-converter"],
  faq: [
    privacyFaq,
    {
      question: "Does this verify the JWT signature?",
      answer:
        "No. It only decodes the header and payload. Decoding does not prove that a token is valid or trusted.",
    },
    mobileFaq,
  ],
},
{
  slug: "unix-timestamp-converter",
  category: "developer",
  name: "Unix Timestamp Converter",
  shortDescription: "Convert Unix timestamps to dates and dates back to timestamps.",
  metaDescription:
    "Convert Unix timestamps and ISO dates online using your browser.",
  keywords: ["unix timestamp converter", "epoch converter", "timestamp to date"],
  featured: true,
  relatedTools: ["jwt-decoder", "uuid-generator", "json-formatter"],
  faq: [
    privacyFaq,
    {
      question: "Are seconds and milliseconds supported?",
      answer:
        "Yes. The tool detects common 10-digit second timestamps and 13-digit millisecond timestamps.",
    },
    mobileFaq,
  ],
},
];

export const toolMap = new Map(tools.map((tool) => [`${tool.category}/${tool.slug}`, tool]));

export function findTool(category: string, slug: string): ToolDefinition | undefined {
  return toolMap.get(`${category}/${slug}`);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedTools
    .map((slug) => tools.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is ToolDefinition => Boolean(candidate));
}
