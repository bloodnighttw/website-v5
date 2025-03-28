const normalizeSrc = (src: string) => {
	return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader(
	{ src, width, quality, }: { src: string; width: number; quality?: number }
) {
	if (process.env.NODE_ENV === "development") {
		return src;
	}

	// if it is svg, return as it is
	if (src.endsWith(".svg")) {
		return src;
	}

	const params = [`width=${width}`, "format=auto"];
	if (quality) {
		params.push(`quality=${quality}`);
	}
	const paramsString = params.join(",");
	return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}