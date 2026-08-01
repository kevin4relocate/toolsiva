export const toolCategories = [
  "text",
  "developer",
  "security",
  "qr",
  "calculator",
  "converter",
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  category: ToolCategory;
  name: string;
  shortDescription: string;
  metaDescription: string;
  keywords: string[];
  featured?: boolean;
  relatedTools: string[];
  faq: ToolFaq[];
}

export function getToolPath(tool: Pick<ToolDefinition, "category" | "slug">): string {
  return `/tools/${tool.category}/${tool.slug}`;
}
