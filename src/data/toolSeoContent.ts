import type { ToolDefinition } from "@/types/tool";

export interface ToolContentSection {
  heading: string;
  paragraphs: string[];
}

const categoryContext: Record<ToolDefinition["category"], string> = {
  text:
    "Text tools are useful when preparing copy, cleaning lists, checking length or transforming content before publishing.",
  developer:
    "Developer tools help inspect, transform and validate technical data during development, testing, debugging and integration work.",
  security:
    "Security utilities support common generation, hashing and inspection tasks, but they do not replace a complete security design or professional review.",
  qr:
    "QR tools create machine-readable payloads for compatible scanning applications. Always review the encoded content before sharing it.",
  calculator:
    "Calculators provide general informational estimates from the values entered. Important financial, health or contractual decisions require independent verification.",
  converter:
    "Converters use common unit definitions and display rounded results. Confirm precision and standards when the result is used for regulated or technical work.",
};

const categoryTips: Record<ToolDefinition["category"], string[]> = {
  text: [
    "Review capitalization, punctuation and line breaks after transforming content.",
    "Keep a copy of the original when making large changes.",
  ],
  developer: [
    "Validate output in the target system before using it in production.",
    "Avoid pasting secrets into any environment you do not control.",
  ],
  security: [
    "Treat generated values according to the security requirements of the target system.",
    "Do not assume that encoding is encryption or that a hash can replace secure credential storage.",
  ],
  qr: [
    "Scan the finished QR code with more than one device before publishing it.",
    "Use concise payloads and sufficient visual contrast.",
  ],
  calculator: [
    "Check units, dates, rates and assumptions before relying on the result.",
    "Compare the result with an authoritative calculator for important decisions.",
  ],
  converter: [
    "Confirm whether the source uses metric, imperial, US customary or another standard.",
    "Use enough precision for the intended task and avoid unnecessary rounding.",
  ],
};

export function getToolContentSections(tool: ToolDefinition): ToolContentSection[] {
  const relatedPurpose = tool.shortDescription.replace(/\.$/, "").toLowerCase();

  return [
    {
      heading: `What is ${tool.name}?`,
      paragraphs: [
        `${tool.name} is a free browser-based utility designed to ${relatedPurpose}. It opens directly without requiring an account and provides immediate feedback from the values you enter.`,
        categoryContext[tool.category],
      ],
    },
    {
      heading: `When to use ${tool.name}`,
      paragraphs: [
        `Use this tool when you need a quick, focused result without installing a separate application. It can support one-off tasks, quality checks, development work, content preparation and everyday comparisons.`,
        `For repeatable or high-stakes workflows, document the input assumptions and verify the result in the system where it will ultimately be used.`,
      ],
    },
    {
      heading: "Practical tips",
      paragraphs: categoryTips[tool.category],
    },
    {
      heading: "Privacy and processing",
      paragraphs: [
        "This tool is designed to process its working input in your browser. Your input is not intentionally uploaded to a Toolsiva application server unless the page clearly states otherwise.",
        "Your browser, device, extensions, clipboard and downloaded files remain part of your own security environment. Avoid entering confidential material when that environment is not trusted.",
      ],
    },
  ];
}
