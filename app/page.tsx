import Avatar from "@/compoments/avatar";
import { getContentsInfo } from "@/utils/post";
import Card from "@/compoments/Card/Card";
import CardCollection from "@/compoments/Card/CardCollection";
import { CardTitle } from "@/compoments/Card/CardTitle";
import Linux from "@/app/assets/linux.svg"
import React from "@/app/assets/react.svg"
import Java from "@/app/assets/java.svg"
import TypeScript from "@/app/assets/typescript.svg"
import { Discord, Github, Mail, Telegram, Threads, Twitter} from "@/app/assets/svg";
import Image from "next/image";
import Link from "next/link";
import ScrollContainer from "@/compoments/Project/ScrollContainer";
import { getProjectInfo } from "@/utils/project";
import Display from "@/compoments/Project/Display";
import { svgUrl } from "@/utils/constant";

export default async function Home() {

	const metas = await getContentsInfo();
	const sortedByTime = metas.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
	const sortedByPin = sortedByTime.filter( it => it.pin )

	const project = await getProjectInfo();

	return (
		<>
			<div className="part bg-dotted min-h-[75vh] lg:min-h-[50vh] border-dot border-b grid duration-1000">
				<div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center">
					<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
						<div className="text-center text-xl lg:text-start">
							{"👋 hi!"}
						</div>
						<p className="text-4xl lg:text-6xl font-bold">
							{"I'm bloodnighttw."}
						</p>
						<span className="font-mono typewriter">21 y/o • Developer • Gamer </span>
						<p className="introduction mt-4">
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
						size={240}
						className="h-40 w-40 lg:h-60 lg:w-60 m-auto lg:mx-0"
					/>
				</div>
			</div>

			<div className="part border-b border-dot *:not-first:mt-4 gradient-background">
				<span></span>
				<span></span>
				<h2>Blog Posts</h2>

				{
					sortedByPin.length > 0 &&
					<CardTitle title="Pinned Posts"/>
				}

				{
					sortedByPin.map((post, index)=> {
						return <Card
							key={index}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})
				}

				<CardTitle title="Recent Posts" url={"/blog"}/>
				<CardCollection>
					{metas.slice(0,4).map((post, index)=> {
						return <Card
							key={index}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})}
				</CardCollection>
				<CardTitle title="About linux" url={"/tags/linux"}/>
				<CardCollection>
					{sortedByTime.filter((it) => it
						.categories.includes("linux"))
						.map((post, index)=> {
						return <Card
							key={index}
							href={"/blog/" + post.slug}
							preview={post.preview}
							title={post.title}
						/>
					})}
				</CardCollection>
			</div>

			<div className="part border-b border-dot">
				<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
					<h2>My Project.</h2>
					<ScrollContainer className="sm:ml-auto">
						{
							Object.values(svgUrl).map((it, index) => {
								return <div key={index}>
									<Image src={it} height={48} width={48} alt={"it"}/>
								</div>
							})
						}
					</ScrollContainer>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:items-center mt-6">
					{project.map((project)=> {
						return <Display
							key={project.name}
							name={project.name}
							description={project.description}
							link={project.link}
							stack={project.stack}
						/>
					})}
				</div>

			</div>
		</>
	);
}
