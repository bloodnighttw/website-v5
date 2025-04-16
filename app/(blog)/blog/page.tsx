import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { allPosts } from "content-collections";
import { Metadata } from "next";

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

export default async function BlogPosts() {
	const metadataWithPreview = allPosts.sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);

	return (
		<>
			<SecondaryPanel>
				<p className="text-4xl">Recent Posts</p>
			</SecondaryPanel>
			<Part className="gradient-background">
				<CardCollection>
					<ArticleCards infos={metadataWithPreview} />
				</CardCollection>
			</Part>
		</>
	);
}
