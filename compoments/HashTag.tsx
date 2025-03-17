import React from "react";
import Link from "next/link";

export default function HashTag({className, tags}: {className?: string, tags: string}) {
	return <Link className={`hashtag ${className}`} href={"/tags/"+tags}>
		{tags}
	</Link>
}