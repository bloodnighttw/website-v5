import Image from "next/image";
import Part from "@/compoments/Part";
import { getTranslations } from "next-intl/server";
import GlareCard from "@/compoments/GlareCard";
import Link from "next/link";
import TranslationWithIcon from "@/compoments/TranslationWithIcon";



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
		website: "https://bloodnighttw.github.io",
		descriptionEN: "I am a developer, I like to write code and play games.",
		descriptionZH: "我是一名開發者，我喜歡寫代碼和玩遊戲。",
	}
]

// The end of user defined section

interface FriendDetails extends Friend{
	avatar: string;
}

export const dynamicParams = false;

export async function generateStaticParams(){
	return [{
		name: "friends"
	}]
}

export default async function Friends(){

	const t = await getTranslations();
	const lang = t("lang");

	const friendsDetails: FriendDetails[] = await Promise.all(
		friends.map(async (friend) => {
			const fetchUrl = `https://api.github.com/users/${friend.github}`;
			const res = await fetch(fetchUrl, {
				next: { revalidate: 60 },
			});

			if (!res.ok) {
				throw new Error("Failed to fetch data with name: " + friend.github);
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
			<div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
				{friendsDetails.map((friend) => (
					<Link href={friend.website!} key={friend.github}>

					<GlareCard strength={2} key={friend.github} className="rounded bg-bsecondary/60">
						<div className="m-4 flex gap-4">
							<Image src={friend.avatar} alt={friend.github} width={128} height={128} className="rounded-full block"/>
							<div className="flex flex-col gap-2">
								<p className="text-3xl font-extrabold">{friend.github}</p>
								<p>{lang === "zh" ? friend.descriptionZH : friend.descriptionEN}</p>
							</div>
						</div>
					</GlareCard>
					</Link>
				))}
			</div>
			<TranslationWithIcon text={t("exchange friends here")} icon={{
				here: <Link className="underline link" href={"https://github.com/bloodnighttw/website-v5"}>{t("here")}</Link>
			}}/>
		</Part>

	)
}