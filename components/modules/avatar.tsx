import cn from "@/utils/cn";
import SkeletonImage from "../shared/image";

type Size = number | `${number}`;

interface Props {
	className?: string;
	src: string;
	alt?: string;
	size: Size;
	onClick?: () => void;
	priority?: boolean;
}

export default function Avatar(props: Props) {
	const cln = cn("rounded-full scale-in", props.className);

	return (
		<div className={cn("overflow-hidden", cln)}>
			<SkeletonImage
				src={props.src}
				alt={props.alt ?? "avatar image"}
				className={cln}
				width={props.size}
				height={props.size}
				loading="eager"
				priority={props.priority}
			/>
		</div>
	);
}
