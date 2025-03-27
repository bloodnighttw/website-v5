import Link from "next/link";

export default function ArticleTitle({ title, url }: { title: string, url?: string }) {
	return (
		<div className="flex items-end">
			<p className="text-secondary mr-auto text-2xl">{title}</p>
			{
				url &&
				<Link className="text-secondary hover:underline" href={url ?? "/"}>more</Link>
			}
		</div>
	)
}