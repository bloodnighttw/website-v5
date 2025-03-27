import cn from "@/utils/cn";
import { ReactNode } from "react";

interface Props{
	className?: string;
	children: ReactNode;
}


export default function Part(props: Props){

	const className = cn(
		"p-4",
		"*:mx-auto *:max-w-[var(--size-width-max)]",
		"w-full",
		props.className
	)

	return <div className={className}>
		{props.children}
	</div>

}