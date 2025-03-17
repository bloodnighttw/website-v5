import contents from "@/utils/post"
import "./codeblock.css"
import HashTag from "@/compoments/HashTag";

export async function generateStaticParams() {
	return contents.posts.map(({slug})=> {
		return {
			slug: slug,
		}
	})
}

export const dynamicParams = false;


export default async function Blog(
	{ params }: {
	params: Promise<{ slug: string }>
}) {

	const { slug } = await params;

	const content = contents.posts.find((it) => it.slug === slug) ;
	const metadata = await content?.metadata()!;
	const preview = await content?.previewImage();
	const html = await content?.html()!;

	return (
		<>
			<div className="border-b border-dot bg-dotted -z-2">
				<img className="absolute z-[-1] w-full h-full object-cover blur-sm opacity-0 lg:opacity-100 bg-image duration-200" src={preview} alt="preview image"/>
				<div className="part min-h-48 flex flex-col justify-center font-sans shadow-none">
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
			<main className="part mt-0 z-[100] bg-bprimary">
				<article dangerouslySetInnerHTML={{__html: html}} className="article"></article>
			</main>
		</>
	);
}
