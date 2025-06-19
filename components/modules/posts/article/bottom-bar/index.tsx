import cn from "@/utils/cn";
import GoToTop from "../go-top";
import Toc from "./toc";
import { TocTree } from "./toc-element";
import { useEffect, useState } from "react";

interface Props {
	// the ref of the bottom bar(with max width)
	bottomRef?: React.RefObject<HTMLDivElement | null>;
	tocArray: TocTree[];
}

export default function ButtomBar({ tocArray, bottomRef }: Props) {

	const [absolute, setAbsolute] = useState(false);

	useEffect(()=>{

		const handleScroll = () => {
			if(!bottomRef?.current)
				return;

			// check if bottomRef bottom is on screen
			const rect = bottomRef.current.getBoundingClientRect();
			const isOnScreen = rect.bottom <= (window.visualViewport?.height ?? window.innerHeight);
			setAbsolute(isOnScreen);
		}

		handleScroll(); // initial check
		window.addEventListener("scroll", handleScroll);
		window.visualViewport?.addEventListener("resize", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.visualViewport?.removeEventListener("resize", handleScroll);
		};


	},[bottomRef])


	return (
		<div
			className={cn(
				absolute ? "absolute" : "fixed z-100",
				"duration-400 bottom-4 flex h-6 items-center gap-2 right-[max(1rem,calc(50%-var(--size-width-max)/2))]",
			)}
		>
			<GoToTop key="gototop" />
			<Toc tocArray={tocArray} key="toc" />
		</div>
	);
}
