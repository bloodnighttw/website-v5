"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";

interface Props {
	src: string;
	alt: string;
	height: number;
	width: number;
	className?: string;
}

type Action = |
	{ type: "open/close" } |
	// x and y are the translation of the image we have to move.
	{ type: "zoomIn/Out" } |
	// scale is the scale of the image we have to change.
	{ type: "changeScale", payload: { scale: number } } |
	// reset the state
	{ type: "reset" };

interface State {
	open: boolean; // default false
	scale: number; // default 1
	currentScale: number; // default 1
}

function reducer(state: State, action: Action): State {

	switch (action.type) {
		case "open/close":
			return {
				...state,
				open: !state.open,
				currentScale: 1,
			};
		case "zoomIn/Out":
			return {
				...state,
				currentScale: state.currentScale === 1 ? state.scale : 1,
			};
		case "changeScale":
			return {
				...state,
				scale: action.payload.scale,
			};
		case "reset":
			return {
				...state,
				currentScale: 1,
			};
		default:
			return state;
	}
}

const defaultState: State = {
	open: false,
	scale: 2,
	currentScale: 1,
}

export default function ImagePreview(props: Props) {

	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const [dragging, setDragging] = React.useState(false);
	const imageDivRef = React.useRef<HTMLDivElement>(null);
	// This is used to store the mouse position when dragging
	const mousePositionRef = React.useRef({ x: 0, y: 0 });
	// This is used to store the initial scroll position of the imageDiv
	const initialScrollRef = React.useRef({ left: 0, top: 0 });

	// Disable scrolling when open
	useEffect(() => {
		if (state.open) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => document.body.classList.remove("overflow-hidden");
	}, [state.open]);

	const handleOverlayClick = useCallback((e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			dispatch({ type: "open/close" });
		}
	}, [dispatch]);

	const handleImageClick = useCallback(
		(e: React.MouseEvent<HTMLImageElement>) => {
			e.stopPropagation();

			if (state.currentScale !== state.scale) {
				dispatch({ type: "zoomIn/Out" });
			} else {
				dispatch({ type: "reset" });
			}

		},
		[state.currentScale, state.scale]
	);

	const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
		if (state.currentScale === state.scale) {
			setDragging(true);
			const imageDiv = imageDivRef.current!;

			mousePositionRef.current = {
				x: e.clientX,
				y: e.clientY
			};

			initialScrollRef.current = {
				left: imageDiv.scrollLeft,
				top: imageDiv.scrollTop
			};
		}
	};

	const handleDrag = (e: React.DragEvent<HTMLImageElement>) => {
		if (dragging && e.clientX && e.clientY) {
			const imageDiv = imageDivRef.current!;
			const dx = e.clientX - mousePositionRef.current.x;
			const dy = e.clientY - mousePositionRef.current.y;

			imageDiv.scrollLeft = initialScrollRef.current.left - dx;
			imageDiv.scrollTop = initialScrollRef.current.top - dy;
		}
	};

	const handleDragEnd = () => {
		setDragging(false);
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
		if (state.currentScale === state.scale) {
			setDragging(true);
			const imageDiv = imageDivRef.current!;
			const touch = e.touches[0];

			mousePositionRef.current = {
				x: touch.clientX,
				y: touch.clientY
			};

			initialScrollRef.current = {
				left: imageDiv.scrollLeft,
				top: imageDiv.scrollTop
			};
		}
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
		if (dragging) {
			e.preventDefault();
			const imageDiv = imageDivRef.current!;
			const touch = e.touches[0];
			const dx = touch.clientX - mousePositionRef.current.x;
			const dy = touch.clientY - mousePositionRef.current.y;

			imageDiv.scrollLeft = initialScrollRef.current.left - dx;
			imageDiv.scrollTop = initialScrollRef.current.top - dy;
		}
	};

	const handleTouchEnd = () => {
		setDragging(false);
	};

	return (
		<>
			{state.open && (
				<div
					className="fixed gap-8 inset-0 bg-bsecondary/50 backdrop-blur-md flex flex-col items-center justify-center z-50"
					onClick={handleOverlayClick}
				>
					<div className="w-auto h-auto border-gray-200/20 max-w-[90vw] max-h-[80vh] rounded-lg flex overflow-hidden my-auto" ref={imageDivRef}>
						<img
							{...props}
							src={props.src}
							alt={props.alt}
							className={cn(
								"shadow cursor-zoom-in my-auto z-1000 duration-200",
								state.currentScale === state.scale && "cursor-move",
							)}
							loading="lazy"
							style={{
								transform: `scale(${state.currentScale})`,
								transformOrigin: `left top`,
							}}
							draggable={state.currentScale === state.scale}
							onClick={handleImageClick}
							onDragStart={handleDragStart}
							onDrag={handleDrag}
							onDragEnd={handleDragEnd}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						/>
					</div>
				</div>
			)}
			<div className="group relative cursor-pointer rounded"
				 onClick={() => dispatch({ type: "open/close" })}
			>
				<img
					{...props}
					src={props.src}
					alt={props.alt+" - preview"}
					className="rounded"
				/>
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
					<span className="text-lg text-secondary/70">Click to view full size</span>
				</div>
			</div>
			<span className="text-lg text-secondary/70 text-center flex justify-center mt-1">
        		{props.alt}
      		</span>
		</>
	);
}

