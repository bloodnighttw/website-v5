import { ReactNode } from "react";
import cn from "@/utils/cn";

interface Props {
	children: ReactNode;
	className?: string;
}


export default function Scrolling(props: Props) {

	const className = cn("overflow-hidden scrolling sm:w-96", props.className);

	return (
		<div className={className}>
			<div>{props.children}</div>
			<div>{props.children}</div>
		</div>
	);
};