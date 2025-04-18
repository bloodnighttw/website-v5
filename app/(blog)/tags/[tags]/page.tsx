import CardCollection from "@/compoments/Blog/ArticleCollection";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import HashTag from "@/compoments/HashTag";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { allPosts } from "content-collections";
import { Metadata } from "next";

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


export async function generateMetadata(
	{ params,}: { params: Promise<{ tags: string }>;
}): Promise<Metadata> {

	const { tags } = await params;

	return {
		title: "Tags: "+tags + " | Bloodnighttw",
		openGraph: {
			title: "Tags: "+tags+ " | Bloodnighttw",
			type: "website",
			images: [],
		},
		twitter: {
			title: "Tags: "+tags,
			site: "@bloodnighttw",
			card: "summary_large_image",
			images: [],
		},
	}
}

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
