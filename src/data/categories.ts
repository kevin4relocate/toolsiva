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
    description: "Count, clean, transform and organize text directly in your browser.",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format, validate and convert developer data without sending it to a server.",
  },
  {
    slug: "security",
    name: "Security Tools",
    description: "Generate passwords, tokens and hashes locally.",
  },
  {
    slug: "qr",
    name: "QR Tools",
    description: "Create useful QR codes without storing their content.",
  },
  {
    slug: "calculator",
    name: "Calculators",
    description: "Fast calculators for work and everyday decisions.",
  },
  {
    slug: "converter",
    name: "Converters",
    description: "Simple unit and data conversions with immediate results.",
  },
];

export const categoryMap = new Map(categories.map((category) => [category.slug, category]));
