import cn from "@/utils/cn";
import { ReactNode } from "react";

interface Props {
	className?: string;
	children: ReactNode;
	ref?: React.RefObject<HTMLDivElement | null>;
}

export default function Part(props: Props) {
	const className = cn(
		"p-4",
		"*:mx-auto *:max-w-[var(--size-width-max)]",
		"*:not-first:mt-4",
		"w-full",
		props.className,
	);

	return <div className={className} ref={props.ref}>{props.children}</div>;
}
