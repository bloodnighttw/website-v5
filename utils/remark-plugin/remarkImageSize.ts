import { imageSize } from "image-size";
import { Image, Root } from "mdast";
import { selectAll } from "unist-util-select";
import { Transformer } from "unified";
import fs from "fs";

// Read or create cache file for image sizes
let imageCache: Map<string, { width: number; height: number; createAt: number }> = new Map();
const cacheFilePath = "./.next/remark-image.json";

try {
	if (fs.existsSync(cacheFilePath)) {
		const cacheData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
		imageCache = new Map(Object.entries(cacheData));
	} 
} finally{
	console.log("the map is not update")
}

async function writeCacheToFile(){
	// convert imageCache to json
	const cacheObject = Object.fromEntries(imageCache);

	await fs.promises.writeFile(cacheFilePath, JSON.stringify(cacheObject, null));
}


// fetch image and get its size
async function getImageSize(
	url: string,
): Promise<{ width: number; height: number }> {

	if(imageCache.has(url)){
		const cached = imageCache.get(url);
		if (cached && Date.now() - cached.createAt < 864000002628992000) { // 1 month
			return { width: cached.width, height: cached.height };
		}
	}

	const res = await fetch(url);
	if (!res.ok) throw new Error("Failed to fetch image");
	const buffer = Buffer.from(await res.arrayBuffer());
	const { width, height } = imageSize(buffer);
	imageCache.set(url, {
		width,
		height,
		createAt: Date.now()
	})

	writeCacheToFile()
	return { width, height };
}

export default function remarkPlugin(
): Transformer<Root, Root> {
	return async (root) => {
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
	};
}
