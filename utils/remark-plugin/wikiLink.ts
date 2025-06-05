import { visit } from "unist-util-visit";
import { Node, Parent, RootContent, Text } from "mdast";

const WIKI_LINK_REGEX = /^\[\[(.+?)]]$/;
const INLINE_WIKI_LINK_REGEX = /^(.*?)\[\[(.+?)]](.*?)$/;

function remarkWikiLinks() {
	return (root: Node) => {
		visit(root, "text", (node: Text, index: number, parent: Parent) => {
			if (parent.type === "paragraph" && parent.children.length === 1) {
				// replace the whole paragraph with the custom component

				const text = node.value;
				const match = text.match(WIKI_LINK_REGEX);
				if (match) {
					const url = match[1];

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
						],
					};

					// clean the parent node
					(Object.keys(parent) as Array<keyof Parent>).forEach(
						(key) => {
							delete parent[key];
						},
					);

					// set the parent node to the link node
					Object.assign(parent, linkNode);
					return;
				}
			}

			// if previous code is not executed, it means the text node is an inline wiki link
			const text = node.value;
			const match = text.match(INLINE_WIKI_LINK_REGEX);

			if (!match) return;

			const [, before, url, after] = match;

			const leftText = {
				type: "text",
				value: before,
			};

			const inlineLinkNode = {
				type: "mdxJsxFlowElement",
				name: "InlineWikiLink",
				children: [],
				attributes: [
					{
						type: "mdxJsxAttribute",
						name: "link",
						value: url,
					},
				],
			};

			const rightText = {
				type: "text",
				value: after,
			};

			const children = [leftText, inlineLinkNode, rightText];

			// replace to the original text node with the new children
			parent.children.splice(index, 1, ...(children as RootContent[]));
		});
	};
}

export default remarkWikiLinks;
