import { ReactNode } from "react";
import Part from "@/components/shared/Part";

interface Props {
	children: ReactNode;
}

export default function Footer(props: Props) {
	return (
		<footer className="border-t border-dot">
			<Part>{props.children}</Part>
		</footer>
	);
}
