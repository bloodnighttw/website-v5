import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import { getContentsInfo } from "@/utils/contents/post";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";

export default async function BlogPosts(){

	const metadataWithPreview = await getContentsInfo();
	metadataWithPreview.sort((a,b) => b.date.getTime() - a.date.getTime());

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