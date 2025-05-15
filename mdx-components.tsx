import type { MDXComponents } from "mdx/types";
import ImagePreview from "@/compoments/Blog/Image";
import WikiLink from "@/compoments/Blog/Addon/WikiLink";
import InlineWikiLink from "@/compoments/Blog/Addon/InlineWikiLink";
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
