import React, { useCallback, useEffect, useLayoutEffect } from "react";
import cn from "@/utils/cn";
import { TocSideLineAction } from "@/components/Blog/Addon/Toc";
import Link from "next/link";

export interface TocTree {
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
	id: string;
	index?: number;
	dispatch?: React.Dispatch<TocSideLineAction>;
}

export function TocElement(toc: TocTree) {

	const ref = React.useRef<HTMLElement>(null);
	const [onScreen, setOnScreen] = React.useState(false);
	const { dispatch, index } = toc;


	const add2list = useCallback(() => {
		dispatch?.({type: "add", payload: index!});
	}, [dispatch, index]);

	const removeFromList = useCallback(() => {
		dispatch?.({type: "remove", payload: index!});
	},[dispatch, index]);

	const onViewportChange = useCallback(() => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();

		// Get viewport dimensions
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		// Element is out of screen if any of these conditions are true:
		const onViewport = !(
			rect.bottom < 64 || // Above the top edge (also includes the navbar)
			rect.top > viewportHeight // Below the bottom edge
		);

		if (onViewport) {
			setOnScreen(true);
			add2list();
		} else {
			setOnScreen(false);
			removeFromList();
		}
	}, [add2list, removeFromList]);

	const tocRef = React.useRef<HTMLAnchorElement>(null);

	useEffect(() => {

		if (!ref.current) {
			ref.current = document.getElementById(toc.id) as HTMLElement;
		}

		window.addEventListener("scroll", onViewportChange);

		// when page size is changed
		window.addEventListener("resize", onViewportChange);

		onViewportChange();

		return () => {
			window.removeEventListener("scroll", onViewportChange);
			window.removeEventListener("resize", onViewportChange);
		};

	}, [onViewportChange, toc.id]);

	useLayoutEffect(()=>{ // if we use useEffect, the first load of toc will be wrong
		if (dispatch && tocRef.current) {

			const clone = tocRef.current.cloneNode(true) as HTMLAnchorElement;

			clone.style.position = "absolute";
			clone.style.visibility = "hidden";
			clone.style.scale= "1";
			clone.style.pointerEvents = "none";

			document.body.appendChild(clone);
			// Get the height of the element
			const height = clone.getBoundingClientRect().height;
			// Remove the clone element from the DOM
			document.body.removeChild(clone);

			dispatch({ type: "initNew", payload: height ?? 0});
		}
	},[dispatch, tocRef]);

	return <Link
		href={`#${toc.id}`} className={cn(
			"w-60 hover:bg-bsecondary/40 rounded text-secondary/90",
			toc.depth === 1 && "pl-6",
			toc.depth === 2 && "pl-10",
			toc.depth > 2 && "pl-14",
			toc.depth > 3 && "text-secondary/80",
			onScreen && "text-primary/100"
		)}
		ref={tocRef}
		data-disable-progress={true}
	>
		{toc.text}
	</Link>;

}