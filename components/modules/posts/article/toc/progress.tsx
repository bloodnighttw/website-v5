import cn from "@/utils/cn";
import React, { useEffect } from "react";

export function ProgressArc(props: { progress: number }) {
	const progressHandled = props.progress >= 0 ? props.progress : 0;
	const [length, setLength] = React.useState(0);

	const [, startTransition] = React.useTransition();
	const radius = 7.5;


	useEffect(() => {
		startTransition(() => {
			const circumference = 2 * Math.PI * radius;
			const length = circumference * (progressHandled / 100);
			setLength(length);
		});
	},[progressHandled]);

	return (
		<svg width="32" height="32" viewBox="0 0 16 16">
			<circle
				cx="8"
				cy="8"
				r={radius}
				strokeWidth="1"
				strokeDasharray={`${length} 1000`}
				className="stroke-primary"
				transform="rotate(-90 8 8)"
			/>
			<path
				fillRule="evenodd"
				d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
				className={cn(
					"stroke-primary origin-center duration-200",
					length === 0 ? "scale-60" : "scale-50",
				)}
			/>
		</svg>
	);
}
