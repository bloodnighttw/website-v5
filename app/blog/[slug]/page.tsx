import contents from "@/utils/post"
import "./codeblock.css"
import HashTag from "@/compoments/HashTag";
import Comments from "./comments";
import { Metadata } from "next";

export async function generateStaticParams() {
	return contents.posts.map(({slug})=> {
		return {
			slug: slug,
		}
	})
}

export const dynamicParams = false;

export async function generateMetadata({params} : {params: Promise<{slug: string}>}): Promise<Metadata> {

	const {slug} = await params;
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
	const html = await content?.html();

	return (
		<>
			<div className="relative border-b border-dot">
				<div className="bg-dotted w-full absolute inset-0 -z-1"/>
				<img className="absolute w-full h-full object-cover blur-sm opacity-0 lg:opacity-100 bg-image duration-200 -z-1" src={preview} alt="preview image"/>

				<div className="part min-h-48 flex flex-col items-center justify-center font-sans">
					<h1 className="text-6xl w-full m-4">
						{metadata.title}
					</h1>
					<div className="w-full text-xl flex gap-4 font-mono overflow-x-auto">
						{
							metadata.categories.map((category: string, index: number) => (
								<HashTag key={index} tags={category} />
							))
						}
					</div>
				</div>
			</div>
			<main className="part mt-0 z-[100] bg-bprimary border-b border-dot">
				<article dangerouslySetInnerHTML={{__html: html}} className="article"/>
			</main>
			<div className="part bg-dotted">
				<Comments/>
			</div>
		</>
	);
}
