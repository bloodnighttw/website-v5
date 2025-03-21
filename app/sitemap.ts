import type { MetadataRoute } from "next";
import { getContentsInfo } from "@/utils/post";
import { BASE_URL } from "@/utils/constant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${BASE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.95,
		},
	];

	const posts = await getContentsInfo();

	const postsSitemap: MetadataRoute.Sitemap = posts.map((post) => {
		return {
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.date,
			changeFrequency: "daily",
			priority: 0.9,
		};
	});

	return [...staticPages, ...postsSitemap];
}
