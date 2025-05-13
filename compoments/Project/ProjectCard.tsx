import Image from "next/image";
import { Github } from "@/app/assets/svg";
import { svgUrl } from "@/utils/constant";
import Link from "@/i18n/navigation";
import GlareCard from "@/compoments/GlareCard";

interface Props {
	name: string;
	description: string;
	link: string;
	stack: string[];
}

export default function ProjectCard(props: Props) {
	const isGithub = props.link.startsWith("https://github.com/");

	return (
		<Link
			href={"/project/" + props.name}
		>
			<GlareCard strength={1} className="rounded bg-secondary/20" childrenClassName="p-4 bg-gradient-to-br from-bprimary/90 to-bsecondary/90 gap-2" >
			<div className="flex gap-2 items-start text-center align-baseline">
				<span>
					{isGithub ? (
						Github
					) : (
						<Image
							src={props.link}
							alt={props.name}
							width={24}
							height={24}
						/>
					)}
				</span>
				<p className="text-xl font-mono align-text-bottom">{props.name}</p>
				<div className="ml-auto"></div>

				{props.stack
					.filter((it) => it in svgUrl)
					.map((stack) => {
						return (
							<Image
								key={stack}
								src={svgUrl[stack]}
								alt={stack}
								width={24}
								height={24}
							/>
						);
					})}
			</div>
			<div className="flex mt-2 gap-2 rounded"></div>
			<p className="text-secondary mt-2">{props.description}</p></GlareCard>
		</Link>
	);
}
