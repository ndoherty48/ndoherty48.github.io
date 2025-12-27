import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	projects: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			hidden: z.boolean().default(false),
			img_hidden: z.boolean().default(false),
			publishDate: z.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	blog: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	employment: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/employment', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			employer: z.string(),
			startDate: z.date(),
			endDate: z.date().optional(),
			tags: z.array(z.string()).optional(),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
};
