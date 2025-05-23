import DotBackground from "@/components/shared/dot-background";
import Image from "next/image";
import Part from "@/components/shared/part";
import HashTag from "@/components/modules/posts/hashtag";
import { Post } from "content-collections";

interface Props {
	content: Post;
}

export default function ArticleInfoPanel({ content }: Props) {
	return (
		<div className="relative border-b border-dot">
			<DotBackground className="h-full w-full absolute inset-0 -z-1" />
			<Image
				className="absolute w-full h-full object-cover blur-sm opacity-0 lg:opacity-100 bg-image duration-200 -z-1"
				src={content.preview ?? ""}
				fill={true}
				alt="preview image"
				priority={true}
				quality={0}
			/>

			<Part className="min-h-48 flex flex-col items-center justify-center font-sans">
				<p className="text-6xl w-full m-4 fade-in-up">{content.title}</p>
				<div className="w-full text-xl flex gap-4 font-mono overflow-x-auto overflow-y-hidden">
					{content.categories.map(
						(category: string, index: number) => (
							<HashTag key={index} tags={category} className="fade-in-up" style={{ animationDelay: `${index * 0.075}s` }}/>
						),
					)}
				</div>
			</Part>
		</div>
	);
}
