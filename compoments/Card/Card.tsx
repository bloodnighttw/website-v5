import Link from "next/link";

export default function Card({children, href} : {children: React.ReactNode, href: URL}) {
	return (
		<Link href={href}
			className="rounded basis-auto overflow-hidden border-[0.1px] border-bsecondary w-full *:not-first:mt-4 *:not-first:p-4 hover:scale-110 duration-200 bg-bprimary hover:z-[100]">
			{children}
		</Link>
	)
}