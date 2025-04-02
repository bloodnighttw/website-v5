import { ReactNode } from "react";

export default function ProjectChapter({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
			{children}
		</div>
	);
}
