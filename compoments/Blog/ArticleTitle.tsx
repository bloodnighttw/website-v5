import Link from "@/i18n/navigation";
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
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="fill-primary/60 hover:fill-primary h-6 w-6 duration-200" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
					</svg>
				</Link>
			)}
		</div>
	);
}
