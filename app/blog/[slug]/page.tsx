import contents from "@/utils/contents/post";
import "@/app/markdown.css"
import Comments from "@/compoments/comments";
import { Metadata } from "next";
import Part from "@/compoments/Part";
import ArticleSecondaryPanel from "@/compoments/Blog/ArticleSecondaryPanel";

export async function generateStaticParams() {
	return contents.posts.map((post)=> {
		return {
			slug: post.slug,
		}
	})
}

export const dynamicParams = false;

export async function generateMetadata({params} : {params: Promise<{slug: string}>}): Promise<Metadata> {

	const { slug } = await params;
	const post = contents.posts.find((it) => it.slug === slug);

	const metadata = await post?.metadata() ?? {title: "404"};
	const description = await post?.previewDescription();
	const preview = await post?.previewImage();
	return {
		title: metadata.title,
		description,
		openGraph: {
			title: metadata.title,
			description,
			type: "article",
			images: preview
				? [
					{
						url: preview,
						alt: metadata.title,
					},
				]
				: [],
		},
		twitter: {
			title: metadata.title,
			description,
			site: "@bloodnighttw",
			card: "summary_large_image",
			images: preview
				? [
					{
						url: preview,
						alt: metadata.title,
					},
				]
				: [],
		},
	}
}

export default async function Blog(
	{ params }: {
	params: Promise<{ slug: string }>
}) {

	const { slug } = await params;

	const content = contents.posts.find((it) => it.slug === slug) ;
	if(!content) return <div>404</div>;
	const metadata = await content?.metadata();
	const preview = await content?.previewImage();
	const MD = await content?.react();

	return (
		<>
			<ArticleSecondaryPanel
				preview={preview}
				metadata={metadata}
			/>
			<Part className="z-[100] bg-bprimary border-b border-dot">
				<article>
					{MD}
				</article>
			</Part>
			<Part className="bg-dotted">
				<Comments/>
			</Part>
		</>
	);
}
