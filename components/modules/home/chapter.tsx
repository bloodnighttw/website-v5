import cn from "@/utils/cn";

export default function Chapter({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	const cln = cn("text-4xl font-bold fade-in", className);

	return <p className={cln}>{children}</p>;
}
