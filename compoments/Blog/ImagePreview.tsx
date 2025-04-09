"use client";

import React, { useCallback, useEffect, useState } from "react";
import cn from "@/utils/cn";

interface Props {
	src: string;
	alt: string;
	className?: string;
}

export default function ImagePreview(props: Props) {
	const [open, setOpen] = useState(false);
	const [scale, setScale] = useState(1);

	// Disable scrolling when open
	useEffect(() => {
		if (open) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => document.body.classList.remove("overflow-hidden");
	}, [open]);

	const handleOverlayClick = useCallback((e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setOpen(false);
			setScale(1);
		}
	}, [setOpen]);

	const handleImageClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setScale(scale === 1 ? 2 : 1);
	}, [scale]);

	return <>
		{open && (
			<div
				className={cn(
					"fixed inset-0 bg-bsecondary/50 backdrop-blur-md flex flex-col items-center justify-center z-100",
				)}
				onClick={handleOverlayClick}
			>
					<img
						src={props.src}
						alt={props.alt}
						className="max-w-[80%] max-h-[80%] shadow transition-transform duration-200"
						loading="lazy"
						style={{
							transform: `scale(${scale})`,
							transformOrigin: "center"
						}}
						onClick={handleImageClick}
					/>
				<div className="mt-4 text-sm text-gray-400">click image to zoom, click outside to close</div>
			</div>
		)}
		<div className="group">
			<img
				src={props.src}
				alt={props.alt}
				className={cn("cursor-pointer rounded mb-0", props.className)}
				onClick={() => setOpen(true)}
			/>
		</div>
		<div></div>
		<span className="text-lg text-secondary/70 text-center flex justify-center mt-1">{props.alt}</span>
	</>
}
