import Image from "next/image";
import { Github } from "@/app/assets/svg";
import { svgUrl } from "@/utils/constant";
import Link from "@/i18n/navigation";
import GlareCard, { GlareCardBorder } from "@/components/GlareCard";

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
			className="w-full h-full"
		>
			<GlareCard strength={1} className="bg-secondary/10 rounded-[calc(0.25rem+3px)] h-full">
				<GlareCardBorder className="rounded *:first:rounded-t *:last:rounded-b">
					<div className="p-4 from-bsecondary/90 to-bprimary/90 bg-gradient-to-br h-full">

						<div className="flex gap-2 items-start text-center">
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
						<p className="text-secondary mt-2">{props.description}</p>
					</div>
				</GlareCardBorder>
			</GlareCard>
		</Link>
	);
}
