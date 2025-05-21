import SecondaryPanel from "@/components/panel/SecondaryPanel";
import Introducing from "@/components/Home/Introducing";
import BlogSection from "@/components/Home/BlogSection";
import ProjectSection from "@/components/Home/ProjectSection";
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
			<SecondaryPanel className="min-h-[75vh] lg:min-h-[50vh] h-auto p-4">
				<Introducing />
			</SecondaryPanel>

			<BlogSection />
			<ProjectSection />
		</>
	);
}
