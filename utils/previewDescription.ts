import { Content, MkblogPlugin } from "@mkblog/core";
import { selectAll } from "unist-util-select";
import {Text} from "mdast"

declare module "@mkblog/core" {
	interface Content<T> {
		previewDescription: () => Promise<string | undefined>;
	}
}

const plugin: MkblogPlugin = {
	init: () => {
		Content.prototype.previewDescription = async function() {
			const hast = await this.mdast();
			const allTextNode = selectAll("text", hast) as Text[];

			let tempText = "";

			for (const node of allTextNode) {
				if (tempText.length > 200) {
					break;
				}
				tempText += node.value;
			}

			return tempText;
		}
	}
}

export default plugin;
