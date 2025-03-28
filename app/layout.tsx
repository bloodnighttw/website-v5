import type { Metadata } from "next";
import "./global.css";
import Avatar from "@/compoments/avatar";
import React from "react";
import Link from "next/link";
import NavPanel from "@/compoments/panel/NavPanel";
import Footer from "@/compoments/panel/Footer";

export const metadata: Metadata = {
	title: "Welcome to bloodnighttw's blog",
	description: "A blog about programming, web development, linux, and more.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta httpEquiv="Delegate-CH" content="sec-ch-dpr https://bntw.dev; sec-ch-viewport-width https://bntw.dev"/>
			</head>
			<body className={`$antialiased`}>
				<NavPanel>
					<Link href="/">
						<Avatar
							src="https://avatars.githubusercontent.com/u/44264182"
							size={32}
							className="h-8 w-8 my-auto"
						/>
					</Link>

					<Link href="/">
						<div className="font-bold">bloodnighttw</div>
					</Link>
					<div className="mr-auto"></div>
					<div>
						wtf
					</div>
				</NavPanel>

				{children}

				<Footer>

					<div className="w-full flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
						<span className="mr-auto">
							© {new Date().getFullYear()} bloodnighttw. All
							rights reserved.
						</span>

						<span>
							❤️ Made with Tailwind CSS, Next.js and MkBlog.
						</span>
					</div>
				</Footer>

			</body>
		</html>
	);
}
