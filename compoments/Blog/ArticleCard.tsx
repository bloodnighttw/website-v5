import Link from "@/i18n/navigation";
import Image from "next/image";
import { Post } from "content-collections";
import React from "react";
import cn from "@/utils/cn";
import GlareCard from "@/compoments/GlareCard";

interface Props {
	info: Post;
	index: number;
}

export default function ArticleCard(props: Props) {
	// Calculate delay with a maximum cap of 2 seconds
	const delay = Math.min(props.index * 0.075, 1.5);

	return (
		<Link
			href={"/blog/" + props.info.slug}
			style={{ "--stagger-delay": `${delay}s` } as React.CSSProperties}
		>
			<GlareCard strength={0.3} childrenClassName="*:bg-bprimary/40" className={cn(
				"w-full h-full duration-200 hover:delay-0 hover:z-1 hover:-translate-y-1",
				"card-start card stagger flex flex-col rounded",
				"bg-gradient-to-bl bg-bsecondary/40",
			)}>
				<Image
					src={props.info.preview ?? ""}
					alt="preview"
					width={2000} // for debug build use
					height={1600} // for debug build use
					quality={0} // for production use
					className="object-cover w-full h-40" //
					loading="eager"
				/>
				<p className="text-2xl font-bold p-2 group-hover:pl-3 duration-200">{props.info.title}</p>
			</GlareCard>
		</Link>
	);
}

export function ArticleCards(props: { infos: Post[] }) {
	return props.infos.map((info, index) => (
		<ArticleCard info={info} key={info.slug} index={index} />
	));
}
