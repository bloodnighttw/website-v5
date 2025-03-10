import Avatar from "@/compoments/avatar";

export default function Home() {
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
							224歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生4歲，是個學生
						</p>
					</div>
					<Avatar
						src="https://avatars.githubusercontent.com/u/44264182?s=460&u=b59e580f37ab7e6a3979ab8a6df1f12ba6588069&v=4"
						size={240}
						className="h-40 w-40 lg:h-60 lg:w-60 m-auto lg:mx-0"
					/>
				</div>
			</div>

			<div className="part border-b border-dot border-dotted *:not-first:mt-2">
				<h2>Blog post</h2>
				<p>123</p>
			</div>

			<div className="part border-b border-dot border-dotted">
				<h2>My Project.</h2>
			</div>
		</>
	);
}
