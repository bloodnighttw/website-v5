import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export default function PlayGround({ children }: Props) {
	return (
		<div className="w-full bg-bsecondary/40 p-4 mb-8 rounded">
			{children}
		</div>
	);
}
