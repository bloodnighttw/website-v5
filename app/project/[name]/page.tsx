import { svgUrl } from "@/utils/constant";
import Image from "next/image";
import { Github } from "@/app/assets/svg";
import Link from "next/link";
import linkSvg from "@/app/assets/link.svg";
import Part from "@/compoments/Part";
import { Stacks } from "@/compoments/Project/Stack";
import { allProjects } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";

export async function generateStaticParams() {

	return allProjects.map((post) => {
		return {
			name: post.slug,
		}
	})

}

// export const dynamicParams = false;

export default async function Page({params}: {params: Promise<{name: string}>}) {

	const { name } = await params;

	const projectInfo = allProjects.find((it) => it.name === name)!;
	const svgs: string[] = projectInfo.stack.filter( st => st in svgUrl).map( st => svgUrl[st]);

	return <Part>
		<div className="flex bg-bsecondary/80 rounded items-center gap-4 p-4">
			<Link href={projectInfo.link}>
				{Github}
			</Link>
			<p className="text-2xl">{projectInfo.name}</p>

			<div className="ml-auto"></div>
			<Stacks svgs={svgs}/>
		</div>

		{ projectInfo.demo && <div className="w-full rounded bg-bsecondary/50">
			<div className="flex items-center gap-2 p-2">
				<Image src={linkSvg} alt={"link"} width={24} height={24}/>
				<p>{projectInfo.demo}</p>
			</div>
			<iframe src={projectInfo.demo} className="rounded-b w-full h-[65vh] sm:h-[50vh] bg-bsecondary"/>
		</div> }
		<article>
			<MDXContent code={projectInfo.mdx}/>
		</article>
	</Part>

}