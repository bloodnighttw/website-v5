import CardCollection from "@/compoments/Card/CardCollection";
import contents, { getContentsInfo } from "@/utils/contents/post";
import Card from "@/compoments/Card/Card";
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

	return <>
		<SecondaryPanel>
			<HashTag className="text-center text-5xl text-bold" tags={tags} />
		</SecondaryPanel>

		<Part>

			<CardCollection>
				{
					tagsContent.map( (it, index) => (
						<Card
							href={"/blog/"+it.slug} key={index}
							preview={it.preview}
							title={it.title}
						/>
					))
				}
			</CardCollection>
		</Part>

	</>
}