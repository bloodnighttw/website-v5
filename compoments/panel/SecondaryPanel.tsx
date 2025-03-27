import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
	className?: string;
}

export default function SecondaryPanel(props: Props) {

	const className = clsx(
		"h-36 part bg-dotted flex items-center justify-center border-b border-dot",
		props.className
	)

	return <div className={className}>
		{props.children}
	</div>
}