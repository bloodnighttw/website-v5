import { defineContent, zod as z } from "@mkblog/core";

const schema = {
	name: z.string(),
	description: z.string(),
	link: z.string(),
	// all lowercase
	stack: z.array(z.string()).default([])
		.transform((str)=> str.map((it)=> it.toLowerCase())),
}

const contents = await defineContent({
	include: "./projects/**/*.md", // glob pattern
	schema,
});

export async function getProjectInfo() {

	const {posts} = contents;

	const metaPromise = posts.map( async (post) => {
		const metadata = await post.metadata();
		const slug = post.slug;
		return {
			...metadata,
			slug,
		}
	})

	return Promise.all(metaPromise)
}

export default contents;