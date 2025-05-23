"use client";

import { useEffect, useReducer } from "react";
import cn from "@/utils/cn";

interface Props {
	children: string;
}

function reducer(state: number, action: { length: number, id: NodeJS.Timeout }) {

	if (state >= action.length + 1) {
		clearInterval(action.id);
		return state;
	}

	return state + 1;
}

export default function Typewriter({children}: Props) {

	const [state, dispatch] = useReducer(reducer, 0);

	useEffect(() => {

		const length = children.length;
		const interval = setInterval(() => {
			dispatch({ length, id:interval });
		}, 50);

		return () => {
			clearInterval(interval);
		};
	}, [children.length, state]);



	return <div className="font-mono overflow-x-hidden text-nowrap pr-1 h-6 flex justify-center lg:justify-start fade-in">
		{	state !== 0 &&
			<span className="text-[16px] text-center">
				{children.slice(0, state)}
			</span>
		}
		<div className={cn(
			"typewriter h-full",
			state === children.length + 1 && "ml-2"
		)} />
	</div>
}