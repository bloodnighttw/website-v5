import Link from "next/link";
import Image from "next/image";
import { Info } from "@/utils/contents/post";


interface Props {
	info: Info
}

export default function ArticleCard(props:Props) {

	return (
		<Link href={"/blog/"+props.info.slug}
			className="rounded basis-auto overflow-hidden border-[0.1px] border-bsecondary w-full *:not-first:mt-4 *:not-first:p-4 hover:scale-110 duration-200 bg-bprimary hover:z-[100]">
			<div className="relative h-36">
				{/* fill={true} will make component into absolute */}
				<Image src={props.info.preview} alt="preview" className="object-cover" fill={true} loading="eager"/>
			</div>
			<p className="text-2xl font-bold">{props.info.title}</p>
		</Link>
	)
}

export function ArticleCards(props: {infos: Info[]}) {
	return props.infos.map(info=><ArticleCard info={info} key={info.slug}/>)
}