import { defineCollection, defineConfig } from "@content-collections/core";
 
const posts = defineCollection({
  name: "posts",
  directory: "posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    categories: z.array(z.string()).default([]),
    date: z.string().pipe(z.coerce.date()),
    draft: z.boolean().optional(),
    pin: z.boolean().default(false),
  }),
  transform: async (doc,a) => {




    return {

    }
  }
});
 
export default defineConfig({
  collections: [posts],
});