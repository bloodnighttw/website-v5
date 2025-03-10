export function CardTitle({ title }: { title: string }) {
	return (
		<div className="flex items-center">
			<p className="text-secondary mr-auto text-2xl">{title}</p>
			<p className="text-secondary">See More</p>
		</div>
	)
}