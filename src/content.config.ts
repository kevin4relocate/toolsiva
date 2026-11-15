import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(10),
    description: z.string().min(50).max(180),
    slug: z.string(),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.string().default("Toolsiva Editorial"),
    primaryTool: z.string(),
    primaryToolPath: z.string().startsWith("/tools/"),
    relatedTools: z.array(z.object({ name: z.string(), path: z.string().startsWith("/tools/") })).default([]),
    keywords: z.array(z.string()).default([]),
    excerpt: z.string().min(50),
    draft: z.boolean().default(true),
    aiAssisted: z.boolean().default(false),
    // Only editorially approved drafts can be promoted by the daily scheduler.
    reviewApproved: z.boolean().default(false),
    scheduledDate: z.coerce.date().optional(),
    heroImage: z.string().startsWith("/blog/").optional(),
    heroImageAlt: z.string().min(30).optional(),
    heroImageCaption: z.string().min(30).optional(),
    heroImageWidth: z.number().int().positive().default(1200),
    heroImageHeight: z.number().int().positive().default(630),
  }),
});

export const collections = { blog };
