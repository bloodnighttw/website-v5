import { PostCards } from "@/components/modules/posts/section/card";
import PostCardGrid from "@/components/modules/posts/section/collection";
import PostSectionTitle from "@/components/modules/posts/section/title";
import Part from "@/components/shared/part";
import Chapter from "@/components/modules/home/chapter";
import PostSectionContainer from "@/components/modules/posts/section/container";
import { getTranslations } from "next-intl/server";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";

export default async function BlogSection() {
	const tt = await getTranslations();
	const lang = tt("lang");

	const allPosts =
		lang === "en" ? allPostWithEnPriority : allPostWithZhPriority;

	const sortedByPin = allPosts.filter((it) => it.pin);
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
					<PostCards infos={allPosts.slice(0, 4)} />
				</PostCardGrid>
			</PostSectionContainer>
			<PostSectionContainer>
				<PostSectionTitle
					title={t("about", { name: "linux" })}
					url={"/tags/linux"}
				/>
				<PostCardGrid>
					<PostCards
						infos={allPosts.filter((it) =>
							it.categories.includes("linux"),
						)}
					/>
				</PostCardGrid>
			</PostSectionContainer>
		</Part>
	);
}
