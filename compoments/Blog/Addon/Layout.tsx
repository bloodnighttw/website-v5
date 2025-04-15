"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import Part from "@/compoments/Part";
import GoToTop from "@/compoments/Blog/Addon/GoToTop";
import Toc from "@/compoments/Blog/Addon/Toc";

interface LayoutProps {
	children: React.ReactNode;
}



export default function Page(prop:LayoutProps) {

	const ref = React.useRef<HTMLDivElement>(null);
	const [absolute, setAbsolute] = React.useState(true);
	const progressRef = React.useRef(-1);

	const handleProgress = useCallback(() => {

		if(!ref.current) return;

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
		progressRef.current = (diff / (rectBottom - rectTop - translation)) * 100;
	},[]);

	const handleScroll = useCallback(() => {

		if(progressRef.current === -1) return;

		const progressValue = progressRef.current;

		if( progressValue < 100) {
			setAbsolute(false);
		} else {
			setAbsolute(true);
		}
	},[])

	useEffect(() => {

		handleProgress();
		handleScroll();

		window.addEventListener("scroll", handleProgress);
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleProgress);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleProgress, handleScroll]);


	const childrenMemo = React.useMemo(() => {
		return prop.children
	},[prop.children])

	const TocMemo = React.useMemo(() => (
		<Toc progressRef={progressRef}/>
	),[]);

	const goToTopMemo = React.useMemo(() => (
		<GoToTop progressRef={progressRef}/>
	),[]);

	const bottomPanelMemo = React.useMemo(() => {
		return <div className={cn(
			absolute ? "absolute" : "fixed z-100",
			"duration-400 bottom-4 right-0 2xl:mr-[calc((-0.75rem+100svw-var(--size-width-max))/2)] mr-4 flex h-6 items-center gap-2"
		)}
		>
			{goToTopMemo}
			{TocMemo}
		</div>
	},[TocMemo, absolute, goToTopMemo]);

	return <div ref={ref}>
		{childrenMemo}
		<div className="relative border-b border-dot bg-bsecondary/60">
			<Part>
				<div>publish at</div>
			</Part>
			{bottomPanelMemo}
		</div>
	</div>
}