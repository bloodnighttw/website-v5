import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeStarryNight from "rehype-starry-night";
import rehypeLineNumbers from "@/utils/rehype-plugin/line-numbers";
import remarkImageSize from "@/utils/remark-plugin/remarkImageSize";
import remarkHeadingId from "@/utils/remark-plugin/remarkHeadingId";

const withMDX = createMDX({
	options: {
		remarkPlugins: [
			remarkFrontmatter,
			remarkMdxFrontmatter,
			remarkImageSize,
			remarkHeadingId,
		],
		rehypePlugins: [rehypeStarryNight, rehypeLineNumbers],
	},
});

const config: NextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	/* config options here */
	images: {
		loader: "custom",
		loaderFile: "./utils/image-loader.ts",
		minimumCacheTTL: 2678400,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "r2.bntw.dev",
			},
		],
	},
};

const nextConfigPromise = async () => {
	if (process.env.NODE_ENV === "development") {
		const { setupDevPlatform } = await import(
			"@cloudflare/next-on-pages/next-dev"
		);
		await setupDevPlatform();
	}

	return await withContentCollections(withMDX(config));
};

export default nextConfigPromise;
