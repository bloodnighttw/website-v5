import { ArticleCards } from "@/components/Blog/ArticleCard";
import CardCollection from "@/components/Blog/ArticleCollection";
import CardTitle from "@/components/Blog/ArticleTitle";
import Part from "@/components/Part";
import Chapter from "@/components/Text/Chapter";
import { allPosts } from "content-collections";
import ArticleContainer from "@/components/Blog/ArticleContainer";
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
				<ArticleContainer>
					<CardTitle title={t("pinned")} />
					<CardCollection>
						<ArticleCards infos={sortedByPin} />
					</CardCollection>
				</ArticleContainer>
			)}

			<ArticleContainer>
				<CardTitle title={t("Recent Posts")} url={"/blog"} />
				<CardCollection>
					<ArticleCards infos={sortedByTime.slice(0, 4)} />
				</CardCollection>
			</ArticleContainer>
			<ArticleContainer>
				<CardTitle title={t("about",{name:"linux"})} url={"/tags/linux"} />
				<CardCollection>
					<ArticleCards
						infos={sortedByTime.filter((it) =>
							it.categories.includes("linux"),
						)}
					/>
				</CardCollection>
			</ArticleContainer>
		</Part>
	);
}
