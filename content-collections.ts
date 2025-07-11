import { defineCollection, defineConfig } from "@content-collections/core";

import { unified } from "unified";
import remarkGfm from "remark-gfm";
import { Heading, Image, Root } from "mdast";

import remarkMdx from "remark-mdx";
import { select, selectAll } from "unist-util-select";
import remarkParse from "remark-parse";

import { Text } from "hast";
import { generateId } from "@/utils/rehype-plugin/section";

import { z } from "zod/v4";

export function generateToc(ast: Root) {
	const headings = selectAll("heading", ast) as Heading[];
	const idMap = new Map<string, number>();

	return headings.map((heading) => {
		const text = selectAll("text", heading) as Text[];
		const id = generateId(idMap, text);

		return {
			depth: heading.depth,
			id,
			text: text.map((it) => it.value).join(),
		};
	});
}

const getFirstImage = (content: string): string | null => {
	const tree = unified().use(remarkParse).use(remarkMdx).parse(content);

	const imageNode = select("image", tree) as Image;

	return imageNode ? imageNode.url : null;
};

const getFullText = (content: string): string => {
	const tree = unified()
		.use(remarkParse)
		.use(remarkMdx)
		.use(remarkGfm)
		.parse(content);

	const textNode = selectAll("text", tree) as Text[];

	return textNode.map((it) => it.value).join(" ");
};

const documentLanguage = (content: string): string => {
	const tree = unified()
		.use(remarkParse)
		.use(remarkMdx)
		.use(remarkGfm)
		.parse(content);

	const langNode = selectAll("text", tree) as Text[];
	let weight = 0;

	for (const node of langNode) {
		for (const char of node.value) {
			// if it's a chinese character
			if (char >= "\u4E00" && char <= "\u9FFF") {
				weight += 4;
			} else {
				weight -= 1;
			}
		}
	}

	if (weight > 0) {
		return "zh";
	} else {
		return "en";
	}
};

const handleToc = (content: string) => {
	const ast = unified().use(remarkParse).use(remarkMdx).parse(content);

	return generateToc(ast);
};

const posts = defineCollection({
	name: "posts",
	directory: "contents/posts",
	include: ["*.mdx"],
	schema: z.object({
		title: z.string(),
		categories: z.array(z.string()).default([]),
		date: z.string().pipe(z.coerce.date()),
		draft: z.boolean().optional(),
		pin: z.boolean().default(false),
	}),
	transform: async (doc) => {
		const { content, ...others } = doc;

		// this is might be changed since we don't need to consider
		// the same file name in different directory now.
		const slug = others._meta.path.replace("/", "-");

		// handle mdx file
		const firstImage =
			getFirstImage(content) ?? "https://r2.bntw.dev/dot.png";
		const fullText = getFullText(content);
		const lang = documentLanguage(content);
		const previewText = fullText.slice(0, 400);

		const toc = handleToc(content);

		return {
			slug,
			...others,
			description: previewText,
			preview: firstImage,
			toc,
			lang,
		};
	},
});

// the translate collection is used to store the translated posts

const translate = defineCollection({
	name: "translate",
	directory: "contents/posts/translate",
	include: ["*.mdx"],
	schema: z.object({
		title: z.string(),
		draft: z.boolean().optional(),
	}),
	transform: async (doc) => {
		const { content, ...others } = doc;

		// this is might be changed since we don't need to consider
		// the same file name in different directory now.
		const slug = others._meta.path.replace("/", "-");

		// handle mdx file
		const firstImage =
			getFirstImage(content) ?? "https://r2.bntw.dev/dot.png";
		const fullText = getFullText(content);
		const lang = documentLanguage(content);
		const previewText = fullText.slice(0, 400);

		const toc = handleToc(content);

		return {
			slug,
			...others,
			description: previewText,
			preview: firstImage,
			toc,
			lang,
		};
	},
});

const projects = defineCollection({
	name: "project",
	directory: "contents/projects",
	include: ["**/*.md", "**/*.mdx"],
	schema: z.object({
		name: z.string(),
		description: z.string(),
		link: z.string(),
		stack: z
			.array(z.string())
			.default([])
			.transform((strs) => strs.map((it) => it.toLowerCase())),
		demo: z.string().optional(),
	}),
	transform: async (doc) => {
		const path = doc._meta.path;
		const lang = path.startsWith("en/") ? "en" : "zh";

		return {
			...doc,
			lang,
		};
	},
});

export default defineConfig({
	collections: [posts, projects, translate],
});
