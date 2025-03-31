import { defineCollection, defineConfig } from "@content-collections/core";
import { Pluggable, unified } from "unified";
import rehypeStarryNight from "rehype-starry-night";
import rehypeLineNumbers from "@/utils/remark-plugin/line-numbers";
import remarkGfm from "remark-gfm";
import { Image } from "mdast";
import remarkRehype from "remark-rehype";
import { compileMDX } from "@content-collections/mdx";

import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { select } from "unist-util-select";

const remarkPlug: Pluggable[] = [remarkGfm];
const rehypePlug: Pluggable[] = [remarkRehype, rehypeStarryNight, rehypeLineNumbers];


const getFirstImage = (content: string, mdx:boolean = true): string | null => {
	const tree = unified()
		.use(remarkParse)
		.use(mdx ? [remarkMdx] : [])
		.parse(content);

	const imageNode = select("image", tree) as Image;

	return imageNode ? imageNode.url : null;
};

const posts = defineCollection({
	name: "posts",
	directory: "posts",
	include: ["**/*.md", "**/*.mdx"],
	schema: (z) => ({
		title: z.string(),
		categories: z.array(z.string()).default([]),
		date: z.string().pipe(z.coerce.date()),
		draft: z.boolean().optional(),
		pin: z.boolean().default(false),
	}),
	transform: async (doc, context) => {

		const { content, ...others } = doc;

		// this is might be changed since we don't need to consider
		// the same file name in different directory now.
		const slug = others._meta.fileName;

		// handle mdx file
		const firstImage = getFirstImage(content);
		const mdx = await compileMDX(context,doc,{
			rehypePlugins: rehypePlug,
			remarkPlugins: remarkPlug,
		});

		return {
			slug,
			...others,
			mdx,
			preview: firstImage,
		};
	},
});

export default defineConfig({
	// @ts-ignore this should be fine
	collections: [posts],
});
