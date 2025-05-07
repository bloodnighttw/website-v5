"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {

	// make language switch will return to the original position
	useEffect(() => {
		const scrollPosition = sessionStorage.getItem('scrollPosition');

		if (scrollPosition) {
			// Scroll to the position
			window.scrollTo(0, parseInt(scrollPosition));

			sessionStorage.removeItem('scrollPosition');
		}
	}, []);

	return <div>{children}</div>
}