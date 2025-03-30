import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Image from "next/image";
import Part from "@/compoments/Part";
import HashTag from "@/compoments/HashTag";
import { Post } from "@/utils/contents/post";

interface Props{
	preview?: string,
	metadata: Post
}


export default function Panel({preview, metadata}: Props){
	return <div className="relative border-b border-dot">
		<SecondaryPanel className="h-full w-full absolute inset-0 -z-1"/>
		<Image
			className="absolute w-full h-full object-cover blur-sm opacity-0 lg:opacity-100 bg-image duration-200 -z-1"
			src={preview ?? ""}
			fill={true}
			alt="preview image"
			priority={true}
		/>

		<Part className="min-h-48 flex flex-col items-center justify-center font-sans">
			<p className="text-6xl w-full m-4">
				{metadata.title}
			</p>
			<div className="w-full text-xl flex gap-4 font-mono overflow-x-auto">
				{
					metadata.categories.map((category: string, index: number) => (
						<HashTag key={index} tags={category} />
					))
				}
			</div>
		</Part>
	</div>
}