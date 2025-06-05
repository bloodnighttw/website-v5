"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import cn from "@/utils/cn";
import Viewer from "./image-viewer";

// Props type
interface ImageViewerProps {
	alt: string;
	src: string;
	[key: string]: string;
}

export default function ArticleImage(props: ImageViewerProps) {
	const t = useTranslations("Blog");
	const [fullscreen, setFullscreen] = useState(false);

	const ouo = () => {
		if (fullscreen) {
			document.body.classList.remove("overflow-hidden");
			setFullscreen(false);
		} else {
			document.body.classList.add("overflow-hidden");
			setFullscreen(true);
		}
	};

	// clean up the full screen when the component unmount
	useEffect(() => {
		return () => {
			if (fullscreen) {
				document.body.classList.remove("overflow-hidden");
				setFullscreen(false);
			}
		};
	});

	return (
		<>
			<span
				className="relative cursor-pointer hover:-translate-y-2 duration-200 group/image *:m-0 flex justify-center mt-8 overflow-hidden"
				onClick={ouo}
			>
				<Image
					className="object-cover rounded"
					{...props}
					alt={props.alt}
					quality={0}
				/>

				<span
					className={cn(
						"absolute insect-0 inline-flex items-center justify-center h-full",
					)}
				>
					<span className="opacity-0 group-hover/image:opacity-100 bg-bsecondary text-2xl py-4 px-12 rounded-full duration-200">
						{t("Click to view full image")}
					</span>
				</span>
			</span>
			{fullscreen && (
				<Viewer
					{...props}
					alt={props.alt}
					src={props.src}
					close={() => setFullscreen(false)}
				/>
			)}
		</>
	);
}
