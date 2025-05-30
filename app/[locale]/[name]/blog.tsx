import DotBackground from "@/components/shared/dot-background";
import Part from "@/components/shared/part";
import CardCollection from "@/components/modules/posts/section/collection";
import { PostCards } from "@/components/modules/posts/section/card";
import Text from "./Text"
import { getTranslations } from "next-intl/server";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";

export default async function BlogPosts() {
	const t = await getTranslations();
	const lang = t("lang");

	const allPost = lang === "en" ? allPostWithEnPriority : allPostWithZhPriority;

	return (
		<div className="page-enter">
			<DotBackground>
				<Text/>
			</DotBackground>
			<Part className="gradient-background">
				<CardCollection>
					<PostCards infos={allPost} />
				</CardCollection>
			</Part>
		</div>
	);
}
