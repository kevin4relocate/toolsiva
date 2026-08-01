import type { ToolDefinition } from "@/types/tool";

export interface ToolInstruction { title: string; description: string; }

const defaults: ToolInstruction[] = [
  { title: "Add your input", description: "Enter or paste the data you want to work with." },
  { title: "Review the live result", description: "The tool updates automatically as your input changes." },
  { title: "Copy the result", description: "Copy the generated output when it is ready." },
];

export function getToolInstructions(tool: ToolDefinition): ToolInstruction[] {
  if (["password-generator","passphrase-generator","random-string-generator","secure-token-generator","uuid-generator"].includes(tool.slug)) return [
    { title: "Choose your options", description: "Set the length, format or number of values." },
    { title: "Generate a new value", description: "Use the Generate button to create a fresh random result." },
    { title: "Copy the result", description: "Copy the generated value for use elsewhere." },
  ];
  if (tool.slug.endsWith("-validator")) return [
    { title: "Paste your document", description: "Add the JSON, XML or YAML you want to validate." },
    { title: "Check the status", description: "Valid documents appear in green; errors show line and column details." },
    { title: "Fix and recheck", description: "Use Go to error, edit the source and review the updated status." },
  ];
  if (tool.slug === "case-converter") return [
    { title: "Add your text", description: "Type or paste text into the editor." },
    { title: "Choose a case", description: "Apply uppercase, lowercase, title case or another conversion." },
    { title: "Copy the text", description: "Continue editing or copy the converted text." },
  ];
  if (tool.slug === "text-compare" || tool.slug === "hash-compare") return [
    { title: "Add both values", description: "Paste the original and updated values into their fields." },
    { title: "Review differences", description: "Use the colored result to identify matches and changes." },
    { title: "Adjust comparison options", description: "Ignore case or whitespace when those differences do not matter." },
  ];
  if (["basic-auth-generator","hmac-generator"].includes(tool.slug)) return [
    { title: "Complete the fields", description: "Enter the required message, username, password or secret key." },
    { title: "Review the generated value", description: "The authorization header or signature updates automatically." },
    { title: "Copy the result", description: "Copy the generated value when it is ready." },
  ];
  return defaults;
}
