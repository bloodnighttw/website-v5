import DotBackground from "@/components/shared/dot-background";
import Introducing from "@/components/Home/Introducing";
import BlogSection from "@/components/modules/home/blog";
import ProjectSection from "@/components/modules/home/project";
import { BASE_URL } from "@/utils/constant";

export async function generateMetadata() {
	return {
		alternates: {
			languages: {
				zh: `${BASE_URL}/zh`,
				en: `${BASE_URL}/en`
			}
		}
	};
}

export default async function Home() {
	return (
		<>
			<DotBackground className="min-h-[75vh] lg:min-h-[50vh] h-auto p-4">
				<Introducing />
			</DotBackground>

			<BlogSection />
			<ProjectSection />
		</>
	);
}
