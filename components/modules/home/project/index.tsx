import ProjectCard from "@/components/modules/home/project/card";
import Part from "@/components/shared/part";
import { Stacks } from "@/components/modules/home/project/stack";
import Chapter from "@/components/modules/home/chapter";
import ProjectContainer from "@/components/modules/home/project/container";
import ProjectCollection from "@/components/modules/home/project/collection";
import Scrolling from "@/components/modules/home/project/scrolling";
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
			<ProjectContainer>
				<Chapter>{t("My Projects")}</Chapter>
				<Scrolling>
					<Stacks />
				</Scrolling>
			</ProjectContainer>
			<ProjectCollection>{projectsCards}</ProjectCollection>
		</Part>
	);
}
