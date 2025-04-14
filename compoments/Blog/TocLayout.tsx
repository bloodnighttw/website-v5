"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import { ToTop } from "@/app/assets/svg";
import Link from "next/link";
import Part from "@/compoments/Part";

interface Props {
	children: React.ReactNode;
}


export default function Page(prop:Props) {

	const [progress, setProgress] = React.useState(-1); //-1 means first load
	const ref = React.useRef<HTMLDivElement>(null);

	const handleScroll = useCallback(() => {

		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();

		// the height of the window
		const windowHeight = window.innerHeight;

		// this is the top position of the div
		const y = window.scrollY + rect.y;

		// this is the distance from the top of the window to the bottom of the div
		const translation = windowHeight - y;

		// the top position of the div
		const rectTop = rect.top;

		// the bottom position of the div
		const rectBottom = rect.bottom;


		// the distance from the top of the div to the bottom of the window
		const diff = Math.floor(( (windowHeight-rectTop-translation)));

		// the percentage of the div that is visible
		const percent = Math.floor((diff / (rectBottom - rectTop-translation)) * 100);

		if(percent === 0 && progress === -1) {
			// this is the first load, and we don't need to update the progress since it is at 0%
			return;
		}

		setProgress(percent > 100 ? 100 : percent);
	},[progress]);

	useEffect(() => {
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	const childrenMemo = React.useMemo(() => {
		return prop.children
	},[prop.children])

	const progressMemo = React.useMemo(() => {
		return <div className={cn(
			progress === 100 && "absolute",
			progress < 100 && "fixed z-100",
			"duration-400 bottom-4 right-0 2xl:mr-[calc((-0.75rem+100svw-var(--size-width-max))/2)] mr-4 flex h-6 items-center gap-4"
		)}
		>
			<Link
				className={cn(
					// to prevent the animation is triggered when first load
					progress === -1 && "hidden",
					progress === 0 && "fade-out",
					progress > 0 && "fade-in",
				)}
				href={"#"}
			>
				{ToTop}
			</Link>
		</div>
	},[progress]);


	return <div ref={ref}>
		{childrenMemo}
		<div className="relative border-b border-dot">
			<Part>
				<div>publish at</div>
			</Part>
			{progressMemo}
		</div>
	</div>
}