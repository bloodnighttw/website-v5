import React from "react";
import cn from "@/utils/cn";
import { ToTop } from "@/app/assets/svg";

interface GoToTopProps {
	progress: number;
}

export default function GoToTop({progress}: GoToTopProps) {

	return <div
		className={cn(
			"cursor-pointer active:scale-90 duration-200",
			// to prevent the animation is triggered when first load
			progress === -1 && "hidden",
			progress === 0 && "fade-out",
			progress >= 1 && "fade-in",
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
