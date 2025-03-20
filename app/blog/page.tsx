import contents from "@/utils/post";
import CardCollection from "@/compoments/Card/CardCollection";
import Card from "@/compoments/Card/Card";

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

	return <div className="part *:not-first:mt-4">
		<div>
			# Blog Posts
		</div>

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

}