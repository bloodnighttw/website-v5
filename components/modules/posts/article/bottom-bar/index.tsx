import cn from "@/utils/cn";
import { useCallback, useDeferredValue, useEffect, useState } from "react";
import GoToTop from "../go-top";
import Toc from "./toc";
import { TocTree } from "./toc-element";

interface Props {
	ref?: React.RefObject<HTMLDivElement|null>;
	tocArray: TocTree[];
}

export default function ButtomBar({ ref, tocArray }: Props) {

	const [progress, setProgress] = useState(-1);
    const deferredProgress = useDeferredValue(progress);


	const handleProgress = useCallback(() => {
		if (!ref?.current) return;

		const rect = ref.current.getBoundingClientRect();

		// the height of the window
		const windowHeight = window.innerHeight;

		// this is the top position of the div
		const y = window.scrollY + rect.y;

		// this is the distance from the top of the window to the bottom of the div
		const translation = windowHeight - y;

		// the top position of the div
		const rectTop = rect.top;

		// the bottom position of the div
		const rectBottom = rect.bottom;

		// the distance from the top of the div to the bottom of the window
		const diff = Math.floor(windowHeight - rectTop - translation);

		const progressPercent = diff / (rectBottom - rectTop - translation);

		const progressValue =
			progressPercent > 1 ? 1 : progressPercent < 0 ? 0 : progressPercent;

		// the percentage of the div that is visible
		setProgress(Math.floor(progressValue * 100));
	}, [ref]);

	useEffect(() => {
		handleProgress();

		window.addEventListener("scroll", handleProgress);
		return () => {
			window.removeEventListener("scroll", handleProgress);
		};
	}, [handleProgress]);

	return (
		<div
			className={cn(
				deferredProgress === 100 ? "absolute" : "fixed z-100",
				"duration-400 bottom-4 flex h-6 items-center gap-2 right-[calc(50%-44rem)] shadow-amber-50 shadow-2xl",
			)}
		>
			<GoToTop progress={deferredProgress} key="gototop"/>
			<Toc progress={deferredProgress} tocArray={tocArray} key="toc"/>
		</div>
	);
}
