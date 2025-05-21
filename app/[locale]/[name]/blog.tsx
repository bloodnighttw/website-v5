import { allPosts } from "content-collections";
import DotBackground from "@/components/shared/DotBackground";
import Part from "@/components/shared/Part";
import CardCollection from "@/components/modules/posts/section/collection";
import { PostCards } from "@/components/modules/posts/section/card";
import Text from "./Text"

export default async function BlogPosts() {
	const metadataWithPreview = allPosts.sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);

	return (
		<div className="page-enter">
			<DotBackground>
				<Text/>
			</DotBackground>
			<Part className="gradient-background">
				<CardCollection>
					<PostCards infos={metadataWithPreview} />
				</CardCollection>
			</Part>
		</div>
	);
}
