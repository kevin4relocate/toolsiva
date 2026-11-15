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
    featuredImage: z.string().startsWith("/blog/illustrations/").optional(),
    imageAlt: z.string().min(25).max(220).optional(),
    imageCaption: z.string().min(35).max(260).optional(),
    curatedSeries: z.boolean().default(false),

  }),
});

export const collections = { blog };
