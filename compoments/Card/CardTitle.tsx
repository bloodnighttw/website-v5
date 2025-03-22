import Link from "next/link";

export function CardTitle({ title, url }: { title: string, url?: string }) {
	return (
		<div className="flex items-end">
			<p className="text-secondary mr-auto text-2xl">{title}</p>
			{
				url &&
				<Link className="text-secondary hover:underline" href={url ?? "/"}>See More</Link>
			}
		</div>
	)
}