import { ReactNode } from "react";
import cn from "@/utils/cn";

interface Props {
	children: ReactNode;
	className?: string;
}


export default function Scrolling(props: Props) {

	const className = cn(
		"overflow-hidden scrolling sm:w-96 flex flex-row overflow-hidden sm:mask-lg sm:ml-auto",
		"*:flex *:flex-row *:gap-8 *:pr-8",
		"*:animation-scrolling",
		props.className
	);

	return (
		<div className={className}>
			<div>{props.children}</div>
			<div>{props.children}</div>
		</div>
	);
};