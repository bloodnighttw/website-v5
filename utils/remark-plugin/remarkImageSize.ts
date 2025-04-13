import {imageSize} from "image-size";
import { Image, Root } from "mdast";
import { selectAll } from "unist-util-select";
import {Transformer} from "unified";

// fetch image and get its size
async function getImageSize(
	url: string,
): Promise<{ width: number; height: number }> {
	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch image");
	const buffer = Buffer.from(await res.arrayBuffer());
	const { width, height } = imageSize(buffer);
	return { width, height };
}

export default function remarkPlugin(): Transformer<Root,Root>{

	return async (root)=> {

		const imageNodes = selectAll("image", root) as Image[];

		const promises = imageNodes.map(async (node) => {
			if (!node.url) return;
			const { width, height } = await getImageSize(node.url);
			node.data = {
				hProperties: {
					width,
					height,
				},
			};
		});

		await Promise.all(promises);
	}

}
