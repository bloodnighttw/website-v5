import { BASE_URL, svgUrl } from "@/utils/constant";

const normalizeSrc = (src: string) => {
	return src.startsWith("/") ? src.slice(1) : src;
};

const svgLink = new Set(Object.values(svgUrl));

export default function cloudflareLoader({
	src,
	width,
	quality,
}: {
	src: string;
	width?: number;
	quality?: number;
}) {
	if (process.env.NODE_ENV === "development") {
		return src;
	}

	if (svgLink.has(src)) {
		return src;
	}

	const widthArgs = quality === 0 ? "auto" : width ? `${width}` : "auto";

	const params = [`width=${widthArgs}`, "format=auto"];
	if (quality && quality > 0) {
		params.push(`quality=${quality}`);
	}
	const paramsString = params.join(",");
	return `${BASE_URL}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}
