import Link from "next/link";
import Image from "next/image";
import { Post } from "content-collections";

interface Props {
	info: Post;
}

export default function ArticleCard(props: Props) {
	return (
		<Link
			href={"/blog/" + props.info.slug}
			className="rounded group border border-bsecondary w-full duration-200 bg-bprimary hover:bg-bsecondary/20 hover:z-1 hover:-translate-y-1"
		>
			<Image
				src={props.info.preview ?? ""}
				alt="preview"
				width={2000} // for debug build use
				height={1600} // for debug build use
				quality={0} // for production use
				className="object-cover w-full h-40 border-b border-dot" //
				loading="eager"
			/>
			<p className="text-2xl font-bold py-4 px-2 group-hover:pl-3 duration-200">{props.info.title}</p>
		</Link>
	);
}

export function ArticleCards(props: { infos: Post[] }) {
	return props.infos.map((info) => (
		<ArticleCard info={info} key={info.slug} />
	));
}
