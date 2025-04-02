import type { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/constant";
import { allPosts } from "content-collections";

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

	const postsSitemap: MetadataRoute.Sitemap = allPosts.map((post) => {
		return {
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.date,
			changeFrequency: "daily",
			priority: 0.9,
		};
	});

	return [...staticPages, ...postsSitemap];
}
