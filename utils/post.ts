import {  defineContent, zod as z } from "@mkblog/core";
import tocPlugin from "@mkblog/toc";
import remarkGfm from "remark-gfm";
import previewImage from "@/utils/previewImage";
import rehypeStarryNight from 'rehype-starry-night'
import rehypeLineNumbers from "./line-numbers";
import previewDescription from "@/utils/previewDescription";

const schema = {
	title: z.string(),
	categories: z.array(z.string()).default([]),
	date: z.string().pipe(z.coerce.date()),
	draft: z.boolean().optional(),
};

const temp = z.object(schema);

export type Post = z.infer<typeof temp>;

const contents = await defineContent({
	include: "./posts/**/*.md", // glob pattern
	schema,
	mkBlogPlugins: [tocPlugin, previewImage, previewDescription],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeStarryNight, rehypeLineNumbers],
});

interface Info extends Post{
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

