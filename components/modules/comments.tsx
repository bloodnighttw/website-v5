"use client";

import Giscus from "@giscus/react";
import { BASE_URL } from "@/utils/constant";
import { usePathname } from "next/navigation";

export default function Comments() {

	const pathname = usePathname();

	const pathnameSegments = pathname.split("/");

	const lang = pathnameSegments[1];

	// get the last segment of the pathname
	const term = pathnameSegments[pathnameSegments.length - 1];

	return (
		<div>
			<Giscus
				repo="bloodnighttw/Giscus"
				repoId="R_kgDOOK1SwQ"
				mapping="specific"
				term={term}
				categoryId="DIC_kwDOOK1Swc4CoMm7"
				theme={`${BASE_URL}/giscus.css`}
				reactionsEnabled="0"
				inputPosition="top"
				lang={
					lang === "zh" ? "zh-TW" : lang === "en" ? "en" : "zh-TW"
				}
			/>
		</div>
	);
}
