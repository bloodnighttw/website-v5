"use client";

import React, { useCallback, useEffect } from "react";
import Part from "@/components/shared/part";

import { TocTree } from "@/components/modules/posts/article/bottom-bar/toc-element";
import { useSetProgress } from "@/utils/hooks/progress";
import { useTranslations } from "next-intl";
import ButtomBar from "./bottom-bar";

interface LayoutProps {
	children: React.ReactNode;
	tocArray: TocTree[];
	publishAt: string;
}

export default function Page(prop: LayoutProps) {
	const ref = React.useRef<HTMLDivElement>(null);

	const t = useTranslations("Blog");
	const setProgress = useSetProgress();

	const handleProgress = useCallback(() => {
		if (!ref?.current) return;

		const rect = ref.current.getBoundingClientRect();

		// the height of the window
		const windowHeight = window.innerHeight;

		// this is the top position of the div
		const y = window.scrollY + rect.y;

		// this is the distance from the top of the window to the bottom of the div
		const translation = windowHeight - y;

		// the top position of the div
		const rectTop = rect.top;

		// the bottom position of the div
		const rectBottom = rect.bottom;

		// the distance from the top of the div to the bottom of the window
		const diff = Math.floor(windowHeight - rectTop - translation);

		const progressPercent = diff / (rectBottom - rectTop - translation);

		const progressValue =
			progressPercent > 1 ? 1 : progressPercent < 0 ? 0 : progressPercent;

		// the percentage of the div that is visible
		setProgress(Math.floor(progressValue * 100));
	}, [ref, setProgress]);

	useEffect(() => {
		handleProgress();

		window.addEventListener("scroll", handleProgress);
		return () => {
			window.removeEventListener("scroll", handleProgress);
		};
	}, [handleProgress]);

	return (
		<div ref={ref}>
			<Part className="bg-bprimary page-enter">
				<article>{prop.children}</article>
			</Part>
			<Part className="relative border-b border-dot bg-bsecondary/60 h-14">
				<div className="hidden sm:flex justify-start items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-clock"
						viewBox="0 0 16 16"
					>
						<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
						<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
					</svg>
					{t("published", { date: prop.publishAt })}
				</div>
				<ButtomBar tocArray={prop.tocArray} />
			</Part>
		</div>
	);
}
