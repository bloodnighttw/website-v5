import { PostCards } from "@/components/modules/posts/section/card";
import PostCardGrid from "@/components/modules/posts/section/collection";
import PostSectionTitle from "@/components/modules/posts/section/title";
import Part from "@/components/shared/Part";
import Chapter from "@/components/Text/Chapter";
import { allPosts } from "content-collections";
import PostSectionContainer from "@/components/modules/posts/section/container";
import { getTranslations } from "next-intl/server";

export default async function BlogSection() {
	const sortedByTime = allPosts
		.slice()
		.sort((a, b) => b.date.getTime() - a.date.getTime());
	const sortedByPin = sortedByTime.filter((it) => it.pin);
	const t = await getTranslations("Blog");

	return (
		<Part className="gradient-background border-b border-dot">
			<Chapter>{t("My blog")}</Chapter>

			{sortedByPin.length > 0 && (
				<PostSectionContainer>
					<PostSectionTitle title={t("pinned")} />
					<PostCardGrid>
						<PostCards infos={sortedByPin} />
					</PostCardGrid>
				</PostSectionContainer>
			)}

			<PostSectionContainer>
				<PostSectionTitle title={t("Recent Posts")} url={"/blog"} />
				<PostCardGrid>
					<PostCards infos={sortedByTime.slice(0, 4)} />
				</PostCardGrid>
			</PostSectionContainer>
			<PostSectionContainer>
				<PostSectionTitle title={t("about",{name:"linux"})} url={"/tags/linux"} />
				<PostCardGrid>
					<PostCards
						infos={sortedByTime.filter((it) =>
							it.categories.includes("linux"),
						)}
					/>
				</PostCardGrid>
			</PostSectionContainer>
		</Part>
	);
}
