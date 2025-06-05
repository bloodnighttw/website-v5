import cn from "@/utils/cn";
import { TocAction, useTocElement } from "@/utils/hooks/toc";
import Link from "next/link";

export interface TocTree {
	depth: 1 | 2 | 3 | 4 | 5 | 6;
	text: string;
	id: string;
}

export interface TocElementProps extends TocTree{
	dispatch: React.Dispatch<TocAction>;
	index: number;
}

export function TocElement(toc: TocElementProps ) {

	const [ref, onScreen] = useTocElement(toc.dispatch, toc.id, toc.index);

	return <Link
		href={`#${toc.id}`} className={cn(
			"w-60 hover:bg-bsecondary/40 rounded text-secondary/90",
			toc.depth === 1 && "pl-6",
			toc.depth === 2 && "pl-10",
			toc.depth > 2 && "pl-14",
			toc.depth > 3 && "text-secondary/80",
			onScreen && "text-primary/100"
		)}
		ref={ref}
		data-disable-progress={true}
	>
		{toc.text}
	</Link>;

}