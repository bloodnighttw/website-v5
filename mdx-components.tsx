import type { MDXComponents } from "mdx/types";
import ImagePreview from "@/compoments/Blog/Image";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		img: (props) => {
			return <ImagePreview {...props} />;
		},
		a: (props) =>{

			const { href } = props;

			// if href is a hash link or external link, we don't need to do animation
			if (href && (href.startsWith("#") || !href.startsWith("/"))) {
				return <Link
					{...props}
					href={href}
					data-disable-progress={true}
				/>
			}

			return <Link
				{...props}
				data-disable-progress={true}
			/>
		}
	};
}
