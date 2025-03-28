import { getContentsInfo } from "@/utils/contents/post";
import { ArticleCards } from "@/compoments/Blog/ArticleCard";
import CardCollection from "@/compoments/Blog/ArticleCollection";
import CardTitle from "@/compoments/Blog/ArticleTitle";
import Part from "@/compoments/Part";
import Chapter from "@/compoments/Text/Chapter";

export default async function BlogSection() {
    const metas = await getContentsInfo();
    const sortedByTime = metas.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
    const sortedByPin = sortedByTime.filter(it => it.pin);

    return (
        <Part className="gradient-background border-b border-dot">
            <Chapter>My blog</Chapter>

            {sortedByPin.length > 0 && (
                <>
                    <CardTitle title="Pinned Posts" />
                    <CardCollection>
                        <ArticleCards infos={sortedByPin} />
                    </CardCollection>
                </>
            )}

            <CardTitle title="Recent Posts" url={"/blog"} />
            <CardCollection>
                <ArticleCards infos={sortedByTime.slice(0, 4)} />
            </CardCollection>
            <CardTitle title="About linux" url={"/tags/linux"} />
            <CardCollection>
                <ArticleCards
                    infos={sortedByTime.filter((it) => it.categories.includes("linux"))}
                />
            </CardCollection>
        </Part>
    );
}
