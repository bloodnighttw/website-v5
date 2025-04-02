import Image from "next/image";
import { svgUrl } from "@/utils/constant";
import cn from "@/utils/cn";

export default function Stack({
	it,
	className,
}: {
	it: string;
	className?: string;
}) {
	const cln = cn("h-8 w-8", className);

	return (
		<div className={cln}>
			<Image src={it} height={32} width={32} alt={it} />
		</div>
	);
}

export function Stacks({ svgs }: { svgs?: string[] }) {
	const temp = svgs ?? Object.values(svgUrl);

	return temp.map((it) => {
		return <Stack it={it} key={it} />;
	});
}
