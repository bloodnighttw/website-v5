import type { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/constant";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";

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

	const posts = [] as MetadataRoute.Sitemap;

	for(const i of allPostWithEnPriority) {

		if( i.lang === "en"){
			posts.push({
				url: `${BASE_URL}/en/blog/${i.slug}`,
				lastModified: i.date,
				changeFrequency: "weekly",
				priority: 0.8,
			});
		}
	}

	for(const i of allPostWithZhPriority){
		if(i.lang === "en")
			continue;

		posts.push({
			url: `${BASE_URL}/zh/blog/${i.slug}`,
			lastModified: i.date,
			changeFrequency: "weekly",
			priority: 0.8,
		});
	}
	
	return [...staticPages, ...posts];
}
