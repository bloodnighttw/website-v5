export default function PostSectionContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="group/tag *:not-first:pt-4 card">{children}</div>;
}
