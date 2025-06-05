import Link from "@/i18n/navigation";
import {
	Discord,
	Github,
	Mail,
	Telegram,
	Threads,
	Twitter,
} from "@/app/assets/svg";

export default function SocialLink() {
	let index = 1;
	const offset = 75;

	return (
		<div className="flex gap-6 lg:gap-8 mt-6 justify-center lg:justify-start *:fade-in-up">
			<Link
				href="https://github.com/bloodnighttw"
				className="*:fill-secondary *:hover:fill-primary *:duration-200 "
				aria-label="Github"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Github}
			</Link>

			<Link
				href="https://threads.net/@bloodnighttw"
				className="*:fill-secondary *:hover:fill-primary *:duration-200 delay-200"
				aria-label="Threads"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Threads}
			</Link>

			<Link
				href="https://x.com/bloodnighttw"
				className="*:fill-secondary *:hover:fill-[#1da1f2] *:duration-200 delay-300"
				aria-label="Twitter"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Twitter}
			</Link>

			<Link
				href="https://discord.com/users/406274365857202196"
				className="*:fill-secondary *:hover:fill-[#7289da] *:duration-200 delay-400"
				aria-label="Discord"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Discord}
			</Link>

			<Link
				href="mailto:bbeenn1227@gmail.com"
				className="*:fill-secondary *:hover:fill-primary *:duration-200 delay-500"
				aria-label="Email"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Mail}
			</Link>

			<Link
				href="https://t.me/bntw0123"
				className="*:fill-secondary *:hover:fill-[#24A1DE] *:duration-200 delay-600"
				aria-label="Telegram"
				style={{ animationDelay: `${index++ * offset}ms` }}
			>
				{Telegram}
			</Link>
		</div>
	);
}
