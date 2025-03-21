import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';


const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "r2.bntw.dev",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
			}
		],
	},
};

if (process.env.NODE_ENV === 'development') {
	await setupDevPlatform();
}

export default nextConfig;
