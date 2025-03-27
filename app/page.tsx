import { getContentsInfo } from "@/utils/contents/post";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import CardCollection from "@/compoments/Blog/ArticleCollection";
import CardTitle from "@/compoments/Blog/ArticleTitle";
import React from "@/app/assets/react.svg";
import Scrolling from "@/compoments/Project/Scrolling";
import { getProjectInfo } from "@/utils/contents/project";
import ProjectCard from "@/compoments/Project/ProjectCard";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Part from "@/compoments/Part";
import { Stacks } from "@/compoments/Project/Stack";
import Chapter from "@/compoments/Text/Chapter";
import Introducing from "@/compoments/Home/Introducing";
import ProjectChapter from "@/compoments/Project/ProjectChapter";
import ProjectCollection from "@/compoments/Project/ProjectCollection";

export default async function Home() {

	const metas = await getContentsInfo();
	const sortedByTime = metas.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
	const sortedByPin = sortedByTime.filter(it => it.pin);

	const project = await getProjectInfo();
	const projectsCards = project.map((project) => {
		return <ProjectCard
			key={project.name}
			name={project.name}
			description={project.description}
			link={project.link}
			stack={project.stack}
		/>;
	})

	return (
		<>
			<SecondaryPanel className="min-h-[75vh] lg:min-h-[50vh] h-auto p-4">
				{/* Since we wrapped it in SecondaryPanel, we won't need padding because SecondaryPanel will do this for us */}
				<Introducing />
			</SecondaryPanel>

			<Part className="gradient-background border-b border-dot">

				<Chapter>My blog</Chapter>

				{
					sortedByPin.length > 0 &&
					<>
						<CardTitle title="Pinned Posts" />
						<CardCollection>
							<ArticleCards infos={sortedByPin} />
						</CardCollection>
					</>
				}

				<CardTitle title="Recent Posts" url={"/blog"} />
				<CardCollection>
					<ArticleCards infos={sortedByTime.slice(0, 4)} />
				</CardCollection>
				<CardTitle title="About linux" url={"/tags/linux"} />
				<CardCollection>
					<ArticleCards
						infos={sortedByTime.filter((it) => it.categories.includes("linux"))}
					/>
				</CardCollection>
			</Part>

			<Part>
				<ProjectChapter>
					<Chapter>My Project</Chapter>
					<Scrolling>
						<Stacks />
					</Scrolling>
				</ProjectChapter>
				<ProjectCollection>
					{projectsCards}
				</ProjectCollection>
			</Part>
		</>
	);
}
