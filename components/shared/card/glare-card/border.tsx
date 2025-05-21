import cn from "@/utils/cn";
import React, { ReactNode } from "react";

export interface BorderProps {
	children: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function GlareCardBorder(props: BorderProps) {
	return (
		<div className={cn("w-full h-full p-0.75 flex flex-col", props.className)} style={props.style}>
			{props.children}
		</div>
	);
}
