import React from "react";

export default function HashTag({className, children}: {className?: string, children: React.ReactNode}) {
	return <div className={`hashtag ${className}`}>
		{children}
	</div>
}