import { svgUrl } from "@/utils/constant";

const normalizeSrc = (src: string) => {
	return src.startsWith("/") ? src.slice(1) : src;
};

const svgLink = new Set(Object.values(svgUrl));

export default function cloudflareLoader(
	{ src, width, quality, }: { src: string; width: number; quality?: number }
) {
	if (process.env.NODE_ENV === "development") {
		return src;
	}

	// set

	if (svgLink.has(src)) {
		return src;
	}

	const params = [`width=${width}`, "format=auto"];
	if (quality) {
		params.push(`quality=${quality}`);
	}
	const paramsString = params.join(",");
	return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}