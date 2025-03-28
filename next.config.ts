import type { NextConfig } from "next";

const config: NextConfig = {
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
			}
		],
	},
};

const nextConfigPromise = async () => {

	if (process.env.NODE_ENV === "development") {
		const { setupDevPlatform } = await import("@cloudflare/next-on-pages/next-dev");
		await setupDevPlatform();
	}

	return config;
}

export default nextConfigPromise;
