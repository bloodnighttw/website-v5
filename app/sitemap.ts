import type { MetadataRoute } from "next";
import { BASE_URL } from "@/utils/constant";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: `${BASE_URL}/zh`,
			lastModified: new Date(),
			changeFrequency: "weekly",
		},
		{
			url: `${BASE_URL}/en`,
			lastModified: new Date(),
			changeFrequency: "weekly",
		},
		{
			url: `${BASE_URL}/en/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
		},
		{
			url: `${BASE_URL}/zh/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
		},
		{
			url: `${BASE_URL}/en/friends`,
			lastModified: new Date(),
			changeFrequency: "weekly",
		},
		{
			url: `${BASE_URL}/zh/friends`,
			lastModified: new Date(),
			changeFrequency: "weekly",
		}
	];

	const posts = [] as MetadataRoute.Sitemap;

	for(const i of allPostWithEnPriority) {

		if( i.lang === "en"){
			posts.push({
				url: `${BASE_URL}/en/blog/${i.slug}`,
				lastModified: i.date,
				changeFrequency: "weekly",
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
		});
	}
	
	return [...staticPages, ...posts];
}
