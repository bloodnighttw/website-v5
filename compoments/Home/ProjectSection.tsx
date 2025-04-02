import ProjectCard from "@/compoments/Project/ProjectCard";
import Part from "@/compoments/Part";
import { Stacks } from "@/compoments/Project/Stack";
import Chapter from "@/compoments/Text/Chapter";
import ProjectChapter from "@/compoments/Project/ProjectChapter";
import ProjectCollection from "@/compoments/Project/ProjectCollection";
import Scrolling from "@/compoments/Project/Scrolling";
import { allProjects } from "content-collections";

export default async function ProjectSection() {
	const projectsCards = allProjects.map((project) => {
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
				<Chapter>My Project</Chapter>
				<Scrolling>
					<Stacks />
				</Scrolling>
			</ProjectChapter>
			<ProjectCollection>{projectsCards}</ProjectCollection>
		</Part>
	);
}
