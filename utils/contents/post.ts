import { defineContent, zod as z } from "@mkblog/core";
import tocPlugin from "@mkblog/toc";
import remarkGfm from "remark-gfm";
import previewImage from "@/utils/mkblog-plujgin/previewImage";
import rehypeStarryNight from 'rehype-starry-night'
import rehypeLineNumbers from "@/utils/remark-plugin/line-numbers";
import previewDescription from "@/utils/mkblog-plujgin/previewDescription";

const schema = {
	title: z.string(),
	categories: z.array(z.string()).default([]),
	date: z.string().pipe(z.coerce.date()),
	draft: z.boolean().optional(),
	pin: z.boolean().default(false),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const temp = z.object(schema);

export type Post = z.infer<typeof temp>;

const contents = await defineContent({
	include: "./posts/**/*.md", // glob pattern
	schema,
	mkBlogPlugins: [tocPlugin, previewImage, previewDescription],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeStarryNight, rehypeLineNumbers],
});

export interface Info extends Post{
	slug: string;
	preview: string;
}

export async function getContentsInfo(): Promise<Info[]> {

	const {posts} = contents;

	const metaPromise = posts.map( async (post) => {
		const metadata = await post.metadata();
		const slug = post.slug;
		const preview = await post.previewImage() ?? "";
		return {
			...metadata,
			preview,
			slug,
		}
	})

	return Promise.all(metaPromise);
}


export default contents;

