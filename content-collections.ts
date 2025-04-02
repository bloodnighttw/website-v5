import { defineCollection, defineConfig } from "@content-collections/core";

import { unified } from "unified";
import remarkGfm from "remark-gfm";
import { Image } from "mdast";

import remarkMdx from "remark-mdx";
import { select } from "unist-util-select";
import remarkParse from "remark-parse";

const getFirstImage = (content: string, mdx: boolean = true): string | null => {
	const tree = unified()
		.use(remarkParse)
		.use(mdx ? [remarkMdx] : [])
		.parse(content);

	const imageNode = select("image", tree) as Image;

	return imageNode ? imageNode.url : null;
};

// TODO: fetch the preview content from the texts
const getPreviewMessage = (content: string): string => {
	const tree = unified().use(remarkParse).use(remarkGfm).parse(content);

	return tree.children
		.filter((node) => node.type === "text")
		.map((node) => node.value)
		.join(" ")
		.replace(/(\r\n|\n|\r)/gm, " ")
		.replace(/ +(?= )/g, "")
		.slice(0, 200);
};

const posts = defineCollection({
	name: "posts",
	directory: "contents/posts",
	include: ["**/*.mdx"],
	schema: (z) => ({
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
		const previewText = getPreviewMessage(content);

		return {
			slug,
			...others,
			description: previewText,
			preview: firstImage,
		};
	},
});

const projects = defineCollection({
	name: "project",
	directory: "contents/projects",
	include: ["**/*.md", "**/*.mdx"],
	schema: (z) => ({
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
		return {
			...doc,
		};
	},
});

export default defineConfig({
	collections: [posts, projects],
});
