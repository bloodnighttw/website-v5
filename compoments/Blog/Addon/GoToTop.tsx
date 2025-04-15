import React, { useCallback, useEffect } from "react";
import cn from "@/utils/cn";
import { ToTop } from "@/app/assets/svg";

interface GoToTopProps {
	progressRef: React.RefObject<number>;
}

type StyleState = -1 | 0 | 1;

export default function GoToTop({progressRef}: GoToTopProps) {

	const [styleState, setStyleState] = React.useState<StyleState>(-1);

	const handleScroll = useCallback(() => {

		if(progressRef.current === -1) return;

		const progressValue = progressRef.current;

		if( progressValue <= 0){
			if( styleState === -1)
				return;
			setStyleState(0)
		} else if (progressValue > 0) {
			setStyleState(1);
		}

	},[styleState, progressRef])

	useEffect(() => {
		// don't touch it, it's a hack to make the animation work
		const task = setTimeout(()=>{
			handleScroll();
		}, 0);
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			clearTimeout(task);
		};
	}, [handleScroll]);

	return <div
		className={cn(
			"cursor-pointer active:scale-90 duration-200",
			// to prevent the animation is triggered when first load
			styleState === -1 && "hidden",
			styleState === 0 && "fade-out",
			styleState === 1 && "fade-in",
		)}
		// bring the element to the top
		onClick={(e)=> {
			e.preventDefault();
			document.body.scrollIntoView({ behavior: "smooth" });
		}}
	>
		{ToTop}
	</div>
}
