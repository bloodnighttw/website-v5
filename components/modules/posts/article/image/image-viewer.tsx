/* eslint-disable @next/next/no-img-element */
"use client";

import GlareCard from "@/components/shared/card/glare-card";
import { GlareCardBorder } from "@/components/shared/card/glare-card/border";
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
	| { type: "ZOOM_IN"; payload?: Origin }
	| { type: "ZOOM_OUT"; payload?: Origin }
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

			if (!action.payload) {
				return {
					...state,
					size: sizeWithMax,
					origin: { x: "50%", y: "50%" },
				};
			}

			return {
				...state,
				size: sizeWithMax,
				origin: action.payload,
			};
		case "ZOOM_OUT":
			if (state.size <= 0.5) return state;
			const sizeWithMin = Math.max(state.size - 0.25, 0.5);

			if (!action.payload) {
				return {
					...state,
					size: sizeWithMin,
					origin: { x: "50%", y: "50%" },
				};
			}

			return {
				...state,
				size: sizeWithMin,
				origin: action.payload,
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
			<GlareCard className="fixed bottom-8 bg-bsecondary/100 rounded-[calc(0.25rem+3px)]">
				<GlareCardBorder className="*:bg-bprimary/60 grid grid-cols-4 gap-0.75  *:flex *:justify-center *:items-center *:button:cursor-pointer">
					<p className="rounded-t col-span-4 text-xl w-96 p-1 font-mono line-clamp-1 h-12 select-none">
						{props.alt}
					</p>
					<button
						className="rounded-bl cursor-pointer"
						onClick={() => dispatch({ type: "ZOOM_OUT" })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path
								fillRule="evenodd"
								d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
							/>
							<path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
							<path
								fillRule="evenodd"
								d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"
							/>
						</svg>
					</button>
					<div>{state.size * 100}%</div>
					<button
						onClick={() => dispatch({ type: "ZOOM_IN" })}
						className="cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path
								fillRule="evenodd"
								d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
							/>
							<path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
							<path
								fillRule="evenodd"
								d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
							/>
						</svg>
					</button>
					<button
						onClick={props.close}
						className="rounded-br cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
						</svg>
					</button>
				</GlareCardBorder>
			</GlareCard>
		</div>
	);

	return createPortal(content, document.body);
}
