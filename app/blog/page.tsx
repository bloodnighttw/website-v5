import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { allPosts } from "content-collections";

export default async function BlogPosts(){

	const metadataWithPreview = allPosts.sort((a,b) => b.date.getTime() - a.date.getTime());

	return <>
		<SecondaryPanel>
			<p className="text-4xl">Recent Posts</p>
		</SecondaryPanel>
		<Part className="gradient-background">
			<CardCollection>
				<ArticleCards infos={metadataWithPreview}/>
			</CardCollection>
		</Part>
	</>

}