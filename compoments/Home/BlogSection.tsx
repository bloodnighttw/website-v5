import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import CardCollection from "@/compoments/Blog/ArticleCollection";
import CardTitle from "@/compoments/Blog/ArticleTitle";
import Part from "@/compoments/Part";
import Chapter from "@/compoments/Text/Chapter";
import { allPosts } from "content-collections";
import ArticleContainer from "@/compoments/Blog/ArticleContainer";
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
					<CardTitle title="Pinned Posts" />
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
