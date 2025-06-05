import { Link } from "@/i18n/navigation";
import { allPostWithEnPriority, allPostWithZhPriority } from "@/utils/allpost";
import { getTranslations } from "next-intl/server";

interface Props {
	link: string;
}

export default async function InlineWikiLink(props: Props) {
	const { link } = props;
	console.log(link);
	const t = await getTranslations();
	const allPosts =
		t("lang") == "zh" ? allPostWithZhPriority : allPostWithEnPriority;

	const post = allPosts.find((it) => it.slug === link);
	if (!post) return null;

	const { title } = post;

	return (
		<Link href={`/blog/${link}`} className="link">
			{title}
		</Link>
	);
}
