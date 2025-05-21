import { allPosts } from "content-collections";
import SecondaryPanel from "@/components/panel/SecondaryPanel";
import Part from "@/components/shared/Part";
import CardCollection from "@/components/Blog/ArticleCollection";
import { ArticleCards } from "@/components/Blog/ArticleCard";
import Text from "./Text"

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
