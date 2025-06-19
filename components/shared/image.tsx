import "server-only"; // Ensure this file is only used in server-side rendering contexts

import Image, { type ImageProps } from "next/image";
import sharp from "sharp";

async function generateBlurredDataUrl(imageSrc: string): Promise<string> {
	try {

		// Fetch the image
		const response = await fetch(imageSrc);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const resizedBuffer = await sharp(buffer)
			.resize(10, 10, { fit: "cover" }) // Very small size for blur effect
			.blur(1)
			.jpeg({ quality: 70 })
			.toBuffer();

		const base64 = resizedBuffer.toString("base64");
		return `data:image/jpeg;base64,${base64}`;
	} catch (error) {
		console.warn("Sharp processing failed, using fallback:", error);
		return getFallbackDataUrl();
	}
}

function getFallbackDataUrl(): string {
	const svg =
		'<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#e5e7eb"/></svg>';
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

interface SkeletonImageProps extends ImageProps {
    src: string;
}

export default async function SkeletonImage(props: SkeletonImageProps) {
	const { src, alt, className, ...rest } = props;

	// Generate a blurred data URL from the actual image source
	const blurredDataUrl = await generateBlurredDataUrl(src);

	return (
		<Image
			src={src}
			alt={alt}
			className={className}
			placeholder="blur"
			blurDataURL={blurredDataUrl}
			{...rest}
		/>
	);
}
