import CardCollection from "@/compoments/Blog/ArticleCollection";
import contents, { getContentsInfo } from "@/utils/contents/post";
import Card from "@/compoments/Blog/ArticleCard";
import HashTag from "@/compoments/HashTag";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";

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

	const metadataWithPreview = await getContentsInfo();
	const tagsContent = metadataWithPreview.filter(it => it.categories.includes(tags));

	const Cards = tagsContent.map( (it) => (
		<Card
			href={"/blog/"+it.slug} key={it.slug}
			preview={it.preview}
			title={it.title}
		/>
	))

	return <>
		<SecondaryPanel>
			<HashTag className="text-center text-5xl text-bold" tags={tags} />
		</SecondaryPanel>

		<Part>
			<CardCollection>
				{Cards}
			</CardCollection>
		</Part>

	</>
}