import { defineContent, zod as z } from "@mkblog/core";

const schema = {
	name: z.string(),
	link: z.string(),
	stack: z.array(z.string()).default([]),
}

const contents = await defineContent({
	include: "./projects/**/*.md", // glob pattern
	schema,
});

export default contents;