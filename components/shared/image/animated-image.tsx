"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface AnimatedImageProps extends ImageProps {
	src: string;
	blurDataURL: string;
}

export default function AnimatedImage(props: AnimatedImageProps) {
	const { src, alt, className, blurDataURL, ...rest } = props;
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className="relative overflow-hidden">
			<div className="absolute inset-0">
				<Image
					src={blurDataURL}
					alt=""
					className={cn(
						"w-full h-full object-cover",
						"transition-all duration-700 ease-out",
						isLoaded
							? "opacity-0 scale-110"
							: "opacity-100 scale-100 animate-pulse",
					)}
					fill
					priority
				/>
			</div>

			{/* Main image that animates in when loaded */}
			<Image
				src={src}
				alt={alt}
				className={cn(
					"relative z-10",
					"transition-all duration-700 ease-out",
					isLoaded
						? "opacity-100 scale-100 blur-0"
						: "opacity-0 scale-105 blur-sm",
					className,
				)}
				onLoad={() => setIsLoaded(true)}
				onError={() => setIsLoaded(true)}
				{...rest}
			/>
		</div>
	);
}
