/* This file will be refactored soon.
 * This is a temporary simulation to handle some error in CF page.
 * */

import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { allPosts } from "content-collections";
import { Metadata } from "next";
import Text from "@/app/[locale]/(blog)/[blog]/Text";
import { getTranslations } from "next-intl/server";
import { BASE_URL } from "@/utils/constant";

export async function generateMetadata(): Promise<Metadata>{

	const t = await getTranslations("Meta");

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
			}
		}
	}
}


export function generateStaticParams() {
	return [{
		"blog": "blog"
	}]
}


export default async function BlogPosts() {
	const metadataWithPreview = allPosts.sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);

	return (
		<div className="page-enter">
			<SecondaryPanel>
				<Text/>
			</SecondaryPanel>
			<Part className="gradient-background">
				<CardCollection>
					<ArticleCards infos={metadataWithPreview} />
				</CardCollection>
			</Part>
		</div>
	);
}
