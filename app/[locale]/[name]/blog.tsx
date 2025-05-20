import { allPosts } from "content-collections";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
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
