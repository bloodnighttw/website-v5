import { getContentsInfo } from "@/utils/contents/post";
import Card from "@/compoments/Blog/ArticleCard";
import CardCollection from "@/compoments/Blog/ArticleCollection";
import CardTitle from "@/compoments/Blog/ArticleTitle";
import React from "@/app/assets/react.svg"
import Scrolling from "@/compoments/Project/Scrolling";
import { getProjectInfo } from "@/utils/contents/project";
import Display from "@/compoments/Project/Display";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { Stacks } from "@/compoments/Project/Stack";
import Chapter from "@/compoments/Text/Chapter";
import Introducing from "@/compoments/Home/Introducing";
import ProjectChapter from "@/compoments/Home/ProjectChapter";

export default async function Home() {

	const metas = await getContentsInfo();
	const sortedByTime = metas.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
	const sortedByPin = sortedByTime.filter( it => it.pin )

	const project = await getProjectInfo();

	return (
		<>
			<SecondaryPanel className="min-h-[75vh] lg:min-h-[50vh]">
				{/* Since we wrapped it in SecondaryPanel, we won't need padding because SecondaryPanel will do this for us */}
				<Part className="p-0 mx-4">
					<Introducing />
				</Part>
			</SecondaryPanel>

			<Part className="gradient-background border-b border-dot">

				<Chapter>My blog</Chapter>

				{
					sortedByPin.length > 0 &&
					<CardTitle title="Pinned Posts"/>
				}

				{
					sortedByPin.map((post)=> {
						return <Card
							key={post.slug}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})
				}

				<CardTitle title="Recent Posts" url={"/blog"}/>
				<CardCollection>
					{sortedByTime.slice(0,4).map((post, index)=> {
						return <Card
							key={index}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})}
				</CardCollection>
				<CardTitle title="About linux" url={"/tags/linux"}/>
				<CardCollection>
					{sortedByTime.filter((it) => it
						.categories.includes("linux"))
						.map((post, index)=> {
						return <Card
							key={index}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})}
				</CardCollection>
			</Part>

			<Part>
				<ProjectChapter>
					<Chapter>My Project</Chapter>
					<Scrolling>
						<Stacks/>
					</Scrolling>
				</ProjectChapter>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:items-center mt-6">
					{project.map((project)=> {
						return <Display
							key={project.name}
							name={project.name}
							description={project.description}
							link={project.link}
							stack={project.stack}
						/>
					})}
				</div>

			</Part>
		</>
	);
}
