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

export const metadata: Metadata = {
	title: "All Blog Post | Bloodnighttw",
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
		<>
			<SecondaryPanel>
				<Text/>
			</SecondaryPanel>
			<Part className="gradient-background">
				<CardCollection>
					<ArticleCards infos={metadataWithPreview} />
				</CardCollection>
			</Part>
		</>
	);
}
