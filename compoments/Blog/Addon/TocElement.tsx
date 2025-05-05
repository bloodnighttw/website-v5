import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";

export interface TocTree {
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
	id: string;
	onScreen?: () => void;
	leftScreen?: () => void;
}

export function TocElement(toc: TocTree) {

	const ref = React.useRef<HTMLAnchorElement>(null);
	const [onScreen, setOnScreen] = React.useState(false);

	const onViewportChange = useCallback(() => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();

		console.log(toc.id, rect.top, rect.bottom, window.innerHeight);

		// Get viewport dimensions
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		// Element is out of screen if any of these conditions are true:
		const onViewport = !(
			rect.bottom < 64 || // Above the top edge (also includes the navbar)
			rect.top > viewportHeight // Below the bottom edge
		);

		if (onViewport) {
			setOnScreen(true);
			toc.onScreen?.();
		} else {
			setOnScreen(false);
			toc.leftScreen?.();
		}
	}, [toc]);


	useEffect(() => {

		if (!ref.current) {
			ref.current = document.querySelector(`#${toc.id}`) as HTMLAnchorElement;
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

	return <a href={`#${toc.id}`} className={cn(
		"w-60 hover:bg-bsecondary/40 rounded text-secondary/90",
		toc.depth === 1 && "pl-6",
		toc.depth === 2 && "pl-10",
		toc.depth > 2 && "pl-14",
		toc.depth > 3 && "text-secondary/80",
		onScreen && "text-primary/100"
	)}>
		{toc.text}
	</a>;

}