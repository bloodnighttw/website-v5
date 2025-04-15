import "server-only";

import "@/app/content.css";
import Comments from "@/compoments/comments";
import { Metadata } from "next";
import Part from "@/compoments/Part";
import ArticleSecondaryPanel from "@/compoments/Blog/ArticleSecondaryPanel";
import { allPosts } from "content-collections";
import Layout from "@/compoments/Blog/Addon/Layout";

export async function generateStaticParams() {
	return allPosts.map((post) => {
		return {
			slug: post.slug,
		};
	});
}

export const dynamicParams = false;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = allPosts.find((it) => it.slug === slug)!;
	const description = post.description;

	return {
		title: post.title,
		description,
		openGraph: {
			title: post.title,
			description: "",
			type: "article",
			images: post.preview
				? [
						{
							url: post.preview,
							alt: post.title,
						},
					]
				: [],
		},
		twitter: {
			title: post.title,
			description,
			site: "@bloodnighttw",
			card: "summary_large_image",
			images: post.preview
				? [
						{
							url: post.preview,
							alt: post.title,
						},
					]
				: [],
		},
	};
}

export default async function Blog({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const content = allPosts.find((it) => it.slug === slug);
	if (!content) return <div>404</div>;
	const { default: Content } = await import(
		`@/contents/posts/${content.slug}.mdx`
	);

	return (
		<>
			<ArticleSecondaryPanel content={content} />
			<Layout tocArray={content.toc}>
				<Part className="bg-bprimary">
					<article>
						<Content />
					</article>
				</Part>
			</Layout>

			<Part className="bg-dotted">
				<Comments />
			</Part>
		</>
	);
}
