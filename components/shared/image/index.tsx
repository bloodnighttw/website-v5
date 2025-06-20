import "server-only"; // Ensure this file is only used in server-side rendering contexts

import { type ImageProps } from "next/image";
import AnimatedImage from "./animated-image";
import { generateBlurredDataUrl } from "../../../utils/generate-blur-data-url";


interface SkeletonImageProps extends ImageProps {
    src: string;
}

export default async function SkeletonImage(props: SkeletonImageProps) {
	const { src, alt, className, ...rest } = props;

	// Generate a blurred data URL from the actual image source
	const blurredDataUrl = await generateBlurredDataUrl(src);

	return (
		<AnimatedImage
			src={src}
			alt={alt}
			className={className}
			blurDataURL={blurredDataUrl}
			{...rest}
		/>
	);
}
