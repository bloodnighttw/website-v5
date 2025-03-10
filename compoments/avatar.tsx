import Image from "next/image";

type Size = number | `${number}`;

interface Props {
	className?: string;
	src: string;
	alt?: string;
	size: Size;
	onClick?: () => void;
}

export default function Avatar(props: Props) {
	return (
		<Image
			src={props.src}
			alt={props.alt ?? "avatar image"}
			className={`${props.className} rounded-full overflow-hidden`}
			width={props.size}
			height={props.size}
			loading="eager"
		/>
	);
}
