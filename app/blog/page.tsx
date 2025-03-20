import contents from "@/utils/post";
import CardCollection from "@/compoments/Card/CardCollection";
import Card from "@/compoments/Card/Card";
import Image from "next/image";

export default async function BlogPosts(){

	const {posts} = contents;
	const meatadatas: {
		title: string;
		preview: string;
		slugs: string;
	}[] = [];

	for (let i = 0; i < posts.length; i++) {
		const metadata = await posts[i].metadata();
		const preview = await posts[i].previewImage();
		const slug = posts[i].slug;

		meatadatas.push({
			title: metadata.title,
			preview: preview ?? "",
			slugs: slug
		})

	}

	return <div className="part">

		<CardCollection >
			{meatadatas.map((post, index)=> {
				// @ts-ignore
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