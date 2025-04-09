import type { MDXComponents } from "mdx/types";
import ImagePreview from "@/compoments/Blog/ImagePreview";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		img: (props) => {
			return <ImagePreview {...props} />;
		}
	};
}
