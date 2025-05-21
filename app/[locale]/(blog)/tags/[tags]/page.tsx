import CardCollection from "@/components/modules/posts/section/collection";
import { PostCards } from "@/components/modules/posts/section/card";
import HashTag from "@/components/HashTag";
import DotBackground from "@/components/shared/DotBackground";
import Part from "@/components/shared/Part";
import { allPosts } from "content-collections";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
	const t = await getTranslations("Meta");

	return {
		title: "Tags: "+tags + " | " + t("title"),
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
		<div className="page-enter">
			<DotBackground>
				<HashTag
					className="text-center text-5xl text-bold"
					tags={tags}
				/>
			</DotBackground>

			<Part>
				<CardCollection>
					<PostCards infos={tagsContent} />
				</CardCollection>
			</Part>
		</div>
	);
}
