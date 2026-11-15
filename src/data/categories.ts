import type { ToolCategory } from "@/types/tool";

export interface CategoryDefinition {
  slug: ToolCategory;
  name: string;
  description: string;
}

export const categories: CategoryDefinition[] = [
  {
    slug: "text",
    name: "Text Tools",
    description: "Count words, compare drafts, remove duplicate lines, format lists and clean copied text with fast browser-based utilities.",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format JSON, validate XML and YAML, inspect tokens, encode data and convert developer formats directly in your browser.",
  },
  {
    slug: "security",
    name: "Security Tools",
    description: "Generate passwords and passphrases, create tokens, compare hashes and work with cryptographic utilities locally in your browser.",
  },
  {
    slug: "qr",
    name: "QR Tools",
    description: "Make downloadable QR codes for URLs, Wi-Fi networks, contacts, email, events and locations with browser-side generation.",
  },
  {
    slug: "calculator",
    name: "Calculators",
    description: "Calculate percentages, tips, interest, loan payments, time differences and other everyday results with clear inputs.",
  },
  {
    slug: "converter",
    name: "Converters",
    description: "Convert distance, temperature, storage, speed, fuel economy, cooking measurements and more with labelled units.",
  },
];

export const categoryMap = new Map(categories.map((category) => [category.slug, category]));
