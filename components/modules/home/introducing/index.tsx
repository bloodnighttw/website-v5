import Image from "next/image";
import Avatar from "@/components/modules/avatar";
import { svgUrl } from "@/utils/constant";
import { getTranslations } from "next-intl/server";
import TranslationWithIcon from "@/components/TranslationWithIcon";
import Typewriter from "@/components/modules/home/introducing/typewriter";
import SocialLink from "@/components/modules/home/introducing/link";

export default async function Introducing() {

	const t = await getTranslations("Introducing");

	return (
		<div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center items-center lg:items-stretch">
			<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
				<div className="text-center lg:text-start fade-in-up">
					{t("hi")}
				</div>
				<p className="text-4xl lg:text-6xl font-bold my-1.5 fade-in-up ">
					{t("I'm")}	<span className="red-gradient-text">{t("name")}</span>
				</p>

				<Typewriter>
					{`21 ${t("age")} • ${t("developer")} • ${t("gamer")} `}
				</Typewriter>

				<TranslationWithIcon text={t("introducing")}
					icon={{
						"java" : <Image
							src={svgUrl.java}
							alt="Java"
							width={28}
							height={28}
							priority={true}
						/>,
						"linux" : <Image
							src={svgUrl.linux}
							alt="Linux"
							width={28}
							height={28}
							priority={true}
						/>,
						"react" : <Image
							src={svgUrl["react"]}
							alt="React"
							width={28}
							height={28}
							priority={true}
						/>,
						"ts": <Image
							src={svgUrl.typescript}
							alt="TS"
							width={28}
							height={28}
							priority={true}
						/>,
					}}
				/>

				<SocialLink />

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
