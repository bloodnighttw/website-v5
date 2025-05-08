import Link from "@/i18n/navigation";
import React from "react";
import cn from "@/utils/cn";

interface Props {
	children: React.ReactNode;
	href: string;
	text: string;
}

export default function PanelButton(props: Props) {

	return <Link href={props.href} className={cn(
		"rounded border border-secondary/25",
		"hover:border-secondary/40 h-8 px-4 hover:-translate-y-0.25 duration-200",
		"hidden sm:flex items-center justify-center text-sm gap-2 font-mono",
		"*:fill-secondary *:text-secondary hover:*:fill-primary hover:*:text-primary *:h-4",
	)}>
		<div className="flex gap-1.5">
			{props.children}
			<p>{props.text}</p>
		</div>
	</Link>
}