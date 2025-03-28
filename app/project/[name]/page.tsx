import Project, { getProjectInfo } from "@/utils/contents/project";
import { svgUrl } from "@/utils/constant";
import Image from "next/image";
import { Github } from "@/app/assets/svg";
import Link from "next/link";
import linkSvg from "@/app/assets/link.svg";
import Part from "@/compoments/Part";
import { Stacks } from "@/compoments/Project/Stack";

export async function generateStaticParams() {

	const project = await getProjectInfo();

	return project.map((post) => {
		return {
			name: post.slug,
		}
	})

}

export const dynamicParams = false;

export default async function Page({params}: {params: Promise<{name: string}>}) {

	const {posts} = Project;
	const { name } = await params;

	const projectInfo = posts.find((it) => it.slug === name)!;
	const meta = await projectInfo.metadata();
	const html = await projectInfo.html();
	const svgs: string[] = meta.stack.filter( st => st in svgUrl).map( st => svgUrl[st]);

	return <Part className="*:not-first:mt-4">
		<div className="flex bg-bsecondary/80 rounded items-center gap-4 p-4">
			<Link href={meta.link}>
				{Github}
			</Link>
			<p className="text-2xl">{meta.name}</p>
			<div className="ml-auto"></div>
			<Stacks svgs={svgs}/>
		</div>

		{ meta.demo && <div className="w-full rounded bg-bsecondary/50">
			<div className="flex items-center gap-2 p-2">
				<Image src={linkSvg} alt={"link"} width={24} height={24}/>
				<p>{meta.demo}</p>
			</div>
			<iframe src={meta.demo} className="rounded-b w-full h-[65vh] sm:h-[50vh] bg-bsecondary"/>
		</div> }
		<article dangerouslySetInnerHTML={{__html:html}}/>
	</Part>

}