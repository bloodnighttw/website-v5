/* eslint-disable @next/next/no-img-element */
"use client";

import cn from "@/utils/cn";
import { useCallback, useReducer, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageViewerProps {
	alt: string;
	src: string;
	close?: () => void;
}

interface Origin {
	x: string | number;
	y: string | number;
}

interface State {
	x: number;
	y: number;
	origin: Origin;
	size: number;
	dragStartCoordinates?: { x: number; y: number };
}

const initialState: State = {
	origin: { x: "50%", y: "50%" },
	x: 0,
	y: 0,
	size: 1,
};

type Action =
	| { type: "SET_DRAGGING_START"; payload: { x: number; y: number } }
	| { type: "SET_DRAGGING_END" }
	| { type: "SET_DRAGGING"; payload: { x: number; y: number } }
	| { type: "ZOOM_IN"; payload: Origin }
	| { type: "ZOOM_OUT"; payload: Origin }
	| { type: "SET_SIZE"; payload: { size: number; origin: Origin } }
	| { type: "RESET" };

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "SET_DRAGGING_START":
			return { ...state, dragStartCoordinates: action.payload };
		case "SET_DRAGGING_END":
			return { ...state, dragStartCoordinates: undefined };
		case "SET_DRAGGING":
			if (!state.dragStartCoordinates) {
				return state;
			}
			const dx = action.payload.x - state.dragStartCoordinates.x;
			const dy = action.payload.y - state.dragStartCoordinates.y;
			return {
				...state,
				x: (state.x as number) + dx,
				y: (state.y as number) + dy,
				dragStartCoordinates: {
					x: action.payload.x,
					y: action.payload.y,
				},
			};
		case "SET_SIZE":
			return {
				...state,
				size: action.payload.size,
				origin: action.payload.origin,
			};
		case "ZOOM_IN":
			if (state.size >= 3) return state;
			const sizeWithMax = Math.min(state.size + 0.25, 3);
			return {
				...state,
				size: sizeWithMax,
				origin: {
					x: action.payload.x,
					y: action.payload.y,
				},
			};
		case "ZOOM_OUT":
			if (state.size <= 0.5) return state;
			const sizeWithMin = Math.max(state.size - 0.25, 0.5);
			return {
				...state,
				size: sizeWithMin,
				origin: {
					x: action.payload.x,
					y: action.payload.y,
				},
			};
		case "RESET":
			return initialState;
		default:
			throw new Error("Unknown action type");
	}
}

export default function Viewer(props: ImageViewerProps) {
	const { close, ...rest } = props;
	const [state, dispatch] = useReducer(reducer, initialState);
	const ref = useRef<HTMLDivElement>(null);

	const { x, y, origin } = state;

	const handleMousePressDown = useCallback(
		(e: React.MouseEvent) => {
			dispatch({
				type: "SET_DRAGGING_START",
				payload: { x: e.clientX, y: e.clientY },
			});
		},
		[dispatch],
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			dispatch({
				type: "SET_DRAGGING",
				payload: { x: e.clientX, y: e.clientY },
			});
		},
		[dispatch],
	);

	const handleMouseUp = useCallback(() => {
		dispatch({ type: "SET_DRAGGING_END" });
	}, [dispatch]);

	const clickBackground = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === ref.current && close) {
				close();
			}
		},
		[close],
	);

	const doubleClick = useCallback(
		(e: React.MouseEvent) => {
			if (state.size === 1) {
				// set the click position as the origin
				const rect = ref.current?.getBoundingClientRect();
				const x = e.clientX - (rect?.left ?? 0);
				const y = e.clientY - (rect?.top ?? 0);

				dispatch({
					type: "SET_SIZE",
					payload: { size: 2, origin: { x, y } },
				});
			} else {
				dispatch({
					type: "RESET",
				});
			}
		},
		[state.size],
	);

	const onTouchStart = useCallback(
		(e: React.TouchEvent) => {
			const touch1 = e.touches[0];
			const react = ref.current?.getBoundingClientRect();
			const x = touch1.clientX - (react?.left ?? 0);
			const y = touch1.clientY - (react?.top ?? 0);

			dispatch({
				type: "SET_DRAGGING_START",
				payload: { x, y },
			});
		},
		[dispatch],
	);

	const onTouchMove = useCallback(
		(e: React.TouchEvent) => {
			const touch1 = e.touches[0];
			dispatch({
				type: "SET_DRAGGING",
				payload: { x: touch1.clientX, y: touch1.clientY },
			});
		},
		[dispatch],
	);

	const onTouchEnd = useCallback(() => {
		dispatch({ type: "SET_DRAGGING_END" });
	}, [dispatch]);

	const size100 = state.size * 100;

	const content = (
		<div
			ref={ref}
			className="fixed inset-0 z-50 flex items-center justify-center bg-bprimary/80 backdrop-blur w-full overflow-hidden"
			onClick={clickBackground}
		>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			<img
				draggable={false}
				{...rest}
				className={cn(
					"fixed",
					state.dragStartCoordinates
						? "cursor-grabbing"
						: "duration-200 transition-transform",
				)}
				style={{
					transform: `translate(${x}px, ${y}px) scale(${size100}%)`,
					transformOrigin: origin && `${origin.x}px ${origin.y}px`,
					maxWidth: "none",
					maxHeight: "none",
				}}
				onDoubleClick={doubleClick}
				onMouseDown={handleMousePressDown}
				onMouseUp={handleMouseUp}
				onMouseOut={handleMouseUp}
				onMouseMove={handleMouseMove}
				onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
			/>
		</div>
	);

	return createPortal(content, document.body);
}
