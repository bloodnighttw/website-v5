import React from "react";
import Link from "next/link";
import cn from "@/utils/cn";

interface Props {
	className?: string;
	tags: string;
}

export default function HashTag({className, tags}: Props) {

	const classNameMix = cn(
		"hashtag",
		className
	)

	return <Link className={classNameMix} href={"/tags/"+tags}>
		{tags}
	</Link>
}