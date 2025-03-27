import { ReactNode } from "react";

interface Props {
	children: ReactNode
}

export default function ProjectCollection(props: Props) {
	return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:items-center mt-6">
		{props.children}
	</div>
}