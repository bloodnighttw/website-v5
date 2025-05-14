import Link from "next/link";
import GlareCard from "@/compoments/GlareCard";

export default function WikiLink(){
	return (
		<Link href="/wiki" className="text-primary hover:underline w-12">
			<GlareCard className="w-96">

				testing
			</GlareCard>
		</Link>
	);
}