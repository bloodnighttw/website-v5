"use client";

import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import Image from "next/image";

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
	{ type: "zoomIn/Out", x: number, y: number } |
	// scale is the scale of the image we have to change.
	{ type: "updatePosition", payload: { x: number, y: number } } |
	// dragging related actions
	{ type: "draggingOn" } |
	{ type: "draggingOff" } |
	// reset the state
	{ type: "reset" };

interface State {
	dragging: boolean; // default false
	open: boolean; // default false
	scale: number; // default 2. This is the scale of the image we have to change.
	currentScale: number; // default 1
	x: number; // default 0
	y: number; // default 0
}

function reducer(state: State, action: Action): State {

	switch (action.type) {
		case "open/close":
			return {
				...state,
				open: !state.open,
				currentScale: 1,
				x: 0,
				y: 0,
			};
		case "zoomIn/Out":
			return {
				...state,
				currentScale: state.currentScale === 1 ? state.scale : 1,
				x: state.currentScale === 1 ? action.x : 0,
				y: state.currentScale === 1 ? action.y : 0,
			};
		case "updatePosition":
			return {
				...state,
				x: action.payload.x,
				y: action.payload.y,
			};
		case "reset":
			return {
				...state,
				currentScale: 1,
				x: 0,
				y: 0,
			};
		case "draggingOn":
			return {
				...state,
				dragging: true,
			};
		case "draggingOff":
			return {
				...state,
				dragging: false,
			};
		default:
			return state;
	}
}

const defaultState: State = {

	dragging: false,
	// open is used to show or hide the image preview.
	open: false,
	// scale is the scale of the image we have to change.
	scale: 2,
	currentScale: 1,
	// x and y are the translation of the image we have to move.
	x: 0,
	y: 0,
}

export default function ImagePreview(props: Props) {

	const [state, dispatch] = React.useReducer(reducer, defaultState);
	const imageDivRef = React.useRef<HTMLImageElement>(null);
	// This is used to store the mouse position when dragging, and we don't want it to trigger a re-render.
	const mousePositionRef = React.useRef({ x: 0, y: 0 });

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
				const rect = imageDivRef.current!.getBoundingClientRect();
				const mouseX = e.clientX - rect.left;
				const mouseY = e.clientY - rect.top;

				dispatch({
					type: "zoomIn/Out",
					x: -(mouseX - rect.width / 2),
					y: -(mouseY - rect.height / 2)
				});
			} else {
				dispatch({ type: "reset" });
			}

		},
		[state.currentScale, state.scale, dispatch]
	);

	const handleDragStart = useCallback((e: React.DragEvent<HTMLImageElement>) => {
		dispatch({ type: "draggingOn" });
		mousePositionRef.current = {
			x: e.clientX,
			y: e.clientY
		};
	},[mousePositionRef]);

	const handleDrag = useCallback((e: React.DragEvent<HTMLImageElement>) => {
		if (state.dragging && e.clientX && e.clientY) {
			const dx = e.clientX - mousePositionRef.current.x;
			const dy = e.clientY - mousePositionRef.current.y;
			dispatch({ 
				type: "updatePosition", 
				payload: { 
					x: state.x + dx, 
					y: state.y + dy 
				} 
			});
			mousePositionRef.current = { x: e.clientX, y: e.clientY };
		}
	}, [state.dragging, state.x, state.y]);

	const handleDragEnd = () => dispatch({ type: "draggingOff" });

	const handleTouchStart = useCallback((e: React.TouchEvent<HTMLImageElement>) => {
		dispatch({ type: "draggingOn" });
		const touch = e.touches[0];
		mousePositionRef.current = {
			x: touch.clientX,
			y: touch.clientY
		};
	},[]);

	const handleTouchMove = useCallback((e: React.TouchEvent<HTMLImageElement>) => {
		if (state.dragging) {
			const touch = e.touches[0];
			const dx = touch.clientX - mousePositionRef.current.x;
			const dy = touch.clientY - mousePositionRef.current.y;
			dispatch({ 
				type: "updatePosition", 
				payload: { 
					x: state.x + dx, 
					y: state.y + dy 
				} 
			});
			mousePositionRef.current = { x: touch.clientX, y: touch.clientY };
		}
	}, [state.dragging, state.x, state.y]);

	const handleTouchEnd = () => dispatch({ type: "draggingOff" });

	return (
		<>
			{state.open && (
				<span
					className="fixed inset-0 bg-bsecondary/50 backdrop-blur-md flex flex-col items-center z-50"
					onClick={handleOverlayClick}
				>
					<span className="fixed top-0 left-0 right-0 py-2 px-4 bg-bsecondary/90 backdrop-blur-md flex justify-between items-center z-30">
						<span className="text-secondary flex items-center gap-4">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
								 className="my-auto" viewBox="0 0 16 16">
								<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
								<path
									d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
							</svg>
							<span>{props.alt}</span>
							<span className="text-secondary/70">
								{Math.round(state.currentScale * 100)}%
							</span>
						</span>
						<button
							onClick={() => dispatch({ type: "open/close" })}
							className="text-secondary hover:text-secondary/70 transition-colors p-2 cursor-pointer"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</span>
					<img
						ref={imageDivRef}
						{...props}
						src={props.src}
						alt={props.alt}
						height={undefined} // this might change when the space is not enough
						width={undefined} // this might change when the space is not enough
						className={cn(
							"shadow cursor-zoom-in my-auto z-20 max-w-[90vw] max-h-[90vh] object-contain mx-2",
							state.currentScale === state.scale && "cursor-move",
							!state.dragging && "duration-200"
						)}
						loading="lazy"
						style={{
							transform: `translate(${state.x}px, ${state.y}px) scale(${state.currentScale})`,
							transformOrigin: 'center',
						}}
						onClick={handleImageClick}
						onDragStart={handleDragStart}
						onDrag={handleDrag}
						onDragEnd={handleDragEnd}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					/>

				</span>
			)}
			<span className="group relative cursor-pointer rounded hover:scale-101 duration-200"
				 onClick={() => dispatch({ type: "open/close" })}
			>
				<Image
					{...props}
					src={props.src}
					alt={props.alt}
					quality={"0"}
					className="rounded mx-auto"
				/>
				<span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
					<span className="text-lg text-secondary/70 bg-bsecondary/70 p-2 rounded-full px-4">Click to view full size</span>
				</span>
			</span>
			<span className="text-lg text-secondary/70 text-center flex justify-center mt-1">
        		{props.alt}
      		</span>
		</>
	);
}

