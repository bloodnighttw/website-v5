import CardCollection from "@/compoments/Card/CardCollection";
import Card from "@/compoments/Card/Card";
import { getContentsInfo } from "@/utils/contents/post";

export default async function BlogPosts(){

	const metadataWithPreview = await getContentsInfo();
	metadataWithPreview.sort((a,b) => b.date.getTime() - a.date.getTime());

	return <>
		<div className="h-36 part bg-dotted flex items-center justify-center border-b border-dot">
			<p className="text-4xl">Recent Posts</p>
		</div>
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