import { defineContent, zod } from "@mkblog/core";
import tocPlugin from "@mkblog/toc";
import remarkGfm from "remark-gfm";
import previewImage from "@/utils/previewImage";

const contents = defineContent({
	include: "./posts/**/*.md", // glob pattern
	schema: {
		title: zod.string(),
		date: zod.date(),
	},
	mkBlogPlugins: [
		tocPlugin,
		previewImage
	],
	remarkPlugins: [
		remarkGfm
	]
})

export default contents;