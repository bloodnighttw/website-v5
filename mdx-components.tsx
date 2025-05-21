import type { MDXComponents } from "mdx/types";
import ImagePreview from "@/components/modules/posts/article/image";
import WikiLink from "@/components/modules/posts/article/wiki-link";
import InlineWikiLink from "@/components/modules/posts/article/inline-wiki-link";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		WikiLink,
		InlineWikiLink,
		img: (props) => {
			return <ImagePreview {...props} />;
		},
		a: (props) =>{

			const { href } = props;

			// if href is a hash link or external link, we don't need to do animation
			if (href && href.startsWith("#") || !href.startsWith("/")) {
				return <Link
					{...props}
					href={href}
					className="link"
					data-disable-progress={true}
				/>
			}

			return <Link
				{...props}
				className="link"
				data-disable-progress={true}
			/>
		}
	};
}
