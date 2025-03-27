import { ReactNode } from "react";

export default function ArticleCollection({ children }: { children: ReactNode }) {
	return (
		<div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-4 justify-between">
			{children}
		</div>
	)
}