'use client';

import { ProgressProvider } from '@bprogress/next/app';
import React from "react";
import { Bar, Progress } from "@bprogress/next";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ProgressProvider
			options={{
				template:null
			}}
		>
			<Progress>
				<Bar className="!bg-primary/60 !top-16"/>
			</Progress>
			{children}
		</ProgressProvider>
	);
};

export default Providers;