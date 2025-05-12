import type { MetadataRoute } from 'next'
import { BASE_URL } from "@/utils/constant";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/cdn-cgi/',
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	}
}