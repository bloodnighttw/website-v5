import Part from "@/components/shared/part";
import { getTranslations } from "next-intl/server";
import GlareCard from "@/components/shared/card/glare-card";
import { GlareCardBorder } from "@/components/shared/card/glare-card/border";
import Link from "next/link";
import TranslationWithIcon from "@/components/shared/TranslationWithJSX";
import Avatar from "@/components/modules/avatar";

// This is the section that is used to define the friends page.

interface Friend {
	// we will retrieve your avatar from the GitHub api by your username
	github: string;
	// your website link
	website?: string;
	descriptionEN: string;
	descriptionZH: string;
}

const friends: Friend[] = [
	{
		github: "bloodnighttw",
		website: "https://bntw.dev",
		descriptionEN: "I am a developer, I like to write code and play games.",
		descriptionZH: "我是一名開發者，我喜歡寫程式和玩遊戲。",
	},
	{
		github: "ayanamists",
		website: "https://ayayaya.org",
		descriptionZH:
			"我是 ayanamists，一个关注函数式编程、程序推导等 PL 技术的程序员。目前工作偏前端 / 客户端开发。喜欢折腾自部署服务。",
		descriptionEN:
			"I'm ayanamists, a programmer interested in programming language technologies such as functional programming and program derivation. Currently, I work mainly on frontend and native client development. I enjoy tinkering with self-hosted services and tools.",
	},
];

// The end of user defined section

interface FriendDetails extends Friend {
	avatar: string;
}

export const dynamicParams = false;

export async function generateStaticParams() {
	return [
		{
			name: "friends",
		},
	];
}

export default async function Friends() {
	const t = await getTranslations();
	const lang = t("lang");

	const friendsDetails: FriendDetails[] = await Promise.all(
		friends.map(async (friend) => {
			const fetchUrl = `https://api.github.com/users/${friend.github}`;
			const res = await fetch(fetchUrl, {
				next: { revalidate: 60 },
			});

			if (!res.ok) {
				throw new Error(
					"Failed to fetch data with name: " + friend.github,
				);
			}

			const data = await res.json();
			return {
				...friend,
				avatar: data.avatar_url,
			};
		}),
	);

	return (
		<Part>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{friendsDetails.map((friend) => (
					<Link href={friend.website!} key={friend.github}>
						<GlareCard
							strength={2}
							key={friend.github}
							className="rounded bg-bsecondary/60 h-full flex"
						>
							<GlareCardBorder className="flex flex-row gap-4 p-2">
								<div className="flex justify-center items-center">
									<Avatar
										src={friend.avatar}
										alt={friend.github}
										size={128}
									/>
								</div>
								<div className="flex flex-col gap-2 flex-1">
									<p className="text-3xl font-extrabold">
										{friend.github}
									</p>
									<p>
										{lang === "zh"
											? friend.descriptionZH
											: friend.descriptionEN}
									</p>
								</div>
							</GlareCardBorder>
						</GlareCard>
					</Link>
				))}
			</div>
			<TranslationWithIcon
				text={t("exchange friends here")}
				icon={{
					here: (
						<Link
							className="underline link"
							href={
								"https://github.com/bloodnighttw/website-v5/issues/40"
							}
						>
							{t("here")}
						</Link>
					),
				}}
			/>
		</Part>
	);
}
