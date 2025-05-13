"use client";

import React, { useState, useEffect, useRef } from "react";
import cn from "@/utils/cn";

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	strength?: number;
}

export default function GlareCard(props: Props) {
	const [position, setPosition] = useState({ x: -1000, y: -1000 });
	const containerRef = useRef<HTMLDivElement>(null);
	const strength = props.strength ?? 0.5;

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();

			// Calculate mouse position relative to the container
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// stop tracking if the mouse position is too far away
			if(x < -rect.width || x > rect.width*2 || y > rect.height*2 || y < -rect.height) return;

			// Convert to percentage
			const xPercent = (x / rect.width) * 100;
			const yPercent = (y / rect.height) * 100;

			setPosition({ x: xPercent, y: yPercent });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative overflow-hidden",
				props.className
			)}
		>
			{/* Glare effect */}
			<div
				className="absolute w-full h-full pointer-events-none"
				style={{
					background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255, 255, 255, ${strength}) 0%, rgba(255, 255, 255, 0) 50%)`,
					mixBlendMode: "soft-light"
				}}
			/>

			{/* Content */}
			{props.children}
		</div>
	);
}