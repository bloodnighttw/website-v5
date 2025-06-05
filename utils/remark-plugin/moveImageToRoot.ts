// this is a remark plugin that move image inside any markdown element to the root of the markdown element

import { visit } from "unist-util-visit";
import { Image, Root, RootContent, Parent } from "mdast";

export default function moveImageToRoot() {
	return (root: Root) => {
		visit(root, "image", (node: Image, index?: number, parent?: Parent) => {
			if (parent && parent.type !== "root") {
				if (!parent || !index) return;

				const imageNode = node;
				const imageParent = parent;

				// get the index of the parent node from the root
				const parentIndex = root.children.indexOf(
					imageParent as RootContent,
				);

				if (parentIndex === -1) return;

				// remove the image node from the parent node
				imageParent.children.splice(index, 1);

				// add the image node back to the root node at the index of the parent node
				root.children.splice(parentIndex, 0, imageNode);
			}
		});
	};
}
