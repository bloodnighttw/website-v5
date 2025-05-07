import Image from "next/image";
import Link from "next/link";
import {
	Discord,
	Github,
	Mail,
	Telegram,
	Threads,
	Twitter,
} from "@/app/assets/svg";
import Avatar from "@/compoments/avatar";
import { svgUrl } from "@/utils/constant";
import { getTranslations } from "next-intl/server";
import TranslationWithIcon from "@/compoments/TranslationWithIcon";

export default async function Introducing() {

	const t = await getTranslations("Introducing");

	return (
		<div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center items-center lg:items-stretch">
			<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
				<div className="text-center text-xl lg:text-start">
					{t("hi")}
				</div>
				<p className="text-4xl lg:text-6xl font-bold my-1.5">
					{t("I'm")}	{t("name")}
				</p>
				<span className="font-mono typewriter">
					21 {t("age")} • Developer • Gamer{" "}
				</span>
				<TranslationWithIcon text={t("introducing")}
					icon={{
						"java" : <Image
							src={svgUrl.java}
							alt="Java"
							width={24}
							height={24}
						/>,
						"linux" : <Image
							src={svgUrl.linux}
							alt="Linux"
							width={24}
							height={24}/>,
						"react" : <Image
							src={svgUrl["react"]}
							alt="React"
							width={24}
							height={24}/>,
						"ts": <Image
							src={svgUrl.typescript}
							alt="TS"
							width={24}
							height={24}/>,
					}}
				/>

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
	);
}
