import { defineContent, zod as z } from "@mkblog/core";
import tocPlugin from "@mkblog/toc";
import remarkGfm from "remark-gfm";
import previewImage from "@/utils/previewImage";
import rehypeStarryNight from 'rehype-starry-night'
import rehypeLineNumbers from "./line-numbers";

const schema = {
	title: z.string(),
	categories: z.array(z.string()).default([]),
	date: z.string().pipe(z.coerce.date()),
	draft: z.boolean().optional(),
};

const contents = await defineContent({
	include: "./posts/**/*.md", // glob pattern
	schema,
	mkBlogPlugins: [tocPlugin, previewImage],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeStarryNight, rehypeLineNumbers],
});

export default contents;
