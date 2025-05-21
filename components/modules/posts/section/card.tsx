import Link from "@/i18n/navigation";
import Image from "next/image";
import { Post } from "content-collections";
import React from "react";
import cn from "@/utils/cn";
import GlareCard from "@/components/shared/card/glare-card";
import { GlareCardBorder } from "@/components/shared/card/glare-card/border";

interface Props {
	info: Post;
	index: number;
}

export default function PostCard(props: Props) {
	// Calculate delay with a maximum cap of 2 seconds
	const delay = Math.min(props.index * 0.075, 1.5);

	return (
		<Link
			href={"/blog/" + props.info.slug}
		>
			<GlareCard strength={0.3} className={cn(
				"w-full h-full duration-200 hover:delay-0 hover:z-1 hover:-translate-y-1",
				"card-start card stagger flex flex-col rounded-[calc(0.25rem+3px)]",
				"bg-gradient-to-bl bg-bsecondary/50",
			)} style={{ "--stagger-delay": `${delay}s` } as React.CSSProperties}>
				<GlareCardBorder className="*:from-bprimary/50 *:to-bprimary/20 *:bg-gradient-to-br rounded *:first:rounded-t *:last:rounded-b *:not-first:mt-0.75">
					<Image
						src={props.info.preview ?? ""}
						alt="preview"
						width={2000} // for debug build use
						height={1600} // for debug build use
						quality={0} // for production use
						className="object-cover w-full h-40" //
						loading="eager"
					/>
					<p className="text-2xl font-bold p-2 duration-200 flex-1">{props.info.title}</p>
				</GlareCardBorder>
			</GlareCard>
		</Link>
	);
}

export function PostCards(props: { infos: Post[] }) {
	return props.infos.map((info, index) => (
		<PostCard info={info} key={info.slug} index={index} />
	));
}
