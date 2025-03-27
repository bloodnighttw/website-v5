import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface Props {
	className?: string;
	tags: string;
}

export default function HashTag({className, tags}: Props) {

	const classNameMix = clsx(
		"hashtag",
		className
	)

	return <Link className={classNameMix} href={"/tags/"+tags}>
		{tags}
	</Link>
}