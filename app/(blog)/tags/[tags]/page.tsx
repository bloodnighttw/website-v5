import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import HashTag from "@/compoments/HashTag";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { allPosts } from "content-collections";

export async function generateStaticParams() {
	const posts = allPosts.slice();

	const set = new Set<string>();

	posts.forEach(({ categories }) =>
		categories.forEach((category) => {
			set.add(category);
		}),
	);

	const tags = Array.from(set);

	return tags.map((tag) => {
		return {
			tags: tag,
		};
	});
}

export const dynamicParams = false;

export default async function Tags({
	params,
}: {
	params: Promise<{ tags: string }>;
}) {
	const { tags } = await params;

	const tagsContent = allPosts.filter((it) => it.categories.includes(tags));

	return (
		<>
			<SecondaryPanel>
				<HashTag
					className="text-center text-5xl text-bold"
					tags={tags}
				/>
			</SecondaryPanel>

			<Part>
				<CardCollection>
					<ArticleCards infos={tagsContent} />
				</CardCollection>
			</Part>
		</>
	);
}
