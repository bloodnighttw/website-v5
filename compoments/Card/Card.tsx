import Link from "next/link";
import Image from "next/image";

export default function Card({href, preview, title} : {href: URL | string, preview: string, title: string}) {
	return (
		<Link href={href}
			className="rounded basis-auto overflow-hidden border-[0.1px] border-bsecondary w-full *:not-first:mt-4 *:not-first:p-4 hover:scale-110 duration-200 bg-bprimary hover:z-[100]">
			<Image src={preview} alt="preview" className="w-full h-36 object-cover" height={144} loading="eager"/>
			<p className="text-2xl font-bold">{title}</p>
		</Link>
	)
}