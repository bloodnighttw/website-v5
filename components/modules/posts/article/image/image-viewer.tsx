"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useReducer, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageViewerProps {
    alt: string;
    src: string;
    close?: () => void;
}

interface State {
    x: number;
    y: number;
    origin: { x: number | string; y: number | string };
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
    | { type: "SET_DRAGGING_START"; payload: { x:number, y:number} }
    | { type: "SET_DRAGGING_END" }
    | { type: "SET_DRAGGING"; payload: { x: number; y: number } }
    | { type: "ZOOM_IN" ; payload: { x: number; y: number } }
    | { type: "ZOOM_OUT"; payload: { x: number; y: number } }
    | { type: "SET_SIZE"; payload: { size: number } }
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
                x: state.x as number + dx,
                y: state.y as number + dy,
                dragStartCoordinates: { x: action.payload.x, y: action.payload.y },
            };
        case "SET_SIZE":
            return { ...state, size: action.payload.size };
        case "ZOOM_IN":
            const sizeWithMax = Math.min(state.size + 0.25, 3);
            return {
                ...state,
                size: sizeWithMax,
                origin: {
                    x: action.payload.x,
                    y: action.payload.y,
                }
            };
        case "ZOOM_OUT":
            const sizeWithMin = Math.max(state.size - 0.25, 0.5);
            return {
                ...state,
                size: sizeWithMin,
                origin: {
                    x: action.payload.x,
                    y: action.payload.y,
                }
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

    const handleMousePressDown = useCallback((e: React.MouseEvent) => {
        dispatch({ type: "SET_DRAGGING_START", payload: {x: e.clientX, y:e.clientY} });
    },[dispatch])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        dispatch({ type: "SET_DRAGGING", payload: { x: e.clientX, y: e.clientY } });
    },[dispatch])

    const handleMouseUp = useCallback(() => {
        dispatch({ type: "SET_DRAGGING_END" });
    },[dispatch])

    const clickBackground = useCallback((e: React.MouseEvent) => {
        if (e.target === ref.current && close) {
            close();
        }
    },[close])

    const wheelZoom = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            dispatch({ type: "ZOOM_IN", payload: { x: e.clientX, y: e.clientY } });
        } else {
            dispatch({ type: "ZOOM_OUT", payload: { x: e.clientX, y: e.clientY } });
        }
    },[dispatch])

    const content = <div 
            ref={ref}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bprimary/80 backdrop-blur w-full overflow-hidden" 
            onClick={clickBackground}
        >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
            draggable={false}
            {...rest}
            className="fixed "
            style={{
                transform: `translate(${x}px, ${y}px) scale(100%)`,
                transformOrigin: `${origin.x} ${origin.y}`,
                maxWidth: "none",
                maxHeight: "none",
            }}
            onMouseDown={handleMousePressDown}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={wheelZoom}
        />
    </div>

    return createPortal(content, document.body)

}