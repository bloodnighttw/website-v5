import Project, { getProjectInfo } from "@/utils/project";
import { svgUrl } from "@/utils/constant";
import Image from "next/image";
import { Github } from "@/app/assets/svg";
import Link from "next/link";
import linkSvg from "@/app/assets/link.svg";

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
			<Link href={meta.link}>
				{Github}
			</Link>
			<p className="text-2xl">{meta.name}</p>
			<div className="ml-auto"></div>
			{svgs.map(svg => (<Image src={svg} alt="icon" width={24} height={24} key={svg}/>))}
		</div>
		<div className="w-full rounded bg-bsecondary/50">
			<div className="flex items-center gap-2 p-2">
				<Image src={linkSvg} alt={"link"} width={24} height={24}/>
				<p>{meta.link}</p>
			</div>
			<iframe src={meta.demo} className="rounded-b w-full h-[65vh] sm:h-[50vh] bg-bsecondary"/>
		</div>
		<article dangerouslySetInnerHTML={{__html:html}}/>
	</div>

}