import React from "react";
import cn from "@/utils/cn";
import { ToTop } from "@/app/assets/svg";
import { useProgress } from "@/utils/hooks/toc";


export default function GoToTop() {

	const progress = useProgress();
	const [hidden, setHidden] = React.useState(true);
	const progressEqualsZero = progress === 0;

	React.useEffect(() => {
		let id = null;
		if (progressEqualsZero) {
			id = setTimeout(() => {
				setHidden(true);
			}, 400); // delay to allow fade-out animation

		} else {
			setHidden(false);
		}
		return () => {
			if (id) clearTimeout(id);
		};
	}, [progressEqualsZero]);


	return <div
		className={cn(
			"cursor-pointer active:scale-90 duration-200",
			// to prevent the animation is triggered when first load
			progress === 0 && "fade-out",
			progress >= 1 && "fade-in",
			hidden && "hidden",
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
