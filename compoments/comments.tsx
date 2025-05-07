"use client";

import Giscus from "@giscus/react";
import { BASE_URL } from "@/utils/constant";
import { usePathname } from "next/navigation";

export default function Comments() {

	const pathname = usePathname();

	const lastSlashIndex = pathname.lastIndexOf("/");
	const term = pathname.substring(lastSlashIndex + 1);

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
			/>
		</div>
	);
}
