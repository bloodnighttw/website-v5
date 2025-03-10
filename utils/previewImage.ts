import { Content, MkblogPlugin } from "@mkblog/core";
import { select } from "unist-util-select";
import { Image } from "mdast";

declare module "@mkblog/core" {
	interface Content<T> {
		previewImage: () => Promise<string | undefined>;
	}
}

const plugin: MkblogPlugin = {
	init: () => {
		Content.prototype.previewImage = async function() {
			const mdast = await this.mdast();
			const imageNode = select("image", mdast) as Image | null | undefined;
			return imageNode?.url;
		}
	}
}

export default plugin;