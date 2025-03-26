import Project, { getProjectInfo } from "@/utils/project";
import { svgUrl } from "@/utils/constant";
import Image from "next/image";
import { Github } from "@/app/assets/svg";

export async function generateStaticParams() {

	const project = await getProjectInfo();

	return project.map((post) => {
		return {
			slug: post.slug,
		}
	})

}

export default async function Page({params}: {params: Promise<{name: string}>}) {

	const {posts} = Project;
	const { name } = await params;

	const projectInfo = posts.find((it) => it.slug === name)!;
	const meta = await projectInfo.metadata();
	const html = await projectInfo.html();
	// @ts-expect-error ignore
	const svgs: string[] = meta.stack.filter( st => st in svgUrl).map( st => svgUrl[st]);

	return <div className="part *:mt-4">
		<div className="flex bg-bsecondary/80 rounded items-center gap-4 p-4">
			{Github}
			<p className="text-2xl">{meta.name}</p>
			<div className="ml-auto"></div>
			{svgs.map(svg => (<Image src={svg} alt="icon" width={24} height={24} key={svg}/>))}
		</div>
		<iframe src={meta.demo} className="w-full h-[50vh] rounded bg-bsecondary/50"/>
		<article dangerouslySetInnerHTML={{__html:html}}/>
	</div>

}