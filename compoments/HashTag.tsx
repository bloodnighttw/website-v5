import React from "react";
import Link from "@/i18n/navigation";
import cn from "@/utils/cn";

interface Props {
	className?: string;
	tags: string;
}

export default function HashTag({ className, tags }: Props) {
	const classNameMix = cn("hashtag", className);

	return (
		<Link className={classNameMix} href={"/tags/" + tags}>
			{tags}
		</Link>
	);
}
