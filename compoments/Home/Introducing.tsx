import Image from "next/image";
import TypeScript from "@/app/assets/typescript.svg";
import React from "@/app/assets/react.svg";
import Java from "@/app/assets/java.svg";
import Linux from "@/app/assets/linux.svg";
import Link from "next/link";
import { Discord, Github, Mail, Telegram, Threads, Twitter } from "@/app/assets/svg";
import Avatar from "@/compoments/avatar";

export default function Introducing(){
	return <div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center items-center lg:items-stretch">
		<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
			<div className="text-center text-xl lg:text-start">
				{"👋 hi!"}
			</div>
			<p className="text-4xl lg:text-6xl font-bold">
				{"I'm bloodnighttw."}
			</p>
			<span className="font-mono typewriter">21 y/o • Developer • Gamer </span>
			<p className="introduction">
				{"I'm a developer who loves to create things."}
				Familiar with
				<Image src={TypeScript} alt="typescript"/>
				TypeScript,
				<Image src={React} alt="react.js"/>
				React, and
				<Image src={Java} alt="java"/>
				Java, and also a
				<Image src={Linux} alt="linux"/>
				linux lover.
			</p>
			<div className="flex gap-6 lg:gap-8 mt-6 justify-center lg:justify-start">

				<Link
					href="https://github.com/bloodnighttw"
					className="*:fill-secondary *:hover:fill-primary *:duration-200"
					aria-label="Github"
				>
					{Github}
				</Link>

				<Link
					href="https://threads.net/@bloodnighttw"
					className="*:fill-secondary *:hover:fill-primary *:duration-200"
					aria-label="Threads"
				>
					{Threads}
				</Link>

				<Link
					href="https://x.com/bloodnighttw"
					className="*:fill-secondary *:hover:fill-[#1da1f2] *:duration-200"
					aria-label="Twitter"
				>
					{Twitter}
				</Link>

				<Link
					href="https://discord.com/users/406274365857202196"
					className="*:fill-secondary *:hover:fill-[#7289da] *:duration-200"
					aria-label="Discord"
				>
					{Discord}
				</Link>

				<Link
					href="mailto:bbeenn1227@gmail.com"
					className="*:fill-secondary *:hover:fill-primary *:duration-200"
					aria-label="Email"
				>
					{Mail}
				</Link>

				<Link
					href="https://t.me/bntw0123"
					className="*:fill-secondary *:hover:fill-[#24A1DE] *:duration-200"
					aria-label="Telegram"
				>
					{Telegram}
				</Link>

			</div>
		</div>

		<Avatar
			src="https://avatars.githubusercontent.com/u/44264182"
			size={160}
			className="size-40 lg:size-60"
			priority={true}
		/>
	</div>
}