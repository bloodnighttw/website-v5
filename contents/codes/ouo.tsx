"use client";
// since my project is using react server component,
// I need to use this to make it work

import { useState } from "react";

export default function OUO() {
	const [state, setState] = useState(0);

	return (
		<>
			<div className="mx-auto w-16 text-center">count:{state}</div>
			<div
				className="mx-auto border rounded w-16 text-center"
				onClick={() => setState(state + 1)}
			>
				count+1
			</div>
		</>
	);
}
