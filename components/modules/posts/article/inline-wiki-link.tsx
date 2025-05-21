import {Link} from "@/i18n/navigation";
import { allPosts } from "content-collections";

interface Props {
	link: string;
}

export default async function InlineWikiLink(props: Props) {

	const { link } = props;
	console.log(link);
	const post = allPosts.find((it) => it.slug === link);

	if (!post) return null;

	const { title } = post;


	return (
		<Link href={`/blog/${link}`} className="link">
			{title}
		</Link>
	);
}