import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";
import { createMDX } from "fumadocs-mdx/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withMDX = createMDX();

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

	return await withContentCollections(withNextIntl(withMDX(config)));
};

export default nextConfigPromise;
