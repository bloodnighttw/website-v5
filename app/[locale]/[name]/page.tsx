/* This file will be refactored soon.
 * This is a temporary simulation to handle some error in CF page.
 * */

import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/utils/constant";
import BlogPosts from "@/app/[locale]/[name]/blog";
import Friends from "@/app/[locale]/[name]/friends";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ name: string }>;
}): Promise<Metadata> {
	const { name } = await params;

	const t = await getTranslations("Meta");

	if (name === "blog")
		return {
			title: t("All Blog Posts"),
			openGraph: {
				title: "Blog | Bloodnighttw",
				type: "website",
				images: [],
			},
			twitter: {
				title: "Blog | Bloodnighttw",
				site: "@bloodnighttw",
				card: "summary_large_image",
				images: [],
			},
			alternates: {
				languages: {
					zh: `${BASE_URL}/zh/blog`,
					en: `${BASE_URL}/en/blog`,
				},
			},
		};
	// else it's friends
	return {
		title: t("friends"),
		alternates: {
			languages: {
				zh: `${BASE_URL}/zh/friends`,
				en: `${BASE_URL}/en/friends`,
			},
		},
	};
}

export function generateStaticParams() {
	return [
		{
			name: "blog",
		},
		{
			name: "friends",
		},
	];
}

export default async function Page({
	params,
}: {
	params: Promise<{ name: string }>;
}) {
	const { name } = await params;

	if (name === "blog") return <BlogPosts />;

	return <Friends />;
}
