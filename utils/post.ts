import { defineContent, zod as z} from "@mkblog/core";
import tocPlugin from "@mkblog/toc";
import remarkGfm from "remark-gfm";
import previewImage from "@/utils/previewImage";

const schema = {
	title: z.string(),
	category: z.array(z.string()).default([]),
	date: z.string().pipe(z.coerce.date()),
	draft: z.boolean().optional()
}

const _zobject = z.object(schema);

export type PostMetadata = z.infer<typeof _zobject>;

const contents = await defineContent({
	include: "./posts/**/*.md", // glob pattern
	schema,
	mkBlogPlugins: [
		tocPlugin,
		previewImage
	],
	remarkPlugins: [
		remarkGfm
	]
})

export default contents;