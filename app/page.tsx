import Avatar from "@/compoments/avatar";
import contents from "@/utils/post";
import Card from "@/compoments/Card/Card";
import CardCollection from "@/compoments/Card/CardCollection";
import { CardTitle } from "@/compoments/Card/CardTitle";
import Image from "next/image";

export default async function Home() {

	const posts = contents.posts;

	const metadataWithPreview: {
		title: string;
		preview: string;
		date: Date
	}[] = []

	for (const post of posts) {
		const metadata = await post.metadata();
		const preview = await post.previewImage() ?? "";
		metadataWithPreview.push({
			...metadata,
			preview
		})
	}

	metadataWithPreview.sort((a, b) => b.date.getTime() - a.date.getTime());


	return (
		<>
			<div className="part bg-dotted min-h-[75vh] lg:min-h-[50vh] border-dot border-b border-dotted grid duration-1000">
				<div className="flex flex-col-reverse lg:flex-row lg:flex-none gap-4 w-full my-auto lg:text-start text-center">
					<div className="lg:ml-0 lg:mr-auto my-auto lg:w-[calc(100%-240px)] max-w-[48rem] mx-auto">
						<p className="text-center text-xl lg:text-start">
							👋 hi!
						</p>
						<p className="text-4xl lg:text-6xl font-bold">
							{"I'm bloodnighttw."}
						</p>
						<p>21 y/o, Developer, Gamer</p>
						<p className="mt-4 text-lg">
							Just a guy who loves to code and play games. I'm currently working on a few projects and learning new things.
						</p>
					</div>
					<Avatar
						src="https://avatars.githubusercontent.com/u/44264182?s=460&u=b59e580f37ab7e6a3979ab8a6df1f12ba6588069&v=4"
						size={240}
						className="h-40 w-40 lg:h-60 lg:w-60 m-auto lg:mx-0"
					/>
				</div>
			</div>

			<div className="part border-b border-dot border-dotted *:not-first:mt-4">
				<h2>Blog Posts</h2>

				<CardTitle title="Recent Posts" />
				<CardCollection>
					{metadataWithPreview.slice(0,4).map((post, index)=> {
						return <Card key={index}>
							<Image src={post.preview} alt="preview" className="w-full h-36 object-cover" width={500} height={500}/>
							<h4>{post.title}</h4>
						</Card>
					})}
				</CardCollection>
			</div>

			<div className="part border-b border-dot border-dotted">
				<h2>My Project.</h2>
			</div>
		</>
	);
}
