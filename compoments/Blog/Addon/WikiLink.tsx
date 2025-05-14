import Link from "next/link";

export default function WikiLink(){
	return (
		<Link href="/wiki" className="text-primary hover:underline">
			testing
		</Link>
	);
}