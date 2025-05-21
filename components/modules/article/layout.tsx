"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import Part from "@/components/shared/Part";
import GoToTop from "@/components/Blog/Addon/GoToTop";
import Toc from "@/components/Blog/Addon/Toc";
import { TocTree } from "@/components/Blog/Addon/TocElement";
import { useTranslations } from "next-intl";

interface LayoutProps {
	children: React.ReactNode;
	tocArray: TocTree[];
	publishAt: string;
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


	const bottomPanelMemo = React.useMemo(() => {
		return <div className={cn(
			absolute ? "absolute" : "fixed z-100",
			"duration-400 bottom-4 right-0 2xl:mr-[calc((-0.75rem+100svw-var(--size-width-max))/2)] mr-4 flex h-6 items-center gap-2"
		)}
		>
			<GoToTop progressRef={progressRef}/>
			<Toc progressRef={progressRef} tocArray={prop.tocArray}/>
		</div>
	},[absolute, prop.tocArray]);

	const t = useTranslations("Blog");

	return <div ref={ref}>
		{childrenMemo}
		<div className="relative border-b border-dot bg-bsecondary/60 h-14">
			<Part>
				<div className="hidden sm:flex justify-start items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						 className="bi bi-clock" viewBox="0 0 16 16">
						<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
						<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
					</svg>
					{t("published",  {date:prop.publishAt})}
				</div>
			</Part>
			{bottomPanelMemo}
		</div>
	</div>
}