"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import cn from "@/utils/cn";
import { CircleArc } from "@/compoments/Blog/Addon/Radius";
import { TocElement, TocTree } from "@/compoments/Blog/Addon/TocElement";

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

	const [browseList, setBrowseList] = React.useState<number[]>([]);

	const tocElementsMemo = useMemo(()=> {
		return prop.tocArray.map((toc, index)=> {

			const add2List = () => {
				if(!browseList.includes(index)){
					const newList = [...browseList, index];
					setBrowseList(newList);
				}
			}

			const removeFromList = () => {
				if(browseList.includes(index)){
					const newList = [...browseList];
					newList.splice(newList.indexOf(index), 1);
					setBrowseList(newList);
				}
			}

			return <TocElement {...toc} key={toc.id} onScreen={add2List} leftScreen={removeFromList}/>
		})
	},[browseList, prop.tocArray])

	const smallestIndex = useMemo(() => {
		if(browseList.length === 0) return 0;
		return Math.min(...browseList);
	},[browseList]);


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
				"absolute max-h-[70vh] border border-dot rounded right-0 bottom-9 bg-bprimary/30",
				"backdrop-blur p-2 duration-200 origin-bottom-right *:not-first:py-0.5",
				"overflow-y-auto",
				open ? "scale-100" : "scale-0",
			)}>
				<div className="flex mb-1 gap-2 items-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
						 className="bi bi-justify-left" viewBox="0 0 16 16">
						<path fillRule="evenodd"
							  d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
					</svg>
					<p>Table of Contents</p>
				</div>

				<div className="relative">

					<div
						className="absolute top-0 left-0 w-0.5 ml-[7px] bg-secondary/80 duration-200 z-2"
						style={{
							"marginTop": `${smallestIndex * 1.5 + 0.125}rem`,
							"height": `${(browseList.length) * 1.5}rem`,
						}}
					/>

					<div
						className="absolute top-0 left-0 w-0.5 ml-[7px] mt-[0.125rem] h-[calc(100%-0.25rem)] bg-secondary/20 z-1"
					/>
					<div className="flex flex-col">
						{tocElementsMemo}
					</div>
				</div>
			</div>
		</div>
	)
}
