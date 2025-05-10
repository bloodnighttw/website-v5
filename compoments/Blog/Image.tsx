"use client";

import React, { useReducer, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import cn from "@/utils/cn";

// Define types
type Position = {
	x: number;
	y: number;
};

type ViewerState = {
	fullScreen: boolean;
	position: Position;
	dragging: boolean;
	dragStart: Position;
	zoomLevel: number;
	transformOrigin: Position;
};

type ViewerAction =
	| { type: "TOGGLE_FULLSCREEN"; payload: boolean }
	| { type: "SET_DRAGGING"; payload: boolean }
	| { type: "SET_DRAG_START"; payload: Position }
	| { type: "SET_POSITION"; payload: Position }
	| { type: "SET_IMAGE_LOADED"; payload: boolean }
	| { type: "RESET_POSITION" }
	| { type: "SET_ZOOM_LEVEL"; payload: number }
	| { type: "ZOOM_IN"; payload?: Position }
	| { type: "ZOOM_OUT"; payload?: Position }
	| { type: "SET_TRANSFORM_ORIGIN"; payload: Position };

// Initial state
const initialState: ViewerState = {
	fullScreen: false,
	position: { x: 0, y: 0 },
	dragging: false,
	dragStart: { x: 0, y: 0 },
	zoomLevel: 1.0,
	transformOrigin: { x: 0.5, y: 0.5 } // Default to center (50%, 50%)
};

// Reducer function
function imageViewerReducer(state: ViewerState, action: ViewerAction): ViewerState {
	switch (action.type) {
		case "TOGGLE_FULLSCREEN":
			return {
				...state,
				fullScreen: action.payload
			};
		case "SET_DRAGGING":
			return {
				...state,
				dragging: action.payload
			};
		case "SET_DRAG_START":
			return {
				...state,
				dragStart: action.payload
			};
		case "SET_POSITION":
			return {
				...state,
				position: action.payload
			};
		case "RESET_POSITION":
			return {
				...state,
				position: { x: 0, y: 0 },
				zoomLevel: 1.0, // Reset zoom level when resetting position
				transformOrigin: { x: 0.5, y: 0.5 } // Reset transform origin to center
			};
		case "SET_ZOOM_LEVEL":
			return {
				...state,
				zoomLevel: action.payload
			};
		case "ZOOM_IN":
			return {
				...state,
				zoomLevel: Math.min(state.zoomLevel + 0.25, 3.0), // Limit max zoom to 3x
				transformOrigin: action.payload || state.transformOrigin // Use provided position or keep current
			};
		case "ZOOM_OUT":
			return {
				...state,
				zoomLevel: Math.max(state.zoomLevel - 0.25, 0.5), // Limit min zoom to 0.5x
				transformOrigin: action.payload || state.transformOrigin // Use provided position or keep current
			};
		case "SET_TRANSFORM_ORIGIN":
			return {
				...state,
				transformOrigin: action.payload
			};
		default:
			return state;
	}
}

// Props type
interface ImageViewerProps {
	alt: string;
	src: string;
	[key: string]: string;
}

export default function ImageViewer(props: ImageViewerProps) {

	const t = useTranslations("Blog");

	const [state, dispatch] = useReducer(imageViewerReducer, initialState);
	const { fullScreen, position, dragging, dragStart, zoomLevel, transformOrigin } = state;

	const imageRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// enable scroll when leave
	useEffect(() => {
		return ()=>{
			document.body.style.overflow = "auto";
		}
	}, []);

	// Reset position when toggling fullscreen mode
	useEffect(() => {
		if (!fullScreen) {
			dispatch({ type: "RESET_POSITION" });
		}

	}, [fullScreen]);

	// Handle mouse/touch down events to start dragging
	const handleDragStart = useCallback((clientX: number, clientY: number): void => {
		if (!fullScreen) return;

		dispatch({ type: "SET_DRAGGING", payload: true });
		dispatch({
			type: "SET_DRAG_START",
			payload: {
				x: clientX - position.x,
				y: clientY - position.y
			}
		});
	},[fullScreen, position.x, position.y]);

	// Handle mouse/touch move events for dragging
	const handleDragMove = useCallback((clientX: number, clientY: number): void => {
		if (!dragging) return;

		dispatch({
			type: "SET_POSITION",
			payload: {
				x: clientX - dragStart.x,
				y: clientY - dragStart.y
			}
		});
	},[dragStart.x, dragStart.y, dragging]);

	// Handle mouse/touch up events to stop dragging
	const handleDragEnd = useCallback((): void => {
		dispatch({ type: "SET_DRAGGING", payload: false });
	},[]);

	// Mouse event handlers
	const handleMouseDown = useCallback((e: React.MouseEvent): void => {
		e.preventDefault();
		handleDragStart(e.clientX, e.clientY);
	},[handleDragStart]);

	const handleMouseMove = useCallback((e: React.MouseEvent): void => {
		e.preventDefault();
		handleDragMove(e.clientX, e.clientY);
	},[handleDragMove]);

	const handleMouseUp = useCallback((): void => {
		handleDragEnd();
	},[handleDragEnd]);

	// Touch event handlers
	const handleTouchStart = (e: React.TouchEvent): void => {
		const touch = e.touches[0];
		handleDragStart(touch.clientX, touch.clientY);
	};

	const handleTouchMove = (e: React.TouchEvent): void => {
		const touch = e.touches[0];
		handleDragMove(touch.clientX, touch.clientY);
	};

	const handleTouchEnd = useCallback((): void => {
		handleDragEnd();
	},[handleDragEnd]);

	// Handle click on image to toggle fullscreen
	const toggleFullScreen = useCallback((): void => {
		dispatch({ type: "TOGGLE_FULLSCREEN", payload: true });

		// disable scroll
		document.body.style.overflow = "hidden";
	},[]);

	// Handle click on background to exit fullscreen
	const handleBackgroundClick = useCallback((e: React.MouseEvent): void => {

		if(dragging) {
			handleDragEnd();
			return;
		}

		if (e.target === containerRef.current) {
			dispatch({ type: "TOGGLE_FULLSCREEN", payload: false });
			// enable scroll
			document.body.style.overflow = "auto";
		}
	},[dragging, handleDragEnd]);

	// Handle zoom in
	const handleZoomIn = useCallback((e: React.MouseEvent): void => {
		e.stopPropagation(); // Prevent the click from closing fullscreen
		// Set transform origin to center for button-triggered zoom
		dispatch({ type: "ZOOM_IN" });
	},[]);

	// Handle zoom out
	const handleZoomOut = useCallback((e: React.MouseEvent): void => {
		e.stopPropagation(); // Prevent the click from closing fullscreen
		// Set transform origin to center for button-triggered zoom
		dispatch({ type: "ZOOM_OUT" });
	},[]);

	// Handle reset zoom
	const handleResetZoom = useCallback((e: React.MouseEvent): void => {
		e.stopPropagation(); // Prevent the click from closing fullscreen
		// Reset transform origin to center
		dispatch({ type: "SET_TRANSFORM_ORIGIN", payload: { x: 0.5, y: 0.5 } });
		dispatch({ type: "SET_ZOOM_LEVEL", payload: 1.0 });
		dispatch({ type: "RESET_POSITION" });
	},[]);

	// Handle wheel event for zoom
	const handleWheel = useCallback((e: React.WheelEvent): void => {

		e.stopPropagation();

		// Get the image container element
		const container = e.currentTarget.querySelector("div > img")?.parentElement;
		if (!container) return;

		// Get the container's bounding rectangle
		const rect = container.getBoundingClientRect();

		// Calculate relative position of mouse within the container (0 to 1)
		const relativePosition: Position = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};

		if (e.deltaY < 0) {
			// Scroll up - zoom in
			if(zoomLevel >= 3.0) return;
			dispatch({ type: "ZOOM_IN", payload: relativePosition });
		} else {
			// Scroll down - zoom out
			if(zoomLevel <= 0.5) return;
			dispatch({ type: "ZOOM_OUT", payload: relativePosition });
		}
	},[zoomLevel]);

	// Handle double click to toggle between normal and zoomed view
	const handleDoubleClick = useCallback((e: React.MouseEvent): void => {
		e.stopPropagation();

		// Get the container's bounding rectangle
		const container = e.currentTarget;
		const rect = container.getBoundingClientRect();

		// Calculate relative position of mouse within the container (0 to 1)
		const relativePosition: Position = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};

		// Set the transform origin to the mouse position
		dispatch({ type: "SET_TRANSFORM_ORIGIN", payload: relativePosition });

		if (zoomLevel === 1.0) {
			dispatch({ type: "SET_ZOOM_LEVEL", payload: 2.0 });
		} else {
			dispatch({ type: "SET_ZOOM_LEVEL", payload: 1.0 });
			dispatch({ type: "RESET_POSITION" });
		}
	},[zoomLevel]);

	const imagePreviewMemo = useMemo(() => {
		return <span
			className="relative overflow-hidden cursor-pointer hover:-translate-y-2 duration-200 group/image *:m-0 flex justify-center mt-8"
			onClick={toggleFullScreen}
		>
			<Image
				ref={imageRef}
				className="object-cover rounded"
				{...props}
				alt={props.alt}
				quality={0}
			/>

			<span className={cn(
				"absolute top-1/2 duration-200 inline-flex items-center justify-center rounded-full",
				"opacity-0 group-hover/image:opacity-100 bg-bsecondary text-2xl py-4 px-12"
			)}
			>
				{t("Click to view full image")}
			</span>
		</span>
	},[props, t, toggleFullScreen])

	return (
		<>
			{imagePreviewMemo}
			{/* Full screen overlay */}
			{fullScreen && (
				<span
					ref={containerRef}
					className="fixed inset-0 bg-bprimary/20 backdrop-blur bg-opacity-80 z-101 flex items-center justify-center"
					onMouseDown={handleBackgroundClick}
				>
					<div className="fixed top-0 w-full bg-bsecondary/90 z-102 h-16 grid grid-cols-2 lg:grid-cols-3 items-center px-8 mx-auto">
						<div className="flex items-center space-x-2 flex-nowrap text-xl">
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
								 className="size-6" viewBox="0 0 16 16">
								<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
								<path
									d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54L1 12.5v-9a.5.5 0 0 1 .5-.5z" />
							</svg>
							<span>
								{props.alt}
							</span>
						</div>
						<div className="hidden lg:flex items-center space-x-4 mx-auto">
							<button
								className="bg-bprimary/70 px-4 py-2 rounded transition-all cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleZoomOut}
								aria-label={t("Zoom Out")}
							>
								<span className="text-xl">-</span>
							</button>
							<div>
								{Math.round(zoomLevel * 100)}%
							</div>
							<button
								className="bg-bprimary/70 px-4 py-2 rounded transition-all cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleZoomIn}
								aria-label={t("Zoom In")}
							>
								<span className="text-xl">+</span>
							</button>
							<button
								className="bg-bprimary/70 px-4 py-2 rounded ml-4 cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleResetZoom}
								aria-label={t("Reset Zoom")}
							>
								{t("Reset")}
							</button>
						</div>
						<div className="fixed bottom-2 right-0 left-0 lg:hidden flex justify-center items-center space-x-4">

							<button
								className="bg-bprimary/70 px-4 py-2 rounded transition-all cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleZoomOut}
								aria-label={t("Zoom Out")}
							>
								<span className="text-xl">-</span>
							</button>
							<div>
								{Math.round(zoomLevel * 100)}%
							</div>
							<button
								className="bg-bprimary/70 px-4 py-2 rounded transition-all cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleZoomIn}
								aria-label={t("Zoom In")}
							>
								<span className="text-xl">+</span>
							</button>
							<button
								className="bg-bprimary/70 px-4 py-2 rounded ml-4 cursor-pointer border border-bprimary/0 hover:border-primary/70"
								onClick={handleResetZoom}
								aria-label={t("Reset Zoom")}
							>
								{t("Reset")}
							</button>
						</div>

						<button onClick={()=>dispatch({ type: "TOGGLE_FULLSCREEN", payload: false })}
							className="ml-auto cursor-pointer"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
								 className="h-6" viewBox="0 0 16 16">
								<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
								<path
									d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
							</svg>
						</button>
					</div>
					<div
						style={{
							transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
							transformOrigin: `${transformOrigin.x * 100}% ${transformOrigin.y * 100}%`,
							cursor: dragging ? "grabbing" : "grab",
							transition: dragging ? "none" : "transform 0.2s ease-out",
							width: props.width,
							height: props.height
						}}
						onMouseDown={handleMouseDown}
						onTouchStart={handleTouchStart}
						onDoubleClick={handleDoubleClick}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
						onTouchCancel={handleTouchEnd}
						onWheel={handleWheel}
						onMouseLeave={handleMouseUp}
					>
						{/* eslint-disable-next-line */}
						<img
							src={props.src}
							alt={props.src}
							draggable="false"
						/>
					</div>
				</span>
			)}

		</>
	);
}
