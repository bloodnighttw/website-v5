"use client";

import Giscus from "@giscus/react";
import { BASE_URL } from "@/utils/constant";

export default function Comments() {
	return (
		<div>
			<Giscus
				repo="bloodnighttw/Giscus"
				repoId="R_kgDOOK1SwQ"
				mapping="pathname"
				categoryId="DIC_kwDOOK1Swc4CoMm7"
				theme={`${BASE_URL}/giscus.css`}
				reactionsEnabled="0"
				inputPosition="top"
			/>
		</div>
	);
}
