"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import { ListSvg, ToTop } from "@/app/assets/svg";
import Part from "@/compoments/Part";

interface LayoutProps {
	children: React.ReactNode;
}

interface TocProp {
	overBottom: boolean;
}

function Toc(prop: TocProp) {

	console.log(prop);
	const [open, setOpen] = React.useState(false);
	const divRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (prop.overBottom) {
			setOpen(false);
		}
	}, [prop.overBottom]);

	const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if(open && prop.overBottom){
			// scroll this div to the bottom
			e.currentTarget.scrollIntoView({
				behavior: "smooth",
				block: "end",
			})
		}
		setOpen(!open);
	},[open, prop.overBottom])

	const clickOutside = useCallback((e: MouseEvent) => {
		if (!divRef.current) return;
		if (!divRef.current.contains(e.target as Node)) {
			setOpen(false);
		}
	},[]);

	useEffect(() => {
		document.addEventListener("click", clickOutside);
		return () => {
			document.removeEventListener("click", clickOutside);
		};
	}, [clickOutside]);


	return (
		<div ref={divRef}>
			<div
				className={cn(
					"bg-bprimary h-8 w-8 rounded-full *:m-auto flex items-center justify-center scroll-mb-2",
					"border border-dot cursor-pointer active:scale-90 duration-200 relative",
				)}
				onClick={handleClick}
			>
				{ListSvg}
			</div>
			<div className={cn(
				"absolute w-96 h-96 border border-dot rounded right-0 bottom-9 bg-bprimary/80",
				"backdrop-blur p-2 duration-200 origin-bottom-right",
				open ? "scale-100" : "scale-0",
			)}>
				223
			</div>
		</div>
	)
}


export default function Page(prop:LayoutProps) {

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


	const tocDep = progress >= 99;

	const TocMemo = React.useMemo(() => (
		<Toc overBottom={tocDep}/>
	),[tocDep]);

	const bottomPanelMemo = React.useMemo(() => {
		return <div className={cn(
			progress === 100 && "absolute",
			progress < 100 && "fixed z-100",
			"duration-400 bottom-4 right-0 2xl:mr-[calc((-0.75rem+100svw-var(--size-width-max))/2)] mr-4 flex h-6 items-center gap-2"
		)}
		>
			<div
				className={cn(
					"cursor-pointer active:scale-90 duration-200",
					// to prevent the animation is triggered when first load
					progress === -1 && "hidden",
					progress === 0 && "fade-out",
					progress > 0 && "fade-in",
				)}
				// bring the element to the top
				onClick={(e)=> {
					e.preventDefault();
					if (!ref.current) return;
					document.body.scrollIntoView({ behavior: "smooth" });
				}}
			>
				{ToTop}
			</div>
			{TocMemo}
		</div>
	},[progress, TocMemo]);


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