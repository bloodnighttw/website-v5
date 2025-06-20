"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { useTranslations } from "next-intl";
import cn from "@/utils/cn";
import Viewer from "./image-viewer";

interface ArticleImageProps extends ImageProps {
	src: string;
	blur: string;
}

export default function ArticleImage(props: ArticleImageProps) {
	const { blur, ...rest } = props;

	const t = useTranslations("Blog");
	const ref = React.useRef<HTMLSpanElement>(null);
	const [fullscreen, setFullscreen] = useState(false);
	const [onScreen, setOnScreen] = useState(false);
	const [previewLoad, setPreviewLoad] = useState(false);

	const ouo = useCallback(
		() =>
			setFullscreen((prev) => {
				if (prev) {
					document.body.classList.remove("overflow-hidden");
				} else {
					document.body.classList.add("overflow-hidden");
				}
				return !prev;
			}),
		[],
	);

	// clean up the full screen when the component unmount
	useEffect(() => {
		// if the ref is on screen, set the onScreen state to true
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setOnScreen(true);
				}
			});
		});

		observer.observe(ref.current!);

		return () => {
			observer.disconnect();
			setFullscreen((prev) => {
				if (prev) {
					document.body.classList.remove("overflow-hidden");
				}
				return false;
			});
		};
	}, []);

	return (
		<>
			<span
				className={cn(
					"relative cursor-pointer group/image *:m-0 flex justify-center mt-8 overflow-hidden",
					previewLoad && "hover:-translate-y-2 duration-200",
				)}
				onClick={ouo}
				ref={ref}
			>
				<Image
					className="object-cover"
					{...rest}
					alt={props.alt}
					quality={0}
					onLoad={() => setPreviewLoad(true)}
				/>

				<span
					className={cn(
						"absolute insect-0 inline-flex items-center justify-center h-full rounded",
					)}
				>
					<span className="opacity-0 group-hover/image:opacity-100 bg-bsecondary text-2xl py-4 px-12 rounded-full duration-200">
						{t("Click to view full image")}
					</span>
				</span>

				<Image
					src={blur}
					alt="hi"
					height={rest.height}
					width={rest.width}
					className={cn(
						"absolute duration-700 delay-300",
						previewLoad && onScreen ? "opacity-0" : "opacity-100",
					)}
					style={{ objectFit: "cover" }}
				/>
			</span>
			{fullscreen && (
				<Viewer
					{...props}
					alt={props.alt}
					src={props.src}
					close={ouo}
				/>
			)}
		</>
	);
}
