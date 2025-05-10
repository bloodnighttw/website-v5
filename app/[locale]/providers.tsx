'use client';

import { ProgressProvider } from '@bprogress/next/app';
import React, { useEffect } from "react";
import { Bar, Progress, useProgress } from "@bprogress/next";

const PopStateHandler = () => {

	// since useProgress is only available in ProgressProvider, we need to create
	// a empty component to use it1
	const { start } = useProgress();

	useEffect(() => {
		const handlePopstate = () => {
			console.log('popstate');
			start()
		}

		window.addEventListener('popstate', handlePopstate);

		return () => {
			window.removeEventListener('popstate', handlePopstate);
		}

	}, [start]);

	return null;
}

const Providers = ({ children }: { children: React.ReactNode }) => {


	return (
		<ProgressProvider
			options={{
				template:null
			}}
		>
			<PopStateHandler />
			<Progress>
				<Bar className="!bg-primary/60 !top-16"/>
			</Progress>
			{children}
		</ProgressProvider>
	);
};

export default Providers;