"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import Part from "@/compoments/Part";
import GoToTop from "@/compoments/Blog/Addon/GoToTop";
import Toc from "@/compoments/Blog/Addon/Toc";
import { TocTree } from "@/compoments/Blog/Addon/TocElement";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";

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

	const TocMemo = React.useMemo(() => (
		<Toc progressRef={progressRef} tocArray={prop.tocArray}/>
	),[prop.tocArray]);

	const goToTopMemo = React.useMemo(() => (
		<GoToTop progressRef={progressRef}/>
	),[]);

	const BottomPanel= ({className}: {className: string}) => {

		return <div className={cn(className,
			"duration-400 bottom-4 right-0 2xl:mr-[calc((-0.75rem+100svw-var(--size-width-max))/2)] mr-4 flex h-6 items-center gap-2"
		)}>
			{goToTopMemo}
			{TocMemo}
		</div>
	};

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
			{absolute ? <BottomPanel className="absolute"/> : createPortal(<BottomPanel className={cn("fixed")}/>, document.body)}
		</div>
	</div>
}