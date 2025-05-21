import { ReactNode } from "react";
import Part from "@/components/shared/Part";

interface Props {
	className?: string;
	children: ReactNode;
}

export default function NavBar(props: Props) {
	return (
		<nav className="bg-bprimary/50 backdrop-blur border-b border-dot sticky top-0 z-1">
			<Part>
				<div className="flex space-x-4 justify-center text-xl *:my-auto">
					{props.children}
				</div>
			</Part>
		</nav>
	);
}
