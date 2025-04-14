"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import { ToTop } from "@/app/assets/svg";
import Part from "@/compoments/Part";

interface LayoutProps {
	children: React.ReactNode;
}

interface TocProp {
	progressRef: React.RefObject<number>;
}

function CircleArc(props: { progress: number }) {

	const progressHandled = props.progress >= 0 ? props.progress : 0;

	const radius = 7.5;
	const circumference = 2 * Math.PI * radius;
	const length = circumference * (progressHandled / 100);

	return (
		<svg
			width="32"
			height="32"
			viewBox="0 0 16 16"
		>
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
					length === 0 ? "scale-60" : "scale-50" ,

				)}
			/>
		</svg>
	);

}

function Toc(prop: TocProp) {

	const [open, setOpen] = React.useState(false);
	const [progress, setProgress] = React.useState(0);

	const divRef = React.useRef<HTMLDivElement>(null);

	const handleScroll = useCallback(() => {

		if(!divRef.current) return;

		const progressValue = prop.progressRef.current;

		setProgress(progressValue > 100 ? 100 : progressValue);

	},[prop.progressRef]);

	useEffect(() => {
		handleScroll()
		window.addEventListener("scroll", handleScroll);
		window.addEventListener("scrollend", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("scrollend", handleScroll);
		};
	}, [handleScroll]);

	useEffect(() => {
		if(progress === 100){
			setOpen(false);
		}
	}, [progress]);

	const handleClick = useCallback(() => {
		setOpen(!open);
		if(!open){
			divRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end"
			});
			return;
		}

	},[open])

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
		<div className="scroll-mb-2" ref={divRef}>
			<div
				className={cn(
					"bg-bprimary h-8 w-8 rounded-full *:m-auto flex items-center justify-center",
					"cursor-pointer active:scale-90 duration-200 relative",
				)}
				onClick={handleClick}
			>
				<CircleArc progress={prop.progressRef.current} />
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


interface GoToTopProps {
	progressRef: React.RefObject<number>;
}

type StyleState = -1 | 0 | 1;

function GoToTop({progressRef}: GoToTopProps) {

	const [styleState, setStyleState] = React.useState<StyleState>(-1);

	const handleScroll = useCallback(() => {

		if(progressRef.current === -1) return;

		const progressValue = progressRef.current;

		if( progressValue <= 0){
			if( styleState === -1)
				return;
			setStyleState(0)
		} else if (progressValue > 0) {
			setStyleState(1);
		}

	},[styleState, progressRef])

	useEffect(() => {
		// don't touch it, it's a hack to make the animation work
		const task = setTimeout(()=>{
			handleScroll();
		}, 0);
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(task);
		};
	}, [handleScroll]);

	return <div
		className={cn(
			"cursor-pointer active:scale-90 duration-200",
			// to prevent the animation is triggered when first load
			styleState === -1 && "hidden",
			styleState === 0 && "fade-out",
			styleState === 1 && "fade-in",
		)}
		// bring the element to the top
		onClick={(e)=> {
			e.preventDefault();
			document.body.scrollIntoView({ behavior: "smooth" });
		}}
	>
		{ToTop}
	</div>
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