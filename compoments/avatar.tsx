import Image from "next/image";
import cn from "@/utils/cn";

type Size = number | `${number}`;

interface Props {
	className?: string;
	src: string;
	alt?: string;
	size: Size;
	onClick?: () => void;
}

export default function Avatar(props: Props) {

	const cln = cn(
		"rounded-full overflow-hidden",
		props.className
	)

	return (
		<Image
			src={props.src}
			alt={props.alt ?? "avatar image"}
			className={cln}
			width={props.size}
			height={props.size}
			loading="eager"
		/>
	);
}
