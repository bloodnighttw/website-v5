import CardCollection from "@/compoments/Card/CardCollection";
import Card from "@/compoments/Card/Card";
import { getContentsInfo } from "@/utils/contents/post";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";

export default async function BlogPosts(){

	const metadataWithPreview = await getContentsInfo();
	metadataWithPreview.sort((a,b) => b.date.getTime() - a.date.getTime());

	return <>
		<SecondaryPanel>
			<p className="text-4xl">Recent Posts</p>
		</SecondaryPanel>
		<div className="part *:not-first:mt-4 gradient-background">
			<CardCollection >
				{metadataWithPreview.map((post, index)=> {
					return <Card
						key={index}
						href={"/blog/" + post.slug}
						preview={post.preview}
						title={post.title}
					/>
				})}
			</CardCollection>
		</div>
	</>

}