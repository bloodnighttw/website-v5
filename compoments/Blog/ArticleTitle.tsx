import Link from "next/link";

export default function ArticleTitle({
	title,
	url,
}: {
	title: string;
	url?: string;
}) {
	return (
		<div className="flex items-end">
			<p className="text-secondary mr-auto text-2xl group-hover/tag:ml-2 duration-200">{title}</p>
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
