import Link from "@/i18n/navigation";
import { MDXComponents } from "mdx/types";
import WikiLink from "../modules/posts/article/wiki-link";
import InlineWikiLink from "../modules/posts/article/inline-wiki-link";
import SkeletonImage from "../modules/posts/article/image/skelton-image";

const components: MDXComponents = {
	WikiLink,
	InlineWikiLink,
	img: (props) => {
		return <SkeletonImage {...props} />;
	},
	a: (props) => {
		const { href } = props;

		// if href is a hash link or external link, we don't need to do animation
		if ((href && href.startsWith("#")) || !href.startsWith("/")) {
			return (
				<Link
					{...props}
					href={href}
					className="link"
					data-disable-progress={true}
				/>
			);
		}

		return (
			<Link {...props} className="link" data-disable-progress={true} />
		);
	},
};

export default components;
