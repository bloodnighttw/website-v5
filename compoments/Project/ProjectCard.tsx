import Image from "next/image";
import { Github } from "@/app/assets/svg";
import { svgUrl } from "@/utils/constant";
import Link from "next/link";

interface Props{
	name: string,
	description: string,
	link: string,
	stack: string[]
}


export default function ProjectCard(props: Props){

	const isGithub = props.link.startsWith("https://github.com/");

	return <Link
		href={"/project/"+props.name}
		className="rounded bg-dot/40 hover:bg-dot/60 p-4 duration-200 border border-dot/50 hover:border-dot"
	>

		<div className="flex gap-2 items-start text-center align-baseline">
			<div>
				{isGithub ? Github : <Image src={props.link} alt={props.name} width={24} height={24}/>}
			</div>
			<p className="text-xl font-mono">
				{props.name}
			</p>
			<div className="ml-auto"></div>

			{
				props.stack
					.filter(it => it in svgUrl)
					.map((stack)=> {
						return <Image key={stack} src={svgUrl[stack]} alt={stack} width={24} height={24}/>
					})
			}
		</div>
		<div className="flex mt-2 gap-2 rounded">
		</div>
		<p className="text-secondary mt-2">
			{props.description}
		</p>
	</Link>
}