import Link from "next/link";
import GlareCard from "@/components/shared/card/glare-card";
import { GlareCardBorder } from "@/components/shared/card/glare-card/border";
import { allPosts } from "content-collections";
import Image from "next/image";

interface Props {
	link: string;
}

export default function WikiLink(props: Props) {

	const { link } = props;
	const post = allPosts.find((it) => it.slug === link);

	if (!post) return null;

	const { title, description, preview } = post;


	return (
		<div className="max-w-4xl">
			<Link href="/wiki" className="!no-underline">
				<GlareCard className="from-primary/40 to-primary/20 bg-gradient-to-br rounded-[calc(0.25rem+3px)] p-0">
					<GlareCardBorder>
						<div className="flex gap-1 justify-center items-center h-20 *:last:rounded-r *:bg-bprimary/70 *:h-20">
							<Image src={preview} alt={title} width={240} height={80} quality={0} className="object-cover hidden sm:block rounded-l"/>
							<div className="flex flex-col h-20 p-1 flex-1 sm:flex-auto rounded-l sm:rounded-none items-start">
								<div className="text-2xl line-clamp-3 sm:line-clamp-1">{title}</div>
								<div className="line-clamp-1 mt-auto text-secondary ">{description}</div>
							</div>
						</div>
					</GlareCardBorder>
				</GlareCard>
			</Link>
		</div>
	);
}