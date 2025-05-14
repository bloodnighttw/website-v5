import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { Node, Parent, RootContent, Paragraph } from "mdast";

const WIKI_LINK_REGEX = /^\[\[(.*?)]]$/;

function remarkWikiLinks() {

	return (root: Node) => {
		visit(root, "paragraph", (node: Paragraph, index: number, parent: Parent) => {
			const content = toString(node);
			const match = content.match(WIKI_LINK_REGEX);

			if (!match) return;

			const url = match[1];

			console.log(url)

			// create a wiki link mdx component\
			const linkNode = {
				type: "mdxJsxFlowElement",
				name: "WikiLink",
				children: [],
				attributes: [
					{
						type: "mdxJsxAttribute",
						name: "link",
						value: url,
					},
				]
			};

			// add component to parent
			parent.children.splice(index, 1, linkNode as RootContent);


			// Replace the original text node with the Link component
			// parent.children.splice(index, 1, linkNode as RootContent);
		});
	};
}

export default remarkWikiLinks;