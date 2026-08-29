import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const archiveSchema = z.object({
  title: z.string().max(120),
  date: z.date(),
  type: z.enum(['observation', 'project', 'research', 'writing', 'achievement', 'experiment', 'creative']),
  status: z.enum(['published', 'in-progress', 'archived']).default('published'),
  fields: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  description: z.string().max(300),
  coverImage: z.string().optional(),
  featured: z.boolean().default(false),
  connections: z.array(z.string()).default([]),
});

const observations = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/observations" }), schema: archiveSchema });
const projects = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }), schema: archiveSchema });
const research = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/research" }), schema: archiveSchema });
const writing = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }), schema: archiveSchema });
const achievements = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/achievements" }), schema: archiveSchema });
const creative = defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/creative" }), schema: archiveSchema });

export const collections = {
  observations,
  projects,
  research,
  writing,
  achievements,
  creative,
};
