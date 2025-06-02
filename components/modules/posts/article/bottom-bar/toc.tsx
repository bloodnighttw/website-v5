"use client";

import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import cn from "@/utils/cn";
import { ProgressArc } from "@/components/modules/posts/article/bottom-bar/progress";
import {
	TocElement,
	TocTree,
} from "@/components/modules/posts/article/bottom-bar/toc-element";
import { useTranslations } from "next-intl";

interface TocProp {
	progress: number;
	tocArray: TocTree[];
}

interface TocSideLineState {
	heightDP: number[];
	browseList: number[];
	height: number;
	mt: number;
}

export type TocSideLineAction =
	| { type: "initNew"; payload: number } // init new line
	| { type: "add"; payload: number } // index of the element to add
	| { type: "remove"; payload: number }; // index of the element to remove

function update(newBrowseList: number[], heightDP: number[]) {
	// TODO: can be optimized
	const list = newBrowseList.sort((a, b) => a - b);

	const maxIdx = Math.max(...list);
	const minIdx = Math.min(...list);

	const mt = heightDP[minIdx - 1];
	const height = heightDP[maxIdx] - mt;

	return {
		list,
		mt,
		height,
	};
}

function reducer(
	state: TocSideLineState,
	action: TocSideLineAction,
): TocSideLineState {
	switch (action.type) {
		case "initNew": {
			const lastHeight = state.heightDP[state.heightDP.length - 1];
			const newHeight = lastHeight + action.payload;
			return {
				...state,
				heightDP: [...state.heightDP, newHeight],
			};
		}
		case "add": {
			const idx = action.payload + 1;
			if (state.browseList.includes(idx)) return state;

			const newState = update([...state.browseList, idx], state.heightDP);

			return {
				...state,
				browseList: newState.list,
				height: newState.height,
				mt: newState.mt,
			};
		}
		case "remove": {
			const idx = action.payload + 1;
			if (!state.browseList.includes(idx)) return state;

			const newBrowseList = state.browseList.filter(
				(item) => item !== idx,
			);

			const newState = update(newBrowseList, state.heightDP);

			return {
				...state,
				browseList: newState.list,
				height: newState.height,
				mt: newState.mt,
			};
		}
		default:
			return state;
	}
}

export default function Toc({progress, tocArray}: TocProp) {
	const [open, setOpen] = React.useState(false);
	const [tocSideLine, dispatch] = useReducer(reducer, {
		heightDP: [0],
		browseList: [],
		height: 0,
		mt: 0,
	});

	const divRef = React.useRef<HTMLDivElement>(null);

	const handleClick = useCallback(() => {
		setOpen(!open);
		if (!open) {
			divRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
			return;
		}
	}, [open]);

	useEffect(() => {
		const clickOutside = (e: MouseEvent) => {
			if (!divRef.current) return;

			if (!divRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("click", clickOutside);
		return () => {
			document.removeEventListener("click", clickOutside);
		};
	}, []);

	const tocElementsMemo = useMemo(() => {
		return tocArray.map((toc, index) => {
			return (	// TODO: can be optimized

				<TocElement
					{...toc}
					key={toc.id}
					index={index}
					dispatch={dispatch}
				/>
			);
		});
	}, [tocArray]);

	const t = useTranslations("Blog");

	return (
		<div ref={divRef}>
			<div
				className={cn(
					"bg-bsecondary h-8 w-8 rounded-full *:m-auto flex items-center justify-center",
					"cursor-pointer active:scale-90 duration-200 relative fade-in",
				)}
				onClick={handleClick}
			>
				<ProgressArc progress={progress} />
			</div>
			<div
				className={cn(
					"absolute max-h-[70vh] border border-dot rounded right-0 bottom-9 bg-bprimary/30 backdrop-blur",
					"p-2 duration-200 origin-bottom-right *:not-first:py-0.5",
					"overflow-y-auto",
					open ? "scale-100" : "scale-0",
				)}
			>
				<div className="flex mb-1 gap-2 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-justify-left"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
						/>
					</svg>
					<p>{t("Table of Contents")}</p>
				</div>

				<div className="relative">
					<div
						className="absolute top-0.5 left-0 w-0.5 ml-[7px] bg-primary/80 duration-200 z-2"
						style={{
							marginTop: `${tocSideLine.mt}px`,
							height: `${tocSideLine.height}px`,
						}}
					/>

					<div className="absolute top-0 left-0 w-0.5 ml-[7px] mt-[0.125rem] h-[calc(100%-0.25rem)] bg-secondary/20 z-1" />
					<div className="flex flex-col">{tocElementsMemo}</div>
				</div>
			</div>
		</div>
	);
}
