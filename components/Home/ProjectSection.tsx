import ProjectCard from "@/components/Project/ProjectCard";
import Part from "@/components/Part";
import { Stacks } from "@/components/Project/Stack";
import Chapter from "@/components/Text/Chapter";
import ProjectChapter from "@/components/Project/ProjectChapter";
import ProjectCollection from "@/components/Project/ProjectCollection";
import Scrolling from "@/components/Project/Scrolling";
import { allProjects } from "content-collections";
import { getTranslations } from "next-intl/server";

export default async function ProjectSection() {

	const t = await getTranslations("Project");
	const lang = (await getTranslations())("lang");

	const projectsCards = allProjects
		.filter((project) => {
			return project.lang === lang
		})
		.map((project) => {
			return (
				<ProjectCard
					key={project.name}
					name={project.name}
					description={project.description}
					link={project.link}
					stack={project.stack}
				/>
			);
		});

	return (
		<Part>
			<ProjectChapter>
				<Chapter>{t("My Projects")}</Chapter>
				<Scrolling>
					<Stacks />
				</Scrolling>
			</ProjectChapter>
			<ProjectCollection>{projectsCards}</ProjectCollection>
		</Part>
	);
}
