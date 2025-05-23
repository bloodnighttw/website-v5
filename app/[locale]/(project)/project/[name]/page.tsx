import { BASE_URL, svgUrl } from "@/utils/constant";
import Image from "next/image";
import { Github } from "@/app/assets/svg";
import Link from "@/i18n/navigation";
import linkSvg from "@/app/assets/link.svg";
import Part from "@/components/shared/part";
import { Stacks } from "@/components/modules/home/project/stack";
import { allProjects } from "content-collections";

import "@/app/content.css"
import { Metadata } from "next";

export async function generateStaticParams() {
	return allProjects.map((post) => {
		return {
			name: post.name,
		};
	});
}

export const dynamicParams = false;

export async function generateMetadata({params}: { params: Promise<{ name: string }> }): Promise<Metadata>{
	const { name } = await params;
	return {
		alternates: {
			languages: {
				zh: `${BASE_URL}/zh/project/${name}`,
				en: `${BASE_URL}/en/project/${name}`,
			}
		}
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ name: string, locale: string }>;
}) {
	const { name, locale } = await params;

	const projectInfo = allProjects
		.find((it) => it.name === name)!;
	const svgs: string[] = projectInfo.stack
		.filter((st) => st in svgUrl)
		.map((st) => svgUrl[st]);

	const { default: C } = locale === "en" ? await import(`@/contents/projects/en/${name}.mdx`) : await import(`@/contents/projects/${name}.mdx`);

	return (
		<Part className="page-enter">
			<div className="flex bg-bsecondary/80 rounded items-center gap-4 p-4">
				<Link href={projectInfo.link}>{Github}</Link>
				<p className="text-2xl">{projectInfo.name}</p>

				<div className="ml-auto"></div>
				<Stacks svgs={svgs} />
			</div>

			{projectInfo.demo && (
				<div className="w-full rounded bg-bsecondary/50">
					<div className="flex items-center gap-2 p-2">
						<Image
							src={linkSvg}
							alt={"link"}
							width={24}
							height={24}
						/>
						<p>{projectInfo.demo}</p>
					</div>
					<iframe
						src={projectInfo.demo}
						className="rounded-b w-full h-[65vh] sm:h-[50vh] bg-bsecondary"
					/>
				</div>
			)}
			<article>
				<C />
			</article>
		</Part>
	);
}
