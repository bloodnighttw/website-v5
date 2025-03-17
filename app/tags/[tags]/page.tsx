import CardCollection from "@/compoments/Card/CardCollection";
import contents from "@/utils/post";
import Card from "@/compoments/Card/Card";
import HashTag from "@/compoments/HashTag";

export async function generateStaticParams() {
	const {posts} = contents;

	const set = new Set<string>();

	const allMeta = await Promise.all(posts.map(it => it.metadata()));

	allMeta.forEach( ({categories}) => categories.forEach(category => {
		set.add(category);
	}))

	const tags = Array.from(set);

	return tags.map(tag => {
		return {
			tags: tag
		}
	});
}

export const dynamicParams = false;

export default async function Tags(
	{ params }: { params: Promise<{ tags: string }>}
) {

	const { tags } = await params;
	const { posts } = contents;

	const metadataWithPreview: {
		title: string;
		preview: string;
		date: Date,
		slug: string
	}[] = []

	for (const post of posts) {
		const metadata = await post.metadata();

		if(!metadata.categories.includes(tags)) {
			continue;
		}

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
			<HashTag className="text-center text-5xl text-bold">hash</HashTag>
		</div>

		<div className="part">

			<CardCollection>
				{
					metadataWithPreview.map( (it, index) => (
						// @ts-ignore type can be url here
						<Card href={"/blog/"+it.slug} key={index}>
							<img src={it.preview} alt={it.title} className="w-full h-36 object-cover"/>
							<p className="text-2xl font-bold">{it.title}</p>
						</Card>
					))
				}
			</CardCollection>
		</div>

	</>
}