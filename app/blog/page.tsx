import contents from "@/utils/post";
import CardCollection from "@/compoments/Card/CardCollection";
import Card from "@/compoments/Card/Card";
import HashTag from "@/compoments/HashTag";

export default async function BlogPosts(){

	const {posts} = contents;

	const metadataWithPreview: {
		title: string;
		preview: string;
		date: Date,
		slug: string
	}[] = []

	for (const post of posts) {
		const metadata = await post.metadata();

		const slug = post.slug;
		const preview = await post.previewImage() ?? "";
		metadataWithPreview.push({
			...metadata,
			preview,
			slug
		})
	}

	return <>
		<div className="h-36 part bg-dotted flex items-center justify-center border-b border-dot">
			<p className="text-4xl">Recent Posts</p>
		</div>
		<div className="part *:not-first:mt-4">
			<CardCollection >
				{metadataWithPreview.map((post, index)=> {
					return <Card
						key={index}
						// @ts-ignore
						href={"/blog/" + post.slug}
						preview={post.preview}
						title={post.title}
					/>
				})}
			</CardCollection>
		</div>
	</>

}