import Avatar from "@/compoments/avatar";
import contents from "@/utils/post";
import Card from "@/compoments/Card/Card";
import CardCollection from "@/compoments/Card/CardCollection";
import { CardTitle } from "@/compoments/Card/CardTitle";
import Linux from "@/app/assets/linux.svg"
import Java from  "@/app/assets/java.svg"
import React from "@/app/assets/react.svg"
import TypeScript from "@/app/assets/typescript.svg"
import { Discord, Github, Mail, Telegram, Threads, Twitter } from "@/app/assets/svg";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

	const posts = contents.posts;

	const metadataWithPreview: {
		title: string;
		preview: string;
		date: Date,
		slug: string
	}[] = []

	for (const post of posts) {
		const metadata = await post.metadata();
		const slug = post.slug;
		const preview = await post.previewImage() ?? "";
		metadataWithPreview.push({
			...metadata,
			preview,
			slug
		})
	}

	metadataWithPreview.sort((a, b) => b.date.getTime() - a.date.getTime());


	return (
		<>
			<div className="part bg-dotted min-h-[75vh] lg:min-h-[50vh] border-dot border-b border-dotted grid duration-1000">
				<div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center">
					<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
						<p className="text-center text-xl lg:text-start">
							👋 hi!
						</p>
						<p className="text-4xl lg:text-6xl font-bold">
							{"I'm bloodnighttw."}
						</p>
						<p className="font-mono">21 y/o • Developer • Gamer</p>
						<p className="introduction mt-4">
							I'm a developer who loves to create things.
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
						src="https://avatars.githubusercontent.com/u/44264182?s=460&u=b59e580f37ab7e6a3979ab8a6df1f12ba6588069&v=4"
						size={240}
						className="h-40 w-40 lg:h-60 lg:w-60 m-auto lg:mx-0"
					/>
				</div>
			</div>

			<div className="part border-b border-dot border-dotted *:not-first:mt-4">
				<h2>Blog Posts</h2>

				<CardTitle title="Recent Posts" />
				<CardCollection>
					{metadataWithPreview.slice(0,4).map((post, index)=> {
						// @ts-ignore
						return <Card key={index} href={"/blog/" + post.slug}>
							<Image src={post.preview} alt="preview" className="w-full h-36 object-cover" width={500} height={500}/>
							<p className="text-2xl font-bold">{post.title}</p>
						</Card>
					})}
				</CardCollection>
			</div>

			<div className="part border-b border-dot border-dotted">
				<h2>My Project.</h2>
			</div>
		</>
	);
}
