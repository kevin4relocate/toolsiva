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

export const tools: ToolDefinition[
] = [
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
  shortDescription: "Check common YAML syntax and indentation issues.",
  metaDescription:
    "Validate common YAML structures online with local browser processing.",
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
  {
  slug: "password-generator",
  category: "security",
  name: "Password Generator",
  shortDescription: "Generate strong passwords with configurable character groups.",
  metaDescription:
    "Generate secure random passwords locally in your browser with adjustable length and character options.",
  keywords: ["password generator", "strong password", "random password"],
  featured: true,
  relatedTools: ["password-strength-checker", "passphrase-generator", "secure-token-generator"],
  faq: [
    privacyFaq,
    {
      question: "How are passwords generated?",
      answer:
        "Passwords are generated with the browser cryptography API rather than Math.random.",
    },
    mobileFaq,
  ],
},
  {
  slug: "passphrase-generator",
  category: "security",
  name: "Passphrase Generator",
  shortDescription: "Generate memorable multi-word passphrases securely.",
  metaDescription:
    "Generate secure random passphrases locally in your browser with configurable word count and separators.",
  keywords: ["passphrase generator", "diceware alternative", "secure passphrase"],
  featured: true,
  relatedTools: ["password-generator", "password-strength-checker", "random-string-generator"],
  faq: [
    privacyFaq,
    {
      question: "Are passphrases easier to remember?",
      answer:
        "Multi-word passphrases can be easier to remember while remaining strong when enough random words are used.",
    },
    mobileFaq,
  ],
},
  {
  slug: "random-string-generator",
  category: "security",
  name: "Random String Generator",
  shortDescription: "Create cryptographically secure random strings.",
  metaDescription:
    "Generate random strings with custom length and character sets using the browser cryptography API.",
  keywords: ["random string generator", "secure random string", "random characters"],
  relatedTools: ["secure-token-generator", "password-generator", "passphrase-generator"],
  faq: [
    privacyFaq,
    {
      question: "Can I choose the character set?",
      answer:
        "Yes. You can include lowercase, uppercase, numbers and symbols.",
    },
    mobileFaq,
  ],
},
  {
  slug: "secure-token-generator",
  category: "security",
  name: "Secure Token Generator",
  shortDescription: "Generate secure hexadecimal or Base64 URL-safe tokens.",
  metaDescription:
    "Generate cryptographically secure tokens locally in hexadecimal or Base64 URL-safe format.",
  keywords: ["secure token generator", "api token generator", "random token"],
  featured: true,
  relatedTools: ["random-string-generator", "password-generator", "sha256-hash-generator"],
  faq: [
    privacyFaq,
    {
      question: "Which token formats are supported?",
      answer:
        "The tool supports hexadecimal and URL-safe Base64 output.",
    },
    mobileFaq,
  ],
},
  {
  slug: "password-strength-checker",
  category: "security",
  name: "Password Strength Checker",
  shortDescription: "Estimate password strength and identify common weaknesses.",
  metaDescription:
    "Check password strength locally and review practical improvement suggestions without uploading the password.",
  keywords: ["password strength checker", "check password security", "password score"],
  featured: true,
  relatedTools: ["password-generator", "passphrase-generator", "hash-compare"],
  faq: [
    privacyFaq,
    {
      question: "Does a high score guarantee safety?",
      answer:
        "No. The score is an estimate. Unique passwords and a password manager are still recommended.",
    },
    mobileFaq,
  ],
},
  {
  slug: "sha256-hash-generator",
  category: "security",
  name: "SHA-256 Hash Generator",
  shortDescription: "Generate a SHA-256 digest from text.",
  metaDescription:
    "Generate SHA-256 hashes locally in your browser without sending the source text to a server.",
  keywords: ["sha256 generator", "sha-256 hash", "text hash generator"],
  relatedTools: ["sha512-hash-generator", "hmac-generator", "hash-compare"],
  faq: [
    privacyFaq,
    {
      question: "Can a SHA-256 hash be reversed?",
      answer:
        "No. SHA-256 is a one-way digest, although weak inputs may still be guessed.",
    },
    mobileFaq,
  ],
},
  {
  slug: "sha512-hash-generator",
  category: "security",
  name: "SHA-512 Hash Generator",
  shortDescription: "Generate a SHA-512 digest from text.",
  metaDescription:
    "Generate SHA-512 hashes locally in your browser with UTF-8 input support.",
  keywords: ["sha512 generator", "sha-512 hash", "hash text"],
  relatedTools: ["sha256-hash-generator", "hmac-generator", "hash-compare"],
  faq: [
    privacyFaq,
    {
      question: "What output format is used?",
      answer:
        "The generated digest is shown as lowercase hexadecimal.",
    },
    mobileFaq,
  ],
},
  {
  slug: "hmac-generator",
  category: "security",
  name: "HMAC Generator",
  shortDescription: "Generate HMAC signatures with SHA-256 or SHA-512.",
  metaDescription:
    "Generate HMAC signatures locally using a message, secret key and SHA-256 or SHA-512.",
  keywords: ["hmac generator", "hmac sha256", "hmac sha512"],
  relatedTools: ["sha256-hash-generator", "sha512-hash-generator", "hash-compare"],
  faq: [
    privacyFaq,
    {
      question: "Is the secret key uploaded?",
      answer:
        "No. The key and message are processed only by the browser cryptography API.",
    },
    mobileFaq,
  ],
},
  {
  slug: "basic-auth-generator",
  category: "security",
  name: "Basic Auth Header Generator",
  shortDescription: "Create an HTTP Basic Authorization header.",
  metaDescription:
    "Generate an HTTP Basic Authorization header locally from a username and password.",
  keywords: ["basic auth generator", "authorization header", "http basic authentication"],
  relatedTools: ["secure-token-generator", "base64-encode", "password-generator"],
  faq: [
    privacyFaq,
    {
      question: "Does Basic Auth encrypt credentials?",
      answer:
        "No. It only Base64-encodes them, so it should be used only over HTTPS.",
    },
    mobileFaq,
  ],
},
  {
  slug: "hash-compare",
  category: "security",
  name: "Hash Compare",
  shortDescription: "Compare two hashes using timing-safe style logic.",
  metaDescription:
    "Compare two hash strings locally while ignoring surrounding whitespace and optional letter case.",
  keywords: ["hash compare", "compare checksum", "verify hash"],
  relatedTools: ["sha256-hash-generator", "sha512-hash-generator", "hmac-generator"],
  faq: [
    privacyFaq,
    {
      question: "Does this identify the hash algorithm?",
      answer:
        "No. It compares two supplied strings and reports whether they match.",
    },
    mobileFaq,
  ],
},
  {
  "slug": "qr-text-generator",
  "category": "qr",
  "name": "QR Text Generator",
  "shortDescription": "Create a QR code from plain text.",
  "metaDescription": "Generate a QR code for plain text locally in your browser.",
  "keywords": [
    "qr code text",
    "text qr generator"
  ],
  "featured": true,
  "relatedTools": [
    "qr-url-generator",
    "qr-email-generator",
    "qr-wifi-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-url-generator",
  "category": "qr",
  "name": "QR URL Generator",
  "shortDescription": "Create a QR code that opens a website URL.",
  "metaDescription": "Generate a QR code for a website URL locally in your browser.",
  "keywords": [
    "url qr code",
    "website qr generator"
  ],
  "featured": true,
  "relatedTools": [
    "qr-text-generator",
    "qr-whatsapp-generator",
    "qr-email-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-wifi-generator",
  "category": "qr",
  "name": "WiFi QR Code Generator",
  "shortDescription": "Create a QR code for joining a WiFi network.",
  "metaDescription": "Generate a WiFi QR code with network name, password and security type.",
  "keywords": [
    "wifi qr code",
    "wifi password qr"
  ],
  "featured": true,
  "relatedTools": [
    "qr-text-generator",
    "qr-url-generator",
    "qr-vcard-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-email-generator",
  "category": "qr",
  "name": "Email QR Code Generator",
  "shortDescription": "Create a QR code for a prefilled email message.",
  "metaDescription": "Generate a QR code with email address, subject and message.",
  "keywords": [
    "email qr code",
    "mailto qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-phone-generator",
    "qr-sms-generator",
    "qr-url-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-phone-generator",
  "category": "qr",
  "name": "Phone QR Code Generator",
  "shortDescription": "Create a QR code that starts a phone call.",
  "metaDescription": "Generate a QR code for a phone number locally in your browser.",
  "keywords": [
    "phone qr code",
    "call qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-sms-generator",
    "qr-whatsapp-generator",
    "qr-vcard-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-sms-generator",
  "category": "qr",
  "name": "SMS QR Code Generator",
  "shortDescription": "Create a QR code for a prefilled SMS message.",
  "metaDescription": "Generate a QR code with a phone number and SMS message.",
  "keywords": [
    "sms qr code",
    "text message qr"
  ],
  "featured": false,
  "relatedTools": [
    "qr-phone-generator",
    "qr-whatsapp-generator",
    "qr-email-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-whatsapp-generator",
  "category": "qr",
  "name": "WhatsApp QR Code Generator",
  "shortDescription": "Create a QR code that opens a WhatsApp chat.",
  "metaDescription": "Generate a WhatsApp chat QR code with an optional prefilled message.",
  "keywords": [
    "whatsapp qr code",
    "wa.me qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-phone-generator",
    "qr-sms-generator",
    "qr-url-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-vcard-generator",
  "category": "qr",
  "name": "vCard QR Code Generator",
  "shortDescription": "Create a QR code containing contact details.",
  "metaDescription": "Generate a vCard contact QR code locally in your browser.",
  "keywords": [
    "vcard qr code",
    "contact qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-phone-generator",
    "qr-email-generator",
    "qr-wifi-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-location-generator",
  "category": "qr",
  "name": "Location QR Code Generator",
  "shortDescription": "Create a QR code for geographic coordinates.",
  "metaDescription": "Generate a QR code for latitude and longitude coordinates.",
  "keywords": [
    "location qr code",
    "geo qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-event-generator",
    "qr-url-generator",
    "qr-text-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "qr-event-generator",
  "category": "qr",
  "name": "Event QR Code Generator",
  "shortDescription": "Create a QR code for a calendar event.",
  "metaDescription": "Generate an iCalendar event QR code with title, dates and location.",
  "keywords": [
    "event qr code",
    "calendar qr generator"
  ],
  "featured": false,
  "relatedTools": [
    "qr-location-generator",
    "qr-email-generator",
    "qr-vcard-generator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "percentage-calculator",
  "category": "calculator",
  "name": "Percentage Calculator",
  "shortDescription": "Calculate a percentage of any number.",
  "metaDescription": "Calculate percentages instantly in your browser.",
  "keywords": [
    "percentage calculator"
  ],
  "featured": true,
  "relatedTools": [
    "percentage-change-calculator",
    "discount-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "percentage-change-calculator",
  "category": "calculator",
  "name": "Percentage Change Calculator",
  "shortDescription": "Calculate percentage increase or decrease.",
  "metaDescription": "Calculate percentage change between two values.",
  "keywords": [
    "percentage change calculator"
  ],
  "featured": true,
  "relatedTools": [
    "percentage-calculator",
    "discount-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "discount-calculator",
  "category": "calculator",
  "name": "Discount Calculator",
  "shortDescription": "Calculate sale price and savings.",
  "metaDescription": "Calculate a discounted price and total savings.",
  "keywords": [
    "discount calculator",
    "sale price calculator"
  ],
  "featured": true,
  "relatedTools": [
    "percentage-calculator",
    "tip-calculator",
    "simple-interest-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "tip-calculator",
  "category": "calculator",
  "name": "Tip Calculator",
  "shortDescription": "Calculate tip and total per person.",
  "metaDescription": "Calculate a restaurant tip and split the total between people.",
  "keywords": [
    "tip calculator",
    "split bill calculator"
  ],
  "featured": true,
  "relatedTools": [
    "discount-calculator",
    "percentage-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "age-calculator",
  "category": "calculator",
  "name": "Age Calculator",
  "shortDescription": "Calculate age from a date of birth.",
  "metaDescription": "Calculate age in years, months and days.",
  "keywords": [
    "age calculator",
    "birthday calculator"
  ],
  "featured": false,
  "relatedTools": [
    "date-difference-calculator",
    "time-duration-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "bmi-calculator",
  "category": "calculator",
  "name": "BMI Calculator",
  "shortDescription": "Calculate body mass index from height and weight.",
  "metaDescription": "Calculate BMI from metric height and weight inputs.",
  "keywords": [
    "bmi calculator",
    "body mass index"
  ],
  "featured": false,
  "relatedTools": [
    "average-calculator",
    "percentage-calculator",
    "age-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "loan-calculator",
  "category": "calculator",
  "name": "Loan Calculator",
  "shortDescription": "Estimate monthly loan payments and total interest.",
  "metaDescription": "Calculate monthly payment, total payment and interest for a fixed-rate loan.",
  "keywords": [
    "loan calculator",
    "monthly payment calculator"
  ],
  "featured": false,
  "relatedTools": [
    "simple-interest-calculator",
    "compound-interest-calculator",
    "percentage-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "simple-interest-calculator",
  "category": "calculator",
  "name": "Simple Interest Calculator",
  "shortDescription": "Calculate simple interest and final amount.",
  "metaDescription": "Calculate simple interest from principal, annual rate and time.",
  "keywords": [
    "simple interest calculator"
  ],
  "featured": false,
  "relatedTools": [
    "compound-interest-calculator",
    "loan-calculator",
    "percentage-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "compound-interest-calculator",
  "category": "calculator",
  "name": "Compound Interest Calculator",
  "shortDescription": "Estimate compound growth over time.",
  "metaDescription": "Calculate compound interest with selectable compounding frequency.",
  "keywords": [
    "compound interest calculator"
  ],
  "featured": false,
  "relatedTools": [
    "simple-interest-calculator",
    "loan-calculator",
    "percentage-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "date-difference-calculator",
  "category": "calculator",
  "name": "Date Difference Calculator",
  "shortDescription": "Find the number of days between two dates.",
  "metaDescription": "Calculate the difference between two calendar dates.",
  "keywords": [
    "date difference calculator",
    "days between dates"
  ],
  "featured": false,
  "relatedTools": [
    "age-calculator",
    "time-duration-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "time-duration-calculator",
  "category": "calculator",
  "name": "Time Duration Calculator",
  "shortDescription": "Calculate elapsed time between two times.",
  "metaDescription": "Calculate hours and minutes between two times.",
  "keywords": [
    "time duration calculator",
    "hours between times"
  ],
  "featured": false,
  "relatedTools": [
    "date-difference-calculator",
    "age-calculator",
    "average-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "average-calculator",
  "category": "calculator",
  "name": "Average Calculator",
  "shortDescription": "Calculate mean, sum, minimum and maximum.",
  "metaDescription": "Calculate summary statistics from a list of numbers.",
  "keywords": [
    "average calculator",
    "mean calculator"
  ],
  "featured": false,
  "relatedTools": [
    "percentage-calculator",
    "percentage-change-calculator",
    "date-difference-calculator"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "length-converter",
  "category": "converter",
  "name": "Length Converter",
  "shortDescription": "Convert between common length units.",
  "metaDescription": "Convert between common length units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "length converter",
    "length converter"
  ],
  "featured": true,
  "relatedTools": [
    "weight-converter",
    "temperature-converter",
    "cooking-volume-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "weight-converter",
  "category": "converter",
  "name": "Weight Converter",
  "shortDescription": "Convert between common mass and weight units.",
  "metaDescription": "Convert between common mass and weight units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "weight converter",
    "weight converter"
  ],
  "featured": true,
  "relatedTools": [
    "temperature-converter",
    "area-converter",
    "length-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "temperature-converter",
  "category": "converter",
  "name": "Temperature Converter",
  "shortDescription": "Convert Celsius, Fahrenheit and Kelvin.",
  "metaDescription": "Convert Celsius, Fahrenheit and Kelvin. Results update instantly and processing stays in your browser.",
  "keywords": [
    "temperature converter",
    "temperature converter"
  ],
  "featured": true,
  "relatedTools": [
    "area-converter",
    "volume-converter",
    "weight-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "area-converter",
  "category": "converter",
  "name": "Area Converter",
  "shortDescription": "Convert between common area units.",
  "metaDescription": "Convert between common area units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "area converter",
    "area converter"
  ],
  "featured": true,
  "relatedTools": [
    "volume-converter",
    "speed-converter",
    "temperature-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "volume-converter",
  "category": "converter",
  "name": "Volume Converter",
  "shortDescription": "Convert between metric and imperial volume units.",
  "metaDescription": "Convert between metric and imperial volume units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "volume converter",
    "volume converter"
  ],
  "featured": true,
  "relatedTools": [
    "speed-converter",
    "time-converter",
    "area-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "speed-converter",
  "category": "converter",
  "name": "Speed Converter",
  "shortDescription": "Convert between common speed units.",
  "metaDescription": "Convert between common speed units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "speed converter",
    "speed converter"
  ],
  "featured": false,
  "relatedTools": [
    "time-converter",
    "data-storage-converter",
    "volume-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "time-converter",
  "category": "converter",
  "name": "Time Converter",
  "shortDescription": "Convert seconds, minutes, hours and days.",
  "metaDescription": "Convert seconds, minutes, hours and days. Results update instantly and processing stays in your browser.",
  "keywords": [
    "time converter",
    "time converter"
  ],
  "featured": false,
  "relatedTools": [
    "data-storage-converter",
    "pressure-converter",
    "speed-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "data-storage-converter",
  "category": "converter",
  "name": "Data Storage Converter",
  "shortDescription": "Convert bytes, kilobytes, megabytes and larger units.",
  "metaDescription": "Convert bytes, kilobytes, megabytes and larger units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "data storage converter",
    "data storage converter"
  ],
  "featured": false,
  "relatedTools": [
    "pressure-converter",
    "energy-converter",
    "time-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "pressure-converter",
  "category": "converter",
  "name": "Pressure Converter",
  "shortDescription": "Convert pascals, bars, PSI and atmospheres.",
  "metaDescription": "Convert pascals, bars, PSI and atmospheres. Results update instantly and processing stays in your browser.",
  "keywords": [
    "pressure converter",
    "pressure converter"
  ],
  "featured": false,
  "relatedTools": [
    "energy-converter",
    "power-converter",
    "data-storage-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "energy-converter",
  "category": "converter",
  "name": "Energy Converter",
  "shortDescription": "Convert joules, calories and watt-hours.",
  "metaDescription": "Convert joules, calories and watt-hours. Results update instantly and processing stays in your browser.",
  "keywords": [
    "energy converter",
    "energy converter"
  ],
  "featured": false,
  "relatedTools": [
    "power-converter",
    "angle-converter",
    "pressure-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "power-converter",
  "category": "converter",
  "name": "Power Converter",
  "shortDescription": "Convert watts, kilowatts and horsepower.",
  "metaDescription": "Convert watts, kilowatts and horsepower. Results update instantly and processing stays in your browser.",
  "keywords": [
    "power converter",
    "power converter"
  ],
  "featured": false,
  "relatedTools": [
    "angle-converter",
    "frequency-converter",
    "energy-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "angle-converter",
  "category": "converter",
  "name": "Angle Converter",
  "shortDescription": "Convert degrees, radians and turns.",
  "metaDescription": "Convert degrees, radians and turns. Results update instantly and processing stays in your browser.",
  "keywords": [
    "angle converter",
    "angle converter"
  ],
  "featured": false,
  "relatedTools": [
    "frequency-converter",
    "force-converter",
    "power-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "frequency-converter",
  "category": "converter",
  "name": "Frequency Converter",
  "shortDescription": "Convert hertz, kilohertz, megahertz and gigahertz.",
  "metaDescription": "Convert hertz, kilohertz, megahertz and gigahertz. Results update instantly and processing stays in your browser.",
  "keywords": [
    "frequency converter",
    "frequency converter"
  ],
  "featured": false,
  "relatedTools": [
    "force-converter",
    "torque-converter",
    "angle-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "force-converter",
  "category": "converter",
  "name": "Force Converter",
  "shortDescription": "Convert newtons, pound-force and kilogram-force.",
  "metaDescription": "Convert newtons, pound-force and kilogram-force. Results update instantly and processing stays in your browser.",
  "keywords": [
    "force converter",
    "force converter"
  ],
  "featured": false,
  "relatedTools": [
    "torque-converter",
    "density-converter",
    "frequency-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "torque-converter",
  "category": "converter",
  "name": "Torque Converter",
  "shortDescription": "Convert newton-metres, pound-feet and pound-inches.",
  "metaDescription": "Convert newton-metres, pound-feet and pound-inches. Results update instantly and processing stays in your browser.",
  "keywords": [
    "torque converter",
    "torque converter"
  ],
  "featured": false,
  "relatedTools": [
    "density-converter",
    "acceleration-converter",
    "force-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "density-converter",
  "category": "converter",
  "name": "Density Converter",
  "shortDescription": "Convert common density units.",
  "metaDescription": "Convert common density units. Results update instantly and processing stays in your browser.",
  "keywords": [
    "density converter",
    "density converter"
  ],
  "featured": false,
  "relatedTools": [
    "acceleration-converter",
    "fuel-economy-converter",
    "torque-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "acceleration-converter",
  "category": "converter",
  "name": "Acceleration Converter",
  "shortDescription": "Convert metres per second squared, g-force and feet per second squared.",
  "metaDescription": "Convert metres per second squared, g-force and feet per second squared. Results update instantly and processing stays in your browser.",
  "keywords": [
    "acceleration converter",
    "acceleration converter"
  ],
  "featured": false,
  "relatedTools": [
    "fuel-economy-converter",
    "data-transfer-rate-converter",
    "density-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "fuel-economy-converter",
  "category": "converter",
  "name": "Fuel Economy Converter",
  "shortDescription": "Convert MPG and litres per 100 kilometres.",
  "metaDescription": "Convert MPG and litres per 100 kilometres. Results update instantly and processing stays in your browser.",
  "keywords": [
    "fuel economy converter",
    "fuel economy converter"
  ],
  "featured": false,
  "relatedTools": [
    "data-transfer-rate-converter",
    "cooking-volume-converter",
    "acceleration-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "data-transfer-rate-converter",
  "category": "converter",
  "name": "Data Transfer Rate Converter",
  "shortDescription": "Convert bits and bytes per second.",
  "metaDescription": "Convert bits and bytes per second. Results update instantly and processing stays in your browser.",
  "keywords": [
    "data transfer rate converter",
    "data transfer rate converter"
  ],
  "featured": false,
  "relatedTools": [
    "cooking-volume-converter",
    "length-converter",
    "fuel-economy-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
  {
  "slug": "cooking-volume-converter",
  "category": "converter",
  "name": "Cooking Volume Converter",
  "shortDescription": "Convert teaspoons, tablespoons, cups and millilitres.",
  "metaDescription": "Convert teaspoons, tablespoons, cups and millilitres. Results update instantly and processing stays in your browser.",
  "keywords": [
    "cooking volume converter",
    "cooking volume converter"
  ],
  "featured": false,
  "relatedTools": [
    "length-converter",
    "weight-converter",
    "data-transfer-rate-converter"
  ],
  "faq": [
    {
      "question": "Does Toolsiva store my input?",
      "answer": "No. This tool runs locally in your browser and does not upload your input to a server."
    },
    {
      "question": "Does this tool work on mobile devices?",
      "answer": "Yes. The workspace is responsive and works in modern mobile and desktop browsers."
    }
  ]
},
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
  },
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
  },
{
  "slug": "regex-tester",
  "category": "developer",
  "name": "Regex Tester",
  "shortDescription": "Test regular expressions against sample text with flags and match details.",
  "metaDescription": "Test regular expressions online with flags, match counts and captured groups. Runs privately in your browser.",
  "keywords": [
    "regex tester",
    "regular expression tester",
    "regex match tester"
  ],
  "relatedTools": [
    "find-and-replace",
    "json-validator",
    "text-compare"
  ],
  "faq": [
    {
      "question": "Which regex flags are supported?",
      "answer": "The tool supports common JavaScript flags including global, case-insensitive, multiline, dotAll, Unicode and sticky."
    },
    {
      "question": "Can it show captured groups?",
      "answer": "Yes. Each match includes its full value, index and captured groups when available."
    },
    {
      "question": "Is my sample text uploaded?",
      "answer": "No. The regex and sample text are processed locally in your browser."
    }
  ]
},
{
  "slug": "utm-url-generator",
  "category": "developer",
  "name": "UTM URL Generator",
  "shortDescription": "Build campaign URLs with UTM source, medium, campaign and optional tags.",
  "metaDescription": "Generate UTM campaign URLs online with source, medium, campaign, term and content parameters.",
  "keywords": [
    "utm generator",
    "utm url builder",
    "campaign url generator"
  ],
  "relatedTools": [
    "url-encode",
    "url-decode",
    "qr-url-generator"
  ],
  "faq": [
    {
      "question": "Which UTM fields are required?",
      "answer": "The destination URL, campaign source, medium and campaign name are the most commonly required fields."
    },
    {
      "question": "Are existing query parameters preserved?",
      "answer": "Yes. Existing URL parameters remain and UTM parameters are added or updated."
    },
    {
      "question": "Is the URL sent to a server?",
      "answer": "No. URL generation happens locally in your browser."
    }
  ]
},
{
  "slug": "markdown-table-generator",
  "category": "developer",
  "name": "Markdown Table Generator",
  "shortDescription": "Create Markdown tables with editable rows, columns and alignment.",
  "metaDescription": "Build Markdown tables online with editable cells, row and column controls, alignment and instant copy.",
  "keywords": [
    "markdown table generator",
    "markdown table maker",
    "create markdown table"
  ],
  "relatedTools": [
    "json-to-csv",
    "json-formatter",
    "text-to-list"
  ],
  "faq": [
    {
      "question": "Can I change column alignment?",
      "answer": "Yes. Each column can be aligned left, center or right."
    },
    {
      "question": "Can I add and remove rows or columns?",
      "answer": "Yes. The table editor supports both row and column controls."
    },
    {
      "question": "Is table data uploaded?",
      "answer": "No. The table is generated locally in your browser."
    }
  ]
},
{
  "slug": "word-frequency-counter",
  "category": "text",
  "name": "Word Frequency Counter",
  "shortDescription": "Count repeated words and sort them by frequency or alphabetically.",
  "metaDescription": "Count word frequency online, ignore case, remove punctuation and sort results by count or alphabetically.",
  "keywords": [
    "word frequency counter",
    "word count frequency",
    "repeated word counter"
  ],
  "relatedTools": [
    "word-counter",
    "remove-duplicate-lines",
    "sort-lines"
  ],
  "faq": [
    {
      "question": "Can the counter ignore capitalization?",
      "answer": "Yes. Enable case-insensitive counting to combine words such as Tool and tool."
    },
    {
      "question": "Are punctuation marks removed?",
      "answer": "Yes. The default tokenizer removes surrounding punctuation before counting."
    },
    {
      "question": "Is my text uploaded?",
      "answer": "No. Word counting happens in your browser."
    }
  ]
},
{
  "slug": "programming-case-converter",
  "category": "text",
  "name": "Programming Case Converter",
  "shortDescription": "Convert text to camelCase, PascalCase, snake_case, kebab-case and dot.case.",
  "metaDescription": "Convert text to camelCase, PascalCase, snake_case, kebab-case and dot.case instantly in your browser.",
  "keywords": [
    "programming case converter",
    "camelcase converter",
    "snake case converter",
    "kebab case converter"
  ],
  "relatedTools": [
    "case-converter",
    "slug-generator",
    "remove-extra-spaces"
  ],
  "faq": [
    {
      "question": "Which programming cases are supported?",
      "answer": "camelCase, PascalCase, snake_case, kebab-case, dot.case and CONSTANT_CASE are included."
    },
    {
      "question": "How are words detected?",
      "answer": "Spaces, punctuation, underscores, hyphens and existing case changes are normalized into words."
    },
    {
      "question": "Is my text uploaded?",
      "answer": "No. Conversion happens locally in your browser."
    }
  ]
},
{
  "slug": "morse-code-translator",
  "category": "text",
  "name": "Morse Code Translator",
  "shortDescription": "Translate text to Morse code and decode Morse code back to text.",
  "metaDescription": "Translate English text to Morse code or decode Morse code to text online with instant browser-based results.",
  "keywords": [
    "morse code translator",
    "text to morse code",
    "morse code decoder"
  ],
  "relatedTools": [
    "binary-code-translator",
    "base64-encode",
    "base64-decode"
  ],
  "faq": [
    {
      "question": "How are letters and words separated?",
      "answer": "Letters use spaces and words use a slash in the generated Morse output."
    },
    {
      "question": "Which characters are supported?",
      "answer": "English letters, digits and common punctuation are supported."
    },
    {
      "question": "Is translation private?",
      "answer": "Yes. Translation happens locally in your browser."
    }
  ]
},
{
  "slug": "binary-code-translator",
  "category": "developer",
  "name": "Binary Code Translator",
  "shortDescription": "Convert UTF-8 text to binary bytes and decode binary back to text.",
  "metaDescription": "Translate UTF-8 text to binary code or decode binary bytes back to text directly in your browser.",
  "keywords": [
    "binary code translator",
    "text to binary",
    "binary to text"
  ],
  "relatedTools": [
    "morse-code-translator",
    "base64-encode",
    "base64-decode"
  ],
  "faq": [
    {
      "question": "Does it support Unicode text?",
      "answer": "Yes. Text is encoded and decoded as UTF-8 bytes."
    },
    {
      "question": "How should binary bytes be separated?",
      "answer": "Use spaces between 8-bit binary byte values."
    },
    {
      "question": "Is the input uploaded?",
      "answer": "No. Encoding and decoding happen locally in your browser."
    }
  ]
},
{
  "slug": "number-sorter",
  "category": "text",
  "name": "Number Sorter",
  "shortDescription": "Sort integers and decimal numbers in ascending or descending order.",
  "metaDescription": "Sort numbers online in ascending or descending order with support for decimals, negatives and mixed separators.",
  "keywords": [
    "number sorter",
    "sort numbers",
    "ascending number sorter"
  ],
  "relatedTools": [
    "sort-lines",
    "average-calculator",
    "remove-duplicate-lines"
  ],
  "faq": [
    {
      "question": "Which separators are accepted?",
      "answer": "Numbers can be separated by spaces, commas, semicolons or line breaks."
    },
    {
      "question": "Are negative and decimal values supported?",
      "answer": "Yes. Both negative values and decimal numbers are supported."
    },
    {
      "question": "Is the list uploaded?",
      "answer": "No. Sorting happens locally in your browser."
    }
  ]
},
{
  "slug": "remove-line-breaks",
  "category": "text",
  "name": "Remove Line Breaks",
  "shortDescription": "Replace line breaks with spaces, commas or a custom separator.",
  "metaDescription": "Remove line breaks online and join text with spaces, commas, semicolons or a custom separator.",
  "keywords": [
    "remove line breaks",
    "join lines",
    "line break remover"
  ],
  "relatedTools": [
    "remove-empty-lines",
    "remove-extra-spaces",
    "list-to-text"
  ],
  "faq": [
    {
      "question": "Can I choose the replacement separator?",
      "answer": "Yes. Use a space, comma, semicolon or any custom separator."
    },
    {
      "question": "Are empty lines removed?",
      "answer": "Empty lines are ignored by default before joining the remaining lines."
    },
    {
      "question": "Is my text uploaded?",
      "answer": "No. Processing happens locally in your browser."
    }
  ]
},
{
  "slug": "random-choice-generator",
  "category": "security",
  "name": "Random Choice Generator",
  "shortDescription": "Choose one or more random items from a list with optional no-repeat selection.",
  "metaDescription": "Pick random choices from a list online, choose multiple winners and prevent repeated selections.",
  "keywords": [
    "random choice generator",
    "random picker",
    "random list picker"
  ],
  "relatedTools": [
    "random-string-generator",
    "secure-token-generator",
    "uuid-generator"
  ],
  "faq": [
    {
      "question": "Can I select multiple winners?",
      "answer": "Yes. Choose how many results to pick from the list."
    },
    {
      "question": "Can duplicate results be prevented?",
      "answer": "Yes. The no-repeat option selects unique list items."
    },
    {
      "question": "Is my list uploaded?",
      "answer": "No. Random selection happens locally in your browser."
    }
  ]
}
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
