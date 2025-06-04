import cn from "@/utils/cn";
import GoToTop from "../go-top";
import Toc from "./toc";
import { TocTree } from "./toc-element";
import { useProgress } from "@/utils/hooks/progress";

interface Props {
	ref?: React.RefObject<HTMLDivElement|null>;
	tocArray: TocTree[];
}

export default function ButtomBar({ tocArray }: Props) {

	const progress = useProgress();

	return (
		<div
			className={cn(
				progress === 100 ? "absolute" : "fixed z-100",
				"duration-400 bottom-4 flex h-6 items-center gap-2 right-[max(1rem,calc(50%-var(--size-width-max)/2))]",
			)}
		>
			<GoToTop key="gototop"/>
			<Toc tocArray={tocArray} key="toc"/>
		</div>
	);
}
