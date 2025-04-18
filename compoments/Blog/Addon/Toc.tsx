import React, { useCallback, useEffect, useMemo } from "react";
import cn from "@/utils/cn";

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

interface TocTree{
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
	id: string;
}

function TocElement(toc: TocTree){

	return <a href={`#${toc.id}`} className={cn(
		"w-60 border-l border-dot hover:border-primary hover:bg-bsecondary/40 rounded-r",
		toc.depth === 1 && "pl-4",
		toc.depth === 2 && "pl-8",
		toc.depth > 2 && "pl-12",
		toc.depth > 3 && "text-primary/90",
	)}>
		{toc.text}
	</a>

}

interface TocProp {
	progressRef: React.RefObject<number>;
	tocArray: TocTree[]
}

export default function Toc(prop: TocProp) {

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

	const tocElementsMemo = useMemo(()=> {
		return prop.tocArray.map((toc)=> {
			return <TocElement {...toc} key={toc.id}/>
		})
	},[prop.tocArray])


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
				"absolute max-h-[70vh] border border-dot rounded right-0 bottom-9 bg-bprimary/80",
				"backdrop-blur p-2 duration-200 origin-bottom-right flex flex-col *:not-first:py-0.5",
				"overflow-y-auto",
				open ? "scale-100" : "scale-0",
			)}>
				<div className="mb-1">Table of content</div>
				{tocElementsMemo}
			</div>
		</div>
	)
}
