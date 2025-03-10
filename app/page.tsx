import Avatar from "@/compoments/avatar";

export default function Home() {
	return (
		<>
			<div className="part bg-dotted min-h-[75vh] md:min-h-[50vh] border-dot border-b border-dotted grid duration-1000">
				<div className="flex flex-col-reverse md:flex-row md:flex-none gap-12 w-full my-auto md:text-start text-center">
					<div className="md:ml-0 md:mr-auto my-auto md:w-[calc(100%-240px)] max-w-[48rem] ">
						<p className="text-center text-xl md:text-start">
							👋 hi!
						</p>
						<h1 className="text-center text-xl md:text-5xl md:text-start">
							{"I'm bloodnighttw."}
						</h1>
						<p>21 y/o, Developer, Gamer</p>
						<p className="mt-4 text-lg">
							224歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生24歲，是個學生4歲，是個學生
						</p>
					</div>
					<Avatar
						src="https://avatars.githubusercontent.com/u/44264182?s=460&u=b59e580f37ab7e6a3979ab8a6df1f12ba6588069&v=4"
						size={240}
						className="h-40 w-40 md:h-60 md:w-60 m-auto md:mx-0"
					/>
				</div>
			</div>

			<div className="part border-b border-dot border-dotted">
				<h2 className="text-2xl font-bold">Blog post</h2>
				<h1 className="text-xl">123</h1>
			</div>

			<div className="part border-b border-dot border-dotted">
				<h2 className="text-2xl font-bold">My Project.</h2>
				<h1 className="text-xl">123</h1>
			</div>
		</>
	);
}
