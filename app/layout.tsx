import type { Metadata } from "next";
import "./global.css";
import { Theme } from "@radix-ui/themes";
import Avatar from "@/compoments/avatar";
import React from "react";
import Link from "next/link";

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
			<body className={`$antialiased`}>
				<Theme>
					<nav className="navbar">
						<div className="flex space-x-4 justify-center text-xl *:my-auto">

							<Link href="/">
								<Avatar
									src="https://avatars.githubusercontent.com/u/442641824"
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
						</div>
					</nav>

					{children}

					<footer className="part  border-t border-dot">
						<div className="w-full flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
							<span className="mr-auto">
								© {new Date().getFullYear()} bloodnighttw. All
								rights reserved.
							</span>

							<span>
								❤️ Made with Tailwind CSS, Next.js and MkBlog.
							</span>
						</div>
					</footer>
				</Theme>
			</body>
		</html>
	);
}
