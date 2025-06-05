import type { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/constant";
import { allPosts } from "content-collections";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${BASE_URL}/`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
			alternates: {
				languages: {
					zh: `${BASE_URL}/zh`,
					en: `${BASE_URL}/en`,
				},
			},
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.95,
			alternates: {
				languages: {
					zh: `${BASE_URL}/zh/blog`,
					en: `${BASE_URL}/en/blog`,
				},
			},
		},
		{
			url: `${BASE_URL}/friends`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
			alternates: {
				languages: {
					zh: `${BASE_URL}/zh/friends`,
					en: `${BASE_URL}/en/friends`,
				},
			},
		},
	];

	const postsSitemap: MetadataRoute.Sitemap = allPosts.map((post) => {
		return {
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.date,
			changeFrequency: "daily",
			priority: 1,
			alternates: {
				languages: {
					zh: `${BASE_URL}/zh/blog/${post.slug}`,
					en: `${BASE_URL}/en/blog/${post.slug}`,
				},
			},
		};
	});

	return [...staticPages, ...postsSitemap];
}
