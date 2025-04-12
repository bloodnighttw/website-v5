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
				<div
					className="fixed inset-0 bg-bsecondary/50 backdrop-blur-md flex flex-col items-center z-50"
					onClick={handleOverlayClick}
				>
					<img
						ref={imageDivRef}
						{...props}
						src={props.src}
						alt={props.alt}
						className={cn(
							"shadow cursor-zoom-in my-auto z-100 max-w-[90vw] max-h-[90vh] object-contain mx-2",
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
					<div className={cn(
						"fixed w-96 h-16 bg-bsecondary/60 backdrop-blur-md bottom-0 m-12 z-150 px-8 py-4",
						"rounded-full border border-secondary shadow-amber-50"
					)}>
						123
					</div>

				</div>
			)}
			<div className="group relative cursor-pointer rounded hover:scale-101 duration-200"
				 onClick={() => dispatch({ type: "open/close" })}
			>
				<img
					{...props}
					src={props.src}
					alt={props.alt+" - preview"}
					className="rounded mx-auto"
				/>
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
					<span className="text-lg text-secondary/70 bg-bsecondary/70 p-2 rounded-full px-4">Click to view full size</span>
				</div>
			</div>
			<span className="text-lg text-secondary/70 text-center flex justify-center mt-1">
        		{props.alt}
      		</span>
		</>
	);
}

