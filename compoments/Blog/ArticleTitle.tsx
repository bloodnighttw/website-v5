import Link from "next/link";
import cn from "@/utils/cn";

export default function ArticleTitle({
	title,
	url,
}: {
	title: string;
	url?: string;
}) {
	return (
		<div className="flex items-end">
			<p className={cn(
				"text-secondary mr-auto text-2xl duration-200",
				"resize-underline-none group-hover/tag:resize-underline"
			)}>{title}</p>
			{url && (
				<Link
					className="text-secondary hover:underline"
					href={url ?? "/"}
				>
					more
				</Link>
			)}
		</div>
	);
}
